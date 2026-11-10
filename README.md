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

Die Seiten laden nichts von anderen Anbietern, setzen keine Cookies und speichern nichts im Browser.
