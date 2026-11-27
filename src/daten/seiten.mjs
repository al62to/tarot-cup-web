// Alle Seiten der Website an einer Stelle: Adresse je Sprache, Sprachfassungen (hreflang), Titel, Beschreibung, Bild
// zum Teilen, Brotkrumen, Index und Priorität für sitemap.xml. Seiten, Sitemap, llms.txt und die Prüfungen nach dem Bau
// lesen nur hier. Eine Seite ohne Eintrag bricht den Bau ab. Die Adressen selbst stehen in src/daten/adressen.mjs.
// "fassungen": alle Sprachfassungen derselben Seite, die Seite selbst eingeschlossen ({ sprache, pfad }); null, wenn
// es die Seite nur in einer Sprache gibt (AP-SPR2; vorher "gegenseite" für genau eine andere Sprache).
import { seite, suche } from './seite.mjs';
import { ADRESSEN, startVon } from './adressen.mjs';
import { oberflaeche } from './texte/oberflaeche.mjs';
import { start } from './texte/start.mjs';
import { tarot } from './texte/tarot.mjs';
import { kaffeesatz } from './texte/kaffeesatz.mjs';
import { sogehts } from './texte/sogehts.mjs';
import { fragen } from './texte/fragen.mjs';
import { ueber } from './texte/ueber.mjs';
import { ERKLAERSEITEN, erklaerTexte, erklaerSprachen, erklaerDatei, uebersichtSprachen, hatUebersicht } from './erklaer.mjs';
import { AVALIACAO } from './avaliacao.mjs';
import { rechtsseiten, seitentitel, beschreibung as rechtBeschreibung, sprachfassungen, textVon } from './recht.mjs';

// Inhaltsseiten in allen Sprachen. "texte": Modul mit metaTitel, metaBeschreibung, brotkrume je Sprache.
// "quellen": Dateien, deren letzter Commit den Tag der letzten Änderung ergibt (src/daten/stand.mjs); "datei": Name
// der Textdatei, deren Übersetzung (src/daten/texte/uebersetzt/<datei>_<sprache>.json) für en und es mitzählt.
const PAARE = [
  { schluessel: 'start', datei: 'start', texte: start, prioritaet: 1.0, quellen: ['src/daten/texte/start.mjs', 'src/components/Startseite.astro'] },
  { schluessel: 'tarot', datei: 'tarot', texte: tarot, prioritaet: 0.9, quellen: ['src/daten/texte/tarot.mjs', 'src/daten/app_daten.json', 'src/components/Ratgeber.astro'] },
  { schluessel: 'kaffeesatz', datei: 'kaffeesatz', texte: kaffeesatz, prioritaet: 0.9, quellen: ['src/daten/texte/kaffeesatz.mjs', 'src/daten/app_daten.json', 'src/components/Ratgeber.astro'] },
  { schluessel: 'sogehts', datei: 'sogehts', texte: sogehts, prioritaet: 0.7, quellen: ['src/daten/texte/sogehts.mjs', 'src/components/Anleitung.astro'] },
  { schluessel: 'fragen', datei: 'fragen', texte: fragen, prioritaet: 0.7, quellen: ['src/daten/texte/fragen.mjs', 'src/components/Fragenseite.astro'] },
  { schluessel: 'ueber', datei: 'ueber', texte: ueber, prioritaet: 0.5, quellen: ['src/daten/texte/ueber.mjs', 'src/components/Ueberseite.astro'] },
  {
    schluessel: 'bildnachweis', datei: 'oberflaeche', prioritaet: 0.2,
    texte: Object.fromEntries(seite.sprachen.map((sprache) => [sprache, oberflaeche[sprache].bildnachweis])),
    quellen: ['src/daten/texte/oberflaeche.mjs', 'src/components/Bildnachweis.astro'],
  },
];

// Seite der Startseite je Sprache (bisher src/pages/index.astro und tr/index.astro, AP-SPR2 eine Datei für alle).
const SEITENDATEI = Object.fromEntries(Object.entries(ADRESSEN.start).map(([s, a]) => [s, a.slice(1)]));

// Feste deutsche Texte der Seiten, die es nur auf Deutsch gibt.
const OFFENLEGUNG = {
  metaTitel: 'Offenlegung nach § 25 Mediengesetz | Tarot Cup',
  metaBeschreibung: 'Die Offenlegung nach dem österreichischen Mediengesetz nennt Medieninhaber und Blattlinie von tarot-cup.com, der Website zur App Tarot Cup.',
};

const krume = (sprache) => ({ titel: oberflaeche[sprache].krumen.start, ziel: startVon(sprache) });

function eintrag(werte) {
  return { index: true, art: 'website', fassungen: null, krumen: null, ...werte };
}

// Sprachfassungen einer Inhaltsseite aus src/daten/adressen.mjs.
function fassungenVon(schluessel) {
  const liste = seite.sprachen.filter((sprache) => ADRESSEN[schluessel][sprache]).map((sprache) => ({ sprache, pfad: ADRESSEN[schluessel][sprache] }));
  return liste.length > 1 ? liste : null;
}

