// Texte der Startseite (/ und /tr/). AP-W1 Teil B (Entwurf 7.1 und 8.5), neu gestaltet mit AP-W2 nach Entwurf 9.1
// (deutung-unterlagen/design/reihe9/). Jede Aussage über die App ist gegen den Code der Fassung 0.4.0 geprüft
// (deutung-unterlagen/arbeit/apw1/belege_start_fragen_ueber.md, für die Texte aus AP-W2 arbeit/apw2/belege_start.md).
// Überschriften dürfen eine Hervorhebung tragen: *Wort* steht kursiv in Gold oder Kupfer (src/daten/auszeichnung.mjs).
// Türkisch eigenständig geschrieben, nicht übersetzt. Prüfstatus: muttersprachlich ungeprüft.

export const start = {
  de: {
    metaTitel: 'Kaffeesatz lesen und Tarot legen per App | Tarot Cup',
    metaBeschreibung: 'Mit der Android-App Tarot Cup liest du Kaffeesatz selbst mit 80 Zeichen und legst Tarot mit 78 Karten, auf Deutsch und Türkisch und ohne Internet.',
    ogTitel: 'Kaffeesatz lesen. Tarot legen.',
    kopf: {
      zeile: 'Tarot Cup · App für Android',
      zeilen: ['Kaffeesatz *selbst* lesen.', 'Tarot *in Ruhe* legen.'],
      text: 'Wähle die Zeichen aus deiner Tasse, zeig auf der Tassenkarte, wo sie liegen, und lies, was sie bedeuten können. Oder lege Tarotkarten in Ruhe. Die App läuft ohne Internet und ohne Konto.',
      knopf: 'Bei Google Play ansehen',
      bald: 'Bald bei Google Play',
      // Zweitknopf zur Anleitung (Ziel: Seite „sogehts“ in src/daten/seiten.mjs).
      anleitung: 'So geht’s',
      // Karte zum Umdrehen. {name}: Name der Karte aus den Daten der App.
      karte: {
        tipp: 'Tipp die Karte an und dreh sie um.',
        satz: 'Ihre Bedeutung, aufrecht und umgekehrt, steht im Lexikon der App.',
        umdrehen: 'Karte umdrehen',
        zurueck: 'Karte „{name}“ wieder umdrehen',
      },
    },
    // Zahlenband unter dem Titelbild.
    zahlen: {
      aria: 'Tarot Cup in Zahlen',
      liste: [
        { zahl: '78', text: 'Tarotkarten, im Lexikon aufrecht und umgekehrt' },
        { zahl: '80', text: 'Zeichen für den Kaffeesatz, mit Suche und Kategorien' },
        { zahl: '2', text: 'Sprachen, Deutsch und Türkisch' },
        { zahl: '0', text: 'Konten, kein Internet nötig' },
      ],
    },
    wasIst: {
      titel: 'Was ist Tarot Cup?',
      text: 'Tarot Cup ist eine App für Android, mit der du Tarotkarten legst und den Kaffeesatz in deiner Tasse selbst liest. Es gibt sie auf Deutsch und auf Türkisch. Sie ist für Menschen ab 16 Jahren gedacht und läuft ohne Internet und ohne Konto. Die Deutungen folgen alten Traditionen und sind zur Unterhaltung gedacht.',
    },
    tasse: {
      zeile: 'Das Ritual',
      titel: 'So liest du *deine Tasse*',
      schritte: [
        'Denk an deine Frage und trink den Mokka aus. Stülp die Tasse auf die Untertasse und lass sie abkühlen. Deine Frage behältst du für dich, die App fragt nicht danach.',
        'Dreh die Tasse in Ruhe und such die Formen unter den 80 Zeichen.',
        'Zeig auf der Tassenkarte, wo jedes Zeichen liegt. Mit drei oder mehr Zeichen gibt es die volle Deutung.',
      ],
      link: { text: 'Mehr zum Kaffeesatzlesen', ziel: '/kaffeesatz-lesen/' },
    },
    // Kachel „Die Tassenkarte“ zum Antippen. Namen und Bedeutungen der Bereiche wie in der App 0.4.0
    // (arbeit/apw2/belege_start.md, Abschnitt „Bereiche der Tassenkarte“).
    tassenkarte: {
      titel: 'Die Tassenkarte',
      hinweis: 'Wähl einen Bereich',
      gruppe: 'Bereich der Tasse wählen',
      bereiche: [
        { bereich: 'rand', name: 'Rand', bedeutung: 'nahe Zeit' },
        { bereich: 'mitte', name: 'Mitte', bedeutung: 'jetzt' },
        { bereich: 'boden', name: 'Boden', bedeutung: 'fernere Zeit' },
        { bereich: 'henkelseite', name: 'Henkelseite', bedeutung: 'du, dein Zuhause' },
        { bereich: 'gegenueber', name: 'gegenüber', bedeutung: 'draußen' },
        { bereich: 'untertasse', name: 'Untertasse', bedeutung: 'dein Wunsch' },
      ],
    },
    // Schaukasten: ein Handy, drei Knöpfe. "foto": Name des Bildschirmfotos (src/daten/fotos.mjs, FOTOS_START).
    schaukasten: {
      titel: 'So sieht *Tarot Cup* aus',
      gruppe: 'Bildschirm wählen',
      eintraege: [
        { foto: '01_start_tageskarte', titel: 'Tageskarte', text: 'Eine Karte für den Tag, jeden Tag neu.' },
        { foto: '03_deutung_drei_karten', titel: 'Drei Karten', text: 'Vergangenheit, Gegenwart und Zukunft mit einer Deutung, die alle drei verbindet.' },
        { foto: '05_kaffee_tasse', titel: 'Tassenkarte', text: 'Zeig, wo deine Zeichen in der Tasse liegen.' },
      ],
    },
    // Kachelraster „Was die App kann“.
    koennen: {
      titel: 'Was die App *kann*',
      ruhe: {
        titel: 'Mit Ruhe statt endlos',
        text: 'Jede Legung hat ihren Rhythmus. Dazwischen ruhen die Karten.',
        pillen: [
          { name: 'Tageskarte', takt: 'täglich' },
          { name: 'Ja oder Nein', takt: 'täglich' },
          { name: 'Drei Karten', takt: 'alle 3 Tage' },
          { name: 'Selbst lesen', takt: 'alle 3 Tage' },
          { name: 'Liebe', takt: 'wöchentlich' },
        ],
      },
      sprachen: { gross: 'DE / TR', titel: 'Deutsch und Türkisch', text: 'Die ganze App in beiden Sprachen.' },
    },
    // Texte unverändert aus AP-W1; "id" ordnet sie den Kacheln zu.
    vorteile: [
      { id: 'bleibt', titel: 'Bleibt bei dir', text: 'Verlauf und Notizen speichert die App auf deinem Handy. Ich habe darauf keinen Zugriff.' },
      { id: 'internet', titel: 'Ohne Internet', text: 'Die App hat keine Erlaubnis, ins Internet zu gehen.' },
      { id: 'konto', titel: 'Ohne Konto', text: 'In der App kein Anmelden und keine E-Mail-Adresse.' },
    ],
    ratgeber: {
      titel: 'Tarot und Kaffeesatz *verstehen*',
      zeile: 'Ratgeber',
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
      alt: {
        '01_start_tageskarte': 'Startseite der App mit der aufgedeckten Tageskarte „Der Magier“, darunter die Kacheln „Tarot legen“ und „Kaffeesatz lesen“',
        '03_deutung_drei_karten': 'Legung „Drei Karten“ mit „Die Herrscherin“, „Das Rad des Schicksals“ und „Königin der Kelche“ für Vergangenheit, Gegenwart und Zukunft, darunter der Anfang der Deutung',
        '05_kaffee_tasse': 'Tassenkarte von oben mit Rand, Mitte, Boden, Henkelseite und gegenüber, drei gesetzten Zeichen und der Untertasse darunter',
      },
    },
    fragen: {
      titel: 'Häufige *Fragen*',
      ids: ['zukunft', 'foto-der-tasse', 'tuerkisch', 'fragen-gespeichert'],
      alle: 'Alle Fragen',
    },
  },

  tr: {
    metaTitel: 'Kahve falı ve tarot uygulaması | Tarot Cup',
    metaBeschreibung: 'Tarot Cup bir Android uygulaması: 80 işaretle kahve falını kendin yorumla, 78 kartla tarot aç. Türkçe ve Almanca, internetsiz ve üyeliksiz.',
    ogTitel: 'Kahve falı ve tarot, kendi elinle',
    kopf: {
      zeile: 'Tarot Cup · Android uygulaması',
      zeilen: ['Fincanını *kendin* yorumla.', 'Tarot kartlarını *acele etmeden* aç.'],
      text: 'Fincanında gördüğün işaretleri seç, fincan haritasında nerede durduklarını göster ve neler anlatabileceklerini oku. Dilersen tarot kartlarını sakin sakin aç. Uygulama internet ve üyelik olmadan çalışır.',
      knopf: 'Google Play’de incele',
      bald: 'Yakında Google Play’de',
      anleitung: 'Nasıl kullanılır?',
      karte: {
        tipp: 'Çevirmek için karta dokun.',
        satz: 'Düz ve ters anlamını uygulamadaki Sözlük’te bulabilirsin.',
        umdrehen: 'Kartı çevir',
        zurueck: '{name} kartını yeniden kapat',
      },
    },
    zahlen: {
      aria: 'Rakamlarla Tarot Cup',
      liste: [
        { zahl: '78', text: 'tarot kartı, sözlükte düz ve ters anlamıyla' },
        { zahl: '80', text: 'kahve falı işareti, arama ve kategorilerle' },
        { zahl: '2', text: 'dil: Türkçe ve Almanca' },
        { zahl: '0', text: 'üyelik adımı, internet de gerekmez' },
      ],
    },
    wasIst: {
      titel: 'Tarot Cup nedir?',
      text: 'Tarot Cup, tarot kartı açmak ve fincanındaki telveyi kendin yorumlamak için hazırlanmış bir Android uygulaması. 16 yaşını doldurmuş, Türkçe ya da Almanca konuşan herkes için; internet ve üyelik gerektirmez. Yorumlar eski geleneklere dayanır ve eğlence amaçlıdır.',
    },
    tasse: {
      zeile: 'Ritüel',
      titel: '*Fincanına* kendin nasıl bakarsın?',
      schritte: [
        'Niyetini tut ve kahveni iç. Fincanı tabağın üzerine kapat, soğumasını bekle. Niyetin sende kalır, uygulama onu sormaz.',
        'Fincanı acele etmeden çevir, gördüğün şekilleri 80 işaret arasında ara.',
        'Fincan haritasında her işaretin yerini göster. Üç ya da daha fazla işaretle tam yorum açılır.',
      ],
      link: { text: 'Kahve falı hakkında daha fazlası', ziel: '/tr/kahve-fali/' },
    },
    tassenkarte: {
      titel: 'Fincan haritası',
      hinweis: 'Bir bölge seç',
      gruppe: 'Fincanın bir bölgesini seç',
      bereiche: [
        { bereich: 'rand', name: 'Ağız', bedeutung: 'yakın zaman' },
        { bereich: 'mitte', name: 'Orta', bedeutung: 'şimdi' },
        { bereich: 'boden', name: 'Dip', bedeutung: 'uzak zaman' },
        { bereich: 'henkelseite', name: 'Kulp tarafı', bedeutung: 'sen, evin' },
        { bereich: 'gegenueber', name: 'Karşı taraf', bedeutung: 'dışarısı' },
        { bereich: 'untertasse', name: 'Tabak', bedeutung: 'dileğin' },
      ],
    },
    schaukasten: {
      titel: '*Tarot Cup*’tan görüntüler',
      gruppe: 'Ekran seç',
      eintraege: [
        { foto: '01_start_tageskarte', titel: 'Günün Kartı', text: 'Gün için tek bir kart, her gün yenisi.' },
        { foto: '03_deutung_drei_karten', titel: 'Üç Kart', text: 'Geçmiş, şimdi ve gelecek için üç kart ve üçünü birbirine bağlayan bir yorum.' },
        { foto: '05_kaffee_tasse', titel: 'Fincan haritası', text: 'İşaretlerin fincanın neresinde durduğunu göster.' },
      ],
    },
    koennen: {
      titel: 'Uygulamayla *neler* yapabilirsin?',
      ruhe: {
        titel: 'Her şeyin bir vakti var',
        text: 'Her açılımın kendi ritmi var. Aradaki günlerde kartlar dinlenir.',
        pillen: [
          { name: 'Günün Kartı', takt: 'her gün' },
          { name: 'Evet mi, Hayır mı', takt: 'her gün' },
          { name: 'Üç Kart', takt: 'üç günde bir' },
          { name: 'Kendin yorumla', takt: 'üç günde bir' },
          { name: 'Aşk', takt: 'haftada bir' },
        ],
      },
      sprachen: { gross: 'TR / DE', titel: 'Türkçe ve Almanca', text: 'Uygulamanın tamamı iki dilde.' },
    },
    vorteile: [
      { id: 'bleibt', titel: 'Sende kalır', text: 'Geçmişini ve notlarını uygulama telefonunda saklar. Benim bunlara erişimim yok.' },
      { id: 'internet', titel: 'İnternetsiz', text: 'Uygulamanın internete bağlanma izni yok.' },
      { id: 'konto', titel: 'Üyeliksiz', text: 'Uygulamada kayıt yok, e-posta adresi de gerekmez.' },
    ],
    ratgeber: {
      titel: 'Tarotu ve kahve falını *yakından* tanı',
      zeile: 'Rehber',
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
      alt: {
        '01_start_tageskarte': 'Uygulamanın ana sayfası: açılmış Günün Kartı “Büyücü”, altında “Tarot aç” ve “Kahve falına bak” kutuları',
        '03_deutung_drei_karten': '“Üç Kart” açılımı: Geçmiş için “İmparatoriçe”, Şimdi için “Kader Çarkı”, Gelecek için “Kadeh Kraliçesi”, altında yorumun başlangıcı',
        '05_kaffee_tasse': 'Yukarıdan görülen fincan haritası: ağız, orta, dip, kulp tarafı ve karşı taraf; üç işaret yerleştirilmiş, altında tabak',
      },
    },
    fragen: {
      titel: 'Sık sorulan *sorular*',
      ids: ['zukunft', 'foto-der-tasse', 'tuerkisch', 'fragen-gespeichert'],
      alle: 'Tüm sorular',
    },
  },
};
