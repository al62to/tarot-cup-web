// Prüfungen nach dem Bau (Auftrag AP-W1, Teil I; Muster foodasu-web/tools). Läuft am Ende jedes Baus
// (astro.config.mjs) und einzeln mit "npm run pruefen" (node tools/pruefe_bau.mjs dist). Jeder Fund bricht ab und
// nennt Datei und Fund.
//  1. „Rider-Waite“ in irgendeiner Schreibweise (auch „Waite“ allein), in Inhalten und Dateinamen.
//  2. Preis- und Gratis-Aussagen (außer im Wortlaut der Rechtstexte, Elemente mit data-rechtstext).
//  3. Aussagen zu KI (außer im Wortlaut der Rechtstexte).
//  4. Laden von einer fremden Domain (Links sind erlaubt).
//  5. Eine Adresse aus der Liste vor dem Umbau fehlt (tools/adressen_vor_apw1.txt).
//  6. Seite ohne title, description, canonical, lang oder Gegenseite in hreflang (ausgenommen Seiten nur auf Deutsch);
//     jede Seite im Bau steht in src/daten/seiten.mjs und umgekehrt; Robots passt zum Schalter E8.
//  7. Kartenbild mit nackten Figuren (src/daten/karten.mjs, GESPERRT).
// Dazu: nichts im Speicher des Browsers und keine Cookies (Skripte), keine Emojis, gültige strukturierte Daten mit den
// Pflichttypen je Seite, türkische Wörter auf deutschen Seiten mit lang="tr".
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEITEN } from '../src/daten/seiten.mjs';
import { seite, store, suche } from '../src/daten/seite.mjs';
import { GESPERRT } from '../src/daten/karten.mjs';
import { begriffe } from '../src/daten/sprachen.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEXT = /\.(html|txt|xml|js|mjs|css|json|svg|webmanifest)$/i;

function alleDateien(ordner) {
  const liste = [];
  (function lauf(pfad) {
    for (const name of readdirSync(pfad)) {
      const datei = join(pfad, name);
      if (statSync(datei).isDirectory()) lauf(datei);
      else liste.push(datei);
    }
  })(ordner);
  return liste;
}

// Schneidet Elemente mit data-rechtstext heraus (der Wortlaut der Rechtstexte ist von den Wortprüfungen ausgenommen).
export function ohneRechtstext(html) {
  let aus = html;
  for (;;) {
    const start = aus.search(/<div\b[^>]*\sdata-rechtstext\b[^>]*>/);
    if (start < 0) return aus;
    const muster = /<div\b[^>]*>|<\/div>/g;
    muster.lastIndex = start;
    let tiefe = 0;
    let ende = -1;
    for (let treffer = muster.exec(aus); treffer; treffer = muster.exec(aus)) {
      tiefe += treffer[0].startsWith('</') ? -1 : 1;
      if (tiefe === 0) {
        ende = treffer.index + treffer[0].length;
        break;
      }
    }
    if (ende < 0) throw new Error('data-rechtstext ohne Ende');
    aus = aus.slice(0, start) + aus.slice(ende);
  }
}

const umgebung = (text, stelle, laenge = 40) => text.slice(Math.max(0, stelle - laenge), stelle + laenge).replace(/\s+/g, ' ');
const R = (quelle, schalter = 'gu') => new RegExp(`(?<![\\p{L}\\p{N}])(?:${quelle})(?![\\p{L}\\p{N}])`, schalter);

export const MUSTER = {
  riderWaite: /r\W{0,2}i\W{0,2}d\W{0,2}e\W{0,2}r[\s\-–—_./]*w\W{0,2}a\W{0,2}i\W{0,2}t\W{0,2}e|waite/giu,
  preis: R('gratis|kostenlos\\p{L}*|umsonst|free|ücretsiz\\p{L}*|bedava\\p{L}*|preis\\p{L}*|fiyat\\p{L}*|euro|offers|price\\p{L}*', 'giu'),
  // KI und AI nur in Großbuchstaben als ganzes Wort; die anderen ohne Rücksicht auf die Schreibung.
  kiGross: R('KI|AI'),
  ki: R('künstliche\\p{L}*\\s+intelligenz\\p{L}*|yapay\\s+zek[aâ]\\p{L}*|artificial\\s+intelligence', 'giu'),
  speicher: /localStorage|sessionStorage|indexedDB|document\.cookie|navigator\.storage|caches\.open/g,
  emoji: /\p{Extended_Pictographic}/gu,
};

