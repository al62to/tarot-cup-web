// Baut src/styles/schriften/inter-ro.woff2: die Buchstaben ă Ă ș Ș ț Ț aus Inter (Datei latin-ext von
// @fontsource-variable/inter, unverändert, nur ausgeschnitten, mit allen Strichstärken), damit „Română“ in der Sprachwahl
// nicht die ganze Datei latin-ext (85 KB) nachlädt (AP-28). Die Datei ist kleiner als 4 KB; Vite setzt sie deshalb direkt
// ins CSS (keine eigene Anfrage). Eingebunden in src/styles/schrift_ro.css.
// Ablauf: WOFF2 entpacken (mit Rückbau der glyf-/loca-Umformung), mit hb-subset (HarfBuzz, muss installiert sein:
// macOS „brew install harfbuzz“, Windows Paket „harfbuzz“) ausschneiden, als WOFF2 ohne Umformung packen.
// Aufruf (aus tarot-cup-web): node tools/schrift_ro_bauen.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, brotliDecompressSync, constants } from 'node:zlib';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = join(WURZEL, 'node_modules', '@fontsource-variable', 'inter', 'files', 'inter-latin-ext-wght-normal.woff2');
const ZIEL = join(WURZEL, 'src', 'styles', 'schriften', 'inter-ro.woff2');
// Muss zu unicode-range in src/styles/schrift_ro.css passen.
const ZEICHEN = 'U+0102,U+0103,U+0218,U+0219,U+021A,U+021B';

const TAGS = ['cmap','head','hhea','hmtx','maxp','name','OS/2','post','cvt ','fpgm','glyf','loca','prep','CFF ','VORG','EBDT','EBLC','gasp','hdmx','kern','LTSH','PCLT','VDMX','vhea','vmtx','BASE','GDEF','GPOS','GSUB','EBSC','JSTF','MATH','CBDT','CBLC','COLR','CPAL','SVG ','sbix','acnt','avar','bdat','bloc','bsln','cvar','fdsc','feat','fmtx','fvar','gvar','hsty','just','lcar','mort','morx','opbd','prop','trak','Zapf','Silf','Glat','Gloc','Feat','Sill'];

function woff2NachTtf(b) {
  if (b.toString('latin1', 0, 4) !== 'wOF2') throw new Error('kein WOFF2');
  const flavor = b.readUInt32BE(4);
  const anzahl = b.readUInt16BE(12);
  let o = 48;
  const base128 = () => { let v = 0; for (let i = 0; i < 5; i++) { const x = b[o++]; v = (v * 128) + (x & 0x7f); if (!(x & 0x80)) return v; } throw new Error('base128'); };
  const tabellen = [];
  for (let i = 0; i < anzahl; i++) {
    const f = b[o++];
    let tag = TAGS[f & 0x3f];
    if ((f & 0x3f) === 63) { tag = b.toString('latin1', o, o + 4); o += 4; }
    const tv = f >> 6;
    const laenge = base128();
    const umgeformt = (tag === 'glyf' || tag === 'loca') ? tv !== 3 : tv !== 0;
    const umLaenge = umgeformt ? base128() : laenge;
    tabellen.push({ tag, tv, laenge, umgeformt, umLaenge });
  }
  const gepackt = b.readUInt32BE(20);
  const daten = brotliDecompressSync(b.subarray(o, o + gepackt));
  let p = 0;
  for (const t of tabellen) { t.daten = daten.subarray(p, p + t.umLaenge); p += t.umLaenge; }
  const tab = Object.fromEntries(tabellen.map((t) => [t.tag, t]));
  if (tab.hmtx?.umgeformt) throw new Error('hmtx-Umformung nicht unterstützt');
  if (tab.glyf?.umgeformt) {
    const { glyf, loca } = glyfZurueck(tab.glyf.daten);
    tab.glyf.daten = glyf; tab.loca.daten = loca;
    // head.indexToLocFormat = 1 (lange loca)
    const head = Buffer.from(tab.head.daten); head.writeInt16BE(1, 50); head.writeUInt32BE(0, 8); tab.head.daten = head;
  }
  return ttfBauen(flavor, tabellen.map((t) => ({ tag: t.tag, daten: tab[t.tag].daten })));
}

