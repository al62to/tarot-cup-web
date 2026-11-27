// Gibt die deutschen Texte der Erklärseiten als JSON aus (AP-WS1), als Quelle für die Übersetzung nach en, es und pt.
// Je Seite eine Datei <schluessel>_de.json im Zielordner, dazu adressen.json (Schlüssel -> Adressen je Sprache).
// Aufruf (aus tarot-cup-web): node tools/erklaer_ausgeben.mjs <Zielordner> [schluessel,schluessel,...]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ERKLAERSEITEN, erklaerTexte } from '../src/daten/erklaer.mjs';
import { ADRESSEN } from '../src/daten/adressen.mjs';

const ziel = resolve(process.argv[2] ?? '.');
const nur = process.argv[3] ? new Set(process.argv[3].split(',')) : null;
mkdirSync(ziel, { recursive: true });
let anzahl = 0;
for (const eintrag of ERKLAERSEITEN) {
  if (nur && !nur.has(eintrag.schluessel)) continue;
  const texte = erklaerTexte(eintrag, 'de');
  if (!texte) continue;
  writeFileSync(join(ziel, `${eintrag.schluessel}_de.json`), `${JSON.stringify(texte, null, 2)}\n`);
  anzahl++;
}
writeFileSync(join(ziel, 'adressen.json'), `${JSON.stringify(ADRESSEN, null, 2)}\n`);
console.log(`${anzahl} Seiten nach ${ziel}`);
