// Prüft im Browser (playwright-core mit dem lokal installierten Chrome; nichts wird heruntergeladen), dass keine Seite
// Cookies setzt, etwas im Speicher des Browsers ablegt oder etwas von einem anderen Host lädt (Auftrag AP-W1, Teil J
// Nr. 3 und 6). Je Seite: laden, durchscrollen, Menü und Teilen-Knopf antippen, dann Cookies, localStorage,
// sessionStorage, IndexedDB, Cache Storage und alle Anfragen ansehen. Dazu die Antwort 200 je Seite.
// Aufruf: node tools/browser_pruefen.mjs <Adresse, z. B. http://localhost:4321 oder https://tarot-cup.com> [Bericht.md]
import { existsSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { SEITEN } from '../src/daten/seiten.mjs';

const [basis, bericht] = process.argv.slice(2);
if (!basis) throw new Error('Aufruf: node tools/browser_pruefen.mjs <Adresse> [Bericht.md]');
const ORTE = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const chrome = ORTE.find((ort) => ort && existsSync(ort));
if (!chrome) throw new Error('Kein Chrome gefunden (CHROME_PATH setzen).');

const host = new URL(basis).host;
const pfade = [...SEITEN.map((eintrag) => eintrag.pfad), '/sitemap.xml', '/robots.txt', '/llms.txt', '/tr/llms.txt'];
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const zeilen = ['| Seite | Status | Cookies | Speicher | fremde Anfragen |', '|---|---|---|---|---|'];
let fehler = 0;
try {
  for (const pfad of pfade) {
    for (const breite of [390, 1280]) {
      const umgebung = await browser.newContext({ viewport: { width: breite, height: 900 }, isMobile: breite < 700, hasTouch: breite < 700 });
      const seite = await umgebung.newPage();
      const fremd = [];
      seite.on('request', (anfrage) => {
        const ziel = new URL(anfrage.url());
        if (!['http:', 'https:'].includes(ziel.protocol)) return;
        if (ziel.host !== host) fremd.push(anfrage.url());
      });
      const antwort = await seite.goto(basis + pfad, { waitUntil: 'networkidle' });
      const status = antwort?.status() ?? 0;
      if (pfad.endsWith('/') || pfad.endsWith('.html')) {
        await seite.evaluate(async () => {
          for (let ort = 0; ort < document.body.scrollHeight; ort += 500) { window.scrollTo(0, ort); await new Promise((weiter) => setTimeout(weiter, 30)); }
        });
        // Das Menü zuletzt: Offen deckt es am Handy die Seite ab, auch den Teilen-Knopf im Fuß.
        for (const wahl of ['[data-teilen-knopf]', 'details summary', '[data-menue]']) {
          const element = seite.locator(wahl).first();
          if (await element.count() && await element.isVisible()) await element.click({ trial: false }).catch(() => {});
        }
        await seite.waitForTimeout(200);
      }
      const speicher = await seite.evaluate(async () => {
        const dbs = indexedDB.databases ? (await indexedDB.databases()).length : 0;
        const caches_ = 'caches' in window ? (await caches.keys()).length : 0;
        return { lokal: localStorage.length, sitzung: sessionStorage.length, dbs, caches: caches_, cookie: document.cookie };
      }).catch(() => ({ lokal: 0, sitzung: 0, dbs: 0, caches: 0, cookie: '' }));
      const cookies = (await umgebung.cookies()).length + (speicher.cookie ? 1 : 0);
      const belegt = speicher.lokal + speicher.sitzung + speicher.dbs + speicher.caches;
      const gut = status === 200 && cookies === 0 && belegt === 0 && fremd.length === 0;
      // Die 404-Seite selbst liefert 200 als Datei; unter einer unbekannten Adresse kommt 404 (eigene Probe unten).
      if (!gut) fehler++;
      if (breite === 390 || !gut) zeilen.push(`| \`${pfad}\` (${breite}) | ${status} | ${cookies} | ${belegt} | ${fremd.length ? fremd.join(', ') : 0} |`);
      await umgebung.close();
    }
  }
  // Unbekannte Adresse: 404 mit der eigenen Seite.
  const umgebung = await browser.newContext();
  const seite = await umgebung.newPage();
  const antwort = await seite.goto(`${basis}/gibt-es-nicht-${Date.now()}/`);
  const titel = await seite.title();
  zeilen.push(`| unbekannte Adresse | ${antwort?.status()} | | | Titel „${titel}“ |`);
  await umgebung.close();
} finally {
  await browser.close();
}
const text = `${zeilen.join('\n')}\n\n${fehler ? `${fehler} Befund(e)` : 'Alle Seiten: Status 200, keine Cookies, kein Speicher, keine fremden Anfragen (je 390 und 1280 px).'}\n`;
console.log(text);
if (bericht) writeFileSync(bericht, text);
process.exit(fehler ? 1 : 0);
