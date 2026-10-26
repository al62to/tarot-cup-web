# Tarot Cup, Website

Website von https://tarot-cup.com, gebaut mit [Astro](https://astro.build) und veröffentlicht über GitHub Actions auf GitHub Pages. Deutsch ohne Vorsilbe, Türkisch unter `/tr/`.

## Seiten

| Deutsch | Türkisch | Inhalt |
|---|---|---|
| `/` | `/tr/` | Startseite |
| `/tarot/` | `/tr/tarot/` | Ratgeber Tarot |
| `/kaffeesatz-lesen/` | `/tr/kahve-fali/` | Ratgeber Kaffeesatz |
| `/so-gehts/` | `/tr/nasil-kullanilir/` | Anleitung zur App |
| `/fragen/` | `/tr/sorular/` | häufige Fragen |
| `/ueber-tarot-cup/` | `/tr/hakkinda/` | Über die App |
| `/bildnachweis-und-lizenzen/` | `/tr/gorsel-kaynaklari-ve-lisanslar/` | Bildnachweis und Lizenzen |
| `/datenschutz/`, `/nutzungsbedingungen/` | `/tr/gizlilik/`, `/tr/kullanim-kosullari/` | Rechtstexte, jede Fassung unter `/<text>/<fassung>/` |
| `/offenlegung/` | | Offenlegung nach § 25 Mediengesetz |
| `/app/` | | Kurzlink zur App |

Dazu `sitemap.xml`, `robots.txt`, `llms.txt` und `tr/llms.txt`.

## Aufbau

- `src/daten/seiten.mjs`: alle Seiten mit Adresse, Gegenseite, Titel, Beschreibung und Brotkrumen; Seiten, Sitemap, `llms.txt` und Prüfungen lesen nur hier.
- `src/daten/seite.mjs`: Schalter für die Suche (`suche.freigegeben`), den Store (`store.oeffentlich`) und das iPhone (`ios`).
- `src/daten/texte/`: alle Texte, Deutsch und Türkisch.
- `src/daten/app_daten.json`: Namen und Kurzbedeutungen aus den Daten der App (`tools/app_daten_exportieren.py`).
- `src/inhalte/recht/`: die Rechtstexte als Bausteine, Wortlaut unverändert aus den freigegebenen Fassungen.
- `tools/pruefe_bau.mjs`: Prüfungen, die am Ende jedes Baus laufen; ein Fund bricht den Bau ab.

## Bauen

```
npm ci
npm run build
```

Die Seiten laden nichts von anderen Anbietern, setzen keine Cookies und speichern nichts im Browser.
