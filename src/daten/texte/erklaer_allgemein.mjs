// Erklärseiten Allgemein (AP-25). Deutsch und Türkisch eigenständig; Türkisch muttersprachlich ungeprüft.
// Seite 20 (deutung): Aussagen zur App belegt mit Datenschutzerklärung 1.7 und Nutzungsbedingungen 1.3 (Stand 17.11.2026),
// Einzelnachweise in deutung-unterlagen/inhalte/web/quellen_erklaerseiten.md, Abschnitt „Nr. 20“; Faktenprüfung in
// deutung-unterlagen/arbeit/ap25/fakten_20.md eingearbeitet.
export const erklaerAllgemein = {
  de: {
    deutung: {
      metaTitel: 'Was eine Deutung kann und wie die App deutet | Tarot Cup',
      metaBeschreibung: 'Was eine Deutung in Tarot Cup kann und was nicht: feste Grenzen, wie die automatische Deutung entsteht, deine Zustimmung und Hilfe in einer Notlage.',
      titel: 'Was eine Deutung kann und was nicht',
      brotkrume: 'Was eine Deutung kann',
      kurzantwort: [
        'Eine Deutung in Tarot Cup ist zur Unterhaltung da und ein Anstoß zum Nachdenken, keine Vorhersage und keine Beratung; sie sagt nicht voraus, ob jemand krank oder schwanger wird oder stirbt, und gibt keine Tipps zu Geld oder Glücksspiel. Die automatische Deutung schreibt ein Programm, nur mit deiner Zustimmung und derzeit nur als Geschenk. Klingt dein Traum oder deine Frage dabei nach einer echten Notlage, bekommst du statt einer Deutung einen Hinweis, wo du Hilfe findest.',
      ],
      inhaltTitel: 'Inhalt',
      abschnitte: [
        {
          kennung: 'was-eine-deutung-ist',
          titel: 'Was ist eine Deutung, und was ist sie nicht?',
          absaetze: [
            'Eine Deutung erzählt, was die Tradition in einer Tarotkarte, einem Zeichen im Kaffeesatz oder einem Traumbild sieht, und lädt dich ein, das mit deinem eigenen Leben zu vergleichen. Sie spricht in Möglichkeiten, nicht in Gewissheiten.',
            'Tarot Cup ist zur Unterhaltung da. Eine Deutung ist keine Vorhersage, keine Tatsache und keine Beratung.',
            'Triff wichtige Entscheidungen darum nicht wegen einer Deutung. Bei Fragen zu Gesundheit, seelischem Befinden, Recht oder Geld helfen Fachleute und Menschen, denen du vertraust.',
          ],
        },
        {
          kennung: 'feste-grenzen',
          titel: 'Welche Grenzen gelten für jede Deutung?',
          absaetze: [
            'Für die Texte der App gelten feste Grenzen, auch auf ausdrücklichen Wunsch. Eine Deutung sagt nicht voraus, ob du oder andere krank oder schwanger werden oder sterben, auch nicht in Andeutungen; ein Traumbild von Krankheit oder Tod deutet sie behutsam als inneres Bild. Sie nennt keine Geldbeträge, Glückszahlen oder Tipps für Lotto, Wetten und Geldanlagen und sagt nicht voraus, wie ein Verfahren vor Gericht oder bei einer Behörde ausgeht.',
            'Sie urteilt auch nicht über Menschen: Sie behauptet nicht, dass jemand untreu ist, lügt oder an einem Streit schuld ist, warnt nicht vor Flüchen, dem bösen Blick oder Neidern und fordert dich nie zu einer Trennung, einer Kündigung oder einem Kontaktabbruch auf. Höchstens lädt sie zu einem ruhigen Gespräch ein; die Entscheidung bleibt bei dir.',
            'Auch düstere Karten deutet die App behutsam. *Der Tod* steht in Tarot Cup für Wandel und Abschluss, nicht für ein Sterben. Mehr über die Karten erzählt der [Ratgeber Tarot](/tarot/).',
          ],
        },
        {
          kennung: 'wie-deutungen-entstehen',
          titel: 'Wie entstehen die Deutungen in der App?',
          absaetze: [
            'Die normalen Deutungen zu Tarot, Kaffeesatz und Traum setzt die App auf deinem Handy nach festen Regeln aus fertigen Texten zusammen, die den überlieferten Bedeutungen folgen. Bei Tarot und Kaffeesatz fragt sie auch nicht nach deiner Frage: Du denkst sie dir still, wie es die Tradition kennt.',
            'Bei der automatischen Deutung schreibst du deinen Traum mit eigenen Worten auf, oder du ziehst Karten und kannst ihnen eine eigene Frage stellen. Daraus schreibt ein Programm automatisch eine kurze Deutung, ohne dass ein Mensch sie vorher liest. Sie trägt den Vermerk „automatisch erstellt“.',
            'Die Grenzen von oben stehen auch in den festen Vorgaben für das Programm. Der Server von Tarot Cup prüft jede Antwort und kann sie neu anfordern oder durch einen festen Text ersetzen, aber nicht sicherstellen, dass jede automatische Deutung alle Grenzen einhält. Fragst du etwa, ob du krank bist, ist die automatische Deutung so angelegt, dass sie zuerst in einem Satz sagt, dass sie das nicht beantworten kann und eine Ärztin oder ein Arzt die richtige Stelle ist, und dann allgemein deutet.',
            'Trotzdem kann ein solcher Text unpassend sein, Dinge behaupten, die nicht stimmen, oder deine Frage missverstehen. Verlass dich nicht auf Aussagen darin, ohne sie selbst zu prüfen, und tippe gleich unter der Deutung auf „Melden“, wenn sie dir verletzend, unpassend oder falsch vorkommt.',
          ],
        },
        {
          kennung: 'zustimmung-und-daten',
          titel: 'Was geschieht mit deinem Traum oder deiner Frage?',
          absaetze: [
            'Tippst du zum ersten Mal auf „Deuten lassen“, bittet dich die App um deine ausdrückliche Zustimmung, denn ein Traum oder eine Frage kann sehr Persönliches enthalten, etwa zu Gesundheit, Glauben oder Intimem. Ohne Zustimmung sendet die App nichts für die automatische Deutung.',
            'Mit deiner Zustimmung gehen dein Traum oder deine Karten und, wenn du eine stellst, deine Frage für diese eine Deutung an den Server von Tarot Cup in Deutschland und an einen Dienstleister außerhalb der EU, etwa in den USA, bei dem das Programm die Deutung schreibt. Der Server von Tarot Cup speichert weder deinen Text noch die Deutung. Meldest du eine Deutung, speichert er ohne Kennung nur ihren Text mit Art, Sprache, Land und Datum, derzeit 90 Tage lang. Der Dienstleister löscht deine Angaben derzeit in der Regel nach spätestens 30 Tagen und nutzt sie nicht zum Trainieren.',
            'Außerdem schickt die App unter anderem die Sprache der App und das Land deines Handys als Kürzel aus zwei Buchstaben mit. Das Land braucht es, damit ein Hilfetext passende Stellen nennen kann; eine Standortberechtigung braucht die App dafür nicht. An den Server von Tarot Cup gehen auch eine zufällige Kennung dieser Installation und ein Nachweis von Google Play; die Kennung bekommt der Dienstleister nicht. Alles Weitere, auch die Ausnahmen, steht in der [Datenschutzerklärung](/datenschutz/).',
            'In deinen Verlauf kommt eine automatische Deutung nur, wenn du auf „Merken“ tippst, und auch dann ohne deinen Traum und ohne deine Frage. Namen, Adressen oder Telefonnummern anderer Menschen lässt du am besten weg.',
          ],
        },
        {
          kennung: 'hilfe-statt-deutung',
          titel: 'Was passiert, wenn dein Text nach einer Notlage klingt?',
          absaetze: [
            'Das gilt nur für die automatische Deutung, denn nur dort schreibst du selbst etwas. Bevor dein Text an den Dienstleister geht, prüft der Server von Tarot Cup ihn mit Listen von Wörtern darauf, ob er nach einer Krise oder nach Gefahr in deinem echten Leben klingt, etwa nach Gedanken an Selbstverletzung oder nach Gewalt, die dir wirklich geschieht. Schlägt die Prüfung an, geht dein Text nicht weiter, und du bekommst statt einer Deutung einen festen Hinweis, wo du Hilfe findest. Erkennt erst das Programm eine solche Lage, verwirft der Server dessen Antwort und schickt ebenfalls nur diesen Hinweis.',
            'Ein Traum von Tod oder Gewalt allein ist noch keine Notlage, er bekommt eine normale, behutsame Deutung. Die Prüfung erkennt nicht jede Notlage, und der Hinweis ersetzt keinen Notruf: Bist du oder ist jemand anderes in Gefahr, wende dich an den Notruf deines Landes.',
          ],
        },
        {
          kennung: 'automatische-deutung-als-geschenk',
          titel: 'Wie bekommst du eine automatische Deutung?',
          absaetze: [
            'Eine automatische Deutung bekommst du derzeit nur als Geschenk. Deine erste ist ein Willkommensgeschenk, wenn du noch kein anderes Geschenk dafür hast oder hattest; das Willkommensgeschenk gibt es einmal je Gerät. Weitere bekommst du über Teilen und Einladen. Beim Teilen gilt derzeit: Teilst du an drei verschiedenen Tagen innerhalb von sieben Tagen etwas aus der App und wurde in dieser Zeit mindestens einer deiner Links geöffnet, bekommst du eine. Es zählen nur Links mit Code, nicht solche, die du „ohne Code“ teilst. Lädst du jemanden ein und nutzt diese Person Tarot Cup an so vielen Tagen, wie die App es angibt, bekommt ihr beide eine.',
            'Höchstens eine automatische Deutung gibt es derzeit in sieben Tagen je Gerät, das Willkommensgeschenk zählt dabei mit. Ob eine offen ist, entscheidet der Server von Tarot Cup, dafür braucht die App Internet. Was gerade gilt, zeigt dir die App. Diese Regeln können sich jederzeit ändern; einen Anspruch auf ein Geschenk gibt es nicht ([Nutzungsbedingungen](/nutzungsbedingungen/)).',
          ],
        },
      ],
      fragenTitel: 'Häufige Fragen',
      fragen: [
        {
          frage: 'Liest ein Mensch meinen Traum oder meine Frage?',
          antwort: ['Normalerweise nicht. Nur wenn die Sicherheitssysteme des Dienstleisters eine Anfrage markieren, kann er sie prüfen. Meldest du eine Deutung, wird ihr Text gelesen, um Fehler zu beheben; dein Traum und deine Frage werden dabei nicht mitgeschickt.'],
        },
        {
          frage: 'Kann ich meine Zustimmung zurücknehmen?',
          antwort: ['Ja, jederzeit in den Einstellungen unter „Automatische Deutung“; danach sendet die App nichts mehr dafür, bis du wieder zustimmst. „Meine Daten am Server löschen“ löscht sofort, was der Server zu deinem Gerät gespeichert hat; in seinen Sicherungen liegt es derzeit noch bis zu 14 Tage, und offene Geschenke gehen verloren.'],
        },
        {
          frage: 'Funktioniert die App auch ohne automatische Deutung?',
          antwort: ['Ja. Tarot, Kaffeesatz, Traumdeutung mit Symbolen, Lexikon und Verlauf gehen ohne Zustimmung und ohne Internet. Internet brauchen die automatische Deutung, die Geschenke vom Server und das Einladen, dazu der Hinweis auf neue Versionen und das Bewerten über Google Play.'],
        },
      ],
      app: {
        titel: 'In der App',
        text: ['In Tarot Cup für Android liest du Karten, Kaffeesatz und Träume ohne Konto. Eine automatische Deutung kann derzeit als Geschenk dazukommen: die erste als Willkommensgeschenk, weitere, wenn du teilst oder jemanden einlädst.'],
      },
      quellenTitel: 'Quellen',
      quellen: [
        { angabe: 'Tarot Cup: Datenschutzerklärung, Version 1.7, Stand 17.11.2026, besonders Abschnitte 1, 3, 4, 6, 10, 15 und 17. tarot-cup.com, 2026.', url: 'https://tarot-cup.com/datenschutz/' },
        { angabe: 'Tarot Cup: Nutzungsbedingungen, Version 1.3, Stand 17.11.2026, besonders Abschnitte 3, 5, 6, 11 und 14. tarot-cup.com, 2026.', url: 'https://tarot-cup.com/nutzungsbedingungen/' },
      ],
    },
  },
  tr: {
    deutung: {
      metaTitel: 'Bir yorum ne yapabilir, uygulama nasıl yorumlar | Tarot Cup',
      metaBeschreibung: 'Tarot Cup’ta bir yorum neler yapabilir, neler yapamaz: değişmeyen sınırlar, otomatik yorumun nasıl oluştuğu, rızan ve bir kriz anında yardım.',
      titel: 'Bir yorumun yapabildikleri ve yapamadıkları',
      brotkrume: 'Bir yorumun yapabildikleri',
      kurzantwort: [
        'Tarot Cup’ta bir yorum eğlence amaçlıdır ve üzerine düşünmen için bir çıkış noktasıdır; bir öngörü ya da danışmanlık değildir. Birinin hastalanacağını, hamile kalacağını ya da öleceğini öngörmez, para konusunda ya da şans oyunları için tüyo vermez. Otomatik yorumu, yalnızca senin rızanla, bir program yazar; bu yorum şu an yalnızca hediye olarak gelir. Bu sırada rüyan ya da sorun gerçek bir kriz ya da tehlike düşündürürse, yorum yerine nereden yardım bulabileceğini gösteren bir bilgi alırsın.',
      ],
      inhaltTitel: 'İçindekiler',
      abschnitte: [
        {
          kennung: 'yorum-nedir',
          titel: 'Yorum nedir, ne değildir?',
          absaetze: [
            'Bir yorum, geleneğin bir tarot kartında, kahve telvesindeki bir işarette ya da bir rüya imgesinde ne gördüğünü anlatır ve seni bunu kendi hayatınla karşılaştırmaya davet eder. Kesinliklerle değil, olasılıklarla konuşur.',
            'Tarot Cup eğlence amaçlıdır. Bir yorum ne bir öngörüdür ne bir gerçektir ne de bir danışmanlıktır.',
            'Bu yüzden önemli kararlarını bir yoruma dayandırma. Sağlık, ruhsal durum, hukuk ya da para konusundaki sorularda sana uzmanlar ve güvendiğin insanlar yardımcı olur.',
          ],
        },
        {
          kennung: 'degismeyen-sinirlar',
          titel: 'Her yorum için hangi sınırlar geçerli?',
          absaetze: [
            'Uygulamanın metinleri için, açıkça istesen bile değişmeyen sınırlar vardır. Bir yorum, senin ya da başkalarının hastalanacağını, hamile kalacağını ya da öleceğini üstü kapalı biçimde bile öngörmez. Hastalık ya da ölümle ilgili bir rüya imgesini özenle, içsel bir imge olarak yorumlar. Para miktarı ya da şanslı sayı söylemez, loto, bahis ve yatırım için tüyo vermez; mahkemedeki ya da resmî bir kurumdaki bir sürecin nasıl sonuçlanacağını da öngörmez.',
            'Bir yorum insanlar hakkında hüküm de vermez: Birinin aldattığını, yalan söylediğini ya da bir kavgada suçlu olduğunu ileri sürmez; lanete, nazara ya da kıskananlara karşı uyarmaz ve seni asla ayrılmaya, istifaya ya da biriyle bağını koparmaya çağırmaz. En fazla sakin bir konuşmaya davet eder; karar sende kalır.',
            'Uygulama karanlık görünen kartları da özenle yorumlar. *Ölüm* kartı Tarot Cup’ta bir ölümü değil, dönüşümü ve bir kapanışı anlatır. Kartlar hakkında daha fazlasını [Tarot rehberi](/tr/tarot/) anlatıyor.',
          ],
        },
        {
          kennung: 'yorumlar-nasil-olusur',
          titel: 'Uygulamadaki yorumlar nasıl oluşur?',
          absaetze: [
            'Tarot, kahve falı ve rüya için normal yorumları uygulama telefonunda, sabit kurallara göre, geleneksel anlamları izleyen hazır metinlerden oluşturur. Tarotta ve kahve falında aklındaki soruyu da sormaz: Gelenekte olduğu gibi soruyu yalnızca içinden geçirirsin.',
            'Otomatik yorumda ise rüyanı kendi sözlerinle yazarsın ya da kart çekersin ve istersen kartlara kendi sorunu sorarsın. Bundan bir program, önceden bir insan okumadan, otomatik olarak kısa bir yorum yazar. Bu yorum “otomatik oluşturuldu” notunu taşır.',
            'Yukarıdaki sınırlar programın sabit talimatlarında da yer alır. Tarot Cup’ın sunucusu her yanıtı kontrol eder ve yanıtı yeniden isteyebilir ya da sabit bir metinle değiştirebilir, ama her otomatik yorumun bütün sınırlara uyduğunu güvence altına alamaz. Örneğin hasta olup olmadığını sorarsan otomatik yorum, önce tek bir cümleyle bunu yanıtlayamayacağını ve doğru adresin bir doktor olduğunu söyleyecek, ardından genel bir yorum yapacak şekilde tasarlanmıştır.',
            'Yine de böyle bir metin uygunsuz olabilir, doğru olmayan şeyler ileri sürebilir ya da sorunu yanlış anlayabilir. İçindeki ifadelere kendin kontrol etmeden güvenme. Yorum sana incitici, uygunsuz ya da yanlış gelirse hemen altındaki “Bildir” düğmesine dokun.',
          ],
        },
        {
          kennung: 'riza-ve-veriler',
          titel: 'Rüyana ya da sorduğun soruya ne olur?',
          absaetze: [
            '“Yorumlat”a ilk kez dokunduğunda uygulama senden açık rızanı ister, çünkü bir rüya ya da soru çok kişisel şeyler içerebilir; örneğin sağlık, inanç ya da mahrem konular. Rıza vermezsen uygulama otomatik yorum için hiçbir şey göndermez.',
            'Rıza verirsen rüyan ya da kartların, bir soru yazdıysan sorun da yalnızca bu tek yorum için Tarot Cup’ın Almanya’daki sunucusuna ve AB dışındaki, örneğin ABD’deki bir hizmet sağlayıcıya gider; yorumu orada program yazar. Tarot Cup’ın sunucusu ne senin metnini ne de yorumu saklar. Bir yorumu bildirirsen sunucu, tanımlayıcı olmadan, yalnızca yorumun metnini, türünü, dili, ülkeyi ve tarihi şu an için 90 gün boyunca saklar. Hizmet sağlayıcı senin bilgilerini şu an genellikle en geç 30 gün sonra siler ve onları eğitim için kullanmaz.',
            'Uygulama ayrıca, başka bilgilerin yanı sıra, uygulamanın dilini ve telefonunun ülkesini iki harfli bir kısaltma olarak gönderir. Ülke, bir yardım metninin uygun kuruluşları gösterebilmesi için gerekir; uygulamanın bunun için konum iznine ihtiyacı yoktur. Tarot Cup’ın sunucusuna bu kuruluma ait rastgele bir tanımlayıcı ve Google Play doğrulaması da gider; tanımlayıcıyı hizmet sağlayıcı almaz. İstisnalar da dahil olmak üzere geri kalan her şey [Gizlilik Politikası](/tr/gizlilik/)’nda yazıyor.',
            'Otomatik bir yorum geçmişine yalnızca “Kaydet”e dokunursan girer, o zaman da rüyan ve sorun olmadan. Başka insanların adlarını, adreslerini ya da telefon numaralarını en iyisi hiç yazma.',
          ],
        },
        {
          kennung: 'yorum-yerine-yardim',
          titel: 'Metnin bir kriz ya da tehlike düşündürürse ne olur?',
          absaetze: [
            'Bu yalnızca otomatik yorum için geçerlidir, çünkü yalnızca orada kendin bir şey yazarsın. Metnin hizmet sağlayıcıya gitmeden önce Tarot Cup’ın sunucusu, metninin gerçek hayatındaki bir krizi ya da tehlikeyi düşündürüp düşündürmediğini, örneğin kendine zarar verme düşüncelerine ya da sana gerçekten yapılan şiddete işaret edip etmediğini kelime listeleriyle kontrol eder. Kontrol bir işaret bulursa metnin daha ileri gitmez ve yorum yerine nereden yardım bulabileceğini gösteren sabit bir bilgi alırsın. Böyle bir durumu ancak program fark ederse sunucu onun yanıtını atar ve yine yalnızca bu bilgiyi gönderir.',
            'Bir rüyada ölüm ya da şiddet geçmesi tek başına bir kriz işareti değildir; böyle bir rüya normal ve özenli bir yorum alır. Kontrol her krizi fark etmez ve bu bilgi acil yardım çağrısının yerini tutmaz: Sen ya da başka biri tehlikedeyse ülkendeki acil yardım hattına başvur.',
          ],
        },
        {
          kennung: 'hediye-olarak-otomatik-yorum',
          titel: 'Otomatik yorumu nasıl alırsın?',
          absaetze: [
            'Otomatik yorumu şu an yalnızca hediye olarak alırsın. Bunun için başka bir hediyen yoksa ve hiç olmadıysa ilk otomatik yorumun bir hoş geldin hediyesidir; hoş geldin hediyesi cihaz başına bir kez verilir. Sonrakileri paylaşarak ve davet ederek alırsın. Paylaşım için şimdilik şu kural geçerli: Yedi gün içinde üç farklı günde uygulamadan bir şey paylaşırsan ve bu sürede bağlantılarından en az biri açılırsa bir tane alırsın. Yalnızca kodlu bağlantılar sayılır, “kodsuz paylaş” ile gönderdiklerin sayılmaz. Birini davet edersen ve bu kişi Tarot Cup’ı uygulamanın belirttiği kadar gün kullanırsa ikiniz de birer tane alırsınız.',
            'Şu an cihaz başına yedi günde en fazla bir otomatik yorum alınabilir; hoş geldin hediyesi de buna dahildir. Bekleyen bir yorum olup olmadığına Tarot Cup’ın sunucusu karar verir; bunun için uygulamanın internete ihtiyacı vardır. Şu an neyin geçerli olduğunu uygulama sana gösterir. Bu kurallar her an değişebilir; bir hediyeyi talep etme hakkın yoktur ([Kullanım Koşulları](/tr/kullanim-kosullari/)).',
          ],
        },
      ],
      fragenTitel: 'Sık sorulan sorular',
      fragen: [
        {
          frage: 'Rüyamı ya da sorumu bir insan okuyor mu?',
          antwort: ['Normalde hayır. Yalnızca hizmet sağlayıcının güvenlik sistemleri bir isteği işaretlerse hizmet sağlayıcı onu inceleyebilir. Bir yorumu bildirirsen, hataları gidermek için o yorumun metni okunur; rüyan ve sorun bu sırada gönderilmez.'],
        },
        {
          frage: 'Rızamı geri alabilir miyim?',
          antwort: ['Evet, istediğin zaman Ayarlar’da “Otomatik yorum” altından; bundan sonra uygulama, yeniden rıza verene kadar bunun için hiçbir şey göndermez. “Sunucudaki verilerimi sil”, sunucunun cihazınla ilgili sakladığı her şeyi hemen siler; bunlar sunucunun yedeklerinde şu an en fazla 14 gün daha bulunabilir ve bekleyen hediyeler kaybolur.'],
        },
        {
          frage: 'Uygulama otomatik yorum olmadan da çalışır mı?',
          antwort: ['Evet. Tarot, kahve falı, simgelerle rüya yorumu, Sözlük ve Geçmiş rıza vermeden ve internet olmadan çalışır. Otomatik yorum, sunucudan gelen hediyeler ve davet etme için, ayrıca yeni sürüm bildirimi ve Google Play üzerinden değerlendirme için internet gerekir.'],
        },
      ],
      app: {
        titel: 'Uygulamada',
        text: ['Android için Tarot Cup’ta kartları, kahve telvesini ve rüyaları hesap olmadan yorumlarsın. Şu an ilk otomatik yorumun hoş geldin hediyesi olarak gelir; paylaştığında ya da birini davet ettiğinde hediye olarak başka otomatik yorumlar da kazanabilirsin.'],
      },
      quellenTitel: 'Kaynaklar',
      quellen: [
        { angabe: 'Tarot Cup: Gizlilik Politikası, Sürüm 1.7, Tarih: 17.11.2026, özellikle 1, 3, 4, 6, 10, 15 ve 17. bölümler. tarot-cup.com, 2026.', url: 'https://tarot-cup.com/tr/gizlilik/' },
        { angabe: 'Tarot Cup: Kullanım Koşulları, Sürüm 1.3, Tarih: 17.11.2026, özellikle 3, 5, 6, 11 ve 14. bölümler. tarot-cup.com, 2026.', url: 'https://tarot-cup.com/tr/kullanim-kosullari/' },
      ],
    },
  },
};
