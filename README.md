# REVIERKLAR — Entrümpelung & Haushaltsauflösung, Bochum

Statisches HTML, CSS und Vanilla-JS, kein Build-Schritt, direkt per FTP deploybar.

```
index.html          Onepager
css/style.css       Tokens und alle Sektionen
js/main.js          Hero-Choreografie, Regler, Fragen, Formular
assets/fonts/       Cabinet Grotesk, General Sans, lokal
assets/img/         Logo und die Kellerfotos
assets/js/          GSAP, ScrollTrigger, Lenis, lokal statt CDN
impressum.html      datenschutz.html
robots.txt          sitemap.xml
DESIGN-KONZEPT.md   Das Konzept vor dem Bau
_review/            Rohdateien und Zwischenstände. Gehört nicht auf den Server.
```

## Farbe

Aus der Logodatei gemessen, nicht geschätzt. Das dominante Grün im Logo ist
`#447D1B` über rund 25.000 Pixel, das Schwarz `#1A1C1E`, das Skyline-Grau `#5B5B5C`.

```
--klar        #F4F5F2   Fläche
--klar-tief   #E4E6E1   zweite Fläche
--kohle       #1A1C1E   Text und dunkle Sektionen, aus dem Logo
--revier      #447D1B   Logogrün, für große Schrift und Flächen
--revier-tief #37650F   für kleine Schrift auf hellem Grund
--revier-hell #6FB53C   für Schrift auf dunklem Grund
--beton       #5B5B5C   Sekundärtext, aus der Skyline im Logo
```

Das Logogrün schafft auf `--klar` 4,58:1 und reicht damit für Fließtext. Auf der
etwas dunkleren zweiten Fläche `--klar-tief` fällt es auf 4,0:1, deshalb gibt es
`--revier-tief` für kleine Schrift. Auf dunklem Grund kommt `--revier-hell` mit 6,8:1.

## Typografie

| Rolle | Schrift | Warum |
|---|---|---|
| Display | **Cabinet Grotesk**, 800 | Schwere Grotesk, steht neben der Wortmarke REVIERKLAR ohne ihr Konkurrenz zu machen |
| Fließtext | **General Sans** | Ruhig, gut lesbar, hält sich raus |

Alle drei liegen lokal als woff2 im Projekt. Kein Google-CDN, anders als in der alten
Fassung. Keine der drei steht auf der Sperrliste des Agentur-Skills.

**Im Header steht das echte Logo**, als Ausschnitt ohne die Schreibschriftzeile:
Skyline, Haus, Transporter und die Wortmarke. Ein Ausschnitt der Wortmarke allein geht
nicht, weil der Transporter im Logo die Oberkante von „KLAR" überlappt; jeder
rechteckige Schnitt nimmt ein Stück Stoßstange mit. Ein Versuch, das per Bildbearbeitung
zu entfernen, hat das „L" aus ENTRÜMPELUNG gelöscht und wurde verworfen.

**Deshalb steht der Header dauerhaft auf hellem Grund.** Das Logo ist auf Weiß
gezeichnet und braucht ihn. Die weiße Fläche wird per `mix-blend-mode: multiply`
aufgelöst, sodass das Logo direkt auf der Seitenfarbe sitzt. Eine zweite, ausgeknockte
Logofassung für dunklen Grund gibt es nicht; falls sie kommt, kann der Header wieder
über dem Hero transparent werden.

## Der Moment, den man sich merkt

Beim Scrollen wandert eine grüne Kante durch das echte Kellerfoto und legt denselben
Raum leergeräumt frei. Echt an den Scroll gekoppelt und gepinnt, auf dem Desktop über
220 Prozent Scrollstrecke, auf Schmalgeräten über 150 Prozent, damit die Bewegung dort
nicht den halben Daumen kostet.

Eine frühere Fassung hatte auf Schmalgeräten statt der Animation nur einen Umschalter,
und der stand versehentlich auf `display: none`. Auf dem Handy passierte dadurch gar
nichts. Jetzt läuft überall dieselbe Animation. Der Umschalter bleibt nur für den
statischen Modus, also bei reduzierter Bewegung oder ohne JavaScript.

Eine frühere Fassung hatte darunter noch eine Leiste mit vier Haken aus dem Logo, die
sich abhakten. Die ist auf Wunsch wieder raus, ebenso die kleinen Zwischenüberschriften
über den Sektionen. Beides las sich zu sehr nach Baukasten. Die Sektionen führen jetzt
direkt mit ihrer Überschrift.

