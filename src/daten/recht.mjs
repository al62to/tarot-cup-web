// Rechtstexte: Verzeichnis, Bausteine und alles, was die Rechtsseiten außer dem Text zeigen (Sprachlink, Titel,
// Beschreibung). Seit AP-40D (Entscheidung Ali, 19.11.2026) baut die Website je Text nur die gültige Fassung unter
// /<pfad>/; es gibt keine Liste der Fassungen und keine nummerierten Seiten /<pfad>/<nummer>/ mehr. Das Verzeichnis
// nennt weiter alle Fassungen (die letzte ist die gültige); für eine neue Fassung reicht es, sie mit recht_web.py
// einzutragen. Die alten Fassungen liegen nur intern in deutung-unterlagen/recht/ (archiv_web_2026-11-19/).
// Bausteine und Verzeichnis schreibt deutung-unterlagen/arbeit/recht_web.py; hier wird nichts am Wortlaut geändert.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import verzeichnis from '../inhalte/recht/verzeichnis.json' with { type: 'json' };

// Bausteine über das Dateisystem (ab der Wurzel des Projekts), damit auch die Werkzeuge in tools/ diese Datei lesen.
const ORDNER = join(process.cwd(), 'src', 'inhalte', 'recht');

export const SPRACHEN = verzeichnis.sprachen;
export const TEXTE = verzeichnis.texte;

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

// Alle Rechtsseiten: je Text die gültige Fassung unter /<pfad>/ (AP-40D: keine Seiten für einzelne Fassungen).
export function rechtsseiten() {
  return TEXTE.map((text) => ({ text, fassung: neuesteVon(text), adresse: `/${text.pfad}/` }));
}

// Alle Sprachfassungen einer Rechtsseite für hreflang (sie selbst eingeschlossen): die gültigen Seiten desselben Texts
// in allen Sprachen. Gibt es keine andere Sprache, null.
export function sprachfassungen({ text }) {
  const liste = TEXTE.filter((eintrag) => eintrag.gruppe === text.gruppe).map((anderer) => ({ sprache: anderer.sprache, pfad: `/${anderer.pfad}/` }));
  return liste.length > 1 ? liste : null;
}

// Link zur anderen Sprache und Gegenseite für hreflang: gültige Seite zu gültiger Seite.
// Texte ohne Gegenstück (Englisch, Spanisch und die übrigen Übersetzungen) verlinken oben auf die rechtlich
// maßgeblichen Fassungen auf Deutsch und Türkisch ("links").
export function sprachwahl({ text }) {
  if (!text.gegenstueck && text.archiv === false) {
    const links = TEXTE.filter((eintrag) => eintrag.gruppe === text.gruppe && eintrag.gegenstueck)
      .map((eintrag) => ({ ziel: `/${eintrag.pfad}/`, text: SPRACHEN[eintrag.sprache].name, sprache: eintrag.sprache }));
    return { link: null, links, gegenseite: null };
  }
  const gegen = gegenstueckVon(text);
  if (!gegen) return { link: null, gegenseite: null };
  return { link: { ziel: `/${gegen.pfad}/`, text: SPRACHEN[gegen.sprache].name, sprache: gegen.sprache }, gegenseite: `/${gegen.pfad}/` };
}

export function seitentitel({ text }) {
  return formatiere(SPRACHEN[text.sprache].seitentitel, { titel: text.titel });
}

