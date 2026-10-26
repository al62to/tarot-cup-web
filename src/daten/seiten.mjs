// Alle Seiten der Website an einer Stelle: Adresse je Sprache, Gegenseite (hreflang), Titel, Beschreibung, Bild zum
// Teilen, Brotkrumen, Index und Priorität für sitemap.xml. Seiten, Sitemap, llms.txt und die Prüfungen nach dem Bau
// lesen nur hier. Eine Seite ohne Eintrag bricht den Bau ab.
import { seite, suche } from './seite.mjs';
import { oberflaeche } from './texte/oberflaeche.mjs';
import { start } from './texte/start.mjs';
import { tarot } from './texte/tarot.mjs';
import { kaffeesatz } from './texte/kaffeesatz.mjs';
import { sogehts } from './texte/sogehts.mjs';
import { fragen } from './texte/fragen.mjs';
import { ueber } from './texte/ueber.mjs';
import { SPRACHEN, rechtsseiten, seitentitel, beschreibung as rechtBeschreibung, sprachwahl, textVon } from './recht.mjs';

// Inhaltsseiten in beiden Sprachen. "texte": Modul mit metaTitel, metaBeschreibung, brotkrume je Sprache.
// "quellen": Dateien, deren letzter Commit den Tag der letzten Änderung ergibt (src/daten/stand.mjs).
const PAARE = [
  { schluessel: 'start', de: '/', tr: '/tr/', texte: start, prioritaet: 1.0, quellen: ['src/daten/texte/start.mjs', 'src/pages/index.astro', 'src/components/Startseite.astro'] },
  { schluessel: 'tarot', de: '/tarot/', tr: '/tr/tarot/', texte: tarot, prioritaet: 0.9, quellen: ['src/daten/texte/tarot.mjs', 'src/daten/app_daten.json', 'src/components/Ratgeber.astro'] },
  { schluessel: 'kaffeesatz', de: '/kaffeesatz-lesen/', tr: '/tr/kahve-fali/', texte: kaffeesatz, prioritaet: 0.9, quellen: ['src/daten/texte/kaffeesatz.mjs', 'src/daten/app_daten.json', 'src/components/Ratgeber.astro'] },
  { schluessel: 'sogehts', de: '/so-gehts/', tr: '/tr/nasil-kullanilir/', texte: sogehts, prioritaet: 0.7, quellen: ['src/daten/texte/sogehts.mjs', 'src/components/Anleitung.astro'] },
  { schluessel: 'fragen', de: '/fragen/', tr: '/tr/sorular/', texte: fragen, prioritaet: 0.7, quellen: ['src/daten/texte/fragen.mjs', 'src/components/Fragenseite.astro'] },
  { schluessel: 'ueber', de: '/ueber-tarot-cup/', tr: '/tr/hakkinda/', texte: ueber, prioritaet: 0.5, quellen: ['src/daten/texte/ueber.mjs', 'src/components/Ueberseite.astro'] },
  {
    schluessel: 'bildnachweis', de: '/bildnachweis-und-lizenzen/', tr: '/tr/gorsel-kaynaklari-ve-lisanslar/', prioritaet: 0.2,
    texte: { de: oberflaeche.de.bildnachweis, tr: oberflaeche.tr.bildnachweis },
    quellen: ['src/daten/texte/oberflaeche.mjs', 'src/components/Bildnachweis.astro'],
  },
];

// Feste deutsche Texte der Seiten, die es nur auf Deutsch gibt.
const OFFENLEGUNG = {
  metaTitel: 'Offenlegung nach § 25 Mediengesetz | Tarot Cup',
  metaBeschreibung: 'Die Offenlegung nach dem österreichischen Mediengesetz nennt Medieninhaber und Blattlinie von tarot-cup.com, der Website zur App Tarot Cup.',
};

const startVon = (sprache) => (sprache === 'de' ? '/' : '/tr/');
const krume = (sprache) => ({ titel: oberflaeche[sprache].krumen.start, ziel: startVon(sprache) });

function eintrag(werte) {
  return { index: true, art: 'website', gegenseite: null, krumen: null, ...werte };
}

const liste = [];
for (const paar of PAARE) {
  for (const sprache of seite.sprachen) {
    const texte = paar.texte[sprache];
    if (!texte) throw new Error(`Seiten: Texte fehlen für ${paar.schluessel} (${sprache})`);
    const andere = sprache === 'de' ? 'tr' : 'de';
    liste.push(eintrag({
      schluessel: paar.schluessel,
      pfad: paar[sprache],
      sprache,
      gegenseite: paar[andere],
      titel: texte.metaTitel,
      beschreibung: texte.metaBeschreibung,
      bild: `/bilder/teilen/${paar.schluessel}-${sprache}.jpg`,
      bildAlt: texte.ogTitel ?? texte.metaTitel,
      art: paar.schluessel === 'start' ? 'website' : 'article',
      krumen: paar.schluessel === 'start' ? null : [krume(sprache), { titel: texte.brotkrume, ziel: paar[sprache] }],
      prioritaet: paar.prioritaet,
      quellen: paar.quellen,
      teilen: paar.schluessel !== 'bildnachweis',
      rechtlich: paar.schluessel === 'bildnachweis',
    }));
  }
}