Im Ablauf fährt ein grüner Balken die Schiene links hinunter und schaltet die Marken
um, an denen er vorbeikommt. Reine `transform`-Bewegung, an den Scroll gekoppelt.

## Bilder

Alle Aufnahmen sind echt. Die beiden Vorher-Fotos stammen aus einem abgeschlossenen
Auftrag und werden mit Einverständnis der Eigentümer gezeigt.

Die beiden Nachher-Ansichten wurden bei Kie.ai mit `nano-banana-2` aus genau dem
jeweiligen Vorher-Foto erzeugt: gleicher Raum, gleiche Kameraposition, leergeräumt.
Nur so stimmt die Perspektive. Im Nachher-Bild des Werkstattkellers stehen dieselbe
Werkbank, dieselbe Leuchtstoffröhre, dasselbe Kellerfenster und derselbe feuchte Fleck
unter der Fensterbank wie im Original.

**Das steht auch auf der Seite.** Im Footer und im Impressum ist offen benannt, dass
die Nachher-Ansichten Visualisierungen sind. Sobald eigene Fotos vom Endzustand
vorliegen, werden sie ersetzt. Das ist der einzige ehrliche Weg, die Bilder als Beleg
zu zeigen.

Fremdmarken auf den Verpackungen wurden bewusst nicht retuschiert. Beiläufige
Verpackungen in einer echten Reportageaufnahme sind normal, und jede Retusche hätte die
KI-Optik zurückgebracht, die hier vermieden werden soll.

Aus dem Nachher-Bild des Regalkellers wurde die lange weiße Latte entfernt, die schräg
über dem Regal lehnte. Sie wäre bei einer Räumung mit herausgetragen worden, also gehört
sie nicht ins Ergebnisbild.

Das Logo im Markenblock ist die vom Kunden gelieferte saubere Fassung ohne Icon-Reihe.

Kie-Verbrauch: 48 Credits. Zwei Nachher-Bilder, eine Latten-Retusche, dazu ein
verworfener Versuch, die Wortmarke zu säubern.

## Bewegung

- Ein Auftritt pro Moment, nicht ein Effekt pro Element.
- Nur `transform` und `opacity`. Zwei bewusste Ausnahmen: der Schnitt im Hero läuft über
  `clip-path`, das Aufklappen der Fragen über `grid-template-rows`. Öffnen dauert 280ms,
  Schließen 200ms, weil die absichtliche Bewegung langsamer sein darf als die Antwort.
- Die Kante wandert per `transform`, nicht per `left`, und das Custom Property `--wipe`
  sitzt am Bild statt am Elternknoten, damit nicht der ganze Hero-Teilbaum pro Frame
  neu berechnet wird. Die Strichlänge der Haken steht in CSS, pro Frame ändert sich nur
  der Versatz.
- Bewegung im Hover nur hinter `@media (hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion` nimmt die Bewegung heraus, lässt Farb- und Deckkraftwechsel
  stehen. Testbar auch über `index.html?static`.
- Im statischen Zustand, also bei reduzierter Bewegung und ohne JavaScript, steht der
  Hero fest auf halbem Weg: links der geräumte Keller, rechts der volle, dazwischen die
  grüne Kante. Das ist ein Bild, das sich selbst erklärt. Der frühere Umschalter
  „Nachher ansehen" ist entfallen, er war ein sichtbarer Notbehelf für einen Fall, den
  fast niemand sieht. Die Werte für diesen Zustand stehen im CSS, nicht im Skript,
  damit keine Inline-Styles dagegenhalten.
- Ohne JavaScript bleibt die Seite vollständig lesbar, die Antworten der Fragen stehen
  dann offen.
- Kein Null-Offset-Glühen. Der Detektor hatte es an der Kante gefunden, es ist raus.
- Jedes drückbare Element hat ein `:active`-Feedback mit `scale(0.97)`. Auf Touch gibt es
  kein Hover, ohne das fühlt sich nichts an. Kam aus dem Review mit Emils Skill.
- Die Kurven sind `cubic-bezier(0.23, 1, 0.32, 1)` und `cubic-bezier(0.77, 0, 0.175, 1)`.
  Die eingebauten CSS-Easings und auch meine erste Fassung waren zu weich.

## Formular

