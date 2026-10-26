// Lighthouse auf dem Handy (Standard von Lighthouse: mobil, gedrosselt) für die Seiten aus dem Auftrag AP-W1, Teil J
// Nr. 2: Startseite, beide Ratgeber und So geht's, je Deutsch und Türkisch. Ziel: alle vier Bereiche mindestens 90.
// Lighthouse kommt über npx (keine Abhängigkeit des Projekts), Chrome ist das lokal installierte. Liegt die Leistung
// unter 90, folgen zwei weitere Läufe; es zählt der mittlere Wert (Leistung schwankt mit der Last des Rechners).
// Aufruf: node tools/lighthouse_lauf.mjs <Zielordner> <Adresse der Vorschau> [Pfad ...]
// In Git Bash MSYS_NO_PATHCONV=1 davor setzen.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [ziel, vorschau, ...eigene] = process.argv.slice(2);
if (!ziel || !vorschau) throw new Error('Aufruf: node tools/lighthouse_lauf.mjs <Zielordner> <Adresse> [Pfad ...]');
const PFADE = eigene.length ? eigene : ['/', '/tr/', '/tarot/', '/tr/tarot/', '/kaffeesatz-lesen/', '/tr/kahve-fali/', '/so-gehts/', '/tr/nasil-kullanilir/'];
const BEREICHE = ['performance', 'accessibility', 'best-practices', 'seo'];
const MINDESTENS = 90;
const ORTE = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome'];
const chrome = ORTE.find((ort) => ort && existsSync(ort));
mkdirSync(ziel, { recursive: true });

function lauf(pfad, nummer) {
  const datei = join(ziel, `${pfad.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'start'}-${nummer}.json`);
  execFileSync('npx', ['--yes', 'lighthouse', vorschau + pfad, '--quiet', '--output=json', `--output-path=${datei}`,
    `--only-categories=${BEREICHE.join(',')}`, '--chrome-flags=--headless=new'],
  { stdio: ['ignore', 'ignore', 'inherit'], shell: true, env: { ...process.env, CHROME_PATH: chrome } });
  const daten = JSON.parse(readFileSync(datei, 'utf8'));
  return Object.fromEntries(BEREICHE.map((bereich) => [bereich, Math.round((daten.categories[bereich]?.score ?? 0) * 100)]));
}

const zeilen = ['| Seite | Leistung | Bedienungshilfen | Best Practices | SEO | Läufe Leistung |', '|---|---|---|---|---|---|'];
let unter = 0;
for (const pfad of PFADE) {
  const erste = lauf(pfad, 1);
  const leistung = [erste.performance];
  if (erste.performance < MINDESTENS) leistung.push(lauf(pfad, 2).performance, lauf(pfad, 3).performance);
  const mitte = [...leistung].sort((a, b) => a - b)[Math.floor(leistung.length / 2)];
  const werte = { ...erste, performance: mitte };
  // SEO zählt nur, wenn die Seite im Index stehen darf; vor der Freigabe (E8) trägt sie noindex und verliert dort Punkte.
  if (BEREICHE.some((bereich) => werte[bereich] < MINDESTENS)) unter++;
  zeilen.push(`| \`${pfad}\` | ${werte.performance} | ${werte.accessibility} | ${werte['best-practices']} | ${werte.seo} | ${leistung.join(', ')} |`);
  console.log(zeilen.at(-1));
}
const text = `${zeilen.join('\n')}\n\nGerät: Handy (Lighthouse-Standard), Chrome ${chrome}. ${unter ? `${unter} Seite(n) unter ${MINDESTENS}.` : `Alle Werte mindestens ${MINDESTENS}.`}\n`;
writeFileSync(join(ziel, 'lighthouse.md'), text);
console.log(text);
