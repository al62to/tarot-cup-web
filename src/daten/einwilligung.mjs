// Einwilligung zur Statistik auf der Website (Auftrag W7, 12.11.2026). Werkzeug „CookieConsent“ (vanilla-cookieconsent
// v3, über npm, beim Bau gebündelt), Aufbau wie in der Datenschutzerklärung 1.4, Abschnitt 11: gleichwertige Knöpfe
// „Alle akzeptieren“ und „Ablehnen“, dazu „Einstellungen“; Cookie „cc_cookie“ 6 Monate; Google Tag Manager und Google
// Analytics 4 erst nach Zustimmung; Link „Cookie-Einstellungen“ in der Fußzeile jeder Seite.
// Die Knopf-Beschriftungen stehen wörtlich so in der Datenschutzerklärung der jeweiligen Sprache (Abschnitt 11). Die
// übrigen Sätze sind daraus abgeleitet. Neue Sprachen bekommen hier je einen Eintrag in EINWILLIGUNG (gleiche Felder);
// sonst ist nichts zu ändern. Türkisch eigenständig geschrieben, muttersprachlich ungeprüft.
// Kein Wort zu Preisen und kein „KI“ (Regeln der Website).

// Container des Google Tag Manager („Tarot Cup“ / „tarot-cup.com“). Er enthält nur das Google-Tag der GA4-Property
// „Tarot Cup“ (Web-Datenstrom tarot-cup.com, Mess-ID G-DZT3YDP3Q8), ausgelöst durch das Ereignis GTM_EREIGNIS, und das
// GA4-Ereignis store_klick. Das Ereignis sendet die Website erst nach der Zustimmung.
export const GTM_ID = 'GTM-KHHHQ4ZK';
export const GTM_EREIGNIS = 'einwilligung_statistik';
export const GTM_ADRESSE = 'https://www.googletagmanager.com/gtm.js?id=';

// Orte der Abzeichen von Google Play (Storeknopf) als Wert des Parameters ort beim Ereignis store_klick.
export const STORE_ORT = { kopf: 'titelbild', fuss: 'fusszeile', kurzlink: 'app_seite' };

// Cookies von Google Analytics, die beim Widerruf gelöscht werden (_ga und _ga_<Kennung>).
export const GA_COOKIES = /^_ga(_.*)?$/;