const liste = [];
for (const paar of PAARE) {
  for (const sprache of seite.sprachen) {
    const texte = paar.texte[sprache];
    if (!texte) throw new Error(`Seiten: Texte fehlen für ${paar.schluessel} (${sprache})`);
    const pfad = ADRESSEN[paar.schluessel][sprache];
    if (!pfad) throw new Error(`Seiten: Adresse fehlt für ${paar.schluessel} (${sprache}) in src/daten/adressen.mjs`);
    const quellen = [
      ...paar.quellen,
      ...(paar.schluessel === 'start' ? [`src/pages/${SEITENDATEI[sprache]}index.astro`] : []),
      ...(['de', 'tr'].includes(sprache) ? [] : [`src/daten/texte/uebersetzt/${paar.datei}_${sprache}.json`]),
    ];
    liste.push(eintrag({
      schluessel: paar.schluessel,
      pfad,
      sprache,
      fassungen: fassungenVon(paar.schluessel),
      titel: texte.metaTitel,
      beschreibung: texte.metaBeschreibung,
      bild: `/bilder/teilen/${paar.schluessel}-${sprache}.jpg`,
      bildAlt: texte.ogTitel ?? texte.metaTitel,
      art: paar.schluessel === 'start' ? 'website' : 'article',
      krumen: paar.schluessel === 'start' ? null : [krume(sprache), { titel: texte.brotkrume, ziel: pfad }],
      prioritaet: paar.prioritaet,
      quellen,
      teilen: paar.schluessel !== 'bildnachweis',
      rechtlich: paar.schluessel === 'bildnachweis',
      index: paar.schluessel !== 'bildnachweis',
    }));
  }
}

// Erklärseiten (AP-25): nur in den Sprachen, für die es Adresse und Text gibt; hreflang nennt nur diese.
const PAAR_TEXTE = Object.fromEntries(PAARE.map((paar) => [paar.schluessel, paar.texte]));
for (const erklaer of ERKLAERSEITEN) {
  const sprachen = erklaerSprachen(erklaer);
  const fassungen = sprachen.length > 1 ? sprachen.map((sprache) => ({ sprache, pfad: ADRESSEN[erklaer.schluessel][sprache] })) : null;
  const datei = erklaerDatei(erklaer);
  for (const sprache of sprachen) {
    const texte = erklaerTexte(erklaer, sprache);
    const pfad = ADRESSEN[erklaer.schluessel][sprache];
    // Brotkrumen: Start › Ratgeber › Seite; ohne Themenseite (Traum, Mond, Allgemein) Start › Wissen › Seite (AP-25E),
    // solange es die Übersicht in der Sprache gibt.
    const eltern = erklaer.eltern
      ? { titel: PAAR_TEXTE[erklaer.eltern][sprache].brotkrume, ziel: ADRESSEN[erklaer.eltern][sprache] }
      : hatUebersicht(sprache) ? { titel: oberflaeche[sprache].wissen.uebersicht.brotkrume, ziel: ADRESSEN.wissen[sprache] } : null;
    liste.push(eintrag({
      schluessel: erklaer.schluessel,
      pfad,
      sprache,
      fassungen,
      titel: texte.metaTitel,
      beschreibung: texte.metaBeschreibung,
      bild: `/bilder/teilen/${erklaer.eltern ?? 'start'}-${sprache}.jpg`,
      bildAlt: texte.titel,
      art: 'article',
      krumen: [krume(sprache), ...(eltern ? [eltern] : []), { titel: texte.brotkrume, ziel: pfad }],
      prioritaet: 0.6,
      quellen: [`src/daten/texte/${datei}.mjs`, 'src/daten/erklaer.mjs', 'src/components/Erklaerseite.astro',
        ...(['de', 'tr'].includes(sprache) ? [] : [`src/daten/texte/uebersetzt/${datei}_${sprache}.json`])],
      teilen: true,
      erklaer,
    }));
  }
}

// Übersicht aller Erklärseiten (AP-25E): nur in Sprachen mit mindestens einer Erklärseite, die es gibt.
const wissenSprachen = uebersichtSprachen();
const wissenFassungen = wissenSprachen.length > 1 ? wissenSprachen.map((sprache) => ({ sprache, pfad: ADRESSEN.wissen[sprache] })) : null;
const ERKLAER_DATEIEN = [...new Set(ERKLAERSEITEN.map((erklaer) => `src/daten/texte/${erklaerDatei(erklaer)}.mjs`))];
for (const sprache of wissenSprachen) {
  const texte = oberflaeche[sprache].wissen.uebersicht;
  const pfad = ADRESSEN.wissen[sprache];
  liste.push(eintrag({
    schluessel: 'wissen',
    pfad,
    sprache,
    fassungen: wissenFassungen,
    titel: texte.metaTitel,
    beschreibung: texte.metaBeschreibung,
    bild: `/bilder/teilen/start-${sprache}.jpg`,
    bildAlt: texte.metaTitel.replace(/\s*\|\s*Tarot Cup$/, ''),
    art: 'website',
    krumen: [krume(sprache), { titel: texte.brotkrume, ziel: pfad }],
    prioritaet: 0.7,
    quellen: ['src/daten/texte/oberflaeche.mjs', 'src/daten/erklaer.mjs', 'src/daten/wissen.mjs', 'src/components/Wissensuebersicht.astro', ...ERKLAER_DATEIEN],
    teilen: true,
  }));
}

