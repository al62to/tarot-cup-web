// Prüft die Android-Weiche /app/ (AP-26) im fertigen Bau mit echtem Chrome: Weiterleitung je Browser-Kennung, mit und ohne
// ?von=, unbekannte Werte, Reihenfolge der Sprachen, QR-Code nur am Computer, Links auf die Erklärseiten. Google Play wird
// nie geladen: Anfragen dorthin werden abgefangen und nur die Adresse gemerkt.
// Aufruf (aus tarot-cup-web, nach npm run build): node tools/app_weiche_pruefen.mjs [dist]
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import { chromePfad } from './chrome.mjs';

const ORDNER = process.argv[2] ?? 'dist';
const PORT = 4391;
const BASIS = `http://127.0.0.1:${PORT}`;

const UA = {
  chromeAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  samsung: 'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36',
  whatsappAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-A546B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36 WhatsApp/2.24.25.79',
  safariIphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
  safariIpad: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15',
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

const PLAY = 'https://play.google.com/store/apps/details?id=at.tonc.kaffeesatztarot';
const kurzlink = `${PLAY}&referrer=utm_source%3Dwebsite%26utm_medium%3Dlink%26utm_campaign%3Dkurzlink`;
const einladung = (code) => `${PLAY}&referrer=utm_source%3Dapp_teilen%26utm_medium%3Dapp%26utm_campaign%3Deinladen%26tc_e%3D${code}`;
const teilen = (von) => `${PLAY}&referrer=utm_source%3Dapp_teilen%26utm_medium%3D${von}%26utm_campaign%3Dteilen`;

const ANDROID_FAELLE = [
  ['', kurzlink],
  ['?von=deutung', teilen('deutung')],
  ['?von=tageskarte', teilen('tageskarte')],
  ['?von=traum', teilen('traum')],
  ['?von=app', teilen('app')],
  ['?von=werbung', kurzlink],
  ['?von=Deutung', kurzlink],
  ['?von=deutung1', kurzlink],
  ['?von=', kurzlink],
  ['?von=deutung%26utm_source%3Dfremd', kurzlink],
  ['?von=%3Cscript%3E', kurzlink],
  ['?von=deutung&von=app', teilen('deutung')],
  // Einladen (AP-31): e streng geprüft, sonst wie ohne e
  ['?von=app&e=K7M2Q9XA', einladung('K7M2Q9XA')],
  ['?e=K7M2Q9XA', einladung('K7M2Q9XA')],
  ['?von=app&e=k7m2q9xa', teilen('app')],
  ['?von=app&e=K7M2Q9X', teilen('app')],
  ['?von=app&e=K7M2Q9XAB', teilen('app')],
  ['?von=app&e=K7M2Q9X0', teilen('app')],
  ['?von=app&e=K7M2Q9XA%26tc_e%3DAAAAAAAA', teilen('app')],
  ['?von=app&e=%3Cscript%3E', teilen('app')],
];

const server = spawn(process.execPath, ['tools/vorschau.mjs', ORDNER, String(PORT)], { stdio: 'ignore' });
await new Promise((fertig) => setTimeout(fertig, 800));
const browser = await chromium.launch({ executablePath: chromePfad(), headless: true });
const fehler = [];
const zeilen = [];

async function oeffne(ua, { locale = 'de-AT', touch = false, mobil = false } = {}, pfad = '/app/') {
  const kontext = await browser.newContext({ userAgent: ua, locale, hasTouch: touch, isMobile: mobil, viewport: mobil ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
  let play = null;
  // Die zuletzt eingetragene Regel gilt zuerst: Google Play abfangen, alles andere Fremde melden
  await kontext.route(/^https?:\/\/(?!127\.0\.0\.1)/, (anfrage) => { fehler.push(`fremde Anfrage: ${anfrage.request().url()}`); return anfrage.abort(); });
  await kontext.route('https://play.google.com/**', (anfrage) => { play = anfrage.request().url(); return anfrage.fulfill({ status: 200, body: 'play' }); });
  const seite = await kontext.newPage();
  await seite.goto(BASIS + pfad, { waitUntil: 'load' }).catch(() => {});
  await seite.waitForTimeout(300);
  return { kontext, seite, play: () => play };
}

try {
  // 1. Android: Weiterleitung mit der richtigen Kennung
  for (const [name, ua] of [['Chrome Android', UA.chromeAndroid], ['Samsung Internet', UA.samsung], ['WhatsApp Android', UA.whatsappAndroid]]) {
    for (const [anfrage, erwartet] of ANDROID_FAELLE) {
      const { kontext, play } = await oeffne(ua, { mobil: true, touch: true }, `/app/${anfrage}`);
      const ok = play() === erwartet;
      zeilen.push(`${ok ? 'ok  ' : 'ROT '} ${name.padEnd(17)} /app/${anfrage.padEnd(38)} -> ${play() ?? '(keine Weiterleitung)'}`);
      if (!ok) fehler.push(`${name} ${anfrage}: erwartet ${erwartet}, war ${play()}`);
      await kontext.close();
    }
  }

  // 2. iPhone, iPad, Computer: keine Weiterleitung, Sprache des Browsers zuerst, QR nur am Computer
  const FAELLE = [
    ['Safari iPhone', UA.safariIphone, { locale: 'id-ID', mobil: true, touch: true }, 'id', false],
    ['Safari iPhone', UA.safariIphone, { locale: 'tr-TR', mobil: true, touch: true }, 'tr', false],
    ['Safari iPad', UA.safariIpad, { locale: 'pt-PT', touch: true }, 'pt', false],
    ['Desktop', UA.desktop, { locale: 'de-AT' }, 'de', true],
    ['Desktop', UA.desktop, { locale: 'hi-IN' }, 'hi', true],
    ['Desktop', UA.desktop, { locale: 'sr-Latn-RS' }, 'sr', true],
    ['Desktop', UA.desktop, { locale: 'ja-JP' }, 'en', true],
  ];
  for (const [name, ua, optionen, ersteSprache, qrSichtbar] of FAELLE) {
    for (const anfrage of ['', '?von=tageskarte']) {
      const { kontext, seite, play } = await oeffne(ua, optionen, `/app/${anfrage}`);
      const befund = await seite.evaluate(() => {
        const teile = [...document.querySelectorAll('.app-teil')];
        const erster = teile[0];
        const qr = document.querySelector('.app-qr');
        return {
          sprachen: teile.map((t) => t.dataset.sprache),
          h1: document.querySelectorAll('h1').length,
          h1ImErsten: !!erster.querySelector('h1'),
          links: [...erster.querySelectorAll('.app-links a')].map((a) => a.getAttribute('href')),
          // seit AP-28 steht der Satz „nur für Android-Handys“ in der Sprechblase der Figur
          nur: erster.querySelector('.app-blase')?.textContent.trim(),
          figur: !!erster.querySelector('.app-figur img[alt]:not([alt=""])'),
          qr: qr ? !qr.hidden && getComputedStyle(qr).display !== 'none' : null,
          // keine Statistik auf /app/: kein Einwilligungshinweis, kein Tag Manager, kein Cookie
          statistik: !!document.querySelector('script[src*="Einwilligung"], script[src*="googletagmanager"], #cc-main') || document.cookie !== '',
        };
      });
      const ok = !play() && befund.sprachen[0] === ersteSprache && befund.sprachen.length === 12 && befund.h1 === 1 && befund.h1ImErsten
        && befund.links.length === 4 && befund.qr === qrSichtbar && !befund.statistik && !!befund.nur && befund.figur;
      zeilen.push(`${ok ? 'ok  ' : 'ROT '} ${name.padEnd(17)} ${optionen.locale.padEnd(11)} ${anfrage.padEnd(16)} erste ${befund.sprachen[0]}, QR ${befund.qr ? 'ja' : 'nein'}, „${befund.nur}“`);
      if (!ok) fehler.push(`${name} ${optionen.locale} ${anfrage}: ${JSON.stringify(befund)}, play ${play()}`);
      // Links auf die Erklärseiten: es gibt sie im Bau (Sprungmarke #traumdeutung auf der Startseite)
      for (const link of befund.links) {
        const [pfad, marke] = link.split('#');
        const antwort = await seite.request.get(BASIS + pfad);
        if (antwort.status() !== 200) fehler.push(`Link ${link}: Status ${antwort.status()}`);
        if (marke && !(await antwort.text()).includes(`id="${marke}"`)) fehler.push(`Link ${link}: Sprungmarke fehlt`);
      }
      await kontext.close();
    }
  }

  // 3. Ohne Skript: die Seite bleibt mit Deutsch zuerst stehen, nichts wird weitergeleitet
  const ohne = await browser.newContext({ userAgent: UA.chromeAndroid, javaScriptEnabled: false });
  let playOhne = null;
  await ohne.route('https://play.google.com/**', (a) => { playOhne = a.request().url(); return a.abort(); });
  const s = await ohne.newPage();
  await s.goto(`${BASIS}/app/?von=deutung`);
  const erste = await s.evaluate(() => document.querySelector('.app-teil').dataset.sprache);
  zeilen.push(`${!playOhne && erste === 'de' ? 'ok  ' : 'ROT '} ohne Skript        Android /app/?von=deutung: keine Weiterleitung, erste ${erste}`);
  if (playOhne || erste !== 'de') fehler.push('ohne Skript: unerwartet');
  await ohne.close();
} finally {
  await browser.close();
  server.kill();
}

console.log(zeilen.join('\n'));
console.log(fehler.length ? `\n${fehler.length} Fehler:\n${fehler.join('\n')}` : `\nAlle ${zeilen.length} Fälle grün.`);
process.exit(fehler.length ? 1 : 0);
