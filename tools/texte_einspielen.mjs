// Spielt die übersetzten Texte der Website (Englisch, Spanisch) in die Text-Module ein (AP-SPR2, Teil C).
//
// Quelle: deutung-unterlagen/uebersetzung/<code>/website/<datei>_<code>.json, je Text ein Eintrag
// "<export>.<pfad>": { de, <code> } (Pfad wie im Export der Datei src/daten/texte/<datei>.mjs, zum Beispiel
// "start.held.titel" oder "fragen.liste[3].antwort[0]"). Was dort fehlt, sucht das Skript im Nachtrag
// deutung-unterlagen/arbeit/spr2/web/nachtrag_<code>.json (gleiches Format; Texte, die es bei der Übersetzung noch
// nicht gab). Ziel: src/daten/texte/uebersetzt/<datei>_<code>.json mit derselben Struktur wie das Objekt "de"; die
// Text-Module hängen diese Dateien als "en" und "es" an. Nicht von Hand ändern, sondern neu einspielen.
//
// Regeln (dieselben wie beim Herausziehen der Texte in arbeit/spr1/spr1.py, _web_segmente):
//  - Felder wie ziel, id, bild, anker, ids, tuerkischeBegriffe und Werte ohne Buchstaben oder reine Adressen sind kein
//    Text; sie kommen unverändert aus "de".
//  - Sprachname und Kürzel der Sprache (oberflaeche.sprache, oberflaeche.spracheKurz) setzt das Skript selbst aus
//    src/daten/adressen.mjs (eigene Schreibweise, „English“, „Español“).
//  - Links der Form [Text](/pfad/) und Adressen in Feldern wie ziel ("/kaffeesatz-lesen/") führen auf dieselbe Seite
//    in der Sprache (src/daten/adressen.mjs).
// Gemeldet werden: fehlende Texte (dann wird für diese Sprache nichts geschrieben, Rückgabewert 1), Texte aus dem
// Nachtrag, Einträge der Übersetzung, die kein Text mehr braucht, deutsche Texte, die sich seit der Übersetzung
// geändert haben, Abweichungen bei Links, Hervorhebungen (*…*) und Platzhaltern ({name}) und zu lange oder zu kurze
// Titel und Beschreibungen für die Suche.
//
// Aufruf (aus tarot-cup-web):
//   node tools/texte_einspielen.mjs [--sprachen en,es] [--quelle <ordner uebersetzung>] [--nachtrag <ordner>]
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SPRACHNAMEN, SPRACHKUERZEL, adresseIn, schluesselVon } from '../src/daten/adressen.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEXTE = join(WURZEL, 'src', 'daten', 'texte');
const ZIEL = join(TEXTE, 'uebersetzt');

const argumente = process.argv.slice(2);
const wert = (name, standard) => {
  const stelle = argumente.indexOf(name);
  return stelle >= 0 ? argumente[stelle + 1] : standard;
};
const SPRACHEN = wert('--sprachen', 'en,es').split(',').map((code) => code.trim()).filter(Boolean);
const QUELLE = resolve(wert('--quelle', join(WURZEL, '..', 'deutung-unterlagen', 'uebersetzung')));
const NACHTRAG = resolve(wert('--nachtrag', join(WURZEL, '..', 'deutung-unterlagen', 'arbeit', 'spr2', 'web')));

// Wie WEB_UEBERSPRINGEN in spr1.py.
const KEIN_TEXT = new Set(['ziel', 'bereich', 'href', 'url', 'id', 'bild', 'icon', 'klasse', 'anker', 'slug', 'pfad',
  'datei', 'zahl', 'typ', 'art', 'schluessel', 'farbe', 'src', 'breite', 'hoehe', 'kennung', 'ids', 'foto',
  'tuerkischeBegriffe']);
