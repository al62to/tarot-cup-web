// Prüfungen nach dem Bau (Auftrag AP-W1, Teil I; Muster foodasu-web/tools). Läuft am Ende jedes Baus
// (astro.config.mjs) und einzeln mit "npm run pruefen" (node tools/pruefe_bau.mjs dist). Jeder Fund bricht ab und
// nennt Datei und Fund.
//  1. „Rider-Waite“ in irgendeiner Schreibweise (auch „Waite“ allein), in Inhalten und Dateinamen.
//  2. Preis- und Gratis-Aussagen (außer im Wortlaut der Rechtstexte, Elemente mit data-rechtstext).
//  3. Aussagen zu KI (außer im Wortlaut der Rechtstexte).
//  4. Laden von einer fremden Domain (Links sind erlaubt).
//  5. Eine Adresse aus der Liste vor dem Umbau fehlt (tools/adressen_vor_apw1.txt).
//  6. Seite ohne title, description, genau eine canonical, lang, og:locale oder ohne alle Sprachfassungen in hreflang
//     (ausgenommen Seiten nur auf Deutsch); hreflang im Bau gegenseitig und vollständig, x-default auf Englisch (sonst
//     Deutsch); jede Seite im Bau steht in src/daten/seiten.mjs und umgekehrt; Robots passt zum Schalter E8.
//  8. Interne Links (AP-SPR2): jedes Ziel liegt im Bau, jede Sprungmarke gibt es auf der Zielseite; ein Link ohne
//     hreflang führt nicht in eine andere Sprache, wenn es die Zielseite auch in der Sprache der Seite gibt (Seiten nur
//     in einer Sprache wie /offenlegung/ und /app/ sind von überall erlaubt), ein Link mit hreflang führt auf eine
//     Seite dieser Sprache. Links im Wortlaut der Rechtstexte zählen nur für die Erreichbarkeit.
// Entwurf der Übersetzung: Mit UEBERSETZUNG_ENTWURF=1 sind die Regeln 2, 3 und 9 auf englischen und spanischen Seiten
// nur Warnungen (solange die Texte aus deutung-unterlagen/uebersetzung/ noch durchgesehen werden). Ohne die Variable,
// also auch im Workflow auf GitHub, brechen sie ab.
//  9. Keine deutschen Reste auf englischen und spanischen Seiten (Umlaute, ß, häufige deutsche Wörter) außerhalb von
//     Elementen mit lang (AP-SPR2). Auch im Wortlaut der Rechtstexte.
// 10. JSON-LD gegen einen Auszug aus schema.org (src/daten/schema_auszug.mjs): bekannter Typ, nur Eigenschaften des
//     Typs (samt Obertypen), inLanguage passt zur Seite.
//  7. Kartenbild mit nackten Figuren (src/daten/karten.mjs, GESPERRT).
// 12. Text-Zwillinge (AP-36): Kein Satz der Website widerspricht der Datenschutzerklärung. tools/zwillinge.json (Kopie von
//     deutung-unterlagen/recht/zwillinge.json; liegt das Repo daneben, müssen beide gleich sein) nennt je Kernaussage
//     verbotene Wendungen in de und tr und Zahlenregeln (Sprachen 12, Fristen 30, 90, 14 Tage), dazu Ausnahmen mit
//     Begründung. Durchsucht wird der sichtbare Text aller Seiten (auch Titel, description, alt, JSON-LD) und llms.txt,
//     nicht die Rechtsseiten und nicht der Wortlaut der Rechtstexte (data-rechtstext).
// 11. Einwilligung (Auftrag W7): Google Tag Manager und Google Analytics nur im einen gebündelten Skript der Einwilligung
//     (Erkennung: es enthält die Adresse des Tag Manager mit GTM_ID, das Cookie „cc_cookie“ und GTM_EREIGNIS), nirgends
//     sonst (kein HTML, kein anderes Skript, keine Mess-ID G-… im Bau). Jede Seite bindet dieses Skript ein und hat in
//     der Fußzeile den Link „Cookie-Einstellungen“ (data-cc="show-preferencesModal") mit dem Text der Sprache der Seite
//     (src/daten/einwilligung.mjs). Dieses eine Skript darf Cookies setzen und löschen (cc_cookie, _ga beim Widerruf);
//     für alle übrigen Skripte gilt die Regel unten weiter.
// Dazu: nichts im Speicher des Browsers und keine Cookies (Skripte; erlaubt ist nur der eine Schlüssel der
// Sprach-Hinweisleiste, MUSTER.speicherErlaubt, Auftrag W5, und das Skript der Einwilligung, Regel 11), keine Emojis, gültige strukturierte Daten mit den
// Pflichttypen je Seite, türkische Wörter auf deutschen Seiten mit lang="tr".
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEITEN } from '../src/daten/seiten.mjs';
import { seite, store, suche } from '../src/daten/seite.mjs';
import { ANGEBOT } from '../src/daten/strukturiert.mjs';
import { EINWILLIGUNG, GTM_ADRESSE, GTM_ID, GTM_EREIGNIS } from '../src/daten/einwilligung.mjs';

