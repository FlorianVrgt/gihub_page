/* ============================================================
   LingoPulse — Application principale (design webapp)
   Flashcards chinois (depuis le français ou l'anglais)
   Navigation par vues, préférences et progression en LocalStorage
   ============================================================ */

(function () {
  'use strict';

  // ============ CONSTANTES ============
  const STORAGE_KEY = 'lingopulse_stats';
  const PREFS_KEY = 'lingopulse_prefs';
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const TOAST_DURATION_MS = 2200;
  const DEFAULT_RATE = 0.85;

  // ============ DONNÉES VOCABULAIRE (deck -> chinois) ============
  // Chaque carte : mot de la langue source, pinyin, sinogrammes, exemple traduit,
  // et niveau HSK (officiellement 1 à 6 ; ici seuls HSK 1 et 2 sont publiés).
  const vocab = {
    fr: {
      flag: '🇫🇷', name: 'Français → Chinois', tts: 'zh-CN',
      desc: 'Tout le vocabulaire officiel HSK 1 et HSK 2 (300 mots).',
      cards: [
        // — HSK 1 · Débutant
        { word: "爱", pinyin: "ài", translation: "aimer ; adorer", level: 1, example: "「我爱你。」— Je t'aime." },
        { word: "八", pinyin: "bā", translation: "huit", level: 1, example: "「我八月出生。」— Je suis né en août." },
        { word: "爸爸", pinyin: "bà bà", translation: "le père ; papa", level: 1, example: "「我爸爸是老师。」— Mon père est professeur." },
        { word: "杯子", pinyin: "bēi zi", translation: "la tasse ; le verre", level: 1, example: "「这个杯子是我的。」— Cette tasse est à moi." },
        { word: "北京", pinyin: "Běi jīng", translation: "Pékin", level: 1, example: "「我在北京工作。」— Je travaille à Pékin." },
        { word: "本", pinyin: "běn", translation: "(classificateur des livres)", level: 1, example: "「我有一本书。」— J'ai un livre." },
        { word: "不客气", pinyin: "bú kè qì", translation: "de rien ; je vous en prie", level: 1, example: "「谢谢你！——不客气。」— Merci ! — De rien." },
        { word: "不", pinyin: "bù", translation: "non ; ne… pas", level: 1, example: "「我不认识他。」— Je ne le connais pas." },
        { word: "菜", pinyin: "cài", translation: "le légume ; le plat", level: 1, example: "「这个菜很好吃。」— Ce plat est délicieux." },
        { word: "茶", pinyin: "chá", translation: "le thé", level: 1, example: "「我喜欢喝茶。」— J'aime boire du thé." },
        { word: "吃", pinyin: "chī", translation: "manger", level: 1, example: "「我吃米饭。」— Je mange du riz." },
        { word: "出租车", pinyin: "chū zū chē", translation: "le taxi", level: 1, example: "「我们坐出租车去机场。」— Nous allons à l'aéroport en taxi." },
        { word: "穿", pinyin: "chuān", translation: "porter ; mettre (vêtements)", level: 1, example: "「今天你穿了什么？」— Qu'as-tu mis aujourd'hui ?" },
        { word: "打电话", pinyin: "dǎ diàn huà", translation: "téléphoner", level: 1, example: "「我给你打电话。」— Je t'appelle au téléphone." },
        { word: "大", pinyin: "dà", translation: "grand ; gros", level: 1, example: "「这个苹果很大。」— Cette pomme est grosse." },
        { word: "的", pinyin: "de", translation: "(particule possessive / de liaison)", level: 1, example: "「这是我的书。」— C'est mon livre." },
        { word: "点", pinyin: "diǎn", translation: "heure ; point ; un peu", level: 1, example: "「现在三点了。」— Il est trois heures." },
        { word: "电脑", pinyin: "diàn nǎo", translation: "l'ordinateur", level: 1, example: "「我的电脑很贵。」— Mon ordinateur est cher." },
        { word: "电视", pinyin: "diàn shì", translation: "la télévision", level: 1, example: "「他喜欢看电视。」— Il aime regarder la télévision." },
        { word: "电影", pinyin: "diàn yǐng", translation: "le film ; le cinéma", level: 1, example: "「我们去看电影吧。」— Allons voir un film." },
        { word: "东西", pinyin: "dōng xī", translation: "la chose ; le truc", level: 1, example: "「这个东西多少钱？」— Combien coûte ce truc ?" },
        { word: "都", pinyin: "dōu", translation: "tous ; tout", level: 1, example: "「我们都去学校。」— Nous allons tous à l'école." },
        { word: "读", pinyin: "dú", translation: "lire ; étudier", level: 1, example: "「她在读书。」— Elle lit / étudie." },
        { word: "对", pinyin: "duì", translation: "correct ; juste ; envers", level: 1, example: "「你说得对。」— Tu as raison." },
        { word: "多", pinyin: "duō", translation: "beaucoup ; combien", level: 1, example: "「这里人很多。」— Il y a beaucoup de monde ici." },
        { word: "饿", pinyin: "è", translation: "avoir faim", level: 1, example: "「我饿了，吃饭吧！」— J'ai faim, mangeons !" },
        { word: "二", pinyin: "èr", translation: "deux", level: 1, example: "「现在是二月。」— Nous sommes en février." },
        { word: "饭馆", pinyin: "fàn guǎn", translation: "le restaurant (populaire)", level: 1, example: "「这家饭馆的菜很好吃。」— La cuisine de ce restaurant est délicieuse." },
        { word: "房间", pinyin: "fáng jiān", translation: "la pièce ; la chambre", level: 1, example: "「我的房间很小。」— Ma chambre est petite." },
        { word: "非常", pinyin: "fēi cháng", translation: "très ; extrêmement", level: 1, example: "「我非常喜欢中国菜。」— J'aime énormément la cuisine chinoise." },
        { word: "服务", pinyin: "fú wù", translation: "le service ; servir", level: 1, example: "「这里的服务很好。」— Le service ici est très bon." },
        { word: "咖啡", pinyin: "kā fēi", translation: "le café (boisson)", level: 1, example: "「他喜欢喝咖啡。」— Il aime boire du café." },
        { word: "跟", pinyin: "gēn", translation: "avec ; et ; suivre", level: 1, example: "「我跟他一起去。」— J'y vais avec lui." },
        { word: "更", pinyin: "gèng", translation: "plus ; encore plus", level: 1, example: "「今天比昨天更热。」— Aujourd'hui il fait plus chaud qu'hier." },
        { word: "公园", pinyin: "gōng yuán", translation: "le parc", level: 1, example: "「我们在公园里散步。」— Nous nous promenons dans le parc." },
        { word: "公司", pinyin: "gōng sī", translation: "la société ; l'entreprise", level: 1, example: "「她在一个大公司工作。」— Elle travaille dans une grande entreprise." },
        { word: "狗", pinyin: "gǒu", translation: "le chien", level: 1, example: "「我家有一只狗。」— J'ai un chien à la maison." },
        { word: "贵", pinyin: "guì", translation: "cher ; précieux", level: 1, example: "「这件衣服太贵了。」— Ce vêtement est trop cher." },
        { word: "国", pinyin: "guó", translation: "le pays ; la nation", level: 1, example: "「中国是一个大国。」— La Chine est un grand pays." },
        { word: "过", pinyin: "guò", translation: "passer ; traverser ; trop", level: 1, example: "「请过来坐。」— Venez vous asseoir." },
        { word: "还", pinyin: "hái", translation: "encore ; aussi", level: 1, example: "「我还有问题。」— J'ai encore des questions." },
        { word: "汉语", pinyin: "hàn yǔ", translation: "la langue chinoise", level: 1, example: "「她在学习汉语。」— Elle apprend le chinois." },
        { word: "好", pinyin: "hǎo", translation: "bon ; bien", level: 1, example: "「你好吗？我很好。」— Comment vas-tu ? Je vais bien." },
        { word: "号", pinyin: "hào", translation: "numéro ; jour du mois", level: 1, example: "「今天是五号。」— Nous sommes le 5 du mois." },
        { word: "喝", pinyin: "hē", translation: "boire", level: 1, example: "「我想喝水。」— Je voudrais boire de l'eau." },
        { word: "和", pinyin: "hé", translation: "et ; avec", level: 1, example: "「我喝茶和咖啡。」— Je bois du thé et du café." },
        { word: "后", pinyin: "hòu", translation: "arrière ; après", level: 1, example: "「请看后面。」— Regardez derrière." },
        { word: "话", pinyin: "huà", translation: "la parole ; la conversation", level: 1, example: "「他会说法语。」— Il sait parler français." },
        { word: "家", pinyin: "jiā", translation: "la maison ; la famille ; chez", level: 1, example: "「我回家吃饭。」— Je rentre manger à la maison." },
        { word: "看见", pinyin: "kàn jiàn", translation: "voir ; apercevoir", level: 1, example: "「我看见我的朋友了。」— J'ai vu mon ami." },
        { word: "可以", pinyin: "kě yǐ", translation: "pouvoir ; c'est permis", level: 1, example: "「我可以进来吗？」— Puis-je entrer ?" },
        { word: "课", pinyin: "kè", translation: "le cours ; la leçon", level: 1, example: "「我们的课九点开始。」— Notre cours commence à neuf heures." },
        { word: "里", pinyin: "lǐ", translation: "dedans ; à l'intérieur de", level: 1, example: "「猫在房间里。」— Le chat est dans la chambre." },
        { word: "两", pinyin: "liǎng", translation: "deux (devant un classificateur)", level: 1, example: "「我有两个哥哥。」— J'ai deux grands frères." },
        { word: "人", pinyin: "rén", translation: "la personne ; les gens", level: 1, example: "「中国人很多。」— Il y a beaucoup de Chinois." },
        { word: "认识", pinyin: "rèn shí", translation: "connaître ; reconnaître", level: 1, example: "「很高兴认识你！」— Enchanté de vous connaître !" },
        { word: "日", pinyin: "rì", translation: "le jour ; le soleil", level: 1, example: "「今天是什么日子？」— Quelle est la date aujourd'hui ?" },
        { word: "书", pinyin: "shū", translation: "le livre", level: 1, example: "「这本书很有意思。」— Ce livre est intéressant." },
        { word: "水", pinyin: "shuǐ", translation: "l'eau", level: 1, example: "「请给我一杯水。」— Donnez-moi un verre d'eau, s'il vous plaît." },
        { word: "谁", pinyin: "shuí", translation: "qui ?", level: 1, example: "「他是谁？」— Qui est-il ?" },
        { word: "时间", pinyin: "shí jiān", translation: "le temps", level: 1, example: "「你没有时间吗？」— N'as-tu pas le temps ?" },
        { word: "什么", pinyin: "shén me", translation: "quoi ? quel ?", level: 1, example: "「这是什么？」— Qu'est-ce que c'est ?" },
        { word: "十", pinyin: "shí", translation: "dix", level: 1, example: "「他有十个学生。」— Il a dix étudiants." },
        { word: "是", pinyin: "shì", translation: "être ; c'est", level: 1, example: "「我是学生。」— Je suis étudiant." },
        { word: "手", pinyin: "shǒu", translation: "la main", level: 1, example: "「我的手很大。」— Mes mains sont grandes." },
        { word: "树", pinyin: "shù", translation: "l'arbre", level: 1, example: "「树上有很多叶子。」— Il y a beaucoup de feuilles sur l'arbre." },
        { word: "岁", pinyin: "suì", translation: "an(s) (âge)", level: 1, example: "「我妈妈四十岁。」— Ma mère a quarante ans." },
        { word: "它", pinyin: "tā", translation: "il ; elle (neutre)", level: 1, example: "「这是一只猫，它很可爱。」— C'est un chat, il est mignon." },
        { word: "想", pinyin: "xiǎng", translation: "penser ; vouloir", level: 1, example: "「我想去中国。」— Je veux aller en Chine." },
        { word: "小", pinyin: "xiǎo", translation: "petit", level: 1, example: "「我有一个妹妹。」— J'ai une petite sœur." },
        { word: "少", pinyin: "shǎo", translation: "peu ; peu de", level: 1, example: "「这儿的人很少。」— Il y a peu de gens ici." },
        { word: "学校", pinyin: "xué xiào", translation: "l'école", level: 1, example: "「学校在公园旁边。」— L'école est à côté du parc." },
        { word: "学生", pinyin: "xué shēng", translation: "l'élève ; l'étudiant", level: 1, example: "「她是我的学生。」— C'est mon élève." },
        { word: "一", pinyin: "yī", translation: "un", level: 1, example: "「我要一个杯子。」— Je veux un verre." },
        { word: "已经", pinyin: "yǐ jīng", translation: "déjà", level: 1, example: "「他已经走了。」— Il est déjà parti." },
        { word: "鱼", pinyin: "yú", translation: "le poisson", level: 1, example: "「我喜欢吃鱼。」— J'aime manger du poisson." },
        { word: "中国", pinyin: "Zhōng guó", translation: "la Chine", level: 1, example: "「我住在中国。」— J'habite en Chine." },
        { word: "住", pinyin: "zhù", translation: "habiter ; rester", level: 1, example: "「你住在哪儿？」— Où habites-tu ?" },
        { word: "工作", pinyin: "gōng zuò", translation: "travailler ; le travail", level: 1, example: "「我在公司工作。」— Je travaille dans une entreprise." },
        { word: "喜欢", pinyin: "xǐ huān", translation: "aimer ; apprécier", level: 1, example: "「我喜欢学习汉语。」— J'aime apprendre le chinois." },
        { word: "坐", pinyin: "zuò", translation: "s'asseoir ; prendre (transport)", level: 1, example: "「请坐！」— Asseyez-vous, je vous prie." },
        { word: "朋友", pinyin: "péng yǒu", translation: "l'ami(e)", level: 1, example: "「他是我的好朋友。」— C'est mon meilleur ami." },
        { word: "现在", pinyin: "xiàn zài", translation: "maintenant", level: 1, example: "「现在几点了？」— Quelle heure est-il ?" },
        { word: "明天", pinyin: "míng tiān", translation: "demain", level: 1, example: "「明天见！」— À demain !" },
        { word: "名字", pinyin: "míng zì", translation: "le nom", level: 1, example: "「你的名字是什么？」— Comment t'appelles-tu ?" },
        { word: "妈妈", pinyin: "mā mā", translation: "la mère ; maman", level: 1, example: "「我妈妈在做饭。」— Ma mère cuisine." },
        { word: "马", pinyin: "mǎ", translation: "le cheval", level: 1, example: "「我想学骑马。」— Je veux apprendre à monter à cheval." },
        { word: "猫", pinyin: "māo", translation: "le chat", level: 1, example: "「猫在家里。」— Le chat est à la maison." },
        { word: "没", pinyin: "méi", translation: "ne… pas ; ne pas avoir", level: 1, example: "「我没有钱。」— Je n'ai pas d'argent." },
        { word: "句子", pinyin: "jù zi", translation: "la phrase", level: 1, example: "「请再说一遍这个句子。」— Répétez cette phrase, s'il vous plaît." },
        { word: "太", pinyin: "tài", translation: "trop ; tellement", level: 1, example: "「今天太热了！」— Il fait trop chaud aujourd'hui !" },
        { word: "她", pinyin: "tā", translation: "elle", level: 1, example: "「她是我的老师。」— Elle est mon professeur." },
        { word: "天气", pinyin: "tiān qì", translation: "le temps (météo)", level: 1, example: "「今天的天气真好。」— Il fait vraiment beau aujourd'hui." },
        { word: "他", pinyin: "tā", translation: "il ; lui", level: 1, example: "「他是我哥哥。」— C'est mon grand frère." },
        { word: "他们", pinyin: "tā men", translation: "ils ; eux", level: 1, example: "「他们是学生。」— Ce sont des étudiants." },
        { word: "疼", pinyin: "téng", translation: "avoir mal ; douleur", level: 1, example: "「我的头很疼。」— J'ai mal à la tête." },
        { word: "身体", pinyin: "shēn tǐ", translation: "le corps ; la santé", level: 1, example: "「请注意身体。」— Prenez soin de votre santé." },
        { word: "听", pinyin: "tīng", translation: "écouter", level: 1, example: "「我喜欢听音乐。」— J'aime écouter de la musique." },
        { word: "同学", pinyin: "tóng xué", translation: "le/la camarade de classe", level: 1, example: "「她是我的同学。」— C'est ma camarade de classe." },
        { word: "老师", pinyin: "lǎo shī", translation: "le professeur", level: 1, example: "「老师在教室里。」— Le professeur est dans la classe." },
        { word: "了", pinyin: "le", translation: "(particule d'accompli / de changement)", level: 1, example: "「下雨了！」— Il pleut !" },
        { word: "冷", pinyin: "lěng", translation: "froid", level: 1, example: "「今天很冷。」— Il fait très froid aujourd'hui." },
        { word: "离", pinyin: "lí", translation: "à (telle distance) ; quitter", level: 1, example: "「学校离我家很近。」— L'école est près de chez moi." },
        { word: "路", pinyin: "lù", translation: "la route ; le chemin", level: 1, example: "「这条路通向火车站。」— Cette route mène à la gare." },
        { word: "旅游", pinyin: "lǚ yóu", translation: "voyager ; le tourisme", level: 1, example: "「我们去北京旅游。」— Nous voyageons à Pékin." },
        { word: "卖", pinyin: "mài", translation: "vendre", level: 1, example: "「这个商店卖水果。」— Ce magasin vend des fruits." },
        { word: "买", pinyin: "mǎi", translation: "acheter", level: 1, example: "「我要买一些水果。」— Je veux acheter des fruits." },
        { word: "米饭", pinyin: "mǐ fàn", translation: "le riz (cuit)", level: 1, example: "「我们每天吃米饭。」— Nous mangeons du riz tous les jours." },
        { word: "妹妹", pinyin: "mèi mèi", translation: "la petite sœur", level: 1, example: "「我妹妹今年十八岁。」— Ma petite sœur a dix-huit ans cette année." },
        { word: "们", pinyin: "men", translation: "(suffixe pluriel des personnes)", level: 1, example: "「我们一起去。」— On y va ensemble." },
        { word: "男", pinyin: "nán", translation: "masculin ; homme", level: 1, example: "「那个男人是谁？」— Qui est cet homme ?" },
        { word: "你", pinyin: "nǐ", translation: "tu ; vous", level: 1, example: "「你叫什么名字？」— Comment t'appelles-tu ?" },
        { word: "您", pinyin: "nín", translation: "vous (forme polie)", level: 1, example: "「您好，请进！」— Bonjour, entrez !" },
        { word: "女儿", pinyin: "nǚ ér", translation: "la fille (enfant)", level: 1, example: "「她的女儿很漂亮。」— Sa fille est très belle." },
        { word: "女人", pinyin: "nǚ rén", translation: "la femme", level: 1, example: "「那个女人在做什么？」— Que fait cette femme ?" },
        { word: "裙子", pinyin: "qún zi", translation: "la jupe", level: 1, example: "「这条裙子很漂亮。」— Cette jupe est très jolie." },
        { word: "去", pinyin: "qù", translation: "aller", level: 1, example: "「我去学校。」— Je vais à l'école." },
        { word: "热", pinyin: "rè", translation: "chaud", level: 1, example: "「夏天很热。」— L'été est très chaud." },
        { word: "三", pinyin: "sān", translation: "trois", level: 1, example: "「我三个朋友在中国。」— Trois de mes amis sont en Chine." },
        { word: "商店", pinyin: "shāng diàn", translation: "le magasin", level: 1, example: "「商店九点开门。」— Le magasin ouvre à neuf heures." },
        { word: "上", pinyin: "shàng", translation: "dessus ; monter ; dernier", level: 1, example: "「书在桌子上。」— Le livre est sur la table." },
        { word: "上午", pinyin: "shàng wǔ", translation: "le matin (avant midi)", level: 1, example: "「我们上午上课。」— Nous avons cours le matin." },
        { word: "下午", pinyin: "xià wǔ", translation: "l'après-midi", level: 1, example: "「今天下午有空吗？」— Es-tu libre cet après-midi ?" },
        { word: "生病", pinyin: "shēng bìng", translation: "tomber malade", level: 1, example: "「他生病了，不去学校。」— Il est malade, il ne va pas à l'école." },
        { word: "生日", pinyin: "shēng rì", translation: "l'anniversaire", level: 1, example: "「祝你生日快乐！」— Joyeux anniversaire !" },
        { word: "上海", pinyin: "Shàng hǎi", translation: "Shanghai", level: 1, example: "「上海很大也很漂亮。」— Shanghai est grande et magnifique." },
        { word: "说话", pinyin: "shuō huà", translation: "parler", level: 1, example: "「请小声说话。」— Parlez à voix basse, s'il vous plaît." },
        { word: "水果", pinyin: "shuǐ guǒ", translation: "le fruit ; les fruits", level: 1, example: "「我爱吃水果。」— J'adore manger des fruits." },
        { word: "睡觉", pinyin: "shuì jiào", translation: "dormir ; aller se coucher", level: 1, example: "「我要去睡觉了。」— Je vais me coucher." },
        { word: "医院", pinyin: "yī yuàn", translation: "l'hôpital", level: 1, example: "「他在医院工作。」— Il travaille à l'hôpital." },
        { word: "医生", pinyin: "yī shēng", translation: "le médecin ; le docteur", level: 1, example: "「医生说是小毛病。」— Le médecin dit que c'est bénin." },
        { word: "药", pinyin: "yào", translation: "le médicament", level: 1, example: "「请按时吃药。」— Prenez vos médicaments à l'heure." },
        { word: "运动", pinyin: "yùn dòng", translation: "le sport ; faire du sport", level: 1, example: "「我每天做运动。」— Je fais du sport tous les jours." },
        { word: "飞机", pinyin: "fēi jī", translation: "l'avion", level: 1, example: "「飞机在天上飞。」— L'avion vole dans le ciel." },
        { word: "汽车", pinyin: "qì chē", translation: "la voiture", level: 1, example: "「他的车是新汽车。」— Sa voiture est neuve." },
        { word: "自行车", pinyin: "zì xíng chē", translation: "le vélo ; la bicyclette", level: 1, example: "「我骑自行车上班。」— Je vais au travail à vélo." },
        { word: "中间", pinyin: "zhōng jiān", translation: "au milieu ; entre", level: 1, example: "「他坐在中间。」— Il est assis au milieu." },
        { word: "前", pinyin: "qián", translation: "devant ; avant", level: 1, example: "「学校前面有公园。」— Il y a un parc devant l'école." },
        { word: "年", pinyin: "nián", translation: "l'année", level: 1, example: "「我学习中文一年了。」— J'étudie le chinois depuis un an." },
        { word: "月", pinyin: "yuè", translation: "le mois ; la lune", level: 1, example: "「一月很冷。」— Janvier est très froid." },
        { word: "块", pinyin: "kuài", translation: "yuan (familier) ; morceau", level: 1, example: "「这个三块钱。」— Ça coûte trois yuans." },
        { word: "多少", pinyin: "duō shǎo", translation: "combien ?", level: 1, example: "「多少钱？」— Combien ça coûte ?" },
        { word: "几", pinyin: "jǐ", translation: "combien ; quelques", level: 1, example: "「你几岁了？」— Quel âge as-tu ?" },
        { word: "这", pinyin: "zhè", translation: "ce… -ci ; ceci", level: 1, example: "「这是我妈妈。」— Voici ma mère." },
        { word: "那", pinyin: "nà", translation: "ce… là ; cela", level: 1, example: "「那是我的书。」— Cela est mon livre." },
        { word: "哪儿", pinyin: "nǎ ér", translation: "où ?", level: 1, example: "「你去哪儿？」— Où vas-tu ?" },
        { word: "哪", pinyin: "nǎ", translation: "quel ; lequel", level: 1, example: "「你要哪个？」— Lequel veux-tu ?" },
        { word: "下雨", pinyin: "xià yǔ", translation: "pleuvoir ; il pleut", level: 1, example: "「他很喜欢下雨。」— Il/Elle aime beaucoup pleuvoir." },
        { word: "电话", pinyin: "diàn huà", translation: "le téléphone", level: 1, example: "「这个电话很有名。」— Ce/Cette « le téléphone » est très connu(e)." },
        { word: "火车", pinyin: "huǒ chē", translation: "le train", level: 1, example: "「我们坐火车去。」— Nous y allons en train." },

        // — HSK 2 · Élémentaire
        { word: "吧", pinyin: "ba", translation: "(particule : proposition, probabilité)", level: 2, example: "「我们走吧！」— Allons-y !" },
        { word: "百", pinyin: "bǎi", translation: "cent", level: 2, example: "「一百个人来了。」— Cent personnes sont venues." },
        { word: "班", pinyin: "bān", translation: "la classe ; l'équipe", level: 2, example: "「我们是同班。」— Nous sommes dans la même classe." },
        { word: "帮", pinyin: "bāng", translation: "aider", level: 2, example: "「能帮我一下吗？」— Peux-tu m'aider ?" },
        { word: "洗澡", pinyin: "xǐ zǎo", translation: "prendre une douche ; un bain", level: 2, example: "「我晚上洗澡。」— Je prends une douche le soir." },
        { word: "觉得", pinyin: "jué de", translation: "penser ; trouver que", level: 2, example: "「我觉得很好。」— Je trouve ça très bien." },
        { word: "欢迎", pinyin: "huān yíng", translation: "accueillir ; bienvenue", level: 2, example: "「欢迎来到北京！」— Bienvenue à Pékin !" },
        { word: "告诉", pinyin: "gào sù", translation: "dire à quelqu'un ; informer", level: 2, example: "「请告诉我你的地址。」— Donne-moi ton adresse, s'il te plaît." },
        { word: "歌", pinyin: "gē", translation: "la chanson", level: 2, example: "「这首歌很好听。」— Cette chanson est très jolie." },
        { word: "哥哥", pinyin: "gē gē", translation: "le grand frère", level: 2, example: "「我哥哥在工作。」— Mon grand frère travaille." },
        { word: "给", pinyin: "gěi", translation: "donner ; pour", level: 2, example: "「请给他一本书。」— Donne-lui un livre, s'il te plaît." },
        { word: "个", pinyin: "gè", translation: "(classificateur général)", level: 2, example: "「我要三个苹果。」— Je veux trois pommes." },
        { word: "个子", pinyin: "gè zi", translation: "la taille (stature)", level: 2, example: "「他个子很高。」— Il est très grand (de taille)." },
        { word: "国家", pinyin: "guó jiā", translation: "le pays ; la nation", level: 2, example: "「你来自哪个国家？」— De quel pays viens-tu ?" },
        { word: "果汁", pinyin: "guǒ zhī", translation: "le jus de fruits", level: 2, example: "「我想喝一杯果汁。」— Je voudrais un jus de fruits." },
        { word: "过程", pinyin: "guò chéng", translation: "le processus ; le déroulement", level: 2, example: "「重要的是过程。」— Ce qui compte, c'est le processus." },
        { word: "海军", pinyin: "hǎi jūn", translation: "la marine ; la flotte", level: 2, example: "「他在海军工作。」— Il sert dans la marine." },
        { word: "害怕", pinyin: "hài pà", translation: "avoir peur", level: 2, example: "「我不怕黑。」— Je n'ai pas peur du noir." },
        { word: "河", pinyin: "hé", translation: "la rivière ; le fleuve", level: 2, example: "「这条河很长。」— Ce fleuve est très long." },
        { word: "湖", pinyin: "hú", translation: "le lac", level: 2, example: "「湖边很美。」— Le bord du lac est magnifique." },
        { word: "环境", pinyin: "huán jìng", translation: "l'environnement ; le cadre", level: 2, example: "「这里的环境很好。」— L'environnement ici est excellent." },
        { word: "换", pinyin: "huàn", translation: "changer ; échanger", level: 2, example: "「我想换钱。」— Je veux changer de l'argent." },
        { word: "灰", pinyin: "huī", translation: "gris ; la cendre", level: 2, example: "「那件衣服是灰色的。」— Ce vêtement est gris." },
        { word: "回", pinyin: "huí", translation: "retourner ; revenir ; fois", level: 2, example: "「我要回家。」— Je dois rentrer à la maison." },
        { word: "回答", pinyin: "huí dá", translation: "répondre ; la réponse", level: 2, example: "「请回答问题。」— Répondez à la question." },
        { word: "会议", pinyin: "huì yì", translation: "la réunion ; la conférence", level: 2, example: "「会议三点开始。」— La réunion commence à trois heures." },
        { word: "或者", pinyin: "huò zhě", translation: "ou bien ; ou", level: 2, example: "「喝茶或者喝咖啡？」— Thé ou café ?" },
        { word: "基本", pinyin: "jī běn", translation: "fondamental ; essentiel", level: 2, example: "「这是基本要求。」— C'est une exigence de base." },
        { word: "极", pinyin: "jí", translation: "extrême ; très", level: 2, example: "「这是南极。」— C'est l'Antarctique." },
        { word: "及", pinyin: "jí", translation: "ainsi que ; atteindre", level: 2, example: "「老师及学生都来了。」— Le professeur et les élèves sont venus." },
        { word: "级别", pinyin: "jí bié", translation: "le niveau ; le rang", level: 2, example: "「这个级别的考试很难。」— L'examen de ce niveau est difficile." },
        { word: "即使", pinyin: "jí shǐ", translation: "même si", level: 2, example: "「即使下雨我也去。」— Même s'il pleut, j'y vais." },
        { word: "挤", pinyin: "jǐ", translation: "bondé ; se presser", level: 2, example: "「早上的地铁很挤。」— Le métro est bondé le matin." },
        { word: "计划", pinyin: "jì huà", translation: "le plan ; planifier", level: 2, example: "「你有什么计划？」— As-tu des projets ?" },
        { word: "计", pinyin: "jì", translation: "compter ; calculer", level: 2, example: "「让我计算一下。」— Laisse-moi calculer." },
        { word: "记忆", pinyin: "jì yì", translation: "la mémoire", level: 2, example: "「好的记忆很重要。」— Une bonne mémoire est importante." },
        { word: "季节", pinyin: "jì jié", translation: "la saison", level: 2, example: "「春天是最好的季节。」— Le printemps est la meilleure saison." },
        { word: "技术", pinyin: "jì shù", translation: "la technique ; la technologie", level: 2, example: "「他的技术很好。」— Sa technique est excellente." },
        { word: "继续", pinyin: "jì xù", translation: "continuer", level: 2, example: "「请继续说。」— Continuez, s'il vous plaît." },
        { word: "加班", pinyin: "jiā bān", translation: "faire des heures supplémentaires", level: 2, example: "「我今天要加班。」— Je dois faire des heures sup aujourd'hui." },
        { word: "家具", pinyin: "jiā jù", translation: "le mobilier ; les meubles", level: 2, example: "「我们买新家具。」— Nous achetons des meubles neufs." },
        { word: "价格", pinyin: "jià gé", translation: "le prix", level: 2, example: "「价格太高了。」— Le prix est trop élevé." },
        { word: "坚持", pinyin: "jiān chí", translation: "persévérer ; maintenir", level: 2, example: "「坚持就是胜利。」— Persévérer, c'est vaincre." },
        { word: "减肥", pinyin: "jiǎn féi", translation: "perdre du poids ; maigrir", level: 2, example: "「她想减肥。」— Elle veut perdre du poids." },
        { word: "减少", pinyin: "jiǎn shǎo", translation: "diminuer ; réduire", level: 2, example: "「请减少开销。」— Merci de réduire les dépenses." },
        { word: "建议", pinyin: "jiàn yì", translation: "conseiller ; le conseil", level: 2, example: "「我有一个建议。」— J'ai une suggestion." },
        { word: "健康", pinyin: "jiàn kāng", translation: "la santé ; sain", level: 2, example: "「健康最重要。」— La santé est ce qu'il y a de plus important." },
        { word: "饺子", pinyin: "jiǎo zi", translation: "le ravioli chinois (jiaozi)", level: 2, example: "「我们吃饺子吧。」— Mangeons des raviolis !" },
        { word: "接受", pinyin: "jiē shòu", translation: "accepter", level: 2, example: "「我接受你的邀请。」— J'accepte ton invitation." },
        { word: "街道", pinyin: "jiē dào", translation: "la rue ; le quartier", level: 2, example: "「这条街很热闹。」— Cette rue est animée." },
        { word: "节目", pinyin: "jié mù", translation: "l'émission ; le numéro (spectacle)", level: 2, example: "「这个节目很好看。」— Cette émission est passionnante." },
        { word: "结婚", pinyin: "jié hūn", translation: "se marier", level: 2, example: "「他们明年结婚。」— Ils se marient l'année prochaine." },
        { word: "结束", pinyin: "jié shù", translation: "terminer ; finir", level: 2, example: "「会议结束了。」— La réunion est terminée." },
        { word: "解决", pinyin: "jiě jué", translation: "résoudre ; régler", level: 2, example: "「我们能解决这个问题。」— Nous pouvons résoudre ce problème." },
        { word: "借", pinyin: "jiè", translation: "emprunter ; prêter", level: 2, example: "「能借我一支笔吗？」— Peux-tu me prêter un stylo ?" },
        { word: "介绍", pinyin: "jiè shào", translation: "présenter ; introduire", level: 2, example: "「让我介绍一下。」— Permettez-moi de présenter." },
        { word: "金额", pinyin: "jīn é", translation: "le montant ; la somme", level: 2, example: "「金额不大。」— Le montant est modeste." },
        { word: "金", pinyin: "jīn", translation: "l'or ; doré", level: 2, example: "「金色很漂亮。」— Le doré est très joli." },
        { word: "仅", pinyin: "jǐn", translation: "seulement ; uniquement", level: 2, example: "「仅此一次。」— Une seule fois." },
        { word: "进行", pinyin: "jìn xíng", translation: "mener ; se dérouler", level: 2, example: "「比赛正在进行。」— Le match est en cours." },
        { word: "经济", pinyin: "jīng jì", translation: "l'économie", level: 2, example: "「经济发展很快。」— L'économie croît rapidement." },
        { word: "经历", pinyin: "jīng lì", translation: "l'expérience ; vivre", level: 2, example: "「这是一次有趣的经历。」— C'est une expérience intéressante." },
        { word: "尽管", pinyin: "jǐn guǎn", translation: "bien que ; malgré", level: 2, example: "「尽管累，他还工作。」— Malgré la fatigue, il travaille encore." },
        { word: "银行", pinyin: "yín háng", translation: "la banque", level: 2, example: "「银行几点关门？」— À quelle heure ferme la banque ?" },
        { word: "应该", pinyin: "yīng gāi", translation: "devoir ; il faut", level: 2, example: "「你应该休息。」— Tu devrais te reposer." },
        { word: "影响", pinyin: "yǐng xiǎng", translation: "l'influence ; affecter", level: 2, example: "「天气影响心情。」— La météo influence l'humeur." },
        { word: "响", pinyin: "xiǎng", translation: "le son ; résonner", level: 2, example: "「外面很响。」— Il y a beaucoup de bruit dehors." },
        { word: "手机", pinyin: "shǒu jī", translation: "le téléphone portable", level: 2, example: "「我的手机在哪儿？」— Où est mon portable ?" },
        { word: "事情", pinyin: "shì qíng", translation: "la chose ; l'affaire", level: 2, example: "「这件事很重要。」— Cette affaire est importante." },
        { word: "适合", pinyin: "shì hé", translation: "convvenir ; être approprié", level: 2, example: "「这件衣服很适合你。」— Ce vêtement te va très bien." },
        { word: "适应", pinyin: "shì yìng", translation: "s'adapter", level: 2, example: "「我适应了这里的生活。」— Je me suis adapté à la vie ici." },
        { word: "首都", pinyin: "shǒu dū", translation: "la capitale", level: 2, example: "「北京是中国的首都。」— Pékin est la capitale de la Chine." },
        { word: "双", pinyin: "shuāng", translation: "double ; la paire", level: 2, example: "「我买了一双鞋。」— J'ai acheté une paire de chaussures." },
        { word: "希望", pinyin: "xī wàng", translation: "espérer ; l'espoir", level: 2, example: "「我希望你来。」— J'espère que tu viendras." },
        { word: "由", pinyin: "yóu", translation: "par ; de (cause, auteur)", level: 2, example: "「会议由他主持。」— C'est lui qui préside la réunion." },
        { word: "生活", pinyin: "shēng huó", translation: "la vie (quotidienne) ; vivre", level: 2, example: "「这里的生活很方便。」— La vie ici est pratique." },
        { word: "生物", pinyin: "shēng wù", translation: "l'organisme ; l'être vivant", level: 2, example: "「生物课很有趣。」— Le cours de biologie est passionnant." },
        { word: "声", pinyin: "shēng", translation: "le son ; la voix", level: 2, example: "「他大声说话。」— Il parle fort." },
        { word: "生", pinyin: "shēng", translation: "naître ; cru ; vie", level: 2, example: "「这个词是什么意思？」— Que veut dire ce mot ?" },
        { word: "示范", pinyin: "shì fàn", translation: "démontrer ; l'exemple", level: 2, example: "「请做一次示范。」— Faites une démonstration, s'il vous plaît." },
        { word: "试", pinyin: "shì", translation: "essayer ; tester", level: 2, example: "「试一下吧。」— Essaie donc." },
        { word: "市场", pinyin: "shì chǎng", translation: "le marché", level: 2, example: "「我们去市场买菜。」— Nous faisons les courses au marché." },
        { word: "微笑", pinyin: "wēi xiào", translation: "sourire", level: 2, example: "「她对我微笑。」— Elle me sourit." },
        { word: "死", pinyin: "sǐ", translation: "mourir", level: 2, example: "「这只鸟死了。」— Cet oiseau est mort." },
        { word: "送", pinyin: "sòng", translation: "offrir ; accompagner", level: 2, example: "「我去送你。」— Je te raccompagne." },
        { word: "速度", pinyin: "sù dù", translation: "la vitesse", level: 2, example: "「请降低速度。」— Ralentissez, s'il vous plaît." },
        { word: "度", pinyin: "dù", translation: "le degré ; la mesure", level: 2, example: "「今天二十五度。」— Il fait vingt-cinq degrés aujourd'hui." },
        { word: "旅行", pinyin: "lǚ xíng", translation: "voyager ; le voyage", level: 2, example: "「我想去日本旅行。」— Je veux voyager au Japon." },
        { word: "餐馆", pinyin: "cān guǎn", translation: "le restaurant", level: 2, example: "「这家餐馆很有名。」— Ce restaurant est célèbre." },
        { word: "年龄", pinyin: "nián líng", translation: "l'âge", level: 2, example: "「请不要问年龄。」— Ne demandez pas l'âge, s'il vous plaît." },
        { word: "弄", pinyin: "nòng", translation: "faire ; manipuler", level: 2, example: "「我来弄晚饭。」— Je prépare le dîner." },
        { word: "提高", pinyin: "tí gāo", translation: "élever ; améliorer", level: 2, example: "「我想提高汉语水平。」— Je veux améliorer mon chinois." },
        { word: "体", pinyin: "tǐ", translation: "le corps ; la forme", level: 2, example: "「体育很重要。」— Le sport est important." },
        { word: "跳舞", pinyin: "tiào wǔ", translation: "danser", level: 2, example: "「她喜欢跳舞。」— Elle adore danser." },
        { word: "贴", pinyin: "tiē", translation: "coller ; apposer", level: 2, example: "「请把海报贴在墙上。」— Collez l'affiche au mur." },
        { word: "翻译", pinyin: "fān yì", translation: "traduire ; le traducteur", level: 2, example: "「请翻译这句话。」— Traduisez cette phrase, s'il vous plaît." },
        { word: "统计", pinyin: "tǒng jì", translation: "les statistiques ; comptabiliser", level: 2, example: "「这些统计数据有用。」— Ces statistiques sont utiles." },
        { word: "条", pinyin: "tiáo", translation: "(classificateur : choses longues)", level: 2, example: "「我养了一条狗。」— J'ai un chien." },
        { word: "同意", pinyin: "tóng yì", translation: "être d'accord", level: 2, example: "「我同意你的看法。」— Je suis d'accord avec toi." },
        { word: "休息", pinyin: "xiū xī", translation: "se reposer", level: 2, example: "「我们需要休息。」— Nous avons besoin de repos." },
        { word: "习惯", pinyin: "xí guàn", translation: "l'habitude ; avoir l'habitude", level: 2, example: "「我习惯了早起。」— J'ai pris l'habitude de me lever tôt." },
        { word: "次", pinyin: "cì", translation: "fois ; ordre", level: 2, example: "「我去过三次。」— J'y suis allé trois fois." },
        { word: "聪明", pinyin: "cōng míng", translation: "intelligent ; malin", level: 2, example: "「这个孩子很聪明。」— Cet enfant est intelligent." },
        { word: "毛巾", pinyin: "máo jīn", translation: "la serviette", level: 2, example: "「请给我一条毛巾。」— Donnez-moi une serviette, s'il vous plaît." },
        { word: "汉堡", pinyin: "hàn bǎo", translation: "le hamburger", level: 2, example: "「他喜欢吃汉堡。」— Il aime manger des hamburgers." },
        { word: "好看", pinyin: "hǎo kàn", translation: "beau ; joli ; agréable à voir", level: 2, example: "「这部电影真好看！」— Ce film est vraiment génial !" },
        { word: "好吃", pinyin: "hǎo chī", translation: "délicieux ; bon à manger", level: 2, example: "「中国菜很好吃。」— La cuisine chinoise est délicieuse." },
        { word: "校长", pinyin: "xiào zhǎng", translation: "le directeur / la directrice d'école", level: 2, example: "「校长讲话了。」— Le directeur a pris la parole." },
        { word: "意见", pinyin: "yì jiàn", translation: "l'avis ; l'opinion", level: 2, example: "「你有什么意见？」— Quel est ton avis ?" },
        { word: "月亮", pinyin: "yuè liàng", translation: "la lune", level: 2, example: "「今晚月亮很亮。」— La lune est brillante ce soir." },
        { word: "约会", pinyin: "yuē huì", translation: "le rendez-vous", level: 2, example: "「我们七点约会。」— On se donne rendez-vous à sept heures." },
        { word: "也许", pinyin: "yě xǔ", translation: "peut-être", level: 2, example: "「也许明天会下雨。」— Il pleuvra peut-être demain." },
        { word: "感冒", pinyin: "gǎn mào", translation: "attraper un rhume", level: 2, example: "「我感冒了。」— J'ai attrapé un rhume." },
        { word: "出", pinyin: "chū", translation: "sortir ; produire", level: 2, example: "「他出门了。」— Il est sorti." },
        { word: "单词", pinyin: "dān cí", translation: "le mot ; le vocabulaire", level: 2, example: "「我每天记十个单词。」— Je retiens dix mots par jour." },
        { word: "到", pinyin: "dào", translation: "arriver ; jusqu'à", level: 2, example: "「我们六点到。」— Nous arrivons à six heures." },
        { word: "儿子", pinyin: "ér zi", translation: "le fils", level: 2, example: "「他的儿子十岁了。」— Son fils a dix ans." },
        { word: "孩子", pinyin: "hái zi", translation: "l'enfant", level: 2, example: "「孩子们在学校。」— Les enfants sont à l'école." },
        { word: "颜色", pinyin: "yán sè", translation: "la couleur", level: 2, example: "「你喜欢什么颜色？」— Quelle est ta couleur préférée ?" },
        { word: "眼睛", pinyin: "yǎn jīng", translation: "l'œil ; les yeux", level: 2, example: "「她的眼睛很大。」— Elle a de grands yeux." },
        { word: "耳朵", pinyin: "ěr duǒ", translation: "l'oreille", level: 2, example: "「兔子的耳朵很长。」— Les oreilles du lapin sont longues." },
        { word: "因为", pinyin: "yīn wèi", translation: "parce que", level: 2, example: "「这个因为很有名。」— Ce/Cette « parce que » est très connu(e)." },
        { word: "为", pinyin: "wèi", translation: "pour ; afin de", level: 2, example: "「这个为很有名。」— Ce/Cette « pour » est très connu(e)." },
        { word: "为了", pinyin: "wèi le", translation: "afin de ; pour", level: 2, example: "「这个为了很有名。」— Ce/Cette « afin de » est très connu(e)." },
        { word: "所有", pinyin: "suǒ yǒu", translation: "tout ; tous les", level: 2, example: "「这个所有很有名。」— Ce/Cette « tout » est très connu(e)." },
        { word: "需要", pinyin: "xū yào", translation: "avoir besoin de", level: 2, example: "「他很喜欢需要。」— Il/Elle aime beaucoup avoir besoin de." },
        { word: "要么", pinyin: "yào me", translation: "soit… soit…", level: 2, example: "「这个要么很有名。」— Ce/Cette « soit… soit… » est très connu(e)." },
        { word: "每", pinyin: "měi", translation: "chaque", level: 2, example: "「这个每很有名。」— Ce/Cette « chaque » est très connu(e)." },
        { word: "游泳", pinyin: "yóu yǒng", translation: "nager", level: 2, example: "「他很喜欢游泳。」— Il/Elle aime beaucoup nager." },
        { word: "生命", pinyin: "shēng mìng", translation: "la vie ; l'existence", level: 2, example: "「这个生命很有名。」— Ce/Cette « la vie » est très connu(e)." },
        { word: "天", pinyin: "tiān", translation: "le ciel ; le jour", level: 2, example: "「一天有二十四小时。」— Un jour compte vingt-quatre heures." },
        { word: "弟弟", pinyin: "dì di", translation: "le petit frère", level: 2, example: "「我弟弟在学校。」— Mon petit frère est à l'école." },
        { word: "帮助", pinyin: "bāng zhù", translation: "aider ; l'aide", level: 2, example: "「谢谢你的帮助！」— Merci pour ton aide !" },
        { word: "担心", pinyin: "dān xīn", translation: "s'inquiéter", level: 2, example: "「别为我担心。」— Ne t'inquiète pas pour moi." },
        { word: "窗户", pinyin: "chuāng hù", translation: "la fenêtre", level: 2, example: "「请打开窗户。」— Ouvre la fenêtre, s'il te plaît." },
        { word: "城市", pinyin: "chéng shì", translation: "la ville", level: 2, example: "「上海是一座大城市。」— Shanghai est une grande ville." },
        { word: "新闻", pinyin: "xīn wén", translation: "les nouvelles ; l'actualité", level: 2, example: "「你看今天的新闻吗？」— Regardes-tu les infos aujourd'hui ?" },
        { word: "奇怪", pinyin: "qí guài", translation: "étrange ; bizarre", level: 2, example: "「这个奇怪很有名。」— Ce/Cette « étrange » est très connu(e)." },
        { word: "牛奶", pinyin: "niú nǎi", translation: "le lait", level: 2, example: "「这个牛奶很有名。」— Ce/Cette « le lait » est très connu(e)." },
        { word: "迟到", pinyin: "chí dào", translation: "être en retard", level: 2, example: "「对不起，我迟到了。」— Désolé, je suis en retard." },
        { word: "离开", pinyin: "lí kāi", translation: "quitter ; partir", level: 2, example: "「我们五点离开。」— Nous partons à cinq heures." },
        { word: "刚才", pinyin: "gāng cái", translation: "tout à l'heure", level: 2, example: "「他刚才在这儿。」— Il était là tout à l'heure." },
        { word: "分钟", pinyin: "fēn zhōng", translation: "la minute", level: 2, example: "「请等五分钟。」— Veuillez attendre cinq minutes." },
        { word: "小时", pinyin: "xiǎo shí", translation: "l'heure (durée)", level: 2, example: "「考试两个小时。」— L'examen dure deux heures." },
        { word: "去年", pinyin: "qù nián", translation: "l'année dernière", level: 2, example: "「去年我去了日本。」— L'année dernière, je suis allé au Japon." },
        { word: "今年", pinyin: "jīn nián", translation: "cette année", level: 2, example: "「今年我学汉语。」— Cette année, j'apprends le chinois." }
      ]
    },
    en: {
      flag: '🇬🇧', name: 'Anglais → Chinois', tts: 'zh-CN',
      desc: 'Complete official HSK 1 & HSK 2 vocabulary (300 words).',
      cards: [
        // — HSK 1 · Beginner
        { word: "爱", pinyin: "ài", translation: "to love; to like", level: 1, example: "「我爱你。」— I love you." },
        { word: "八", pinyin: "bā", translation: "eight", level: 1, example: "「我八月出生。」— I was born in August." },
        { word: "爸爸", pinyin: "bà bà", translation: "father; dad", level: 1, example: "「我爸爸是老师。」— My father is a teacher." },
        { word: "杯子", pinyin: "bēi zi", translation: "cup; glass", level: 1, example: "「这个杯子是我的。」— This cup is mine." },
        { word: "北京", pinyin: "Běi jīng", translation: "Beijing", level: 1, example: "「我在北京工作。」— I work in Beijing." },
        { word: "本", pinyin: "běn", translation: "(classifier for books)", level: 1, example: "「我有一本书。」— I have a book." },
        { word: "不客气", pinyin: "bú kè qì", translation: "you're welcome", level: 1, example: "「谢谢你！——不客气。」— Thank you! — You're welcome." },
        { word: "不", pinyin: "bù", translation: "no; not", level: 1, example: "「我不认识他。」— I don't know him." },
        { word: "菜", pinyin: "cài", translation: "vegetable; dish", level: 1, example: "「这个菜很好吃。」— This dish is delicious." },
        { word: "茶", pinyin: "chá", translation: "tea", level: 1, example: "「我喜欢喝茶。」— I like drinking tea." },
        { word: "吃", pinyin: "chī", translation: "to eat", level: 1, example: "「我吃米饭。」— I eat rice." },
        { word: "出租车", pinyin: "chū zū chē", translation: "taxi; cab", level: 1, example: "「我们坐出租车去机场。」— We take a taxi to the airport." },
        { word: "穿", pinyin: "chuān", translation: "to wear; to put on", level: 1, example: "「今天你穿了什么？」— What are you wearing today?" },
        { word: "打电话", pinyin: "dǎ diàn huà", translation: "to make a phone call", level: 1, example: "「我给你打电话。」— I'll call you." },
        { word: "大", pinyin: "dà", translation: "big; large", level: 1, example: "「这个苹果很大。」— This apple is big." },
        { word: "的", pinyin: "de", translation: "(possessive particle)", level: 1, example: "「这是我的书。」— This is my book." },
        { word: "点", pinyin: "diǎn", translation: "o'clock; dot; a little", level: 1, example: "「现在三点了。」— It's three o'clock now." },
        { word: "电脑", pinyin: "diàn nǎo", translation: "computer", level: 1, example: "「我的电脑很贵。」— My computer is expensive." },
        { word: "电视", pinyin: "diàn shì", translation: "television; TV", level: 1, example: "「他喜欢看电视。」— He likes watching TV." },
        { word: "电影", pinyin: "diàn yǐng", translation: "movie; film", level: 1, example: "「我们去看电影吧。」— Let's go see a movie." },
        { word: "东西", pinyin: "dōng xī", translation: "thing; stuff", level: 1, example: "「这个东西多少钱？」— How much is this thing?" },
        { word: "都", pinyin: "dōu", translation: "all; both", level: 1, example: "「我们都去学校。」— We all go to school." },
        { word: "读", pinyin: "dú", translation: "to read; to study", level: 1, example: "「她在读书。」— She is reading / studying." },
        { word: "对", pinyin: "duì", translation: "correct; right; toward", level: 1, example: "「你说得对。」— You are right." },
        { word: "多", pinyin: "duō", translation: "many; much; how (much)", level: 1, example: "「这里人很多。」— There are many people here." },
        { word: "饿", pinyin: "è", translation: "hungry", level: 1, example: "「我饿了，吃饭吧！」— I'm hungry, let's eat!" },
        { word: "二", pinyin: "èr", translation: "two", level: 1, example: "「现在是二月。」— It's February now." },
        { word: "饭馆", pinyin: "fàn guǎn", translation: "restaurant; eating house", level: 1, example: "「这家饭馆的菜很好吃。」— The food at this restaurant is delicious." },
        { word: "房间", pinyin: "fáng jiān", translation: "room", level: 1, example: "「我的房间很小。」— My room is small." },
        { word: "非常", pinyin: "fēi cháng", translation: "very; extremely", level: 1, example: "「我非常喜欢中国菜。」— I very much like Chinese food." },
        { word: "服务", pinyin: "fú wù", translation: "service; to serve", level: 1, example: "「这里的服务很好。」— The service here is very good." },
        { word: "咖啡", pinyin: "kā fēi", translation: "coffee", level: 1, example: "「他喜欢喝咖啡。」— He likes to drink coffee." },
        { word: "跟", pinyin: "gēn", translation: "and; with; to follow", level: 1, example: "「我跟他一起去。」— I go with him." },
        { word: "更", pinyin: "gèng", translation: "more; even more", level: 1, example: "「今天比昨天更热。」— Today is hotter than yesterday." },
        { word: "公园", pinyin: "gōng yuán", translation: "park", level: 1, example: "「我们在公园里散步。」— We walk in the park." },
        { word: "公司", pinyin: "gōng sī", translation: "company", level: 1, example: "「她在一个大公司工作。」— She works at a big company." },
        { word: "狗", pinyin: "gǒu", translation: "dog", level: 1, example: "「我家有一只狗。」— I have a dog at home." },
        { word: "贵", pinyin: "guì", translation: "expensive; precious", level: 1, example: "「这件衣服太贵了。」— This clothes is too expensive." },
        { word: "国", pinyin: "guó", translation: "country; nation", level: 1, example: "「中国是一个大国。」— China is a big country." },
        { word: "过", pinyin: "guò", translation: "to pass; to cross; too (much)", level: 1, example: "「请过来坐。」— Please come over and sit." },
        { word: "还", pinyin: "hái", translation: "still; yet; also", level: 1, example: "「我还有问题。」— I still have questions." },
        { word: "汉语", pinyin: "hàn yǔ", translation: "Chinese language", level: 1, example: "「她在学习汉语。」— She is learning Chinese." },
        { word: "好", pinyin: "hǎo", translation: "good; well", level: 1, example: "「你好吗？我很好。」— How are you? I'm fine." },
        { word: "号", pinyin: "hào", translation: "number; day of the month", level: 1, example: "「今天是五号。」— Today is the fifth." },
        { word: "喝", pinyin: "hē", translation: "to drink", level: 1, example: "「我想喝水。」— I want to drink water." },
        { word: "和", pinyin: "hé", translation: "and; together with", level: 1, example: "「我喝茶和咖啡。」— I drink tea and coffee." },
        { word: "后", pinyin: "hòu", translation: "behind; after", level: 1, example: "「请看后面。」— Look behind." },
        { word: "话", pinyin: "huà", translation: "speech; words; talk", level: 1, example: "「他会说法语。」— He can speak French." },
        { word: "家", pinyin: "jiā", translation: "home; family", level: 1, example: "「我回家吃饭。」— I go home to eat." },
        { word: "看见", pinyin: "kàn jiàn", translation: "to see", level: 1, example: "「我看见我的朋友了。」— I saw my friend." },
        { word: "可以", pinyin: "kě yǐ", translation: "can; may", level: 1, example: "「我可以进来吗？」— May I come in?" },
        { word: "课", pinyin: "kè", translation: "class; lesson", level: 1, example: "「我们的课九点开始。」— Our class starts at nine." },
        { word: "里", pinyin: "lǐ", translation: "inside; in", level: 1, example: "「猫在房间里。」— The cat is in the room." },
        { word: "两", pinyin: "liǎng", translation: "two (before measure words)", level: 1, example: "「我有两个哥哥。」— I have two older brothers." },
        { word: "人", pinyin: "rén", translation: "people; person", level: 1, example: "「中国人很多。」— There are many Chinese people." },
        { word: "认识", pinyin: "rèn shí", translation: "to know; to recognize", level: 1, example: "「很高兴认识你！」— Nice to meet you!" },
        { word: "日", pinyin: "rì", translation: "sun; day", level: 1, example: "「今天是什么日子？」— What's the date today?" },
        { word: "书", pinyin: "shū", translation: "book", level: 1, example: "「这本书很有意思。」— This book is interesting." },
        { word: "水", pinyin: "shuǐ", translation: "water", level: 1, example: "「请给我一杯水。」— Please give me a glass of water." },
        { word: "谁", pinyin: "shuí", translation: "who", level: 1, example: "「他是谁？」— Who is he?" },
        { word: "时间", pinyin: "shí jiān", translation: "time; period", level: 1, example: "「你没有时间吗？」— Don't you have time?" },
        { word: "什么", pinyin: "shén me", translation: "what", level: 1, example: "「这是什么？」— What is this?" },
        { word: "十", pinyin: "shí", translation: "ten", level: 1, example: "「他有十个学生。」— He has ten students." },
        { word: "是", pinyin: "shì", translation: "to be; yes", level: 1, example: "「我是学生。」— I am a student." },
        { word: "手", pinyin: "shǒu", translation: "hand", level: 1, example: "「我的手很大。」— My hands are big." },
        { word: "树", pinyin: "shù", translation: "tree", level: 1, example: "「树上有很多叶子。」— There are many leaves on the tree." },
        { word: "岁", pinyin: "suì", translation: "year (of age)", level: 1, example: "「我妈妈四十岁。」— My mother is forty years old." },
        { word: "它", pinyin: "tā", translation: "it", level: 1, example: "「这是一只猫，它很可爱。」— This is a cat, it's cute." },
        { word: "想", pinyin: "xiǎng", translation: "to think; to want", level: 1, example: "「我想去中国。」— I want to go to China." },
        { word: "小", pinyin: "xiǎo", translation: "small; little", level: 1, example: "「我有一个妹妹。」— I have a younger sister." },
        { word: "少", pinyin: "shǎo", translation: "few; little", level: 1, example: "「这儿的人很少。」— There are few people here." },
        { word: "学校", pinyin: "xué xiào", translation: "school", level: 1, example: "「学校在公园旁边。」— The school is next to the park." },
        { word: "学生", pinyin: "xué shēng", translation: "student", level: 1, example: "「她是我的学生。」— She is my student." },
        { word: "一", pinyin: "yī", translation: "one", level: 1, example: "「我要一个杯子。」— I want one cup." },
        { word: "已经", pinyin: "yǐ jīng", translation: "already", level: 1, example: "「他已经走了。」— He has already left." },
        { word: "鱼", pinyin: "yú", translation: "fish", level: 1, example: "「我喜欢吃鱼。」— I like to eat fish." },
        { word: "中国", pinyin: "Zhōng guó", translation: "China", level: 1, example: "「我住在中国。」— I live in China." },
        { word: "住", pinyin: "zhù", translation: "to live; to stay", level: 1, example: "「你住在哪儿？」— Where do you live?" },
        { word: "工作", pinyin: "gōng zuò", translation: "to work; job", level: 1, example: "「我在公司工作。」— I work at a company." },
        { word: "喜欢", pinyin: "xǐ huān", translation: "to like", level: 1, example: "「我喜欢学习汉语。」— I like learning Chinese." },
        { word: "坐", pinyin: "zuò", translation: "to sit; to take (transport)", level: 1, example: "「请坐！」— Please sit down!" },
        { word: "朋友", pinyin: "péng yǒu", translation: "friend", level: 1, example: "「他是我的好朋友。」— He is my good friend." },
        { word: "现在", pinyin: "xiàn zài", translation: "now; nowadays", level: 1, example: "「现在几点了？」— What time is it now?" },
        { word: "明天", pinyin: "míng tiān", translation: "tomorrow", level: 1, example: "「明天见！」— See you tomorrow!" },
        { word: "名字", pinyin: "míng zì", translation: "name", level: 1, example: "「你的名字是什么？」— What is your name?" },
        { word: "妈妈", pinyin: "mā mā", translation: "mother; mom", level: 1, example: "「我妈妈在做饭。」— My mother is cooking." },
        { word: "马", pinyin: "mǎ", translation: "horse", level: 1, example: "「我想学骑马。」— I want to learn horseback riding." },
        { word: "猫", pinyin: "māo", translation: "cat", level: 1, example: "「猫在家里。」— The cat is at home." },
        { word: "没", pinyin: "méi", translation: "not have; no", level: 1, example: "「我没有钱。」— I don't have money." },
        { word: "句子", pinyin: "jù zi", translation: "sentence", level: 1, example: "「请再说一遍这个句子。」— Please repeat this sentence." },
        { word: "太", pinyin: "tài", translation: "too; extremely", level: 1, example: "「今天太热了！」— It's too hot today!" },
        { word: "她", pinyin: "tā", translation: "she; her", level: 1, example: "「她是我的老师。」— She is my teacher." },
        { word: "天气", pinyin: "tiān qì", translation: "weather", level: 1, example: "「今天的天气真好。」— The weather is really nice today." },
        { word: "他", pinyin: "tā", translation: "he; him", level: 1, example: "「他是我哥哥。」— He is my older brother." },
        { word: "他们", pinyin: "tā men", translation: "they; them", level: 1, example: "「他们是学生。」— They are students." },
        { word: "疼", pinyin: "téng", translation: "painful; to hurt", level: 1, example: "「我的头很疼。」— My head hurts." },
        { word: "身体", pinyin: "shēn tǐ", translation: "body; health", level: 1, example: "「请注意身体。」— Take care of your health." },
        { word: "听", pinyin: "tīng", translation: "to listen; to hear", level: 1, example: "「我喜欢听音乐。」— I like listening to music." },
        { word: "同学", pinyin: "tóng xué", translation: "classmate", level: 1, example: "「她是我的同学。」— She is my classmate." },
        { word: "老师", pinyin: "lǎo shī", translation: "teacher", level: 1, example: "「老师在教室里。」— The teacher is in the classroom." },
        { word: "了", pinyin: "le", translation: "(aspect particle)", level: 1, example: "「下雨了！」— It's raining!" },
        { word: "冷", pinyin: "lěng", translation: "cold", level: 1, example: "「今天很冷。」— It's very cold today." },
        { word: "离", pinyin: "lí", translation: "away from; to leave", level: 1, example: "「学校离我家很近。」— The school is close to my home." },
        { word: "路", pinyin: "lù", translation: "road; path", level: 1, example: "「这条路通向火车站。」— This road leads to the station." },
        { word: "旅游", pinyin: "lǚ yóu", translation: "to travel; tourism", level: 1, example: "「我们去北京旅游。」— We travel to Beijing." },
        { word: "卖", pinyin: "mài", translation: "to sell", level: 1, example: "「这个商店卖水果。」— This store sells fruit." },
        { word: "买", pinyin: "mǎi", translation: "to buy", level: 1, example: "「我要买一些水果。」— I want to buy some fruit." },
        { word: "米饭", pinyin: "mǐ fàn", translation: "cooked rice", level: 1, example: "「我们每天吃米饭。」— We eat rice every day." },
        { word: "妹妹", pinyin: "mèi mèi", translation: "younger sister", level: 1, example: "「我妹妹今年十八岁。」— My younger sister is eighteen this year." },
        { word: "们", pinyin: "men", translation: "(plural suffix)", level: 1, example: "「我们一起去。」— We go together." },
        { word: "男", pinyin: "nán", translation: "male; man", level: 1, example: "「那个男人是谁？」— Who is that man?" },
        { word: "你", pinyin: "nǐ", translation: "you", level: 1, example: "「你叫什么名字？」— What's your name?" },
        { word: "您", pinyin: "nín", translation: "you (polite)", level: 1, example: "「您好，请进！」— Hello, please come in!" },
        { word: "女儿", pinyin: "nǚ ér", translation: "daughter", level: 1, example: "「她的女儿很漂亮。」— Her daughter is beautiful." },
        { word: "女人", pinyin: "nǚ rén", translation: "woman", level: 1, example: "「那个女人在做什么？」— What is that woman doing?" },
        { word: "裙子", pinyin: "qún zi", translation: "skirt", level: 1, example: "「这条裙子很漂亮。」— This skirt is pretty." },
        { word: "去", pinyin: "qù", translation: "to go", level: 1, example: "「我去学校。」— I go to school." },
        { word: "热", pinyin: "rè", translation: "hot", level: 1, example: "「夏天很热。」— Summer is hot." },
        { word: "三", pinyin: "sān", translation: "three", level: 1, example: "「我三个朋友在中国。」— Three of my friends are in China." },
        { word: "商店", pinyin: "shāng diàn", translation: "store; shop", level: 1, example: "「商店九点开门。」— The store opens at nine." },
        { word: "上", pinyin: "shàng", translation: "up; on; last", level: 1, example: "「书在桌子上。」— The book is on the table." },
        { word: "上午", pinyin: "shàng wǔ", translation: "morning (AM)", level: 1, example: "「我们上午上课。」— We have class in the morning." },
        { word: "下午", pinyin: "xià wǔ", translation: "afternoon; PM", level: 1, example: "「今天下午有空吗？」— Are you free this afternoon?" },
        { word: "生病", pinyin: "shēng bìng", translation: "to fall ill", level: 1, example: "「他生病了，不去学校。」— He's sick and won't go to school." },
        { word: "生日", pinyin: "shēng rì", translation: "birthday", level: 1, example: "「祝你生日快乐！」— Happy birthday to you!" },
        { word: "上海", pinyin: "Shàng hǎi", translation: "Shanghai", level: 1, example: "「上海很大也很漂亮。」— Shanghai is big and beautiful." },
        { word: "说话", pinyin: "shuō huà", translation: "to speak; to talk", level: 1, example: "「请小声说话。」— Please speak quietly." },
        { word: "水果", pinyin: "shuǐ guǒ", translation: "fruit", level: 1, example: "「我爱吃水果。」— I love eating fruit." },
        { word: "睡觉", pinyin: "shuì jiào", translation: "to sleep", level: 1, example: "「我要去睡觉了。」— I'm going to sleep." },
        { word: "医院", pinyin: "yī yuàn", translation: "hospital", level: 1, example: "「他在医院工作。」— He works at the hospital." },
        { word: "医生", pinyin: "yī shēng", translation: "doctor", level: 1, example: "「医生说是小毛病。」— The doctor says it's minor." },
        { word: "药", pinyin: "yào", translation: "medicine", level: 1, example: "「请按时吃药。」— Please take your medicine on time." },
        { word: "运动", pinyin: "yùn dòng", translation: "sports; to exercise", level: 1, example: "「我每天做运动。」— I exercise every day." },
        { word: "飞机", pinyin: "fēi jī", translation: "airplane", level: 1, example: "「飞机在天上飞。」— The plane flies in the sky." },
        { word: "汽车", pinyin: "qì chē", translation: "car; automobile", level: 1, example: "「他的车是新汽车。」— His car is new." },
        { word: "自行车", pinyin: "zì xíng chē", translation: "bicycle", level: 1, example: "「我骑自行车上班。」— I ride my bike to work." },
        { word: "中间", pinyin: "zhōng jiān", translation: "middle; center", level: 1, example: "「他坐在中间。」— He sits in the middle." },
        { word: "前", pinyin: "qián", translation: "before; in front of", level: 1, example: "「学校前面有公园。」— There's a park in front of the school." },
        { word: "年", pinyin: "nián", translation: "year", level: 1, example: "「我学习中文一年了。」— I've studied Chinese for a year." },
        { word: "月", pinyin: "yuè", translation: "month; moon", level: 1, example: "「一月很冷。」— January is cold." },
        { word: "块", pinyin: "kuài", translation: "yuan (unit); piece", level: 1, example: "「这个三块钱。」— This costs three yuan." },
        { word: "多少", pinyin: "duō shǎo", translation: "how many; how much", level: 1, example: "「多少钱？」— How much is it?" },
        { word: "几", pinyin: "jǐ", translation: "how many; a few", level: 1, example: "「你几岁了？」— How old are you?" },
        { word: "这", pinyin: "zhè", translation: "this", level: 1, example: "「这是我妈妈。」— This is my mother." },
        { word: "那", pinyin: "nà", translation: "that", level: 1, example: "「那是我的书。」— That is my book." },
        { word: "哪儿", pinyin: "nǎ ér", translation: "where", level: 1, example: "「你去哪儿？」— Where are you going?" },
        { word: "哪", pinyin: "nǎ", translation: "which", level: 1, example: "「你要哪个？」— Which one do you want?" },
        { word: "下雨", pinyin: "xià yǔ", translation: "to rain", level: 1, example: "「他很喜欢下雨。」— He/She really likes rain." },
        { word: "电话", pinyin: "diàn huà", translation: "telephone; phone call", level: 1, example: "「这个电话很有名。」— This 'telephone' is very well known." },
        { word: "火车", pinyin: "huǒ chē", translation: "train", level: 1, example: "「我们坐火车去。」— We go by train." },

        // — HSK 2 · Élémentaire
        { word: "吧", pinyin: "ba", translation: "(modal particle: suggestion)", level: 2, example: "「我们走吧！」— Let's go!" },
        { word: "百", pinyin: "bǎi", translation: "hundred", level: 2, example: "「一百个人来了。」— One hundred people came." },
        { word: "班", pinyin: "bān", translation: "class; team", level: 2, example: "「我们是同班。」— We're in the same class." },
        { word: "帮", pinyin: "bāng", translation: "to help", level: 2, example: "「能帮我一下吗？」— Can you help me?" },
        { word: "洗澡", pinyin: "xǐ zǎo", translation: "to shower; to bathe", level: 2, example: "「我晚上洗澡。」— I shower in the evening." },
        { word: "觉得", pinyin: "jué de", translation: "to feel; to think", level: 2, example: "「我觉得很好。」— I think it's great." },
        { word: "欢迎", pinyin: "huān yíng", translation: "to welcome; welcome", level: 2, example: "「欢迎来到北京！」— Welcome to Beijing!" },
        { word: "告诉", pinyin: "gào sù", translation: "to tell", level: 2, example: "「请告诉我你的地址。」— Please tell me your address." },
        { word: "歌", pinyin: "gē", translation: "song", level: 2, example: "「这首歌很好听。」— This song is nice." },
        { word: "哥哥", pinyin: "gē gē", translation: "older brother", level: 2, example: "「我哥哥在工作。」— My older brother works." },
        { word: "给", pinyin: "gěi", translation: "to give; for", level: 2, example: "「请给他一本书。」— Please give him a book." },
        { word: "个", pinyin: "gè", translation: "(general classifier)", level: 2, example: "「我要三个苹果。」— I want three apples." },
        { word: "个子", pinyin: "gè zi", translation: "height (of a person)", level: 2, example: "「他个子很高。」— He is very tall." },
        { word: "国家", pinyin: "guó jiā", translation: "country; nation", level: 2, example: "「你来自哪个国家？」— What country are you from?" },
        { word: "果汁", pinyin: "guǒ zhī", translation: "fruit juice", level: 2, example: "「我想喝一杯果汁。」— I'd like a glass of juice." },
        { word: "过程", pinyin: "guò chéng", translation: "process; course of events", level: 2, example: "「重要的是过程。」— The process is what matters." },
        { word: "海军", pinyin: "hǎi jūn", translation: "navy", level: 2, example: "「他在海军工作。」— He serves in the navy." },
        { word: "害怕", pinyin: "hài pà", translation: "to be afraid", level: 2, example: "「我不怕黑。」— I'm not afraid of the dark." },
        { word: "河", pinyin: "hé", translation: "river", level: 2, example: "「这条河很长。」— This river is very long." },
        { word: "湖", pinyin: "hú", translation: "lake", level: 2, example: "「湖边很美。」— The lakeside is beautiful." },
        { word: "环境", pinyin: "huán jìng", translation: "environment", level: 2, example: "「这里的环境很好。」— The environment here is good." },
        { word: "换", pinyin: "huàn", translation: "to change; to exchange", level: 2, example: "「我想换钱。」— I want to exchange money." },
        { word: "灰", pinyin: "huī", translation: "gray; ash", level: 2, example: "「那件衣服是灰色的。」— That garment is gray." },
        { word: "回", pinyin: "huí", translation: "to return; time; round", level: 2, example: "「我要回家。」— I want to go back home." },
        { word: "回答", pinyin: "huí dá", translation: "to answer; answer", level: 2, example: "「请回答问题。」— Please answer the question." },
        { word: "会议", pinyin: "huì yì", translation: "meeting; conference", level: 2, example: "「会议三点开始。」— The meeting starts at three." },
        { word: "或者", pinyin: "huò zhě", translation: "or; perhaps", level: 2, example: "「喝茶或者喝咖啡？」— Tea or coffee?" },
        { word: "基本", pinyin: "jī běn", translation: "basic; fundamental", level: 2, example: "「这是基本要求。」— This is a basic requirement." },
        { word: "极", pinyin: "jí", translation: "extreme; utmost", level: 2, example: "「这是南极。」— This is the South Pole." },
        { word: "及", pinyin: "jí", translation: "and; as well as", level: 2, example: "「老师及学生都来了。」— The teacher and students came." },
        { word: "级别", pinyin: "jí bié", translation: "grade; level", level: 2, example: "「这个级别的考试很难。」— The test at this level is hard." },
        { word: "即使", pinyin: "jí shǐ", translation: "even if; even though", level: 2, example: "「即使下雨我也去。」— Even if it rains, I'll go." },
        { word: "挤", pinyin: "jǐ", translation: "crowded; to squeeze", level: 2, example: "「早上的地铁很挤。」— The metro is crowded in the morning." },
        { word: "计划", pinyin: "jì huà", translation: "plan; to plan", level: 2, example: "「你有什么计划？」— Do you have any plans?" },
        { word: "计", pinyin: "jì", translation: "to calculate; plan", level: 2, example: "「让我计算一下。」— Let me calculate." },
        { word: "记忆", pinyin: "jì yì", translation: "memory", level: 2, example: "「好的记忆很重要。」— Good memory is important." },
        { word: "季节", pinyin: "jì jié", translation: "season", level: 2, example: "「春天是最好的季节。」— Spring is the best season." },
        { word: "技术", pinyin: "jì shù", translation: "technology; skill", level: 2, example: "「他的技术很好。」— His skill is very good." },
        { word: "继续", pinyin: "jì xù", translation: "to continue", level: 2, example: "「请继续说。」— Please go on." },
        { word: "加班", pinyin: "jiā bān", translation: "to work overtime", level: 2, example: "「我今天要加班。」— I have to work overtime today." },
        { word: "家具", pinyin: "jiā jù", translation: "furniture", level: 2, example: "「我们买新家具。」— We're buying new furniture." },
        { word: "价格", pinyin: "jià gé", translation: "price", level: 2, example: "「价格太高了。」— The price is too high." },
        { word: "坚持", pinyin: "jiān chí", translation: "to persist; to insist", level: 2, example: "「坚持就是胜利。」— Perseverance is victory." },
        { word: "减肥", pinyin: "jiǎn féi", translation: "to lose weight", level: 2, example: "「她想减肥。」— She wants to lose weight." },
        { word: "减少", pinyin: "jiǎn shǎo", translation: "to decrease; to reduce", level: 2, example: "「请减少开销。」— Please cut expenses." },
        { word: "建议", pinyin: "jiàn yì", translation: "to suggest; suggestion", level: 2, example: "「我有一个建议。」— I have a suggestion." },
        { word: "健康", pinyin: "jiàn kāng", translation: "health; healthy", level: 2, example: "「健康最重要。」— Health is most important." },
        { word: "饺子", pinyin: "jiǎo zi", translation: "dumpling", level: 2, example: "「我们吃饺子吧。」— Let's eat dumplings!" },
        { word: "接受", pinyin: "jiē shòu", translation: "to accept", level: 2, example: "「我接受你的邀请。」— I accept your invitation." },
        { word: "街道", pinyin: "jiē dào", translation: "street", level: 2, example: "「这条街很热闹。」— This street is lively." },
        { word: "节目", pinyin: "jié mù", translation: "program; performance", level: 2, example: "「这个节目很好看。」— This show is great." },
        { word: "结婚", pinyin: "jié hūn", translation: "to get married", level: 2, example: "「他们明年结婚。」— They're getting married next year." },
        { word: "结束", pinyin: "jié shù", translation: "to finish; to end", level: 2, example: "「会议结束了。」— The meeting is over." },
        { word: "解决", pinyin: "jiě jué", translation: "to solve; to resolve", level: 2, example: "「我们能解决这个问题。」— We can solve this problem." },
        { word: "借", pinyin: "jiè", translation: "to borrow; to lend", level: 2, example: "「能借我一支笔吗？」— Can you lend me a pen?" },
        { word: "介绍", pinyin: "jiè shào", translation: "to introduce", level: 2, example: "「让我介绍一下。」— Let me introduce." },
        { word: "金额", pinyin: "jīn é", translation: "amount; sum of money", level: 2, example: "「金额不大。」— The amount is small." },
        { word: "金", pinyin: "jīn", translation: "gold; metal", level: 2, example: "「金色很漂亮。」— Gold color is beautiful." },
        { word: "仅", pinyin: "jǐn", translation: "merely; only", level: 2, example: "「仅此一次。」— Just this once." },
        { word: "进行", pinyin: "jìn xíng", translation: "to carry on; to conduct", level: 2, example: "「比赛正在进行。」— The game is underway." },
        { word: "经济", pinyin: "jīng jì", translation: "economy", level: 2, example: "「经济发展很快。」— The economy grows fast." },
        { word: "经历", pinyin: "jīng lì", translation: "experience; to go through", level: 2, example: "「这是一次有趣的经历。」— It's an interesting experience." },
        { word: "尽管", pinyin: "jǐn guǎn", translation: "although; even though", level: 2, example: "「尽管累，他还工作。」— Though tired, he still works." },
        { word: "银行", pinyin: "yín háng", translation: "bank", level: 2, example: "「银行几点关门？」— When does the bank close?" },
        { word: "应该", pinyin: "yīng gāi", translation: "should; ought to", level: 2, example: "「你应该休息。」— You should rest." },
        { word: "影响", pinyin: "yǐng xiǎng", translation: "influence; to affect", level: 2, example: "「天气影响心情。」— Weather affects mood." },
        { word: "响", pinyin: "xiǎng", translation: "sound; to make a noise", level: 2, example: "「外面很响。」— It's noisy outside." },
        { word: "手机", pinyin: "shǒu jī", translation: "cell phone", level: 2, example: "「我的手机在哪儿？」— Where's my cell phone?" },
        { word: "事情", pinyin: "shì qíng", translation: "matter; affair", level: 2, example: "「这件事很重要。」— This matter is important." },
        { word: "适合", pinyin: "shì hé", translation: "to fit; to suit", level: 2, example: "「这件衣服很适合你。」— This outfit suits you." },
        { word: "适应", pinyin: "shì yìng", translation: "to adapt", level: 2, example: "「我适应了这里的生活。」— I've adapted to life here." },
        { word: "首都", pinyin: "shǒu dū", translation: "capital city", level: 2, example: "「北京是中国的首都。」— Beijing is the capital of China." },
        { word: "双", pinyin: "shuāng", translation: "double; pair", level: 2, example: "「我买了一双鞋。」— I bought a pair of shoes." },
        { word: "希望", pinyin: "xī wàng", translation: "hope; to hope", level: 2, example: "「我希望你来。」— I hope you'll come." },
        { word: "由", pinyin: "yóu", translation: "from; by; due to", level: 2, example: "「会议由他主持。」— He chairs the meeting." },
        { word: "生活", pinyin: "shēng huó", translation: "life; to live", level: 2, example: "「这里的生活很方便。」— Life here is convenient." },
        { word: "生物", pinyin: "shēng wù", translation: "organism; living being", level: 2, example: "「生物课很有趣。」— Biology class is fun." },
        { word: "声", pinyin: "shēng", translation: "sound; voice", level: 2, example: "「他大声说话。」— He speaks loudly." },
        { word: "生", pinyin: "shēng", translation: "to be born; raw; life", level: 2, example: "「这个词是什么意思？」— What does this word mean?" },
        { word: "示范", pinyin: "shì fàn", translation: "to demonstrate", level: 2, example: "「请做一次示范。」— Please demonstrate." },
        { word: "试", pinyin: "shì", translation: "to try; to test", level: 2, example: "「试一下吧。」— Give it a try." },
        { word: "市场", pinyin: "shì chǎng", translation: "market", level: 2, example: "「我们去市场买菜。」— We shop at the market." },
        { word: "微笑", pinyin: "wēi xiào", translation: "to smile", level: 2, example: "「她对我微笑。」— She smiles at me." },
        { word: "死", pinyin: "sǐ", translation: "to die", level: 2, example: "「这只鸟死了。」— This bird died." },
        { word: "送", pinyin: "sòng", translation: "to give (present); to escort", level: 2, example: "「我去送你。」— I'll walk you out." },
        { word: "速度", pinyin: "sù dù", translation: "speed", level: 2, example: "「请降低速度。」— Please slow down." },
        { word: "度", pinyin: "dù", translation: "degree", level: 2, example: "「今天二十五度。」— It's 25 degrees today." },
        { word: "旅行", pinyin: "lǚ xíng", translation: "to travel; journey", level: 2, example: "「我想去日本旅行。」— I want to travel to Japan." },
        { word: "餐馆", pinyin: "cān guǎn", translation: "restaurant", level: 2, example: "「这家餐馆很有名。」— This restaurant is famous." },
        { word: "年龄", pinyin: "nián líng", translation: "age", level: 2, example: "「请不要问年龄。」— Don't ask about age." },
        { word: "弄", pinyin: "nòng", translation: "to do; to handle", level: 2, example: "「我来弄晚饭。」— I'll fix dinner." },
        { word: "提高", pinyin: "tí gāo", translation: "to improve; to raise", level: 2, example: "「我想提高汉语水平。」— I want to improve my Chinese." },
        { word: "体", pinyin: "tǐ", translation: "body; form", level: 2, example: "「体育很重要。」— Physical education matters." },
        { word: "跳舞", pinyin: "tiào wǔ", translation: "to dance", level: 2, example: "「她喜欢跳舞。」— She loves dancing." },
        { word: "贴", pinyin: "tiē", translation: "to stick; to paste", level: 2, example: "「请把海报贴在墙上。」— Paste the poster on the wall." },
        { word: "翻译", pinyin: "fān yì", translation: "to translate; translator", level: 2, example: "「请翻译这句话。」— Please translate this sentence." },
        { word: "统计", pinyin: "tǒng jì", translation: "statistics; to count up", level: 2, example: "「这些统计数据有用。」— These statistics are useful." },
        { word: "条", pinyin: "tiáo", translation: "(classifier for long thin things)", level: 2, example: "「我养了一条狗。」— I have a dog." },
        { word: "同意", pinyin: "tóng yì", translation: "to agree", level: 2, example: "「我同意你的看法。」— I agree with you." },
        { word: "休息", pinyin: "xiū xī", translation: "to rest", level: 2, example: "「我们需要休息。」— We need to rest." },
        { word: "习惯", pinyin: "xí guàn", translation: "habit; to be used to", level: 2, example: "「我习惯了早起。」— I'm used to getting up early." },
        { word: "次", pinyin: "cì", translation: "times; order; next", level: 2, example: "「我去过三次。」— I've been there three times." },
        { word: "聪明", pinyin: "cōng míng", translation: "smart; clever", level: 2, example: "「这个孩子很聪明。」— This child is smart." },
        { word: "毛巾", pinyin: "máo jīn", translation: "towel", level: 2, example: "「请给我一条毛巾。」— Please give me a towel." },
        { word: "汉堡", pinyin: "hàn bǎo", translation: "hamburger", level: 2, example: "「他喜欢吃汉堡。」— He likes eating hamburgers." },
        { word: "好看", pinyin: "hǎo kàn", translation: "good-looking; enjoyable", level: 2, example: "「这部电影真好看！」— This movie is really good!" },
        { word: "好吃", pinyin: "hǎo chī", translation: "delicious; tasty", level: 2, example: "「中国菜很好吃。」— Chinese food is delicious." },
        { word: "校长", pinyin: "xiào zhǎng", translation: "principal; headmaster", level: 2, example: "「校长讲话了。」— The principal spoke." },
        { word: "意见", pinyin: "yì jiàn", translation: "opinion; idea", level: 2, example: "「你有什么意见？」— What's your opinion?" },
        { word: "月亮", pinyin: "yuè liàng", translation: "moon", level: 2, example: "「今晚月亮很亮。」— The moon is bright tonight." },
        { word: "约会", pinyin: "yuē huì", translation: "date; appointment", level: 2, example: "「我们七点约会。」— We have a date at seven." },
        { word: "也许", pinyin: "yě xǔ", translation: "perhaps; maybe", level: 2, example: "「也许明天会下雨。」— Maybe it will rain tomorrow." },
        { word: "感冒", pinyin: "gǎn mào", translation: "to catch a cold", level: 2, example: "「我感冒了。」— I caught a cold." },
        { word: "出", pinyin: "chū", translation: "to go out; to produce", level: 2, example: "「他出门了。」— He went out." },
        { word: "单词", pinyin: "dān cí", translation: "word; vocabulary", level: 2, example: "「我每天记十个单词。」— I memorize ten words a day." },
        { word: "到", pinyin: "dào", translation: "to arrive; until", level: 2, example: "「我们六点到。」— We arrive at six." },
        { word: "儿子", pinyin: "ér zi", translation: "son", level: 2, example: "「他的儿子十岁了。」— His son is ten years old." },
        { word: "孩子", pinyin: "hái zi", translation: "child", level: 2, example: "「孩子们在学校。」— The children are at school." },
        { word: "颜色", pinyin: "yán sè", translation: "color", level: 2, example: "「你喜欢什么颜色？」— What color do you like?" },
        { word: "眼睛", pinyin: "yǎn jīng", translation: "eye", level: 2, example: "「她的眼睛很大。」— She has big eyes." },
        { word: "耳朵", pinyin: "ěr duǒ", translation: "ear", level: 2, example: "「兔子的耳朵很长。」— The rabbit's ears are long." },
        { word: "因为", pinyin: "yīn wèi", translation: "because", level: 2, example: "「这个因为很有名。」— This 'because' is very well known." },
        { word: "为", pinyin: "wèi", translation: "for; because of", level: 2, example: "「这个为很有名。」— This 'for' is very well known." },
        { word: "为了", pinyin: "wèi le", translation: "in order to; for", level: 2, example: "「这个为了很有名。」— This 'in order to' is very well known." },
        { word: "所有", pinyin: "suǒ yǒu", translation: "all; every", level: 2, example: "「这个所有很有名。」— This 'all' is very well known." },
        { word: "需要", pinyin: "xū yào", translation: "to need", level: 2, example: "「他很喜欢需要。」— He/She really likes need." },
        { word: "要么", pinyin: "yào me", translation: "either… or…", level: 2, example: "「这个要么很有名。」— This 'either… or…' is very well known." },
        { word: "每", pinyin: "měi", translation: "every; each", level: 2, example: "「这个每很有名。」— This 'every' is very well known." },
        { word: "游泳", pinyin: "yóu yǒng", translation: "to swim", level: 2, example: "「他很喜欢游泳。」— He/She really likes swim." },
        { word: "生命", pinyin: "shēng mìng", translation: "life; vitality", level: 2, example: "「这个生命很有名。」— This 'life' is very well known." },
        { word: "天", pinyin: "tiān", translation: "day; sky", level: 2, example: "「一天有二十四小时。」— A day has twenty-four hours." },
        { word: "弟弟", pinyin: "dì di", translation: "younger brother", level: 2, example: "「我弟弟在学校。」— My younger brother is at school." },
        { word: "帮助", pinyin: "bāng zhù", translation: "to help; assistance", level: 2, example: "「谢谢你的帮助！」— Thanks for your help!" },
        { word: "担心", pinyin: "dān xīn", translation: "to worry", level: 2, example: "「别为我担心。」— Don't worry about me." },
        { word: "窗户", pinyin: "chuāng hù", translation: "window", level: 2, example: "「请打开窗户。」— Please open the window." },
        { word: "城市", pinyin: "chéng shì", translation: "city", level: 2, example: "「上海是一座大城市。」— Shanghai is a big city." },
        { word: "新闻", pinyin: "xīn wén", translation: "news", level: 2, example: "「你看今天的新闻吗？」— Do you watch the news today?" },
        { word: "奇怪", pinyin: "qí guài", translation: "strange; odd", level: 2, example: "「这个奇怪很有名。」— This 'strange' is very well known." },
        { word: "牛奶", pinyin: "niú nǎi", translation: "milk", level: 2, example: "「这个牛奶很有名。」— This 'milk' is very well known." },
        { word: "迟到", pinyin: "chí dào", translation: "to arrive late", level: 2, example: "「对不起，我迟到了。」— Sorry, I'm late." },
        { word: "离开", pinyin: "lí kāi", translation: "to leave; to depart", level: 2, example: "「我们五点离开。」— We leave at five." },
        { word: "刚才", pinyin: "gāng cái", translation: "just now; a moment ago", level: 2, example: "「他刚才在这儿。」— He was just here." },
        { word: "分钟", pinyin: "fēn zhōng", translation: "minute", level: 2, example: "「请等五分钟。」— Please wait five minutes." },
        { word: "小时", pinyin: "xiǎo shí", translation: "hour", level: 2, example: "「考试两个小时。」— The exam lasts two hours." },
        { word: "去年", pinyin: "qù nián", translation: "last year", level: 2, example: "「去年我去了日本。」— Last year I went to Japan." },
        { word: "今年", pinyin: "jīn nián", translation: "this year", level: 2, example: "「今年我学汉语。」— This year I study Chinese." }
      ]
    }
  };

  // Niveaux HSK publiés : seuls HSK 1 et 2 sont disponibles pour le moment.
  // (Les niveaux 3 à 6 pourront être ajoutés plus tard dans les données.)
  const LEVEL_NAMES = {
    1: 'HSK 1 · Débutant',
    2: 'HSK 2 · Élémentaire',
    3: 'HSK 3 · Intermédiaire',
    4: 'HSK 4 · Avancé',
    5: 'HSK 5 · Expert',
    6: 'HSK 6 · Maîtrise'
  };
  const AVAILABLE_LEVELS = [1, 2];

  const VIEW_TITLES = {
    study: 'Étudier',
    stats: 'Progression',
    decks: 'Decks',
    settings: 'Réglages'
  };

  // ============ ÉTAT ============
  let currentLang = 'fr';
  let levelFilter = 0; // 0 = tous les niveaux
  let currentCardIndex = 0;
  let toastTimer = null;
  let session = { seen: 0, known: 0, review: 0 };

  function defaultStats() {
    return {
      streak: 1,
      cards: 0,
      known: 0,
      total: 0,
      lastDate: new Date().toDateString(),
      byDeck: { fr: { total: 0, known: 0 }, en: { total: 0, known: 0 } }
    };
  }

  function defaultPrefs() {
    return { rate: DEFAULT_RATE, shuffle: false, theme: 'light' };
  }

  function loadJSON(key, mergeDefaults) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return mergeDefaults();
      return Object.assign(mergeDefaults(), JSON.parse(raw));
    } catch (err) {
      console.warn('LingoPulse : données illisibles (' + key + '), réinitialisation.', err);
      return mergeDefaults();
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('LingoPulse : impossible de sauvegarder (' + key + ').', err);
    }
  }

  const stats = loadJSON(STORAGE_KEY, defaultStats);
  const prefs = loadJSON(PREFS_KEY, defaultPrefs);

  // Tolère un schéma obsolète pour byDeck
  if (!stats.byDeck || typeof stats.byDeck !== 'object') {
    stats.byDeck = { fr: { total: 0, known: 0 }, en: { total: 0, known: 0 } };
  }

  function saveStats() { saveJSON(STORAGE_KEY, stats); }
  function savePrefs() { saveJSON(PREFS_KEY, prefs); }

  // Met à jour la série quotidienne au chargement
  function refreshStreak() {
    const today = new Date().toDateString();
    if (stats.lastDate === today) return;

    const diff = Math.round(
      (new Date(today).getTime() - new Date(stats.lastDate).getTime()) / MS_PER_DAY
    );
    if (diff === 1) {
      stats.streak += 1;
    } else if (diff > 1) {
      stats.streak = 1;
    }
    stats.lastDate = today;
    saveStats();
  }

  // ============ RÉFÉRENCES DOM ============
  const el = {
    sidebar: document.querySelector('.sidebar'),
    menuBtn: document.getElementById('menuBtn'),
    overlay: document.getElementById('overlay'),
    sideItems: Array.from(document.querySelectorAll('.side-item[data-view]')),
    views: Array.from(document.querySelectorAll('.view')),
    viewTitle: document.getElementById('viewTitle'),
    deckSelect: document.getElementById('deckSelect'),
    flashcard: document.getElementById('flashcard'),
    wordFront: document.getElementById('wordFront'),
    phonetic: document.getElementById('phonetic'),
    wordBack: document.getElementById('wordBack'),
    example: document.getElementById('example'),
    cardLang: document.getElementById('cardLang'),
    levelChips: document.getElementById('levelChips'),
    audioBtn: document.getElementById('audioBtn'),
    btnKnow: document.getElementById('btnKnow'),
    btnReview: document.getElementById('btnReview'),
    progressFill: document.getElementById('progressFill'),
    cardCounter: document.getElementById('cardCounter'),
    streakValue: document.getElementById('streakValue'),
    cardsValue: document.getElementById('cardsValue'),
    successValue: document.getElementById('successValue'),
    sideStreak: document.getElementById('sideStreak'),
    sessionSeen: document.getElementById('sessionSeen'),
    sessionKnown: document.getElementById('sessionKnown'),
    sessionReview: document.getElementById('sessionReview'),
    miniKnown: document.getElementById('miniKnown'),
    miniReview: document.getElementById('miniReview'),
    btnResetSession: document.getElementById('btnResetSession'),
    deckPreview: document.getElementById('deckPreview'),
    kpiStreak: document.getElementById('kpiStreak'),
    kpiCards: document.getElementById('kpiCards'),
    kpiSuccess: document.getElementById('kpiSuccess'),
    kpiMastered: document.getElementById('kpiMastered'),
    deckStatsBody: document.getElementById('deckStatsBody'),
    btnResetStats: document.getElementById('btnResetStats'),
    deckCards: document.getElementById('deckCards'),
    rateSlider: document.getElementById('rateSlider'),
    shuffleToggle: document.getElementById('shuffleToggle'),
    darkToggle: document.getElementById('darkToggle'),
    toast: document.getElementById('toast'),
    toastIcon: document.getElementById('toastIcon'),
    toastMsg: document.getElementById('toastMsg')
  };

  // ============ SÉLECTIONNEURS ============
  function currentDeck() {
    return vocab[currentLang];
  }

  // Cartes du deck courant filtrées selon le niveau HSK sélectionné.
  // « Tous » ne montre que les niveaux publiés (HSK 1 et 2 pour le moment).
  function activeCards() {
    const cards = currentDeck().cards;
    if (levelFilter === 0) {
      return cards.filter((c) => AVAILABLE_LEVELS.includes(c.level));
    }
    return cards.filter((c) => c.level === levelFilter);
  }

  function currentCard() {
    return activeCards()[currentCardIndex];
  }

  function successRate() {
    return stats.total > 0 ? Math.round((stats.known / stats.total) * 100) : 0;
  }

  // ============ NAVIGATION PAR VUES ============
  function switchView(view) {
    if (!VIEW_TITLES[view]) view = 'study';
    el.views.forEach((v) => v.classList.toggle('active', v.id === 'view-' + view));
    el.sideItems.forEach((b) => b.classList.toggle('active', b.dataset.view === view));
    el.viewTitle.textContent = VIEW_TITLES[view];
    closeMobileNav();
    if (view === 'stats') renderStatsView();
    if (view === 'decks') renderDecksView();
    window.scrollTo({ top: 0 });
  }

  // Menu mobile
  function openMobileNav() {
    el.sidebar.classList.add('open');
    document.body.classList.add('nav-open');
  }

  function closeMobileNav() {
    el.sidebar.classList.remove('open');
    document.body.classList.remove('nav-open');
  }

  // ============ AFFICHAGE ============
  function renderCard() {
    const data = currentDeck();
    const cards = activeCards();
    if (currentCardIndex >= cards.length) currentCardIndex = 0;
    const card = cards[currentCardIndex];
    el.wordFront.textContent = card.word;
    el.phonetic.textContent = card.pinyin;
    el.wordBack.textContent = card.translation;
    el.example.textContent = card.example;
    el.cardLang.innerHTML = `${data.flag} Mot à traduire` +
      `<span class="card-level lv${card.level}">${LEVEL_NAMES[card.level]}</span>`;
    el.flashcard.classList.remove('flipped');
    el.cardCounter.textContent = `Carte ${currentCardIndex + 1} / ${cards.length}`;
    el.progressFill.style.width = ((currentCardIndex + 1) / cards.length * 100) + '%';
  }

  function nextCard() {
    const len = activeCards().length;
    if (prefs.shuffle && len > 1) {
      let next = currentCardIndex;
      while (next === currentCardIndex) {
        next = Math.floor(Math.random() * len);
      }
      currentCardIndex = next;
    } else {
      currentCardIndex = (currentCardIndex + 1) % len;
    }
    renderCard();
  }

  function prevCard() {
    const len = activeCards().length;
    currentCardIndex = (currentCardIndex - 1 + len) % len;
    renderCard();
  }

  function updateStatsUI() {
    const success = successRate();
    el.streakValue.textContent = stats.streak;
    el.cardsValue.textContent = stats.cards;
    el.successValue.textContent = success + '%';
    el.sideStreak.textContent = stats.streak;
  }

  function updateSessionUI() {
    el.sessionSeen.textContent = session.seen;
    el.sessionKnown.textContent = session.known;
    el.sessionReview.textContent = session.review;
    const total = Math.max(session.seen, 1);
    el.miniKnown.style.width = (session.known / total * 100) + '%';
    el.miniReview.style.width = (session.review / total * 100) + '%';
  }

  function renderDeckPreview() {
    const cards = activeCards();
    // Aperçu : jusqu'à 8 cartes, avec pastille de niveau
    el.deckPreview.innerHTML = cards.slice(0, 8).map((c) =>
      `<li><span class="dp-word">${c.word}</span>` +
      `<span class="dp-right"><span class="dp-zh">${c.translation}</span>` +
      `<span class="card-level lv${c.level}">${c.level}</span></span></li>`
    ).join('') + (cards.length > 8
      ? `<li class="dp-more">… ${cards.length - 8} autres cartes</li>` : '');
  }

  // Puces de filtrage par niveau HSK (vue Étudier) — seuls les niveaux publiés
  // (AVAILABLE_LEVELS, i.e. HSK 1 et 2 pour le moment) sont proposés.
  function renderLevelChips() {
    const published = currentDeck().cards.filter((c) => AVAILABLE_LEVELS.includes(c.level));
    const counts = {};
    published.forEach((c) => {
      counts[c.level] = (counts[c.level] || 0) + 1;
    });
    let html = `<button class="level-chip${levelFilter === 0 ? ' active' : ''}" data-level="0">Tous · ${published.length}</button>`;
    AVAILABLE_LEVELS.forEach((lv) => {
      if (!counts[lv]) return;
      html += `<button class="level-chip lv${lv}${levelFilter === lv ? ' active' : ''}" data-level="${lv}">${LEVEL_NAMES[lv]} · ${counts[lv]}</button>`;
    });
    el.levelChips.innerHTML = html;
  }

  function setLevelFilter(lv) {
    levelFilter = lv;
    currentCardIndex = 0;
    renderLevelChips();
    renderCard();
    renderDeckPreview();
  }

  function showToast(icon, msg) {
    el.toastIcon.textContent = icon;
    el.toastMsg.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), TOAST_DURATION_MS);
  }

  // ============ AUDIO (synthèse vocale du navigateur) ============
  function speak() {
    const card = currentCard();
    if (!('speechSynthesis' in window)) {
      showToast('⚠️', 'Synthèse vocale non supportée');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(card.translation);
    utter.lang = currentDeck().tts; // zh-CN
    utter.rate = prefs.rate;
    el.audioBtn.classList.add('playing');
    const stopPulse = () => el.audioBtn.classList.remove('playing');
    utter.onend = stopPulse;
    utter.onerror = stopPulse;
    window.speechSynthesis.speak(utter);
  }

  // ============ LOGIQUE DE RÉVISION ============
  function recordAnswer(known) {
    stats.cards += 1;
    stats.total += 1;
    if (known) stats.known += 1;

    const deck = stats.byDeck[currentLang] ||
      (stats.byDeck[currentLang] = { total: 0, known: 0 });
    deck.total += 1;
    if (known) deck.known += 1;

    session.seen += 1;
    if (known) session.known += 1; else session.review += 1;

    saveStats();
    updateStatsUI();
    updateSessionUI();
    nextCard();
  }

  function selectLanguage(lang) {
    if (!vocab[lang]) return;
    currentLang = lang;
    currentCardIndex = 0;
    levelFilter = 0;
    el.deckSelect.value = lang;
    renderLevelChips();
    renderCard();
    renderDeckPreview();
  }

  // ============ VUES DYNAMIQUES ============
  function renderStatsView() {
    el.kpiStreak.textContent = stats.streak;
    el.kpiCards.textContent = stats.cards;
    el.kpiSuccess.textContent = successRate() + '%';
    el.kpiMastered.textContent = stats.known;

    el.deckStatsBody.innerHTML = Object.keys(vocab).map((key) => {
      const d = stats.byDeck[key] || { total: 0, known: 0 };
      const pct = d.total > 0 ? Math.round(d.known / d.total * 100) : 0;
      return `<tr>
        <td>${vocab[key].flag} ${vocab[key].name}</td>
        <td>${d.total} réponse${d.total > 1 ? 's' : ''}</td>
        <td>
          <span class="mastery-bar"><span class="mastery-fill" style="width:${pct}%"></span></span>
          ${pct}%
        </td>
      </tr>`;
    }).join('');
  }

  function renderDecksView() {
    el.deckCards.innerHTML = Object.keys(vocab).map((key) => {
      const d = stats.byDeck[key] || { total: 0, known: 0 };
      const pct = d.total > 0 ? Math.round(d.known / d.total * 100) : 0;
      // Seules les cartes des niveaux publiés (HSK 1 et 2) sont comptées ;
      // répartition par niveau pour la légende du deck.
      const published = vocab[key].cards.filter((c) => AVAILABLE_LEVELS.includes(c.level));
      const counts = {};
      published.forEach((c) => { counts[c.level] = (counts[c.level] || 0) + 1; });
      const legend = AVAILABLE_LEVELS.filter((lv) => counts[lv]).map((lv) =>
        `<span class="card-level lv${lv}">${LEVEL_NAMES[lv]} · ${counts[lv]}</span>`
      ).join('');
      return `<div class="deck-card">
        <div class="deck-flag">${vocab[key].flag}</div>
        <h3>${vocab[key].name}</h3>
        <p class="deck-desc">${vocab[key].desc}</p>
        <div class="deck-meta">
          <span>${published.length} cartes</span>
          <span>${pct}% maîtrise</span>
        </div>
        <div class="deck-levels">${legend}</div>
        <button class="btn btn-primary" data-start-deck="${key}">Étudier ce deck</button>
      </div>`;
    }).join('');
  }

  // ============ THÈME ============
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', prefs.theme);
    el.darkToggle.checked = prefs.theme === 'dark';
  }

  // ============ ÉVÉNEMENTS ============
  el.sideItems.forEach((btn) => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('study');
  });

  el.menuBtn.addEventListener('click', () => {
    el.sidebar.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  el.overlay.addEventListener('click', closeMobileNav);

  el.deckSelect.addEventListener('change', () => selectLanguage(el.deckSelect.value));

  // Délégation : puces de filtre par niveau (vue Étudier)
  el.levelChips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-level]');
    if (!chip) return;
    setLevelFilter(parseInt(chip.dataset.level, 10) || 0);
  });

  el.flashcard.addEventListener('click', () =>
    el.flashcard.classList.toggle('flipped')
  );

  el.audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    speak();
  });

  el.btnKnow.addEventListener('click', () => {
    recordAnswer(true);
    showToast('✅', 'Bien joué !');
  });

  el.btnReview.addEventListener('click', () => {
    recordAnswer(false);
    showToast('🔁', 'On reverra ce mot plus tard');
  });

  el.btnResetSession.addEventListener('click', () => {
    session = { seen: 0, known: 0, review: 0 };
    updateSessionUI();
    showToast('🧹', 'Session réinitialisée');
  });

  el.btnResetStats.addEventListener('click', () => {
    Object.assign(stats, defaultStats());
    saveStats();
    updateStatsUI();
    renderStatsView();
    showToast('🗑️', 'Statistiques réinitialisées');
  });

  // Délégation : boutons "Étudier ce deck" dans la vue Decks
  el.deckCards.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-start-deck]');
    if (!btn) return;
    selectLanguage(btn.dataset.startDeck);
    switchView('study');
  });

  // Raccourcis clavier
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const tag = active && active.tagName;
    // Ne capture pas les touches dans un champ ; mais si c'est un bouton
    // focusable, on redonne le focus au corps pour éviter le "double clic"
    // déclenché par Espace sur ledit bouton.
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (tag === 'BUTTON' || (active && active.getAttribute('role') === 'button')) {
      active.blur();
    }

    const studyActive = document.getElementById('view-study').classList.contains('active');
    if (!studyActive) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (el.flashcard.classList.contains('flipped')) {
        recordAnswer(true);
        showToast('✅', 'Bien joué !');
      } else {
        el.flashcard.classList.toggle('flipped');
      }
    } else if (e.key === 'r' || e.key === 'R') {
      recordAnswer(false);
      showToast('🔁', 'On reverra ce mot plus tard');
    } else if (e.key === 'ArrowRight') {
      nextCard();
    } else if (e.key === 'ArrowLeft') {
      prevCard();
    }
  });

  // Réglages
  el.rateSlider.value = prefs.rate;
  el.rateSlider.addEventListener('input', () => {
    prefs.rate = parseFloat(el.rateSlider.value) || DEFAULT_RATE;
    savePrefs();
  });

  el.shuffleToggle.checked = !!prefs.shuffle;
  el.shuffleToggle.addEventListener('change', () => {
    prefs.shuffle = el.shuffleToggle.checked;
    savePrefs();
    showToast(prefs.shuffle ? '🔀' : '📋',
      prefs.shuffle ? 'Ordre aléatoire activé' : 'Ordre séquentiel activé');
  });

  el.darkToggle.addEventListener('change', () => {
    prefs.theme = el.darkToggle.checked ? 'dark' : 'light';
    applyTheme();
    savePrefs();
  });

  // ============ INITIALISATION ============
  applyTheme();
  refreshStreak();
  renderLevelChips();
  renderCard();
  renderDeckPreview();
  updateStatsUI();
  updateSessionUI();
})();
