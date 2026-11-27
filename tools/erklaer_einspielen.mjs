// Spielt die durchgesehenen Übersetzungen der Erklärseiten (AP-WS1) in die Website ein.
//
// Quelle: deutung-unterlagen/arbeit/apws1/final/<schluessel>_<code>.json (je Seite ein Objekt wie im deutschen Modul)
// und deutung-unterlagen/arbeit/apws1/final/wissen_<code>.json (Texte der Oberfläche für den Wissensbereich:
// { wissen: {...wie oberflaeche.de.wissen}, posen: {...wie oberflaeche.de.bildnachweis.posen}, llms: '<Überschrift>' }).
// Ziel: src/daten/texte/uebersetzt/erklaer_<bereich>_<code>.json ({ <text>: {...} }) und
// src/daten/texte/uebersetzt/wissen_<code>.json. Die Module erklaer_<bereich>.mjs, oberflaeche.mjs und llms.mjs hängen
// sie für die Sprachen in SPRACHEN an. Nicht von Hand ändern, sondern hier neu einspielen.
// tools/texte_einspielen.mjs lässt die Module erklaer_* aus (sie haben eigene Übersetzungen).
// Fremdsprachige Teile: Was in einem Text (meist in den Quellen: Buch- und Aufsatztitel, Namen) Wort für Wort wie im
// Deutschen stehen bleibt und deutsch oder türkisch aussieht, kommt als fremdeBegriffe ({ text, lang }) in die Seite;
// tools/sprache_setzen.mjs setzt darum lang (über src/daten/sprachen.mjs). lang ist tr, wenn der Teil türkische
// Buchstaben hat oder so auch in den Quellen der türkischen Seite steht, sonst de.
//
// Aufruf (aus tarot-cup-web): node tools/erklaer_einspielen.mjs [--quelle <ordner>]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ERKLAERSEITEN, erklaerTexte } from '../src/daten/erklaer.mjs';
import { ADRESSEN } from '../src/daten/adressen.mjs';

export const SPRACHEN = ['en', 'es', 'pt'];
const BEREICHE = ['kaffeesatz', 'tarot', 'traum', 'mond', 'allgemein'];
const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = join(WURZEL, 'src', 'daten', 'texte', 'uebersetzt');
const stelle = process.argv.indexOf('--quelle');
const QUELLE = resolve(stelle > 0 ? process.argv[stelle + 1] : join(WURZEL, '..', 'deutung-unterlagen', 'arbeit', 'apws1', 'final'));


