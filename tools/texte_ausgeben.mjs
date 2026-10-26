// Schreibt alle neuen Texte der Website (Deutsch und Türkisch nebeneinander) als HTML und PDF, für die Freigabe durch
// Ali und für den Bericht. Inhalt wie auf den Seiten, mit den Kurzbedeutungen aus den Daten der App.
// Aufruf: node tools/texte_ausgeben.mjs <Zielordner>
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import appDaten from '../src/daten/app_daten.json' with { type: 'json' };
import { start } from '../src/daten/texte/start.mjs';
import { ohneAuszeichnung as oa } from '../src/daten/auszeichnung.mjs';
import { tarot } from '../src/daten/texte/tarot.mjs';
import { kaffeesatz } from '../src/daten/texte/kaffeesatz.mjs';
import { sogehts } from '../src/daten/texte/sogehts.mjs';
import { fragen } from '../src/daten/texte/fragen.mjs';
import { ueber } from '../src/daten/texte/ueber.mjs';
import { oberflaeche } from '../src/daten/texte/oberflaeche.mjs';
import { llmsText } from '../src/daten/llms.mjs';

const ziel = resolve(process.argv[2] ?? '.');
mkdirSync(ziel, { recursive: true });
const e = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (text) => e(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<u>$1</u> <small>($2)</small>');
const p = (text) => `<p>${t(text)}</p>`;
const zeichen = (id) => appDaten.zeichen.find((z) => z.id === id);
const karte = (id) => appDaten.karten.find((k) => k.id === id);
const kopf = (x) => `<p class="meta"><b>Titel (Suche):</b> ${e(x.metaTitel)} · <b>Beschreibung:</b> ${e(x.metaBeschreibung)}</p>`;

function ratgeber(x, sprache) {
  const teile = [kopf(x), `<h2>${e(x.titel)}</h2>`, p(x.vorspann)];
  for (const a of x.abschnitte) {
    teile.push(`<h3>${e(a.titel)}</h3>`, ...(a.absaetze ?? []).map(p));
    if (a.art === 'schritte') teile.push(`<ol>${a.schritte.map((s) => `<li><b>${e(s.titel)}</b> ${t(s.text)}</li>`).join('')}</ol>`);
    if (a.art === 'bereiche') teile.push(`<ul>${a.bereiche.map((b) => `<li><b>${e(b.name)}:</b> ${t(b.text)}</li>`).join('')}</ul>`);
    if (a.art === 'zeichen') teile.push(`<ul>${a.ids.map((id) => `<li><b>${e(zeichen(id).name[sprache])}:</b> <i>${e(zeichen(id).kurz[sprache])}</i></li>`).join('')}</ul><p class="hinweis">Kursiv: Kurzbedeutung aus den Daten der App.</p>`);
    if (a.art === 'karten') teile.push(`<ul>${a.ids.map((id) => `<li><b>${e(karte(id).name[sprache])}</b><br>${e(a.aufrecht)}: <i>${e(karte(id).kurz.aufrecht[sprache])}</i><br>${e(a.umgekehrt)}: <i>${e(karte(id).kurz.umgekehrt[sprache])}</i></li>`).join('')}</ul>`);
    if (a.art === 'legungen') for (const l of a.legungen) {
      const daten = appDaten.legungen[l.id];
      teile.push(`<h4>${e(daten.name[sprache])}</h4>`, p(l.text));
      if (l.positionen.length) teile.push(`<ol>${l.positionen.map((pos) => `<li><b>${e(daten.positionen.find((d) => d.id === pos.id).name[sprache])}:</b> ${t(pos.text)}</li>`).join('')}</ol>`);
    }
    if (a.art === 'beispiele') teile.push(`<p><b>${e(a.gut.titel)}</b></p><ul>${a.gut.liste.map((f) => `<li>${t(f)}</li>`).join('')}</ul><p><b>${e(a.weniger.titel)}</b></p><ul>${a.weniger.liste.map((f) => `<li>${t(f)}</li>`).join('')}</ul>`);
    if (a.nachsatz) teile.push(p(a.nachsatz));
  }
  return teile.join('\n');
}

function startseite(x) {
  const fuss = oberflaeche[x === start.de ? 'de' : 'tr'].fuss;
  return [
    kopf(x),
    `<p class="klein">${e(x.kopf.zeile)}</p><h2>${x.kopf.zeilen.map((z) => e(oa(z))).join('<br>')}</h2>`, p(x.kopf.text), `<p>[${e(x.kopf.bald)}] [${e(x.kopf.anleitung)}]</p>`,
    `<p><small>Karte zum Umdrehen: ${e(x.kopf.karte.tipp)} / ${e(x.kopf.karte.satz)}</small></p>`,
    `<ul>${x.zahlen.liste.map((z) => `<li><b>${e(z.zahl)}</b> ${e(z.text)}</li>`).join('')}</ul>`,
    `<h3>${e(x.wasIst.titel)}</h3>`, p(x.wasIst.text),
    `<p class="klein">${e(x.tasse.zeile)}</p><h3>${e(oa(x.tasse.titel))}</h3>`, `<ol>${x.tasse.schritte.map((s) => `<li>${t(s)}</li>`).join('')}</ol>`, `<p><u>${e(x.tasse.link.text)}</u></p>`,
    `<p><b>${e(x.tassenkarte.titel)}</b> (${e(x.tassenkarte.hinweis)})</p><ul>${x.tassenkarte.bereiche.map((b) => `<li>${e(b.name)}: ${e(b.bedeutung)}</li>`).join('')}</ul>`,
    `<h3>${e(oa(x.schaukasten.titel))}</h3>`, ...x.schaukasten.eintraege.map((s, n) => `<p><b>0${n + 1} ${e(s.titel)}</b><br>${e(s.text)}<br><small>Bild: ${e(x.fotos.alt[s.foto])}</small></p>`),
    `<h3>${e(oa(x.koennen.titel))}</h3>`, ...x.vorteile.map((v) => `<p><b>${e(v.titel)}</b><br>${t(v.text)}</p>`),
    `<p><b>${e(x.koennen.ruhe.titel)}</b><br>${e(x.koennen.ruhe.text)}</p><ul>${x.koennen.ruhe.pillen.map((r) => `<li>${e(r.name)} · ${e(r.takt)}</li>`).join('')}</ul>`,
    `<p><b>${e(x.koennen.sprachen.gross)}</b> ${e(x.koennen.sprachen.titel)}<br>${e(x.koennen.sprachen.text)}</p>`,
    `<h3>${e(oa(x.ratgeber.titel))}</h3>`, ...x.ratgeber.eintraege.map((r) => `<p><b>${e(r.titel)}</b><br>${t(r.text)} <u>${e(r.link)}</u></p>`),
    `<h3>${e(oa(x.fragen.titel))}</h3><p><small>(die ersten vier Fragen der Seite Fragen)</small></p>`,
    p(fuss.hinweis),
  ].join('\n');
}

const sogehtsSeite = (x) => [kopf(x), `<h2>${e(x.titel)}</h2>`, p(x.vorspann), ...x.kapitel.map((k, n) => `<h3>${n + 1}. ${e(k.titel)}</h3>${k.absaetze.map(p).join('')}<p><small>Bild: ${e(k.alt)}</small></p>`), x.abschluss ? `<h3>${e(x.abschluss.titel)}</h3>${p(x.abschluss.text)}` : ''].join('\n');
const fragenSeite = (x) => [kopf(x), `<h2>${e(x.titel)}</h2>`, p(x.vorspann), ...x.liste.map((f) => `<h4>${e(f.frage)}</h4>${f.antwort.map(p).join('')}`)].join('\n');
const ueberSeite = (x) => [kopf(x), `<h2>${e(x.titel)}</h2>`, p(x.vorspann), ...x.abschnitte.map((a) => `<h3>${e(a.titel)}</h3>${a.absaetze.map(p).join('')}`), p(`${x.kontakt} aliapp@gmx.at`)].join('\n');
const bildSeite = (x) => [kopf(x), `<h2>${e(x.titel)}</h2>`, p(x.vorspann), `<h3>${e(x.karten.titel)}</h3>`, ...x.karten.absaetze.map(p), `<h3>${e(x.schriften.titel)}</h3>`, ...x.schriften.absaetze.map(p)].join('\n');

const SEITEN = [
  ['Startseite', (s) => startseite(start[s])],
  ['Ratgeber Tarot', (s) => ratgeber(tarot[s], s)],
  ['Ratgeber Kaffeesatz', (s) => ratgeber(kaffeesatz[s], s)],
  ["So geht's", (s) => sogehtsSeite(sogehts[s])],
  ['Häufige Fragen', (s) => fragenSeite(fragen[s])],
  ['Über Tarot Cup', (s) => ueberSeite(ueber[s])],
  ['Bildnachweis und Lizenzen', (s) => bildSeite(oberflaeche[s].bildnachweis)],
  ['llms.txt', (s) => `<pre>${e(llmsText(s))}</pre>`],
];

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Tarot Cup, Website-Texte AP-W1</title><style>
@page{size:A4 landscape;margin:12mm}
body{font:10pt/1.45 'Segoe UI',system-ui,sans-serif;color:#1E2340}
h1{font-size:18pt;margin:0 0 4mm}h2{font-size:14pt;margin:3mm 0}h3{font-size:11.5pt;margin:4mm 0 1mm}h4{font-size:10.5pt;margin:3mm 0 1mm}
.seite{break-before:page}.seite:first-of-type{break-before:auto}
.spalten{display:grid;grid-template-columns:1fr 1fr;gap:8mm}.spalte{min-width:0}
.titel{background:#12162B;color:#F5F0E6;padding:2mm 4mm;font-size:13pt;margin:0 0 3mm}
.meta{background:#F5F0E6;padding:1.5mm 3mm;font-size:8.5pt}.klein{font-size:8pt;letter-spacing:.1em}.hinweis{font-size:8pt;color:#666}
pre{white-space:pre-wrap;font-size:8.5pt}p{margin:1.5mm 0}ul,ol{margin:1mm 0;padding-left:5mm}li{margin:1mm 0}
</style></head><body>
<h1>Tarot Cup, neue Website-Texte (AP-W1), Deutsch | Türkisch</h1>
<p>Stand ${new Date().toLocaleDateString('de-AT')}. Türkisch eigenständig geschrieben, muttersprachlich ungeprüft. Links im Text unterstrichen, Ziel in Klammern.</p>
${SEITEN.map(([name, bau]) => `<section class="seite"><p class="titel">${e(name)}</p><div class="spalten"><div class="spalte" lang="de">${bau('de')}</div><div class="spalte" lang="tr">${bau('tr')}</div></div></section>`).join('\n')}
</body></html>`;

const htmlDatei = join(ziel, 'APW1_texte.html');
writeFileSync(htmlDatei, html);
const ORTE = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome'];
const chrome = ORTE.find((ort) => ort && existsSync(ort));
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const seite = await browser.newPage();
await seite.goto(pathToFileURL(htmlDatei).href);
await seite.pdf({ path: join(ziel, 'APW1_texte.pdf'), format: 'A4', landscape: true, printBackground: true });
await browser.close();
console.log('geschrieben:', join(ziel, 'APW1_texte.pdf'));
