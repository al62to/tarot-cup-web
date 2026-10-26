// Baut die Bilder der Website nach public/bilder/ (WebP, Metadaten entfernt). Quellen liegen außerhalb dieses Repos:
//   Kartenbilder 1909:    ../deutung/app/bilder_original/<id>.jpg (gemeinfrei, unverändert; nur verkleinert)
//   Store-Fotos (AP-16):  ../aufnahmen/AP16/store/<sprache>/<name>.png
//   So geht's (AP-W1):    ../aufnahmen/APW1/sogehts/<sprache>/<name>.png
//   App-Symbol:           ../deutung-unterlagen/store/grafiken/app_symbol_512.png
// Gebaut werden nur Karten, die die Website zeigt (Titelbild und Ratgeber Tarot); Karten mit nackten Figuren nie.
// Aufruf (aus tarot-cup-web): node tools/bilder_bauen.mjs [karten|app|sogehts|symbol ...]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GESPERRT, TITELKARTEN } from '../src/daten/karten.mjs';
import { tarot } from '../src/daten/texte/tarot.mjs';
import { FOTOS_START, FOTO_BREITEN } from '../src/daten/fotos.mjs';
import { sogehts } from '../src/daten/texte/sogehts.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJEKT = join(WURZEL, '..');
const ZIEL = join(WURZEL, 'public', 'bilder');
const teile = process.argv.slice(2);
// Maße der Fotos in voller Größe für width/height der Bilder (src/daten/fotos_masse.json).
const MASSE_DATEI = join(WURZEL, 'src', 'daten', 'fotos_masse.json');
const masse = existsSync(MASSE_DATEI) ? JSON.parse(readFileSync(MASSE_DATEI, 'utf8')) : {};
async function merke(art, name, sprache, quelle) {
  const { width, height } = await sharp(quelle).metadata();
  masse[`${art}/${name}-${sprache}`] = { breite: width, hoehe: height };
}
const soll = (teil) => !teile.length || teile.includes(teil);

async function webp(quelle, ziel, breite, qualitaet = 80) {
  if (!existsSync(quelle)) throw new Error(`Quelle fehlt: ${quelle}`);
  mkdirSync(dirname(ziel), { recursive: true });
  await sharp(quelle).resize({ width: breite, withoutEnlargement: true }).webp({ quality: qualitaet, effort: 6 }).toFile(ziel);
}

if (soll('karten')) {
  const karten = new Set([...TITELKARTEN]);
  for (const sprache of ['de', 'tr']) {
    for (const abschnitt of tarot[sprache].abschnitte) if (abschnitt.art === 'karten') abschnitt.ids.forEach((id) => karten.add(id));
  }
  for (const id of karten) {
    if (GESPERRT.includes(id)) throw new Error(`Gesperrte Karte: ${id}`);
    const quelle = join(PROJEKT, 'deutung', 'app', 'bilder_original', `${id}.jpg`);
    // Einheitliches Format 480 x 822 (Seitenverhältnis der Drucke), damit alle Karten gleich hoch stehen.
    for (const breite of [240, 480]) {
      const ziel = join(ZIEL, 'karten', `${id}-${breite}.webp`);
      mkdirSync(dirname(ziel), { recursive: true });
      await sharp(quelle).resize({ width: breite, height: Math.round(breite * 822 / 480), fit: 'cover' }).webp({ quality: 82, effort: 6 }).toFile(ziel);
    }
    console.log('Karte', id);
  }
}

if (soll('app')) {
  for (const sprache of ['de', 'tr']) {
    for (const name of FOTOS_START) {
      for (const breite of FOTO_BREITEN) {
        await webp(join(PROJEKT, 'aufnahmen', 'AP16', 'store', sprache, `${name}.png`), join(ZIEL, 'app', `${name}-${sprache}-${breite}.webp`), breite);
      }
      await merke('app', name, sprache, join(PROJEKT, 'aufnahmen', 'AP16', 'store', sprache, `${name}.png`));
    }
    console.log('Store-Fotos', sprache);
  }
}

if (soll('sogehts')) {
  for (const sprache of ['de', 'tr']) {
    for (const kapitel of sogehts[sprache].kapitel) {
      for (const breite of FOTO_BREITEN) {
        await webp(join(PROJEKT, 'aufnahmen', 'APW1', 'sogehts', sprache, `${kapitel.foto}.png`), join(ZIEL, 'sogehts', `${kapitel.foto}-${sprache}-${breite}.webp`), breite);
      }
      await merke('sogehts', kapitel.foto, sprache, join(PROJEKT, 'aufnahmen', 'APW1', 'sogehts', sprache, `${kapitel.foto}.png`));
    }
    console.log("So geht's", sprache);
  }
}

if (soll('symbol')) {
  const quelle = join(PROJEKT, 'deutung-unterlagen', 'store', 'grafiken', 'app_symbol_512.png');
  await sharp(quelle).png({ compressionLevel: 9 }).toFile(join(ZIEL, 'app-symbol-512.png'));
  await sharp(quelle).resize(180).png({ compressionLevel: 9 }).toFile(join(WURZEL, 'public', 'apple-touch-icon.png'));
  await sharp(quelle).resize(32).png({ compressionLevel: 9 }).toFile(join(WURZEL, 'public', 'favicon-32.png'));
  console.log('Symbol');
}

writeFileSync(MASSE_DATEI, `${JSON.stringify(Object.fromEntries(Object.entries(masse).sort()), null, 1)}
`);
