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
      desc: 'Vocabulaire officiel HSK 1 et HSK 2.',
      cards: [
        // — HSK 1 · Débutant
        { word: "爱", pinyin: "ài", translation: "aimer ; adorer", level: 1, example: "「我爱我的家。」— J'aime ma famille." },
        { word: "八", pinyin: "bā", translation: "huit", level: 1, example: "「我八点起床。」— Je me lève à huit heures." },
        { word: "爸爸", pinyin: "bàba", translation: "papa ; le père", level: 1, example: "「我爸爸是医生。」— Mon père est médecin." },
        { word: "杯子", pinyin: "bēizi", translation: "la tasse ; le verre", level: 1, example: "「这个杯子是我的。」— Cette tasse est à moi." },
        { word: "北京", pinyin: "Běijīng", translation: "Pékin", level: 1, example: "「我在北京工作。」— Je travaille à Pékin." },
        { word: "本", pinyin: "běn", translation: "(classificateur des livres)", level: 1, example: "「我有三本书。」— J'ai trois livres." },
        { word: "不", pinyin: "bù", translation: "ne… pas ; non", level: 1, example: "「我不喝茶。」— Je ne bois pas de thé." },
        { word: "不客气", pinyin: "bú kèqi", translation: "de rien", level: 1, example: "「谢谢！——不客气。」— Merci ! — De rien." },
        { word: "菜", pinyin: "cài", translation: "le plat ; le légume", level: 1, example: "「这个菜很好吃。」— Ce plat est délicieux." },
        { word: "茶", pinyin: "chá", translation: "le thé", level: 1, example: "「你想喝茶吗？」— Tu veux boire du thé ?" },
        { word: "吃", pinyin: "chī", translation: "manger", level: 1, example: "「我们中午吃米饭。」— Ce midi, nous mangeons du riz." },
        { word: "出租车", pinyin: "chūzūchē", translation: "le taxi", level: 1, example: "「我们坐出租车去吧。」— Allons-y en taxi." },
        { word: "打电话", pinyin: "dǎ diànhuà", translation: "téléphoner", level: 1, example: "「我明天给你打电话。」— Je t'appelle demain." },
        { word: "大", pinyin: "dà", translation: "grand ; gros", level: 1, example: "「他家很大。」— Sa maison est grande." },
        { word: "的", pinyin: "de", translation: "(particule possessive / déterminative)", level: 1, example: "「这是我的书。」— C'est mon livre." },
        { word: "点", pinyin: "diǎn", translation: "heure (à l'horloge) ; un peu", level: 1, example: "「现在三点。」— Il est trois heures." },
        { word: "电脑", pinyin: "diànnǎo", translation: "l'ordinateur", level: 1, example: "「我的电脑很新。」— Mon ordinateur est neuf." },
        { word: "电视", pinyin: "diànshì", translation: "la télévision", level: 1, example: "「爸爸在看电视。」— Papa regarde la télévision." },
        { word: "电影", pinyin: "diànyǐng", translation: "le film", level: 1, example: "「我们去看电影吧。」— Allons voir un film." },
        { word: "东西", pinyin: "dōngxi", translation: "la chose ; le truc", level: 1, example: "「你买了什么东西？」— Qu'est-ce que tu as acheté ?" },
        { word: "都", pinyin: "dōu", translation: "tous ; tout", level: 1, example: "「我们都是学生。」— Nous sommes tous étudiants." },
        { word: "读", pinyin: "dú", translation: "lire (à voix haute)", level: 1, example: "「请读这个字。」— Lis ce caractère, s'il te plaît." },
        { word: "对不起", pinyin: "duìbuqǐ", translation: "pardon ; désolé", level: 1, example: "「对不起，我不认识他。」— Désolé, je ne le connais pas." },
        { word: "多", pinyin: "duō", translation: "beaucoup ; nombreux", level: 1, example: "「这里人很多。」— Il y a beaucoup de monde ici." },
        { word: "多少", pinyin: "duōshao", translation: "combien ?", level: 1, example: "「这个多少钱？」— Combien ça coûte ?" },
        { word: "儿子", pinyin: "érzi", translation: "le fils", level: 1, example: "「他儿子三岁。」— Son fils a trois ans." },
        { word: "二", pinyin: "èr", translation: "deux", level: 1, example: "「今天是二月一号。」— Nous sommes le 1er février." },
        { word: "饭店", pinyin: "fàndiàn", translation: "le restaurant ; l'hôtel", level: 1, example: "「这个饭店的菜很好吃。」— La cuisine de ce restaurant est bonne." },
        { word: "飞机", pinyin: "fēijī", translation: "l'avion", level: 1, example: "「我坐飞机去北京。」— Je vais à Pékin en avion." },
        { word: "分钟", pinyin: "fēnzhōng", translation: "la minute", level: 1, example: "「请等我五分钟。」— Attends-moi cinq minutes, s'il te plaît." },
        { word: "高兴", pinyin: "gāoxìng", translation: "content ; heureux", level: 1, example: "「认识你很高兴。」— Ravi de te connaître." },
        { word: "个", pinyin: "gè", translation: "(classificateur général)", level: 1, example: "「我有一个妹妹。」— J'ai une petite sœur." },
        { word: "工作", pinyin: "gōngzuò", translation: "le travail ; travailler", level: 1, example: "「你在哪儿工作？」— Où travailles-tu ?" },
        { word: "狗", pinyin: "gǒu", translation: "le chien", level: 1, example: "「我家有一只狗。」— Nous avons un chien." },
        { word: "汉语", pinyin: "Hànyǔ", translation: "la langue chinoise", level: 1, example: "「我在学习汉语。」— J'apprends le chinois." },
        { word: "好", pinyin: "hǎo", translation: "bon ; bien", level: 1, example: "「今天天气很好。」— Il fait beau aujourd'hui." },
        { word: "号", pinyin: "hào", translation: "le jour (du mois) ; le numéro", level: 1, example: "「今天几号？」— Quel jour sommes-nous ?" },
        { word: "喝", pinyin: "hē", translation: "boire", level: 1, example: "「我想喝水。」— Je voudrais boire de l'eau." },
        { word: "和", pinyin: "hé", translation: "et ; avec", level: 1, example: "「我和朋友去商店。」— Je vais au magasin avec un ami." },
        { word: "很", pinyin: "hěn", translation: "très", level: 1, example: "「她很漂亮。」— Elle est très jolie." },
        { word: "后面", pinyin: "hòumian", translation: "derrière", level: 1, example: "「学校后面有一个商店。」— Il y a un magasin derrière l'école." },
        { word: "回", pinyin: "huí", translation: "rentrer ; retourner", level: 1, example: "「我五点回家。」— Je rentre à la maison à cinq heures." },
        { word: "会", pinyin: "huì", translation: "savoir (faire) ; pouvoir", level: 1, example: "「你会说汉语吗？」— Tu sais parler chinois ?" },
        { word: "几", pinyin: "jǐ", translation: "combien (petit nombre) ; quelques", level: 1, example: "「你家有几个人？」— Combien êtes-vous dans ta famille ?" },
        { word: "家", pinyin: "jiā", translation: "la maison ; la famille", level: 1, example: "「我家在北京。」— Ma famille vit à Pékin." },
        { word: "叫", pinyin: "jiào", translation: "s'appeler ; appeler", level: 1, example: "「你叫什么名字？」— Comment t'appelles-tu ?" },
        { word: "今天", pinyin: "jīntiān", translation: "aujourd'hui", level: 1, example: "「今天星期一。」— Aujourd'hui, c'est lundi." },
        { word: "九", pinyin: "jiǔ", translation: "neuf", level: 1, example: "「我九月去中国。」— Je vais en Chine en septembre." },
        { word: "开", pinyin: "kāi", translation: "ouvrir ; conduire", level: 1, example: "「商店九点开门。」— Le magasin ouvre à neuf heures." },
        { word: "看", pinyin: "kàn", translation: "regarder ; lire", level: 1, example: "「我喜欢看书。」— J'aime lire." },
        { word: "看见", pinyin: "kànjiàn", translation: "voir ; apercevoir", level: 1, example: "「你看见我的猫了吗？」— Tu as vu mon chat ?" },
        { word: "块", pinyin: "kuài", translation: "yuan (familier)", level: 1, example: "「这本书十块钱。」— Ce livre coûte dix yuans." },
        { word: "来", pinyin: "lái", translation: "venir", level: 1, example: "「你什么时候来？」— Quand viens-tu ?" },
        { word: "老师", pinyin: "lǎoshī", translation: "le professeur", level: 1, example: "「王老师是北京人。」— Le professeur Wang est de Pékin." },
        { word: "了", pinyin: "le", translation: "(particule : action accomplie, changement)", level: 1, example: "「我吃饭了。」— J'ai mangé." },
        { word: "冷", pinyin: "lěng", translation: "froid", level: 1, example: "「今天很冷。」— Il fait froid aujourd'hui." },
        { word: "里", pinyin: "lǐ", translation: "dans ; à l'intérieur", level: 1, example: "「猫在房子里。」— Le chat est dans la maison." },
        { word: "六", pinyin: "liù", translation: "six", level: 1, example: "「我六点起来。」— Je me lève à six heures." },
        { word: "吗", pinyin: "ma", translation: "(particule interrogative)", level: 1, example: "「你是老师吗？」— Tu es professeur ?" },
        { word: "妈妈", pinyin: "māma", translation: "maman ; la mère", level: 1, example: "「妈妈在做饭。」— Maman prépare le repas." },
        { word: "买", pinyin: "mǎi", translation: "acheter", level: 1, example: "「我想买一本书。」— Je voudrais acheter un livre." },
        { word: "猫", pinyin: "māo", translation: "le chat", level: 1, example: "「那只猫很小。」— Ce chat est tout petit." },
        { word: "没关系", pinyin: "méi guānxi", translation: "ce n'est pas grave", level: 1, example: "「对不起！——没关系。」— Pardon ! — Ce n'est pas grave." },
        { word: "没有", pinyin: "méiyǒu", translation: "ne pas avoir ; il n'y a pas", level: 1, example: "「我没有钱。」— Je n'ai pas d'argent." },
        { word: "米饭", pinyin: "mǐfàn", translation: "le riz (cuit)", level: 1, example: "「我想吃米饭。」— Je voudrais manger du riz." },
        { word: "名字", pinyin: "míngzi", translation: "le nom ; le prénom", level: 1, example: "「你的名字很好听。」— Ton prénom est joli." },
        { word: "明天", pinyin: "míngtiān", translation: "demain", level: 1, example: "「明天我去学校。」— Demain, je vais à l'école." },
        { word: "哪", pinyin: "nǎ", translation: "quel ; lequel", level: 1, example: "「你是哪国人？」— De quel pays es-tu ?" },
        { word: "哪儿", pinyin: "nǎr", translation: "où ?", level: 1, example: "「你去哪儿？」— Où vas-tu ?" },
        { word: "那", pinyin: "nà", translation: "ce…-là ; cela", level: 1, example: "「那是我的电脑。」— Ça, c'est mon ordinateur." },
        { word: "那儿", pinyin: "nàr", translation: "là-bas", level: 1, example: "「我的书在那儿。」— Mon livre est là-bas." },
        { word: "呢", pinyin: "ne", translation: "(particule : et toi ? ; action en cours)", level: 1, example: "「我很好，你呢？」— Je vais bien, et toi ?" },
        { word: "能", pinyin: "néng", translation: "pouvoir (être capable de)", level: 1, example: "「你明天能来吗？」— Tu peux venir demain ?" },
        { word: "你", pinyin: "nǐ", translation: "tu ; toi", level: 1, example: "「你好！」— Bonjour !" },
        { word: "年", pinyin: "nián", translation: "l'année ; l'an", level: 1, example: "「我在中国住了一年。」— J'ai vécu un an en Chine." },
        { word: "女儿", pinyin: "nǚ'ér", translation: "la fille (enfant)", level: 1, example: "「她女儿是学生。」— Sa fille est étudiante." },
        { word: "朋友", pinyin: "péngyou", translation: "l'ami", level: 1, example: "「他是我的好朋友。」— C'est mon meilleur ami." },
        { word: "漂亮", pinyin: "piàoliang", translation: "joli ; beau", level: 1, example: "「这件衣服很漂亮。」— Ce vêtement est très joli." },
        { word: "苹果", pinyin: "píngguǒ", translation: "la pomme", level: 1, example: "「我想吃苹果。」— Je voudrais manger une pomme." },
        { word: "七", pinyin: "qī", translation: "sept", level: 1, example: "「一个星期有七天。」— Une semaine a sept jours." },
        { word: "前面", pinyin: "qiánmian", translation: "devant", level: 1, example: "「前面有一个饭店。」— Il y a un restaurant devant." },
        { word: "钱", pinyin: "qián", translation: "l'argent", level: 1, example: "「你有钱吗？」— Tu as de l'argent ?" },
        { word: "请", pinyin: "qǐng", translation: "s'il vous plaît ; inviter", level: 1, example: "「请坐！」— Asseyez-vous, je vous en prie !" },
        { word: "去", pinyin: "qù", translation: "aller", level: 1, example: "「我想去中国。」— Je veux aller en Chine." },
        { word: "热", pinyin: "rè", translation: "chaud", level: 1, example: "「今天太热了！」— Il fait trop chaud aujourd'hui !" },
        { word: "人", pinyin: "rén", translation: "la personne ; les gens", level: 1, example: "「商店里有很多人。」— Il y a beaucoup de monde dans le magasin." },
        { word: "认识", pinyin: "rènshi", translation: "connaître ; reconnaître", level: 1, example: "「我认识他。」— Je le connais." },
        { word: "三", pinyin: "sān", translation: "trois", level: 1, example: "「我有三个朋友。」— J'ai trois amis." },
        { word: "商店", pinyin: "shāngdiàn", translation: "le magasin", level: 1, example: "「我去商店买东西。」— Je vais faire des courses au magasin." },
        { word: "上", pinyin: "shàng", translation: "sur ; dessus ; monter", level: 1, example: "「书在桌子上。」— Le livre est sur la table." },
        { word: "上午", pinyin: "shàngwǔ", translation: "le matin", level: 1, example: "「我上午工作。」— Je travaille le matin." },
        { word: "少", pinyin: "shǎo", translation: "peu ; peu nombreux", level: 1, example: "「这里人很少。」— Il y a peu de monde ici." },
        { word: "谁", pinyin: "shéi", translation: "qui ?", level: 1, example: "「他是谁？」— Qui est-ce ?" },
        { word: "什么", pinyin: "shénme", translation: "quoi ? ; quel ?", level: 1, example: "「你想吃什么？」— Qu'est-ce que tu veux manger ?" },
        { word: "十", pinyin: "shí", translation: "dix", level: 1, example: "「我十点睡觉。」— Je me couche à dix heures." },
        { word: "时候", pinyin: "shíhou", translation: "le moment ; quand", level: 1, example: "「你什么时候回家？」— Quand rentres-tu à la maison ?" },
        { word: "是", pinyin: "shì", translation: "être", level: 1, example: "「我是法国人。」— Je suis français." },
        { word: "书", pinyin: "shū", translation: "le livre", level: 1, example: "「这本书很好看。」— Ce livre est très bien." },
        { word: "水", pinyin: "shuǐ", translation: "l'eau", level: 1, example: "「请给我一杯水。」— Un verre d'eau, s'il vous plaît." },
        { word: "水果", pinyin: "shuǐguǒ", translation: "le fruit", level: 1, example: "「我喜欢吃水果。」— J'aime manger des fruits." },
        { word: "睡觉", pinyin: "shuìjiào", translation: "dormir ; se coucher", level: 1, example: "「我十一点睡觉。」— Je me couche à onze heures." },
        { word: "说", pinyin: "shuō", translation: "dire ; parler", level: 1, example: "「你说什么？」— Qu'est-ce que tu dis ?" },
        { word: "四", pinyin: "sì", translation: "quatre", level: 1, example: "「我们家有四个人。」— Nous sommes quatre dans la famille." },
        { word: "岁", pinyin: "suì", translation: "an (âge)", level: 1, example: "「你几岁了？」— Quel âge as-tu ?" },
        { word: "他", pinyin: "tā", translation: "il ; lui", level: 1, example: "「他是我哥哥。」— C'est mon grand frère." },
        { word: "她", pinyin: "tā", translation: "elle", level: 1, example: "「她是我的老师。」— C'est ma professeure." },
        { word: "太", pinyin: "tài", translation: "trop ; très", level: 1, example: "「这个太贵了！」— C'est trop cher !" },
        { word: "天气", pinyin: "tiānqì", translation: "le temps (météo)", level: 1, example: "「明天天气怎么样？」— Quel temps fera-t-il demain ?" },
        { word: "听", pinyin: "tīng", translation: "écouter", level: 1, example: "「我喜欢听中国歌。」— J'aime écouter des chansons chinoises." },
        { word: "同学", pinyin: "tóngxué", translation: "le camarade de classe", level: 1, example: "「他是我的同学。」— C'est mon camarade de classe." },
        { word: "喂", pinyin: "wéi", translation: "allô (au téléphone)", level: 1, example: "「喂，你好！」— Allô, bonjour !" },
        { word: "我", pinyin: "wǒ", translation: "je ; moi", level: 1, example: "「我是学生。」— Je suis étudiant." },
        { word: "我们", pinyin: "wǒmen", translation: "nous", level: 1, example: "「我们一起去吧！」— Allons-y ensemble !" },
        { word: "五", pinyin: "wǔ", translation: "cinq", level: 1, example: "「我有五块钱。」— J'ai cinq yuans." },
        { word: "喜欢", pinyin: "xǐhuan", translation: "aimer ; apprécier", level: 1, example: "「我喜欢喝茶。」— J'aime boire du thé." },
        { word: "下", pinyin: "xià", translation: "sous ; descendre ; prochain", level: 1, example: "「下个星期我去北京。」— La semaine prochaine, je vais à Pékin." },
        { word: "下午", pinyin: "xiàwǔ", translation: "l'après-midi", level: 1, example: "「我们下午去商店。」— Nous allons au magasin cet après-midi." },
        { word: "下雨", pinyin: "xià yǔ", translation: "pleuvoir", level: 1, example: "「今天下雨了。」— Il a plu aujourd'hui." },
        { word: "先生", pinyin: "xiānsheng", translation: "monsieur", level: 1, example: "「王先生在家吗？」— M. Wang est-il chez lui ?" },
        { word: "现在", pinyin: "xiànzài", translation: "maintenant", level: 1, example: "「现在几点？」— Quelle heure est-il ?" },
        { word: "想", pinyin: "xiǎng", translation: "vouloir ; penser à", level: 1, example: "「我想回家。」— Je veux rentrer à la maison." },
        { word: "小", pinyin: "xiǎo", translation: "petit", level: 1, example: "「我的房子很小。」— Ma maison est petite." },
        { word: "小姐", pinyin: "xiǎojiě", translation: "mademoiselle", level: 1, example: "「李小姐是老师。」— Mlle Li est professeure." },
        { word: "些", pinyin: "xiē", translation: "quelques ; un peu de", level: 1, example: "「我买了一些水果。」— J'ai acheté quelques fruits." },
        { word: "写", pinyin: "xiě", translation: "écrire", level: 1, example: "「你会写汉字吗？」— Tu sais écrire les caractères chinois ?" },
        { word: "谢谢", pinyin: "xièxie", translation: "merci", level: 1, example: "「谢谢你！」— Merci !" },
        { word: "星期", pinyin: "xīngqī", translation: "la semaine", level: 1, example: "「下星期见！」— À la semaine prochaine !" },
        { word: "学生", pinyin: "xuésheng", translation: "l'élève ; l'étudiant", level: 1, example: "「他是北京大学的学生。」— Il est étudiant à l'université de Pékin." },
        { word: "学习", pinyin: "xuéxí", translation: "étudier ; apprendre", level: 1, example: "「我在学习汉语。」— J'étudie le chinois." },
        { word: "学校", pinyin: "xuéxiào", translation: "l'école", level: 1, example: "「我们学校很大。」— Notre école est grande." },
        { word: "一", pinyin: "yī", translation: "un", level: 1, example: "「我有一个哥哥。」— J'ai un grand frère." },
        { word: "衣服", pinyin: "yīfu", translation: "le vêtement", level: 1, example: "「她买了很多衣服。」— Elle a acheté beaucoup de vêtements." },
        { word: "医生", pinyin: "yīshēng", translation: "le médecin", level: 1, example: "「我想当医生。」— Je veux devenir médecin." },
        { word: "医院", pinyin: "yīyuàn", translation: "l'hôpital", level: 1, example: "「他在医院工作。」— Il travaille à l'hôpital." },
        { word: "椅子", pinyin: "yǐzi", translation: "la chaise", level: 1, example: "「这把椅子很漂亮。」— Cette chaise est très jolie." },
        { word: "有", pinyin: "yǒu", translation: "avoir ; il y a", level: 1, example: "「我有一只猫。」— J'ai un chat." },
        { word: "月", pinyin: "yuè", translation: "le mois ; la lune", level: 1, example: "「我下个月去中国。」— Je vais en Chine le mois prochain." },
        { word: "在", pinyin: "zài", translation: "être à ; en train de", level: 1, example: "「我在家。」— Je suis à la maison." },
        { word: "再见", pinyin: "zàijiàn", translation: "au revoir", level: 1, example: "「老师，再见！」— Au revoir, professeur !" },
        { word: "怎么", pinyin: "zěnme", translation: "comment ?", level: 1, example: "「这个字怎么读？」— Comment se lit ce caractère ?" },
        { word: "怎么样", pinyin: "zěnmeyàng", translation: "comment (ça va) ? ; qu'en dis-tu ?", level: 1, example: "「这个电影怎么样？」— Comment est ce film ?" },
        { word: "这", pinyin: "zhè", translation: "ce…-ci ; ceci (这儿 : ici)", level: 1, example: "「这是我妈妈。」— Voici ma mère." },
        { word: "中国", pinyin: "Zhōngguó", translation: "la Chine", level: 1, example: "「中国很大。」— La Chine est grande." },
        { word: "中午", pinyin: "zhōngwǔ", translation: "midi", level: 1, example: "「中午我们吃米饭。」— À midi, nous mangeons du riz." },
        { word: "住", pinyin: "zhù", translation: "habiter ; loger", level: 1, example: "「你住在哪儿？」— Où habites-tu ?" },
        { word: "桌子", pinyin: "zhuōzi", translation: "la table ; le bureau", level: 1, example: "「桌子上有一本书。」— Il y a un livre sur la table." },
        { word: "字", pinyin: "zì", translation: "le caractère (écrit)", level: 1, example: "「这个字我不认识。」— Je ne connais pas ce caractère." },
        { word: "昨天", pinyin: "zuótiān", translation: "hier", level: 1, example: "「昨天我去医院了。」— Hier, je suis allé à l'hôpital." },
        { word: "坐", pinyin: "zuò", translation: "s'asseoir ; prendre (un transport)", level: 1, example: "「请坐这儿。」— Asseyez-vous ici, je vous prie." },
        { word: "做", pinyin: "zuò", translation: "faire", level: 1, example: "「你在做什么？」— Qu'est-ce que tu fais ?" },

        // — HSK 2 · Élémentaire
        { word: "吧", pinyin: "ba", translation: "(particule : suggestion, supposition)", level: 2, example: "「我们走吧！」— Allons-y !" },
        { word: "白", pinyin: "bái", translation: "blanc", level: 2, example: "「我喜欢白衣服。」— J'aime les vêtements blancs." },
        { word: "百", pinyin: "bǎi", translation: "cent", level: 2, example: "「这件衣服三百块。」— Ce vêtement coûte trois cents yuans." },
        { word: "帮助", pinyin: "bāngzhù", translation: "aider ; l'aide", level: 2, example: "「谢谢你的帮助！」— Merci pour ton aide !" },
        { word: "报纸", pinyin: "bàozhǐ", translation: "le journal", level: 2, example: "「爸爸每天看报纸。」— Papa lit le journal tous les jours." },
        { word: "比", pinyin: "bǐ", translation: "que (comparaison)", level: 2, example: "「今天比昨天冷。」— Aujourd'hui, il fait plus froid qu'hier." },
        { word: "别", pinyin: "bié", translation: "ne… pas (impératif)", level: 2, example: "「别说话！」— Ne parle pas !" },
        { word: "宾馆", pinyin: "bīnguǎn", translation: "l'hôtel", level: 2, example: "「我们住在这个宾馆。」— Nous logeons dans cet hôtel." },
        { word: "长", pinyin: "cháng", translation: "long", level: 2, example: "「她的头发很长。」— Elle a les cheveux longs." },
        { word: "唱歌", pinyin: "chàng gē", translation: "chanter", level: 2, example: "「她很喜欢唱歌。」— Elle adore chanter." },
        { word: "出", pinyin: "chū", translation: "sortir", level: 2, example: "「他出去了。」— Il est sorti." },
        { word: "穿", pinyin: "chuān", translation: "porter ; mettre (vêtements)", level: 2, example: "「今天你穿得很漂亮。」— Tu es très bien habillée aujourd'hui." },
        { word: "次", pinyin: "cì", translation: "fois", level: 2, example: "「我去过两次北京。」— Je suis allé deux fois à Pékin." },
        { word: "从", pinyin: "cóng", translation: "depuis ; de", level: 2, example: "「我从法国来。」— Je viens de France." },
        { word: "错", pinyin: "cuò", translation: "faux ; erroné", level: 2, example: "「你说错了。」— Tu t'es trompé." },
        { word: "打篮球", pinyin: "dǎ lánqiú", translation: "jouer au basket", level: 2, example: "「我们下午去打篮球。」— Nous allons jouer au basket cet après-midi." },
        { word: "大家", pinyin: "dàjiā", translation: "tout le monde", level: 2, example: "「大家好！」— Bonjour à tous !" },
        { word: "到", pinyin: "dào", translation: "arriver ; jusqu'à", level: 2, example: "「我们到北京了。」— Nous sommes arrivés à Pékin." },
        { word: "得", pinyin: "de", translation: "(particule de complément de degré)", level: 2, example: "「他跑得很快。」— Il court très vite." },
        { word: "等", pinyin: "děng", translation: "attendre", level: 2, example: "「请等我一会儿。」— Attends-moi un moment, s'il te plaît." },
        { word: "弟弟", pinyin: "dìdi", translation: "le petit frère", level: 2, example: "「我弟弟八岁。」— Mon petit frère a huit ans." },
        { word: "第一", pinyin: "dì-yī", translation: "premier", level: 2, example: "「这是我第一次来中国。」— C'est la première fois que je viens en Chine." },
        { word: "懂", pinyin: "dǒng", translation: "comprendre", level: 2, example: "「你懂我的意思吗？」— Tu comprends ce que je veux dire ?" },
        { word: "对", pinyin: "duì", translation: "correct ; juste", level: 2, example: "「你说得对。」— Tu as raison." },
        { word: "房间", pinyin: "fángjiān", translation: "la pièce ; la chambre", level: 2, example: "「我的房间很小。」— Ma chambre est petite." },
        { word: "非常", pinyin: "fēicháng", translation: "extrêmement ; très", level: 2, example: "「我非常喜欢北京。」— J'aime énormément Pékin." },
        { word: "服务员", pinyin: "fúwùyuán", translation: "le serveur ; l'employé", level: 2, example: "「服务员，请给我一杯茶。」— Serveur, un thé s'il vous plaît." },
        { word: "高", pinyin: "gāo", translation: "grand ; haut", level: 2, example: "「我哥哥很高。」— Mon grand frère est grand." },
        { word: "告诉", pinyin: "gàosu", translation: "dire à ; informer", level: 2, example: "「请告诉我你的名字。」— Dis-moi ton nom, s'il te plaît." },
        { word: "哥哥", pinyin: "gēge", translation: "le grand frère", level: 2, example: "「我哥哥在医院工作。」— Mon grand frère travaille à l'hôpital." },
        { word: "给", pinyin: "gěi", translation: "donner ; pour", level: 2, example: "「妈妈给我一个苹果。」— Maman me donne une pomme." },
        { word: "公共汽车", pinyin: "gōnggòng qìchē", translation: "le bus", level: 2, example: "「我坐公共汽车上班。」— Je vais au travail en bus." },
        { word: "公斤", pinyin: "gōngjīn", translation: "le kilogramme", level: 2, example: "「我买了两公斤苹果。」— J'ai acheté deux kilos de pommes." },
        { word: "公司", pinyin: "gōngsī", translation: "l'entreprise ; la société", level: 2, example: "「她在一家大公司工作。」— Elle travaille dans une grande entreprise." },
        { word: "贵", pinyin: "guì", translation: "cher", level: 2, example: "「这个手机太贵了。」— Ce téléphone est trop cher." },
        { word: "过", pinyin: "guo", translation: "(particule : expérience passée)", level: 2, example: "「我去过中国。」— Je suis déjà allé en Chine." },
        { word: "还", pinyin: "hái", translation: "encore ; aussi", level: 2, example: "「他还在睡觉。」— Il dort encore." },
        { word: "孩子", pinyin: "háizi", translation: "l'enfant", level: 2, example: "「这个孩子很可爱。」— Cet enfant est adorable." },
        { word: "好吃", pinyin: "hǎochī", translation: "bon (à manger) ; délicieux", level: 2, example: "「妈妈做的菜很好吃。」— Les plats de maman sont délicieux." },
        { word: "黑", pinyin: "hēi", translation: "noir", level: 2, example: "「我的猫是黑的。」— Mon chat est noir." },
        { word: "红", pinyin: "hóng", translation: "rouge", level: 2, example: "「她喜欢红颜色。」— Elle aime la couleur rouge." },
        { word: "欢迎", pinyin: "huānyíng", translation: "bienvenue ; accueillir", level: 2, example: "「欢迎你来我家！」— Bienvenue chez moi !" },
        { word: "回答", pinyin: "huídá", translation: "répondre ; la réponse", level: 2, example: "「请回答我的问题。」— Réponds à ma question, s'il te plaît." },
        { word: "火车站", pinyin: "huǒchēzhàn", translation: "la gare", level: 2, example: "「火车站离这儿很远。」— La gare est loin d'ici." },
        { word: "机场", pinyin: "jīchǎng", translation: "l'aéroport", level: 2, example: "「我们去机场吧。」— Allons à l'aéroport." },
        { word: "鸡蛋", pinyin: "jīdàn", translation: "l'œuf (de poule)", level: 2, example: "「我早上吃了两个鸡蛋。」— J'ai mangé deux œufs ce matin." },
        { word: "件", pinyin: "jiàn", translation: "(classificateur des vêtements, affaires)", level: 2, example: "「我买了一件衣服。」— J'ai acheté un vêtement." },
        { word: "教室", pinyin: "jiàoshì", translation: "la salle de classe", level: 2, example: "「学生们在教室里。」— Les élèves sont dans la salle de classe." },
        { word: "姐姐", pinyin: "jiějie", translation: "la grande sœur", level: 2, example: "「我姐姐是老师。」— Ma grande sœur est professeure." },
        { word: "介绍", pinyin: "jièshào", translation: "présenter", level: 2, example: "「我来介绍一下，这是王先生。」— Je vous présente M. Wang." },
        { word: "进", pinyin: "jìn", translation: "entrer", level: 2, example: "「请进！」— Entrez !" },
        { word: "近", pinyin: "jìn", translation: "proche", level: 2, example: "「我家离学校很近。」— J'habite près de l'école." },
        { word: "就", pinyin: "jiù", translation: "alors ; justement ; tout de suite", level: 2, example: "「我马上就来。」— J'arrive tout de suite." },
        { word: "觉得", pinyin: "juéde", translation: "trouver ; penser que", level: 2, example: "「我觉得汉语不难。」— Je trouve que le chinois n'est pas difficile." },
        { word: "咖啡", pinyin: "kāfēi", translation: "le café (boisson)", level: 2, example: "「你喝咖啡吗？」— Tu bois du café ?" },
        { word: "开始", pinyin: "kāishǐ", translation: "commencer", level: 2, example: "「我们九点开始上课。」— Les cours commencent à neuf heures." },
        { word: "考试", pinyin: "kǎoshì", translation: "l'examen ; passer un examen", level: 2, example: "「明天有汉语考试。」— Il y a un examen de chinois demain." },
        { word: "可能", pinyin: "kěnéng", translation: "peut-être ; possible", level: 2, example: "「明天可能下雨。」— Il va peut-être pleuvoir demain." },
        { word: "可以", pinyin: "kěyǐ", translation: "pouvoir (avoir la permission)", level: 2, example: "「我可以坐这儿吗？」— Puis-je m'asseoir ici ?" },
        { word: "课", pinyin: "kè", translation: "le cours ; la leçon", level: 2, example: "「今天下午没有课。」— Il n'y a pas cours cet après-midi." },
        { word: "快", pinyin: "kuài", translation: "rapide ; vite", level: 2, example: "「他走得很快。」— Il marche très vite." },
        { word: "快乐", pinyin: "kuàilè", translation: "joyeux ; heureux", level: 2, example: "「生日快乐！」— Joyeux anniversaire !" },
        { word: "累", pinyin: "lèi", translation: "fatigué", level: 2, example: "「我今天很累。」— Je suis très fatigué aujourd'hui." },
        { word: "离", pinyin: "lí", translation: "à (distance de)", level: 2, example: "「我家离公司不远。」— Ma maison n'est pas loin du bureau." },
        { word: "两", pinyin: "liǎng", translation: "deux (devant un classificateur)", level: 2, example: "「我有两个姐姐。」— J'ai deux grandes sœurs." },
        { word: "零", pinyin: "líng", translation: "zéro", level: 2, example: "「我的电话号码有三个零。」— Mon numéro de téléphone contient trois zéros." },
        { word: "路", pinyin: "lù", translation: "la route ; le chemin", level: 2, example: "「这条路很长。」— Cette route est très longue." },
        { word: "旅游", pinyin: "lǚyóu", translation: "voyager ; faire du tourisme", level: 2, example: "「我想去中国旅游。」— Je veux voyager en Chine." },
        { word: "卖", pinyin: "mài", translation: "vendre", level: 2, example: "「这个商店卖水果。」— Ce magasin vend des fruits." },
        { word: "慢", pinyin: "màn", translation: "lent ; lentement", level: 2, example: "「请说慢一点儿。」— Parlez plus lentement, s'il vous plaît." },
        { word: "忙", pinyin: "máng", translation: "occupé", level: 2, example: "「我这个星期很忙。」— Je suis très occupé cette semaine." },
        { word: "每", pinyin: "měi", translation: "chaque", level: 2, example: "「我每天早上跑步。」— Je cours tous les matins." },
        { word: "妹妹", pinyin: "mèimei", translation: "la petite sœur", level: 2, example: "「我妹妹很漂亮。」— Ma petite sœur est très jolie." },
        { word: "门", pinyin: "mén", translation: "la porte", level: 2, example: "「请开门。」— Ouvre la porte, s'il te plaît." },
        { word: "面条", pinyin: "miàntiáo", translation: "les nouilles", level: 2, example: "「中午我想吃面条。」— À midi, je veux manger des nouilles." },
        { word: "男", pinyin: "nán", translation: "homme ; masculin", level: 2, example: "「那个男孩子是我弟弟。」— Ce garçon, c'est mon petit frère." },
        { word: "您", pinyin: "nín", translation: "vous (politesse)", level: 2, example: "「您好！」— Bonjour (poli) !" },
        { word: "牛奶", pinyin: "niúnǎi", translation: "le lait", level: 2, example: "「我每天早上喝牛奶。」— Je bois du lait tous les matins." },
        { word: "女", pinyin: "nǚ", translation: "femme ; féminin", level: 2, example: "「我们的老师是女的。」— Notre professeur est une femme." },
        { word: "旁边", pinyin: "pángbiān", translation: "à côté", level: 2, example: "「医院旁边有一个商店。」— Il y a un magasin à côté de l'hôpital." },
        { word: "跑步", pinyin: "pǎobù", translation: "courir ; faire du jogging", level: 2, example: "「他每天跑步。」— Il court tous les jours." },
        { word: "便宜", pinyin: "piányi", translation: "bon marché", level: 2, example: "「这里的水果很便宜。」— Les fruits sont bon marché ici." },
        { word: "票", pinyin: "piào", translation: "le billet ; le ticket", level: 2, example: "「我买了两张电影票。」— J'ai acheté deux places de cinéma." },
        { word: "妻子", pinyin: "qīzi", translation: "l'épouse", level: 2, example: "「他妻子是医生。」— Sa femme est médecin." },
        { word: "起床", pinyin: "qǐchuáng", translation: "se lever", level: 2, example: "「我每天七点起床。」— Je me lève à sept heures tous les jours." },
        { word: "千", pinyin: "qiān", translation: "mille", level: 2, example: "「这个手机三千块。」— Ce téléphone coûte trois mille yuans." },
        { word: "铅笔", pinyin: "qiānbǐ", translation: "le crayon", level: 2, example: "「我可以用你的铅笔吗？」— Je peux utiliser ton crayon ?" },
        { word: "晴", pinyin: "qíng", translation: "ensoleillé ; dégagé", level: 2, example: "「今天是晴天。」— Aujourd'hui, il fait beau." },
        { word: "去年", pinyin: "qùnián", translation: "l'année dernière", level: 2, example: "「我去年去了北京。」— Je suis allé à Pékin l'année dernière." },
        { word: "让", pinyin: "ràng", translation: "laisser ; faire (faire) ; demander à", level: 2, example: "「妈妈让我早点儿睡觉。」— Maman me demande de me coucher tôt." },
        { word: "日", pinyin: "rì", translation: "le jour ; la date", level: 2, example: "「五月一日我们不上班。」— Le 1er mai, nous ne travaillons pas." },
        { word: "上班", pinyin: "shàngbān", translation: "aller au travail", level: 2, example: "「我八点上班。」— Je commence le travail à huit heures." },
        { word: "身体", pinyin: "shēntǐ", translation: "le corps ; la santé", level: 2, example: "「你身体怎么样？」— Comment va ta santé ?" },
        { word: "生病", pinyin: "shēngbìng", translation: "tomber malade", level: 2, example: "「他生病了，没来上课。」— Il est malade, il n'est pas venu en cours." },
        { word: "生日", pinyin: "shēngrì", translation: "l'anniversaire", level: 2, example: "「今天是我的生日。」— C'est mon anniversaire aujourd'hui." },
        { word: "时间", pinyin: "shíjiān", translation: "le temps ; l'heure", level: 2, example: "「你有时间吗？」— Tu as le temps ?" },
        { word: "事情", pinyin: "shìqing", translation: "l'affaire ; la chose", level: 2, example: "「我有一件事情想问你。」— J'ai une chose à te demander." },
        { word: "手表", pinyin: "shǒubiǎo", translation: "la montre", level: 2, example: "「这块手表很贵。」— Cette montre est très chère." },
        { word: "手机", pinyin: "shǒujī", translation: "le téléphone portable", level: 2, example: "「我的手机没有电了。」— Mon téléphone n'a plus de batterie." },
        { word: "说话", pinyin: "shuōhuà", translation: "parler", level: 2, example: "「上课的时候别说话。」— Ne parle pas pendant le cours." },
        { word: "送", pinyin: "sòng", translation: "offrir ; raccompagner", level: 2, example: "「我送你一本书。」— Je t'offre un livre." },
        { word: "虽然…但是", pinyin: "suīrán… dànshì", translation: "bien que…", level: 2, example: "「虽然汉语很难，但是很有意思。」— Bien que le chinois soit difficile, c'est très intéressant." },
        { word: "它", pinyin: "tā", translation: "il ; elle (chose, animal)", level: 2, example: "「我有一只猫，它很小。」— J'ai un chat, il est tout petit." },
        { word: "踢足球", pinyin: "tī zúqiú", translation: "jouer au football", level: 2, example: "「他们在外面踢足球。」— Ils jouent au football dehors." },
        { word: "题", pinyin: "tí", translation: "la question (d'exercice)", level: 2, example: "「这个题太难了。」— Cette question est trop difficile." },
        { word: "跳舞", pinyin: "tiàowǔ", translation: "danser", level: 2, example: "「她跳舞跳得很好。」— Elle danse très bien." },
        { word: "外", pinyin: "wài", translation: "dehors ; extérieur", level: 2, example: "「外面很冷。」— Il fait froid dehors." },
        { word: "完", pinyin: "wán", translation: "finir ; terminé", level: 2, example: "「我吃完了。」— J'ai fini de manger." },
        { word: "玩", pinyin: "wán", translation: "jouer ; s'amuser", level: 2, example: "「孩子们在外面玩。」— Les enfants jouent dehors." },
        { word: "晚上", pinyin: "wǎnshang", translation: "le soir", level: 2, example: "「晚上我们去看电影吧。」— Allons au cinéma ce soir." },
        { word: "往", pinyin: "wǎng", translation: "vers ; en direction de", level: 2, example: "「往前走就是火车站。」— Tout droit, c'est la gare." },
        { word: "为什么", pinyin: "wèi shénme", translation: "pourquoi ?", level: 2, example: "「你为什么不高兴？」— Pourquoi n'es-tu pas content ?" },
        { word: "问", pinyin: "wèn", translation: "demander", level: 2, example: "「我可以问你一个问题吗？」— Je peux te poser une question ?" },
        { word: "问题", pinyin: "wèntí", translation: "la question ; le problème", level: 2, example: "「没问题！」— Pas de problème !" },
        { word: "西瓜", pinyin: "xīguā", translation: "la pastèque", level: 2, example: "「我喜欢吃西瓜。」— J'aime manger de la pastèque." },
        { word: "希望", pinyin: "xīwàng", translation: "espérer ; l'espoir", level: 2, example: "「我希望明天是晴天。」— J'espère qu'il fera beau demain." },
        { word: "洗", pinyin: "xǐ", translation: "laver", level: 2, example: "「吃饭前要洗手。」— Il faut se laver les mains avant de manger." },
        { word: "向", pinyin: "xiàng", translation: "vers ; à (direction)", level: 2, example: "「向前走。」— Avance tout droit." },
        { word: "小时", pinyin: "xiǎoshí", translation: "l'heure (durée)", level: 2, example: "「我每天工作八个小时。」— Je travaille huit heures par jour." },
        { word: "笑", pinyin: "xiào", translation: "rire ; sourire", level: 2, example: "「你笑什么？」— Pourquoi tu ris ?" },
        { word: "新", pinyin: "xīn", translation: "nouveau ; neuf", level: 2, example: "「这是我的新手机。」— C'est mon nouveau téléphone." },
        { word: "姓", pinyin: "xìng", translation: "avoir pour nom de famille", level: 2, example: "「您贵姓？——我姓王。」— Votre nom ? — Je m'appelle Wang." },
        { word: "休息", pinyin: "xiūxi", translation: "se reposer", level: 2, example: "「你累了，休息一下吧。」— Tu es fatigué, repose-toi un peu." },
        { word: "雪", pinyin: "xuě", translation: "la neige", level: 2, example: "「北京下雪了。」— Il neige à Pékin." },
        { word: "颜色", pinyin: "yánsè", translation: "la couleur", level: 2, example: "「你喜欢什么颜色？」— Quelle couleur aimes-tu ?" },
        { word: "眼睛", pinyin: "yǎnjing", translation: "l'œil ; les yeux", level: 2, example: "「她的眼睛很漂亮。」— Elle a de très beaux yeux." },
        { word: "羊肉", pinyin: "yángròu", translation: "la viande de mouton", level: 2, example: "「我不吃羊肉。」— Je ne mange pas de mouton." },
        { word: "药", pinyin: "yào", translation: "le médicament", level: 2, example: "「你吃药了吗？」— Tu as pris ton médicament ?" },
        { word: "要", pinyin: "yào", translation: "vouloir ; devoir ; aller (futur)", level: 2, example: "「我要一杯咖啡。」— Je voudrais un café." },
        { word: "也", pinyin: "yě", translation: "aussi", level: 2, example: "「我也是学生。」— Je suis étudiant aussi." },
        { word: "一下", pinyin: "yíxià", translation: "un peu ; un instant", level: 2, example: "「请等一下。」— Un instant, s'il vous plaît." },
        { word: "一起", pinyin: "yìqǐ", translation: "ensemble", level: 2, example: "「我们一起吃饭吧。」— Mangeons ensemble." },
        { word: "已经", pinyin: "yǐjīng", translation: "déjà", level: 2, example: "「我已经吃饭了。」— J'ai déjà mangé." },
        { word: "意思", pinyin: "yìsi", translation: "le sens ; la signification", level: 2, example: "「这个字是什么意思？」— Que veut dire ce caractère ?" },
        { word: "因为…所以", pinyin: "yīnwèi… suǒyǐ", translation: "parce que… donc", level: 2, example: "「因为下雨，所以我没去。」— Comme il pleuvait, je n'y suis pas allé." },
        { word: "阴", pinyin: "yīn", translation: "nuageux ; couvert", level: 2, example: "「今天是阴天。」— Le ciel est couvert aujourd'hui." },
        { word: "游泳", pinyin: "yóuyǒng", translation: "nager", level: 2, example: "「你会游泳吗？」— Tu sais nager ?" },
        { word: "右边", pinyin: "yòubian", translation: "à droite", level: 2, example: "「商店在右边。」— Le magasin est à droite." },
        { word: "鱼", pinyin: "yú", translation: "le poisson", level: 2, example: "「我喜欢吃鱼。」— J'aime manger du poisson." },
        { word: "远", pinyin: "yuǎn", translation: "loin", level: 2, example: "「机场离这儿很远。」— L'aéroport est loin d'ici." },
        { word: "运动", pinyin: "yùndòng", translation: "le sport ; faire du sport", level: 2, example: "「你喜欢什么运动？」— Quel sport aimes-tu ?" },
        { word: "再", pinyin: "zài", translation: "de nouveau ; encore", level: 2, example: "「请再说一次。」— Répétez, s'il vous plaît." },
        { word: "早上", pinyin: "zǎoshang", translation: "le matin (tôt)", level: 2, example: "「早上好！」— Bonjour ! (le matin)" },
        { word: "丈夫", pinyin: "zhàngfu", translation: "le mari", level: 2, example: "「她丈夫是老师。」— Son mari est professeur." },
        { word: "找", pinyin: "zhǎo", translation: "chercher", level: 2, example: "「你在找什么？」— Qu'est-ce que tu cherches ?" },
        { word: "着", pinyin: "zhe", translation: "(particule : état continu)", level: 2, example: "「门开着。」— La porte est ouverte." },
        { word: "真", pinyin: "zhēn", translation: "vraiment", level: 2, example: "「这个西瓜真大！」— Cette pastèque est vraiment grosse !" },
        { word: "正在", pinyin: "zhèngzài", translation: "être en train de", level: 2, example: "「我正在吃饭。」— Je suis en train de manger." },
        { word: "知道", pinyin: "zhīdào", translation: "savoir", level: 2, example: "「我不知道他在哪儿。」— Je ne sais pas où il est." },
        { word: "准备", pinyin: "zhǔnbèi", translation: "préparer ; se préparer", level: 2, example: "「我在准备考试。」— Je prépare l'examen." },
        { word: "走", pinyin: "zǒu", translation: "marcher ; partir", level: 2, example: "「我们走了，再见！」— On s'en va, au revoir !" },
        { word: "最", pinyin: "zuì", translation: "le plus", level: 2, example: "「我最喜欢吃面条。」— Ce que je préfère, ce sont les nouilles." },
        { word: "左边", pinyin: "zuǒbian", translation: "à gauche", level: 2, example: "「医院在左边。」— L'hôpital est à gauche." }
      ]
    },
    en: {
      flag: '🇬🇧', name: 'Anglais → Chinois', tts: 'zh-CN',
      desc: 'Official HSK 1 & HSK 2 vocabulary.',
      cards: [
        // — HSK 1 · Beginner
        { word: "爱", pinyin: "ài", translation: "to love", level: 1, example: "「我爱我的家。」— I love my family." },
        { word: "八", pinyin: "bā", translation: "eight", level: 1, example: "「我八点起床。」— I get up at eight." },
        { word: "爸爸", pinyin: "bàba", translation: "dad; father", level: 1, example: "「我爸爸是医生。」— My dad is a doctor." },
        { word: "杯子", pinyin: "bēizi", translation: "cup; glass", level: 1, example: "「这个杯子是我的。」— This cup is mine." },
        { word: "北京", pinyin: "Běijīng", translation: "Beijing", level: 1, example: "「我在北京工作。」— I work in Beijing." },
        { word: "本", pinyin: "běn", translation: "(classifier for books)", level: 1, example: "「我有三本书。」— I have three books." },
        { word: "不", pinyin: "bù", translation: "not; no", level: 1, example: "「我不喝茶。」— I don't drink tea." },
        { word: "不客气", pinyin: "bú kèqi", translation: "you're welcome", level: 1, example: "「谢谢！——不客气。」— Thanks! — You're welcome." },
        { word: "菜", pinyin: "cài", translation: "dish; vegetable", level: 1, example: "「这个菜很好吃。」— This dish is delicious." },
        { word: "茶", pinyin: "chá", translation: "tea", level: 1, example: "「你想喝茶吗？」— Would you like some tea?" },
        { word: "吃", pinyin: "chī", translation: "to eat", level: 1, example: "「我们中午吃米饭。」— We eat rice at noon." },
        { word: "出租车", pinyin: "chūzūchē", translation: "taxi", level: 1, example: "「我们坐出租车去吧。」— Let's take a taxi." },
        { word: "打电话", pinyin: "dǎ diànhuà", translation: "to make a phone call", level: 1, example: "「我明天给你打电话。」— I'll call you tomorrow." },
        { word: "大", pinyin: "dà", translation: "big; large", level: 1, example: "「他家很大。」— His home is big." },
        { word: "的", pinyin: "de", translation: "(possessive / structural particle)", level: 1, example: "「这是我的书。」— This is my book." },
        { word: "点", pinyin: "diǎn", translation: "o'clock; a little", level: 1, example: "「现在三点。」— It's three o'clock." },
        { word: "电脑", pinyin: "diànnǎo", translation: "computer", level: 1, example: "「我的电脑很新。」— My computer is new." },
        { word: "电视", pinyin: "diànshì", translation: "television", level: 1, example: "「爸爸在看电视。」— Dad is watching TV." },
        { word: "电影", pinyin: "diànyǐng", translation: "movie; film", level: 1, example: "「我们去看电影吧。」— Let's go see a movie." },
        { word: "东西", pinyin: "dōngxi", translation: "thing; stuff", level: 1, example: "「你买了什么东西？」— What did you buy?" },
        { word: "都", pinyin: "dōu", translation: "all; both", level: 1, example: "「我们都是学生。」— We are all students." },
        { word: "读", pinyin: "dú", translation: "to read (aloud)", level: 1, example: "「请读这个字。」— Please read this character." },
        { word: "对不起", pinyin: "duìbuqǐ", translation: "sorry", level: 1, example: "「对不起，我不认识他。」— Sorry, I don't know him." },
        { word: "多", pinyin: "duō", translation: "many; much", level: 1, example: "「这里人很多。」— There are many people here." },
        { word: "多少", pinyin: "duōshao", translation: "how many; how much", level: 1, example: "「这个多少钱？」— How much is this?" },
        { word: "儿子", pinyin: "érzi", translation: "son", level: 1, example: "「他儿子三岁。」— His son is three." },
        { word: "二", pinyin: "èr", translation: "two", level: 1, example: "「今天是二月一号。」— Today is February 1st." },
        { word: "饭店", pinyin: "fàndiàn", translation: "restaurant; hotel", level: 1, example: "「这个饭店的菜很好吃。」— This restaurant's food is good." },
        { word: "飞机", pinyin: "fēijī", translation: "airplane", level: 1, example: "「我坐飞机去北京。」— I'm flying to Beijing." },
        { word: "分钟", pinyin: "fēnzhōng", translation: "minute", level: 1, example: "「请等我五分钟。」— Please wait five minutes for me." },
        { word: "高兴", pinyin: "gāoxìng", translation: "happy; glad", level: 1, example: "「认识你很高兴。」— Nice to meet you." },
        { word: "个", pinyin: "gè", translation: "(general classifier)", level: 1, example: "「我有一个妹妹。」— I have a younger sister." },
        { word: "工作", pinyin: "gōngzuò", translation: "work; to work", level: 1, example: "「你在哪儿工作？」— Where do you work?" },
        { word: "狗", pinyin: "gǒu", translation: "dog", level: 1, example: "「我家有一只狗。」— We have a dog." },
        { word: "汉语", pinyin: "Hànyǔ", translation: "Chinese (language)", level: 1, example: "「我在学习汉语。」— I'm learning Chinese." },
        { word: "好", pinyin: "hǎo", translation: "good; well", level: 1, example: "「今天天气很好。」— The weather is nice today." },
        { word: "号", pinyin: "hào", translation: "day of the month; number", level: 1, example: "「今天几号？」— What's the date today?" },
        { word: "喝", pinyin: "hē", translation: "to drink", level: 1, example: "「我想喝水。」— I'd like to drink some water." },
        { word: "和", pinyin: "hé", translation: "and; with", level: 1, example: "「我和朋友去商店。」— I'm going to the shop with a friend." },
        { word: "很", pinyin: "hěn", translation: "very", level: 1, example: "「她很漂亮。」— She is very pretty." },
        { word: "后面", pinyin: "hòumian", translation: "behind; back", level: 1, example: "「学校后面有一个商店。」— There's a shop behind the school." },
        { word: "回", pinyin: "huí", translation: "to return; to go back", level: 1, example: "「我五点回家。」— I go home at five." },
        { word: "会", pinyin: "huì", translation: "can; to know how to", level: 1, example: "「你会说汉语吗？」— Can you speak Chinese?" },
        { word: "几", pinyin: "jǐ", translation: "how many; a few", level: 1, example: "「你家有几个人？」— How many people are in your family?" },
        { word: "家", pinyin: "jiā", translation: "home; family", level: 1, example: "「我家在北京。」— My home is in Beijing." },
        { word: "叫", pinyin: "jiào", translation: "to be called; to call", level: 1, example: "「你叫什么名字？」— What's your name?" },
        { word: "今天", pinyin: "jīntiān", translation: "today", level: 1, example: "「今天星期一。」— Today is Monday." },
        { word: "九", pinyin: "jiǔ", translation: "nine", level: 1, example: "「我九月去中国。」— I'm going to China in September." },
        { word: "开", pinyin: "kāi", translation: "to open; to drive", level: 1, example: "「商店九点开门。」— The shop opens at nine." },
        { word: "看", pinyin: "kàn", translation: "to look; to watch; to read", level: 1, example: "「我喜欢看书。」— I like reading." },
        { word: "看见", pinyin: "kànjiàn", translation: "to see", level: 1, example: "「你看见我的猫了吗？」— Have you seen my cat?" },
        { word: "块", pinyin: "kuài", translation: "kuai (yuan, colloquial)", level: 1, example: "「这本书十块钱。」— This book costs ten kuai." },
        { word: "来", pinyin: "lái", translation: "to come", level: 1, example: "「你什么时候来？」— When are you coming?" },
        { word: "老师", pinyin: "lǎoshī", translation: "teacher", level: 1, example: "「王老师是北京人。」— Teacher Wang is from Beijing." },
        { word: "了", pinyin: "le", translation: "(particle: completed action, change)", level: 1, example: "「我吃饭了。」— I've eaten." },
        { word: "冷", pinyin: "lěng", translation: "cold", level: 1, example: "「今天很冷。」— It's cold today." },
        { word: "里", pinyin: "lǐ", translation: "in; inside", level: 1, example: "「猫在房子里。」— The cat is in the house." },
        { word: "六", pinyin: "liù", translation: "six", level: 1, example: "「我六点起来。」— I get up at six." },
        { word: "吗", pinyin: "ma", translation: "(question particle)", level: 1, example: "「你是老师吗？」— Are you a teacher?" },
        { word: "妈妈", pinyin: "māma", translation: "mom; mother", level: 1, example: "「妈妈在做饭。」— Mom is cooking." },
        { word: "买", pinyin: "mǎi", translation: "to buy", level: 1, example: "「我想买一本书。」— I'd like to buy a book." },
        { word: "猫", pinyin: "māo", translation: "cat", level: 1, example: "「那只猫很小。」— That cat is very small." },
        { word: "没关系", pinyin: "méi guānxi", translation: "it doesn't matter", level: 1, example: "「对不起！——没关系。」— Sorry! — It doesn't matter." },
        { word: "没有", pinyin: "méiyǒu", translation: "not have; there is not", level: 1, example: "「我没有钱。」— I don't have any money." },
        { word: "米饭", pinyin: "mǐfàn", translation: "cooked rice", level: 1, example: "「我想吃米饭。」— I'd like to eat rice." },
        { word: "名字", pinyin: "míngzi", translation: "name", level: 1, example: "「你的名字很好听。」— Your name sounds nice." },
        { word: "明天", pinyin: "míngtiān", translation: "tomorrow", level: 1, example: "「明天我去学校。」— Tomorrow I'm going to school." },
        { word: "哪", pinyin: "nǎ", translation: "which", level: 1, example: "「你是哪国人？」— Which country are you from?" },
        { word: "哪儿", pinyin: "nǎr", translation: "where", level: 1, example: "「你去哪儿？」— Where are you going?" },
        { word: "那", pinyin: "nà", translation: "that", level: 1, example: "「那是我的电脑。」— That's my computer." },
        { word: "那儿", pinyin: "nàr", translation: "there", level: 1, example: "「我的书在那儿。」— My book is over there." },
        { word: "呢", pinyin: "ne", translation: "(particle: \"and you?\"; ongoing action)", level: 1, example: "「我很好，你呢？」— I'm fine, and you?" },
        { word: "能", pinyin: "néng", translation: "can; to be able to", level: 1, example: "「你明天能来吗？」— Can you come tomorrow?" },
        { word: "你", pinyin: "nǐ", translation: "you", level: 1, example: "「你好！」— Hello!" },
        { word: "年", pinyin: "nián", translation: "year", level: 1, example: "「我在中国住了一年。」— I lived in China for a year." },
        { word: "女儿", pinyin: "nǚ'ér", translation: "daughter", level: 1, example: "「她女儿是学生。」— Her daughter is a student." },
        { word: "朋友", pinyin: "péngyou", translation: "friend", level: 1, example: "「他是我的好朋友。」— He's my good friend." },
        { word: "漂亮", pinyin: "piàoliang", translation: "pretty; beautiful", level: 1, example: "「这件衣服很漂亮。」— This piece of clothing is very pretty." },
        { word: "苹果", pinyin: "píngguǒ", translation: "apple", level: 1, example: "「我想吃苹果。」— I'd like to eat an apple." },
        { word: "七", pinyin: "qī", translation: "seven", level: 1, example: "「一个星期有七天。」— A week has seven days." },
        { word: "前面", pinyin: "qiánmian", translation: "in front; ahead", level: 1, example: "「前面有一个饭店。」— There's a restaurant ahead." },
        { word: "钱", pinyin: "qián", translation: "money", level: 1, example: "「你有钱吗？」— Do you have any money?" },
        { word: "请", pinyin: "qǐng", translation: "please; to invite", level: 1, example: "「请坐！」— Please sit down!" },
        { word: "去", pinyin: "qù", translation: "to go", level: 1, example: "「我想去中国。」— I want to go to China." },
        { word: "热", pinyin: "rè", translation: "hot", level: 1, example: "「今天太热了！」— It's too hot today!" },
        { word: "人", pinyin: "rén", translation: "person; people", level: 1, example: "「商店里有很多人。」— There are a lot of people in the shop." },
        { word: "认识", pinyin: "rènshi", translation: "to know (someone); to recognize", level: 1, example: "「我认识他。」— I know him." },
        { word: "三", pinyin: "sān", translation: "three", level: 1, example: "「我有三个朋友。」— I have three friends." },
        { word: "商店", pinyin: "shāngdiàn", translation: "shop; store", level: 1, example: "「我去商店买东西。」— I'm going shopping at the store." },
        { word: "上", pinyin: "shàng", translation: "on; above; to go up", level: 1, example: "「书在桌子上。」— The book is on the table." },
        { word: "上午", pinyin: "shàngwǔ", translation: "morning (before noon)", level: 1, example: "「我上午工作。」— I work in the morning." },
        { word: "少", pinyin: "shǎo", translation: "few; little", level: 1, example: "「这里人很少。」— There are few people here." },
        { word: "谁", pinyin: "shéi", translation: "who", level: 1, example: "「他是谁？」— Who is he?" },
        { word: "什么", pinyin: "shénme", translation: "what", level: 1, example: "「你想吃什么？」— What do you want to eat?" },
        { word: "十", pinyin: "shí", translation: "ten", level: 1, example: "「我十点睡觉。」— I go to bed at ten." },
        { word: "时候", pinyin: "shíhou", translation: "time; moment", level: 1, example: "「你什么时候回家？」— When are you going home?" },
        { word: "是", pinyin: "shì", translation: "to be", level: 1, example: "「我是法国人。」— I'm French." },
        { word: "书", pinyin: "shū", translation: "book", level: 1, example: "「这本书很好看。」— This book is very good." },
        { word: "水", pinyin: "shuǐ", translation: "water", level: 1, example: "「请给我一杯水。」— A glass of water, please." },
        { word: "水果", pinyin: "shuǐguǒ", translation: "fruit", level: 1, example: "「我喜欢吃水果。」— I like eating fruit." },
        { word: "睡觉", pinyin: "shuìjiào", translation: "to sleep; to go to bed", level: 1, example: "「我十一点睡觉。」— I go to bed at eleven." },
        { word: "说", pinyin: "shuō", translation: "to say; to speak", level: 1, example: "「你说什么？」— What did you say?" },
        { word: "四", pinyin: "sì", translation: "four", level: 1, example: "「我们家有四个人。」— There are four people in our family." },
        { word: "岁", pinyin: "suì", translation: "year (of age)", level: 1, example: "「你几岁了？」— How old are you?" },
        { word: "他", pinyin: "tā", translation: "he; him", level: 1, example: "「他是我哥哥。」— He's my older brother." },
        { word: "她", pinyin: "tā", translation: "she; her", level: 1, example: "「她是我的老师。」— She's my teacher." },
        { word: "太", pinyin: "tài", translation: "too; extremely", level: 1, example: "「这个太贵了！」— This is too expensive!" },
        { word: "天气", pinyin: "tiānqì", translation: "weather", level: 1, example: "「明天天气怎么样？」— What will the weather be like tomorrow?" },
        { word: "听", pinyin: "tīng", translation: "to listen", level: 1, example: "「我喜欢听中国歌。」— I like listening to Chinese songs." },
        { word: "同学", pinyin: "tóngxué", translation: "classmate", level: 1, example: "「他是我的同学。」— He's my classmate." },
        { word: "喂", pinyin: "wéi", translation: "hello (on the phone)", level: 1, example: "「喂，你好！」— Hello? (on the phone)" },
        { word: "我", pinyin: "wǒ", translation: "I; me", level: 1, example: "「我是学生。」— I'm a student." },
        { word: "我们", pinyin: "wǒmen", translation: "we; us", level: 1, example: "「我们一起去吧！」— Let's go together!" },
        { word: "五", pinyin: "wǔ", translation: "five", level: 1, example: "「我有五块钱。」— I have five kuai." },
        { word: "喜欢", pinyin: "xǐhuan", translation: "to like", level: 1, example: "「我喜欢喝茶。」— I like drinking tea." },
        { word: "下", pinyin: "xià", translation: "below; to go down; next", level: 1, example: "「下个星期我去北京。」— Next week I'm going to Beijing." },
        { word: "下午", pinyin: "xiàwǔ", translation: "afternoon", level: 1, example: "「我们下午去商店。」— We're going to the shop this afternoon." },
        { word: "下雨", pinyin: "xià yǔ", translation: "to rain", level: 1, example: "「今天下雨了。」— It rained today." },
        { word: "先生", pinyin: "xiānsheng", translation: "Mr.; sir", level: 1, example: "「王先生在家吗？」— Is Mr. Wang at home?" },
        { word: "现在", pinyin: "xiànzài", translation: "now", level: 1, example: "「现在几点？」— What time is it now?" },
        { word: "想", pinyin: "xiǎng", translation: "to want; to think; to miss", level: 1, example: "「我想回家。」— I want to go home." },
        { word: "小", pinyin: "xiǎo", translation: "small; little", level: 1, example: "「我的房子很小。」— My house is small." },
        { word: "小姐", pinyin: "xiǎojiě", translation: "Miss; young lady", level: 1, example: "「李小姐是老师。」— Miss Li is a teacher." },
        { word: "些", pinyin: "xiē", translation: "some; a few", level: 1, example: "「我买了一些水果。」— I bought some fruit." },
        { word: "写", pinyin: "xiě", translation: "to write", level: 1, example: "「你会写汉字吗？」— Can you write Chinese characters?" },
        { word: "谢谢", pinyin: "xièxie", translation: "thank you", level: 1, example: "「谢谢你！」— Thank you!" },
        { word: "星期", pinyin: "xīngqī", translation: "week", level: 1, example: "「下星期见！」— See you next week!" },
        { word: "学生", pinyin: "xuésheng", translation: "student", level: 1, example: "「他是北京大学的学生。」— He's a student at Peking University." },
        { word: "学习", pinyin: "xuéxí", translation: "to study; to learn", level: 1, example: "「我在学习汉语。」— I'm studying Chinese." },
        { word: "学校", pinyin: "xuéxiào", translation: "school", level: 1, example: "「我们学校很大。」— Our school is big." },
        { word: "一", pinyin: "yī", translation: "one", level: 1, example: "「我有一个哥哥。」— I have an older brother." },
        { word: "衣服", pinyin: "yīfu", translation: "clothes", level: 1, example: "「她买了很多衣服。」— She bought a lot of clothes." },
        { word: "医生", pinyin: "yīshēng", translation: "doctor", level: 1, example: "「我想当医生。」— I want to become a doctor." },
        { word: "医院", pinyin: "yīyuàn", translation: "hospital", level: 1, example: "「他在医院工作。」— He works at the hospital." },
        { word: "椅子", pinyin: "yǐzi", translation: "chair", level: 1, example: "「这把椅子很漂亮。」— This chair is very pretty." },
        { word: "有", pinyin: "yǒu", translation: "to have; there is", level: 1, example: "「我有一只猫。」— I have a cat." },
        { word: "月", pinyin: "yuè", translation: "month; moon", level: 1, example: "「我下个月去中国。」— I'm going to China next month." },
        { word: "在", pinyin: "zài", translation: "to be at; in; (in progress)", level: 1, example: "「我在家。」— I'm at home." },
        { word: "再见", pinyin: "zàijiàn", translation: "goodbye", level: 1, example: "「老师，再见！」— Goodbye, teacher!" },
        { word: "怎么", pinyin: "zěnme", translation: "how", level: 1, example: "「这个字怎么读？」— How do you read this character?" },
        { word: "怎么样", pinyin: "zěnmeyàng", translation: "how is it?; how about", level: 1, example: "「这个电影怎么样？」— How is this movie?" },
        { word: "这", pinyin: "zhè", translation: "this (这儿: here)", level: 1, example: "「这是我妈妈。」— This is my mother." },
        { word: "中国", pinyin: "Zhōngguó", translation: "China", level: 1, example: "「中国很大。」— China is big." },
        { word: "中午", pinyin: "zhōngwǔ", translation: "noon", level: 1, example: "「中午我们吃米饭。」— We eat rice at noon." },
        { word: "住", pinyin: "zhù", translation: "to live; to stay", level: 1, example: "「你住在哪儿？」— Where do you live?" },
        { word: "桌子", pinyin: "zhuōzi", translation: "table; desk", level: 1, example: "「桌子上有一本书。」— There's a book on the table." },
        { word: "字", pinyin: "zì", translation: "character (written)", level: 1, example: "「这个字我不认识。」— I don't know this character." },
        { word: "昨天", pinyin: "zuótiān", translation: "yesterday", level: 1, example: "「昨天我去医院了。」— I went to the hospital yesterday." },
        { word: "坐", pinyin: "zuò", translation: "to sit; to take (transport)", level: 1, example: "「请坐这儿。」— Please sit here." },
        { word: "做", pinyin: "zuò", translation: "to do; to make", level: 1, example: "「你在做什么？」— What are you doing?" },

        // — HSK 2 · Elementary
        { word: "吧", pinyin: "ba", translation: "(particle: suggestion)", level: 2, example: "「我们走吧！」— Let's go!" },
        { word: "白", pinyin: "bái", translation: "white", level: 2, example: "「我喜欢白衣服。」— I like white clothes." },
        { word: "百", pinyin: "bǎi", translation: "hundred", level: 2, example: "「这件衣服三百块。」— This piece of clothing costs 300 kuai." },
        { word: "帮助", pinyin: "bāngzhù", translation: "to help; help", level: 2, example: "「谢谢你的帮助！」— Thanks for your help!" },
        { word: "报纸", pinyin: "bàozhǐ", translation: "newspaper", level: 2, example: "「爸爸每天看报纸。」— Dad reads the newspaper every day." },
        { word: "比", pinyin: "bǐ", translation: "than (comparison)", level: 2, example: "「今天比昨天冷。」— Today is colder than yesterday." },
        { word: "别", pinyin: "bié", translation: "don't", level: 2, example: "「别说话！」— Don't talk!" },
        { word: "宾馆", pinyin: "bīnguǎn", translation: "hotel", level: 2, example: "「我们住在这个宾馆。」— We're staying at this hotel." },
        { word: "长", pinyin: "cháng", translation: "long", level: 2, example: "「她的头发很长。」— Her hair is long." },
        { word: "唱歌", pinyin: "chàng gē", translation: "to sing", level: 2, example: "「她很喜欢唱歌。」— She loves singing." },
        { word: "出", pinyin: "chū", translation: "to go out; to come out", level: 2, example: "「他出去了。」— He went out." },
        { word: "穿", pinyin: "chuān", translation: "to wear; to put on", level: 2, example: "「今天你穿得很漂亮。」— You're dressed nicely today." },
        { word: "次", pinyin: "cì", translation: "time (occurrence)", level: 2, example: "「我去过两次北京。」— I've been to Beijing twice." },
        { word: "从", pinyin: "cóng", translation: "from", level: 2, example: "「我从法国来。」— I come from France." },
        { word: "错", pinyin: "cuò", translation: "wrong; mistake", level: 2, example: "「你说错了。」— You said it wrong." },
        { word: "打篮球", pinyin: "dǎ lánqiú", translation: "to play basketball", level: 2, example: "「我们下午去打篮球。」— We're playing basketball this afternoon." },
        { word: "大家", pinyin: "dàjiā", translation: "everyone", level: 2, example: "「大家好！」— Hello, everyone!" },
        { word: "到", pinyin: "dào", translation: "to arrive; until", level: 2, example: "「我们到北京了。」— We've arrived in Beijing." },
        { word: "得", pinyin: "de", translation: "(complement particle)", level: 2, example: "「他跑得很快。」— He runs very fast." },
        { word: "等", pinyin: "děng", translation: "to wait", level: 2, example: "「请等我一会儿。」— Please wait for me a moment." },
        { word: "弟弟", pinyin: "dìdi", translation: "younger brother", level: 2, example: "「我弟弟八岁。」— My younger brother is eight." },
        { word: "第一", pinyin: "dì-yī", translation: "first", level: 2, example: "「这是我第一次来中国。」— This is my first time in China." },
        { word: "懂", pinyin: "dǒng", translation: "to understand", level: 2, example: "「你懂我的意思吗？」— Do you understand what I mean?" },
        { word: "对", pinyin: "duì", translation: "right; correct", level: 2, example: "「你说得对。」— You're right." },
        { word: "房间", pinyin: "fángjiān", translation: "room", level: 2, example: "「我的房间很小。」— My room is small." },
        { word: "非常", pinyin: "fēicháng", translation: "very; extremely", level: 2, example: "「我非常喜欢北京。」— I really love Beijing." },
        { word: "服务员", pinyin: "fúwùyuán", translation: "waiter; attendant", level: 2, example: "「服务员，请给我一杯茶。」— Waiter, a cup of tea, please." },
        { word: "高", pinyin: "gāo", translation: "tall; high", level: 2, example: "「我哥哥很高。」— My older brother is tall." },
        { word: "告诉", pinyin: "gàosu", translation: "to tell", level: 2, example: "「请告诉我你的名字。」— Please tell me your name." },
        { word: "哥哥", pinyin: "gēge", translation: "older brother", level: 2, example: "「我哥哥在医院工作。」— My older brother works at the hospital." },
        { word: "给", pinyin: "gěi", translation: "to give; for", level: 2, example: "「妈妈给我一个苹果。」— Mom gives me an apple." },
        { word: "公共汽车", pinyin: "gōnggòng qìchē", translation: "bus", level: 2, example: "「我坐公共汽车上班。」— I take the bus to work." },
        { word: "公斤", pinyin: "gōngjīn", translation: "kilogram", level: 2, example: "「我买了两公斤苹果。」— I bought two kilos of apples." },
        { word: "公司", pinyin: "gōngsī", translation: "company", level: 2, example: "「她在一家大公司工作。」— She works at a big company." },
        { word: "贵", pinyin: "guì", translation: "expensive", level: 2, example: "「这个手机太贵了。」— This phone is too expensive." },
        { word: "过", pinyin: "guo", translation: "(particle: past experience)", level: 2, example: "「我去过中国。」— I've been to China." },
        { word: "还", pinyin: "hái", translation: "still; also", level: 2, example: "「他还在睡觉。」— He's still sleeping." },
        { word: "孩子", pinyin: "háizi", translation: "child", level: 2, example: "「这个孩子很可爱。」— This child is adorable." },
        { word: "好吃", pinyin: "hǎochī", translation: "delicious", level: 2, example: "「妈妈做的菜很好吃。」— Mom's cooking is delicious." },
        { word: "黑", pinyin: "hēi", translation: "black", level: 2, example: "「我的猫是黑的。」— My cat is black." },
        { word: "红", pinyin: "hóng", translation: "red", level: 2, example: "「她喜欢红颜色。」— She likes the color red." },
        { word: "欢迎", pinyin: "huānyíng", translation: "welcome; to welcome", level: 2, example: "「欢迎你来我家！」— Welcome to my home!" },
        { word: "回答", pinyin: "huídá", translation: "to answer; answer", level: 2, example: "「请回答我的问题。」— Please answer my question." },
        { word: "火车站", pinyin: "huǒchēzhàn", translation: "train station", level: 2, example: "「火车站离这儿很远。」— The train station is far from here." },
        { word: "机场", pinyin: "jīchǎng", translation: "airport", level: 2, example: "「我们去机场吧。」— Let's go to the airport." },
        { word: "鸡蛋", pinyin: "jīdàn", translation: "egg", level: 2, example: "「我早上吃了两个鸡蛋。」— I ate two eggs this morning." },
        { word: "件", pinyin: "jiàn", translation: "(classifier for clothes, matters)", level: 2, example: "「我买了一件衣服。」— I bought a piece of clothing." },
        { word: "教室", pinyin: "jiàoshì", translation: "classroom", level: 2, example: "「学生们在教室里。」— The students are in the classroom." },
        { word: "姐姐", pinyin: "jiějie", translation: "older sister", level: 2, example: "「我姐姐是老师。」— My older sister is a teacher." },
        { word: "介绍", pinyin: "jièshào", translation: "to introduce", level: 2, example: "「我来介绍一下，这是王先生。」— Let me introduce Mr. Wang." },
        { word: "进", pinyin: "jìn", translation: "to enter", level: 2, example: "「请进！」— Come in!" },
        { word: "近", pinyin: "jìn", translation: "near; close", level: 2, example: "「我家离学校很近。」— My home is close to school." },
        { word: "就", pinyin: "jiù", translation: "then; right away; just", level: 2, example: "「我马上就来。」— I'm coming right away." },
        { word: "觉得", pinyin: "juéde", translation: "to feel; to think", level: 2, example: "「我觉得汉语不难。」— I think Chinese isn't hard." },
        { word: "咖啡", pinyin: "kāfēi", translation: "coffee", level: 2, example: "「你喝咖啡吗？」— Do you drink coffee?" },
        { word: "开始", pinyin: "kāishǐ", translation: "to begin; to start", level: 2, example: "「我们九点开始上课。」— Class starts at nine." },
        { word: "考试", pinyin: "kǎoshì", translation: "exam; to take an exam", level: 2, example: "「明天有汉语考试。」— There's a Chinese exam tomorrow." },
        { word: "可能", pinyin: "kěnéng", translation: "maybe; possible", level: 2, example: "「明天可能下雨。」— It might rain tomorrow." },
        { word: "可以", pinyin: "kěyǐ", translation: "can; may", level: 2, example: "「我可以坐这儿吗？」— May I sit here?" },
        { word: "课", pinyin: "kè", translation: "class; lesson", level: 2, example: "「今天下午没有课。」— There's no class this afternoon." },
        { word: "快", pinyin: "kuài", translation: "fast; quick", level: 2, example: "「他走得很快。」— He walks very fast." },
        { word: "快乐", pinyin: "kuàilè", translation: "happy", level: 2, example: "「生日快乐！」— Happy birthday!" },
        { word: "累", pinyin: "lèi", translation: "tired", level: 2, example: "「我今天很累。」— I'm very tired today." },
        { word: "离", pinyin: "lí", translation: "from (distance)", level: 2, example: "「我家离公司不远。」— My home isn't far from the office." },
        { word: "两", pinyin: "liǎng", translation: "two (before a classifier)", level: 2, example: "「我有两个姐姐。」— I have two older sisters." },
        { word: "零", pinyin: "líng", translation: "zero", level: 2, example: "「我的电话号码有三个零。」— My phone number has three zeros." },
        { word: "路", pinyin: "lù", translation: "road; way", level: 2, example: "「这条路很长。」— This road is very long." },
        { word: "旅游", pinyin: "lǚyóu", translation: "to travel; tourism", level: 2, example: "「我想去中国旅游。」— I want to travel to China." },
        { word: "卖", pinyin: "mài", translation: "to sell", level: 2, example: "「这个商店卖水果。」— This shop sells fruit." },
        { word: "慢", pinyin: "màn", translation: "slow", level: 2, example: "「请说慢一点儿。」— Please speak a bit more slowly." },
        { word: "忙", pinyin: "máng", translation: "busy", level: 2, example: "「我这个星期很忙。」— I'm very busy this week." },
        { word: "每", pinyin: "měi", translation: "every; each", level: 2, example: "「我每天早上跑步。」— I run every morning." },
        { word: "妹妹", pinyin: "mèimei", translation: "younger sister", level: 2, example: "「我妹妹很漂亮。」— My younger sister is very pretty." },
        { word: "门", pinyin: "mén", translation: "door", level: 2, example: "「请开门。」— Please open the door." },
        { word: "面条", pinyin: "miàntiáo", translation: "noodles", level: 2, example: "「中午我想吃面条。」— I want noodles for lunch." },
        { word: "男", pinyin: "nán", translation: "male; man", level: 2, example: "「那个男孩子是我弟弟。」— That boy is my younger brother." },
        { word: "您", pinyin: "nín", translation: "you (polite)", level: 2, example: "「您好！」— Hello! (polite)" },
        { word: "牛奶", pinyin: "niúnǎi", translation: "milk", level: 2, example: "「我每天早上喝牛奶。」— I drink milk every morning." },
        { word: "女", pinyin: "nǚ", translation: "female; woman", level: 2, example: "「我们的老师是女的。」— Our teacher is a woman." },
        { word: "旁边", pinyin: "pángbiān", translation: "beside; next to", level: 2, example: "「医院旁边有一个商店。」— There's a shop next to the hospital." },
        { word: "跑步", pinyin: "pǎobù", translation: "to run; to jog", level: 2, example: "「他每天跑步。」— He runs every day." },
        { word: "便宜", pinyin: "piányi", translation: "cheap", level: 2, example: "「这里的水果很便宜。」— Fruit is cheap here." },
        { word: "票", pinyin: "piào", translation: "ticket", level: 2, example: "「我买了两张电影票。」— I bought two movie tickets." },
        { word: "妻子", pinyin: "qīzi", translation: "wife", level: 2, example: "「他妻子是医生。」— His wife is a doctor." },
        { word: "起床", pinyin: "qǐchuáng", translation: "to get up", level: 2, example: "「我每天七点起床。」— I get up at seven every day." },
        { word: "千", pinyin: "qiān", translation: "thousand", level: 2, example: "「这个手机三千块。」— This phone costs 3,000 kuai." },
        { word: "铅笔", pinyin: "qiānbǐ", translation: "pencil", level: 2, example: "「我可以用你的铅笔吗？」— Can I use your pencil?" },
        { word: "晴", pinyin: "qíng", translation: "sunny; clear", level: 2, example: "「今天是晴天。」— It's a sunny day today." },
        { word: "去年", pinyin: "qùnián", translation: "last year", level: 2, example: "「我去年去了北京。」— I went to Beijing last year." },
        { word: "让", pinyin: "ràng", translation: "to let; to make; to ask", level: 2, example: "「妈妈让我早点儿睡觉。」— Mom tells me to go to bed early." },
        { word: "日", pinyin: "rì", translation: "day; date", level: 2, example: "「五月一日我们不上班。」— We don't work on May 1st." },
        { word: "上班", pinyin: "shàngbān", translation: "to go to work", level: 2, example: "「我八点上班。」— I start work at eight." },
        { word: "身体", pinyin: "shēntǐ", translation: "body; health", level: 2, example: "「你身体怎么样？」— How's your health?" },
        { word: "生病", pinyin: "shēngbìng", translation: "to get sick", level: 2, example: "「他生病了，没来上课。」— He's sick and didn't come to class." },
        { word: "生日", pinyin: "shēngrì", translation: "birthday", level: 2, example: "「今天是我的生日。」— Today is my birthday." },
        { word: "时间", pinyin: "shíjiān", translation: "time", level: 2, example: "「你有时间吗？」— Do you have time?" },
        { word: "事情", pinyin: "shìqing", translation: "matter; thing", level: 2, example: "「我有一件事情想问你。」— There's something I want to ask you." },
        { word: "手表", pinyin: "shǒubiǎo", translation: "wristwatch", level: 2, example: "「这块手表很贵。」— This watch is very expensive." },
        { word: "手机", pinyin: "shǒujī", translation: "mobile phone", level: 2, example: "「我的手机没有电了。」— My phone's battery is dead." },
        { word: "说话", pinyin: "shuōhuà", translation: "to speak; to talk", level: 2, example: "「上课的时候别说话。」— Don't talk during class." },
        { word: "送", pinyin: "sòng", translation: "to give (a gift); to see off", level: 2, example: "「我送你一本书。」— I'll give you a book." },
        { word: "虽然…但是", pinyin: "suīrán… dànshì", translation: "although…", level: 2, example: "「虽然汉语很难，但是很有意思。」— Although Chinese is hard, it's very interesting." },
        { word: "它", pinyin: "tā", translation: "it", level: 2, example: "「我有一只猫，它很小。」— I have a cat; it's very small." },
        { word: "踢足球", pinyin: "tī zúqiú", translation: "to play soccer", level: 2, example: "「他们在外面踢足球。」— They're playing soccer outside." },
        { word: "题", pinyin: "tí", translation: "question; problem", level: 2, example: "「这个题太难了。」— This question is too hard." },
        { word: "跳舞", pinyin: "tiàowǔ", translation: "to dance", level: 2, example: "「她跳舞跳得很好。」— She dances very well." },
        { word: "外", pinyin: "wài", translation: "outside", level: 2, example: "「外面很冷。」— It's cold outside." },
        { word: "完", pinyin: "wán", translation: "to finish; done", level: 2, example: "「我吃完了。」— I've finished eating." },
        { word: "玩", pinyin: "wán", translation: "to play; to have fun", level: 2, example: "「孩子们在外面玩。」— The kids are playing outside." },
        { word: "晚上", pinyin: "wǎnshang", translation: "evening", level: 2, example: "「晚上我们去看电影吧。」— Let's see a movie tonight." },
        { word: "往", pinyin: "wǎng", translation: "toward", level: 2, example: "「往前走就是火车站。」— Go straight and you'll reach the station." },
        { word: "为什么", pinyin: "wèi shénme", translation: "why", level: 2, example: "「你为什么不高兴？」— Why are you unhappy?" },
        { word: "问", pinyin: "wèn", translation: "to ask", level: 2, example: "「我可以问你一个问题吗？」— Can I ask you a question?" },
        { word: "问题", pinyin: "wèntí", translation: "question; problem", level: 2, example: "「没问题！」— No problem!" },
        { word: "西瓜", pinyin: "xīguā", translation: "watermelon", level: 2, example: "「我喜欢吃西瓜。」— I like eating watermelon." },
        { word: "希望", pinyin: "xīwàng", translation: "to hope; hope", level: 2, example: "「我希望明天是晴天。」— I hope it'll be sunny tomorrow." },
        { word: "洗", pinyin: "xǐ", translation: "to wash", level: 2, example: "「吃饭前要洗手。」— Wash your hands before eating." },
        { word: "向", pinyin: "xiàng", translation: "toward; to", level: 2, example: "「向前走。」— Walk straight ahead." },
        { word: "小时", pinyin: "xiǎoshí", translation: "hour", level: 2, example: "「我每天工作八个小时。」— I work eight hours a day." },
        { word: "笑", pinyin: "xiào", translation: "to laugh; to smile", level: 2, example: "「你笑什么？」— What are you laughing at?" },
        { word: "新", pinyin: "xīn", translation: "new", level: 2, example: "「这是我的新手机。」— This is my new phone." },
        { word: "姓", pinyin: "xìng", translation: "surname; to be surnamed", level: 2, example: "「您贵姓？——我姓王。」— Your surname? — It's Wang." },
        { word: "休息", pinyin: "xiūxi", translation: "to rest", level: 2, example: "「你累了，休息一下吧。」— You're tired, take a rest." },
        { word: "雪", pinyin: "xuě", translation: "snow", level: 2, example: "「北京下雪了。」— It's snowing in Beijing." },
        { word: "颜色", pinyin: "yánsè", translation: "color", level: 2, example: "「你喜欢什么颜色？」— What color do you like?" },
        { word: "眼睛", pinyin: "yǎnjing", translation: "eye", level: 2, example: "「她的眼睛很漂亮。」— She has beautiful eyes." },
        { word: "羊肉", pinyin: "yángròu", translation: "mutton; lamb", level: 2, example: "「我不吃羊肉。」— I don't eat mutton." },
        { word: "药", pinyin: "yào", translation: "medicine", level: 2, example: "「你吃药了吗？」— Have you taken your medicine?" },
        { word: "要", pinyin: "yào", translation: "to want; must; will", level: 2, example: "「我要一杯咖啡。」— I'd like a coffee." },
        { word: "也", pinyin: "yě", translation: "also; too", level: 2, example: "「我也是学生。」— I'm a student too." },
        { word: "一下", pinyin: "yíxià", translation: "a bit; once", level: 2, example: "「请等一下。」— Just a moment, please." },
        { word: "一起", pinyin: "yìqǐ", translation: "together", level: 2, example: "「我们一起吃饭吧。」— Let's eat together." },
        { word: "已经", pinyin: "yǐjīng", translation: "already", level: 2, example: "「我已经吃饭了。」— I've already eaten." },
        { word: "意思", pinyin: "yìsi", translation: "meaning", level: 2, example: "「这个字是什么意思？」— What does this character mean?" },
        { word: "因为…所以", pinyin: "yīnwèi… suǒyǐ", translation: "because… so", level: 2, example: "「因为下雨，所以我没去。」— Because it rained, I didn't go." },
        { word: "阴", pinyin: "yīn", translation: "cloudy; overcast", level: 2, example: "「今天是阴天。」— It's overcast today." },
        { word: "游泳", pinyin: "yóuyǒng", translation: "to swim", level: 2, example: "「你会游泳吗？」— Can you swim?" },
        { word: "右边", pinyin: "yòubian", translation: "right side", level: 2, example: "「商店在右边。」— The shop is on the right." },
        { word: "鱼", pinyin: "yú", translation: "fish", level: 2, example: "「我喜欢吃鱼。」— I like eating fish." },
        { word: "远", pinyin: "yuǎn", translation: "far", level: 2, example: "「机场离这儿很远。」— The airport is far from here." },
        { word: "运动", pinyin: "yùndòng", translation: "sport; to exercise", level: 2, example: "「你喜欢什么运动？」— What sport do you like?" },
        { word: "再", pinyin: "zài", translation: "again", level: 2, example: "「请再说一次。」— Please say it again." },
        { word: "早上", pinyin: "zǎoshang", translation: "early morning", level: 2, example: "「早上好！」— Good morning!" },
        { word: "丈夫", pinyin: "zhàngfu", translation: "husband", level: 2, example: "「她丈夫是老师。」— Her husband is a teacher." },
        { word: "找", pinyin: "zhǎo", translation: "to look for", level: 2, example: "「你在找什么？」— What are you looking for?" },
        { word: "着", pinyin: "zhe", translation: "(particle: continuous state)", level: 2, example: "「门开着。」— The door is open." },
        { word: "真", pinyin: "zhēn", translation: "really; truly", level: 2, example: "「这个西瓜真大！」— This watermelon is really big!" },
        { word: "正在", pinyin: "zhèngzài", translation: "in the middle of (doing)", level: 2, example: "「我正在吃饭。」— I'm eating right now." },
        { word: "知道", pinyin: "zhīdào", translation: "to know", level: 2, example: "「我不知道他在哪儿。」— I don't know where he is." },
        { word: "准备", pinyin: "zhǔnbèi", translation: "to prepare", level: 2, example: "「我在准备考试。」— I'm preparing for the exam." },
        { word: "走", pinyin: "zǒu", translation: "to walk; to leave", level: 2, example: "「我们走了，再见！」— We're leaving, goodbye!" },
        { word: "最", pinyin: "zuì", translation: "most", level: 2, example: "「我最喜欢吃面条。」— Noodles are my favorite." },
        { word: "左边", pinyin: "zuǒbian", translation: "left side", level: 2, example: "「医院在左边。」— The hospital is on the left." }
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
    // Recto : mot dans la langue source (FR/EN) ; verso : sinogrammes + pinyin.
    el.wordFront.textContent = card.translation;
    el.phonetic.textContent = card.pinyin;
    el.wordBack.textContent = card.word;
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
      `<li><span class="dp-word">${c.translation}</span>` +
      `<span class="dp-right"><span class="dp-zh">${c.word}</span>` +
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
    // On prononce le mot chinois ; « 虽然…但是 » → « 虽然，但是 » pour une pause naturelle.
    const utter = new SpeechSynthesisUtterance(card.word.replace(/…/g, '，'));
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
