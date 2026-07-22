# Entrümpelung Beispiel — Onepager

Statische Onepager-Website für ein Entrümpelungsunternehmen in Bochum.
Kein Build-Tool, kein Framework — HTML, CSS und Vanilla-JS, direkt per FTP deploybar.

```
index.html        Hauptseite (Onepager)
css/style.css     Alle Styles
js/main.js        Interaktion + Scroll-Animationen
assets/img/       Vorher/Nachher-Illustrationen (SVG-Platzhalter)
impressum.html    Platzhalter-Rechtsseite
datenschutz.html  Platzhalter-Rechtsseite
```

## Design-Entscheidungen

**Referenzen:** Square (squareup.com) und Starwave Podcast (Framer) wurden analysiert und
auf ein bodenständiges Handwerksunternehmen übersetzt — nicht kopiert.

- **Von Square:** Vollbild-Hero mit riesiger, gebrochener Headline direkt auf dem Bild;
  Eyebrow-Labels über jeder Section; große Statistik-Zahlen als eigenes Gestaltungselement;
  große Abschluss-Headline („Weg damit.") als Kontakt-Einstieg; viel Weißraum.
- **Von Starwave:** Ticker-Marquee unter dem Hero; nummerierte Leistungsliste (01–06) statt
  Icon-Cards; dunkle Kontrast-Sections; FAQ-Accordion; gestaffelte Scroll-Reveals.
- **Eigene Übersetzung ins Thema:** Die Utility-Ebene der Seite spricht „Lieferschein":
  Space Mono für Nummern, Labels und m³-Angaben (Inventarlisten-Ästhetik), Warnstreifen
  in Orange/Schwarz als Container-Zitat, die Festpreis-„Formel" als Mono-Block.
- **Farbwelt:** Off-White `#F2EFE9`, Fast-Schwarz `#141414`, Signal-Orange `#FF4D00`
  (Container/Baustelle). Zwei dunkle Anthrazit-Sections als Kontrastblöcke. Keine Verläufe.
- **Typografie:** Archivo Black (Display) + Archivo (Text) + Space Mono (Utility).
  Bewusst eine schwere Grotesk statt Serif — handfest statt boutique.
- **Kein Three.js:** Der Wow-Moment ist als gepinnte GSAP-Sequenz umgesetzt (s. u.).
  Eine generische 3D-Szene hätte dem Thema nichts hinzugefügt, wohl aber Ladezeit und
  Mobile-Risiko. So bleibt das Lighthouse-Ziel (90+ mobil) realistisch.

### Der Wow-Moment: „Der Raum leert sich"

Die Section `#raum` wird beim Scrollen gepinnt (~300 % Scrollstrecke). Item-Karten
(Sofa, Schrankwand, Kartons …) fliegen nacheinander in 3D aus dem Viewport, ein
m³-Zähler zählt parallel auf 0,0 herunter, dann erscheint „Besenrein." — die
Kernleistung der Firma als Animation. Scrub-basiert, kein Scroll-Hijacking:
Die Scrollrichtung bleibt jederzeit unter Kontrolle der Nutzer.

### Bewegung & Zugänglichkeit

- GSAP + ScrollTrigger + Lenis per CDN (`defer`), nur `transform`/`opacity` animiert.
- `prefers-reduced-motion` wird vollständig respektiert: Lenis aus, keine Pins,
  statische Endzustände (Klasse `static-mode`). Testbar auch per URL-Parameter:
  `index.html?static`.
- Mobil: verkürzte Raum-Sequenz (5 statt 8 Karten), Ablauf vertikal statt horizontal gepinnt.
- Galerie: echte Vorher/Nachher-**Slider** (unsichtbarer Range-Input steuert einen
  `clip-path` über die CSS-Variable `--pos`) — ohne Library, per Tastatur bedienbar
  (Pfeiltasten), funktioniert auch im statischen Modus und ohne GSAP.
- Die Slider-Motive sind bewusst **Illustrationen** (`assets/img/*.svg`): Vorher und
  Nachher zeigen garantiert denselben Raum aus derselben Perspektive — mit Stockfotos
  wäre das nicht möglich und der Vergleich unglaubwürdig. Beim Livegang durch echte
  Fotopaare ersetzen (beide Aufnahmen vom selben Standpunkt!).
- Ohne JavaScript bleibt die Seite vollständig lesbar (Animationen sind reine Aufwertung).

## Zu ersetzende Platzhalter

| Platzhalter | Wo |
|---|---|
| `[FIRMENNAME]` | index.html (JSON-LD, Footer), impressum.html, datenschutz.html |
| `[TELEFONNUMMER]` + `tel:+49XXXXXXXXXX` | Header/Hero/Kontakt/Footer, JSON-LD |
| `[E-MAIL-ADRESSE]` | Kontakt, Footer, JSON-LD, Rechtsseiten |
| `info@entruempelung-beispiel.de` | js/main.js (mailto-Empfänger des Formulars) |
| `https://wa.me/49XXXXXXXXXX` | Kontakt-Section (WhatsApp-Link) |
| `[STRASSE HAUSNUMMER]`, `[PLZ]` | Footer, JSON-LD, Rechtsseiten |
| `https://www.entruempelung-beispiel.de/` | `<head>` (og:url, JSON-LD url) |
| Unsplash-Bilder | Hero + Karten der Raum-Section — durch eigene Fotos ersetzen |
| SVG-Illustrationen (`assets/img/`) | Galerie-Slider — durch echte Vorher/Nachher-Fotopaare ersetzen (gleicher Standpunkt, gleiche Brennweite) |
| Impressum / Datenschutz | Komplette Texte einsetzen (Generator oder Rechtsberatung) |
| Öffnungszeiten Mo–Sa 07–19 Uhr | Hero-Note, Kontakt, JSON-LD — anpassen falls abweichend |

**Hinweis DSGVO:** Google Fonts und die CDN-Skripte werden aktuell von externen Servern
geladen. Für maximale Rechtssicherheit vor dem Livegang lokal einbinden (Fonts
herunterladen, GSAP/Lenis als Dateien in `js/` legen) und die Datenschutzerklärung
entsprechend anpassen.

## Deployment auf Hostinger (FTP)

1. Im Hostinger hPanel unter **Dateien → FTP-Konten** die Zugangsdaten anlegen/ablesen
   (Host, Benutzername, Passwort, Port 21).
2. Mit einem FTP-Programm (z. B. FileZilla) verbinden.
3. In das Verzeichnis **`public_html`** wechseln.
4. Den kompletten Projektinhalt hochladen — `index.html`, `impressum.html`,
   `datenschutz.html` sowie die Ordner `css/`, `js/` und `assets/` (Struktur beibehalten).
5. Domain aufrufen und einmal komplett durchscrollen (Desktop + Handy).

Alternativ geht auch der **Dateimanager im hPanel** (Upload als ZIP, dort entpacken).

## Lokal testen

Einfach `index.html` im Browser öffnen — oder mit lokalem Server:

```
python3 -m http.server 4173
```

Dann http://localhost:4173 aufrufen.