// Das eine erlaubte Angebot der App in JSON-LD (AP-21: Preis 0, nur mit öffentlichem Store). Genau diese Zeichenfolge
// nimmt die Prüfung auf Preis und Gratis aus; jede andere Form von offers oder price bleibt ein Befund.
const ANGEBOT_TEXT = store.oeffentlich ? `"offers":${JSON.stringify(ANGEBOT)}` : null;
// AP-WT1 (Freigabe PL 24.11.2026): „gratis laden“ als letzter Satz der Meta-Beschreibung der Startseite (auch og:description
// und die description in WebSite). Ausgenommen ist genau diese Wendung je Sprache und nur am Ende eines Attributs oder
// JSON-Strings (direkt vor dem schließenden Anführungszeichen) oder am Zeilenende (Liste der Seiten in llms.txt); jede
// andere Gratis-Aussage bleibt ein Befund.
const GRATIS_LADEN = ['Gratis laden.', 'Ücretsiz indir.', 'Free to download.', 'Descarga la app gratis.', 'Preuzmi besplatno.',
  'Descarcă gratuit.', 'Baixe grátis.', 'Téléchargement gratuit.', 'Unduh gratis.', 'मुफ़्त डाउनलोड करें।'];
const ohneGratisLaden = (text) => GRATIS_LADEN.reduce((rest, wendung) => rest.replaceAll(`${wendung}"`, '"').replaceAll(`${wendung}\n`, '\n'), text);
import { GESPERRT } from '../src/daten/karten.mjs';
import { begriffe } from '../src/daten/sprachen.mjs';
import { OG_LOCALE, STANDARD_SPRACHE } from '../src/daten/adressen.mjs';
import { pruefeSchema } from '../src/daten/schema_auszug.mjs';

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

