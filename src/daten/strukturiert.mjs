// Strukturierte Daten (JSON-LD) an einer Stelle, Muster FoodAsu. Überall: WebSite und Organization „Tarot Cup“ als
// Herausgeber (ohne sameAs, E5; kein persönlicher Name, AP-W3), auf Unterseiten dazu BreadcrumbList (Brotkrumen.astro). Je Seite: Startseite MobileApplication und FAQPage
// (Auszug), Ratgeber Article mit ItemList und HowTo, So geht's Article, Fragen FAQPage, Über AboutPage.
// Nicht aufgenommen (E6 und Auftrag): offers, Preis, Bewertungen, isAccessibleForFree, softwareVersion.
import { seite, store } from './seite.mjs';
import { standVon } from './stand.mjs';

export const WEBSITE_ID = `${seite.adresse}/#website`;
export const HERAUSGEBER_ID = `${seite.adresse}/#organisation`;
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
  publisher: { '@id': HERAUSGEBER_ID },
});

export const herausgeberDaten = () => ({
  '@context': KONTEXT,
  '@type': 'Organization',
  '@id': HERAUSGEBER_ID,
  name: seite.name,
  url: `${seite.adresse}/`,
  email: seite.email,
});

// JSON-LD als Text für <script type="application/ld+json">. Die E-Mail-Adresse steht darin als \u-Folge (für JSON
// gleichwertig), damit sie wie im übrigen HTML nicht als Klartext im Quelltext steht.
const emailEscaped = [...seite.email].map((zeichen) => `\\u${zeichen.codePointAt(0).toString(16).padStart(4, '0')}`).join('');
export const jsonLd = (daten) => JSON.stringify(daten).replaceAll(seite.email, emailEscaped);

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
  author: { '@id': HERAUSGEBER_ID },
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
  author: { '@id': HERAUSGEBER_ID },
  publisher: { '@id': HERAUSGEBER_ID },
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': APP_ID },
  // Listen (Zeichen, Karten, Legungen) als mainEntity: hasPart erlaubt nur CreativeWork, ItemList ist keins (schema.org-Validator).
  ...(teile.length ? { mainEntity: teile } : {}),
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
  mainEntity: { '@id': HERAUSGEBER_ID },
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
