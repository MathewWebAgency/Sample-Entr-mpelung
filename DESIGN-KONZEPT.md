# REVIERKLAR — Design-Konzept

Stand vor dem Bau. Der Skill verlangt die Freigabe dieses Dokuments, bevor Credits
oder Code fließen.

---

## 1. Die These

Hier räumt jemand aus dem Revier für das Revier. Man sieht auf dieser Seite echte
Bochumer Keller, keine amerikanischen Wohnzimmer aus einer Bilddatenbank, und man
sieht sie in dem Zustand, in dem sie wirklich waren.

Das ist der entscheidende Unterschied zur alten Seite. Die V1 war handwerklich gut,
stand aber auf Unsplash-Fotos mit Kamin und Designersofa. Die neue Seite steht auf
zwei echten Fotos aus einem echten Auftrag.

## 2. Was aus der V1 verschwindet

| Raus | Warum |
|---|---|
| Alle Unsplash-Bilder | Amerikanische Innenräume, erkennbar Stock, das Gegenteil von „aus dem Revier" |
| Der Ticker-Marquee | Laufband ohne Inhalt, ein Baukasten-Reflex |
| „500+ Entrümpelungen" | Unbelegte Zahl. Kommt nur zurück, wenn der Betrieb sie wirklich nachweisen kann |
| Google-Fonts- und jsdelivr-CDN | Schriften und Bibliotheken kommen lokal ins Projekt |
| Die acht fliegenden Möbelkarten | Der Wow-Moment stand auf Stockfotos. Ersetzt durch echtes Material |
| SVG-Illustrationen im Vergleich | Ersetzt durch die echten Kellerfotos |
| `[FIRMENNAME]`, `[TELEFONNUMMER]` | Der Kunde heißt jetzt REVIERKLAR und hat echte Daten |

## 3. Typografie

| Rolle | Schrift | Quelle | Warum |
|---|---|---|---|
| Display | **Cabinet Grotesk**, Extrabold | Fontshare | Schwere, leicht schmale Grotesk mit eigenwilligen Details. Steht neben der Wortmarke REVIERKLAR, ohne sie zu kopieren oder ihr Konkurrenz zu machen. |
| Fließtext | **General Sans** | Fontshare | Ruhig, sehr gut lesbar, keine Meinung. Trägt die Erklärtexte. |
| Label / Mono | **IBM Plex Mono** | Google Fonts | Liest sich wie Maschinendokumentation. Trägt Kubikmeter, Containergrößen, Entsorgungsnachweis, Termine. |

Alle drei lokal als woff2, `font-display: swap`, Preload für Display und Text.
Keine der drei steht auf der Sperrliste des Skills.

Die Schreibschrift aus dem Logo („Aus dem Revier. Für das Revier.") bleibt Teil der
Wortmarke und wird **nicht** als Webschrift nachgebaut. Schreibschrift im Browser
wirkt fast immer billiger als im Logo und ist schlecht lesbar.

## 4. Farbe

Hergeleitet aus dem Logo, nicht aus einer Palette. Die Grünwerte werden aus der
Logodatei gemessen, sobald sie vorliegt; die Zeile unten ist bis dahin geschätzt.

```
--klar          #F4F5F2   Fläche, kühles Betonweiß (bewusst kein Creme)
--beton-hell    #DDE0DA   zweite Fläche für abgesetzte Blöcke
--kohle         #1C1E1B   Text und dunkle Sektionen (nie reines Schwarz)
--revier        (aus Logo) Akzent, das Logogrün
--revier-tief   (abgeleitet) dunklere Variante für Text auf hellem Grund
--beton         #8A8E88   Linien, Sekundärtext, aus den Grautönen der Skyline
```

Fünf bis sechs Töne, keine Verläufe. Kontraste werden gegen WCAG AA geprüft. Das
Logogrün ist auf Weiß mit hoher Wahrscheinlichkeit zu hell für Fließtext, deshalb
die dunklere Zweitvariante für alles, was gelesen werden muss.

## 5. Das Signature-Element

**Erstens: die Kante auf einem echten Foto.**
Der Hero ist eines der beiden Kellerfotos. Beim Scrollen wandert eine Kante durchs
Bild und legt denselben Keller leer und gefegt frei. Echt an den Scroll gekoppelt,
gepinnt. Das Nachher-Bild wird bei Kie aus genau diesem Foto erzeugt, damit die
Perspektive stimmt. Es sind also die einzigen generierten Pixel auf der ganzen Seite,
und sie zeigen nichts, was es nicht gab: denselben Raum, leer.

**Zweitens: die vier Haken vom Transporter.**
Auf der Logo-Seitenwand stehen vier Haken: ENTRÜMPELN, ENTSORGEN, AUFLÖSEN,
BESENREIN. Das ist bereits der Rhythmus des Betriebs, und er wird zum Rückgrat der
Seite. Beim Durchscrollen hakt sich einer nach dem anderen ab. Kein erfundenes
01/02/03, sondern die Gliederung, die der Kunde sich selbst gegeben hat.

## 6. Sektionsfolge

| # | Sektion | Was sie leistet |
|---|---|---|
| 1 | Hero mit der Kante | Echter Keller, echtes Vorher/Nachher, die These in einem Bild |
| 2 | Die vier Haken | ENTRÜMPELN · ENTSORGEN · AUFLÖSEN · BESENREIN als Statusleiste |
| 3 | Was wir räumen | Die vier Leistungen aus dem Logo, als Liste statt Icon-Kacheln |
| 4 | Vorher / Nachher | Das zweite Kellerfoto als Regler, vom Besucher selbst gezogen |
| 5 | Ablauf | Besichtigung, Festpreis, Räumung. Linie zeichnet sich beim Scrollen |
| 6 | Festpreis | Die Einwand-Sektion: keine Nachforderung, Nachweis, Steuervorteil |
| 7 | Einzugsgebiet | Bochum und das Revier, konkret aufgezählt |
| 8 | Häufige Fragen | Aus den echten Einwänden |
| 9 | Kontakt | Der eine Call to Action |

## 7. Der Call to Action

**„Kostenlose Besichtigung."** Telefon zuerst, Formular als zweiter Weg. In dieser
Branche wird angerufen.

## 8. Asset-Plan

| Asset | Herkunft | Kosten |
|---|---|---|
| Logo | vom Kunden | 0 |
| Kellerfoto 1 (Werkstatt) | echtes Kundenfoto | 0 |
| Kellerfoto 2 (Regal) | echtes Kundenfoto | 0 |
| Nachher zu Foto 1 | Kie, `nano-banana-2`, Bildbearbeitung aus genau diesem Foto | ~12 Credits |
| Nachher zu Foto 2 | Kie, ebenso | ~12 Credits |

**Rund 25 bis 50 Credits** inklusive Re-Rolls. Das ist ein Bruchteil des letzten
Projekts, weil fast alles echt ist.

Kein generierter Innenraum, keine generierten Menschen, keine Stockfotos.

## 9. Was ich vom Kunden brauche

1. Firmenname vollständig, Rechtsform, Inhaber
2. Anschrift, Telefonnummer, E-Mail
3. Handelsregister und Umsatzsteuer-ID fürs Impressum
4. Einsatzgebiet: welche Städte wirklich
5. Öffnungs- oder Erreichbarkeitszeiten
6. Belegbare Zahlen, falls die „500+" wieder auf die Seite sollen
7. Schriftliche Freigabe des Kunden, dessen Keller auf den Fotos zu sehen ist
8. Wohin Formularanfragen gehen sollen
