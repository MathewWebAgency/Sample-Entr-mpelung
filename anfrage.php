<?php
/**
 * REVIERKLAR: Anfrageformular
 *
 * Nimmt das Formular von index.html entgegen, prüft es und schickt es als
 * E-Mail an den Betrieb. Läuft auf jedem Hostinger-Paket mit PHP, ohne
 * Fremddienst und ohne Datenbank.
 *
 * Antwortet mit JSON, wenn die Seite per JavaScript sendet, und mit einer
 * Weiterleitung auf danke.html, wenn der Browser das Formular klassisch
 * abschickt (JavaScript aus).
 *
 * Vor dem Livegang: ABSENDER muss ein Postfach der eigenen Domain sein, das
 * in Hostinger angelegt ist. Mit einer fremden Adresse als Absender landen
 * die Mails bei GMX sonst im Spam oder werden abgewiesen.
 */

const EMPFAENGER = 'revierklar.nrw@gmx.de';
const ABSENDER   = 'anfrage@revierklar.de';
const ABSENDER_NAME = 'REVIERKLAR Website';

/** Höchstens so viele Anfragen pro Absender-IP in diesem Zeitfenster. */
const LIMIT_ANZAHL   = 5;
const LIMIT_SEKUNDEN = 600;

const ARTEN = [
    'Wohnung', 'Haus', 'Keller oder Dachboden', 'Garage oder Schuppen',
    'Gewerbe oder Büro', 'Nachlass', 'Etwas anderes',
];

/** Entfernt Steuerzeichen und kürzt. Zeilenumbrüche nur, wo erlaubt. */
function anfrage_feld(array $post, string $name, int $max, bool $mehrzeilig = false): string
{
    $wert = isset($post[$name]) && is_string($post[$name]) ? $post[$name] : '';
    $wert = str_replace("\r\n", "\n", $wert);
    $muster = $mehrzeilig ? '/[\x00-\x09\x0B-\x1F\x7F]/u' : '/[\x00-\x1F\x7F]/u';
    $wert = (string) preg_replace($muster, ' ', $wert);
    $wert = trim($wert);
    return mb_substr($wert, 0, $max, 'UTF-8');
}

/**
 * Prüft die Anfrage und verschickt sie über $senden.
 * Gibt ['ok' => bool, 'code' => int, 'fehler' => array, 'nachricht' => string] zurück.
 */
function anfrage_verarbeiten(array $post, array $server, callable $senden, callable $limit): array
{
    if (($server['REQUEST_METHOD'] ?? '') !== 'POST') {
        return ['ok' => false, 'code' => 405, 'fehler' => [], 'nachricht' => 'Bitte das Formular auf der Startseite verwenden.'];
    }

    // Honigtopf: Menschen sehen das Feld nicht, Bots füllen es aus.
    // Wir tun so, als sei alles gut gegangen, und schicken nichts.
    if (anfrage_feld($post, 'website', 200) !== '') {
        return ['ok' => true, 'code' => 200, 'fehler' => [], 'nachricht' => 'Danke!'];
    }

    $name      = anfrage_feld($post, 'name', 120);
    $email     = anfrage_feld($post, 'email', 200);
    $telefon   = anfrage_feld($post, 'telefon', 60);
    $art       = anfrage_feld($post, 'art', 60);
    $ort       = anfrage_feld($post, 'ort', 120);
    $nachricht = anfrage_feld($post, 'nachricht', 4000, true);
    $zustimmung = isset($post['datenschutz']) && $post['datenschutz'] !== '';

    $fehler = [];
    if ($name === '') {
        $fehler['name'] = 'Das brauchen wir, um Ihnen antworten zu können.';
    }
    if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $fehler['email'] = $email === ''
            ? 'Das brauchen wir, um Ihnen antworten zu können.'
            : 'Diese E-Mail-Adresse sieht nicht vollständig aus.';
    }
    if (!$zustimmung) {
        $fehler['datenschutz'] = 'Bitte kurz zustimmen, sonst dürfen wir Ihre Anfrage nicht bearbeiten.';
    }
    if (!in_array($art, ARTEN, true)) {
        $art = 'Etwas anderes';
    }
    if ($fehler) {
        return ['ok' => false, 'code' => 422, 'fehler' => $fehler, 'nachricht' => 'Da fehlt noch eine Angabe.'];
    }

    if (!$limit($server['REMOTE_ADDR'] ?? '')) {
        return ['ok' => false, 'code' => 429, 'fehler' => [],
            'nachricht' => 'Das waren gerade sehr viele Anfragen. Bitte rufen Sie uns an oder versuchen Sie es in ein paar Minuten noch einmal.'];
    }

    $zeilen = [
        'Neue Anfrage über die Website',
        '',
        'Name:       ' . $name,
        'E-Mail:     ' . $email,
        'Telefon:    ' . ($telefon !== '' ? $telefon : 'keine Angabe'),
        'Zu räumen:  ' . $art,
        'Ort:        ' . ($ort !== '' ? $ort : 'keine Angabe'),
        '',
        'Nachricht:',
        $nachricht !== '' ? $nachricht : 'Keine weitere Nachricht.',
        '',
        '--',
        'Auf diese E-Mail antworten geht direkt an ' . $email . '.',
    ];
    $betreff = 'Anfrage Besichtigung: ' . $art . ($ort !== '' ? ', ' . $ort : '');

    if (!$senden($betreff, implode("\n", $zeilen), $name, $email)) {
        return ['ok' => false, 'code' => 500, 'fehler' => [],
            'nachricht' => 'Das hat leider nicht geklappt. Bitte rufen Sie uns an oder schreiben Sie direkt an ' . EMPFAENGER . '.'];
    }

    return ['ok' => true, 'code' => 200, 'fehler' => [],
        'nachricht' => 'Danke! Ihre Anfrage ist angekommen. Wir melden uns am selben Werktag.'];
}

