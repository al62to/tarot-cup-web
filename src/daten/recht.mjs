// Rechtstexte: Verzeichnis, Bausteine und alles, was die Rechtsseiten außer dem Text zeigen (Sprachlink, Hinweis auf
// ältere Fassungen, Liste der Fassungen). Die Regeln sind dieselben wie im früheren Generator web_bauen.py (Stand
// AP-16), damit jede Seite unter derselben Adresse denselben sichtbaren Text zeigt (Prüfung tools/recht_vergleich.mjs).
// Bausteine und Verzeichnis schreibt deutung-unterlagen/arbeit/recht_web.py; hier wird nichts am Wortlaut geändert.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import verzeichnis from '../inhalte/recht/verzeichnis.json' with { type: 'json' };

// Bausteine über das Dateisystem (ab der Wurzel des Projekts), damit auch die Werkzeuge in tools/ diese Datei lesen.
const ORDNER = join(process.cwd(), 'src', 'inhalte', 'recht');

export const SPRACHEN = verzeichnis.sprachen;
export const TEXTE = verzeichnis.texte;

const nummerSchluessel = (nummer) => nummer.split('.').map(Number);
const vergleiche = (a, b) => {
  const x = nummerSchluessel(a);
  const y = nummerSchluessel(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
  }
  return 0;
};
const formatiere = (vorlage, werte) => vorlage.replace(/\{(\w+)\}/g, (_, name) => werte[name]);

export const textVon = (pfad) => {
  const text = TEXTE.find((eintrag) => eintrag.pfad === pfad);
  if (!text) throw new Error(`Rechtstext fehlt: ${pfad}`);
  return text;
};
export const gegenstueckVon = (text) => (text.gegenstueck ? textVon(text.gegenstueck) : null);
export const neuesteVon = (text) => text.fassungen.at(-1);

export function bausteinVon(fassung) {
  try {
    return readFileSync(join(ORDNER, fassung.datei), 'utf8').trim();
  } catch {
    throw new Error(`Baustein fehlt: ${fassung.datei}`);
  }
}

// Alle Rechtsseiten: die gültige Fassung unter /<pfad>/ und jede Fassung im Archiv unter /<pfad>/<nummer>/.
export function rechtsseiten() {
  const seiten = [];
  for (const text of TEXTE) {
    for (const fassung of text.fassungen) {
      seiten.push({ text, fassung, archiv: true, adresse: `/${text.pfad}/${fassung.nummer}/` });
      if (fassung === neuesteVon(text)) seiten.push({ text, fassung, archiv: false, adresse: `/${text.pfad}/` });
    }
  }
  return seiten;
}

// Link zur anderen Sprache und Gegenseite für hreflang. Gültige Seite zu gültiger Seite, Archiv zu Archiv. Gibt es die
// Fassung in der anderen Sprache nicht, führt der Link auf deren gültige Fassung, mit Nummer, und es gibt keine
// Gegenseite (der Inhalt ist nicht derselbe).
export function sprachwahl({ text, fassung, archiv }) {
  const gegen = gegenstueckVon(text);
  if (!gegen) return { link: null, gegenseite: null };
  const ziel = SPRACHEN[gegen.sprache];
  const vorhanden = gegen.fassungen.some((eintrag) => eintrag.nummer === fassung.nummer);
  if (!archiv) return { link: { ziel: `/${gegen.pfad}/`, text: ziel.name, sprache: gegen.sprache }, gegenseite: `/${gegen.pfad}/` };
  if (vorhanden) {
    const adresse = `/${gegen.pfad}/${fassung.nummer}/`;
    return { link: { ziel: adresse, text: ziel.name, sprache: gegen.sprache }, gegenseite: adresse };
  }
  const name = `${ziel.name} (${formatiere(ziel.fassung, { nr: neuesteVon(gegen).nummer })})`;
  return { link: { ziel: `/${gegen.pfad}/`, text: name, sprache: gegen.sprache }, gegenseite: null };
}

