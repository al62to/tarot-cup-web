"""Schreibt die Angaben aus den Daten der App, die die Website zeigen darf, nach src/daten/app_daten.json.

Die Website zeigt je Zeichen und Karte nur Name und Kurzbedeutung (Website-Lexikon, Variante B), dazu die Namen der
Legungen und ihrer Positionen. Lebensbereich-Texte, Positionstexte, Ja-Nein, Tageskarte und Ratsätze bleiben in der
App und werden hier nicht gelesen. Quellenangaben und Arbeitsnotizen der Daten kommen nie auf die Website.

Aufruf (aus dem Ordner tarot-cup-web):
    python tools/app_daten_exportieren.py --daten ../deutung/daten

Läuft unter Windows und macOS. Bricht ab, wenn ein Feld fehlt oder leer ist.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ZIEL = Path(__file__).resolve().parent.parent / "src" / "daten" / "app_daten.json"
SPRACHEN = ("de", "tr")


def zweisprachig(wert: object, wo: str) -> dict[str, str]:
    if not isinstance(wert, dict):
        raise SystemExit(f"{wo}: erwartet ein Objekt mit de und tr")
    aus = {}
    for sprache in SPRACHEN:
        text = wert.get(sprache)
        if not isinstance(text, str) or not text.strip():
            raise SystemExit(f"{wo}.{sprache}: fehlt oder leer")
        aus[sprache] = text.strip()
    return aus


def lies(pfad: Path) -> dict:
    if not pfad.is_file():
        raise SystemExit(f"Datei fehlt: {pfad}")
    return json.loads(pfad.read_text(encoding="utf-8"))


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--daten", type=Path, required=True, help="Ordner daten/ des Code-Repos deutung")
    args = parser.parse_args(argv)
    daten = args.daten.resolve()

    zeichen_quelle = lies(daten / "zeichen_kaffeesatz.json")
    karten_quelle = lies(daten / "tarot_karten.json")
    legungen_quelle = lies(daten / "tarot_legungen.json")

    zeichen = []
    for z in zeichen_quelle["zeichen"]:
        wo = f"zeichen {z['id']}"
        zeichen.append({
            "id": z["id"],
            "kategorie": z["kategorie"],
            "name": zweisprachig(z["name"], f"{wo}.name"),
            "kurz": zweisprachig(z["kurzbedeutung"], f"{wo}.kurzbedeutung"),
        })

    karten = []
    for k in karten_quelle["karten"]:
        wo = f"karte {k['id']}"
        karten.append({
            "id": k["id"],
            "nummer": k["nummer"],
            "arkana": k["arkana"],
            "farbe": k["farbe"],
            "name": zweisprachig(k["name"], f"{wo}.name"),
            "kurz": {
                richtung: zweisprachig(k["kurzbedeutung"][richtung], f"{wo}.kurzbedeutung.{richtung}")
                for richtung in ("aufrecht", "umgekehrt")
            },
        })

    legungen = {}
    for kennung, legung in legungen_quelle["legungen"].items():
        legungen[kennung] = {
            "name": zweisprachig(legung["name"], f"legung {kennung}.name"),
            "positionen": [
                {"id": p["id"], "name": zweisprachig(p["name"], f"legung {kennung}.{p['id']}")}
                for p in legung.get("positionen", [])
            ],
        }

    aus = {
        "_hinweis": "Erzeugt mit tools/app_daten_exportieren.py aus den Daten der App (nur Namen und "
                    "Kurzbedeutungen, Website-Lexikon Variante B). Nicht von Hand ändern.",
        "quelle": {
            "zeichen_kaffeesatz": zeichen_quelle.get("version"),
            "tarot_karten": karten_quelle.get("version"),
            "tarot_legungen": legungen_quelle.get("version"),
        },
        "zeichen": zeichen,
        "karten": karten,
        "legungen": legungen,
    }
    if len(zeichen) != 80 or len(karten) != 78:
        raise SystemExit(f"Anzahl unerwartet: {len(zeichen)} Zeichen, {len(karten)} Karten")
    ZIEL.write_text(json.dumps(aus, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"geschrieben: {ZIEL} ({len(zeichen)} Zeichen, {len(karten)} Karten, {len(legungen)} Legungen)")


if __name__ == "__main__":
    sys.exit(main())
