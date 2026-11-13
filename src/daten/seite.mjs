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

// Store-Eintrag. Seit AP-21 (12.11.2026, Tarot Cup 0.5.0 in der Produktion) öffentlich: offizielles Abzeichen je Sprache im
// Titelbild der Startseite, in der Fußzeile jeder Seite und auf /app/. Ist "oeffentlich" aus, bleibt die Fläche leer und
// der Knopf im Titelbild sagt „Bald bei Google Play“ ohne Link. In den strukturierten Daten der App nur installUrl und
// ein Angebot mit Preis 0 (AP-21), sonst kein Preis.
export const store = {
  oeffentlich: true,
  adresse: 'https://play.google.com/store/apps/details?id=at.tonc.kaffeesatztarot',
  // Offizielle Abzeichen von Google, unverändert, als lokale Dateien (public/bilder/abzeichen/). Quelle: Google Partner
  // Marketing Hub, Google Play, „Lockups, icons, & badges“, Ordner „Get it on Google Play Badges / Digital / png“
  // (Dateien GetItOnGooglePlay_Badge_Web_color_German, _Turkish, _English, _Spanish.png, Stand 14.11.2025), geladen am
  // 12.11.2026 (AP-21). Die Dateien haben keinen eingebauten Rand; Vorgaben von Google: Höhe mindestens 28 px, freier Raum
  // rundum mindestens ein Viertel der Höhe, ruhiger Hintergrund, nichts verändern (Stile in src/styles/basis.css).
  // Ist "oeffentlich" an und eine Datei fehlt, bricht der Bau ab (tools/pruefe_bau.mjs).
  abzeichen: {
    de: { pfad: '/bilder/abzeichen/google-play-de.png', breite: 478, hoehe: 142 },
    tr: { pfad: '/bilder/abzeichen/google-play-tr.png', breite: 478, hoehe: 142 },
    en: { pfad: '/bilder/abzeichen/google-play-en.png', breite: 478, hoehe: 142 },
    es: { pfad: '/bilder/abzeichen/google-play-es.png', breite: 478, hoehe: 142 },
    // AP-23 (13.11.2026): offizielle Abzeichen der acht neuen Sprachen aus demselben Ordner (_Bosnian, _Croatian, _Serbian,
    // _Romanian, _Portuguese-Brazil, _French, _Indonesian, _Hindi, Stand 14.11.2025). Für Serbisch bietet Google nur ein
    // kyrillisches Abzeichen an; es bleibt unverändert, obwohl die Seiten lateinisch geschrieben sind.
    bs: { pfad: '/bilder/abzeichen/google-play-bs.png', breite: 478, hoehe: 142 },
    hr: { pfad: '/bilder/abzeichen/google-play-hr.png', breite: 478, hoehe: 142 },
    sr: { pfad: '/bilder/abzeichen/google-play-sr.png', breite: 478, hoehe: 142 },
    ro: { pfad: '/bilder/abzeichen/google-play-ro.png', breite: 478, hoehe: 142 },
    pt: { pfad: '/bilder/abzeichen/google-play-pt.png', breite: 478, hoehe: 142 },
    fr: { pfad: '/bilder/abzeichen/google-play-fr.png', breite: 478, hoehe: 142 },
    id: { pfad: '/bilder/abzeichen/google-play-id.png', breite: 478, hoehe: 142 },
    hi: { pfad: '/bilder/abzeichen/google-play-hi.png', breite: 478, hoehe: 142 },
  },
};

// Links zu Google Play mit Kennung der Herkunft (Muster „Google Play URL Builder“). Die Kennung enthält nichts über
// Besucher; die Website lädt dafür nichts und speichert nichts. Feste Orte: kopf, start, kurzlink, fuss.
// Jede Sprache mit hl=<sprache> (AP-21), damit Google Play den Eintrag in der Sprache der Seite zeigt. Ohne Sprache
// (Weiterleitung auf /app/) ohne hl, dann zeigt Google Play die Sprache des Geräts.
export const STORE_ORTE = ['kopf', 'start', 'kurzlink', 'fuss'];
const STORE_HL = {
  de: 'de', tr: 'tr', en: 'en', es: 'es', bs: 'bs', hr: 'hr', sr: 'sr', ro: 'ro', pt: 'pt-BR', fr: 'fr', id: 'id', hi: 'hi',
};
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