Es gibt kein Backend. Das Formular baut eine `mailto`-Nachricht an
revierklar.nrw@gmx.de, öffnet das Mailprogramm des Besuchers und sagt genau das auch
dazu. Für den Livegang genügt es, `action` auf einen Formulardienst zu setzen.

## Vor dem Livegang zu ergänzen

1. **Telefonnummer.** Fehlt komplett. In dieser Branche wird angerufen, das ist die
   größte offene Lücke. Sobald sie da ist, gehört sie in den Header, in den Hero, in den
   Kontaktblock, ins Impressum und ins JSON-LD.
2. **Rechtsform und Vertretungsberechtigter** fürs Impressum
3. **Handelsregister und Registernummer**, falls eingetragen
4. **Umsatzsteuer-Identifikationsnummer** nach § 27 a UStG
5. **Die echte Domain** in `canonical`, den og-Tags, `robots.txt`, `sitemap.xml` und im
   JSON-LD. Aktuell steht überall `revierklar.de` als Annahme.
6. **Erreichbarkeitszeiten**, falls sie genannt werden sollen
7. **Eigene Fotos vom Endzustand**, um die beiden Visualisierungen zu ersetzen
8. **Belegbare Zahlen**, falls Referenzen oder Auftragszahlen auf die Seite sollen

## Prüfungen

- `npx impeccable detect` läuft ohne inhaltliche Befunde. Es bleiben Meldungen zu
  Innenabständen, die nachgemessen falsch sind, eine zu `overflow-x: clip` am `body`,
  das seitliches Scrollen durch den gepinnten Hero verhindert, und zwei zu
  Versalschrift. Letztere betreffen die Zeile unter der Wortmarke und den Claim, die
  beide die Setzung des Kundenlogos wiedergeben.
- Animationen gegen Emils Design-Skill und die zehn Standards aus `review-animations`
  geprüft. Kein `transition: all`, kein `ease-in` auf UI, kein `scale(0)`, keine
  Keyframes auf schnell ausgelösten Elementen, Hover-Bewegung nur mit echtem Zeiger,
  asymmetrisches Auf- und Zuklappen.
- Einen Skill namens „Taste" gibt es auf diesem Rechner nicht. Installiert sind nur
  `impeccable` und `find-skills`. Falls er nachinstalliert wird, gehört er hier in die
  Prüfkette.
- Kein horizontaler Überlauf bei 375px. Tap-Ziele mindestens 44px, Zustimmungshaken 24px.
- Alle Bilder mit Alt-Text, alle Formularfelder beschriftet, Überschriftenfolge ohne
  Sprünge.
- Lighthouse konnte nicht laufen, weil auf diesem Rechner kein Chrome installiert ist
  (`brew install --cask google-chrome`).

## Lokale Vorschau

```bash
node ../_review/serve.mjs
```

Danach http://localhost:4173 öffnen.

## Überarbeitung: KI-Muster entfernt

Die Seite hatte noch mehrere Muster, die typisch für generierte Websites sind.
Entfernt wurden:

- **IBM Plex Mono komplett.** Die Schrift lief als Kostüm für „technisch“ über
  Formularlabels, Nummern und Etiketten, ohne dass es hier Code oder Messwerte
  gibt. Labels sind jetzt General Sans in normaler Schreibung. Die Schriftdateien
  liegen außerhalb des Deploy-Stands unter `_review/unbenutzt/`.
- **Graue Unterzeilen unter den Überschriften** (Vergleich, Festpreis, Gebiet,
  Kontakt). Wo sie echte Information trugen, steht die jetzt an der Stelle, an
  der man sie braucht: die Bildherkunft unter dem Bild, „Ihr Ort fehlt?“ unter
  der Ortsliste, „Wir melden uns am selben Werktag“ am Absendeknopf.
- **Nummerierungen** 01 bis 06 bei den Leistungen und „Schritt 01“ im Ablauf.
  Die Reihenfolge zeigt die Schiene, die Leistungen haben keine.
- **Vorher/Nachher-Etiketten auf dem Foto.** Sie stehen jetzt als ruhige Zeile
  unter dem Bild.
- **Die Preisformel im Mono-Kasten** und die grünen Deko-Quadrate über den
  Festpreis-Punkten. Die vier Punkte stehen als 2×2 mit einer Linie darüber.
- **Der Kasten mit Anschrift, Einsatzgebiet und Antwortzeit** im Kontakt.
  Die Anschrift steht als normaler Text unter der E-Mail.
