// Texte der Sprach-Hinweisleiste (Auftrag W5, 11.11.2026). Jede Leiste steht in ihrer eigenen Sprache, nicht in der
// Sprache der Seite; deshalb liegen die Texte hier und nicht in texte/oberflaeche.mjs (Englisch und Spanisch werden
// dort aus der Übersetzung erzeugt). Türkisch eigenständig geschrieben, muttersprachlich ungeprüft.
export const SPRACHHINWEIS = {
  de: { satz: 'Diese Seite gibt es auch auf Deutsch.', link: 'Auf Deutsch lesen', region: 'Hinweis zur Sprache', zu: 'Hinweis schließen' },
  tr: { satz: 'Bu sayfa Türkçe olarak da mevcut.', link: 'Türkçe sürümü aç', region: 'Dil bildirimi', zu: 'Bildirimi kapat' },
  en: { satz: 'This page is also available in English.', link: 'Read in English', region: 'Language notice', zu: 'Close notice' },
  es: { satz: 'Esta página también está disponible en español.', link: 'Leer en español', region: 'Aviso de idioma', zu: 'Cerrar aviso' },
};

// Schlüssel im Speicher des Browsers. Wert: die Sprache, für die die Leiste geschlossen wurde. Der einzige Eintrag,
// den die Website speichert; tools/pruefe_bau.mjs lässt nur genau diesen zu.
export const SPRACHHINWEIS_SCHLUESSEL = 'tarotcup-sprachhinweis';
