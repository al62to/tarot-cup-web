// Fotografiert die Seiten der Website (ganze Seite, je Handy 390 px und Desktop 1280 px) und setzt sie zu einem PDF
// für die Freigabe durch Ali zusammen (Auftrag AP-W1, Teil J Nr. 5). Lange Seiten werden in Abschnitte geteilt.
// Die Archivseiten der Rechtstexte fehlen (gleicher Text wie die gültige Fassung; der Vergleich steht im Bericht).
// Aufruf: node tools/freigabe_pdf.mjs <Adresse der Vorschau> <Ziel.pdf>
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { chromium } from 'playwright-core';
import { SEITEN } from '../src/daten/seiten.mjs';

const [basis, zielPdf] = process.argv.slice(2);
if (!basis || !zielPdf) throw new Error('Aufruf: node tools/freigabe_pdf.mjs <Adresse> <Ziel.pdf>');
const ORTE = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome'];
const chrome = ORTE.find((ort) => ort && existsSync(ort));
const arbeit = join(dirname(resolve(zielPdf)), '_freigabe_bilder');
rmSync(arbeit, { recursive: true, force: true });
mkdirSync(arbeit, { recursive: true });

const auswahl = SEITEN.filter((eintrag) => !/:\d+\.\d+$/.test(eintrag.schluessel));
const ordnung = ['start', 'tarot', 'kaffeesatz', 'sogehts', 'fragen', 'ueber', 'bildnachweis', 'app', '404', 'offenlegung'];
auswahl.sort((a, b) => {
  const rang = (e) => { const i = ordnung.indexOf(e.schluessel); return i < 0 ? 50 : i; };
  return rang(a) - rang(b) || a.sprache.localeCompare(b.sprache);
});

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const blaetter = [];
try {
  for (const eintrag of auswahl) {
    for (const [geraet, breite, dichte] of [['Handy', 390, 2], ['Desktop', 1280, 1]]) {
      const umgebung = await browser.newContext({ viewport: { width: breite, height: breite < 700 ? 844 : 900 }, deviceScaleFactor: dichte, isMobile: breite < 700, hasTouch: breite < 700, reducedMotion: 'reduce' });
      const seite = await umgebung.newPage();
      await seite.goto(basis + eintrag.pfad, { waitUntil: 'networkidle' });
      await seite.evaluate(async () => {
        for (let ort = 0; ort < document.body.scrollHeight; ort += 500) { window.scrollTo(0, ort); await new Promise((weiter) => setTimeout(weiter, 40)); }
        window.scrollTo(0, 0);
        await Promise.all([...document.images].filter((bild) => !bild.complete).map((bild) => new Promise((fertig) => { bild.onload = bild.onerror = fertig; setTimeout(fertig, 3000); })));
      });
      const name = `${eintrag.pfad.replace(/^\/|\/$/g, '').replace(/[/.]/g, '_') || 'start'}_${breite}`;
      const datei = join(arbeit, `${name}.png`);
      await seite.screenshot({ path: datei, fullPage: true });
      await umgebung.close();
      // In Abschnitte teilen: Desktop ein Abschnitt je Blatt, Handy zwei Abschnitte nebeneinander.
      const { width, height } = await sharp(datei).metadata();
      const hoehe = geraet === 'Desktop' ? Math.round(width * 1.38) : Math.round(width * 2.95);
      const teile = [];
      for (let oben = 0, nummer = 0; oben < height; oben += hoehe, nummer++) {
        const teil = join(arbeit, `${name}_${nummer}.jpg`);
        await sharp(datei).extract({ left: 0, top: oben, width, height: Math.min(hoehe, height - oben) }).jpeg({ quality: 72 }).toFile(teil);
        teile.push(teil);
      }
      rmSync(datei);
      const gruppe = geraet === 'Desktop' ? teile.map((teil) => [teil]) : teile.reduce((liste, teil, i) => (i % 2 ? liste[liste.length - 1].push(teil) : liste.push([teil]), liste), []);
      gruppe.forEach((bilder, i) => blaetter.push({ titel: `${eintrag.titel} · ${eintrag.pfad} · ${geraet} ${breite} px · ${i + 1}/${gruppe.length}`, bilder, geraet }));
      console.log(eintrag.pfad, geraet, teile.length);
    }
  }
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@page{size:A4;margin:8mm}body{margin:0;font:8pt system-ui,sans-serif;color:#1E2340}
.blatt{break-after:page;height:279mm;display:flex;flex-direction:column}.kopf{margin:0 0 2mm}
.bilder{flex:1;display:flex;gap:4mm;justify-content:center;align-items:flex-start;min-height:0}
.bilder img{max-width:100%;max-height:100%;border:1px solid #ccc}.Handy .bilder img{max-width:48%}
</style></head><body>
<div class="blatt"><h1>Tarot Cup, Website AP-W1: Fotos zur Freigabe</h1><p>Stand ${new Date().toLocaleString('de-AT')}, lokale Vorschau des Baus. Jede Seite in Deutsch und Türkisch, Handy (390 px) und Desktop (1280 px). Archivseiten der Rechtstexte nicht abgebildet (gleicher Text, Vergleich im Bericht).</p></div>
${blaetter.map((b) => `<div class="blatt ${b.geraet}"><p class="kopf">${b.titel}</p><div class="bilder">${b.bilder.map((bild) => `<img src="${pathToFileURL(bild).href}">`).join('')}</div></div>`).join('\n')}
</body></html>`;
  const htmlDatei = join(arbeit, 'freigabe.html');
  writeFileSync(htmlDatei, html);
  const seite = await browser.newPage();
  await seite.goto(pathToFileURL(htmlDatei).href, { waitUntil: 'load' });
  await seite.pdf({ path: zielPdf, format: 'A4', printBackground: true });
  console.log('geschrieben:', zielPdf, `${blaetter.length + 1} Blätter`);
} finally {
  await browser.close();
}