- **Zwei Beschriftungen für dieselbe Absicht.** Header und Hero führen jetzt
  beide über das Wort „Besichtigung“ zum Kontakt.

Die Texte sind in einem Durchgang wärmer geworden, vor allem dort, wo sie
vorher mit Seitenhieben auf die Konkurrenz gearbeitet haben.

## Hero heller, Header ab dem ersten Scrollen

- **Header:** Auf der Startseite ist der Header im ersten Bildschirm
  ausgeblendet. Nach 48 px Scrollweg, also sobald die Wisch-Animation anläuft,
  fährt er ein. Ein IntersectionObserver beobachtet dafür einen kleinen Marker
  am Dokumentanfang, nicht den Hero, weil der während der Animation gepinnt ist.
  Kein Scroll-Listener. Ohne JavaScript
  bleibt der Header stehen, per Tastatur taucht er sofort auf (`:focus-within`).
  Auf Impressum und Datenschutz ist er wie bisher immer sichtbar.
- **Hellere Hero-Bilder:** Die beiden Kellerfotos sind in den Dateien selbst
  aufgehellt (Gamma, per ffmpeg), nicht per CSS-Filter, weil ein Filter bei
  jedem Frame der Wisch-Animation neu gerechnet würde. Das Nachher-Bild ist
  bewusst etwas heller als das Vorher-Bild, damit die Kante beim Wischen als
  „es wird hell“ wirkt. Originale unter `_review/original-hero/`.
- **Verlauf:** Die Abdunklung sitzt nur noch dort, wo Text steht, die obere
  Bildhälfte ist frei. Die Lesbarkeit hält ein weicher Textschatten.
- **Bildgrößen:** Die große Fassung ist 1050 px breit, dazu eine 750er fürs
  Handy. Das `srcset` hatte vorher fälschlich 1400w angegeben.

## Telefon, WhatsApp, Header-Logo

- **Telefon:** 0176 32078800 (Hauptnummer, Anruf-Knopf im Hero) und
  0176 45620735. Beide stehen im Kontakt, im Footer, im Impressum, in der
  Datenschutzerklärung und im JSON-LD (`telephone`).
- **WhatsApp:** Ein schlichter `wa.me`-Link auf die Hauptnummer, mit
  vorausgefülltem Text, wie auf der Agenturseite. Kein Widget und kein Skript
  von Meta, beim Seitenaufruf entsteht keine Verbindung zu WhatsApp. Eigener
  Absatz in der Datenschutzerklärung.
- **Icons:** WhatsApp aus Simple Icons, Telefon aus Phosphor (Bold), beide
  inline, damit sie die Textfarbe übernehmen.
- **Header-Logo:** `logo-header.png` ist fest auf die Headerfarbe `#F4F5F2`
  multipliziert. Das vorherige `mix-blend-mode: multiply` wurde beim
  Einfahren des Headers neu berechnet und konnte kurz Lücken zeigen. Der
  Header ist außerdem vorab als Ebene angelegt (`will-change: transform`).
  Wird die Headerfarbe je geändert, muss das Logo neu gerechnet werden.
  Die Fassung vor der Umrechnung liegt unter `_review/`.
- **FAQ im JSON-LD** ist jetzt wortgleich mit den sichtbaren Antworten.

## Anfrageformular (echt, PHP)

Das Formular schickt an `anfrage.php`, das die Anfrage prüft und per PHP
`mail()` an revierklar.nrw@gmx.de schickt. Kein Fremddienst, keine Datenbank.

- **Mit JavaScript:** Versand im Hintergrund, Knopf zeigt „Wird gesendet …“,
  danach eine Dankesmeldung an der Stelle des Formulars. Fehler erscheinen
  direkt am Feld.
- **Ohne JavaScript:** klassischer Versand, danach `danke.html`.
- **Schutz:** Honigtopf-Feld gegen Bots, höchstens 5 Anfragen pro Anschluss
  in 10 Minuten (IP nur gehasht, verfällt), Pflichtfelder und E-Mail werden
  auf dem Server erneut geprüft, Header gegen Zeilenumbruch-Einschleusung
  abgesichert, „Zu räumen“ nur aus der festen Liste.
- **Antworten:** Die Mail hat `Reply-To` auf den Kunden, „Antworten“ im
  Postfach geht also direkt an ihn.

