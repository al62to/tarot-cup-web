// Tag der letzten Änderung einer Seite für sitemap.xml: das Git-Datum ihrer Quelldateien (Muster FoodAsu). Es zählt der
// jüngste Commit, der eine davon geändert hat. Gestaltung, die alle Seiten gleich betrifft (Grundlayout, Kopf, Fuß,
// Stile), zählt nicht. Eine Datei mit Änderungen, die noch in keinem Commit stehen, zählt mit dem heutigen Tag.
// Der Bau braucht dafür die ganze Git-Geschichte: Der Workflow holt sie mit "fetch-depth: 0". Fehlt sie, bricht der
// Bau ab.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const WURZEL = process.cwd();
const git = (...werte) => execFileSync('git', werte, { cwd: WURZEL, encoding: 'utf8' }).trim();

let geprueft = false;
const jeDatei = new Map();
function tagVon(datei) {
  if (jeDatei.has(datei)) return jeDatei.get(datei);
  if (!geprueft) {
    if (git('rev-parse', '--is-shallow-repository') === 'true') throw new Error('Stand: Die Git-Geschichte ist unvollständig (im Workflow "fetch-depth: 0" setzen)');
    geprueft = true;
  }
  if (!existsSync(join(WURZEL, datei))) throw new Error(`Stand: Quelldatei fehlt: ${datei}`);
  const heute = new Date().toLocaleDateString('sv-SE');
  const offen = git('status', '--porcelain', '--', datei) !== '';
  const tag = offen ? heute : git('log', '-1', '--format=%cs', '--', datei);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tag)) throw new Error(`Stand: kein Git-Datum für ${datei}`);
  jeDatei.set(datei, tag);
  return tag;
}

// Tag der letzten Änderung einer Seite (Liste ihrer Quelldateien aus src/daten/seiten.mjs), als JJJJ-MM-TT.
export const standVon = (quellen) => {
  if (!quellen?.length) throw new Error('Stand: keine Quelldateien angegeben');
  return quellen.map(tagVon).sort().at(-1);
};
