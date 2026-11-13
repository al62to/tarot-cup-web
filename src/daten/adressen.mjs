// Sprachen und Adressen der Website an einer Stelle (AP-SPR2). Ohne Abhängigkeiten, damit auch die Werkzeuge in tools/
// (etwa tools/texte_einspielen.mjs) sie lesen können, ohne die Texte zu laden.
//
// Je Seite die Adresse in jeder Sprache, in der es sie gibt. Deutsch ohne Vorsilbe, die anderen Sprachen unter
// /<code>/. Die Adressen sind in der jeweiligen Sprache gewählt (Suchbegriffe aus AP-SPR2, Teil A). Fehlt eine
// Sprache bei einer Seite, gibt es die Seite in dieser Sprache nicht; hreflang nennt dann nur die vorhandenen.

// Reihenfolge = Reihenfolge im Sprachumschalter.
export const SPRACHEN = ['de', 'tr', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'];

// Ziel von hreflang="x-default": Englisch ist die Sprache für alle übrigen Länder.
export const STANDARD_SPRACHE = 'en';

// Sprachnamen in eigener Schreibweise (Sprachumschalter, Links zwischen den Fassungen) und als Kürzel.
export const SPRACHNAMEN = {
  de: 'Deutsch', tr: 'Türkçe', en: 'English', es: 'Español', bs: 'Bosanski', hr: 'Hrvatski', sr: 'Srpski',
  ro: 'Română', pt: 'Português', fr: 'Français', id: 'Bahasa Indonesia', hi: 'हिन्दी',
};
export const SPRACHKUERZEL = {
  de: 'DE', tr: 'TR', en: 'EN', es: 'ES', bs: 'BS', hr: 'HR', sr: 'SR', ro: 'RO', pt: 'PT', fr: 'FR', id: 'ID', hi: 'HI',
};

// Open Graph: og:locale je Sprache (Deutsch zusätzlich de_AT wie bisher).
export const OG_LOCALE = {
  de: 'de_DE', tr: 'tr_TR', en: 'en_US', es: 'es_ES', bs: 'bs_BA', hr: 'hr_HR', sr: 'sr_RS', ro: 'ro_RO',
  pt: 'pt_BR', fr: 'fr_FR', id: 'id_ID', hi: 'hi_IN',
};
export const OG_LOCALE_ZUSATZ = { de: ['de_AT'] };

export const ADRESSEN = {
  start: { de: '/', tr: '/tr/', en: '/en/', es: '/es/',
    bs: '/bs/', hr: '/hr/', sr: '/sr/', ro: '/ro/', pt: '/pt/', fr: '/fr/', id: '/id/', hi: '/hi/',
  },
  tarot: { de: '/tarot/', tr: '/tr/tarot/', en: '/en/tarot/', es: '/es/tarot/',
    bs: '/bs/tarot/', hr: '/hr/tarot/', sr: '/sr/tarot/', ro: '/ro/tarot/', pt: '/pt/tarot/', fr: '/fr/tarot/', id: '/id/tarot/', hi: '/hi/tarot/',
  },
  kaffeesatz: { de: '/kaffeesatz-lesen/', tr: '/tr/kahve-fali/', en: '/en/coffee-cup-reading/', es: '/es/lectura-de-posos-de-cafe/',
    bs: '/bs/gledanje-u-soljicu/', hr: '/hr/gledanje-u-salicu/', sr: '/sr/gledanje-u-solju/', ro: '/ro/ghicit-in-cafea/', pt: '/pt/leitura-da-borra-de-cafe/', fr: '/fr/lire-le-marc-de-cafe/', id: '/id/membaca-ampas-kopi/', hi: '/hi/coffee-reading/',
  },
  sogehts: { de: '/so-gehts/', tr: '/tr/nasil-kullanilir/', en: '/en/how-it-works/', es: '/es/como-funciona/',
    bs: '/bs/kako-funkcionise/', hr: '/hr/kako-funkcionira/', sr: '/sr/kako-funkcionise/', ro: '/ro/cum-functioneaza/', pt: '/pt/como-funciona/', fr: '/fr/comment-ca-marche/', id: '/id/cara-kerja/', hi: '/hi/how-it-works/',
  },
  fragen: { de: '/fragen/', tr: '/tr/sorular/', en: '/en/faq/', es: '/es/preguntas/',
    bs: '/bs/pitanja/', hr: '/hr/pitanja/', sr: '/sr/pitanja/', ro: '/ro/intrebari/', pt: '/pt/perguntas/', fr: '/fr/questions/', id: '/id/pertanyaan/', hi: '/hi/faq/',
  },
  ueber: { de: '/ueber-tarot-cup/', tr: '/tr/hakkinda/', en: '/en/about/', es: '/es/acerca-de/',
    bs: '/bs/o-nama/', hr: '/hr/o-nama/', sr: '/sr/o-nama/', ro: '/ro/despre/', pt: '/pt/sobre/', fr: '/fr/a-propos/', id: '/id/tentang/', hi: '/hi/about/',
  },
  bildnachweis: {
    de: '/bildnachweis-und-lizenzen/', tr: '/tr/gorsel-kaynaklari-ve-lisanslar/',
    en: '/en/image-credits-and-licenses/', es: '/es/creditos-de-imagenes-y-licencias/',
    bs: '/bs/izvori-slika-i-licence/', hr: '/hr/izvori-slika-i-licence/', sr: '/sr/izvori-slika-i-licence/', ro: '/ro/surse-imagini-si-licente/', pt: '/pt/creditos-de-imagens-e-licencas/', fr: '/fr/credits-images-et-licences/', id: '/id/kredit-gambar-dan-lisensi/', hi: '/hi/image-credits-and-licenses/',
  },
  // Rechtstexte: gültige Fassung. Die Fassungen im Archiv (/<text>/<nummer>/) gibt es nur auf Deutsch und Türkisch
  // (src/inhalte/recht/verzeichnis.json).
  datenschutz: { de: '/datenschutz/', tr: '/tr/gizlilik/', en: '/en/privacy/', es: '/es/privacidad/',
    bs: '/bs/privatnost/', hr: '/hr/privatnost/', sr: '/sr/privatnost/', ro: '/ro/confidentialitate/', pt: '/pt/privacidade/', fr: '/fr/confidentialite/', id: '/id/privasi/', hi: '/hi/privacy/',
  },
  nutzungsbedingungen: { de: '/nutzungsbedingungen/', tr: '/tr/kullanim-kosullari/', en: '/en/terms/', es: '/es/condiciones-de-uso/',
    bs: '/bs/uslovi-koristenja/', hr: '/hr/uvjeti-koristenja/', sr: '/sr/uslovi-koriscenja/', ro: '/ro/termeni-de-utilizare/', pt: '/pt/termos-de-uso/', fr: '/fr/conditions-d-utilisation/', id: '/id/ketentuan-penggunaan/', hi: '/hi/terms/',
  },
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
