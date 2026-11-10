// Angaben zur Website an einer Stelle, mit den Schaltern für Suche und Store. Sprachen und Adressen: src/daten/adressen.mjs.
import { SPRACHEN } from './adressen.mjs';

export const seite = {
  name: 'Tarot Cup',
  adresse: 'https://tarot-cup.com',
  email: 'kontakt@tarot-cup.com',
  sprachen: SPRACHEN,
  // Bild zum Teilen: je Seite und Sprache eine Datei in public/bilder/teilen/ (1200 x 630, tools/teilen_bilder.mjs).
  teilen: { breite: 1200, hoehe: 630 },
};

// Schalter E8 (Auftrag AP-W1): Zur Suche freigeben erst nach Freigabe. false: jede Seite trägt "noindex, nofollow"
// und robots.txt sperrt alles (wie vor AP-W1). true: Seiten im Index, robots.txt erlaubt alles und nennt die Sitemap.
// SUCHE_PROBE=1 baut lokal so, als wäre die Suche freigegeben (nur für die Messung mit Lighthouse, Bereich SEO); der
// Workflow auf GitHub setzt die Variable nie.
export const suche = { freigegeben: true || process.env.SUCHE_PROBE === '1' };

// Store-Eintrag. Solange "oeffentlich" aus ist, bleibt die Fläche für das Abzeichen leer (Vorgabe 26.10.2026: Abzeichen erst
// mit der Produktion); der Knopf im Titelbild sagt „Bald bei Google Play“ ohne Link, /app/ nur, dass die App bald kommt.
// Kein Angebot und kein Preis in den strukturierten Daten.
export const store = {
  oeffentlich: false,
  adresse: 'https://play.google.com/store/apps/details?id=at.tonc.kaffeesatztarot',
  // Offizielle Abzeichen von Google, unverändert, als lokale Dateien (public/bilder/abzeichen/). Die Dateien kommen erst
  // mit der Produktion (Quelle: Google Partner Marketing Hub, „Get it on Google Play Badges“, Deutsch, Türkisch,
  // Englisch und Spanisch; die Maße von en und es beim Ablegen der Dateien prüfen).
  // Ist "oeffentlich" an und eine Datei fehlt, bricht der Bau ab (tools/pruefe_bau.mjs).
  abzeichen: {
    de: { pfad: '/bilder/abzeichen/google-play-de.png', breite: 646, hoehe: 250 },
    tr: { pfad: '/bilder/abzeichen/google-play-tr.png', breite: 646, hoehe: 250 },
    en: { pfad: '/bilder/abzeichen/google-play-en.png', breite: 646, hoehe: 250 },
    es: { pfad: '/bilder/abzeichen/google-play-es.png', breite: 646, hoehe: 250 },
  },
};

// Links zu Google Play mit Kennung der Herkunft (Muster „Google Play URL Builder“). Die Kennung enthält nichts über
// Besucher; die Website lädt dafür nichts und speichert nichts. Feste Orte: kopf, start, kurzlink, fuss.
// Englisch und Spanisch (AP-SPR2) mit hl=en bzw. hl=es, damit Google Play den Eintrag in der Sprache der Seite zeigt;
// Deutsch und Türkisch wie bisher ohne hl.
export const STORE_ORTE = ['kopf', 'start', 'kurzlink', 'fuss'];
const STORE_HL = { en: 'en', es: 'es' };
export function storeLink(ort, sprache) {
  if (!STORE_ORTE.includes(ort)) throw new Error(`Unbekannter Ort für den Link zu Google Play: ${ort}`);
  const hl = STORE_HL[sprache] ? `&hl=${STORE_HL[sprache]}` : '';
  return `${store.adresse}${hl}&referrer=utm_source%3Dwebsite%26utm_medium%3Dlink%26utm_campaign%3D${ort}`;
}

// Die E-Mail-Adresse steht im HTML als Zeichenfolge aus HTML-Entitäten (wie bei FoodAsu), nicht als Klartext.
export function kodiert(text) {
  return [...text].map((zeichen) => `&#${zeichen.codePointAt(0)};`).join('');
}
export const mailtoKodiert = () => kodiert(`mailto:${seite.email}`);
export const emailKodiert = () => kodiert(seite.email);
