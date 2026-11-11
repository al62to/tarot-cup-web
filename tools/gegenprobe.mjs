// Gegenprobe zu tools/pruefe_bau.mjs (Auftrag AP-W1, Teil I: jede Prüfung einmal absichtlich auslösen). Kopiert den
// fertigen Bau in einen Arbeitsordner, baut je Prüfung genau einen Fehler ein und erwartet, dass die Prüfung mit
// passender Meldung abbricht. Der Bau selbst bleibt unberührt.
// Aufruf: node tools/gegenprobe.mjs dist <arbeitsordner>
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { pruefeBau } from './pruefe_bau.mjs';

const [bau = 'dist', arbeit] = process.argv.slice(2);
if (!arbeit) throw new Error('Aufruf: node tools/gegenprobe.mjs dist <arbeitsordner>');

const ersetze = (ordner, datei, alt, neu) => {
  const pfad = join(ordner, datei);
  const text = readFileSync(pfad, 'utf8');
  if (!text.includes(alt)) throw new Error(`Gegenprobe: ${alt} nicht in ${datei}`);
  writeFileSync(pfad, text.replace(alt, neu));
};

const FAELLE = [
  { nr: 1, name: 'Rider-Waite im Text', erwartet: '[1 Rider-Waite]', tun: (o) => ersetze(o, 'tarot/index.html', '</h1>', ' nach Rider–Waite</h1>') },
  { nr: 1, name: 'Waite im Dateinamen', erwartet: '[1 Rider-Waite im Dateinamen]', tun: (o) => copyFileSync(join(o, 'favicon.svg'), join(o, 'waite.svg')) },
  { nr: 2, name: 'Gratis-Aussage', erwartet: '[2 Preis/Gratis]', tun: (o) => ersetze(o, 'index.html', '</h1>', ' kostenlos</h1>') },
  { nr: 2, name: 'Preis auf Türkisch', erwartet: '[2 Preis/Gratis]', tun: (o) => ersetze(o, 'tr/index.html', '</h1>', ' Ücretsiz</h1>') },
  { nr: 2, name: 'offers in JSON-LD', erwartet: '[2 Preis/Gratis]', tun: (o) => ersetze(o, 'index.html', '"@type":"MobileApplication",', '"@type":"MobileApplication","offers":{"price":"0"},') },
  { nr: 3, name: 'KI im Text', erwartet: '[3 KI]', tun: (o) => ersetze(o, 'fragen/index.html', '</h1>', ' mit KI</h1>') },
  { nr: 3, name: 'yapay zeka', erwartet: '[3 KI]', tun: (o) => ersetze(o, 'tr/sorular/index.html', '</h1>', ' yapay zekâ</h1>') },
  { nr: 4, name: 'Skript von fremder Domain', erwartet: '[4 fremde Domain]', tun: (o) => ersetze(o, 'index.html', '</head>', '<script src="https://cdn.example.com/x.js"></script></head>') },
  { nr: 4, name: 'Schrift von Google Fonts', erwartet: '[4 fremde Domain]', tun: (o) => ersetze(o, 'tarot/index.html', '</head>', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter"></head>') },
  { nr: 5, name: 'alte Adresse fehlt', erwartet: '[5 Adresse fehlt]', tun: (o) => rmSync(join(o, 'datenschutz', '1.0'), { recursive: true }) },
  { nr: 6, name: 'description fehlt', erwartet: '[6 description fehlt]', tun: (o) => { const p = join(o, 'so-gehts/index.html'); writeFileSync(p, readFileSync(p, 'utf8').replace(/<meta name="description"[^>]*>/, '')); } },
  { nr: 6, name: 'Sprachfassung in hreflang fehlt', erwartet: '[6 hreflang fehlt oder falsch]', tun: (o) => { const p = join(o, 'tr/kahve-fali/index.html'); writeFileSync(p, readFileSync(p, 'utf8').replace(/<link rel="alternate" hreflang="de"[^>]*>/, '')); } },
  { nr: 6, name: 'canonical fehlt', erwartet: '[6 canonical]', tun: (o) => { const p = join(o, 'ueber-tarot-cup/index.html'); writeFileSync(p, readFileSync(p, 'utf8').replace(/<link rel="canonical"[^>]*>/, '')); } },
  { nr: 6, name: 'lang falsch', erwartet: '[6 lang]', tun: (o) => ersetze(o, 'tr/hakkinda/index.html', '<html lang="tr"', '<html lang="de"') },
  { nr: 6, name: 'hreflang nicht gegenseitig', erwartet: '[6 hreflang nicht gegenseitig]', tun: (o) => ersetze(o, 'es/tarot/index.html', '<link rel="alternate" hreflang="en" href="https://tarot-cup.com/en/tarot/">', '<link rel="alternate" hreflang="en" href="https://tarot-cup.com/en/tarot/"><link rel="alternate" hreflang="fr" href="https://tarot-cup.com/en/tarot/">') },
  { nr: 6, name: 'canonical doppelt', erwartet: '[6 canonical nicht genau einmal]', tun: (o) => ersetze(o, 'en/faq/index.html', '</head>', '<link rel="canonical" href="https://tarot-cup.com/en/faq/"></head>') },
  { nr: 6, name: 'og:locale falsch', erwartet: '[6 og:locale]', tun: (o) => ersetze(o, 'es/index.html', '<meta property="og:locale" content="es_ES">', '<meta property="og:locale" content="en_US">') },
  { nr: 6, name: 'title fehlt', erwartet: '[6 title fehlt]', tun: (o) => { const p = join(o, 'fragen/index.html'); writeFileSync(p, readFileSync(p, 'utf8').replace(/<title>[^<]*<\/title>/, '')); } },
  { nr: 7, name: 'Kartenbild Der Stern', erwartet: '[7 gesperrtes Kartenbild]', tun: (o) => ersetze(o, 'tarot/index.html', '</main>', '<img src="/bilder/karten/ta_17_stern-240.webp" alt="Der Stern"></main>') },
  { nr: 'Zusatz', name: 'localStorage im Skript', erwartet: '[Speicher/Cookie im Skript]', tun: (o) => ersetze(o, 'index.html', '</body>', '<script>localStorage.setItem("x","1")</script></body>') },
  { nr: 'Zusatz', name: 'anderer Schlüssel neben der Sprach-Hinweisleiste', erwartet: '[Speicher/Cookie im Skript]', tun: (o) => ersetze(o, 'index.html', "localStorage.getItem('tarotcup-sprachhinweis')", "localStorage.getItem('tarotcup-anderes')") },
  { nr: 'Zusatz', name: 'Emoji', erwartet: '[Emoji]', tun: (o) => ersetze(o, 'fragen/index.html', '</h1>', ' \u{1F52E}</h1>') },
  { nr: 8, name: 'Link ins Leere', erwartet: '[8 Link ins Leere]', tun: (o) => ersetze(o, 'en/about/index.html', '</main>', '<a href="/en/gibt-es-nicht/">x</a></main>') },
  { nr: 8, name: 'Sprungmarke fehlt', erwartet: '[8 Sprungmarke fehlt]', tun: (o) => ersetze(o, 'es/preguntas/index.html', '</main>', '<a href="/es/tarot/#gibt-es-nicht">x</a></main>') },
  { nr: 8, name: 'Link in andere Sprache', erwartet: '[8 Link in andere Sprache ohne hreflang]', tun: (o) => ersetze(o, 'en/tarot/index.html', '</main>', '<a href="/tarot/">x</a></main>') },
  { nr: 9, name: 'deutscher Rest auf en', erwartet: '[9 deutscher Rest]', tun: (o) => ersetze(o, 'en/coffee-cup-reading/index.html', '</h1>', ' und die Tasse</h1>') },
  { nr: 9, name: 'Umlaut auf es', erwartet: '[9 deutscher Rest]', tun: (o) => ersetze(o, 'es/acerca-de/index.html', '</h1>', ' für</h1>') },
  { nr: 3, name: 'IA auf Spanisch', erwartet: '[3 KI]', tun: (o) => ersetze(o, 'es/preguntas/index.html', '</h1>', ' con IA</h1>') },
  { nr: 10, name: 'JSON-LD unbekannte Eigenschaft', erwartet: '[10 JSON-LD schema.org]', tun: (o) => ersetze(o, 'en/index.html', '"@type":"MobileApplication",', '"@type":"MobileApplication","farbe":"gold",') },
  { nr: 10, name: 'JSON-LD inLanguage falsch', erwartet: '[10 JSON-LD schema.org]', tun: (o) => ersetze(o, 'es/tarot/index.html', '"inLanguage":"es"', '"inLanguage":"de"') },
  { nr: 'Zusatz', name: 'türkisches Wort ohne lang', erwartet: '[lang fehlt]', tun: (o) => ersetze(o, 'kaffeesatz-lesen/index.html', '</h1>', ' niyet tutmak</h1>') },
];

let ok = 0;
const zeilen = ['| Nr. | Gegenprobe | erwartete Meldung | Ergebnis |', '|---|---|---|---|'];
// Erst der unveränderte Bau: kein Befund.
pruefeBau(bau, { still: true });
for (const fall of FAELLE) {
  if (existsSync(arbeit)) rmSync(arbeit, { recursive: true });
  cpSync(bau, arbeit, { recursive: true });
  fall.tun(arbeit);
  let meldung = '';
  try {
    pruefeBau(arbeit, { still: true });
  } catch (fehler) {
    meldung = fehler.message;
  }
  const getroffen = meldung.includes(fall.erwartet);
  if (getroffen) ok++;
  const zeile = meldung.split('\n').find((teil) => teil.includes(fall.erwartet))?.trim() ?? (meldung ? 'andere Meldung' : 'kein Abbruch');
  zeilen.push(`| ${fall.nr} | ${fall.name} | \`${fall.erwartet}\` | ${getroffen ? 'bricht ab' : '**nicht erkannt**'}: ${zeile.replace(/\|/g, '/').slice(0, 160)} |`);
}
rmSync(arbeit, { recursive: true, force: true });
console.log(zeilen.join('\n'));
console.log(`\n${ok} von ${FAELLE.length} Gegenproben erkannt`);
process.exit(ok === FAELLE.length ? 0 : 1);