// Beschreibungen der Rechtsseiten (neu mit AP-W1; der Wortlaut der Texte bleibt unberührt).
const BESCHREIBUNG = {
  datenschutz: 'Die Datenschutzerklärung von Tarot Cup sagt für App und Website, was gespeichert wird, wer verantwortlich ist und welche Rechte du hast.',
  nutzungsbedingungen: 'Die Nutzungsbedingungen von Tarot Cup erklären, was die App ist und was nicht, was du beim Nutzen beachten solltest und welche Regeln gelten.',
  'tr/gizlilik': 'Tarot Cup uygulamasının ve tarot-cup.com sitesinin gizlilik politikası, neyin saklandığını, kimin sorumlu olduğunu ve hangi haklara sahip olduğunu anlatır.',
  'tr/kullanim-kosullari': 'Tarot Cup’ın kullanım koşulları, uygulamanın ne olduğunu ve ne olmadığını, kullanırken nelere dikkat etmen gerektiğini ve geçerli kuralları anlatır.',
  // AP-SPR2: von der Website-Sitzung geschrieben, noch nicht durchgesehen.
  'en/privacy': 'The Tarot Cup privacy policy explains, for the app and the website, what is stored, who is responsible, and what rights you have.',
  'en/terms': 'The Tarot Cup terms of use explain what the app is and what it is not, what to keep in mind when using it, and which rules apply.',
  'es/privacidad': 'La política de privacidad de Tarot Cup explica, para la app y el sitio web, qué se guarda, quién es responsable y qué derechos tienes.',
  'es/condiciones-de-uso': 'Las condiciones de uso de Tarot Cup explican qué es la app y qué no es, qué debes tener en cuenta al usarla y qué reglas se aplican.',
  // AP-23: von der Hauptsitzung geschrieben, muttersprachlich ungeprüft.
  'bs/privatnost': 'Politika privatnosti aplikacije Tarot Cup objašnjava za aplikaciju i web-stranicu šta se sprema, ko je odgovoran i koja prava imaš.',
  'bs/uslovi-koristenja': 'Uslovi korištenja aplikacije Tarot Cup objašnjavaju šta aplikacija jeste, a šta nije, na šta trebaš paziti i koja pravila vrijede.',
  'hr/privatnost': 'Izjava o privatnosti aplikacije Tarot Cup objašnjava za aplikaciju i web-stranicu što se sprema, tko je odgovoran i koja prava imaš.',
  'hr/uvjeti-koristenja': 'Uvjeti korištenja aplikacije Tarot Cup objašnjavaju što aplikacija jest, a što nije, na što trebaš paziti i koja pravila vrijede.',
  'sr/privatnost': 'Politika privatnosti aplikacije Tarot Cup objašnjava za aplikaciju i veb-sajt šta se čuva, ko je odgovoran i koja prava imaš.',
  'sr/uslovi-koriscenja': 'Uslovi korišćenja aplikacije Tarot Cup objašnjavaju šta aplikacija jeste, a šta nije, na šta treba da paziš i koja pravila važe.',
  'ro/confidentialitate': 'Politica de confidențialitate Tarot Cup explică, pentru aplicație și site, ce se salvează, cine este responsabil și ce drepturi ai.',
  'ro/termeni-de-utilizare': 'Termenii de utilizare Tarot Cup explică ce este aplicația și ce nu este, la ce să fii atent când o folosești și ce reguli se aplică.',
  'pt/privacidade': 'A Política de Privacidade do Tarot Cup explica, para o app e o site, o que é salvo, quem é responsável e quais direitos você tem.',
  'pt/termos-de-uso': 'Os Termos de Uso do Tarot Cup explicam o que o app é e o que não é, o que observar ao usá-lo e quais regras se aplicam.',
  'fr/confidentialite': 'La politique de confidentialité de Tarot Cup explique, pour l’application et le site web, ce qui est enregistré, qui est responsable et quels sont tes droits.',
  'fr/conditions-d-utilisation': 'Les conditions d’utilisation de Tarot Cup expliquent ce qu’est l’application et ce qu’elle n’est pas, à quoi faire attention et quelles règles s’appliquent.',
  'id/privasi': 'Kebijakan Privasi Tarot Cup menjelaskan, untuk aplikasi dan situs web, apa yang disimpan, siapa yang bertanggung jawab, dan apa saja hakmu.',
  'id/ketentuan-penggunaan': 'Ketentuan Penggunaan Tarot Cup menjelaskan apa aplikasi ini dan apa yang bukan, apa yang perlu kamu perhatikan saat memakainya, dan aturan yang berlaku.',
  'hi/privacy': 'Tarot Cup की निजता नीति ऐप और वेबसाइट के लिए बताती है कि क्या सहेजा जाता है, कौन ज़िम्मेदार है और आपके क्या अधिकार हैं।',
  'hi/terms': 'Tarot Cup के उपयोग की शर्तें बताती हैं कि ऐप क्या है और क्या नहीं, उपयोग करते समय किन बातों का ध्यान रखें और कौन से नियम लागू होते हैं।',
};
export function beschreibung({ text }) {
  return BESCHREIBUNG[text.pfad];
}