// Merkmale deutscher Reste wie Regel 9 in tools/pruefe_bau.mjs (ohne die Wörter, die es auch in den Zielsprachen gibt).
const DEUTSCH = /[äöüÄÖÜß]|(?<![\p{L}\p{N}])(?:und|oder|nicht|nur|auch|sich|ist|sind|wird|werden|eine[mnrs]?|einen|der|dem|mit|für|auf|bei|zum|zur|vom|wie|wenn|Seite|Karte|Karten|Tasse|Zeichen|Kaffeesatz|Deutung|Legung|Satz|Bedeutung)(?![\p{L}\p{N}])/u;
const TUERKISCH = /[ıİşŞğĞ]/;
const DEUTSCHE_WOERTER = /ß|(?<![\p{L}])(?:der|die|das|des|dem|den|und|von|vom|zum|zur|im|aus|mit|für|über|Verlag|Band|Enzyklopädie|Ärzteblatt)(?![\p{L}])/u;
// Wörter mit Lage im Text; verglichen wird ohne Satzzeichen am Rand (Komma, Punkt, Klammer, Anführungszeichen, *).
const RAND = /^[.,;:()\[\]„“”«»"'’*]+|[.,;:()\[\]„“”«»"'’*]+$/g;
const woerter = (text) => [...text.matchAll(/\S+/g)].map((t) => {
  const kern = t[0].replace(RAND, '');
  const vorn = t[0].indexOf(kern);
  return { wort: kern, von: t.index + vorn, bis: t.index + vorn + kern.length };
}).filter((w) => w.wort);
// Längste gemeinsame Folgen ganzer Wörter (mindestens 2 Wörter oder ein Wort mit Merkmal) zwischen a (Deutsch) und b.
function gemeinsam(a, b) {
  const wa = woerter(a);
  const wb = woerter(b);
  const funde = [];
  const benutzt = new Set();
  for (let j = 0; j < wb.length; j++) {
    if (benutzt.has(j)) continue;
    let bestLaenge = 0;
    for (let i = 0; i < wa.length; i++) {
      let n = 0;
      while (i + n < wa.length && j + n < wb.length && wa[i + n].wort === wb[j + n].wort) n++;
      if (n > bestLaenge) bestLaenge = n;
    }
    if (!bestLaenge) continue;
    const text = b.slice(wb[j].von, wb[j + bestLaenge - 1].bis);
    for (let k = j; k < j + bestLaenge; k++) benutzt.add(k);
    // Ein einzelnes Wort zählt nur mit Umlaut, ß oder türkischem Buchstaben (sonst etwa pt „der“ = geben).
    const merkmal = bestLaenge > 1 ? DEUTSCH.test(text) : /[äöüÄÖÜß]/.test(text);
    if (merkmal || TUERKISCH.test(text)) funde.push(text);
  }
  return funde;
}
const zeichenketten = (wert) => (typeof wert === 'string' ? [wert] : Array.isArray(wert) ? wert.flatMap(zeichenketten)
  : wert && typeof wert === 'object' ? Object.entries(wert).filter(([k]) => !['url', 'kennung', 'tuerkischeBegriffe', 'fremdeBegriffe'].includes(k)).flatMap(([, v]) => zeichenketten(v)) : []);
function fremdeBegriffe(eintrag, uebersetzt) {
  const de = erklaerTexte(eintrag, 'de');
  const trQuellen = (erklaerTexte(eintrag, 'tr')?.quellen ?? []).map((q) => q.angabe).join(' | ');
  const alleDe = zeichenketten(de).join(' | ');
  const tuerkisch = new Set(uebersetzt.tuerkischeBegriffe ?? []);
  const funde = new Map();
  for (const text of zeichenketten(uebersetzt)) {
    for (const teil of gemeinsam(alleDe, text)) {
      if ([...tuerkisch].some((begriff) => begriff.includes(teil))) continue;
      // Türkisch bei türkischen Buchstaben; deutsch bei deutschen Funktionswörtern oder ß; sonst türkisch, wenn der Teil
      // so in den Quellen der türkischen Seite steht (etwa „Hürriyet Mahmure: Rüya Tabirleri“), sonst deutsch.
      const lang = TUERKISCH.test(teil) ? 'tr' : DEUTSCHE_WOERTER.test(teil) ? 'de' : trQuellen.includes(teil) ? 'tr' : 'de';
      funde.set(teil, lang);
    }
  }
  return [...funde].map(([text, lang]) => ({ text, lang }));
}

mkdirSync(ZIEL, { recursive: true });
const schreib = (datei, daten) => writeFileSync(join(ZIEL, datei), `${JSON.stringify(daten, null, 2)}\n`);
let fehlt = 0;
for (const code of SPRACHEN) {
  const je = Object.fromEntries(BEREICHE.map((bereich) => [bereich, {}]));
  const da = [];
  for (const eintrag of ERKLAERSEITEN) {
    const datei = join(QUELLE, `${eintrag.schluessel}_${code}.json`);
    if (!existsSync(datei)) continue;
    const seite = JSON.parse(readFileSync(datei, 'utf8'));
    const fremd = fremdeBegriffe(eintrag, seite);
    je[eintrag.bereich][eintrag.text] = fremd.length ? { ...seite, fremdeBegriffe: fremd } : seite;
    da.push(eintrag.schluessel);
  }
  // Sprungmarken auf Abschnitte anderer Erklärseiten: Die Kennungen sind je Sprache eigen; die deutsche Kennung im Link
  // wird durch die Kennung des Abschnitts an derselben Stelle in der Zielsprache ersetzt.
  for (const ziel of ERKLAERSEITEN) {
    const pfad = ADRESSEN[ziel.schluessel]?.[code];
    const fremd = je[ziel.bereich][ziel.text];
    const deutsch = erklaerTexte(ziel, 'de');
    if (!pfad || !fremd || !deutsch) continue;
    const ersetze = (wert) => (typeof wert === 'string'
      ? wert.replace(new RegExp(`\\]\\(${pfad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}#([a-z0-9-]+)\\)`, 'g'), (ganz, marke) => {
        const stelle = deutsch.abschnitte.findIndex((a) => a.kennung === marke);
        if (stelle < 0) return ganz;
        return `](${pfad}#${fremd.abschnitte[stelle].kennung})`;
      })
      : Array.isArray(wert) ? wert.map(ersetze)
        : wert && typeof wert === 'object' ? Object.fromEntries(Object.entries(wert).map(([k, v]) => [k, ersetze(v)])) : wert);
    for (const bereich of BEREICHE) for (const [text, seite] of Object.entries(je[bereich])) je[bereich][text] = ersetze(seite);
  }
  for (const bereich of BEREICHE) schreib(`erklaer_${bereich}_${code}.json`, je[bereich]);
  const wissen = join(QUELLE, `wissen_${code}.json`);
  if (existsSync(wissen)) schreib(`wissen_${code}.json`, JSON.parse(readFileSync(wissen, 'utf8')));
  else if (da.length) {
    console.error(`${code}: wissen_${code}.json fehlt, obwohl es Seiten gibt`);
    fehlt++;
  } else schreib(`wissen_${code}.json`, {});
  console.log(`${code}: ${da.length} Seiten (${da.join(', ')})`);
}
process.exit(fehlt ? 1 : 0);