function glyfZurueck(d) {
  let o = 0;
  const u16 = () => { const v = d.readUInt16BE(o); o += 2; return v; };
  const u32 = () => { const v = d.readUInt32BE(o); o += 4; return v; };
  u16(); const optionen = u16(); const anzahl = u16(); u16();
  const groessen = [u32(), u32(), u32(), u32(), u32(), u32(), u32()];
  const stroeme = []; let s = o;
  for (const g of groessen) { stroeme.push({ d: d.subarray(s, s + g), o: 0 }); s += g; }
  const [nKont, nPunkte, flags, glyphen, zusammen, bbox, befehle] = stroeme;
  const r8 = (st) => st.d[st.o++];
  const r16 = (st) => { const v = st.d.readUInt16BE(st.o); st.o += 2; return v; };
  const ri16 = (st) => { const v = st.d.readInt16BE(st.o); st.o += 2; return v; };
  const r255 = (st) => { const c = r8(st); if (c === 253) return r16(st); if (c === 255) return r8(st) + 253; if (c === 254) return r8(st) + 506; return c; };
  const bitmapLaenge = ((anzahl + 31) >> 5) << 2;
  const bboxBits = bbox.d.subarray(0, bitmapLaenge); bbox.o = bitmapLaenge;
  const hatBbox = (i) => (bboxBits[i >> 3] & (0x80 >> (i & 7))) !== 0;
  let ueberlapp = null;
  if (optionen & 1) ueberlapp = d.subarray(s, s + ((anzahl + 7) >> 3));
  const teile = []; const loca = Buffer.alloc((anzahl + 1) * 4); let pos = 0;
  const vz = (f, w) => ((f & 1) ? w : -w);
  for (let i = 0; i < anzahl; i++) {
    const nc = ri16(nKont);
    let glyph = Buffer.alloc(0);
    if (nc > 0) {
      const enden = []; let summe = 0;
      for (let k = 0; k < nc; k++) { summe += r255(nPunkte); enden.push(summe - 1); }
      const punkte = []; let x = 0, y = 0;
      for (let k = 0; k < summe; k++) {
        let f = r8(flags); const an = !(f >> 7); f &= 0x7f;
        let dx, dy;
        const b0 = () => r8(glyphen);
        if (f < 10) { dx = 0; dy = vz(f, ((f & 14) << 7) + b0()); }
        else if (f < 20) { dx = vz(f, (((f - 10) & 14) << 7) + b0()); dy = 0; }
        else if (f < 84) { const a = f - 20; const c = b0(); dx = vz(f, 1 + (a & 0x30) + (c >> 4)); dy = vz(f >> 1, 1 + ((a & 0x0c) << 2) + (c & 0x0f)); }
        else if (f < 120) { const a = f - 84; const c0 = b0(); const c1 = b0(); dx = vz(f, 1 + (Math.floor(a / 12) << 8) + c0); dy = vz(f >> 1, 1 + (((a % 12) >> 2) << 8) + c1); }
        else if (f < 124) { const c0 = b0(); const c1 = b0(); const c2 = b0(); dx = vz(f, (c0 << 4) + (c1 >> 4)); dy = vz(f >> 1, ((c1 & 0x0f) << 8) + c2); }
        else { const c0 = b0(); const c1 = b0(); const c2 = b0(); const c3 = b0(); dx = vz(f, (c0 << 8) + c1); dy = vz(f >> 1, (c2 << 8) + c3); }
        x += dx; y += dy; punkte.push({ x, y, dx, dy, an });
      }
      const befLaenge = r255(glyphen);
      const bef = befehle.d.subarray(befehle.o, befehle.o + befLaenge); befehle.o += befLaenge;
      let box;
      if (hatBbox(i)) box = [ri16(bbox), ri16(bbox), ri16(bbox), ri16(bbox)];
      else { const xs = punkte.map((q) => q.x), ys = punkte.map((q) => q.y); box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; }
      const ol = ueberlapp && (ueberlapp[i >> 3] & (0x80 >> (i & 7)));
      const g = Buffer.alloc(10 + 2 * nc + 2 + befLaenge + summe * 5);
      let w = 0;
      g.writeInt16BE(nc, w); w += 2; for (const v of box) { g.writeInt16BE(v, w); w += 2; }
      for (const e of enden) { g.writeUInt16BE(e, w); w += 2; }
      g.writeUInt16BE(befLaenge, w); w += 2; bef.copy(g, w); w += befLaenge;
      punkte.forEach((q, k) => { g[w++] = (q.an ? 1 : 0) | (k === 0 && ol ? 0x40 : 0); });
      for (const q of punkte) { g.writeInt16BE(q.dx, w); w += 2; }
      for (const q of punkte) { g.writeInt16BE(q.dy, w); w += 2; }
      glyph = g.subarray(0, w);
    } else if (nc < 0) {
      const anfang = zusammen.o; let mitBefehlen = false; let weiter = true;
      while (weiter) {
        const f = r16(zusammen); r16(zusammen);
        zusammen.o += (f & 1) ? 4 : 2;
        if (f & 0x8) zusammen.o += 2; else if (f & 0x40) zusammen.o += 4; else if (f & 0x80) zusammen.o += 8;
        if (f & 0x100) mitBefehlen = true;
        weiter = (f & 0x20) !== 0;
      }
      const teil = zusammen.d.subarray(anfang, zusammen.o);
      const box = [ri16(bbox), ri16(bbox), ri16(bbox), ri16(bbox)];
      let bef = Buffer.alloc(0);
      if (mitBefehlen) { const l = r255(glyphen); bef = befehle.d.subarray(befehle.o, befehle.o + l); befehle.o += l; }
      const g = Buffer.alloc(10 + teil.length + (mitBefehlen ? 2 + bef.length : 0));
      let w = 0; g.writeInt16BE(-1, w); w += 2; for (const v of box) { g.writeInt16BE(v, w); w += 2; }
      teil.copy(g, w); w += teil.length;
      if (mitBefehlen) { g.writeUInt16BE(bef.length, w); w += 2; bef.copy(g, w); }
      glyph = g;
    }
    const pad = (4 - (glyph.length % 4)) % 4;
    loca.writeUInt32BE(pos, i * 4);
    teile.push(glyph, Buffer.alloc(pad)); pos += glyph.length + pad;
  }
  loca.writeUInt32BE(pos, anzahl * 4);
  return { glyf: Buffer.concat(teile), loca };
}

