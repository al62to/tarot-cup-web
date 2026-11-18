// Links auf die Erklärseiten (AP-25): Titel und Adresse einer Seite in einer Sprache und Listen für die Blöcke
// „Weiterlesen“ (Erklärseite), „Mehr zum Thema“ (Ratgeber) und den Block der Startseite. Es zählen nur Seiten, die es
// in der Sprache gibt (Adresse und Text, src/daten/seiten.mjs); eine fehlende Seite fällt still weg.
import { SEITEN } from './seiten.mjs';
import { ERKLAERSEITEN, erklaerTexte, erklaerVon, hatUebersicht } from './erklaer.mjs';
import { ADRESSEN } from './adressen.mjs';
import { start } from './texte/start.mjs';
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

// Übersicht /wissen/ (AP-25E) --------------------------------------------------------------------------------------

// Erster Satz der Kurzantwort als kurzer Text für die Übersicht, ohne neuen Inhalt: bis zum ersten Satzende (Punkt,
// Fragezeichen, Ausrufezeichen vor einem Leerzeichen; nicht nach einer Zahl wie „16.“ und nicht nach einem einzelnen
// Großbuchstaben wie „C.“), und davon nur der Teil vor einem Doppelpunkt oder Strichpunkt, der für sich schon ein Satz
// ist. Links werden zu ihrem Linktext, Hervorhebungen (*so*) zu Text.
export function kurzSatz(eintrag, sprache) {
  const text = erklaerTexte(eintrag, sprache).kurzantwort[0].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*/g, '');
  const ende = [...text.matchAll(/[.!?](?=\s|$)/g)].find((treffer) => !/(\d|(^|\s)\p{Lu})$/u.test(text.slice(0, treffer.index)));
  const satz = ende ? text.slice(0, ende.index + 1) : text;
  const teil = satz.match(/^([^:;]+)[:;]\s/);
  return teil ? `${teil[1].trim()}.` : satz;
}

// Gruppen der Übersicht: je Bereich die Erklärseiten mit Titel, Adresse und kurzem Satz; bei Kaffeesatz und Tarot dazu
// der Link auf den Ratgeber mit dem Linktext der Startseite („Zum Ratgeber Tarot“). Leere Bereiche fallen weg.
export function uebersichtGruppen(sprache) {
  if (!hatUebersicht(sprache)) return [];
  const ratgeber = start[sprache].ratgeber.eintraege;
  return wissenGruppen(sprache).map((gruppe) => {
    const ziel = ADRESSEN[gruppe.bereich]?.[sprache];
    const link = ziel ? ratgeber.find((eintrag) => eintrag.ziel === ziel) : null;
    if (ziel && !link) throw new Error(`Wissen: Linktext zum Ratgeber ${gruppe.bereich} (${sprache}) fehlt in start.ratgeber`);
    return {
      ...gruppe,
      eintraege: gruppe.eintraege.map((e) => ({ ...e, text: kurzSatz(erklaerVon(e.schluessel), sprache) })),
      ratgeber: link ? { text: link.link, ziel } : null,
    };
  });
}

// Link auf die Übersicht (Kopf, Fuß, Startseite), oder null, wenn es in der Sprache keine gibt.
export const uebersichtLink = (sprache) => (hatUebersicht(sprache) ? { text: wissenTexte(sprache).nav, ziel: ADRESSEN.wissen[sprache] } : null);
