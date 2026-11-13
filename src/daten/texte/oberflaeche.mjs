// Feste Texte der Oberfläche (Menü, Fußzeile, Brotkrumen, Teilen, Store, Kurzlink /app/, 404, Bildnachweis),
// AP-W1 Teile A, B und F. Bildnachweis der Karten inhaltlich wie in der App 0.4.0 (bildnachweis_text in
// res/values/strings.xml und values-tr/strings.xml), in eigenen Worten.
// Türkisch eigenständig geschrieben, nicht übersetzt. Prüfstatus: muttersprachlich ungeprüft.

export const oberflaeche = {
  de: {
    sprache: 'Deutsch',
    spracheKurz: 'DE',
    sprung: 'Zum Inhalt springen',
    nav: {
      aria: 'Hauptnavigation',
      tarot: 'Tarot',
      kaffeesatz: 'Kaffeesatz',
      sogehts: 'So geht’s',
      fragen: 'Fragen',
      appLaden: 'App laden',
      menue: 'Menü',
      menueZu: 'Schließen',
      sprachwahl: 'Sprache wählen',
    },
    fuss: {
      spalteApp: 'App',
      spalteRecht: 'Rechtliches',
      spalteKontakt: 'Kontakt',
      sogehts: 'So geht’s',
      fragen: 'Fragen',
      ueber: 'Über Tarot Cup',
      datenschutz: 'Datenschutz',
      nutzungsbedingungen: 'Nutzungsbedingungen',
      offenlegung: 'Offenlegung',
      bildnachweis: 'Bildnachweis und Lizenzen',
      kontakt: 'E-Mail schreiben',
      sprache: 'Sprache',
      // Hinweis oben im Fuß, auf jeder Seite (AP-W2; vorher nur am Ende der Startseite).
      hinweis: 'Zur Unterhaltung. Keine Vorhersage und keine Beratung.',
      zeile: 'Tarot Cup · Zur Unterhaltung.',
    },
    krumen: { aria: 'Brotkrumen', start: 'Start' },
    inhalt: 'Inhalt',
    teilen: {
      knopf: 'Seite teilen',
      titel: 'Teilen',
      kopieren: 'Link kopieren',
      kopiert: 'Link kopiert',
      whatsapp: 'Per WhatsApp',
      email: 'Per E-Mail',
      emailText: 'Das könnte dich interessieren:',
    },
    store: {
      bald: 'Bald bei Google Play',
      ansehen: 'Bei Google Play ansehen',
      abzeichenAlt: 'Jetzt bei Google Play',
    },
    app: {
      metaTitel: 'Tarot Cup laden: App für Android',
      metaBeschreibung: 'Dieser Link führt dich zu Tarot Cup bei Google Play. Am Computer scannst du dafür den Code mit deinem Handy. Tarot Cup gibt es für Android.',
      titel: 'Tarot Cup für Android',
      text: 'Tarot Cup gibt es für Android bei Google Play. Bist du am Computer, scanne den Code mit deinem Handy.',
      qr: 'Mit dem Handy scannen',
      weiter: 'Weiter zu Google Play',
      bald: 'Tarot Cup kommt bald zu Google Play. Schau gern wieder vorbei.',
      iphone: 'Tarot Cup gibt es nur für Android.',
    },
    nichtGefunden: {
      titel: 'Seite nicht gefunden',
      text: 'Diese Seite gibt es nicht oder nicht mehr. Auf der Startseite geht es weiter.',
      start: 'Zur Startseite',
    },
    // Beschreibungen der Bilder (Alt-Text und aria-label), vorher fest in Titelbild, Tassenkarte und Auslegung (AP-SPR2).
    // {rand} usw.: Namen der Bereiche aus der Textdatei der Seite.
    bilder: {
      druck1909: 'Druck von 1909',
      auslegebild: 'Auslegebild',
      eineKarte: 'eine Karte',
      gegenueberKurz: 'gegenüber',
      tassenkarte: 'Tassenkarte von oben: {rand}, {mitte} und {boden}, links {gegenueber}, rechts die {henkelseite} mit dem Henkel, darunter die {untertasse}',
    },
    bildnachweis: {
      metaTitel: 'Bildnachweis und Lizenzen | Tarot Cup',
      metaBeschreibung: 'Hier steht, woher die Kartenbilder von 1909 in Tarot Cup und auf dieser Website stammen und unter welcher Lizenz die Schriften der Website stehen.',
      titel: 'Bildnachweis und Lizenzen',
      brotkrume: 'Bildnachweis',
      vorspann: 'Hier steht, woher die Kartenbilder kommen und welche Schriften diese Website verwendet.',
      karten: {
        titel: 'Kartenbilder von 1909',
        absaetze: [
          'Die Kartenbilder in der App und auf dieser Website hat Pamela Colman Smith gezeichnet. Sie sind 1909 erschienen und gemeinfrei.',
          'Grundlage sind Scans des Originaldrucks von Wikimedia Commons. In der App sind die Bilder nur auf den Bildteil zugeschnitten. Für diese Website sind sie verkleinert, auf ein einheitliches Format von 480 × 822 Pixeln zugeschnitten und als WebP gespeichert. Sonst sind sie unverändert.',
        ],
      },
      schriften: {
        titel: 'Schriften dieser Website',
        absaetze: [
          'Die Website verwendet zwei Schriften: Cormorant Garamond von Christian Thalmann und Inter von Rasmus Andersson. Beide stehen unter der SIL Open Font License, Version 1.1.',
          'Die Schriftdateien liegen auf dieser Website selbst und werden nicht von fremden Servern geladen.',
        ],
      },
      marken: 'Google Play und das Google Play-Logo sind Marken von Google LLC.',
    },
  },

  tr: {
    sprache: 'Türkçe',
    spracheKurz: 'TR',
    sprung: 'İçeriğe geç',
    nav: {
      aria: 'Ana menü',
      tarot: 'Tarot',
      kaffeesatz: 'Kahve falı',
      sogehts: 'Nasıl kullanılır',
      fragen: 'Sorular',
      appLaden: 'Uygulamayı indir',
      menue: 'Menü',
      menueZu: 'Kapat',
      sprachwahl: 'Dil seç',
    },
    fuss: {
      spalteApp: 'Uygulama',
      spalteRecht: 'Yasal bilgiler',
      spalteKontakt: 'İletişim',
      sogehts: 'Nasıl kullanılır',
      fragen: 'Sorular',
      ueber: 'Tarot Cup hakkında',
      datenschutz: 'Gizlilik',
      nutzungsbedingungen: 'Kullanım koşulları',
      offenlegung: 'Offenlegung (künye)',
      bildnachweis: 'Görsel kaynakları ve lisanslar',
      kontakt: 'E-posta gönder',
      sprache: 'Dil',
      hinweis: 'Eğlence amaçlıdır. Kehanet ya da danışmanlık değildir.',
      zeile: 'Tarot Cup · Eğlence amaçlıdır.',
    },
    krumen: { aria: 'Sayfa yolu', start: 'Ana sayfa' },
    inhalt: 'İçindekiler',
    teilen: {
      knopf: 'Sayfayı paylaş',
      titel: 'Paylaş',
      kopieren: 'Bağlantıyı kopyala',
      kopiert: 'Bağlantı kopyalandı',
      whatsapp: 'WhatsApp ile',
      email: 'E-posta ile',
      emailText: 'Bu sayfa ilgini çekebilir:',
    },
    store: {
      bald: 'Yakında Google Play’de',
      ansehen: 'Google Play’de incele',
      abzeichenAlt: 'Google Play’den indirin',
    },
    app: {
      metaTitel: 'Tarot Cup’ı indir: Android uygulaması',
      metaBeschreibung: 'Bu kısa bağlantı seni Google Play’deki Tarot Cup’a götürür. Bilgisayardaysan kodu telefonunla tarayabilirsin. Tarot Cup bir Android uygulaması.',
      titel: 'Android için Tarot Cup',
      text: 'Tarot Cup’ı Android için Google Play’de bulabilirsin. Bilgisayardaysan kodu telefonunla tara.',
      qr: 'Telefonunla tara',
      weiter: 'Google Play’e git',
      bald: 'Tarot Cup yakında Google Play’de olacak. Ara ara uğramayı unutma.',
      iphone: 'Tarot Cup yalnızca Android için var.',
    },
    nichtGefunden: {
      titel: 'Sayfa bulunamadı',
      text: 'Aradığın sayfa yok ya da artık burada değil. Ana sayfadan devam edebilirsin.',
      start: 'Ana sayfaya dön',
    },
    bilder: {
      druck1909: '1909 baskısı',
      auslegebild: 'Açılım düzeni',
      eineKarte: 'tek kart',
      gegenueberKurz: 'Karşı taraf',
      tassenkarte: 'Yukarıdan fincan haritası: {rand}, {mitte} ve {boden}; solda {gegenueber}, sağda {henkelseite} ve kulp, altta {untertasse}',
    },
    bildnachweis: {
      metaTitel: 'Görsel kaynakları ve lisanslar | Tarot Cup',
      metaBeschreibung: 'Tarot Cup’ta ve bu sitede kullanılan 1909 tarihli kart resimlerinin kaynağı ve sitedeki yazı tiplerinin hangi lisansla kullanıldığı bu sayfada anlatılıyor.',
      titel: 'Görsel kaynakları ve lisanslar',
      brotkrume: 'Görsel kaynakları',
      vorspann: 'Kart resimlerinin nereden geldiğini ve bu sitede hangi yazı tiplerinin kullanıldığını burada bulursun.',
      karten: {
        titel: '1909 tarihli kart resimleri',
        absaetze: [
          'Uygulamadaki ve bu sitedeki kart resimlerini Pamela Colman Smith çizmiştir. Resimler 1909’da yayımlanmıştır ve kamu malıdır.',
          'Kaynak olarak özgün baskının Wikimedia Commons’taki taramaları kullanıldı. Uygulamada resimler yalnızca resim kısmına göre kırpıldı. Bu sitede ise küçültüldü, 480 × 822 piksellik tek tip bir boyuta göre kırpıldı ve WebP biçiminde kaydedildi. Bunun dışında hiçbir değişiklik yapılmadı.',
        ],
      },
      schriften: {
        titel: 'Bu sitenin yazı tipleri',
        absaetze: [
          'Sitede iki yazı tipi kullanılıyor: Christian Thalmann’ın tasarladığı Cormorant Garamond ve Rasmus Andersson’un tasarladığı Inter. İkisi de SIL Open Font License 1.1 lisansıyla sunulur.',
          'Yazı tipi dosyaları bu sitenin içinde durur, başka sunuculardan yüklenmez.',
        ],
      },
      marken: 'Google Play ve Google Play logosu, Google LLC’nin ticari markalarıdır.',
    },
  },
};

