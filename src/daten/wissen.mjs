// Links auf die Erklärseiten (AP-25): Titel und Adresse einer Seite in einer Sprache und Listen für die Blöcke
// „Weiterlesen“ (Erklärseite), „Mehr zum Thema“ (Ratgeber) und den Block der Startseite. Es zählen nur Seiten, die es
// in der Sprache gibt (Adresse und Text, src/daten/seiten.mjs); eine fehlende Seite fällt still weg.
import { SEITEN } from './seiten.mjs';
import { ERKLAERSEITEN, erklaerTexte, erklaerVon } from './erklaer.mjs';
import { oberflaeche } from './texte/oberflaeche.mjs';

const BEREICHE = ['kaffeesatz', 'tarot', 'traum', 'mond', 'allgemein'];

// Titel für einen Link: bei Erklärseiten die Überschrift (H1), sonst der Titel der Seite ohne „ | Tarot Cup“.
function eintragVon(schluessel, sprache) {
  const seite = SEITEN.find((kandidat) => kandidat.schluessel === schluessel && kandidat.sprache === sprache);
  if (!seite) return null;
  const erklaer = erklaerVon(schluessel);
  const titel = erklaer ? erklaerTexte(erklaer, sprache).titel : seite.titel.replace(/\s*\|\s*Tarot Cup$/, '');
  return { schluessel, titel, text: seite.beschreibung, pfad: seite.pfad, bereich: erklaer?.bereich ?? null };
}

// Seiten aus einer Liste von Schlüsseln, in der Reihenfolge der Liste, nur die vorhandenen.
export const wissenEintraege = (schluessel, sprache) => schluessel.map((s) => eintragVon(s, sprache)).filter(Boolean);

// Erklärseiten unter einer Themenseite (eltern = tarot, kaffeesatz), in der Reihenfolge des Verzeichnisses.
export const unterseiten = (eltern, sprache) => wissenEintraege(ERKLAERSEITEN.filter((e) => e.eltern === eltern).map((e) => e.schluessel), sprache);

// Alle Erklärseiten einer Sprache, nach Bereich gruppiert (leere Bereiche fallen weg).
export function wissenGruppen(sprache) {
  return BEREICHE
    .map((bereich) => ({ bereich, eintraege: wissenEintraege(ERKLAERSEITEN.filter((e) => e.bereich === bereich).map((e) => e.schluessel), sprache) }))
    .filter((gruppe) => gruppe.eintraege.length);
}

// Texte der Oberfläche für die Blöcke; fehlen sie in einer Sprache, für die es Erklärseiten gibt, bricht der Bau ab.
export function wissenTexte(sprache) {
  const texte = oberflaeche[sprache]?.wissen;
  if (!texte) throw new Error(`Wissen: oberflaeche.${sprache}.wissen fehlt (src/daten/texte/oberflaeche.mjs)`);
  return texte;
}
