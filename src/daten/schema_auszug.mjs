// Auszug aus dem Vokabular von schema.org (https://schema.org, Stand der Typen und Eigenschaften wie auf schema.org
// beschrieben) für die Typen, die diese Website in JSON-LD nutzt (src/daten/strukturiert.mjs, Brotkrumen.astro). Je Typ
// der Obertyp und die eigenen Eigenschaften; erlaubt sind die eigenen und die aller Obertypen. Prüfung im Bau
// (tools/pruefe_bau.mjs, Regel 10): bekannter Typ, nur erlaubte Eigenschaften, @context oben, inLanguage passt zur
// Seite, Zahlen und Adressen in der richtigen Form. Ein neuer Typ oder eine neue Eigenschaft muss hier zuerst
// eingetragen werden (nach Blick auf schema.org).
import { SPRACHEN } from './adressen.mjs';

const TYPEN = {
  Thing: { ober: null, eigen: ['name', 'description', 'url', 'image', 'sameAs', 'identifier', 'alternateName', 'mainEntityOfPage'] },
  CreativeWork: {
    ober: 'Thing',
    eigen: ['inLanguage', 'publisher', 'author', 'dateModified', 'datePublished', 'headline', 'isPartOf', 'about', 'mainEntity',
      'hasPart', 'text', 'keywords', 'license', 'creator', 'copyrightHolder'],
  },
  WebSite: { ober: 'CreativeWork', eigen: ['potentialAction'] },
  WebPage: { ober: 'CreativeWork', eigen: ['breadcrumb', 'primaryImageOfPage', 'lastReviewed'] },
  AboutPage: { ober: 'WebPage', eigen: [] },
  FAQPage: { ober: 'WebPage', eigen: [] },
  Article: { ober: 'CreativeWork', eigen: ['articleBody', 'articleSection', 'wordCount'] },
  SoftwareApplication: {
    ober: 'CreativeWork',
    eigen: ['operatingSystem', 'applicationCategory', 'applicationSubCategory', 'screenshot', 'installUrl', 'downloadUrl',
      'softwareVersion', 'offers', 'featureList', 'fileSize', 'permissions'],
  },
  MobileApplication: { ober: 'SoftwareApplication', eigen: ['carrierRequirements'] },
  Organization: { ober: 'Thing', eigen: ['email', 'logo', 'contactPoint', 'address', 'founder', 'legalName'] },
  Comment: { ober: 'CreativeWork', eigen: ['upvoteCount', 'downvoteCount', 'parentItem'] },
  Question: { ober: 'Comment', eigen: ['acceptedAnswer', 'suggestedAnswer', 'answerCount'] },
  Answer: { ober: 'Comment', eigen: [] },
  Intangible: { ober: 'Thing', eigen: [] },
  Offer: { ober: 'Intangible', eigen: ['price', 'priceCurrency', 'availability', 'category'] },
  ItemList: { ober: 'Intangible', eigen: ['itemListElement', 'numberOfItems', 'itemListOrder'] },
  BreadcrumbList: { ober: 'ItemList', eigen: [] },
  ListItem: { ober: 'Intangible', eigen: ['item', 'position', 'nextItem', 'previousItem'] },
  HowTo: { ober: 'CreativeWork', eigen: ['step', 'supply', 'tool', 'totalTime', 'prepTime', 'performTime', 'estimatedCost', 'yield'] },
  // HowToStep hat drei Obertypen (ListItem, CreativeWork, ItemList); hier zusammengefasst.
  HowToStep: { ober: 'CreativeWork', mehr: ['ListItem', 'ItemList'], eigen: [] },
};

function erlaubt(typ) {
  const liste = new Set(['@context', '@type', '@id']);
  const offen = [typ];
  while (offen.length) {
    const name = offen.pop();
    const eintrag = TYPEN[name];
    if (!eintrag) continue;
    eintrag.eigen.forEach((eigenschaft) => liste.add(eigenschaft));
    if (eintrag.ober) offen.push(eintrag.ober);
    offen.push(...(eintrag.mehr ?? []));
  }
  return liste;
}

const ADRESSE = /^https:\/\/tarot-cup\.com\/[^\s]*$/;
const DATUM = /^\d{4}-\d{2}-\d{2}$/;

// Gibt eine Liste von Befunden zurück (leer: in Ordnung). "sprache": Sprache der Seite.
export function pruefeSchema(daten, sprache) {
  const befunde = [];
  if (daten['@context'] !== 'https://schema.org') befunde.push(`@context ist ${daten['@context']}`);
  (function lauf(knoten, weg) {
    if (Array.isArray(knoten)) return knoten.forEach((teil, nummer) => lauf(teil, `${weg}[${nummer}]`));
    if (!knoten || typeof knoten !== 'object') return;
    const typ = knoten['@type'];
    if (!typ) {
      // Verweis auf ein Objekt an anderer Stelle: nur @id.
      const rest = Object.keys(knoten).filter((schluessel) => schluessel !== '@id');
      if (rest.length) befunde.push(`${weg}: Objekt ohne @type mit ${rest.join(', ')}`);
      return;
    }
    if (!TYPEN[typ]) {
      befunde.push(`${weg}: Typ ${typ} nicht im Auszug`);
      return;
    }
    const liste = erlaubt(typ);
    for (const [schluessel, wert] of Object.entries(knoten)) {
      if (!liste.has(schluessel)) befunde.push(`${weg}: ${typ} kennt ${schluessel} nicht`);
      if (['url', 'item', 'installUrl', 'mainEntityOfPage'].includes(schluessel) && typeof wert === 'string' && !ADRESSE.test(wert) && !wert.startsWith('https://play.google.com/')) befunde.push(`${weg}.${schluessel}: keine volle Adresse (${wert})`);
      if (['image', 'screenshot'].includes(schluessel)) [wert].flat().forEach((bild) => { if (!ADRESSE.test(bild)) befunde.push(`${weg}.${schluessel}: keine volle Adresse (${bild})`); });
      if (['position', 'numberOfItems'].includes(schluessel) && !Number.isInteger(wert)) befunde.push(`${weg}.${schluessel}: keine ganze Zahl`);
      if (['dateModified', 'datePublished'].includes(schluessel) && !DATUM.test(wert)) befunde.push(`${weg}.${schluessel}: kein Datum JJJJ-MM-TT`);
      if (schluessel === 'inLanguage') {
        const gut = Array.isArray(wert) ? wert.length === SPRACHEN.length && SPRACHEN.every((code) => wert.includes(code)) : wert === sprache;
        if (!gut) befunde.push(`${weg}.inLanguage: ${JSON.stringify(wert)} passt nicht zur Seite (${sprache})`);
      }
      if (typeof wert === 'string' && !wert.trim()) befunde.push(`${weg}.${schluessel}: leer`);
      if (schluessel !== '@context' && typeof wert === 'object') lauf(wert, `${weg}.${schluessel}`);
    }
    if (typ === 'ItemList' || typ === 'BreadcrumbList') {
      const elemente = knoten.itemListElement ?? [];
      if ('numberOfItems' in knoten && knoten.numberOfItems !== elemente.length) befunde.push(`${weg}: numberOfItems ≠ Anzahl der Elemente`);
      elemente.forEach((element, nummer) => { if (element.position !== nummer + 1) befunde.push(`${weg}.itemListElement[${nummer}]: position ${element.position}`); });
    }
    if (typ === 'Question' && !knoten.acceptedAnswer?.text) befunde.push(`${weg}: Frage ohne Antworttext`);
  })(daten, daten['@type'] ?? 'JSON-LD');
  return befunde;
}
