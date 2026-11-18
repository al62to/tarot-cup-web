// Erklärseiten (AP-25): je Seite Schlüssel (= Schlüssel in src/daten/adressen.mjs), Nummer im Auftrag, Bereich, Serie
// des Videoplans, Figur und Pose, übergeordnete Themenseite (Brotkrumen) und verwandte Seiten. Die Texte stehen in
// src/daten/texte/erklaer_<bereich>.mjs (Deutsch und Türkisch eigenständig, die übrigen Sprachen über
// tools/texte_einspielen.mjs). Eine Sprache gilt als vorhanden, wenn es für sie Adresse und Text gibt.
// Bereiche: kaffeesatz (Kaffeebraun), tarot (Nachtblau), traum und mond (Nacht), allgemein.
// Figuren: erzaehlerin = Aylin, erzaehler = Ozan; Posen ohne Tasse (mond, geschenk, schreibt, karten), immer ganz 9:16.
import { ADRESSEN } from './adressen.mjs';
import { erklaerKaffeesatz } from './texte/erklaer_kaffeesatz.mjs';
import { erklaerTarot } from './texte/erklaer_tarot.mjs';
import { erklaerTraum } from './texte/erklaer_traum.mjs';
import { erklaerMond } from './texte/erklaer_mond.mjs';
import { erklaerAllgemein } from './texte/erklaer_allgemein.mjs';

const MODULE = {
  kaffeesatz: { texte: erklaerKaffeesatz, datei: 'erklaer_kaffeesatz' },
  tarot: { texte: erklaerTarot, datei: 'erklaer_tarot' },
  traum: { texte: erklaerTraum, datei: 'erklaer_traum' },
  mond: { texte: erklaerMond, datei: 'erklaer_mond' },
  allgemein: { texte: erklaerAllgemein, datei: 'erklaer_allgemein' },
};

