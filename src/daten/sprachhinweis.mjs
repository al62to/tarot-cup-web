// Texte der Sprach-Hinweisleiste (Auftrag W5, 11.11.2026). Jede Leiste steht in ihrer eigenen Sprache, nicht in der
// Sprache der Seite; deshalb liegen die Texte hier und nicht in texte/oberflaeche.mjs (Englisch und Spanisch werden
// dort aus der Übersetzung erzeugt). Türkisch eigenständig geschrieben, muttersprachlich ungeprüft.
export const SPRACHHINWEIS = {
  de: { satz: 'Diese Seite gibt es auch auf Deutsch.', link: 'Auf Deutsch lesen', region: 'Hinweis zur Sprache', zu: 'Hinweis schließen' },
  tr: { satz: 'Bu sayfa Türkçe olarak da mevcut.', link: 'Türkçe sürümü aç', region: 'Dil bildirimi', zu: 'Bildirimi kapat' },
  en: { satz: 'This page is also available in English.', link: 'Read in English', region: 'Language notice', zu: 'Close notice' },
  es: { satz: 'Esta página también está disponible en español.', link: 'Leer en español', region: 'Aviso de idioma', zu: 'Cerrar aviso' },
  // AP-23
  bs: { satz: 'Ova stranica postoji i na bosanskom.', link: 'Čitaj na bosanskom', region: 'Napomena o jeziku', zu: 'Zatvori napomenu' },
  hr: { satz: 'Ova stranica postoji i na hrvatskom.', link: 'Čitaj na hrvatskom', region: 'Napomena o jeziku', zu: 'Zatvori napomenu' },
  sr: { satz: 'Ova stranica postoji i na srpskom.', link: 'Čitaj na srpskom', region: 'Napomena o jeziku', zu: 'Zatvori napomenu' },
  ro: { satz: 'Această pagină există și în limba română.', link: 'Citește în română', region: 'Notă despre limbă', zu: 'Închide nota' },
  pt: { satz: 'Esta página também está disponível em português.', link: 'Ler em português', region: 'Aviso de idioma', zu: 'Fechar aviso' },
  fr: { satz: 'Cette page existe aussi en français.', link: 'Lire en français', region: 'Note sur la langue', zu: 'Fermer la note' },
  id: { satz: 'Halaman ini juga tersedia dalam bahasa Indonesia.', link: 'Baca dalam bahasa Indonesia', region: 'Pemberitahuan bahasa', zu: 'Tutup pemberitahuan' },
  hi: { satz: 'यह पेज हिन्दी में भी उपलब्ध है।', link: 'हिन्दी में पढ़ें', region: 'भाषा से जुड़ी सूचना', zu: 'सूचना बंद करें' },
};

// Schlüssel im Speicher des Browsers. Wert: die Sprache, für die die Leiste geschlossen wurde. Der einzige Eintrag,
// den die Website speichert; tools/pruefe_bau.mjs lässt nur genau diesen zu.
export const SPRACHHINWEIS_SCHLUESSEL = 'tarotcup-sprachhinweis';
