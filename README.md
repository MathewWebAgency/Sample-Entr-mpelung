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

## Anfrageformular (Formspree)

Das Formular schickt an Formspree (`https://formspree.io/f/mwlpgjlr`), Formspree
stellt die Anfrage per E-Mail zu. `anfrage.php` und `danke.html` sind entfernt.

- **Mit JavaScript:** Versand im Hintergrund mit `Accept: application/json`,
  Knopf zeigt „Wird gesendet …“, danach eine Dankesmeldung an der Stelle des
  Formulars. Feldfehler von Formspree erscheinen auf Deutsch direkt am Feld.
- **Ohne JavaScript:** klassischer Versand, danach die Dankeseite von Formspree.
- **Felder:** `_subject` setzt den Betreff, `_gotcha` ist das Fangfeld gegen
  Bots, `email` wird von Formspree automatisch als Antwortadresse genutzt.
- **Betrieb:** Das Formular liegt im Formspree-Konto von Mathew WebAgency, die
  Anfragen werden an Pedro Trujillo und Adem Varli weitergeleitet. So steht es
  auch in der Datenschutzerklärung. Zwischen RevierKlar und Mathew WebAgency
  sollte dafür ein Vertrag zur Auftragsverarbeitung bestehen.
- **Test:** Im lokalen Test wurde `fetch` durch eine Attrappe mit echten
  Formspree-Antworten ersetzt, damit keine Test-Mails beim Kunden landen.
  Nach dem Livegang einmal echt absenden und den Eingang prüfen.

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
  in allen HTML-Dateien. Bei jeder Änderung an CSS oder
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

## Großes Logo im Hero, Header erst nach der Animation

- **Start:** Das Logo steht groß und freigestellt auf dem Foto
  (`logo-hero-660/1155.webp`, transparenter Grund). Freigestellt wurde nur der
  äußere Hintergrund und die Buchstaben-Innenräume, Transporter und Hauswand
  bleiben weiß. Der Schriftzug „Wir schaffen Platz im Revier.“ ist
  herausgeschnitten, er steht direkt darunter als Überschrift. Gleicher
  Ausschnitt wie `logo-header.png`, damit beide deckungsgleich sind.
  Freistellungs-Rohdaten unter `_review/logo-hero/`.
- **Andocken:** Im letzten Drittel der Hero-Animation (64 bis 98 %) schrumpft
  das Logo und gleitet exakt auf die Stelle des Header-Logos. Dabei blendet der
  helle Grund ein (70 bis 90 %). Gemessen mit `offset*`-Werten bei jedem
  Refresh, Abweichung unter 1 px auf allen getesteten Größen.
- **Header:** Während des ganzen Hero ausgeblendet (`opacity: 0`, nicht
  klickbar), auch der Knopf „Besichtigung“. Er blendet ein, wenn die Animation
  bei 99,5 % ist, gekoppelt an den Fortschritt der Zeitleiste, nicht an die
  Scrollposition. Im statischen Modus erscheint er, wenn der Hero aus dem Bild
  ist. Auf Impressum, Datenschutz und Danke-Seite ist er immer sichtbar.
- **Höhe:** Logo-Breite und Hero-Überschrift sind zusätzlich an der
  Bildschirmhöhe begrenzt, damit sich auf flachen Laptops nichts überlappt.
- **Telefonknöpfe:** P. Trujillo (0176 32078800, links) und A. Varli
  (0176 45620735, rechts). Am Desktop steht der Name neben, auf dem Handy unter
  der Nummer. Im Kontaktbereich und im Footer stehen die Namen ebenfalls bei
  den Nummern.

## Rechtliches, Stand Oktober 2026

- **Rechtsform:** RevierKlar NRW GbR, vertreten durch die Gesellschafter
  Pedro Trujillo und Adem Varli.
- **USt-IdNr.:** beantragt, wird nach Erteilung im Impressum ergänzt.
- **EU-Plattform zur Online-Streitbeilegung:** abgeschaltet seit Juli 2025,
  der Hinweis darauf ist entfernt. Die Erklärung zur Verbraucherschlichtung
  bleibt.
- **§ 18 Abs. 2 MStV:** entfernt, gilt nur für journalistisch-redaktionelle
  Angebote.
- **KI-Visualisierungen:** Hinweis kurz im Footer, unter dem Vergleichsregler
  und ausführlich im Impressum. Seit August 2026 verlangt die KI-Verordnung
  (Art. 50) eine Kennzeichnung KI-erzeugter Bilder, die echte Orte zeigen, und
  ohne Hinweis wäre ein Nachher-Bild als Leistungsnachweis irreführend (UWG).
  Mit echten Fotos vom Endzustand fällt der Hinweis weg.
