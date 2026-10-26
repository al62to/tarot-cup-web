// Kleiner lokaler Server für einen fertigen Bau, der sich wie GitHub Pages verhält: Ordner liefern index.html, Text
// wird mit gzip komprimiert, unbekannte Adressen bekommen /404.html mit Status 404. Für Messungen (Lighthouse) und
// Prüfungen vor dem Veröffentlichen; nur auf 127.0.0.1.
// Aufruf: node tools/vorschau.mjs <ordner> <port>
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { createGzip } from 'node:zlib';

const [ordner = 'dist', port = '4323'] = process.argv.slice(2);
const wurzel = resolve(ordner);
const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};
const KOMPRIMIEREN = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

function senden(antwort, anfrage, datei, status = 200) {
  const typ = TYPEN[extname(datei)] ?? 'application/octet-stream';
  const gzip = KOMPRIMIEREN.has(extname(datei)) && /\bgzip\b/.test(anfrage.headers['accept-encoding'] ?? '');
  antwort.writeHead(status, { 'Content-Type': typ, 'Cache-Control': 'max-age=600', ...(gzip ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}) });
  const strom = createReadStream(datei);
  (gzip ? strom.pipe(createGzip()) : strom).pipe(antwort);
}

createServer((anfrage, antwort) => {
  const pfad = decodeURIComponent(new URL(anfrage.url, 'http://x').pathname);
  let datei = normalize(join(wurzel, pfad));
  if (!datei.startsWith(wurzel)) return antwort.writeHead(403).end();
  if (existsSync(datei) && statSync(datei).isDirectory()) {
    if (!pfad.endsWith('/')) return antwort.writeHead(301, { Location: `${pfad}/` }).end();
    datei = join(datei, 'index.html');
  }
  if (existsSync(datei) && statSync(datei).isFile()) return senden(antwort, anfrage, datei);
  senden(antwort, anfrage, join(wurzel, '404.html'), 404);
}).listen(Number(port), '127.0.0.1', () => console.log(`Vorschau ${wurzel} auf http://127.0.0.1:${port}`));
