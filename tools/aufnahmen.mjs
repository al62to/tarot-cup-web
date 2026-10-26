// Nimmt Seiten der lokalen Vorschau als Bild auf (ganze Seite), je Breite, und prüft dabei die Gestaltung:
//  - keine waagrechte Scrollleiste (Seite breiter als das Fenster),
//  - kein Wort, das ohne Silbentrennung mitten im Wort umbricht (Wort über zwei Zeilen, aber das Element trennt nicht
//    nach der Sprache), und kein Wort, das über den Rand seines Elements hinausragt,
//  - Bedienelemente (Links außerhalb von Fließtext, Knöpfe, summary) mit weniger als 44 Pixel Höhe oder Breite.
// Mit lokalem Chrome über playwright-core (tools/chrome.mjs), nichts wird heruntergeladen.
// Aufruf: node tools/aufnahmen.mjs <Zielordner> <Adresse der Vorschau> <Pfad>[=Name] ... [--breiten 390,1280]
//         [--oben] (nur der erste Bildschirm) [--gross] (Schrift 200 Prozent, wie große Schrift im Browser)
//         [--menue] (am Handy zusätzlich mit offenem Menü)
// Ein Pfad kann mit @ einen CSS-Wähler tragen (/tarot/@#ritual=name): Dann zeigt die Aufnahme nur einen Bildschirm ab
// diesem Element (unter dem Kopf), etwa für Ausschnitte zur Sichtprüfung; mit --element das ganze Element.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import { chromePfad } from './chrome.mjs';

const [ziel, vorschau, ...rest] = process.argv.slice(2);
const wahl = { breiten: [390, 1280], oben: false, gross: false, menue: false, element: false, pfade: [] };
for (let nummer = 0; nummer < rest.length; nummer++) {
  if (rest[nummer] === '--breiten') wahl.breiten = rest[++nummer].split(',').map(Number);
  else if (rest[nummer] === '--oben') wahl.oben = true;
  else if (rest[nummer] === '--gross') wahl.gross = true;
  else if (rest[nummer] === '--menue') wahl.menue = true;
  else if (rest[nummer] === '--element') wahl.element = true;
  else wahl.pfade.push(rest[nummer]);
}
mkdirSync(ziel, { recursive: true });