const istText = (text) => /[A-Za-zÄÖÜäöüß]/.test(text) && !/^(\/[a-z0-9\-/#]*|https?:\/\/\S+)$/.test(text);

const FEST = {
  'oberflaeche.sprache': (code) => SPRACHNAMEN[code],
  'oberflaeche.spracheKurz': (code) => SPRACHKUERZEL[code],
};

const lies = (datei) => (existsSync(datei) ? JSON.parse(readFileSync(datei, 'utf8')) : {});
const links = (text) => [...text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((treffer) => treffer[2]);
const platzhalter = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((treffer) => treffer[1]).sort().join(',');
const sterne = (text) => (text.match(/\*/g) ?? []).length;

// Damit die Module laden, auch wenn eine Zieldatei noch fehlt.
mkdirSync(ZIEL, { recursive: true });
const dateien = readdirSync(TEXTE).filter((name) => name.endsWith('.mjs')).sort();
for (const name of dateien) {
  for (const code of SPRACHEN) {
    const datei = join(ZIEL, `${name.replace(/\.mjs$/, '')}_${code}.json`);
    if (!existsSync(datei)) writeFileSync(datei, '{}\n');
  }
}

let fehlerGesamt = 0;
for (const code of SPRACHEN) {
  const bericht = { fehlt: [], nachtrag: [], ungenutzt: [], deGeaendert: [], hinweise: [] };
  const nachtrag = lies(join(NACHTRAG, `nachtrag_${code}.json`));
  const genutztNachtrag = new Set();
  const ergebnisse = [];
  for (const name of dateien) {
    const stamm = name.replace(/\.mjs$/, '');
    const quelle = lies(join(QUELLE, code, 'website', `${stamm}_${code}.json`));
    const genutzt = new Set();
    const modul = await import(pathToFileURL(join(TEXTE, name)).href);
    for (const [exportName, objekt] of Object.entries(modul)) {
      if (!objekt || typeof objekt !== 'object' || !objekt.de) continue;
      const gang = (de, weg, feld) => {
        if (typeof de === 'string') {
          if (/^\/[a-z0-9\-/#]*$/.test(de)) return adresseIn(de, code);
          if ((feld && KEIN_TEXT.has(feld)) || !istText(de)) return de;
          if (FEST[weg]) {
            genutzt.add(weg);
            return FEST[weg](code);
          }
          let eintrag = quelle[weg];
          if (eintrag) genutzt.add(weg);
          else if (nachtrag[weg]) {
            eintrag = nachtrag[weg];
            genutztNachtrag.add(weg);
            bericht.nachtrag.push(weg);
          }
          const text = eintrag?.[code];
          if (typeof text !== 'string' || !text.trim()) {
            bericht.fehlt.push(weg);
            return null;
          }
          if (eintrag.de !== de) bericht.deGeaendert.push(weg);
          if (links(de).length !== links(text).length) bericht.hinweise.push(`${weg}: ${links(de).length} Link(s) im Deutschen, ${links(text).length} in der Übersetzung`);
          if (platzhalter(de) !== platzhalter(text)) bericht.hinweise.push(`${weg}: Platzhalter {…} weichen ab (${platzhalter(de) || 'keine'} / ${platzhalter(text) || 'keine'})`);
          // Suchtreffer: Titel höchstens etwa 60, Beschreibung etwa 150 Zeichen (Auftrag AP-SPR2, Teil C 4).
          if (weg.endsWith('.metaTitel') && text.length > 60) bericht.hinweise.push(`${weg}: Titel ${text.length} Zeichen (höchstens etwa 60)`);
          if (weg.endsWith('.metaBeschreibung') && (text.length > 160 || text.length < 110)) bericht.hinweise.push(`${weg}: Beschreibung ${text.length} Zeichen (etwa 150)`);
          // Linkziele sind kein Text: Ein Ziel, das es nicht gibt, kommt vom Link an derselben Stelle im Deutschen.
          const zieleDe = links(de);
          let nummer = -1;
          const mitZielen = text.replace(/\]\(([^)]+)\)/g, (ganz, ziel) => {
            nummer++;
            if (!ziel.startsWith('/') || schluesselVon(ziel.split('#')[0])) return ganz;
            if (zieleDe.length === links(text).length) {
              bericht.hinweise.push(`${weg}: Linkziel ${ziel} gibt es nicht, genommen ${zieleDe[nummer]} aus dem Deutschen`);
              return `](${zieleDe[nummer]})`;
            }
            bericht.hinweise.push(`${weg}: Link auf unbekannte Adresse ${ziel} (Adressen: src/daten/adressen.mjs)`);
            return ganz;
          });
          if (sterne(de) !== sterne(text)) bericht.hinweise.push(`${weg}: Hervorhebung *…* weicht ab (${sterne(de)} / ${sterne(text)} Sterne): „${text.slice(0, 90)}“`);
          return mitZielen.replace(/\]\(([^)]+)\)/g, (ganz, ziel) => `](${ziel.startsWith('/') ? adresseIn(ziel, code) : ziel})`);
        }
        if (Array.isArray(de)) {
          if (feld && KEIN_TEXT.has(feld)) return structuredClone(de);
          return de.map((teil, nummer) => gang(teil, `${weg}[${nummer}]`, null));
        }
        if (de && typeof de === 'object') {
          return Object.fromEntries(Object.entries(de).map(([schluessel, teil]) => [
            schluessel,
            KEIN_TEXT.has(schluessel) && typeof teil !== 'string' ? structuredClone(teil) : gang(teil, `${weg}.${schluessel}`, schluessel),
          ]));
        }
        return de;
      };
      const aus = gang(objekt.de, exportName, null);
      ergebnisse.push({ datei: join(ZIEL, `${stamm}_${code}.json`), aus, stamm });
    }
    for (const schluessel of Object.keys(quelle)) if (!genutzt.has(schluessel)) bericht.ungenutzt.push(`${stamm}: ${schluessel}`);
  }
  for (const schluessel of Object.keys(nachtrag)) {
    if (!genutztNachtrag.has(schluessel) && !schluessel.startsWith('_')) bericht.ungenutzt.push(`Nachtrag: ${schluessel}`);
  }

  const zeige = (titel, liste) => {
    if (!liste.length) return;
    console.log(`  ${titel} (${liste.length}):`);
    for (const eintrag of liste) console.log(`    ${eintrag}`);
  };
  console.log(`\n${code}: ${QUELLE}/${code}/website`);
  zeige('FEHLT', bericht.fehlt);
  zeige('aus dem Nachtrag', bericht.nachtrag);
  zeige('deutscher Text seit der Übersetzung geändert', bericht.deGeaendert);
  zeige('in der Übersetzung, aber nicht mehr gebraucht', bericht.ungenutzt);
  zeige('Hinweise', bericht.hinweise);
  if (bericht.fehlt.length) {
    console.log(`  ${code}: nichts geschrieben, ${bericht.fehlt.length} Text(e) fehlen`);
    fehlerGesamt += bericht.fehlt.length;
    continue;
  }
  for (const { datei, aus } of ergebnisse) {
    writeFileSync(datei, `${JSON.stringify(aus, null, 1)}\n`);
  }
  console.log(`  ${code}: ${ergebnisse.length} Dateien geschrieben nach ${ZIEL}`);
}
process.exit(fehlerGesamt ? 1 : 0);
