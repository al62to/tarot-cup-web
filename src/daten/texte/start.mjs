// Texte der Startseite (/ und /tr/), AP-W1 Teil B. Grundlage: Entwurf 7.1 (WebStart.dc.html) mit den Änderungen aus
// dem Auftrag; Kopf nach Entwurf 8.5. Jede Aussage über die App ist gegen den Code der Fassung 0.4.0 geprüft
// (deutung-unterlagen/arbeit/apw1/belege_start_fragen_ueber.md).
// Türkisch eigenständig geschrieben, nicht übersetzt. Prüfstatus: muttersprachlich ungeprüft.

export const start = {
  de: {
    metaTitel: 'Kaffeesatz lesen und Tarot legen per App | Tarot Cup',
    metaBeschreibung: 'Mit der Android-App Tarot Cup liest du Kaffeesatz selbst mit 80 Zeichen und legst Tarot mit 78 Karten, auf Deutsch und Türkisch und ohne Internet.',
    ogTitel: 'Kaffeesatz lesen. Tarot legen.',
    kopf: {
      zeile: 'Tarot Cup · App für Android',
      zeilen: ['Kaffeesatz selbst lesen.', 'Tarot in Ruhe legen.'],
      text: 'Wähle die Zeichen aus deiner Tasse, zeig auf der Tassenkarte, wo sie liegen, und lies, was sie bedeuten können. Oder lege Tarotkarten in Ruhe. Die App läuft ohne Internet und ohne Konto.',
      knopf: 'Bei Google Play ansehen',
      bald: 'Bald bei Google Play',
    },
    wasIst: {
      titel: 'Was ist Tarot Cup?',
      text: 'Tarot Cup ist eine App für Android, mit der du Tarotkarten legst und den Kaffeesatz in deiner Tasse selbst liest. Es gibt sie auf Deutsch und auf Türkisch. Sie ist für Menschen ab 16 Jahren gedacht und läuft ohne Internet und ohne Konto. Die Deutungen folgen alten Traditionen und sind zur Unterhaltung gedacht.',
    },
    koennen: {
      titel: 'Was die App kann',
      kaesten: [
        {
          titel: 'Kaffeesatz selbst lesen',
          text: '80 Zeichen wie Anker, Herz und Weg, mit Suche und Kategorien. Auf der Tassenkarte zeigst du, ob ein Zeichen am Rand, in der Mitte, am Boden oder auf der Untertasse liegt.',
        },
        {
          titel: 'Tarot mit 78 Karten',
          text: 'Tageskarte, Ja oder Nein, drei Karten und eine Legung zur Liebe. Jede Karte mit ihrer Bedeutung im Lexikon der App, aufrecht und umgekehrt.',
        },
        {
          titel: 'Mit Ruhe statt endlos',
          text: 'Jede Legung hat ihren Rhythmus, die Tageskarte täglich, die Liebe einmal pro Woche. Dazwischen ruhen die Karten.',
        },
      ],
    },
    tasse: {
      titel: 'So liest du deine Tasse',
      schritte: [
        'Denk an deine Frage und trink den Mokka aus. Stülp die Tasse auf die Untertasse und lass sie abkühlen. Deine Frage behältst du für dich, die App fragt nicht danach.',
        'Dreh die Tasse in Ruhe und such die Formen unter den 80 Zeichen.',
        'Zeig auf der Tassenkarte, wo jedes Zeichen liegt. Mit drei oder mehr Zeichen gibt es die volle Deutung.',
      ],
      link: { text: 'Mehr zum Kaffeesatzlesen', ziel: '/kaffeesatz-lesen/' },
    },
    vorteile: [
      { titel: 'Ohne Internet', text: 'Die App hat keine Erlaubnis, ins Internet zu gehen.' },
      { titel: 'Ohne Konto', text: 'In der App kein Anmelden und keine E-Mail-Adresse.' },
      { titel: 'Bleibt bei dir', text: 'Verlauf und Notizen speichert die App auf deinem Handy. Ich habe darauf keinen Zugriff.' },
    ],
    ratgeber: {
      titel: 'Tarot und Kaffeesatz verstehen',
      eintraege: [
        {
          titel: 'Wie legt man Tarot?',
          text: 'Die 78 Karten, aufrecht und umgekehrt, die Legungen der App und das Ritual Schritt für Schritt.',
          link: 'Zum Ratgeber Tarot',
          ziel: '/tarot/',
        },
        {
          titel: 'Wie liest man Kaffeesatz?',
          text: 'Vom Mokka bis zur gelesenen Tasse: das Ritual, die Bereiche der Tasse und häufige Zeichen.',
          link: 'Zum Ratgeber Kaffeesatz',
          ziel: '/kaffeesatz-lesen/',
        },
      ],
    },
    fotos: {
      titel: 'So sieht Tarot Cup aus',
      alt: {
        '01_start_tageskarte': 'Startseite der App mit der aufgedeckten Tageskarte „Der Magier“, darunter die Kacheln „Tarot legen“ und „Kaffeesatz lesen“',
        '03_deutung_drei_karten': 'Legung „Drei Karten“ mit „Die Herrscherin“, „Das Rad des Schicksals“ und „Königin der Kelche“ für Vergangenheit, Gegenwart und Zukunft, darunter der Anfang der Deutung',
        '05_kaffee_tasse': 'Tassenkarte von oben mit Rand, Mitte, Boden, Henkelseite und gegenüber, drei gesetzten Zeichen und der Untertasse darunter',
      },
    },
    fragen: {
      titel: 'Häufige Fragen',
      ids: ['zukunft', 'foto-der-tasse', 'tuerkisch', 'fragen-gespeichert'],
      alle: 'Alle Fragen',
    },
    hinweis: 'Zur Unterhaltung. Keine Vorhersage und keine Beratung.',
  },

  tr: {
    metaTitel: 'Kahve falı ve tarot uygulaması | Tarot Cup',
    metaBeschreibung: 'Tarot Cup bir Android uygulaması: 80 işaretle kahve falını kendin yorumla, 78 kartla tarot aç. Türkçe ve Almanca, internetsiz ve üyeliksiz.',
    ogTitel: 'Kahve falı ve tarot, kendi elinle',
    kopf: {
      zeile: 'Tarot Cup · Android uygulaması',
      zeilen: ['Fincanını kendin yorumla.', 'Tarot kartlarını acele etmeden aç.'],
      text: 'Fincanında gördüğün işaretleri seç, fincan haritasında nerede durduklarını göster ve neler anlatabileceklerini oku. Dilersen tarot kartlarını sakin sakin aç. Uygulama internet ve üyelik olmadan çalışır.',
      knopf: 'Google Play’de incele',
      bald: 'Yakında Google Play’de',
    },
    wasIst: {
      titel: 'Tarot Cup nedir?',
      text: 'Tarot Cup, tarot kartı açmak ve fincanındaki telveyi kendin yorumlamak için hazırlanmış bir Android uygulaması. 16 yaşını doldurmuş, Türkçe ya da Almanca konuşan herkes için; internet ve üyelik gerektirmez. Yorumlar eski geleneklere dayanır ve eğlence amaçlıdır.',
    },
    koennen: {
      titel: 'Uygulamayla neler yapabilirsin?',
      kaesten: [
        {
          titel: 'Kahve falını kendin yorumla',
          text: 'Çapa, kalp, yol gibi 80 işaret; arama ve kategorilerle kolayca bulunur. Fincan haritasında her işaretin ağızda mı, ortada mı, dipte mi yoksa tabakta mı durduğunu gösterirsin.',
        },
        {
          titel: '78 kartlık tarot',
          text: 'Günün Kartı, “Evet mi, Hayır mı”, Üç Kart ve aşk için bir açılım. Uygulamanın sözlüğünde her kartın düz ve ters anlamı yer alır.',
        },
        {
          titel: 'Her açılımın kendi zamanı',
          text: 'Günün Kartı her gün, Aşk açılımı haftada bir açılır. Aradaki günlerde kartlar dinlenir.',
        },
      ],
    },
    tasse: {
      titel: 'Fincanına kendin nasıl bakarsın?',
      schritte: [
        'Niyetini tut ve kahveni iç. Fincanı tabağın üzerine kapat, soğumasını bekle. Niyetin sende kalır, uygulama onu sormaz.',
        'Fincanı acele etmeden çevir, gördüğün şekilleri 80 işaret arasında ara.',
        'Fincan haritasında her işaretin yerini göster. Üç ya da daha fazla işaretle tam yorum açılır.',
      ],
      link: { text: 'Kahve falı hakkında daha fazlası', ziel: '/tr/kahve-fali/' },
    },
    vorteile: [
      { titel: 'İnternetsiz', text: 'Uygulamanın internete bağlanma izni yok.' },
      { titel: 'Üyeliksiz', text: 'Uygulamada kayıt yok, e-posta adresi de gerekmez.' },
      { titel: 'Sende kalır', text: 'Geçmişini ve notlarını uygulama telefonunda saklar. Benim bunlara erişimim yok.' },
    ],
    ratgeber: {
      titel: 'Tarotu ve kahve falını yakından tanı',
      eintraege: [
        {
          titel: 'Tarot nasıl açılır?',
          text: '78 kart, düz ve ters anlamlar, uygulamadaki açılımlar ve ritüel adım adım.',
          link: 'Tarot rehberine git',
          ziel: '/tr/tarot/',
        },
        {
          titel: 'Kahve falına nasıl bakılır?',
          text: 'Kahvenin pişirilmesinden fincanın okunmasına kadar ritüel, fincanın bölgeleri ve sık görülen işaretler.',
          link: 'Kahve falı rehberine git',
          ziel: '/tr/kahve-fali/',
        },
      ],
    },
    fotos: {
      titel: 'Uygulamadan görüntüler',
      alt: {
        '01_start_tageskarte': 'Uygulamanın ana sayfası: açılmış Günün Kartı “Büyücü”, altında “Tarot aç” ve “Kahve falına bak” kutuları',
        '03_deutung_drei_karten': '“Üç Kart” açılımı: Geçmiş için “İmparatoriçe”, Şimdi için “Kader Çarkı”, Gelecek için “Kadeh Kraliçesi”, altında yorumun başlangıcı',
        '05_kaffee_tasse': 'Yukarıdan görülen fincan haritası: ağız, orta, dip, kulp tarafı ve karşı taraf; üç işaret yerleştirilmiş, altında tabak',
      },
    },
    fragen: {
      titel: 'Sık sorulan sorular',
      ids: ['zukunft', 'foto-der-tasse', 'tuerkisch', 'fragen-gespeichert'],
      alle: 'Tüm sorular',
    },
    hinweis: 'Eğlence amaçlıdır. Kehanet ya da danışmanlık değildir.',
  },
};