liste.push(eintrag({
  schluessel: 'offenlegung', pfad: '/offenlegung/', sprache: 'de',
  titel: OFFENLEGUNG.metaTitel, beschreibung: OFFENLEGUNG.metaBeschreibung,
  bild: '/bilder/teilen/start-de.jpg', bildAlt: 'Tarot Cup',
  krumen: [krume('de'), { titel: 'Offenlegung', ziel: '/offenlegung/' }],
  prioritaet: 0.1, quellen: ['src/pages/offenlegung/index.astro'], teilen: false, rechtlich: true, index: false,
}));

// Avaliação de impacto (AP-AS2): nur auf Portugiesisch, ohne Fassungen in anderen Sprachen ("einsprachig", Regel 6 in
// tools/pruefe_bau.mjs), rechtlich wie die Offenlegung und daher ohne Index.
liste.push(eintrag({
  schluessel: 'avaliacao', pfad: AVALIACAO.pfad, sprache: 'pt', einsprachig: true,
  titel: AVALIACAO.metaTitel, beschreibung: AVALIACAO.metaBeschreibung,
  bild: '/bilder/teilen/start-pt.jpg', bildAlt: 'Tarot Cup',
  krumen: [krume('pt'), { titel: AVALIACAO.brotkrume, ziel: AVALIACAO.pfad }],
  prioritaet: 0.1, quellen: ['src/inhalte/avaliacao/avaliacao_de_impacto_pt.html', 'src/daten/avaliacao.mjs', 'src/pages/pt/avaliacao-de-impacto/index.astro'],
  teilen: false, rechtlich: true, index: false,
}));

// Rechtsseiten aus dem Verzeichnis: nur die gültige Fassung (AP-40D).
for (const rechtsseite of rechtsseiten()) {
  const { text, fassung, adresse } = rechtsseite;
  const sp = text.sprache;
  const gueltig = { titel: textVon(text.pfad).titel, ziel: `/${text.pfad}/` };
  liste.push(eintrag({
    schluessel: `recht:${text.pfad}`,
    pfad: adresse,
    sprache: sp,
    fassungen: sprachfassungen(rechtsseite),
    titel: seitentitel(rechtsseite),
    beschreibung: rechtBeschreibung(rechtsseite),
    bild: `/bilder/teilen/start-${sp}.jpg`,
    bildAlt: 'Tarot Cup',
    krumen: [krume(sp), gueltig],
    prioritaet: 0.2,
    quellen: [`src/inhalte/recht/${fassung.datei}`, 'src/inhalte/recht/verzeichnis.json'],
    teilen: false,
    rechtlich: true,
    index: false,
    recht: rechtsseite,
  }));
}

// Seiten ohne Index ("noindex, follow", nicht in Sitemap und llms.txt, robots.txt sperrt sie nicht): alle rechtlichen
// Seiten (Offenlegung, Datenschutz, Nutzungsbedingungen mit allen Fassungen, Bildnachweis; AP-W3), Kurzlink und 404.
// Sie bleiben erreichbar und im Fuß verlinkt.
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
// Sprachfassungen: jede genannte Seite gibt es, sie trägt die genannte Sprache, die Seite nennt sich selbst, und jede
// genannte Seite nennt genau dieselben Fassungen (gegenseitig).
const kennung = (fassungen) => (fassungen ?? []).map((fassung) => `${fassung.sprache}=${fassung.pfad}`).sort().join(' ');
for (const eintrag of SEITEN) {
  if (!eintrag.fassungen) continue;
  if (!eintrag.fassungen.some((fassung) => fassung.pfad === eintrag.pfad && fassung.sprache === eintrag.sprache)) throw new Error(`Seiten: ${eintrag.pfad} nennt sich nicht selbst unter seinen Sprachfassungen`);
  if (new Set(eintrag.fassungen.map((fassung) => fassung.sprache)).size !== eintrag.fassungen.length) throw new Error(`Seiten: Sprache doppelt bei ${eintrag.pfad}`);
  for (const fassung of eintrag.fassungen) {
    const andere = nachPfad.get(fassung.pfad);
    if (!andere) throw new Error(`Seiten: Sprachfassung fehlt: ${eintrag.pfad} → ${fassung.pfad}`);
    if (andere.sprache !== fassung.sprache) throw new Error(`Seiten: Sprache von ${fassung.pfad} ist ${andere.sprache}, nicht ${fassung.sprache}`);
    if (kennung(andere.fassungen) !== kennung(eintrag.fassungen)) throw new Error(`Seiten: Sprachfassungen nicht gegenseitig: ${eintrag.pfad} / ${fassung.pfad}`);
  }
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