export function pruefeBau(ordner, { still = false } = {}) {
  const befunde = [];
  const melde = (datei, regel, fund) => befunde.push(`${relative(ordner, datei).split(sep).join('/')}: [${regel}] ${fund}`);
  const dateien = alleDateien(ordner);
  const htmlDateien = dateien.filter((datei) => datei.endsWith('.html'));

  // 1 und 7: Dateinamen.
  for (const datei of dateien) {
    const name = relative(ordner, datei);
    for (const fund of name.matchAll(MUSTER.riderWaite)) melde(datei, '1 Rider-Waite im Dateinamen', fund[0]);
    for (const id of GESPERRT) if (name.includes(id)) melde(datei, '7 gesperrtes Kartenbild', id);
  }

  for (const datei of dateien.filter((kandidat) => TEXT.test(kandidat))) {
    const inhalt = readFileSync(datei, 'utf8');
    // 1: überall, auch im Wortlaut der Rechtstexte.
    for (const fund of inhalt.matchAll(MUSTER.riderWaite)) melde(datei, '1 Rider-Waite', `„${fund[0]}“ in „${umgebung(inhalt, fund.index)}“`);
    // 7: Verweis auf ein gesperrtes Kartenbild.
    for (const id of GESPERRT) {
      const stelle = inhalt.search(new RegExp(`bilder/karten/${id}`));
      if (stelle >= 0) melde(datei, '7 gesperrtes Kartenbild', `${id} in „${umgebung(inhalt, stelle)}“`);
    }
    // Skripte: nichts im Speicher des Browsers, keine Cookies.
    if (/\.(m?js|html)$/.test(datei)) {
      const skripte = datei.endsWith('.html') ? [...inhalt.matchAll(/<script\b(?![^>]*application\/(?:ld\+)?json)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n') : inhalt;
      for (const fund of skripte.matchAll(MUSTER.speicher)) melde(datei, 'Speicher/Cookie im Skript', fund[0]);
    }
    if (!/\.(html|txt|xml)$/.test(datei)) continue;
    const ohne = datei.endsWith('.html') ? ohneRechtstext(inhalt) : inhalt;
    // E-Mail-Adresse als HTML-Entitäten zählt nicht als Text.
    for (const fund of ohne.matchAll(MUSTER.preis)) melde(datei, '2 Preis/Gratis', `„${fund[0]}“ in „${umgebung(ohne, fund.index)}“`);
    for (const fund of ohne.matchAll(MUSTER.kiGross)) melde(datei, '3 KI', `„${fund[0]}“ in „${umgebung(ohne, fund.index)}“`);
    for (const fund of ohne.matchAll(MUSTER.ki)) melde(datei, '3 KI', `„${fund[0]}“ in „${umgebung(ohne, fund.index)}“`);
    for (const fund of inhalt.matchAll(MUSTER.emoji)) melde(datei, 'Emoji', `„${fund[0]}“ in „${umgebung(inhalt, fund.index)}“`);
  }

  // 4: Laden von fremden Domains. Erlaubt: relative Adressen, data:, die eigene Domain.
  const eigen = (adresse) => !/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(adresse) || adresse.startsWith(`${seite.adresse}/`) || adresse === seite.adresse;
  const ladeAdressen = (html) => {
    const liste = [];
    for (const m of html.matchAll(/<(img|script|iframe|embed|source|video|audio|track|input|object)\b[^>]*>/gi)) {
      for (const a of m[0].matchAll(/\s(src|data|poster)="([^"]*)"/gi)) liste.push(a[2]);
      for (const a of m[0].matchAll(/\ssrcset="([^"]*)"/gi)) liste.push(...a[1].split(',').map((teil) => teil.trim().split(/\s+/)[0]));
    }
    for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
      const href = m[0].match(/\shref="([^"]*)"/i)?.[1];
      if (href) liste.push(href);
    }
    for (const m of html.matchAll(/<meta\b[^>]*(?:og:image|twitter:image)"[^>]*>/gi)) {
      const wert = m[0].match(/\scontent="([^"]*)"/i)?.[1];
      if (wert) liste.push(wert);
    }
    for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)/gi)) liste.push(m[1]);
    for (const m of html.matchAll(/@import\s+['"]([^'"]+)/gi)) liste.push(m[1]);
    for (const m of html.matchAll(/\bimport\s*\(\s*['"]([^'"]+)/g)) liste.push(m[1]);
    for (const m of html.matchAll(/\bfetch\s*\(\s*['"]([^'"]+)/g)) liste.push(m[1]);
    return liste;
  };
  for (const datei of dateien.filter((kandidat) => /\.(html|css|m?js|svg)$/.test(kandidat))) {
    const inhalt = readFileSync(datei, 'utf8');
    for (const roh of ladeAdressen(inhalt)) {
      const adresse = roh.trim();
      if (!eigen(adresse)) {
        melde(datei, '4 fremde Domain', adresse);
        continue;
      }
      // Eigene Adresse: Die Datei muss im Bau liegen (kein fehlendes Bild, kein toter Verweis im Kopf).
      if (!adresse || adresse.startsWith('data:') || adresse.startsWith('#')) continue;
      let pfad = adresse.startsWith(seite.adresse) ? adresse.slice(seite.adresse.length) : adresse;
      pfad = decodeURI(pfad.split(/[?#]/)[0]);
      if (!pfad.startsWith('/')) pfad = new URL(pfad, `https://x/${relative(ordner, datei).split(sep).join('/')}`).pathname;
      const ziel = pfad.endsWith('/') ? join(ordner, pfad, 'index.html') : join(ordner, pfad);
      if (!existsSync(ziel)) melde(datei, 'Datei fehlt im Bau', adresse);
    }
  }

  // Store öffentlich: Die offiziellen Abzeichen müssen als lokale Dateien da sein (vorher bleibt die Fläche leer).
  if (store.oeffentlich) {
    for (const [sprache, abzeichen] of Object.entries(store.abzeichen)) {
      if (!existsSync(join(ordner, abzeichen.pfad))) melde(join(ordner, abzeichen.pfad), 'Store-Abzeichen fehlt', `${sprache}: ${abzeichen.pfad}`);
    }
  }

  // 5: Adressen vor dem Umbau.
  const vorher = readFileSync(join(WURZEL, 'tools', 'adressen_vor_apw1.txt'), 'utf8').split('\n').map((zeile) => zeile.trim()).filter((zeile) => zeile && !zeile.startsWith('#'));
  const dateiZu = (pfad) => (pfad.endsWith('/') ? join(ordner, pfad, 'index.html') : join(ordner, pfad));
  for (const pfad of vorher) if (!existsSync(dateiZu(pfad))) melde(join(ordner, pfad), '5 Adresse fehlt', pfad);

  // 6: Kopfdaten jeder Seite gegen src/daten/seiten.mjs.
  const bekannt = new Set();
  for (const eintrag of SEITEN) {
    const datei = dateiZu(eintrag.pfad);
    bekannt.add(datei);
    if (!existsSync(datei)) {
      melde(datei, '6 Seite fehlt im Bau', eintrag.pfad);
      continue;
    }
    const html = readFileSync(datei, 'utf8');
    const kopf = html.slice(0, html.indexOf('</head>'));
    const lang = html.match(/<html\b[^>]*\slang="([^"]+)"/)?.[1];
    const titel = kopf.match(/<title>([^<]*)<\/title>/)?.[1];
    const beschreibung = kopf.match(/<meta name="description" content="([^"]*)"/)?.[1];
    const kanonisch = kopf.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const robots = kopf.match(/<meta name="robots" content="([^"]*)"/)?.[1];
    const alternativen = Object.fromEntries([...kopf.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]*)"/g)].map((m) => [m[1], m[2]]));
    const dekodiert = (text) => text?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (!titel) melde(datei, '6 title fehlt', eintrag.pfad);
    else if (dekodiert(titel) !== eintrag.titel) melde(datei, '6 title weicht ab', `${dekodiert(titel)} ≠ ${eintrag.titel}`);
    if (!beschreibung) melde(datei, '6 description fehlt', eintrag.pfad);
    else if (dekodiert(beschreibung) !== eintrag.beschreibung) melde(datei, '6 description weicht ab', eintrag.pfad);
    if (kanonisch !== seite.adresse + eintrag.pfad) melde(datei, '6 canonical', `${kanonisch} ≠ ${seite.adresse + eintrag.pfad}`);
    if (lang !== eintrag.sprache) melde(datei, '6 lang', `${lang} ≠ ${eintrag.sprache}`);
    if (eintrag.gegenseite) {
      const andere = eintrag.sprache === 'de' ? 'tr' : 'de';
      if (alternativen[eintrag.sprache] !== seite.adresse + eintrag.pfad) melde(datei, '6 hreflang eigene Sprache', eintrag.pfad);
      if (alternativen[andere] !== seite.adresse + eintrag.gegenseite) melde(datei, '6 hreflang Gegenseite fehlt', `${andere} → ${eintrag.gegenseite}`);
      if (!alternativen['x-default']) melde(datei, '6 hreflang x-default fehlt', eintrag.pfad);
    } else if (eintrag.sprache !== 'de') {
      melde(datei, '6 Seite ohne Gegenseite', `nur deutsche Seiten dürfen ohne Gegenseite sein (${eintrag.pfad})`);
    } else if (Object.keys(alternativen).length) {
      melde(datei, '6 hreflang ohne Gegenseite', eintrag.pfad);
    }
    // Schalter E8: ohne Freigabe trägt jede Seite noindex; mit Freigabe nur die Seiten ohne Index.
    if (eintrag.imIndex && robots) melde(datei, 'E8 robots', `Seite im Index trägt ${robots}`);
    if (!eintrag.imIndex && !/noindex/.test(robots ?? '')) melde(datei, 'E8 robots', 'noindex fehlt');

    // Strukturierte Daten: gültiges JSON, Pflichttypen.
    const typen = [];
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        const daten = JSON.parse(m[1]);
        typen.push(daten['@type']);
        const text = JSON.stringify(daten);
        if (/"(offers|price|priceCurrency|aggregateRating|review|isAccessibleForFree|sameAs)"/.test(text)) melde(datei, 'JSON-LD verbotenes Feld', text.match(/"(offers|price|priceCurrency|aggregateRating|review|isAccessibleForFree|sameAs)"/)[1]);
      } catch (fehler) {
        melde(datei, 'JSON-LD ungültig', fehler.message);
      }
    }
    const pflicht = ['WebSite', 'Organization'];
    if (eintrag.krumen) pflicht.push('BreadcrumbList');
    const jeSeite = { start: ['MobileApplication', 'FAQPage'], tarot: ['Article', 'HowTo'], kaffeesatz: ['Article', 'HowTo'], sogehts: ['Article'], fragen: ['FAQPage'], ueber: ['AboutPage'] };
    pflicht.push(...(jeSeite[eintrag.schluessel] ?? []));
    for (const typ of pflicht) if (!typen.includes(typ)) melde(datei, 'JSON-LD Pflichttyp fehlt', typ);
  }
  for (const datei of htmlDateien) if (!bekannt.has(datei)) melde(datei, '6 Seite nicht in src/daten/seiten.mjs', relative(ordner, datei));

  // Türkische Wörter auf deutschen Seiten tragen lang="tr" (gesetzt von tools/sprache_setzen.mjs).
  const tuerkisch = begriffe.filter((eintrag) => eintrag.nur === 'de');
  for (const datei of htmlDateien) {
    const html = readFileSync(datei, 'utf8');
    if (!/<html[^>]*\slang="de"/.test(html)) continue;
    // Sichtbarer Text außerhalb von Elementen mit lang, ohne Skripte, Stile, title.
    const rest = html
      .replace(/<(script|style|title)\b[\s\S]*?<\/\1>/g, ' ')
      .replace(/<span lang="[^"]+">[^<]*<\/span>/g, ' ')
      .replace(/<[^>]+>/g, ' ');
    for (const { text } of tuerkisch) {
      const stelle = rest.indexOf(text);
      if (stelle >= 0) melde(datei, 'lang="tr" fehlt', `„${text}“`);
    }
  }

  if (befunde.length) {
    throw new Error(`Prüfung nach dem Bau: ${befunde.length} Befund(e)\n  ${befunde.join('\n  ')}`);
  }
  const ergebnis = { dateien: dateien.length, seiten: htmlDateien.length, adressenVorher: vorher.length };
  if (!still) console.log(`Prüfung nach dem Bau: ${ergebnis.dateien} Dateien, ${ergebnis.seiten} Seiten, ${ergebnis.adressenVorher} Adressen von vorher, kein Befund`);
  return ergebnis;
}

// Aufruf von der Kommandozeile: node tools/pruefe_bau.mjs dist
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ordner = process.argv[2] ?? 'dist';
  try {
    pruefeBau(join(process.cwd(), ordner));
  } catch (fehler) {
    console.error(fehler.message);
    process.exit(1);
  }
}
void suche;
