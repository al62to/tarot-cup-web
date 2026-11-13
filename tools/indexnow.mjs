// IndexNow (AP-T2): meldet nach dem Veröffentlichen die geänderten Adressen an https://api.indexnow.org/indexnow,
// damit Bing und andere Suchmaschinen sie schneller neu lesen. Der Schlüssel ist öffentlich; er liegt als Datei
// public/<SCHLUESSEL>.txt im Wurzelverzeichnis der Website (so prüft IndexNow, dass die Meldung von uns kommt).
//
//   node tools/indexnow.mjs liste dist <JJJJ-MM-TT|alle> <ausgabe.txt>
//       Adressen aus dist/sitemap.xml, deren lastmod am oder nach dem Tag liegt („alle“: jede Adresse).
//   node tools/indexnow.mjs senden <ausgabe.txt>
//       Meldet die Adressen (höchstens 10.000) per POST; leere Liste: nichts zu tun. Antwort 200 oder 202 ist gut.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const SCHLUESSEL = '47980eed98743b702ed7969d6c0d5527';
export const HOST = 'tarot-cup.com';
const ZIEL = 'https://api.indexnow.org/indexnow';

export function adressen(sitemap, seit) {
  const treffer = [];
  for (const m of sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>[\s\S]*?<\/url>/g)) {
    const [, loc, lastmod] = m;
    if (!loc.startsWith(`https://${HOST}/`)) throw new Error(`IndexNow: fremde Adresse in der Sitemap: ${loc}`);
    if (seit === 'alle' || lastmod.slice(0, 10) >= seit) treffer.push(loc);
  }
  return treffer;
}

async function senden(datei) {
  const liste = readFileSync(datei, 'utf8').split('\n').map((z) => z.trim()).filter(Boolean).slice(0, 10000);
  if (!liste.length) {
    console.log('IndexNow: keine geänderten Adressen, nichts gemeldet');
    return;
  }
  const antwort = await fetch(ZIEL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: SCHLUESSEL, keyLocation: `https://${HOST}/${SCHLUESSEL}.txt`, urlList: liste }),
  });
  console.log(`IndexNow: ${liste.length} Adressen gemeldet, Antwort ${antwort.status}`);
  for (const a of liste) console.log(`  ${a}`);
  if (antwort.status !== 200 && antwort.status !== 202) {
    throw new Error(`IndexNow: unerwartete Antwort ${antwort.status} ${await antwort.text()}`);
  }
}

const [art, ...rest] = process.argv.slice(2);
if (art === 'liste') {
  const [ordner, seit, ausgabe] = rest;
  if (!/^(\d{4}-\d{2}-\d{2}|alle)$/.test(seit ?? '')) throw new Error('IndexNow: Tag als JJJJ-MM-TT oder „alle“');
  const schluesselDatei = join(ordner, `${SCHLUESSEL}.txt`);
  if (!existsSync(schluesselDatei) || readFileSync(schluesselDatei, 'utf8').trim() !== SCHLUESSEL) {
    throw new Error(`IndexNow: Schlüsseldatei ${schluesselDatei} fehlt oder passt nicht`);
  }
  const liste = adressen(readFileSync(join(ordner, 'sitemap.xml'), 'utf8'), seit);
  writeFileSync(ausgabe, liste.join('\n') + (liste.length ? '\n' : ''));
  console.log(`IndexNow: ${liste.length} Adressen seit ${seit}`);
} else if (art === 'senden') {
  await senden(rest[0]);
} else if (art) {
  throw new Error(`IndexNow: unbekannte Aufgabe ${art}`);
}