export const EINWILLIGUNG = {
  de: {
    fusslink: 'Cookie-Einstellungen',
    titel: 'Statistik nur mit deiner Zustimmung',
    text: 'Mit deiner Zustimmung lädt die Website Google Analytics. So sehe ich, welche Seiten gelesen werden, womit und ungefähr woher (Stadt, Region, Land). Ablehnen ist ohne Nachteil möglich. Ändern kannst du deine Wahl jederzeit über „Cookie-Einstellungen“ in der Fußzeile. Mehr dazu in der <a href="{datenschutz}">Datenschutzerklärung</a>.',
    alle: 'Alle akzeptieren',
    ablehnen: 'Ablehnen',
    einstellungen: 'Einstellungen',
    einstellungenTitel: 'Cookie-Einstellungen',
    speichern: 'Auswahl speichern',
    schliessen: 'Schließen',
    wahlTitel: 'Deine Wahl',
    wahlText: 'Hier legst du fest, welche Cookies die Website setzen darf. Mehr dazu in der <a href="{datenschutz}">Datenschutzerklärung</a>.',
    notwendig: 'Notwendig',
    notwendigText: 'Das Cookie „cc_cookie“ speichert 6 Monate lang deine Wahl. Ohne es könnte sich die Website deine Wahl nicht merken; es ist immer an.',
    statistik: 'Statistik',
    statistikText: 'Google Tag Manager und Google Analytics 4 von Google Ireland Limited (dazu Google LLC, USA). Cookies „_ga“ und „_ga_…“, bis zu 14 Monate. Erfasst werden die aufgerufenen Seiten, der Zeitpunkt, die Seite, von der du kommst, Gerätetyp, Browser, Bildschirmgröße, Sprache und der ungefähre Standort (Stadt, Region, Land). Keine Werbung, keine Google Signals.',
  },
  tr: {
    fusslink: 'Çerez ayarları',
    titel: 'İstatistik yalnızca onayınla',
    text: 'Onay verirsen web sitesi Google Analytics’i yükler. Böylece hangi sayfaların okunduğunu, hangi cihazla ve yaklaşık olarak nereden (şehir, bölge, ülke) bakıldığını görürüm. Reddetmek hiçbir dezavantaj olmadan mümkündür. Tercihini istediğin zaman alt bilgideki „Çerez ayarları“ bağlantısıyla değiştirebilirsin. Ayrıntılar <a href="{datenschutz}">gizlilik politikasında</a>.',
    alle: 'Tümünü kabul et',
    ablehnen: 'Reddet',
    einstellungen: 'Ayarlar',
    einstellungenTitel: 'Çerez ayarları',
    speichern: 'Seçimi kaydet',
    schliessen: 'Kapat',
    wahlTitel: 'Tercihin',
    wahlText: 'Web sitesinin hangi çerezleri yerleştirebileceğini burada sen belirlersin. Ayrıntılar <a href="{datenschutz}">gizlilik politikasında</a>.',
    notwendig: 'Zorunlu',
    notwendigText: '„cc_cookie“ çerezi tercihini 6 ay saklar. Bu çerez olmadan web sitesi tercihini hatırlayamaz; her zaman açıktır.',
    statistik: 'İstatistik',
    statistikText: 'Google Ireland Limited’in (buna ek olarak Google LLC, ABD) Google Tag Manager’ı ve Google Analytics 4’ü. „_ga“ ve „_ga_…“ çerezleri, en fazla 14 ay. Kaydedilenler: açılan sayfalar, zaman, geldiğin sayfa, cihaz türü, tarayıcı, ekran boyutu, dil ve yaklaşık konum (şehir, bölge, ülke). Reklam yok, Google Signals yok.',
  },
  en: {
    fusslink: 'Cookie settings',
    titel: 'Statistics only with your consent',
    text: 'If you agree, the website loads Google Analytics. This shows me which pages are read, on which devices and roughly where from (city, region, country). You can decline without any disadvantage. You can change your choice at any time via “Cookie settings” in the footer. More in the <a href="{datenschutz}">privacy policy</a>.',
    alle: 'Accept all',
    ablehnen: 'Decline',
    einstellungen: 'Settings',
    einstellungenTitel: 'Cookie settings',
    speichern: 'Save choice',
    schliessen: 'Close',
    wahlTitel: 'Your choice',
    wahlText: 'Here you decide which cookies the website may set. More in the <a href="{datenschutz}">privacy policy</a>.',
    notwendig: 'Necessary',
    notwendigText: 'The cookie “cc_cookie” stores your choice for 6 months. Without it, the website could not remember your choice; it is always on.',
    statistik: 'Statistics',
    statistikText: 'Google Tag Manager and Google Analytics 4 from Google Ireland Limited (with Google LLC, USA). Cookies “_ga” and “_ga_…”, up to 14 months. Collected: the pages visited, the time, the page you came from, device type, browser, screen size, language and the approximate location (city, region, country). No advertising, no Google Signals.',
  },
  es: {
    fusslink: 'Configuración de cookies',
    titel: 'Estadísticas solo con tu consentimiento',
    text: 'Si das tu consentimiento, el sitio web carga Google Analytics. Así veo qué páginas se leen, con qué dispositivos y, de forma aproximada, desde dónde (ciudad, región, país). Puedes rechazar sin ninguna desventaja. Puedes cambiar tu elección en cualquier momento mediante «Configuración de cookies» en el pie de página. Más información en la <a href="{datenschutz}">política de privacidad</a>.',
    alle: 'Aceptar todo',
    ablehnen: 'Rechazar',
    einstellungen: 'Configuración',
    einstellungenTitel: 'Configuración de cookies',
    speichern: 'Guardar selección',
    schliessen: 'Cerrar',
    wahlTitel: 'Tu elección',
    wahlText: 'Aquí decides qué cookies puede instalar el sitio web. Más información en la <a href="{datenschutz}">política de privacidad</a>.',
    notwendig: 'Necesarias',
    notwendigText: 'La cookie «cc_cookie» guarda tu elección durante seis meses. Sin ella, el sitio web no podría recordar tu elección; siempre está activa.',
    statistik: 'Estadísticas',
    statistikText: 'Google Tag Manager y Google Analytics 4 de Google Ireland Limited (junto con Google LLC, EE. UU.). Cookies «_ga» y «_ga_…», hasta 14 meses. Se registran las páginas visitadas, el momento, la página desde la que llegas, el tipo de dispositivo, el navegador, el tamaño de la pantalla, el idioma y la ubicación aproximada (ciudad, región, país). Sin publicidad ni Google Signals.',
  },
};