**Vor dem Livegang in Hostinger:**
1. Ein Postfach auf der eigenen Domain anlegen, z. B. `anfrage@revierklar.de`,
   und genau diese Adresse oben in `anfrage.php` als `ABSENDER` eintragen.
   Mit einer fremden Absenderadresse landen die Mails bei GMX im Spam.
2. Einmal selbst eine Testanfrage schicken und prüfen, dass sie ankommt,
   auch im Spam-Ordner nachsehen.

Getestet wurde die Logik mit PHP 8.5 (WebAssembly, `npx @php-wasm/cli`):
Pflichtfelder, ungültige E-Mail, fehlende Zustimmung, Honigtopf, Limit,
Header-Einschleusung, manipulierte Auswahl, gescheiterter Versand. Den
tatsächlichen Mailversand kann nur der Server bei Hostinger testen.

Lokal kann der Vorschauserver kein PHP. `_review/serve.mjs` hat dafür eine
Attrappe von `anfrage.php`, die wie das echte Skript antwortet.

## Knöpfe und Formen

Knöpfe sind Pillen (`--r-knopf: 999px`), Eingabefelder weich gerundet
(`--r-feld: 12px`), Bilder und Flächen bleiben eckig. Im Hero stehen unter
„Kostenlose Besichtigung“ beide Telefonnummern als Paar, unter 360 px
Breite untereinander.

## Vorher/Nachher-Regler

Gezogen wird über Pointer Events auf dem Bild, nicht mehr über den nativen
Schieberegler, der auf dem Handy nur auf den Knopf reagierte. `touch-action:
pan-y` lässt senkrechtes Scrollen durch. Auf Touch springt die Kante nicht
schon beim Aufsetzen, sondern folgt erst beim waagerechten Ziehen oder beim
kurzen Antippen. Weitere Finger werden ignoriert. Der native Regler bleibt
unsichtbar für Tastatur und Screenreader.

## Flüssig am Desktop: nur noch transform

Beide Vergleiche (Hero und Regler) schneiden das Bild nicht mehr mit
`clip-path` zu. Stattdessen fährt ein Rahmen mit `overflow: hidden` herein und
das Bild darin genau gegenläufig, sodass es an seinem Platz stehen bleibt. Der
Browser verschiebt pro Frame nur Ebenen, statt das Foto neu zu zeichnen.
`clip-path` hatte am Desktop mit hoher Pixeldichte geruckelt, weil jedes Frame
ein Foto von fast 2000 × 1600 Pixeln neu gezeichnet hat. Die Trennlinie des
Reglers ist eine Ebene über die volle Breite, deren rechte Kante die Linie ist,
also ebenfalls nur `transform` statt `left`. Mausbewegungen werden auf einen
Frame gebündelt, der Rahmen wird einmal pro Zug gemessen.

Die Hero-Fotos gibt es jetzt in 750, 1050 und 1536 px Breite, gerechnet aus
den höher aufgelösten Quellen (Kundenfoto 1536 × 2048, Visualisierung
1792 × 2400), mit leichter Entrauschung vor dem Aufhellen. Am Desktop lädt
die 1536er-Fassung, vorher wurde ein 1050er-Bild doppelt hochgezogen.

## Tablet, Cache, Touch-Schwelle

- **Versionsnummern:** `css/style.css?v=JJJJMMTT` und `js/main.js?v=JJJJMMTT`
  in allen HTML-Dateien und in `anfrage.php`. Bei jeder Änderung an CSS oder
  JS das Datum überall hochzählen, sonst mischen Browser neue HTML mit alter
  CSS aus dem Cache. Genau das hat zweimal wie ein kaputter Regler ausgesehen.
- **Navigation:** Braucht rund 820 px. Unter 896 px (56rem) ist sie
  ausgeblendet, Logo und „Besichtigung“ bleiben. Links trennen nie mehr
  (`white-space: nowrap`, `hyphens: none`).
- **Hero ab Tablet:** Mehr Abstand unter den Telefonnummern
  (`clamp(4rem, 11vh, 8rem)`), das Foto läuft sichtbar weiter.
- **Regler auf Touch:** Folgt erst, wenn der Finger eindeutig waagerecht zieht
  (dx > 6 px und dx > dy). Ohne waagerechten Zug zählt es als Antippen und
  springt an die Stelle, auch wenn der Finger dabei leicht wackelt.