// Hinweis auf einer Archivseite einer älteren Fassung, als Teile (Text, Link, Text).
export function hinweisAeltere({ text, fassung }) {
  const neueste = neuesteVon(text);
  if (fassung.nummer === neueste.nummer) return null;
  const sp = SPRACHEN[text.sprache];
  const [vor, nach] = formatiere(sp.aeltere, { nr: fassung.nummer, link: '\u0000' }).split('\u0000');
  return { vor, nach, link: { ziel: `/${text.pfad}/`, text: formatiere(sp.fassung, { nr: neueste.nummer }) } };
}

// Liste aller Fassungen, neueste zuerst. Fassungen, die es nur im Gegenstück gibt, stehen mit Hinweis dabei.
export function fassungsliste(text) {
  const sp = SPRACHEN[text.sprache];
  const gegen = gegenstueckVon(text);
  const eigene = new Set(text.fassungen.map((eintrag) => eintrag.nummer));
  const neueste = neuesteVon(text).nummer;
  const eintraege = [
    ...text.fassungen.map((eintrag) => ({ eintrag, besitzer: text })),
    ...(gegen ? gegen.fassungen.filter((eintrag) => !eigene.has(eintrag.nummer)).map((eintrag) => ({ eintrag, besitzer: gegen })) : []),
  ].sort((a, b) => vergleiche(b.eintrag.nummer, a.eintrag.nummer));
  return {
    titel: sp.fassungen_titel,
    punkte: eintraege.map(({ eintrag, besitzer }) => {
      const fremd = besitzer !== text;
      let zusatz = !fremd && eintrag.nummer === neueste ? sp.aktuell : '';
      if (fremd) zusatz += sp.nur_in[besitzer.sprache] ?? '';
      return {
        ziel: `/${besitzer.pfad}/${eintrag.nummer}/`,
        sprache: fremd ? besitzer.sprache : null,
        name: formatiere(sp.fassung, { nr: eintrag.nummer }),
        rest: formatiere(sp.stand, { datum: eintrag.datum }) + zusatz,
      };
    }),
  };
}

export function seitentitel({ text, fassung, archiv }) {
  const sp = SPRACHEN[text.sprache];
  return archiv
    ? formatiere(sp.seitentitel_fassung, { titel: text.titel, nr: fassung.nummer })
    : formatiere(sp.seitentitel, { titel: text.titel });
}

// Beschreibungen der Rechtsseiten (neu mit AP-W1; der Wortlaut der Texte bleibt unberührt).
const BESCHREIBUNG = {
  datenschutz: 'Die Datenschutzerklärung von Tarot Cup sagt für App und Website, was gespeichert wird, wer verantwortlich ist und welche Rechte du hast.',
  nutzungsbedingungen: 'Die Nutzungsbedingungen von Tarot Cup erklären, was die App ist und was nicht, was du beim Nutzen beachten solltest und welche Regeln gelten.',
  'tr/gizlilik': 'Tarot Cup uygulamasının ve tarot-cup.com sitesinin gizlilik politikası, neyin saklandığını, kimin sorumlu olduğunu ve hangi haklara sahip olduğunu anlatır.',
  'tr/kullanim-kosullari': 'Tarot Cup’ın kullanım koşulları, uygulamanın ne olduğunu ve ne olmadığını, kullanırken nelere dikkat etmen gerektiğini ve geçerli kuralları anlatır.',
};
const BESCHREIBUNG_ARCHIV = {
  de: 'Fassung {nr} vom {datum} der {titel} von Tarot Cup, unverändert aufbewahrt im Archiv aller früheren Fassungen und der aktuellen.',
  tr: 'Tarot Cup {titel} metninin {datum} tarihli {nr} sürümü. Önceki ve güncel tüm sürümlerle birlikte arşivde değiştirilmeden saklanır.',
};
export function beschreibung({ text, fassung, archiv }) {
  if (!archiv) return BESCHREIBUNG[text.pfad];
  return formatiere(BESCHREIBUNG_ARCHIV[text.sprache], { nr: fassung.nummer, datum: fassung.datum, titel: text.titel });
}
