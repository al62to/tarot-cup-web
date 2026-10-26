// Baut die Vorschaubilder für Open Graph (1200 x 630) je Seite und Sprache nach public/bilder/teilen/<schluessel>-
// <sprache>.jpg (Schlüssel und Pfade: src/daten/seiten.mjs, Feld "bild"). Stil wie das Titelbild 8.5:
//  - Startseite und übrige Seiten: Bühne nach 8.5 (helles Dreieck mit drei Originalkarten im Fächer, Diagonale mit
//    Goldlinie, Kaffeebraun mit Tasse und Dampf), dazu die Zeile und die Überschrift der Sprache (Startseite) oder der
//    ogTitel der Seite (übrige Seiten), darunter eine Goldlinie.
//  - Ratgeber Tarot: Nachtblau wie der Ritualmodus der App, Kartenfächer (Narr, Hohepriesterin, Eremit) vor feinen
//    Kreisen.
//  - Ratgeber Kaffeesatz: Kaffeebraun, Tassenkarte von oben und die Tasse mit Dampf.
// Nur lokale Dateien (Schriften aus node_modules, Kartenbilder aus public/bilder/karten), keine Anfrage ins Netz. Chrome
// ist das lokal installierte (tools/chrome.mjs), es wird nichts heruntergeladen. JPEG über sharp, ohne Metadaten, unter
// 200 KB (sonst bricht das Werkzeug ab). Aufruf (aus tarot-cup-web): node tools/teilen_bilder.mjs
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { chromePfad } from './chrome.mjs';
import { SEITEN } from '../src/daten/seiten.mjs';
import { seite } from '../src/daten/seite.mjs';
import { start } from '../src/daten/texte/start.mjs';
import { GESPERRT, TITELKARTEN } from '../src/daten/karten.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const { breite: B, hoehe: H } = seite.teilen;
const datei = (...teile) => pathToFileURL(join(WURZEL, ...teile)).href;
const karte = (id) => {
  if (GESPERRT.includes(id)) throw new Error(`Gesperrte Karte: ${id}`);
  return datei('public', 'bilder', 'karten', `${id}-480.webp`);
};
const schutz = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Zeile in Großbuchstaben: „Android“ mit lang="en", damit es auf Türkisch nicht zu „ANDROİD“ wird.
const zeileHtml = (text) => schutz(text).replace(/Android/g, '<span lang="en">Android</span>');

const SCHRIFTEN = `
@font-face { font-family: "CG"; font-weight: 600; src: url("${datei('node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2')}") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: "CG"; font-weight: 600; src: url("${datei('node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-600-normal.woff2')}") format("woff2"); unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: "IN"; font-weight: 100 900; src: url("${datei('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: "IN"; font-weight: 100 900; src: url("${datei('node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2')}") format("woff2"); unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }`;

const TASSE = `
  <path d="M42 30 Q37 23 42 16 Q47 9 42 2" fill="none" stroke="#D2B47A" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
  <path d="M56 30 Q51 23 56 16 Q61 9 56 2" fill="none" stroke="#D2B47A" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
  <path d="M22 36 H78 V48 A28 22 0 0 1 22 48 Z" fill="#F3EAD7"/>
  <ellipse cx="50" cy="36" rx="28" ry="5" fill="#5A3A26"/>
  <path d="M30 42 H70" stroke="#C9A86A" stroke-width="0.8"/>
  <path d="M78 41 H84 A8.5 8.5 0 0 1 84 58 H76" fill="none" stroke="#F3EAD7" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M10 76 Q50 86 90 76" fill="none" stroke="#F3EAD7" stroke-width="4.5" stroke-linecap="round"/>`;
const STERN = 'M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z';

const GRUND = `
* { box-sizing: border-box; margin: 0; }
body { width: ${B}px; height: ${H}px; overflow: hidden; position: relative; font-family: "IN", sans-serif; font-variant-numeric: lining-nums; }
.zeile { font: 600 15px/1.3 "IN", sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: #D2B47A; }
h1 { font: 600 52px/1.05 "CG", serif; color: #F5F0E6; }
.linie { width: 150px; height: 2px; background: #D2B47A; }
.text { position: absolute; display: flex; flex-direction: column; gap: 18px; }
.karte { position: absolute; object-fit: cover; border: 2px solid #D2B47A; border-radius: 10px; box-shadow: 0 16px 32px rgba(30,35,64,0.32); }`;