liste.push(eintrag({
  schluessel: 'offenlegung', pfad: '/offenlegung/', sprache: 'de',
  titel: OFFENLEGUNG.metaTitel, beschreibung: OFFENLEGUNG.metaBeschreibung,
  bild: '/bilder/teilen/start-de.jpg', bildAlt: 'Tarot Cup',
  krumen: [krume('de'), { titel: 'Offenlegung', ziel: '/offenlegung/' }],
  prioritaet: 0.1, quellen: ['src/pages/offenlegung/index.astro'], teilen: false, rechtlich: true,
}));

// Rechtsseiten aus dem Verzeichnis: gültige Fassung und Archiv. Niedrige Priorität in der Sitemap.
for (const rechtsseite of rechtsseiten()) {
  const { text, fassung, archiv, adresse } = rechtsseite;
  const sp = text.sprache;
  const gueltig = { titel: textVon(text.pfad).titel, ziel: `/${text.pfad}/` };
  liste.push(eintrag({
    schluessel: `recht:${text.pfad}${archiv ? `:${fassung.nummer}` : ''}`,
    pfad: adresse,
    sprache: sp,
    gegenseite: sprachwahl(rechtsseite).gegenseite,
    titel: seitentitel(rechtsseite),
    beschreibung: rechtBeschreibung(rechtsseite),
    bild: `/bilder/teilen/start-${sp}.jpg`,
    bildAlt: 'Tarot Cup',
    krumen: archiv
      ? [krume(sp), gueltig, { titel: SPRACHEN[sp].fassung.replace('{nr}', fassung.nummer), ziel: adresse }]
      : [krume(sp), gueltig],
    prioritaet: archiv ? 0.1 : 0.2,
    quellen: [`src/inhalte/recht/${fassung.datei}`, 'src/inhalte/recht/verzeichnis.json'],
    teilen: false,
    rechtlich: true,
    recht: rechtsseite,
  }));
}

// Seiten ohne Index: Kurzlink und 404 (nicht in Sitemap und llms.txt).
liste.push(eintrag({
  schluessel: 'app', pfad: '/app/', sprache: 'de', index: false,
  titel: oberflaeche.de.app.metaTitel, beschreibung: oberflaeche.de.app.metaBeschreibung,
  bild: '/bilder/teilen/start-de.jpg', bildAlt: 'Tarot Cup', teilen: false,
  quellen: ['src/pages/app/index.astro'],
}));
liste.push(eintrag({
  schluessel: '404', pfad: '/404.html', sprache: 'de', index: false,
  titel: `${oberflaeche.de.nichtGefunden.titel} | Tarot Cup`, beschreibung: oberflaeche.de.nichtGefunden.text,
  bild: '/bilder/teilen/start-de.jpg', bildAlt: 'Tarot Cup', teilen: false,
  quellen: ['src/pages/404.astro'],
}));

// Ohne Freigabe zur Suche steht keine Seite im Index (E8).
export const SEITEN = liste.map((eintrag) => ({ ...eintrag, imIndex: suche.freigegeben && eintrag.index }));

const nachPfad = new Map();
for (const eintrag of SEITEN) {
  if (nachPfad.has(eintrag.pfad)) throw new Error(`Seiten: Adresse doppelt: ${eintrag.pfad}`);
  nachPfad.set(eintrag.pfad, eintrag);
}
for (const eintrag of SEITEN) {
  if (eintrag.gegenseite && !nachPfad.has(eintrag.gegenseite)) throw new Error(`Seiten: Gegenseite fehlt: ${eintrag.pfad} → ${eintrag.gegenseite}`);
  if (eintrag.gegenseite && nachPfad.get(eintrag.gegenseite).gegenseite !== eintrag.pfad) throw new Error(`Seiten: Gegenseite nicht wechselseitig: ${eintrag.pfad}`);
}

export function seiteVon(pfad) {
  const eintrag = nachPfad.get(pfad);
  if (!eintrag) throw new Error(`Seiten: keine Angaben für ${pfad} (src/daten/seiten.mjs)`);
  return eintrag;
}

// Pfad einer Seite in einer Sprache über ihren Schlüssel.
export function pfadVon(schluessel, sprache) {
  const eintrag = SEITEN.find((kandidat) => kandidat.schluessel === schluessel && kandidat.sprache === sprache);
  if (!eintrag) throw new Error(`Seiten: ${schluessel} gibt es nicht auf ${sprache}`);
  return eintrag.pfad;
}

export const startPfad = startVon;