- **Footer:** „© [Jahr] RevierKlar NRW GbR · Realisiert von Mathew WebAgency“, das Jahr setzt ein Einzeiler am Seitenende automatisch (Grundwert 2026 ohne JavaScript)
  mit Link auf mathew-webagency.de, auf allen Seiten.

## SEO (Stand Oktober 2026)

Geprüft nach dem Skill `seo-technisch`. Dessen Prüfskripte und Vorlagen fehlen
in der Installation, die Prüfungen wurden nach seinen Kriterien selbst gebaut.

- **Domain:** `https://revierklar.de/` ohne www. Canonical, OG, JSON-LD,
  robots.txt und Sitemap zeigen darauf. `.htaccess` leitet http und www per
  301 in einem Schritt auf diese Adresse, `/index.html` auf `/`.
- **Keyword-Landkarte:** Eine URL, ein Suchintent (Kontakt/Beauftragung).
  Haupt: Entrümpelung Bochum. Neben: Haushaltsauflösung Bochum,
  Kellerentrümpelung Bochum, Entrümpelung Festpreis.
- **Title** 53 Zeichen, **Description** 151 Zeichen. Die `h1` ist der Satz
  „Entrümpelung und Haushaltsauflösung in Bochum und im Revier.“, der Slogan
  darüber ist ein `p` im großen Schriftbild.
- **JSON-LD:** `WebSite` und `LocalBusiness`/`HomeAndConstructionBusiness` mit
  Adresse, Koordinaten (OpenStreetMap), beiden Kontaktpersonen, Einsatzgebiet
  und Leistungen; dazu `FAQPage` wortgleich mit der Seite. Keine Bewertungen,
  keine Öffnungszeiten, kein Preisrahmen, weil dazu nichts bekannt ist.
- **Adresse:** „Westenfelder Straße 4“ (OpenStreetMap), vorher stand dort
  „Westenfelder 4“. Muss zeichengleich im Google-Unternehmensprofil stehen.
- **Bilder:** sprechende Namen, WebP mit JPG-Rückfall, Breite/Höhe überall.
  Das Nachher-Foto im Hero lädt erst nach dem Laden oder beim ersten Scrollen.
- **Schriften:** auf Latein beschnitten (30 und 28 KB). Metrisch angepasste
  Ersatzschriften (Arial mit size-adjust), damit beim Schriftwechsel nichts
  springt.
- **Hero-Auftritt** in CSS statt GSAP, damit die Überschrift (LCP-Element)
  nicht auf das JavaScript wartet. Start bei 1 % Deckkraft, weil Chrome
  Elemente mit 0 nicht als sichtbar zählt.
- **Favicons** aus dem Haus im Logo: `favicon.ico`, `favicon-32.png`,
  `apple-touch-icon.png`, `icon-192/512.png`, `site.webmanifest`.
- **Vorschaubild** `og-revierklar.jpg` 1200 × 630.
- **.htaccess:** Komprimierung, Cache je Dateityp (HTML immer frisch),
  HSTS, nosniff, X-Frame-Options, Referrer- und Permissions-Policy, 404-Seite.

**Lighthouse, mobil, lokal gemessen (4. Oktober 2026):**

| Messart | Leistung | Barrierefreiheit | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| echte Drosselung (devtools) | 99 | 100 | 100 | 100 | 1,7 s | 0 |
| Hochrechnung (simulate) | 90 | 100 | 100 | 100 | 3,6 s | 0 |
| Desktop | 98 | 100 | 100 | 100 | 1,1 s | 0 |

Die Hochrechnung ist gegen einen lokalen Server verzerrt (alles wird in den
ersten Millisekunden angefragt). Nach dem Livegang mit PageSpeed Insights
gegen die echte Domain nachmessen.

HTML: `html-validate` ohne Befund. Alle internen Verweise vorhanden, alle
externen Links 200.

**Nach dem Livegang, von Hand:**
1. Live-Prüfung `pruefe_live.sh https://revierklar.de` (Hostinger-Skill).
2. Google Search Console: Domain-Property bestätigen, Sitemap einreichen.
3. Bing Webmaster Tools: aus der Search Console importieren.
4. Google-Unternehmensprofil anlegen oder angleichen: RevierKlar NRW GbR,
   Westenfelder Straße 4, 44866 Bochum, 0176 32078800, Website revierklar.de.
5. JSON-LD im Rich-Results-Test von Google prüfen (geht nur live).
6. PageSpeed Insights gegen revierklar.de laufen lassen.