// 12: Text-Zwillinge (AP-36). Sichtbarer Text einer Seite als Liste von Sätzen: ohne Skripte, Stile und den Wortlaut
// der Rechtstexte; Blockelemente trennen, Inline-Elemente nicht (Zahlenband: „12“ und „Sprachen“ stehen in zwei span).
// Dazu Titel, description, og:description, alt, aria-label und die Zeichenketten aus JSON-LD.
const BLOCK = /<\/?(?:p|li|ul|ol|h[1-6]|div|section|article|header|footer|nav|main|aside|td|th|tr|table|dt|dd|dl|br|figcaption|figure|summary|details|blockquote|title|button|label|option)\b[^>]*>/gi;
const entitaeten = (text) => text
  .replace(/&#(\d+);/g, (_, zahl) => String.fromCodePoint(Number(zahl)))
  .replace(/&#x([0-9a-f]+);/gi, (_, zahl) => String.fromCodePoint(parseInt(zahl, 16)))
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
export function saetze(text) {
  const liste = [];
  for (const abschnitt of text.split('\n')) {
    const rein = abschnitt.replace(/[\s  ]+/g, ' ').trim();
    if (!rein) continue;
    // Satzende: . ! ? । gefolgt von Leerraum und einem Großbuchstaben, einer Ziffer oder einem Anführungszeichen.
    // Punkte nach Zahlen („16. Jahrhundert“) trennen nicht.
    for (const satz of rein.split(/(?<=(?<!\d)[.!?।])\s+(?=[\p{Lu}\p{N}„“"«(])/u)) if (satz.trim()) liste.push(satz.trim());
  }
  return liste;
}
export function sichtbareSaetze(html) {
  const ohne = ohneRechtstext(html);
  const jsonLd = [...ohne.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    const werte = [];
    (function lauf(wert) {
      if (typeof wert === 'string') { if (/\s/.test(wert) && !/^https?:/.test(wert)) werte.push(wert); } else if (wert && typeof wert === 'object') Object.values(wert).forEach(lauf);
    })(JSON.parse(m[1]));
    return werte;
  });
  const koerper = ohne.replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, ' ');
  const attribute = [...koerper.matchAll(/<(?:meta\b[^>]*(?:name="description"|property="og:description")|img\b|[a-z]+\b[^>]*\saria-label=)[^>]*>/gi)]
    .map((m) => m[0].match(/\s(?:content|alt|aria-label)="([^"]*)"/)?.[1]).filter(Boolean);
  const text = koerper.replace(/<head\b[\s\S]*?<\/head>/i, (kopf) => (kopf.match(/<title>([^<]*)<\/title>/)?.[1] ?? '') + '\n').replace(BLOCK, '\n').replace(/<[^>]+>/g, '');
  const alle = [...saetze(entitaeten(text)), ...attribute.flatMap((wert) => saetze(entitaeten(wert))), ...jsonLd.flatMap((wert) => saetze(wert))];
  return [...new Set(alle)];
}

// Liest die Liste der Kernaussagen (tools/zwillinge.json, Kopie von deutung-unterlagen/recht/zwillinge.json).
export const ZWILLINGE_DATEI = join(dirname(fileURLToPath(import.meta.url)), 'zwillinge.json');
export const ZWILLINGE_QUELLE = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'deutung-unterlagen', 'recht', 'zwillinge.json');
const grenze = (quelle, schalter = 'iu') => new RegExp(`(?<![\\p{L}\\p{N}])(?:${quelle})(?![\\p{L}\\p{N}])`, schalter);
const zahlVor = (wort) => new RegExp(`(?<![\\p{N}.,])(\\d+)\\s*(?:·\\s*)?(?:${wort})(?![\\p{L}\\p{N}])`, 'giu');
// Sätze einer Datei je Sprache: Abschnitte mit eigenem lang (etwa auf /app/) zählen für ihre Sprache.
function saetzeJeSprache(datei, ordner) {
  const name = relative(ordner, datei).split(sep).join('/');
  const inhalt = readFileSync(datei, 'utf8');
  if (!datei.endsWith('.html')) return [[name.match(/^([a-z]{2})\//)?.[1] ?? 'de', saetze(inhalt)]];
  const sprache = inhalt.match(/<html\b[^>]*\slang="([a-z]{2})/)?.[1] ?? 'de';
  const teile = [];
  const rest = inhalt.replace(/<(section|div|article)\b[^>]*\slang="([a-z]{2})"[^>]*>[\s\S]*?<\/\1>/g, (abschnitt, _, lang) => {
    teile.push([lang, sichtbareSaetze(abschnitt)]);
    return ' ';
  });
  return [[sprache, sichtbareSaetze(rest)], ...teile];
}
// Durchsucht einen Bau nach Wendungen aus zwillinge.json. ausgenommen: Pfade der Rechtsseiten (/datenschutz/ usw.).
export function zwillingeBefunde(ordner, liste, ausgenommen) {
  const treffer = [];
  const genutzt = new Set();
  // Selbstprüfung: Die Sätze tragen statt „İ“ ein „i“, eine tr-Wendung mit „İ“ könnte nie zutreffen.
  const fehler = [];
  for (const k of liste.kernaussagen) for (const quelle of k.verboten.tr ?? []) if (quelle.includes('İ')) fehler.push(`${k.id}: ${quelle}`);
  for (const z of liste.zahlen) for (const quelle of [z.anker?.tr, z.wort?.tr]) if (quelle?.includes('İ')) fehler.push(`${z.id}: ${quelle}`);
  const kompiliert = liste.kernaussagen.map((k) => ({ ...k, muster: Object.fromEntries(Object.entries(k.verboten).map(([l, q]) => [l, q.map((quelle) => [quelle, grenze(quelle, 'giu')])])) }));
  const dateien = alleDateien(ordner).filter((datei) => {
    const name = relative(ordner, datei).split(sep).join('/');
    if (/(^|\/)llms\.txt$/.test(name)) return true;
    if (!name.endsWith('.html')) return false;
    return !ausgenommen.has(`/${name.replace(/index\.html$/, '')}`);
  });
  let anzahl = 0;
  for (const datei of dateien) {
    const seitenPfad = `/${relative(ordner, datei).split(sep).join('/').replace(/index\.html$/, '')}`;
    for (const [sprache, liste2] of saetzeJeSprache(datei, ordner)) {
      // Anker aller Zahlenregeln dieser Sprache (eine Zahl gehört zum nächsten Anker davor).
      const ankerAlle = liste.zahlen.map((z) => [z.id, z.anker ? (z.anker[sprache] ?? z.anker['*']) : null]).filter(([, a]) => a);
      for (const roh of liste2) {
        anzahl++;
        const satz = roh.replace(/İ/g, 'i');
        // Ein Treffer an der Stelle von start bis ende; eine Ausnahme deckt ihn nur, wenn er ganz in ihrem Stück liegt.
        const fund = (id, thema, wie, start, ende) => {
          const ausnahme = liste.ausnahmen.findIndex((a) => {
            const stelle = a.id === id && a.seite === seitenPfad ? roh.indexOf(a.satz) : -1;
            return stelle >= 0 && start >= stelle && ende <= stelle + a.satz.length;
          });
          if (ausnahme >= 0) return genutzt.add(ausnahme);
          // Ein Treffer je Satz und Kernaussage, auch wenn mehrere Wendungen passen.
          const schon = treffer.find((t) => t.datei === datei && t.id === id && t.satz === roh);
          if (schon) schon.wie += ` | ${wie}`;
          else treffer.push({ datei, seite: seitenPfad, sprache, id, thema, wie, satz: roh });
        };
        for (const k of kompiliert) for (const [quelle, re] of k.muster[sprache] ?? []) for (const m of satz.matchAll(re)) fund(k.id, k.thema, quelle, m.index, m.index + m[0].length);
        for (const z of liste.zahlen) {
          const wort = z.wort[sprache];
          if (!wort) continue;
          const zahlen = [...satz.matchAll(zahlVor(wort))].map((m) => ({ start: m.index, ende: m.index + m[0].length, wert: Number(m[1]), text: m[0] }));
          let pruefen = zahlen;
          if (z.anker) {
            const anker = z.anker[sprache] ?? z.anker['*'];
            if (!anker) continue;
            // Je Vorkommen des Ankers: die erste Zahl ab dem Anker bis zum nächsten Anker einer anderen Regel, sonst die letzte davor.
            const fremd = ankerAlle.filter(([id]) => id !== z.id).flatMap(([, a]) => [...satz.matchAll(grenze(a, 'giu'))].map((m) => m.index));
            const gewaehlt = new Set();
            for (const m of satz.matchAll(grenze(anker, 'giu'))) {
              const grenzeNach = Math.min(...fremd.filter((stelle) => stelle > m.index), Infinity);
              const nach = zahlen.find((zahl) => zahl.start >= m.index && zahl.start < grenzeNach);
              const vor = zahlen.filter((zahl) => zahl.ende <= m.index).at(-1);
              if (nach ?? vor) gewaehlt.add(nach ?? vor);
            }
            pruefen = [...gewaehlt];
          }
          for (const zahl of pruefen) if (!z.soll.includes(zahl.wert)) fund(z.id, z.thema, `${zahl.text} statt ${z.soll.join(' oder ')}`, zahl.start, zahl.ende);
        }
      }
    }
  }
  const ohneTreffer = liste.ausnahmen.filter((_, i) => !genutzt.has(i));
  return { treffer, ohneTreffer, fehler, saetze: anzahl, dateien: dateien.length };
}

const umgebung = (text, stelle, laenge = 40) => text.slice(Math.max(0, stelle - laenge), stelle + laenge).replace(/\s+/g, ' ');
const R = (quelle, schalter = 'gu') => new RegExp(`(?<![\\p{L}\\p{N}])(?:${quelle})(?![\\p{L}\\p{N}])`, schalter);

export const MUSTER = {
  riderWaite: /r\W{0,2}i\W{0,2}d\W{0,2}e\W{0,2}r[\s\-–—_./]*w\W{0,2}a\W{0,2}i\W{0,2}t\W{0,2}e|waite/giu,
  // Spanisch dazu seit AP-SPR2: gratuit…, precio…; AP-23: pt, fr, ro, bs/hr, hi („price“ nur als englisches Wort, nicht in ro „pricepere“)
  preis: R('gratis|kostenlos\\p{L}*|umsonst|free|ücretsiz\\p{L}*|bedava\\p{L}*|preis\\p{L}*|fiyat\\p{L}*|euro|(?<=")offers(?=")|price(?:s|d|less)?(?!\\p{L})|gratuit\\p{L}*|precio\\p{L}*|preço\\p{L}*|grátis|prix(?!\\p{L})|preț\\p{L}*|besplatn\\p{L}*|cijen\\p{L}*|मुफ़्त|मुफ्त', 'giu'),
  // KI, AI und IA nur in Großbuchstaben als ganzes Wort; die anderen ohne Rücksicht auf die Schreibung.
  kiGross: R('KI|AI|IA'),
  ki: R('künstliche\\p{L}*\\s+intelligenz\\p{L}*|yapay\\s+zek[aâ]\\p{L}*|artificial\\s+intelligence|inteligencia\\s+artificial', 'giu'),
  // Deutsche Reste auf englischen und spanischen Seiten (9): Umlaute und ß, dazu häufige deutsche Wörter, die es im
  // Englischen und Spanischen so nicht gibt.
  deutsch: /[äöüÄÖÜß]|(?<![\p{L}\p{N}])(?:und|oder|nicht|nur|auch|sich|ist|sind|wird|werden|eine[mnrs]?|einen|der|dem|mit|für|auf|bei|zum|zur|vom|wie|wenn|dein|deine[mnrs]?|Seite|Karte|Karten|Tasse|Zeichen|Kaffeesatz|Deutung|Legung|Satz|Bedeutung)(?![\p{L}\p{N}])/gu,
  speicher: /localStorage|sessionStorage|indexedDB|document\.cookie|navigator\.storage|caches\.open/g,
  // Sprach-Hinweisleiste (W5): lesen und schreiben genau dieses Schlüssels, wörtlich wie in src/layouts/Basis.astro.
  speicherErlaubt: /localStorage\.(?:getItem\('tarotcup-sprachhinweis'\)|setItem\('tarotcup-sprachhinweis', l\))/g,
  emoji: /\p{Extended_Pictographic}/gu,
};

export function pruefeBau(ordner, { still = false } = {}) {
  const befunde = [];
  const warnungen = [];
  const entwurf = process.env.UEBERSETZUNG_ENTWURF === '1';
  // Seiten mit englischem oder spanischem Text: alles unter en/ und es/, dazu Kurzlink und 404 (Teile je Sprache).
  const mitUebersetzung = (name) => /^(en|es|bs|hr|sr|ro|pt|fr|id|hi)\//.test(name) || ['app/index.html', '404.html'].includes(name);
  const melde = (datei, regel, fund) => {
    // Dateien außerhalb des Baus (tools/zwillinge.json) relativ zum Repo nennen.
    const name = (relative(ordner, datei).startsWith('..') ? relative(WURZEL, datei) : relative(ordner, datei)).split(sep).join('/');
    const zeile = `${name}: [${regel}] ${fund}`;
    if (entwurf && /^[239] /.test(regel) && mitUebersetzung(name)) warnungen.push(zeile);
    else befunde.push(zeile);
  };
  const dateien = alleDateien(ordner);
  const htmlDateien = dateien.filter((datei) => datei.endsWith('.html'));

  // 11: das eine Skript der Einwilligung finden.
  const einwilligungSkripte = dateien.filter((datei) => /\.m?js$/.test(datei)).filter((datei) => {
    const inhalt = readFileSync(datei, 'utf8');
    return inhalt.includes(GTM_ADRESSE) && inhalt.includes(GTM_ID) && inhalt.includes('cc_cookie') && inhalt.includes(GTM_EREIGNIS);
  });
  if (einwilligungSkripte.length !== 1) melde(ordner, '11 Einwilligung', `genau ein Skript der Einwilligung erwartet, gefunden: ${einwilligungSkripte.length}`);
  const einwilligungSkript = einwilligungSkripte[0];
  const einwilligungPfad = einwilligungSkript ? `/${relative(ordner, einwilligungSkript).split(sep).join('/')}` : null;
  for (const datei of dateien.filter((kandidat) => TEXT.test(kandidat) && kandidat !== einwilligungSkript)) {
    const inhalt = readFileSync(datei, 'utf8');
    for (const fund of inhalt.matchAll(/googletagmanager|google-analytics|gtag\/js|GTM-[A-Z0-9]{6,}|(?<![\w-])G-[A-Z0-9]{8,12}(?![\w-])/g)) melde(datei, '11 Google außerhalb der Einwilligung', `„${fund[0]}“ in „${umgebung(inhalt, fund.index)}“`);
  }
  for (const datei of htmlDateien) {
    const html = readFileSync(datei, 'utf8');
    // Nur echte Seiten (mit Fuß); Weiterleitungen ohne Fuß haben keinen Hinweis.
    if (!html.includes('<footer')) continue;
    // Ausnahme /app/ (AP-26): die Android-Weiche lädt keine Statistik und keinen Hinweis, das Skript darf dort nicht stehen.
    const ohneStatistik = relative(ordner, datei).split(sep).join('/') === 'app/index.html';
    if (ohneStatistik) {
      if (einwilligungPfad && html.includes(`src="${einwilligungPfad}"`)) melde(datei, '11 Einwilligung', '/app/ darf die Einwilligung nicht laden');
    } else if (einwilligungPfad && !html.includes(`src="${einwilligungPfad}"`)) melde(datei, '11 Einwilligung', `Skript ${einwilligungPfad} nicht eingebunden`);
    const sprache = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
    const text = (EINWILLIGUNG[sprache] ?? EINWILLIGUNG.de).fusslink;
    const link = html.match(/<a\b[^>]*\sdata-cc="show-preferencesModal"[^>]*>([^<]*)<\/a>/);
    if (!link) melde(datei, '11 Einwilligung', 'Link „Cookie-Einstellungen“ fehlt in der Fußzeile');
    else if (link[1] !== text) melde(datei, '11 Einwilligung', `Link „${link[1]}“ statt „${text}“`);
  }

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
    if (/\.(m?js|html)$/.test(datei) && datei !== einwilligungSkript) {
      const skripte = datei.endsWith('.html') ? [...inhalt.matchAll(/<script\b(?![^>]*application\/(?:ld\+)?json)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n') : inhalt;
      for (const fund of skripte.replace(MUSTER.speicherErlaubt, '').matchAll(MUSTER.speicher)) melde(datei, 'Speicher/Cookie im Skript', fund[0]);
    }
    if (!/\.(html|txt|xml)$/.test(datei)) continue;
    const ohne = datei.endsWith('.html') ? ohneRechtstext(inhalt) : inhalt;
    // E-Mail-Adresse als HTML-Entitäten zählt nicht als Text.
    const ohneAngebot = ohneGratisLaden(ANGEBOT_TEXT ? ohne.replaceAll(ANGEBOT_TEXT, '') : ohne);
    for (const fund of ohneAngebot.matchAll(MUSTER.preis)) melde(datei, '2 Preis/Gratis', `„${fund[0]}“ in „${umgebung(ohneAngebot, fund.index)}“`);
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
  const hreflangImBau = new Map();
  let jsonLdAnzahl = 0;
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
    const kanonischAnzahl = (html.match(/<link rel="canonical"/g) ?? []).length;
    const ogLocale = kopf.match(/<meta property="og:locale" content="([^"]*)"/)?.[1];
    const robots = kopf.match(/<meta name="robots" content="([^"]*)"/)?.[1];
    const alternativListe = [...kopf.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]*)"/g)].map((m) => [m[1], m[2]]);
    const alternativen = Object.fromEntries(alternativListe);
    if (alternativListe.length !== Object.keys(alternativen).length) melde(datei, '6 hreflang doppelt', eintrag.pfad);
    hreflangImBau.set(seite.adresse + eintrag.pfad, { datei, alternativen });
    const dekodiert = (text) => text?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (!titel) melde(datei, '6 title fehlt', eintrag.pfad);
    else if (dekodiert(titel) !== eintrag.titel) melde(datei, '6 title weicht ab', `${dekodiert(titel)} ≠ ${eintrag.titel}`);
    if (!beschreibung) melde(datei, '6 description fehlt', eintrag.pfad);
    else if (dekodiert(beschreibung) !== eintrag.beschreibung) melde(datei, '6 description weicht ab', eintrag.pfad);
    if (kanonisch !== seite.adresse + eintrag.pfad) melde(datei, '6 canonical', `${kanonisch} ≠ ${seite.adresse + eintrag.pfad}`);
    if (kanonischAnzahl !== 1) melde(datei, '6 canonical nicht genau einmal', `${kanonischAnzahl}×`);
    if (lang !== eintrag.sprache) melde(datei, '6 lang', `${lang} ≠ ${eintrag.sprache}`);
    if (ogLocale !== OG_LOCALE[eintrag.sprache]) melde(datei, '6 og:locale', `${ogLocale} ≠ ${OG_LOCALE[eintrag.sprache]}`);
    if (eintrag.fassungen) {
      // Genau die Sprachfassungen aus src/daten/seiten.mjs, nur Sprachcodes, dazu x-default.
      const soll = Object.fromEntries(eintrag.fassungen.map((fassung) => [fassung.sprache, seite.adresse + fassung.pfad]));
      const standard = eintrag.fassungen.find((fassung) => fassung.sprache === STANDARD_SPRACHE) ?? eintrag.fassungen.find((fassung) => fassung.sprache === 'de');
      soll['x-default'] = seite.adresse + standard.pfad;
      for (const [sprache, ziel] of Object.entries(soll)) {
        if (alternativen[sprache] !== ziel) melde(datei, '6 hreflang fehlt oder falsch', `${sprache} → ${alternativen[sprache] ?? 'fehlt'} (soll ${ziel})`);
      }
      for (const sprache of Object.keys(alternativen)) {
        if (!(sprache in soll)) melde(datei, '6 hreflang zu viel', sprache);
        if (sprache !== 'x-default' && !/^[a-z]{2}$/.test(sprache)) melde(datei, '6 hreflang nicht nur Sprachcode', sprache);
      }
    } else if (eintrag.sprache !== 'de') {
      melde(datei, '6 Seite ohne Sprachfassungen', `nur deutsche Seiten dürfen ohne andere Fassung sein (${eintrag.pfad})`);
    } else if (Object.keys(alternativen).length) {
      melde(datei, '6 hreflang ohne Sprachfassungen', eintrag.pfad);
    }
    // Schalter E8: ohne Freigabe trägt jede Seite noindex; mit Freigabe nur die Seiten ohne Index.
    if (eintrag.imIndex && robots) melde(datei, 'E8 robots', `Seite im Index trägt ${robots}`);
    if (!eintrag.imIndex && !/noindex/.test(robots ?? '')) melde(datei, 'E8 robots', 'noindex fehlt');

    // Strukturierte Daten: gültiges JSON, Pflichttypen, Auszug aus schema.org (10).
    const typen = [];
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        const daten = JSON.parse(m[1]);
        typen.push(daten['@type']);
        jsonLdAnzahl++;
        for (const fund of pruefeSchema(daten, eintrag.sprache)) melde(datei, '10 JSON-LD schema.org', fund);
        let text = JSON.stringify(daten);
        if (ANGEBOT_TEXT && daten['@type'] === 'MobileApplication') text = text.replace(ANGEBOT_TEXT, '');
        if (/"(offers|price|priceCurrency|aggregateRating|review|isAccessibleForFree|sameAs)"/.test(text)) melde(datei, 'JSON-LD verbotenes Feld', text.match(/"(offers|price|priceCurrency|aggregateRating|review|isAccessibleForFree|sameAs)"/)[1]);
      } catch (fehler) {
        melde(datei, 'JSON-LD ungültig', fehler.message);
      }
    }
    const pflicht = ['WebSite', 'Organization'];
    if (eintrag.krumen) pflicht.push('BreadcrumbList');
    const jeSeite = { start: ['MobileApplication', 'FAQPage'], tarot: ['Article', 'HowTo'], kaffeesatz: ['Article', 'HowTo'], sogehts: ['Article'], fragen: ['FAQPage'], ueber: ['AboutPage'], wissen: ['CollectionPage'] };
    pflicht.push(...(jeSeite[eintrag.schluessel] ?? []));
    for (const typ of pflicht) if (!typen.includes(typ)) melde(datei, 'JSON-LD Pflichttyp fehlt', typ);
  }
  for (const datei of htmlDateien) if (!bekannt.has(datei)) melde(datei, '6 Seite nicht in src/daten/seiten.mjs', relative(ordner, datei));

  // 6: hreflang im Bau gegenseitig: Nennt A die Seite B, nennt B dieselben Fassungen (also auch A).
  let hreflangPaare = 0;
  for (const [adresse, { datei, alternativen }] of hreflangImBau) {
    for (const [sprache, ziel] of Object.entries(alternativen)) {
      if (sprache === 'x-default' || ziel === adresse) continue;
      hreflangPaare++;
      const andere = hreflangImBau.get(ziel);
      if (!andere) {
        melde(datei, '6 hreflang Ziel nicht im Bau', ziel);
        continue;
      }
      const gleich = JSON.stringify(Object.entries(andere.alternativen).sort()) === JSON.stringify(Object.entries(alternativen).sort());
      if (!gleich) melde(datei, '6 hreflang nicht gegenseitig', `${adresse} ↔ ${ziel}`);
    }
  }

  // 8: interne Links und Sprache der Linkziele.
  const seiteZuDatei = new Map(SEITEN.map((eintrag) => [dateiZu(eintrag.pfad), eintrag]));
  const FUER_ALLE = new Set(['app', '404']);
  const ankerVon = new Map();
  const anker = (datei) => {
    if (!ankerVon.has(datei)) ankerVon.set(datei, new Set([...readFileSync(datei, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
    return ankerVon.get(datei);
  };
  let interneLinks = 0;
  for (const datei of htmlDateien) {
    const eigene = seiteZuDatei.get(datei);
    const html = readFileSync(datei, 'utf8');
    // Stellen der Links außerhalb des Wortlauts der Rechtstexte (nur für sie gilt die Sprachregel).
    const sprachpruefung = new Set();
    {
      const rechtstext = [];
      for (const start of [...html.matchAll(/<div\b[^>]*\sdata-rechtstext\b[^>]*>/g)].map((m) => m.index)) {
        const ende = start + (html.length - ohneRechtstext(html.slice(start)).length);
        rechtstext.push([start, ende]);
      }
      for (const m of html.matchAll(/<a\b/g)) if (!rechtstext.some(([von, bis]) => m.index >= von && m.index < bis)) sprachpruefung.add(m.index);
    }
    for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>/g)) {
      let ziel = m[1].replace(/&amp;/g, '&');
      if (ziel.startsWith(`${seite.adresse}/`)) ziel = ziel.slice(seite.adresse.length);
      if (!ziel.startsWith('/') && !ziel.startsWith('#')) continue;
      interneLinks++;
      const [pfad, marke] = ziel.split('#');
      const zielDatei = pfad ? dateiZu(decodeURI(pfad)) : datei;
      if (!existsSync(zielDatei)) {
        melde(datei, '8 Link ins Leere', ziel);
        continue;
      }
      if (marke && zielDatei.endsWith('.html') && !anker(zielDatei).has(marke)) melde(datei, '8 Sprungmarke fehlt', ziel);
      const zielSeite = seiteZuDatei.get(zielDatei);
      if (!eigene || !zielSeite) continue;
      const hreflang = m[0].match(/\shreflang="([^"]+)"/)?.[1];
      if (!sprachpruefung.has(m.index)) continue;
      if (hreflang && zielSeite.sprache !== hreflang && !FUER_ALLE.has(zielSeite.schluessel)) melde(datei, '8 hreflang des Links passt nicht', `${ziel} ist ${zielSeite.sprache}, nicht ${hreflang}`);
      const gibtEigene = zielSeite.fassungen?.some((fassung) => fassung.sprache === eigene.sprache);
      if (!hreflang && !FUER_ALLE.has(eigene.schluessel) && zielSeite.sprache !== eigene.sprache && gibtEigene) {
        melde(datei, '8 Link in andere Sprache ohne hreflang', `${ziel} (${zielSeite.sprache}) auf ${eigene.sprache}`);
      }
    }
  }

  // 9: deutsche Reste auf englischen und spanischen Seiten, sichtbarer Text und Attribute alt, title, aria-label,
  // content von description und og:*, außerhalb von Elementen mit lang.
  let restSeiten = 0;
  for (const datei of htmlDateien) {
    const html = readFileSync(datei, 'utf8');
    const lang = html.match(/<html[^>]*\slang="([a-z-]+)"/)?.[1];
    if (!['en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'].includes(lang)) continue;
    restSeiten++;
    const ohneFremd = html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ')
      .replace(new RegExp(`<(\\w+)\\b[^>]*\\slang="(?!${lang}")[^"]*"[^>]*>[\\s\\S]*?<\\/\\1>`, 'g'), ' ');
    const attribute = [...ohneFremd.matchAll(/\s(?:alt|title|aria-label|content)="([^"]*)"/g)].map((m) => m[1]).join(' \n ');
    const sichtbar = `${ohneFremd.replace(/<[^>]+>/g, ' ')} \n ${attribute}`
      .replace(/&#(\d+);/g, (_, zahl) => String.fromCodePoint(Number(zahl)))
      .replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    // Fremde Wörter aus src/daten/sprachen.mjs (etwa „Türkçe“ in einem Alt-Text) sind kein Rest.
    const bereinigt = begriffe.filter((eintrag) => !eintrag.nur || eintrag.nur.includes(lang)).reduce((text, { text: wort }) => text.split(wort).join(' '), sichtbar);
    // AP-23: echte Wörter der Sprache, die wie deutsche aussehen (bs/hr/sr „Karte“ = Karten, pt „der“ = geben)
    const eigen = { bs: ['Karte'], hr: ['Karte'], sr: ['Karte'], pt: ['der'] }[lang] ?? [];
    for (const fund of [...bereinigt.matchAll(MUSTER.deutsch)].filter((f) => !eigen.includes(f[0]))) melde(datei, '9 deutscher Rest', `„${fund[0]}“ in „${umgebung(bereinigt, fund.index)}“`);
  }

  // Fremde Wörter auf deutschen, englischen und spanischen Seiten tragen lang (gesetzt von tools/sprache_setzen.mjs).
  for (const datei of htmlDateien) {
    const html = readFileSync(datei, 'utf8');
    const seitenSprache = html.match(/<html[^>]*\slang="([a-z]{2})"/)?.[1];
    if (seitenSprache === 'tr' || !seitenSprache) continue;
    const tuerkisch = begriffe.filter((eintrag) => eintrag.nur?.includes(seitenSprache) && eintrag.lang !== seitenSprache);
    // Sichtbarer Text außerhalb von Elementen mit lang, ohne Skripte, Stile, title.
    const rest = html
      .replace(/<(script|style|title)\b[\s\S]*?<\/\1>/g, ' ')
      .replace(/<span lang="[^"]+">[^<]*<\/span>/g, ' ')
      // Abschnitte einer anderen Sprache tragen lang selbst (AP-28: /app/ hat je Sprache einen Abschnitt mit Sprechblase).
      .replace(/<section\b[^>]*\slang="[^"]+"[^>]*>[\s\S]*?<\/section>/g, ' ')
      // Links der Sprachwahl tragen lang selbst (AP-W6).
      .replace(/<a\b[^>]*\slang="[^"]+"[^>]*>[^<]*<\/a>/g, ' ')
      .replace(/<[^>]+>/g, ' ');
    // Nur ganze Wörter, wie in tools/sprache_setzen.mjs (AP-25C: „Fal“ steckt in „Fallen“).
    for (const { text } of tuerkisch) {
      const ganz = new RegExp(`(?<![\\p{L}\\p{N}])${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'u');
      if (ganz.test(rest)) melde(datei, 'lang fehlt', `„${text}“`);
    }
  }

  // 12: Text-Zwillinge (AP-36): keine Wendung, die der Datenschutzerklärung widerspricht (tools/zwillinge.json).
  const zwillingeText = readFileSync(ZWILLINGE_DATEI, 'utf8');
  if (existsSync(ZWILLINGE_QUELLE) && readFileSync(ZWILLINGE_QUELLE, 'utf8') !== zwillingeText) melde(ZWILLINGE_DATEI, '12 zwillinge.json', 'weicht von deutung-unterlagen/recht/zwillinge.json ab, Kopie nachziehen');
  const rechtsPfade = new Set(SEITEN.filter((eintrag) => eintrag.schluessel.startsWith('recht:')).map((eintrag) => eintrag.pfad));
  const zwillinge = zwillingeBefunde(ordner, JSON.parse(zwillingeText), rechtsPfade);
  for (const t of zwillinge.treffer) melde(t.datei, `12 Zwilling ${t.id}`, `„${t.satz}“ (Thema: ${t.thema}; ${t.wie})`);
  for (const f of zwillinge.fehler) melde(ZWILLINGE_DATEI, '12 Wendung mit İ', f);
  for (const a of zwillinge.ohneTreffer) melde(ZWILLINGE_DATEI, '12 Ausnahme ohne Treffer', `${a.seite} (${a.id}): „${a.satz}“`);

  if (befunde.length) {
    throw new Error(`Prüfung nach dem Bau: ${befunde.length} Befund(e)\n  ${befunde.join('\n  ')}`);
  }
  const ersatzfotos = htmlDateien.filter((datei) => /<html[^>]*\slang="(en|es|bs|hr|sr|ro|pt|fr|id|hi)"/.test(readFileSync(datei, 'utf8')) && /\/bilder\/(?:app|sogehts)\/[^"]*-de-\d+\.webp/.test(readFileSync(datei, 'utf8'))).map((datei) => relative(ordner, datei).split(sep).join('/'));
  if (warnungen.length) console.warn(`Prüfung nach dem Bau, Entwurf der Übersetzung (UEBERSETZUNG_ENTWURF=1): ${warnungen.length} Warnung(en)\n  ${warnungen.join('\n  ')}`);
  const ergebnis = { einwilligung: einwilligungPfad, warnungen: warnungen.length, dateien: dateien.length, seiten: htmlDateien.length, adressenVorher: vorher.length, hreflangPaare, interneLinks, jsonLd: jsonLdAnzahl, restSeiten, ersatzfotos, zwillingeSaetze: zwillinge.saetze };
  if (!still) {
    console.log(`Prüfung nach dem Bau: ${ergebnis.dateien} Dateien, ${ergebnis.seiten} Seiten, ${ergebnis.adressenVorher} Adressen von vorher, ${hreflangPaare} hreflang-Verbindungen gegenseitig, ${interneLinks} interne Links, ${jsonLdAnzahl} JSON-LD-Blöcke, ${restSeiten} Seiten en/es auf deutsche Reste geprüft, ${zwillinge.saetze} Sätze in ${zwillinge.dateien} Dateien gegen die Datenschutzerklärung (Text-Zwillinge), kein Befund`);
    if (ersatzfotos.length) console.warn(`Warnung: ${ersatzfotos.length} Seite(n) en/es mit deutschen Ersatzfotos (src/daten/fotos.mjs): ${ersatzfotos.join(', ')}`);
  }
  return ergebnis;
}

// Aufruf von der Kommandozeile: node tools/pruefe_bau.mjs dist
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === '--zwillinge') {
  // Nur Regel 12 an einem beliebigen Bau, etwa einem alten Stand (Gegenprobe AP-36):
  // node tools/pruefe_bau.mjs --zwillinge <ordner>. Gibt je Treffer Seite, Sprache, Kernaussage und Satz aus.
  const ordner = resolve(process.argv[3] ?? 'dist');
  const rechtsPfade = new Set(SEITEN.filter((eintrag) => eintrag.schluessel.startsWith('recht:')).map((eintrag) => eintrag.pfad));
  const { treffer, saetze: anzahl, dateien } = zwillingeBefunde(ordner, JSON.parse(readFileSync(ZWILLINGE_DATEI, 'utf8')), rechtsPfade);
  for (const t of treffer) console.log(`${t.seite}\t${t.sprache}\t${t.id}\t${t.satz}`);
  console.log(`Text-Zwillinge: ${treffer.length} Treffer in ${anzahl} Sätzen aus ${dateien} Dateien`);
  process.exit(treffer.length ? 1 : 0);
} else if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ordner = process.argv[2] ?? 'dist';
  try {
    pruefeBau(join(process.cwd(), ordner));
  } catch (fehler) {
    console.error(fehler.message);
    process.exit(1);
  }
}
void suche;
