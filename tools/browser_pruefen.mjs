// Prüft im Browser (playwright-core mit dem lokal installierten Chrome; nichts wird heruntergeladen) Cookies, Speicher und
// Anfragen an andere Hosts, getrennt nach der Wahl im Hinweis zur Einwilligung (Auftrag AP-W1, Teil J Nr. 3 und 6;
// seit W7 mit Einwilligung):
//  A. Vor jeder Wahl, je Seite (390 und 1280 px): Status 200, Hinweis sichtbar, keine Cookies, nichts im Speicher des
//     Browsers, keine Anfrage an einen anderen Host. Dazu je Seite laden, durchscrollen, Menü und Teilen-Knopf antippen.
//  B. Nach „Ablehnen“: nur cc_cookie, keine fremden Anfragen, auch nach Seitenwechsel; der Hinweis kommt nicht wieder.
//  C. Nach „Alle akzeptieren“: cc_cookie, _ga, _ga_*; Anfragen nur an www.googletagmanager.com und *.google-analytics.com
//     (auch nach Seitenwechsel); ein Klick auf das Abzeichen von Google Play sendet store_klick mit sprache und ort.
//  D. Widerruf über „Cookie-Einstellungen“ in der Fußzeile: Statistik aus, speichern; danach keine _ga-Cookies mehr und
//     keine Anfragen an Google, auch nach Seitenwechsel.
// Achtung: C sendet echte Aufrufe an Google Analytics (Property „Tarot Cup“, Web-Datenstrom tarot-cup.com).
// Aufruf: node tools/browser_pruefen.mjs <Adresse, z. B. http://localhost:4323 oder https://tarot-cup.com> [Bericht.md] [--nur-einwilligung]
import { existsSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { SEITEN } from '../src/daten/seiten.mjs';

const argumente = process.argv.slice(2);
const nurEinwilligung = argumente.includes('--nur-einwilligung');
const [basis, bericht] = argumente.filter((wert) => !wert.startsWith('--'));
if (!basis) throw new Error('Aufruf: node tools/browser_pruefen.mjs <Adresse> [Bericht.md] [--nur-einwilligung]');
const ORTE = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const chrome = ORTE.find((ort) => ort && existsSync(ort));
if (!chrome) throw new Error('Kein Chrome gefunden (CHROME_PATH setzen).');

const host = new URL(basis).host;
const GOOGLE = /^(www\.googletagmanager\.com|([a-z0-9-]+\.)*google-analytics\.com)$/;
const pfade = [...SEITEN.map((eintrag) => eintrag.pfad), '/sitemap.xml', '/robots.txt', '/llms.txt', '/tr/llms.txt'];
// CookieConsent zeigt sich automatisierten Browsern nicht (hideFromBots prüft navigator.webdriver); ohne diesen
// Schalter sieht der Test die Website wie ein Mensch.
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--disable-blink-features=AutomationControlled'] });
const zeilen = [];
let fehler = 0;
const befund = (text) => { fehler++; zeilen.push(`- Befund: ${text}`); };

// Neue Umgebung mit Mitschnitt aller Anfragen an andere Hosts.
async function umgebungMitMitschnitt(optionen = {}) {
  const umgebung = await browser.newContext(optionen);
  const fremd = [];
  umgebung.on('request', (anfrage) => {
    const ziel = new URL(anfrage.url());
    if (!['http:', 'https:'].includes(ziel.protocol) || ziel.host === host) return;
    fremd.push({ host: ziel.host, url: anfrage.url(), daten: anfrage.postData() ?? '' });
  });
  return { umgebung, fremd };
}
const cookieNamen = async (umgebung) => (await umgebung.cookies()).map((cookie) => cookie.name).sort();
const hinweisSichtbar = (seite) => seite.locator('#cc-main .cm').isVisible().catch(() => false);
const warte = (ms) => new Promise((weiter) => setTimeout(weiter, ms));

try {
  // A: vor jeder Wahl, alle Seiten.
  if (!nurEinwilligung) {
    zeilen.push('### A. Vor jeder Wahl', '', '| Seite | Status | Hinweis | Cookies | Speicher | fremde Anfragen |', '|---|---|---|---|---|---|');
    for (const pfad of pfade) {
      for (const breite of [390, 1280]) {
        const { umgebung, fremd } = await umgebungMitMitschnitt({ viewport: { width: breite, height: 900 }, isMobile: breite < 700, hasTouch: breite < 700 });
        const seite = await umgebung.newPage();
        const antwort = await seite.goto(basis + pfad, { waitUntil: 'networkidle' });
        const status = antwort?.status() ?? 0;
        const istSeite = pfad.endsWith('/') || pfad.endsWith('.html');
        let hinweis = '-';
        if (istSeite) {
          const mitFuss = await seite.locator('footer').count();
          hinweis = mitFuss ? ((await seite.locator('#cc-main .cm').waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false)) ? 'ja' : 'nein') : '-';
          await seite.evaluate(async () => {
            for (let ort = 0; ort < document.body.scrollHeight; ort += 500) { window.scrollTo(0, ort); await new Promise((weiter) => setTimeout(weiter, 30)); }
          });
          // Das Menü zuletzt: Offen deckt es am Handy die Seite ab, auch den Teilen-Knopf im Fuß. Der Hinweis zur
          // Einwilligung liegt unten über der Seite; Klicks gehen mit force durch, gewählt wird hier nichts.
          for (const wahl of ['[data-teilen-knopf]', 'details summary', '[data-menue]']) {
            const element = seite.locator(wahl).first();
            if (await element.count() && await element.isVisible()) await element.click({ force: true }).catch(() => {});
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
        const gut = status === 200 && cookies === 0 && belegt === 0 && fremd.length === 0 && hinweis !== 'nein';
        if (!gut) fehler++;
        if (breite === 390 || !gut) zeilen.push(`| \`${pfad}\` (${breite}) | ${status} | ${hinweis} | ${cookies} | ${belegt} | ${fremd.length ? fremd.map((eintrag) => eintrag.url).join(', ') : 0} |`);
        await umgebung.close();
      }
    }
    // Unbekannte Adresse: 404 mit der eigenen Seite.
    const umgebung = await browser.newContext();
    const seite = await umgebung.newPage();
    const antwort = await seite.goto(`${basis}/gibt-es-nicht-${Date.now()}/`);
    zeilen.push(`| unbekannte Adresse | ${antwort?.status()} | | | | Titel „${await seite.title()}“ |`, '');
    await umgebung.close();
  }

  // B: Ablehnen.
  {
    zeilen.push('### B. Nach „Ablehnen“', '');
    const { umgebung, fremd } = await umgebungMitMitschnitt();
    const seite = await umgebung.newPage();
    await seite.goto(`${basis}/`, { waitUntil: 'networkidle' });
    await seite.locator('#cc-main .cm button[data-role="necessary"]').click();
    await seite.waitForTimeout(500);
    const nachWahl = await cookieNamen(umgebung);
    await seite.goto(`${basis}/tarot/`, { waitUntil: 'networkidle' });
    const hinweis = await hinweisSichtbar(seite);
    await seite.goto(`${basis}/en/`, { waitUntil: 'networkidle' });
    const nachWechsel = await cookieNamen(umgebung);
    zeilen.push(`- Cookies nach der Wahl: ${nachWahl.join(', ') || 'keine'}; nach zwei Seitenwechseln: ${nachWechsel.join(', ') || 'keine'}`);
    zeilen.push(`- Hinweis nach Seitenwechsel sichtbar: ${hinweis ? 'ja' : 'nein'}`);
    zeilen.push(`- Fremde Anfragen: ${fremd.length ? fremd.map((eintrag) => eintrag.url).join(', ') : 'keine'}`, '');
    if (nachWahl.join() !== 'cc_cookie' || nachWechsel.join() !== 'cc_cookie') befund('B: andere Cookies als cc_cookie');
    if (hinweis) befund('B: Hinweis kommt nach der Wahl wieder');
    if (fremd.length) befund('B: fremde Anfragen nach „Ablehnen“');
    await umgebung.close();
  }

  // C und D: Alle akzeptieren, Abzeichen, Seitenwechsel, Widerruf.
  {
    zeilen.push('### C. Nach „Alle akzeptieren“', '');
    const { umgebung, fremd } = await umgebungMitMitschnitt({ viewport: { width: 1280, height: 900 } });
    const seite = await umgebung.newPage();
    await seite.goto(`${basis}/`, { waitUntil: 'networkidle' });
    const vorher = fremd.length;
    await seite.locator('#cc-main .cm button[data-role="all"]').click();
    await seite.waitForLoadState('networkidle');
    await seite.waitForTimeout(2500);
    const nachZustimmung = await cookieNamen(umgebung);
    // Klick auf das Abzeichen im Titelbild, ohne Google Play zu öffnen (der eigene Klick-Abhörer läuft vorher).
    await seite.evaluate(() => document.addEventListener('click', (ereignis) => ereignis.preventDefault()));
    const abzeichen = seite.locator('a.store-abzeichen[data-store-ort="kopf"]').first();
    let storeKlick = null;
    if (await abzeichen.count()) {
      await abzeichen.click();
      storeKlick = await seite.evaluate(() => (window.dataLayer || []).filter((eintrag) => eintrag && eintrag.event === 'store_klick').at(-1) || null);
      for (let runde = 0; runde < 20 && !fremd.some((eintrag) => /en=store_klick/.test(eintrag.url + eintrag.daten)); runde++) await warte(500);
    }
    const storeGesendet = fremd.some((eintrag) => /en=store_klick/.test(eintrag.url + eintrag.daten));
    await seite.goto(`${basis}/so-gehts/`, { waitUntil: 'networkidle' });
    // Google Analytics sendet den Seitenaufruf der zweiten Seite oft erst nach einigen Sekunden.
    for (let runde = 0; runde < 30 && !fremd.some((eintrag) => /en=page_view/.test(eintrag.url + eintrag.daten) && /so-gehts/.test(decodeURIComponent(eintrag.url + eintrag.daten))); runde++) await warte(500);
    const nachWechsel = await cookieNamen(umgebung);
    const hosts = [...new Set(fremd.map((eintrag) => eintrag.host))].sort();
    const andere = hosts.filter((name) => !GOOGLE.test(name));
    const seitenaufrufe = fremd.filter((eintrag) => /en=page_view/.test(eintrag.url + eintrag.daten)).length;
    zeilen.push(`- Fremde Anfragen vor dem Klick: ${vorher}`);
    zeilen.push(`- Cookies nach der Zustimmung: ${nachZustimmung.join(', ')}; nach Seitenwechsel: ${nachWechsel.join(', ')}`);
    zeilen.push(`- Hosts der Anfragen: ${hosts.join(', ') || 'keine'}`);
    zeilen.push(`- page_view gesendet: ${seitenaufrufe}`);
    zeilen.push(`- store_klick in dataLayer: ${storeKlick ? JSON.stringify(storeKlick) : 'nein'}; an Google Analytics gesendet: ${storeGesendet ? 'ja' : 'nein'}`, '');
    if (vorher) befund('C: fremde Anfragen vor der Zustimmung');
    const gaErwartet = (liste) => liste.includes('cc_cookie') && liste.includes('_ga') && liste.some((name) => /^_ga_/.test(name)) && liste.every((name) => name === 'cc_cookie' || /^_ga(_|$)/.test(name));
    if (!gaErwartet(nachZustimmung) || !gaErwartet(nachWechsel)) befund('C: Cookies nicht genau cc_cookie, _ga, _ga_*');
    if (andere.length) befund(`C: Anfragen an andere Hosts: ${andere.join(', ')}`);
    if (seitenaufrufe < 2) befund('C: weniger als zwei page_view');
    if (!storeKlick || storeKlick.ort !== 'titelbild' || !storeKlick.sprache || !storeGesendet) befund('C: store_klick fehlt oder unvollständig');

    zeilen.push('### D. Widerruf über „Cookie-Einstellungen“', '');
    await seite.locator('footer a[data-cc="show-preferencesModal"]').click();
    await seite.locator('#cc-main .pm').waitFor({ state: 'visible' });
    const schalter = seite.locator('#cc-main .pm input.section__toggle[value="statistik"]');
    if (await schalter.isChecked()) await seite.locator('#cc-main .pm label:has(input.section__toggle[value="statistik"])').click();
    const anzahl = fremd.length;
    await Promise.all([seite.waitForEvent('load'), seite.locator('#cc-main .pm button[data-role="save"]').click()]);
    await seite.waitForLoadState('networkidle');
    await seite.waitForTimeout(1500);
    const nachWiderruf = await cookieNamen(umgebung);
    await seite.goto(`${basis}/kaffeesatz-lesen/`, { waitUntil: 'networkidle' });
    await seite.waitForTimeout(1500);
    const nachWechselD = await cookieNamen(umgebung);
    const neu = fremd.slice(anzahl);
    zeilen.push(`- Cookies nach dem Widerruf: ${nachWiderruf.join(', ')}; nach Seitenwechsel: ${nachWechselD.join(', ')}`);
    zeilen.push(`- Fremde Anfragen nach dem Widerruf: ${neu.length ? neu.map((eintrag) => eintrag.url.slice(0, 80)).join(', ') : 'keine'}`, '');
    if (nachWiderruf.join() !== 'cc_cookie' || nachWechselD.join() !== 'cc_cookie') befund('D: _ga-Cookies nach dem Widerruf noch da');
    if (neu.length) befund('D: Anfragen an Google nach dem Widerruf');
    await umgebung.close();
  }
} finally {
  await browser.close();
}
const text = `${zeilen.join('\n')}\n\n${fehler ? `${fehler} Befund(e)` : `Alles wie erwartet${nurEinwilligung ? ' (nur B bis D)' : ' (A je 390 und 1280 px, B bis D)'}.`}\n`;
console.log(text);
if (bericht) writeFileSync(bericht, text);
process.exit(fehler ? 1 : 0);