// Läuft in der Seite: sammelt Befunde zu Umbruch, Überlauf und Trefferflächen.
function pruefeSeite() {
  const befunde = [];
  const breite = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > breite + 1) befunde.push(`waagrechte Scrollleiste: ${document.documentElement.scrollWidth} > ${breite}`);
  const gang = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const bereich = document.createRange();
  for (let knoten = gang.nextNode(); knoten; knoten = gang.nextNode()) {
    const element = knoten.parentElement;
    if (!element || element.closest('script, style, [aria-hidden="true"] svg, .unsichtbar, .sprung')) continue;
    if (!element.getClientRects().length) continue;
    // Nur für Bildschirmleser versteckter Text (1 Pixel groß, abgeschnitten) zählt nicht.
    if (element.getBoundingClientRect().width <= 1) continue;
    const stil = getComputedStyle(element);
    if (stil.visibility === 'hidden') continue;
    const trennt = stil.hyphens === 'auto';
    // Bindestriche gelten als erlaubte Bruchstelle: geprüft wird jedes Stück bis einschließlich Bindestrich.
    for (const treffer of knoten.textContent.matchAll(/[\p{L}\p{N}’']+-?/gu)) {
      if (treffer[0].length < 4) continue;
      bereich.setStart(knoten, treffer.index);
      bereich.setEnd(knoten, treffer.index + treffer[0].length);
      const kaesten = [...bereich.getClientRects()].filter((kasten) => kasten.width > 0);
      if (!kaesten.length) continue;
      const zeilen = new Set(kaesten.map((kasten) => Math.round(kasten.top)));
      if (zeilen.size > 1 && !(trennt && /^[\p{L}]+-?$/u.test(treffer[0]))) {
        befunde.push(`Wort bricht ohne Trennung: „${treffer[0]}“ in <${element.tagName.toLowerCase()} class="${element.className}">`);
      }
      // Wörter in einem Bereich, der in sich scrollt (Tabellen der Rechtstexte), ragen nicht aus der Seite.
      const scrollt = (() => { for (let e = element; e; e = e.parentElement) { if (/auto|scroll/.test(getComputedStyle(e).overflowX)) return true; } return false; })();
      const rechts = Math.max(...kaesten.map((kasten) => kasten.right));
      if (!scrollt && rechts > breite + 1) befunde.push(`Wort ragt aus dem Fenster: „${treffer[0]}“ (${Math.round(rechts)} > ${breite})`);
    }
  }
  for (const element of document.querySelectorAll('a, button, summary, input, select')) {
    if (!element.getClientRects().length) continue;
    const stil = getComputedStyle(element);
    if (stil.visibility === 'hidden' || stil.display === 'none') continue;
    // Links mitten im Fließtext sind ausgenommen (WCAG 2.5.8, Ausnahme „inline“).
    if (element.tagName === 'A' && stil.display === 'inline' && element.closest('p, li, dd, td, figcaption') && !element.closest('nav, .fuss, .krumen')) continue;
    const kasten = element.getBoundingClientRect();
    if (kasten.height < 43.5 || kasten.width < 43.5) befunde.push(`Trefferfläche ${Math.round(kasten.width)} x ${Math.round(kasten.height)}: <${element.tagName.toLowerCase()} class="${element.className}"> „${element.textContent.trim().slice(0, 40)}“`);
  }
  return [...new Set(befunde)];
}

const browser = await chromium.launch({ executablePath: chromePfad(), headless: true });
const bericht = [];
try {
  for (const eintrag of wahl.pfade) {
    const [adresse, name = adresse.replace(/^\/|\/$/g, '').replace(/[/.@#]/g, '_') || 'start'] = eintrag.split('=');
    const [pfad, waehler] = adresse.split('@');
    for (const breite of wahl.breiten) {
      const handy = breite < 700;
      // Chrome nimmt ganze Seiten nur bis etwa 16.000 Pixel Höhe sauber auf; lange Seiten am Handy deshalb mit
      // einfacher statt doppelter Auflösung.
      let umgebung = await browser.newContext({ viewport: { width: breite, height: handy ? 844 : 900 }, deviceScaleFactor: handy ? 2 : 1, reducedMotion: 'reduce' });
      let seite = await umgebung.newPage();
      let antwort = await seite.goto(vorschau + pfad, { waitUntil: 'networkidle' });
      if (handy && !wahl.oben && (await seite.evaluate(() => document.documentElement.scrollHeight)) * 2 > 15500) {
        await umgebung.close();
        umgebung = await browser.newContext({ viewport: { width: breite, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
        seite = await umgebung.newPage();
        antwort = await seite.goto(vorschau + pfad, { waitUntil: 'networkidle' });
      }
      if (wahl.gross) await seite.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      // Verzögert geladene Bilder holen: einmal durch die Seite laufen.
      await seite.evaluate(async () => {
        for (const bild of document.images) bild.loading = 'eager';
        for (let ort = 0; ort < document.body.scrollHeight; ort += 600) { window.scrollTo(0, ort); await new Promise((weiter) => setTimeout(weiter, 50)); }
        window.scrollTo(0, 0);
        const offen = [...document.images].filter((bild) => bild.getClientRects().length > 0 && !bild.complete);
        await Promise.all(offen.map((bild) => Promise.race([new Promise((weiter) => { bild.onload = bild.onerror = weiter; }), new Promise((weiter) => setTimeout(weiter, 3000))])));
        await Promise.all([...document.images].map((bild) => bild.decode().catch(() => {})));
        await document.fonts.ready;
      });
      const befunde = await seite.evaluate(pruefeSeite);
      const zusatz = wahl.gross ? '_gross' : '';
      const datei = join(ziel, `${name}_${breite}${zusatz}.png`);
      if (waehler) {
        await seite.evaluate((w) => { const element = document.querySelector(w); if (!element) throw new Error(`Wähler fehlt: ${w}`); window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 76); }, waehler);
        await seite.waitForTimeout(150);
      }
      if (waehler && wahl.element) await seite.locator(waehler).first().screenshot({ path: datei });
      else await seite.screenshot({ path: datei, fullPage: !wahl.oben && !waehler });
      console.log(`${antwort.status()} ${pfad} ${breite}${zusatz} -> ${datei}${befunde.length ? `\n  ${befunde.join('\n  ')}` : ''}`);
      bericht.push({ pfad, breite, gross: wahl.gross, befunde });
      if (wahl.menue && handy) {
        const knopf = seite.locator('[data-menue]');
        if (await knopf.isVisible()) {
          await knopf.click();
          await seite.screenshot({ path: join(ziel, `${name}_${breite}${zusatz}_menue.png`) });
          await knopf.click();
        }
      }
      await umgebung.close();
    }
  }
} finally {
  await browser.close();
}
writeFileSync(join(ziel, `befunde${wahl.gross ? '_gross' : ''}.json`), JSON.stringify(bericht, null, 1));
const anzahl = bericht.reduce((summe, eintrag) => summe + eintrag.befunde.length, 0);
console.log(`${bericht.length} Aufnahmen, ${anzahl} Befunde`);