/** Verschickt die Mail mit PHP mail(). Header sind gegen Zeilenumbrüche abgesichert. */
function anfrage_mail_senden(string $betreff, string $text, string $name, string $email): bool
{
    $name = str_replace(['"', '\\'], '', $name);
    $kopf = [
        'From: ' . mb_encode_mimeheader(ABSENDER_NAME, 'UTF-8') . ' <' . ABSENDER . '>',
        'Reply-To: ' . mb_encode_mimeheader($name, 'UTF-8') . ' <' . $email . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: REVIERKLAR Anfrageformular',
    ];
    return mail(
        EMPFAENGER,
        mb_encode_mimeheader($betreff, 'UTF-8'),
        $text,
        implode("\r\n", $kopf),
        '-f' . ABSENDER
    );
}

/**
 * Einfache Bremse gegen Massenversand. Die IP wird nur gehasht gespeichert,
 * mit einem Salz, das täglich wechselt, und nach LIMIT_SEKUNDEN verworfen.
 */
function anfrage_limit_pruefen(string $ip): bool
{
    $datei = defined('ANFRAGE_LIMIT_DATEI') ? ANFRAGE_LIMIT_DATEI : sys_get_temp_dir() . '/revierklar-anfragen.json';
    $jetzt = time();
    $schluessel = hash('sha256', $ip . '|' . date('Y-m-d') . '|' . __FILE__);

    $fh = @fopen($datei, 'c+');
    if ($fh === false) {
        return true; // Ohne Schreibrecht lieber senden als echte Kunden abweisen.
    }
    flock($fh, LOCK_EX);
    $daten = json_decode((string) stream_get_contents($fh), true);
    $daten = is_array($daten) ? $daten : [];

    foreach ($daten as $k => $zeiten) {
        $daten[$k] = array_values(array_filter((array) $zeiten, function ($t) use ($jetzt) {
            return is_int($t) && $t > $jetzt - LIMIT_SEKUNDEN;
        }));
        if (!$daten[$k]) {
            unset($daten[$k]);
        }
    }

    $erlaubt = count($daten[$schluessel] ?? []) < LIMIT_ANZAHL;
    if ($erlaubt) {
        $daten[$schluessel][] = $jetzt;
    }

    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, (string) json_encode($daten));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $erlaubt;
}

if (defined('ANFRAGE_NUR_LADEN')) {
    return;
}

$ergebnis = anfrage_verarbeiten($_POST, $_SERVER, 'anfrage_mail_senden', 'anfrage_limit_pruefen');
$willJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if ($willJson) {
    http_response_code($ergebnis['code']);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($ergebnis, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($ergebnis['ok']) {
    header('Location: danke.html', true, 303);
    exit;
}

http_response_code($ergebnis['code']);
header('Content-Type: text/html; charset=utf-8');
$hinweise = $ergebnis['fehler'] ? array_values($ergebnis['fehler']) : [$ergebnis['nachricht']];
?><!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Anfrage nicht gesendet | REVIERKLAR</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<main class="legal"><div class="legal-in">
<h1>Fast geschafft.</h1>
<?php foreach ($hinweise as $h): ?>
<p><?= htmlspecialchars($h, ENT_QUOTES, 'UTF-8') ?></p>
<?php endforeach; ?>
<p>Gehen Sie bitte einen Schritt zurück, Ihre Eingaben sind meist noch da. Oder rufen Sie uns an: <a href="tel:+4917632078800">0176 32078800</a> oder <a href="tel:+4917645620735">0176 45620735</a>.</p>
<a class="legal-back" href="index.html#kontakt">Zurück zum Formular</a>
</div></main>
</body>
</html>
