// Strukturierte Daten (JSON-LD) an einer Stelle, Muster FoodAsu. Überall: WebSite und Person „Ali Tonc“ (ohne sameAs,
// E5), auf Unterseiten dazu BreadcrumbList (Brotkrumen.astro). Je Seite: Startseite MobileApplication und FAQPage
// (Auszug), Ratgeber Article mit ItemList und HowTo, So geht's Article, Fragen FAQPage, Über AboutPage.
// Nicht aufgenommen (E6 und Auftrag): offers, Preis, Bewertungen, isAccessibleForFree, softwareVersion.
import { seite, store } from './seite.mjs';
import { standVon } from './stand.mjs';

export const WEBSITE_ID = `${seite.adresse}/#website`;
export const ENTWICKLER_ID = `${seite.adresse}/#ali-tonc`;
export const APP_ID = `${seite.adresse}/#app`;

const KONTEXT = 'https://schema.org';
const absolut = (pfad) => seite.adresse + pfad;

export const websiteDaten = (sprache) => ({
  '@context': KONTEXT,
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: seite.name,
  url: `${seite.adresse}/`,
  inLanguage: sprache,
  publisher: { '@id': ENTWICKLER_ID },
});

export const entwicklerDaten = () => ({
  '@context': KONTEXT,
  '@type': 'Person',
  '@id': ENTWICKLER_ID,
  name: 'Ali Tonc',
  url: absolut('/ueber-tarot-cup/'),
});

// Die App, vollständig, nur auf der Startseite (beide Sprachen, je mit der Beschreibung der Sprache).
export const appDaten = ({ beschreibung, bildschirmfotos }) => ({
  '@context': KONTEXT,
  '@type': 'MobileApplication',
  '@id': APP_ID,
  name: seite.name,
  operatingSystem: 'Android',
  applicationCategory: 'LifestyleApplication',
  inLanguage: ['de', 'tr'],
  description: beschreibung,
  url: `${seite.adresse}/`,
  image: absolut('/bilder/app-symbol-512.png'),
  screenshot: bildschirmfotos.map(absolut),
  author: { '@id': ENTWICKLER_ID },
  ...(store.oeffentlich ? { installUrl: store.adresse } : {}),
});

// Fragen und Antworten als Klartext (Links im Text werden zu ihrem Linktext).
const klartext = (text) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
export const faqDaten = ({ pfad, sprache, liste }) => ({
  '@context': KONTEXT,
  '@type': 'FAQPage',
  '@id': `${absolut(pfad)}#fragen`,
  inLanguage: sprache,
  mainEntity: liste.map((eintrag) => ({
    '@type': 'Question',
    name: eintrag.frage,
    acceptedAnswer: { '@type': 'Answer', text: eintrag.antwort.map(klartext).join(' ') },
  })),
});

export const artikelDaten = ({ pfad, sprache, titel, beschreibung, bild, quellen, teile = [] }) => ({
  '@context': KONTEXT,
  '@type': 'Article',
  '@id': `${absolut(pfad)}#artikel`,
  headline: titel,
  description: beschreibung,
  inLanguage: sprache,
  url: absolut(pfad),
  mainEntityOfPage: absolut(pfad),
  image: absolut(bild),
  dateModified: standVon(quellen),
  author: { '@id': ENTWICKLER_ID },
  publisher: { '@id': ENTWICKLER_ID },
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': APP_ID },
  ...(teile.length ? { hasPart: teile } : {}),
});

// Liste (Zeichen, Karten, Legungen) als ItemList.
export const listenDaten = ({ name, eintraege }) => ({
  '@type': 'ItemList',
  name,
  numberOfItems: eintraege.length,
  itemListElement: eintraege.map((eintrag, nummer) => ({
    '@type': 'ListItem',
    position: nummer + 1,
    name: eintrag.name,
    ...(eintrag.beschreibung ? { description: eintrag.beschreibung } : {}),
  })),
});

export const anleitungDaten = ({ pfad, sprache, name, beschreibung, schritte, kennung }) => ({
  '@context': KONTEXT,
  '@type': 'HowTo',
  '@id': `${absolut(pfad)}#${kennung}`,
  name,
  description: beschreibung,
  inLanguage: sprache,
  step: schritte.map((schritt, nummer) => ({
    '@type': 'HowToStep',
    position: nummer + 1,
    name: schritt.titel,
    text: klartext(schritt.text),
    url: `${absolut(pfad)}#${kennung}-${nummer + 1}`,
  })),
});

export const ueberDaten = ({ pfad, sprache, titel, beschreibung }) => ({
  '@context': KONTEXT,
  '@type': 'AboutPage',
  '@id': `${absolut(pfad)}#seite`,
  name: titel,
  description: beschreibung,
  inLanguage: sprache,
  url: absolut(pfad),
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': APP_ID },
  mainEntity: { '@id': ENTWICKLER_ID },
});

export const brotkrumenDaten = (krumen) => ({
  '@context': KONTEXT,
  '@type': 'BreadcrumbList',
  itemListElement: krumen.map((krume, nummer) => ({
    '@type': 'ListItem',
    position: nummer + 1,
    name: krume.titel,
    item: absolut(krume.ziel),
  })),
});
