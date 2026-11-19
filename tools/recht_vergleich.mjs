// Vergleicht den sichtbaren Text der Rechtsseiten (Hauptinhalt <main>) im neuen Bau mit einem älteren Bau (zuerst der
// Bau vor AP-W1, web_bauen.py, Stand main 9b06a2d; seither der Bau von main vor der Änderung), Zeile für Zeile, dazu
// die Sprachlinks (Ziele der Links). Kopf, Brotkrumen und Fuß gehören nicht zum Vergleich (sie sind mit AP-W1 neu).
// AP-40D: Verglichen werden die gültigen Rechtsseiten aller Sprachen (aus dem Verzeichnis) und /offenlegung/; Seiten
// einzelner Fassungen gibt es nicht mehr. Die Liste „Frühere und aktuelle Fassungen“ (<section class="fassungen">) ist
// seither entfernt; steht sie im älteren Bau, wird sie dort vor dem Vergleich herausgenommen.
// Aufruf: node tools/recht_vergleich.mjs <alter Bau> <neuer Bau> [Bericht.md]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import verzeichnis from '../src/inhalte/recht/verzeichnis.json' with { type: 'json' };

const [alt, neu, bericht] = process.argv.slice(2);
if (!alt || !neu) throw new Error('Aufruf: node tools/recht_vergleich.mjs <alter Bau> <neuer Bau> [Bericht.md]');

const SEITEN = [...verzeichnis.texte.map((text) => `/${text.pfad}/`), '/offenlegung/'];

const ENTITAETEN = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };
const dekodiere = (text) => text
  .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, zahl) => String.fromCodePoint(Number(zahl)))
  .replace(/&([a-z0-9#]+);/gi, (ganz, name) => ENTITAETEN[name] ?? ganz);

function hauptinhalt(html) {
  const treffer = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/);
  if (!treffer) throw new Error('kein <main>');
  return treffer[1].replace(/<section class="fassungen"[\s\S]*?<\/section>/, '');
}

// Sichtbare Zeilen: Blockelemente trennen Zeilen, Inline-Elemente nicht.
const BLOCK = /<\/?(p|h[1-6]|li|ul|ol|div|section|blockquote|table|thead|tbody|tr|th|td|br|hr|header|footer|nav|main|article)\b[^>]*>/gi;
function zeilen(html) {
  return dekodiere(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '').replace(BLOCK, '\n').replace(/<[^>]+>/g, ''))
    .split('\n').map((zeile) => zeile.replace(/[ \t\r\f\v ]+/g, ' ').trim()).filter(Boolean);
}
// Links im Hauptinhalt als Ziel und Text; relative Ziele des alten Baus werden zu Pfaden ab der Wurzel.
function links(html, seite) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, ziel, text]) => {
    const absolut = /^(https?:|mailto:)/.test(ziel) ? ziel : new URL(ziel, `https://tarot-cup.com${seite}`).pathname;
    return `${absolut} | ${dekodiere(text.replace(/<[^>]+>/g, '')).trim()}`;
  });
}

const datei = (wurzel, seite) => join(wurzel, seite, 'index.html');
const ergebnis = [];
let fehler = 0;
for (const seite of SEITEN) {
  if (!existsSync(datei(alt, seite)) || !existsSync(datei(neu, seite))) {
    ergebnis.push({ seite, ok: false, grund: 'Datei fehlt' });
    fehler++;
    continue;
  }
  const a = hauptinhalt(readFileSync(datei(alt, seite), 'utf8'));
  const n = hauptinhalt(readFileSync(datei(neu, seite), 'utf8'));
  const za = zeilen(a);
  const zn = zeilen(n);
  const la = links(a, seite);
  const ln = links(n, seite);
  const unterschiede = [];
  for (let i = 0; i < Math.max(za.length, zn.length); i++) {
    if (za[i] !== zn[i]) unterschiede.push(`Zeile ${i + 1}: alt „${za[i] ?? '(fehlt)'}“ neu „${zn[i] ?? '(fehlt)'}“`);
  }
  for (let i = 0; i < Math.max(la.length, ln.length); i++) {
    if (la[i] !== ln[i]) unterschiede.push(`Link ${i + 1}: alt „${la[i] ?? '(fehlt)'}“ neu „${ln[i] ?? '(fehlt)'}“`);
  }
  ergebnis.push({ seite, ok: unterschiede.length === 0, zeilen: za.length, links: la.length, unterschiede });
  if (unterschiede.length) fehler++;
}

const tabelle = [
  '| Seite | Zeilen alt = neu | Links alt = neu | Ergebnis |',
  '|---|---|---|---|',
  ...ergebnis.map((e) => `| \`${e.seite}\` | ${e.zeilen ?? '-'} | ${e.links ?? '-'} | ${e.ok ? 'gleich' : `**abweichend** (${e.grund ?? `${e.unterschiede.length} Unterschiede`})`} |`),
].join('\n');
console.log(tabelle);
for (const e of ergebnis.filter((eintrag) => !eintrag.ok && eintrag.unterschiede)) {
  console.log(`\n${e.seite}:\n  ${e.unterschiede.slice(0, 20).join('\n  ')}`);
}
if (bericht) writeFileSync(bericht, `${tabelle}\n`);
process.exit(fehler ? 1 : 0);
