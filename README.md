# Tarot Cup, Website

Website von https://tarot-cup.com, gebaut mit [Astro](https://astro.build) und veröffentlicht über GitHub Actions auf GitHub Pages. Deutsch ohne Vorsilbe, Türkisch unter `/tr/`, Englisch unter `/en/`, Spanisch unter `/es/`.

## Seiten

| Deutsch | Türkisch | Englisch | Spanisch | Inhalt |
|---|---|---|---|---|
| `/` | `/tr/` | `/en/` | `/es/` | Startseite |
| `/tarot/` | `/tr/tarot/` | `/en/tarot/` | `/es/tarot/` | Ratgeber Tarot |
| `/kaffeesatz-lesen/` | `/tr/kahve-fali/` | `/en/coffee-cup-reading/` | `/es/lectura-de-posos-de-cafe/` | Ratgeber Kaffeesatz |
| `/so-gehts/` | `/tr/nasil-kullanilir/` | `/en/how-it-works/` | `/es/como-funciona/` | Anleitung zur App |
| `/fragen/` | `/tr/sorular/` | `/en/faq/` | `/es/preguntas/` | häufige Fragen |
| `/ueber-tarot-cup/` | `/tr/hakkinda/` | `/en/about/` | `/es/acerca-de/` | Über die App |
| `/bildnachweis-und-lizenzen/` | `/tr/gorsel-kaynaklari-ve-lisanslar/` | `/en/image-credits-and-licenses/` | `/es/creditos-de-imagenes-y-licencias/` | Bildnachweis und Lizenzen |
| `/datenschutz/` | `/tr/gizlilik/` | `/en/privacy/` | `/es/privacidad/` | Datenschutzerklärung |
| `/nutzungsbedingungen/` | `/tr/kullanim-kosullari/` | `/en/terms/` | `/es/condiciones-de-uso/` | Nutzungsbedingungen |
| `/offenlegung/` | | | | Offenlegung nach § 25 Mediengesetz (nur Deutsch) |
| `/app/` | | | | Kurzlink zur App (alle Sprachen auf einer Seite) |

Frühere Fassungen der Rechtstexte stehen unter `/<text>/<fassung>/`, nur auf Deutsch und Türkisch. Englisch und Spanisch sind Übersetzungen zur Information und verlinken oben auf die maßgeblichen Fassungen. Dazu `sitemap.xml`, `robots.txt`, `404.html` (alle Sprachen) und `llms.txt` je Sprache (`/llms.txt`, `/tr/llms.txt`, `/en/llms.txt`, `/es/llms.txt`).

## Aufbau

- `src/daten/adressen.mjs`: Sprachen, Sprachnamen, `x-default` (Englisch) und die Adressen jeder Seite in jeder Sprache.
- `src/daten/seiten.mjs`: alle Seiten mit Adresse, Sprachfassungen (hreflang), Titel, Beschreibung und Brotkrumen; Seiten, Sitemap, `llms.txt` und Prüfungen lesen nur hier.
- `src/daten/seite.mjs`: Schalter für die Suche (`suche.freigegeben`) und den Store (`store.oeffentlich`).
- `src/daten/texte/`: alle Texte, Deutsch und Türkisch; Englisch und Spanisch in `src/daten/texte/uebersetzt/`, erzeugt mit `node tools/texte_einspielen.mjs` aus `deutung-unterlagen/uebersetzung/<en|es>/website/` (nicht von Hand ändern).
- `src/daten/app_daten.json`: Namen und Kurzbedeutungen aus den Daten der App (`tools/app_daten_exportieren.py`).
- `src/inhalte/recht/`: die Rechtstexte als Bausteine, Wortlaut unverändert aus den freigegebenen Fassungen.
- `tools/pruefe_bau.mjs`: Prüfungen, die am Ende jedes Baus laufen; ein Fund bricht den Bau ab (dazu hreflang gegenseitig, interne Links, deutsche Reste auf en und es, JSON-LD gegen `src/daten/schema_auszug.mjs`). Solange die Übersetzung durchgesehen wird, macht `UEBERSETZUNG_ENTWURF=1` die Wortprüfungen auf en und es zu Warnungen.

## Bauen

```
npm ci
npm run build
```

Ohne Zustimmung laden die Seiten nichts von anderen Anbietern und setzen keine Cookies. Im Browser gespeichert wird dann nur ein Eintrag: für welche Sprache die Sprach-Hinweisleiste geschlossen wurde (`localStorage`, Schlüssel `tarotcup-sprachhinweis`).

## Einwilligung und Statistik (W7)

Hinweis zur Einwilligung mit CookieConsent (`vanilla-cookieconsent` v3 aus npm, beim Bau gebündelt), Aufbau wie in der Datenschutzerklärung 1.4, Abschnitt 11: „Alle akzeptieren“ und „Ablehnen“ gleichwertig, dazu „Einstellungen“ mit „Notwendig“ (`cc_cookie`, 6 Monate) und „Statistik“. Erst mit Statistik lädt `src/components/Einwilligung.astro` den Google Tag Manager (`GTM-KHHHQ4ZK`) und sendet das Ereignis `einwilligung_statistik`, das im Container das Google-Tag der GA4-Property „Tarot Cup“ auslöst (Web-Datenstrom, Mess-ID `G-DZT3YDP3Q8`). Klicks auf ein Abzeichen von Google Play senden dann `store_klick` mit `sprache` und `ort` (`titelbild`, `fusszeile`, `app_seite`). Widerruf über „Cookie-Einstellungen“ in der Fußzeile: `_ga`-Cookies werden gelöscht, die Seite lädt neu. Texte je Sprache in `src/daten/einwilligung.mjs` (neue Sprache = neuer Eintrag), Stile in `src/styles/einwilligung.css`. `tools/pruefe_bau.mjs` (Regel 11) lässt Google nur in diesem einen Skript zu, `tools/browser_pruefen.mjs` prüft vor der Wahl, nach „Ablehnen“, nach „Alle akzeptieren“ und nach dem Widerruf.

## Sprach-Hinweisleiste

Ist die erste Browsersprache (`navigator.languages`) Deutsch, Türkisch, Englisch oder Spanisch, nicht die Sprache der Seite und gibt es die Seite in dieser Sprache, steht oben eine schmale Leiste in der Browsersprache mit Link auf dieselbe Seite in dieser Sprache (aus den hreflang-Fassungen in `src/daten/seiten.mjs`) und einem Knopf zum Schließen. Keine Weiterleitung. Das Skript im Kopf (`src/layouts/Basis.astro`) entscheidet vor dem ersten Zeichnen, die Leisten selbst stehen fertig im HTML (`src/components/Sprachhinweis.astro`, Texte in `src/daten/sprachhinweis.mjs`), deshalb springt beim Laden nichts. `tools/pruefe_bau.mjs` lässt im Speicher des Browsers nur genau diesen Schlüssel zu.