// Übersetzungen (en, es seit AP-SPR2; bs, hr, sr, ro, pt, fr, id, hi seit AP-23): erzeugt mit tools/texte_einspielen.mjs aus deutung-unterlagen/uebersetzung/ (nicht von Hand).
import oberflaecheEn from './uebersetzt/oberflaeche_en.json' with { type: 'json' };
import oberflaecheEs from './uebersetzt/oberflaeche_es.json' with { type: 'json' };
import oberflaecheBs from './uebersetzt/oberflaeche_bs.json' with { type: 'json' };
import oberflaecheHr from './uebersetzt/oberflaeche_hr.json' with { type: 'json' };
import oberflaecheSr from './uebersetzt/oberflaeche_sr.json' with { type: 'json' };
import oberflaecheRo from './uebersetzt/oberflaeche_ro.json' with { type: 'json' };
import oberflaechePt from './uebersetzt/oberflaeche_pt.json' with { type: 'json' };
import oberflaecheFr from './uebersetzt/oberflaeche_fr.json' with { type: 'json' };
import oberflaecheId from './uebersetzt/oberflaeche_id.json' with { type: 'json' };
import oberflaecheHi from './uebersetzt/oberflaeche_hi.json' with { type: 'json' };
oberflaeche.en = oberflaecheEn;
oberflaeche.es = oberflaecheEs;
oberflaeche.bs = oberflaecheBs;
oberflaeche.hr = oberflaecheHr;
oberflaeche.sr = oberflaecheSr;
oberflaeche.ro = oberflaecheRo;
oberflaeche.pt = oberflaechePt;
oberflaeche.fr = oberflaecheFr;
oberflaeche.id = oberflaecheId;
oberflaeche.hi = oberflaecheHi;
