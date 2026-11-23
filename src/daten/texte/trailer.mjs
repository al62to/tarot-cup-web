// Abschnitt „So sieht Tarot Cup aus“ auf der Startseite (AP-WV1): Überschrift, Name und Beschreibung des Videos je
// Sprache. de, en und id haben eine eigene Fassung, alle übrigen Sprachen die Fassung ohne Text.
// Eigene Datei, damit tools/texte_einspielen.mjs sie nicht überschreibt. Hervorhebung *…* wie in start.mjs.
export const TRAILER_FASSUNG = { de: 'de', en: 'en', id: 'id' };
export const TRAILER_OHNE_TEXT = 'ohne_text';

export const trailer = {
  de: { titel: 'So sieht *Tarot Cup* aus', name: 'Tarot Cup Trailer', beschreibung: 'Der Trailer zeigt in 30 Sekunden die Welt von Tarot Cup: Kaffeesatz in der Tasse und Tarotkarten.', oeffnen: 'Video öffnen' },
  tr: { titel: '*Tarot Cup* böyle görünüyor', name: 'Tarot Cup fragmanı', beschreibung: 'Fragman, 30 saniyede Tarot Cup dünyasını gösteriyor: fincandaki telve ve tarot kartları.', oeffnen: 'Videoyu aç' },
  en: { titel: 'See what *Tarot Cup* looks like', name: 'Tarot Cup trailer', beschreibung: 'In 30 seconds, the trailer shows the world of Tarot Cup: coffee grounds in the cup and tarot cards.', oeffnen: 'Open video' },
  es: { titel: 'Así es *Tarot Cup*', name: 'Tráiler de Tarot Cup', beschreibung: 'En 30 segundos, el tráiler muestra el mundo de Tarot Cup: los posos de café en la taza y las cartas del tarot.', oeffnen: 'Abrir vídeo' },
  bs: { titel: 'Ovako izgleda *Tarot Cup*', name: 'Tarot Cup trailer', beschreibung: 'Za 30 sekundi trailer prikazuje svijet aplikacije Tarot Cup: talog kafe u šoljici i tarot karte.', oeffnen: 'Otvori video' },
  hr: { titel: 'Ovako izgleda *Tarot Cup*', name: 'Tarot Cup trailer', beschreibung: 'U 30 sekundi trailer prikazuje svijet aplikacije Tarot Cup: talog kave u šalici i tarot karte.', oeffnen: 'Otvori video' },
  sr: { titel: 'Ovako izgleda *Tarot Cup*', name: 'Tarot Cup trejler', beschreibung: 'Za 30 sekundi trejler prikazuje svet aplikacije Tarot Cup: talog kafe u šoljici i tarot karte.', oeffnen: 'Otvori video' },
  ro: { titel: 'Așa arată *Tarot Cup*', name: 'Trailer Tarot Cup', beschreibung: 'În 30 de secunde, trailerul arată lumea Tarot Cup: zațul de cafea din ceașcă și cărțile de tarot.', oeffnen: 'Deschide videoclipul' },
  pt: { titel: 'Veja como é o *Tarot Cup*', name: 'Trailer do Tarot Cup', beschreibung: 'Em 30 segundos, o trailer mostra o mundo do Tarot Cup: a borra de café na xícara e as cartas de tarô.', oeffnen: 'Abrir vídeo' },
  fr: { titel: 'Découvre *Tarot Cup* en images', name: 'Bande-annonce de Tarot Cup', beschreibung: 'En 30 secondes, la bande-annonce montre l’univers de Tarot Cup : le marc de café dans la tasse et les cartes de tarot.', oeffnen: 'Ouvrir la vidéo' },
  id: { titel: 'Begini tampilan *Tarot Cup*', name: 'Trailer Tarot Cup', beschreibung: 'Dalam 30 detik, trailer ini menampilkan dunia Tarot Cup: ampas kopi di cangkir dan kartu tarot.', oeffnen: 'Buka video' },
  hi: { titel: '*Tarot Cup* ऐसा दिखता है', name: 'Tarot Cup ट्रेलर', beschreibung: '30 सेकंड के इस ट्रेलर में Tarot Cup की दुनिया दिखती है: कप में कॉफ़ी की तलछट और टैरो कार्ड।', oeffnen: 'वीडियो खोलें' },
};

export const trailerVideo = (sprache) => `/video/tarotcup_trailer_30s_${TRAILER_FASSUNG[sprache] ?? TRAILER_OHNE_TEXT}_web.mp4`;
export const TRAILER_BILD_WEBP = '/video/tarotcup_trailer_vorschau.webp';
export const TRAILER_BILD_JPG = '/video/tarotcup_trailer_vorschau.jpg';