// Bühne nach 8.5, in Einheiten des Entwurfs (1280 breit; 1200 x 630 entspricht 1280 x 672).
function buehne({ zeile, titel, sprache }) {
  const e = B / 1280;
  const k = (links, oben, drehung) => `left:${links * e}px;top:${oben * e}px;width:${179 * e}px;height:${288 * e}px;transform:rotate(${drehung}deg)`;
  return `<!doctype html><html lang="${sprache}"><meta charset="utf-8"><style>${SCHRIFTEN}${GRUND}
body { background: #2B1D16; }
.hell { position: absolute; inset: 0; background: #F5F0E6; clip-path: polygon(0 0, 100% 0, 0 100%); }
svg.voll { position: absolute; inset: 0; width: ${B}px; height: ${H}px; }
h1 { font-size: ${44 * e * 1.08}px; }
</style><body>
<div class="hell"></div>
<svg class="voll" viewBox="0 0 1280 672"><g stroke="#A8823F" fill="none" opacity="0.28"><circle cx="331" cy="210" r="256"/><circle cx="331" cy="210" r="228" stroke-dasharray="1 7"/><circle cx="331" cy="210" r="150"/></g><g fill="#A8823F" opacity="0.4"><path d="${STERN}" transform="translate(700 85)"/><path d="${STERN}" transform="translate(50 440) scale(0.8)"/></g></svg>
<img class="karte" src="${karte(TITELKARTEN[0])}" style="${k(125, 66, -12)}">
<img class="karte" src="${karte(TITELKARTEN[1])}" style="${k(244, 41, 0)}">
<img class="karte" src="${karte(TITELKARTEN[2])}" style="${k(362, 66, 12)}">
<svg class="voll" viewBox="0 0 1280 672"><path d="M1284 -2.1 L-4 674.1" stroke="#D2B47A" stroke-width="3"/></svg>
<svg style="position:absolute;left:${1010 * e}px;top:${330 * e}px;width:${250 * e}px;height:${250 * e}px" viewBox="0 0 100 100">${TASSE}</svg>
<div class="text" style="left:${580 * e}px;top:${396 * e}px;width:${430 * e}px"><p class="zeile">${zeileHtml(zeile)}</p><h1>${titel.map(schutz).join('<br>')}</h1><div class="linie"></div></div>
</body></html>`;
}

function tarotBild({ zeile, titel, sprache }) {
  const kk = (id, links, oben, drehung) => `<img class="karte" src="${karte(id)}" style="left:${links}px;top:${oben}px;width:196px;height:315px;transform:rotate(${drehung}deg);box-shadow:0 18px 36px rgba(0,0,0,0.5)">`;
  return `<!doctype html><html lang="${sprache}"><meta charset="utf-8"><style>${SCHRIFTEN}${GRUND}
body { background: #12162B; }
h1 { font-size: 60px; color: #EDE6D6; }
</style><body>
<svg style="position:absolute;left:560px;top:-25px;width:680px;height:680px" viewBox="0 0 400 400"><g stroke="#D2B47A" fill="none" opacity="0.2"><circle cx="200" cy="200" r="190"/><circle cx="200" cy="200" r="168" stroke-dasharray="1 7"/><circle cx="200" cy="200" r="112"/><path d="M10 200h380M200 10v380"/></g></svg>
<svg style="position:absolute;inset:0" width="${B}" height="${H}"><g fill="#D2B47A" opacity="0.5"><path d="${STERN}" transform="translate(110 520) scale(0.8)"/><path d="${STERN}" transform="translate(540 90) scale(0.6)"/></g></svg>
${kk('ta_00_narr', 668, 168, -12)}${kk('ta_02_hohepriesterin', 800, 140, 0)}${kk('ta_09_eremit', 932, 168, 12)}
<div class="text" style="left:80px;top:0;bottom:0;justify-content:center;width:520px"><p class="zeile">${zeileHtml(zeile)}</p><h1>${schutz(titel.join(' '))}</h1><div class="linie"></div></div>
</body></html>`;
}

