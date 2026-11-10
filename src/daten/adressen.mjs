// Sprachen und Adressen der Website an einer Stelle (AP-SPR2). Ohne Abhängigkeiten, damit auch die Werkzeuge in tools/
// (etwa tools/texte_einspielen.mjs) sie lesen können, ohne die Texte zu laden.
//
// Je Seite die Adresse in jeder Sprache, in der es sie gibt. Deutsch ohne Vorsilbe, die anderen Sprachen unter
// /<code>/. Die Adressen sind in der jeweiligen Sprache gewählt (Suchbegriffe aus AP-SPR2, Teil A). Fehlt eine
// Sprache bei einer Seite, gibt es die Seite in dieser Sprache nicht; hreflang nennt dann nur die vorhandenen.

// Reihenfolge = Reihenfolge im Sprachumschalter.
export const SPRACHEN = ['de', 'tr', 'en', 'es'];

// Ziel von hreflang="x-default": Englisch ist die Sprache für alle übrigen Länder.
export const STANDARD_SPRACHE = 'en';

// Sprachnamen in eigener Schreibweise (Sprachumschalter, Links zwischen den Fassungen) und als Kürzel.
export const SPRACHNAMEN = { de: 'Deutsch', tr: 'Türkçe', en: 'English', es: 'Español' };
export const SPRACHKUERZEL = { de: 'DE', tr: 'TR', en: 'EN', es: 'ES' };

// Open Graph: og:locale je Sprache (Deutsch zusätzlich de_AT wie bisher).
export const OG_LOCALE = { de: 'de_DE', tr: 'tr_TR', en: 'en_US', es: 'es_ES' };
export const OG_LOCALE_ZUSATZ = { de: ['de_AT'] };

export const ADRESSEN = {
  start: { de: '/', tr: '/tr/', en: '/en/', es: '/es/' },
  tarot: { de: '/tarot/', tr: '/tr/tarot/', en: '/en/tarot/', es: '/es/tarot/' },
  kaffeesatz: { de: '/kaffeesatz-lesen/', tr: '/tr/kahve-fali/', en: '/en/coffee-cup-reading/', es: '/es/lectura-de-posos-de-cafe/' },
  sogehts: { de: '/so-gehts/', tr: '/tr/nasil-kullanilir/', en: '/en/how-it-works/', es: '/es/como-funciona/' },
  fragen: { de: '/fragen/', tr: '/tr/sorular/', en: '/en/faq/', es: '/es/preguntas/' },
  ueber: { de: '/ueber-tarot-cup/', tr: '/tr/hakkinda/', en: '/en/about/', es: '/es/acerca-de/' },
  bildnachweis: {
    de: '/bildnachweis-und-lizenzen/', tr: '/tr/gorsel-kaynaklari-ve-lisanslar/',
    en: '/en/image-credits-and-licenses/', es: '/es/creditos-de-imagenes-y-licencias/',
  },
  // Rechtstexte: gültige Fassung. Die Fassungen im Archiv (/<text>/<nummer>/) gibt es nur auf Deutsch und Türkisch
  // (src/inhalte/recht/verzeichnis.json).
  datenschutz: { de: '/datenschutz/', tr: '/tr/gizlilik/', en: '/en/privacy/', es: '/es/privacidad/' },
  nutzungsbedingungen: { de: '/nutzungsbedingungen/', tr: '/tr/kullanim-kosullari/', en: '/en/terms/', es: '/es/condiciones-de-uso/' },
  // Nur Deutsch; die anderen Sprachen verlinken darauf mit übersetzter Beschriftung.
  offenlegung: { de: '/offenlegung/' },
  // Kurzlink und 404: je eine Seite für alle Sprachen (Teile je Sprache mit lang).
  app: { de: '/app/' },
  404: { de: '/404.html' },
};

// Schlüssel einer Seite zu einer Adresse (ohne Sprungmarke), oder null.
export function schluesselVon(pfad) {
  for (const [schluessel, adressen] of Object.entries(ADRESSEN)) {
    if (Object.values(adressen).includes(pfad)) return schluessel;
  }
  return null;
}

// Adresse derselben Seite in einer anderen Sprache. Sprungmarken (#…) bleiben. Gibt es die Seite in der Zielsprache
// nicht, bleibt die Adresse, wie sie ist (zum Beispiel /offenlegung/).
export function adresseIn(pfad, sprache) {
  const [ohne, marke] = pfad.split('#');
  const schluessel = schluesselVon(ohne);
  const ziel = schluessel ? ADRESSEN[schluessel][sprache] : null;
  if (!ziel) return pfad;
  return marke === undefined ? ziel : `${ziel}#${marke}`;
}

export const startVon = (sprache) => ADRESSEN.start[sprache];