function pruefsumme(buf) { let s = 0; const p = Buffer.concat([buf, Buffer.alloc((4 - buf.length % 4) % 4)]); for (let i = 0; i < p.length; i += 4) s = (s + p.readUInt32BE(i)) >>> 0; return s; }

function ttfBauen(flavor, tabellen) {
  tabellen = [...tabellen].sort((a, b) => (a.tag < b.tag ? -1 : 1));
  const n = tabellen.length; let e = 0; while ((1 << (e + 1)) <= n) e++;
  const kopf = Buffer.alloc(12 + 16 * n);
  kopf.writeUInt32BE(flavor, 0); kopf.writeUInt16BE(n, 4); kopf.writeUInt16BE((1 << e) * 16, 6); kopf.writeUInt16BE(e, 8); kopf.writeUInt16BE(n * 16 - (1 << e) * 16, 10);
  let off = kopf.length; const teile = [kopf];
  tabellen.forEach((t, i) => {
    const r = 12 + 16 * i; kopf.write(t.tag, r, 'latin1'); kopf.writeUInt32BE(pruefsumme(t.daten), r + 4); kopf.writeUInt32BE(off, r + 8); kopf.writeUInt32BE(t.daten.length, r + 12);
    const pad = (4 - (t.daten.length % 4)) % 4; teile.push(t.daten, Buffer.alloc(pad)); off += t.daten.length + pad;
  });
  return Buffer.concat(teile);
}