// eltern: Schlüssel der Themenseite für die Brotkrumen (null = direkt unter der Startseite).
export const ERKLAERSEITEN = [
  { schluessel: 'kaffeeHerkunft', nr: 1, bereich: 'kaffeesatz', text: 'herkunft', serie: 'woher', figur: 'erzaehlerin', pose: 'schreibt', eltern: 'kaffeesatz', verwandt: ['kaffeeBrauchtum', 'kaffeeZubereitung', 'kaffeesatz'] },
  { schluessel: 'kaffeeZubereitung', nr: 2, bereich: 'kaffeesatz', text: 'zubereitung', serie: 'sogehts', figur: 'erzaehler', pose: 'schreibt', eltern: 'kaffeesatz', verwandt: ['kaffeesatz', 'kaffeeHerkunft', 'kaffeeZeichen'] },
  { schluessel: 'kaffeeBrauchtum', nr: 5, bereich: 'kaffeesatz', text: 'brauchtum', serie: 'woher', figur: 'erzaehlerin', pose: 'schreibt', eltern: 'kaffeesatz', verwandt: ['kaffeeHerkunft', 'kaffeesatz', 'mondBrauchtum'] },
  { schluessel: 'kaffeeZeichen', nr: 6, bereich: 'kaffeesatz', text: 'zeichen', serie: 'sogehts', figur: 'erzaehler', pose: 'schreibt', eltern: 'kaffeesatz', verwandt: ['kaffeesatz', 'kaffeeZubereitung', 'vergleich'] },
  { schluessel: 'tarotGeschichte', nr: 7, bereich: 'tarot', text: 'geschichte', serie: 'woher', figur: 'erzaehlerin', pose: 'karten', eltern: 'tarot', verwandt: ['tarotSmith', 'tarotArkana', 'tarot'] },
  { schluessel: 'tarotArkana', nr: 8, bereich: 'tarot', text: 'arkana', serie: 'sogehts', figur: 'erzaehler', pose: 'karten', eltern: 'tarot', verwandt: ['tarotFarben', 'tarotGeschichte', 'tarot'] },
  { schluessel: 'tarotFarben', nr: 9, bereich: 'tarot', text: 'farben', serie: 'sogehts', figur: 'erzaehlerin', pose: 'karten', eltern: 'tarot', verwandt: ['tarotArkana', 'tarotUmgekehrt', 'tarot'] },
  { schluessel: 'tarotUmgekehrt', nr: 11, bereich: 'tarot', text: 'umgekehrt', serie: 'sogehts', figur: 'erzaehler', pose: 'karten', eltern: 'tarot', verwandt: ['tarot', 'tarotArkana', 'frageStellen'] },
  { schluessel: 'tarotSmith', nr: 12, bereich: 'tarot', text: 'smith', serie: 'woher', figur: 'erzaehlerin', pose: 'karten', eltern: 'tarot', verwandt: ['tarotGeschichte', 'tarotArkana', 'tarot'] },
  { schluessel: 'traumGeschichte', nr: 13, bereich: 'traum', text: 'geschichte', serie: 'woher', figur: 'erzaehler', pose: 'mond', eltern: null, verwandt: ['traumErinnern', 'traumSymbole', 'vergleich'] },
  { schluessel: 'traumErinnern', nr: 14, bereich: 'traum', text: 'erinnern', serie: 'sogehts', figur: 'erzaehlerin', pose: 'mond', eltern: null, verwandt: ['traumSymbole', 'traumGeschichte', 'mondPhasen'] },
  { schluessel: 'traumSymbole', nr: 15, bereich: 'traum', text: 'symbole', serie: 'sogehts', figur: 'erzaehler', pose: 'mond', eltern: null, verwandt: ['traumGeschichte', 'traumErinnern', 'kaffeeZeichen'] },
  { schluessel: 'mondPhasen', nr: 16, bereich: 'mond', text: 'phasen', serie: 'sogehts', figur: 'erzaehlerin', pose: 'mond', eltern: null, verwandt: ['mondBrauchtum', 'traumErinnern', 'frageStellen'] },
  { schluessel: 'mondBrauchtum', nr: 17, bereich: 'mond', text: 'brauchtum', serie: 'woher', figur: 'erzaehler', pose: 'mond', eltern: null, verwandt: ['mondPhasen', 'kaffeeBrauchtum', 'traumGeschichte'] },
  { schluessel: 'frageStellen', nr: 18, bereich: 'allgemein', text: 'frage', serie: 'sogehts', figur: 'erzaehlerin', pose: 'schreibt', eltern: null, verwandt: ['deutungKann', 'tarot', 'kaffeesatz'] },
  { schluessel: 'vergleich', nr: 19, bereich: 'allgemein', text: 'vergleich', serie: 'woher', figur: 'erzaehler', pose: 'karten', eltern: null, verwandt: ['kaffeeHerkunft', 'tarotGeschichte', 'traumGeschichte'] },
  { schluessel: 'deutungKann', nr: 20, bereich: 'allgemein', text: 'deutung', serie: 'sogehts', figur: 'erzaehlerin', pose: 'geschenk', eltern: null, verwandt: ['frageStellen', 'sogehts', 'fragen'] },
];

const nachSchluessel = new Map(ERKLAERSEITEN.map((eintrag) => [eintrag.schluessel, eintrag]));

export const erklaerVon = (schluessel) => nachSchluessel.get(schluessel) ?? null;
export const istErklaerseite = (schluessel) => nachSchluessel.has(schluessel);

// Textdatei (für Stand und Übersetzung) einer Erklärseite.
export const erklaerDatei = (eintrag) => MODULE[eintrag.bereich].datei;

// Texte einer Erklärseite in einer Sprache, oder null, wenn es sie (noch) nicht gibt.
export function erklaerTexte(eintrag, sprache) {
  const texte = MODULE[eintrag.bereich].texte[sprache]?.[eintrag.text];
  return texte && texte.titel ? texte : null;
}

// Sprachen, in denen es die Seite gibt (Adresse und Text).
export function erklaerSprachen(eintrag) {
  return Object.keys(ADRESSEN[eintrag.schluessel]).filter((sprache) => erklaerTexte(eintrag, sprache));
}

// Ort für store_klick und den Link zu Google Play: je Seite eigener Ort.
export const erklaerOrt = (eintrag) => `wissen_${eintrag.nr}`;
