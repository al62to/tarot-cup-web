// Hervorhebung in Überschriften der Textdaten: Ein Wort oder eine Wortgruppe zwischen zwei Sternen (*so*) steht auf der
// Seite kursiv in Gold oder Kupfer (Entwurf 9.1). Andere Auszeichnungen gibt es nicht. Werkzeuge, die nur den Text
// brauchen (Teilen-Bilder, Textausgabe, strukturierte Daten), nehmen ohneAuszeichnung().

const MUSTER = /\*([^*]+)\*/g;

// Zerlegt einen Text in Stücke { text, betont }; leere Stücke fallen weg.
export function teileAuszeichnung(text) {
  if (typeof text !== 'string') throw new Error(`Auszeichnung: Zeichenkette erwartet, gefunden ${typeof text}`);
  if ((text.match(/\*/g) ?? []).length % 2) throw new Error(`Auszeichnung: Stern ohne Gegenstück in „${text}“`);
  return text.split(/\*([^*]+)\*/).map((stueck, nummer) => ({ text: stueck, betont: nummer % 2 === 1 })).filter((teil) => teil.text);
}

export const ohneAuszeichnung = (text) => text.replace(MUSTER, '$1');