function kaffeeBild({ zeile, titel, sprache }) {
  return `<!doctype html><html lang="${sprache}"><meta charset="utf-8"><style>${SCHRIFTEN}${GRUND}
body { background: #2B1D16; }
h1 { font-size: 60px; color: #F1E6D8; }
</style><body>
<svg style="position:absolute;left:590px;top:70px;width:440px;height:500px" viewBox="6 0 278 318">
  <ellipse cx="125" cy="282" rx="86" ry="26" fill="#F3EAD7" stroke="#C9A86A" stroke-width="1.4"/>
  <ellipse cx="125" cy="282" rx="40" ry="11" fill="none" stroke="#C9A86A" stroke-dasharray="3 4"/>
  <circle cx="125" cy="125" r="112" fill="#F3EAD7" stroke="#C9A86A" stroke-width="1.4"/>
  <circle cx="125" cy="125" r="75" fill="none" stroke="#C9A86A" stroke-dasharray="3 4"/>
  <circle cx="125" cy="125" r="38" fill="none" stroke="#C9A86A" stroke-dasharray="3 4"/>
  <path d="M125 13v224" stroke="#C9A86A" stroke-dasharray="2 5"/>
  <path d="M237 104h14a21 21 0 0 1 0 42h-14" fill="none" stroke="#C9A86A" stroke-width="6" stroke-linecap="round"/>
  <g fill="#5A3A26" opacity="0.75"><circle cx="92" cy="58" r="3"/><circle cx="160" cy="92" r="2.2"/><circle cx="104" cy="150" r="2.6"/><circle cx="150" cy="176" r="1.8"/><circle cx="70" cy="120" r="1.6"/></g>
</svg>
<svg style="position:absolute;left:950px;top:360px;width:220px;height:220px" viewBox="0 0 100 100">${TASSE}</svg>
<svg style="position:absolute;inset:0" width="${B}" height="${H}"><g fill="#C9915A" opacity="0.55"><circle cx="96" cy="540" r="3"/><circle cx="114" cy="526" r="1.8"/><circle cx="580" cy="96" r="2.4"/></g></svg>
<div class="text" style="left:80px;top:0;bottom:0;justify-content:center;width:520px"><p class="zeile">${zeileHtml(zeile)}</p><h1>${schutz(titel.join(' '))}</h1><div class="linie"></div></div>
</body></html>`;
}

// Ein Bild je Datei; die Seite, die das Bild zuerst nennt, gibt Art und Titel vor (Startseite vor Offenlegung).
const auftraege = new Map();
for (const eintrag of SEITEN) {
  if (!eintrag.bild?.startsWith('/bilder/teilen/') || auftraege.has(eintrag.bild)) continue;
  const name = eintrag.bild.split('/').pop().replace(/\.jpg$/, '');
  const [schluessel, sprache] = name.split(/-(?=[a-z]{2}$)/);
  const zeile = start[sprache].kopf.zeile;
  const titel = schluessel === 'start' ? start[sprache].kopf.zeilen : [eintrag.bildAlt.replace(/\s*\|\s*Tarot Cup$/, '')];
  const vorlage = schluessel === 'tarot' ? tarotBild : schluessel === 'kaffeesatz' ? kaffeeBild : buehne;
  auftraege.set(eintrag.bild, { name, html: vorlage({ zeile, titel, sprache }) });
}

const arbeit = join(WURZEL, 'node_modules', '.teilen_bilder');
mkdirSync(arbeit, { recursive: true });
mkdirSync(join(WURZEL, 'public', 'bilder', 'teilen'), { recursive: true });
const browser = await chromium.launch({ executablePath: chromePfad(), headless: true });
try {
  const blatt = await browser.newPage({ viewport: { width: B, height: H }, deviceScaleFactor: 1 });
  for (const [bild, { name, html }] of auftraege) {
    const vorlage = join(arbeit, `${name}.html`);
    writeFileSync(vorlage, html, 'utf8');
    await blatt.goto(pathToFileURL(vorlage).href, { waitUntil: 'load' });
    await blatt.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((b) => b.decode().catch(() => {}))); });
    const roh = await blatt.screenshot({ type: 'png' });
    const ziel = join(WURZEL, 'public', bild);
    await sharp(roh).jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:2:0' }).toFile(ziel);
    const groesse = statSync(ziel).size;
    if (groesse >= 200 * 1024) throw new Error(`${bild}: ${Math.round(groesse / 1024)} KB, erlaubt sind unter 200 KB`);
    console.log(`${bild} ${Math.round(groesse / 1024)} KB`);
  }
} finally {
  await browser.close();
}