// WOFF2 ohne Umformung (glyf und loca mit Version 3), alle Tabellen in einem Brotli-Strom.
function ttfNachWoff2(ttf) {
  const anzahl = ttf.readUInt16BE(4);
  const tabellen = [];
  for (let i = 0; i < anzahl; i++) {
    const r = 12 + 16 * i;
    tabellen.push({ tag: ttf.toString('latin1', r, r + 4), daten: ttf.subarray(ttf.readUInt32BE(r + 8), ttf.readUInt32BE(r + 8) + ttf.readUInt32BE(r + 12)) });
  }
  const base128 = (v) => { const b = []; do { b.unshift(v & 0x7f); v = Math.floor(v / 128); } while (v > 0); return b.map((x, i) => (i < b.length - 1 ? x | 0x80 : x)); };
  const verzeichnis = [];
  for (const t of tabellen) {
    const index = TAGS.indexOf(t.tag);
    const version = t.tag === 'glyf' || t.tag === 'loca' ? 3 : 0;
    if (index >= 0) verzeichnis.push((version << 6) | index); else verzeichnis.push((version << 6) | 63, ...Buffer.from(t.tag, 'latin1'));
    verzeichnis.push(...base128(t.daten.length));
  }
  const strom = brotliCompressSync(Buffer.concat(tabellen.map((t) => t.daten)), { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_FONT } });
  const sfnt = 12 + 16 * anzahl + tabellen.reduce((s, t) => s + Math.ceil(t.daten.length / 4) * 4, 0);
  const ohnePolster = 48 + verzeichnis.length + strom.length;
  const laenge = Math.ceil(ohnePolster / 4) * 4;
  const kopf = Buffer.alloc(48);
  kopf.write('wOF2', 0, 'latin1'); kopf.writeUInt32BE(ttf.readUInt32BE(0), 4); kopf.writeUInt32BE(laenge, 8); kopf.writeUInt16BE(anzahl, 12);
  kopf.writeUInt32BE(sfnt, 16); kopf.writeUInt32BE(strom.length, 20); kopf.writeUInt16BE(1, 24);
  return Buffer.concat([kopf, Buffer.from(verzeichnis), strom, Buffer.alloc(laenge - ohnePolster)]);
}

const arbeit = mkdtempSync(join(tmpdir(), 'schrift-ro-'));
try {
  const voll = join(arbeit, 'voll.ttf');
  const klein = join(arbeit, 'klein.ttf');
  writeFileSync(voll, woff2NachTtf(readFileSync(QUELLE)));
  execFileSync('hb-subset', [voll, `--unicodes=${ZEICHEN}`, `--output-file=${klein}`], { stdio: 'inherit' });
  const woff2 = ttfNachWoff2(readFileSync(klein));
  // Gegenprobe: wieder entpacken muss dieselben Tabellen ergeben.
  const zurueck = woff2NachTtf(woff2);
  if (zurueck.readUInt16BE(4) !== readFileSync(klein).readUInt16BE(4)) throw new Error('Gegenprobe: Anzahl der Tabellen weicht ab');
  writeFileSync(ZIEL, woff2);
  console.log(`${ZIEL}: ${woff2.length} Bytes`);
  if (woff2.length > 4096) console.warn('Größer als 4 KB: Vite setzt die Datei dann nicht mehr ins CSS, sie wird eine eigene Anfrage.');
} finally {
  rmSync(arbeit, { recursive: true, force: true });
}
