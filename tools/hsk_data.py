# -*- coding: utf-8 -*-
"""Vocabulaire HSK 2.0 (Hanban, révision 2012) : HSK 1 et HSK 2.

Une entrée par ligne, champs séparés par « | » :
    mot | pinyin | traduction FR | traduction EN | exemple ZH | exemple FR | exemple EN

Le pinyin est saisi à la main (tons neutres non marqués, mots attachés,
noms propres en majuscule) : pas de génération automatique, pour éviter
les erreurs de ton (« bà bà » au lieu de « bàba »).
Chaque phrase d'exemple contient le mot étudié (vérifié par build_vocab.py).
"""

_HSK1 = """
爱|ài|aimer ; adorer|to love|我爱我的家。|J'aime ma famille.|I love my family.
八|bā|huit|eight|我八点起床。|Je me lève à huit heures.|I get up at eight.
爸爸|bàba|papa ; le père|dad; father|我爸爸是医生。|Mon père est médecin.|My dad is a doctor.
杯子|bēizi|la tasse ; le verre|cup; glass|这个杯子是我的。|Cette tasse est à moi.|This cup is mine.
北京|Běijīng|Pékin|Beijing|我在北京工作。|Je travaille à Pékin.|I work in Beijing.
本|běn|(classificateur des livres)|(classifier for books)|我有三本书。|J'ai trois livres.|I have three books.
不|bù|ne… pas ; non|not; no|我不喝茶。|Je ne bois pas de thé.|I don't drink tea.
不客气|bú kèqi|de rien|you're welcome|谢谢！——不客气。|Merci ! — De rien.|Thanks! — You're welcome.
菜|cài|le plat ; le légume|dish; vegetable|这个菜很好吃。|Ce plat est délicieux.|This dish is delicious.
茶|chá|le thé|tea|你想喝茶吗？|Tu veux boire du thé ?|Would you like some tea?
吃|chī|manger|to eat|我们中午吃米饭。|Ce midi, nous mangeons du riz.|We eat rice at noon.
出租车|chūzūchē|le taxi|taxi|我们坐出租车去吧。|Allons-y en taxi.|Let's take a taxi.
打电话|dǎ diànhuà|téléphoner|to make a phone call|我明天给你打电话。|Je t'appelle demain.|I'll call you tomorrow.
大|dà|grand ; gros|big; large|他家很大。|Sa maison est grande.|His home is big.
的|de|(particule possessive / déterminative)|(possessive / structural particle)|这是我的书。|C'est mon livre.|This is my book.
点|diǎn|heure (à l'horloge) ; un peu|o'clock; a little|现在三点。|Il est trois heures.|It's three o'clock.
电脑|diànnǎo|l'ordinateur|computer|我的电脑很新。|Mon ordinateur est neuf.|My computer is new.
电视|diànshì|la télévision|television|爸爸在看电视。|Papa regarde la télévision.|Dad is watching TV.
电影|diànyǐng|le film|movie; film|我们去看电影吧。|Allons voir un film.|Let's go see a movie.
东西|dōngxi|la chose ; le truc|thing; stuff|你买了什么东西？|Qu'est-ce que tu as acheté ?|What did you buy?
都|dōu|tous ; tout|all; both|我们都是学生。|Nous sommes tous étudiants.|We are all students.
读|dú|lire (à voix haute)|to read (aloud)|请读这个字。|Lis ce caractère, s'il te plaît.|Please read this character.
对不起|duìbuqǐ|pardon ; désolé|sorry|对不起，我不认识他。|Désolé, je ne le connais pas.|Sorry, I don't know him.
多|duō|beaucoup ; nombreux|many; much|这里人很多。|Il y a beaucoup de monde ici.|There are many people here.
多少|duōshao|combien ?|how many; how much|这个多少钱？|Combien ça coûte ?|How much is this?
儿子|érzi|le fils|son|他儿子三岁。|Son fils a trois ans.|His son is three.
二|èr|deux|two|今天是二月一号。|Nous sommes le 1er février.|Today is February 1st.
饭店|fàndiàn|le restaurant ; l'hôtel|restaurant; hotel|这个饭店的菜很好吃。|La cuisine de ce restaurant est bonne.|This restaurant's food is good.
飞机|fēijī|l'avion|airplane|我坐飞机去北京。|Je vais à Pékin en avion.|I'm flying to Beijing.
分钟|fēnzhōng|la minute|minute|请等我五分钟。|Attends-moi cinq minutes, s'il te plaît.|Please wait five minutes for me.
高兴|gāoxìng|content ; heureux|happy; glad|认识你很高兴。|Ravi de te connaître.|Nice to meet you.
个|gè|(classificateur général)|(general classifier)|我有一个妹妹。|J'ai une petite sœur.|I have a younger sister.
工作|gōngzuò|le travail ; travailler|work; to work|你在哪儿工作？|Où travailles-tu ?|Where do you work?
狗|gǒu|le chien|dog|我家有一只狗。|Nous avons un chien.|We have a dog.
汉语|Hànyǔ|la langue chinoise|Chinese (language)|我在学习汉语。|J'apprends le chinois.|I'm learning Chinese.
好|hǎo|bon ; bien|good; well|今天天气很好。|Il fait beau aujourd'hui.|The weather is nice today.
号|hào|le jour (du mois) ; le numéro|day of the month; number|今天几号？|Quel jour sommes-nous ?|What's the date today?
喝|hē|boire|to drink|我想喝水。|Je voudrais boire de l'eau.|I'd like to drink some water.
和|hé|et ; avec|and; with|我和朋友去商店。|Je vais au magasin avec un ami.|I'm going to the shop with a friend.
很|hěn|très|very|她很漂亮。|Elle est très jolie.|She is very pretty.
后面|hòumian|derrière|behind; back|学校后面有一个商店。|Il y a un magasin derrière l'école.|There's a shop behind the school.
回|huí|rentrer ; retourner|to return; to go back|我五点回家。|Je rentre à la maison à cinq heures.|I go home at five.
会|huì|savoir (faire) ; pouvoir|can; to know how to|你会说汉语吗？|Tu sais parler chinois ?|Can you speak Chinese?
几|jǐ|combien (petit nombre) ; quelques|how many; a few|你家有几个人？|Combien êtes-vous dans ta famille ?|How many people are in your family?
家|jiā|la maison ; la famille|home; family|我家在北京。|Ma famille vit à Pékin.|My home is in Beijing.
叫|jiào|s'appeler ; appeler|to be called; to call|你叫什么名字？|Comment t'appelles-tu ?|What's your name?
今天|jīntiān|aujourd'hui|today|今天星期一。|Aujourd'hui, c'est lundi.|Today is Monday.
九|jiǔ|neuf|nine|我九月去中国。|Je vais en Chine en septembre.|I'm going to China in September.
开|kāi|ouvrir ; conduire|to open; to drive|商店九点开门。|Le magasin ouvre à neuf heures.|The shop opens at nine.
看|kàn|regarder ; lire|to look; to watch; to read|我喜欢看书。|J'aime lire.|I like reading.
看见|kànjiàn|voir ; apercevoir|to see|你看见我的猫了吗？|Tu as vu mon chat ?|Have you seen my cat?
块|kuài|yuan (familier)|kuai (yuan, colloquial)|这本书十块钱。|Ce livre coûte dix yuans.|This book costs ten kuai.
来|lái|venir|to come|你什么时候来？|Quand viens-tu ?|When are you coming?
老师|lǎoshī|le professeur|teacher|王老师是北京人。|Le professeur Wang est de Pékin.|Teacher Wang is from Beijing.
了|le|(particule : action accomplie, changement)|(particle: completed action, change)|我吃饭了。|J'ai mangé.|I've eaten.
冷|lěng|froid|cold|今天很冷。|Il fait froid aujourd'hui.|It's cold today.
里|lǐ|dans ; à l'intérieur|in; inside|猫在房子里。|Le chat est dans la maison.|The cat is in the house.
六|liù|six|six|我六点起来。|Je me lève à six heures.|I get up at six.
吗|ma|(particule interrogative)|(question particle)|你是老师吗？|Tu es professeur ?|Are you a teacher?
妈妈|māma|maman ; la mère|mom; mother|妈妈在做饭。|Maman prépare le repas.|Mom is cooking.
买|mǎi|acheter|to buy|我想买一本书。|Je voudrais acheter un livre.|I'd like to buy a book.
猫|māo|le chat|cat|那只猫很小。|Ce chat est tout petit.|That cat is very small.
没关系|méi guānxi|ce n'est pas grave|it doesn't matter|对不起！——没关系。|Pardon ! — Ce n'est pas grave.|Sorry! — It doesn't matter.
没有|méiyǒu|ne pas avoir ; il n'y a pas|not have; there is not|我没有钱。|Je n'ai pas d'argent.|I don't have any money.
米饭|mǐfàn|le riz (cuit)|cooked rice|我想吃米饭。|Je voudrais manger du riz.|I'd like to eat rice.
名字|míngzi|le nom ; le prénom|name|你的名字很好听。|Ton prénom est joli.|Your name sounds nice.
明天|míngtiān|demain|tomorrow|明天我去学校。|Demain, je vais à l'école.|Tomorrow I'm going to school.
哪|nǎ|quel ; lequel|which|你是哪国人？|De quel pays es-tu ?|Which country are you from?
哪儿|nǎr|où ?|where|你去哪儿？|Où vas-tu ?|Where are you going?
那|nà|ce…-là ; cela|that|那是我的电脑。|Ça, c'est mon ordinateur.|That's my computer.
那儿|nàr|là-bas|there|我的书在那儿。|Mon livre est là-bas.|My book is over there.
呢|ne|(particule : et toi ? ; action en cours)|(particle: "and you?"; ongoing action)|我很好，你呢？|Je vais bien, et toi ?|I'm fine, and you?
能|néng|pouvoir (être capable de)|can; to be able to|你明天能来吗？|Tu peux venir demain ?|Can you come tomorrow?
你|nǐ|tu ; toi|you|你好！|Bonjour !|Hello!
年|nián|l'année ; l'an|year|我在中国住了一年。|J'ai vécu un an en Chine.|I lived in China for a year.
女儿|nǚ'ér|la fille (enfant)|daughter|她女儿是学生。|Sa fille est étudiante.|Her daughter is a student.
朋友|péngyou|l'ami|friend|他是我的好朋友。|C'est mon meilleur ami.|He's my good friend.
漂亮|piàoliang|joli ; beau|pretty; beautiful|这件衣服很漂亮。|Ce vêtement est très joli.|This piece of clothing is very pretty.
苹果|píngguǒ|la pomme|apple|我想吃苹果。|Je voudrais manger une pomme.|I'd like to eat an apple.
七|qī|sept|seven|一个星期有七天。|Une semaine a sept jours.|A week has seven days.
前面|qiánmian|devant|in front; ahead|前面有一个饭店。|Il y a un restaurant devant.|There's a restaurant ahead.
钱|qián|l'argent|money|你有钱吗？|Tu as de l'argent ?|Do you have any money?
请|qǐng|s'il vous plaît ; inviter|please; to invite|请坐！|Asseyez-vous, je vous en prie !|Please sit down!
去|qù|aller|to go|我想去中国。|Je veux aller en Chine.|I want to go to China.
热|rè|chaud|hot|今天太热了！|Il fait trop chaud aujourd'hui !|It's too hot today!
人|rén|la personne ; les gens|person; people|商店里有很多人。|Il y a beaucoup de monde dans le magasin.|There are a lot of people in the shop.
认识|rènshi|connaître ; reconnaître|to know (someone); to recognize|我认识他。|Je le connais.|I know him.
三|sān|trois|three|我有三个朋友。|J'ai trois amis.|I have three friends.
商店|shāngdiàn|le magasin|shop; store|我去商店买东西。|Je vais faire des courses au magasin.|I'm going shopping at the store.
上|shàng|sur ; dessus ; monter|on; above; to go up|书在桌子上。|Le livre est sur la table.|The book is on the table.
上午|shàngwǔ|le matin|morning (before noon)|我上午工作。|Je travaille le matin.|I work in the morning.
少|shǎo|peu ; peu nombreux|few; little|这里人很少。|Il y a peu de monde ici.|There are few people here.
谁|shéi|qui ?|who|他是谁？|Qui est-ce ?|Who is he?
什么|shénme|quoi ? ; quel ?|what|你想吃什么？|Qu'est-ce que tu veux manger ?|What do you want to eat?
十|shí|dix|ten|我十点睡觉。|Je me couche à dix heures.|I go to bed at ten.
时候|shíhou|le moment ; quand|time; moment|你什么时候回家？|Quand rentres-tu à la maison ?|When are you going home?
是|shì|être|to be|我是法国人。|Je suis français.|I'm French.
书|shū|le livre|book|这本书很好看。|Ce livre est très bien.|This book is very good.
水|shuǐ|l'eau|water|请给我一杯水。|Un verre d'eau, s'il vous plaît.|A glass of water, please.
水果|shuǐguǒ|le fruit|fruit|我喜欢吃水果。|J'aime manger des fruits.|I like eating fruit.
睡觉|shuìjiào|dormir ; se coucher|to sleep; to go to bed|我十一点睡觉。|Je me couche à onze heures.|I go to bed at eleven.
说|shuō|dire ; parler|to say; to speak|你说什么？|Qu'est-ce que tu dis ?|What did you say?
四|sì|quatre|four|我们家有四个人。|Nous sommes quatre dans la famille.|There are four people in our family.
岁|suì|an (âge)|year (of age)|你几岁了？|Quel âge as-tu ?|How old are you?
他|tā|il ; lui|he; him|他是我哥哥。|C'est mon grand frère.|He's my older brother.
她|tā|elle|she; her|她是我的老师。|C'est ma professeure.|She's my teacher.
太|tài|trop ; très|too; extremely|这个太贵了！|C'est trop cher !|This is too expensive!
天气|tiānqì|le temps (météo)|weather|明天天气怎么样？|Quel temps fera-t-il demain ?|What will the weather be like tomorrow?
听|tīng|écouter|to listen|我喜欢听中国歌。|J'aime écouter des chansons chinoises.|I like listening to Chinese songs.
同学|tóngxué|le camarade de classe|classmate|他是我的同学。|C'est mon camarade de classe.|He's my classmate.
喂|wéi|allô (au téléphone)|hello (on the phone)|喂，你好！|Allô, bonjour !|Hello? (on the phone)
我|wǒ|je ; moi|I; me|我是学生。|Je suis étudiant.|I'm a student.
我们|wǒmen|nous|we; us|我们一起去吧！|Allons-y ensemble !|Let's go together!
五|wǔ|cinq|five|我有五块钱。|J'ai cinq yuans.|I have five kuai.
喜欢|xǐhuan|aimer ; apprécier|to like|我喜欢喝茶。|J'aime boire du thé.|I like drinking tea.
下|xià|sous ; descendre ; prochain|below; to go down; next|下个星期我去北京。|La semaine prochaine, je vais à Pékin.|Next week I'm going to Beijing.
下午|xiàwǔ|l'après-midi|afternoon|我们下午去商店。|Nous allons au magasin cet après-midi.|We're going to the shop this afternoon.
下雨|xià yǔ|pleuvoir|to rain|今天下雨了。|Il a plu aujourd'hui.|It rained today.
先生|xiānsheng|monsieur|Mr.; sir|王先生在家吗？|M. Wang est-il chez lui ?|Is Mr. Wang at home?
现在|xiànzài|maintenant|now|现在几点？|Quelle heure est-il ?|What time is it now?
想|xiǎng|vouloir ; penser à|to want; to think; to miss|我想回家。|Je veux rentrer à la maison.|I want to go home.
小|xiǎo|petit|small; little|我的房子很小。|Ma maison est petite.|My house is small.
小姐|xiǎojiě|mademoiselle|Miss; young lady|李小姐是老师。|Mlle Li est professeure.|Miss Li is a teacher.
些|xiē|quelques ; un peu de|some; a few|我买了一些水果。|J'ai acheté quelques fruits.|I bought some fruit.
写|xiě|écrire|to write|你会写汉字吗？|Tu sais écrire les caractères chinois ?|Can you write Chinese characters?
谢谢|xièxie|merci|thank you|谢谢你！|Merci !|Thank you!
星期|xīngqī|la semaine|week|下星期见！|À la semaine prochaine !|See you next week!
学生|xuésheng|l'élève ; l'étudiant|student|他是北京大学的学生。|Il est étudiant à l'université de Pékin.|He's a student at Peking University.
学习|xuéxí|étudier ; apprendre|to study; to learn|我在学习汉语。|J'étudie le chinois.|I'm studying Chinese.
学校|xuéxiào|l'école|school|我们学校很大。|Notre école est grande.|Our school is big.
一|yī|un|one|我有一个哥哥。|J'ai un grand frère.|I have an older brother.
衣服|yīfu|le vêtement|clothes|她买了很多衣服。|Elle a acheté beaucoup de vêtements.|She bought a lot of clothes.
医生|yīshēng|le médecin|doctor|我想当医生。|Je veux devenir médecin.|I want to become a doctor.
医院|yīyuàn|l'hôpital|hospital|他在医院工作。|Il travaille à l'hôpital.|He works at the hospital.
椅子|yǐzi|la chaise|chair|这把椅子很漂亮。|Cette chaise est très jolie.|This chair is very pretty.
有|yǒu|avoir ; il y a|to have; there is|我有一只猫。|J'ai un chat.|I have a cat.
月|yuè|le mois ; la lune|month; moon|我下个月去中国。|Je vais en Chine le mois prochain.|I'm going to China next month.
在|zài|être à ; en train de|to be at; in; (in progress)|我在家。|Je suis à la maison.|I'm at home.
再见|zàijiàn|au revoir|goodbye|老师，再见！|Au revoir, professeur !|Goodbye, teacher!
怎么|zěnme|comment ?|how|这个字怎么读？|Comment se lit ce caractère ?|How do you read this character?
怎么样|zěnmeyàng|comment (ça va) ? ; qu'en dis-tu ?|how is it?; how about|这个电影怎么样？|Comment est ce film ?|How is this movie?
这|zhè|ce…-ci ; ceci (这儿 : ici)|this (这儿: here)|这是我妈妈。|Voici ma mère.|This is my mother.
中国|Zhōngguó|la Chine|China|中国很大。|La Chine est grande.|China is big.
中午|zhōngwǔ|midi|noon|中午我们吃米饭。|À midi, nous mangeons du riz.|We eat rice at noon.
住|zhù|habiter ; loger|to live; to stay|你住在哪儿？|Où habites-tu ?|Where do you live?
桌子|zhuōzi|la table ; le bureau|table; desk|桌子上有一本书。|Il y a un livre sur la table.|There's a book on the table.
字|zì|le caractère (écrit)|character (written)|这个字我不认识。|Je ne connais pas ce caractère.|I don't know this character.
昨天|zuótiān|hier|yesterday|昨天我去医院了。|Hier, je suis allé à l'hôpital.|I went to the hospital yesterday.
坐|zuò|s'asseoir ; prendre (un transport)|to sit; to take (transport)|请坐这儿。|Asseyez-vous ici, je vous prie.|Please sit here.
做|zuò|faire|to do; to make|你在做什么？|Qu'est-ce que tu fais ?|What are you doing?
"""

_HSK2 = """
吧|ba|(particule : suggestion, supposition)|(particle: suggestion)|我们走吧！|Allons-y !|Let's go!
白|bái|blanc|white|我喜欢白衣服。|J'aime les vêtements blancs.|I like white clothes.
百|bǎi|cent|hundred|这件衣服三百块。|Ce vêtement coûte trois cents yuans.|This piece of clothing costs 300 kuai.
帮助|bāngzhù|aider ; l'aide|to help; help|谢谢你的帮助！|Merci pour ton aide !|Thanks for your help!
报纸|bàozhǐ|le journal|newspaper|爸爸每天看报纸。|Papa lit le journal tous les jours.|Dad reads the newspaper every day.
比|bǐ|que (comparaison)|than (comparison)|今天比昨天冷。|Aujourd'hui, il fait plus froid qu'hier.|Today is colder than yesterday.
别|bié|ne… pas (impératif)|don't|别说话！|Ne parle pas !|Don't talk!
宾馆|bīnguǎn|l'hôtel|hotel|我们住在这个宾馆。|Nous logeons dans cet hôtel.|We're staying at this hotel.
长|cháng|long|long|她的头发很长。|Elle a les cheveux longs.|Her hair is long.
唱歌|chàng gē|chanter|to sing|她很喜欢唱歌。|Elle adore chanter.|She loves singing.
出|chū|sortir|to go out; to come out|他出去了。|Il est sorti.|He went out.
穿|chuān|porter ; mettre (vêtements)|to wear; to put on|今天你穿得很漂亮。|Tu es très bien habillée aujourd'hui.|You're dressed nicely today.
次|cì|fois|time (occurrence)|我去过两次北京。|Je suis allé deux fois à Pékin.|I've been to Beijing twice.
从|cóng|depuis ; de|from|我从法国来。|Je viens de France.|I come from France.
错|cuò|faux ; erroné|wrong; mistake|你说错了。|Tu t'es trompé.|You said it wrong.
打篮球|dǎ lánqiú|jouer au basket|to play basketball|我们下午去打篮球。|Nous allons jouer au basket cet après-midi.|We're playing basketball this afternoon.
大家|dàjiā|tout le monde|everyone|大家好！|Bonjour à tous !|Hello, everyone!
到|dào|arriver ; jusqu'à|to arrive; until|我们到北京了。|Nous sommes arrivés à Pékin.|We've arrived in Beijing.
得|de|(particule de complément de degré)|(complement particle)|他跑得很快。|Il court très vite.|He runs very fast.
等|děng|attendre|to wait|请等我一会儿。|Attends-moi un moment, s'il te plaît.|Please wait for me a moment.
弟弟|dìdi|le petit frère|younger brother|我弟弟八岁。|Mon petit frère a huit ans.|My younger brother is eight.
第一|dì-yī|premier|first|这是我第一次来中国。|C'est la première fois que je viens en Chine.|This is my first time in China.
懂|dǒng|comprendre|to understand|你懂我的意思吗？|Tu comprends ce que je veux dire ?|Do you understand what I mean?
对|duì|correct ; juste|right; correct|你说得对。|Tu as raison.|You're right.
房间|fángjiān|la pièce ; la chambre|room|我的房间很小。|Ma chambre est petite.|My room is small.
非常|fēicháng|extrêmement ; très|very; extremely|我非常喜欢北京。|J'aime énormément Pékin.|I really love Beijing.
服务员|fúwùyuán|le serveur ; l'employé|waiter; attendant|服务员，请给我一杯茶。|Serveur, un thé s'il vous plaît.|Waiter, a cup of tea, please.
高|gāo|grand ; haut|tall; high|我哥哥很高。|Mon grand frère est grand.|My older brother is tall.
告诉|gàosu|dire à ; informer|to tell|请告诉我你的名字。|Dis-moi ton nom, s'il te plaît.|Please tell me your name.
哥哥|gēge|le grand frère|older brother|我哥哥在医院工作。|Mon grand frère travaille à l'hôpital.|My older brother works at the hospital.
给|gěi|donner ; pour|to give; for|妈妈给我一个苹果。|Maman me donne une pomme.|Mom gives me an apple.
公共汽车|gōnggòng qìchē|le bus|bus|我坐公共汽车上班。|Je vais au travail en bus.|I take the bus to work.
公斤|gōngjīn|le kilogramme|kilogram|我买了两公斤苹果。|J'ai acheté deux kilos de pommes.|I bought two kilos of apples.
公司|gōngsī|l'entreprise ; la société|company|她在一家大公司工作。|Elle travaille dans une grande entreprise.|She works at a big company.
贵|guì|cher|expensive|这个手机太贵了。|Ce téléphone est trop cher.|This phone is too expensive.
过|guo|(particule : expérience passée)|(particle: past experience)|我去过中国。|Je suis déjà allé en Chine.|I've been to China.
还|hái|encore ; aussi|still; also|他还在睡觉。|Il dort encore.|He's still sleeping.
孩子|háizi|l'enfant|child|这个孩子很可爱。|Cet enfant est adorable.|This child is adorable.
好吃|hǎochī|bon (à manger) ; délicieux|delicious|妈妈做的菜很好吃。|Les plats de maman sont délicieux.|Mom's cooking is delicious.
黑|hēi|noir|black|我的猫是黑的。|Mon chat est noir.|My cat is black.
红|hóng|rouge|red|她喜欢红颜色。|Elle aime la couleur rouge.|She likes the color red.
欢迎|huānyíng|bienvenue ; accueillir|welcome; to welcome|欢迎你来我家！|Bienvenue chez moi !|Welcome to my home!
回答|huídá|répondre ; la réponse|to answer; answer|请回答我的问题。|Réponds à ma question, s'il te plaît.|Please answer my question.
火车站|huǒchēzhàn|la gare|train station|火车站离这儿很远。|La gare est loin d'ici.|The train station is far from here.
机场|jīchǎng|l'aéroport|airport|我们去机场吧。|Allons à l'aéroport.|Let's go to the airport.
鸡蛋|jīdàn|l'œuf (de poule)|egg|我早上吃了两个鸡蛋。|J'ai mangé deux œufs ce matin.|I ate two eggs this morning.
件|jiàn|(classificateur des vêtements, affaires)|(classifier for clothes, matters)|我买了一件衣服。|J'ai acheté un vêtement.|I bought a piece of clothing.
教室|jiàoshì|la salle de classe|classroom|学生们在教室里。|Les élèves sont dans la salle de classe.|The students are in the classroom.
姐姐|jiějie|la grande sœur|older sister|我姐姐是老师。|Ma grande sœur est professeure.|My older sister is a teacher.
介绍|jièshào|présenter|to introduce|我来介绍一下，这是王先生。|Je vous présente M. Wang.|Let me introduce Mr. Wang.
进|jìn|entrer|to enter|请进！|Entrez !|Come in!
近|jìn|proche|near; close|我家离学校很近。|J'habite près de l'école.|My home is close to school.
就|jiù|alors ; justement ; tout de suite|then; right away; just|我马上就来。|J'arrive tout de suite.|I'm coming right away.
觉得|juéde|trouver ; penser que|to feel; to think|我觉得汉语不难。|Je trouve que le chinois n'est pas difficile.|I think Chinese isn't hard.
咖啡|kāfēi|le café (boisson)|coffee|你喝咖啡吗？|Tu bois du café ?|Do you drink coffee?
开始|kāishǐ|commencer|to begin; to start|我们九点开始上课。|Les cours commencent à neuf heures.|Class starts at nine.
考试|kǎoshì|l'examen ; passer un examen|exam; to take an exam|明天有汉语考试。|Il y a un examen de chinois demain.|There's a Chinese exam tomorrow.
可能|kěnéng|peut-être ; possible|maybe; possible|明天可能下雨。|Il va peut-être pleuvoir demain.|It might rain tomorrow.
可以|kěyǐ|pouvoir (avoir la permission)|can; may|我可以坐这儿吗？|Puis-je m'asseoir ici ?|May I sit here?
课|kè|le cours ; la leçon|class; lesson|今天下午没有课。|Il n'y a pas cours cet après-midi.|There's no class this afternoon.
快|kuài|rapide ; vite|fast; quick|他走得很快。|Il marche très vite.|He walks very fast.
快乐|kuàilè|joyeux ; heureux|happy|生日快乐！|Joyeux anniversaire !|Happy birthday!
累|lèi|fatigué|tired|我今天很累。|Je suis très fatigué aujourd'hui.|I'm very tired today.
离|lí|à (distance de)|from (distance)|我家离公司不远。|Ma maison n'est pas loin du bureau.|My home isn't far from the office.
两|liǎng|deux (devant un classificateur)|two (before a classifier)|我有两个姐姐。|J'ai deux grandes sœurs.|I have two older sisters.
零|líng|zéro|zero|我的电话号码有三个零。|Mon numéro de téléphone contient trois zéros.|My phone number has three zeros.
路|lù|la route ; le chemin|road; way|这条路很长。|Cette route est très longue.|This road is very long.
旅游|lǚyóu|voyager ; faire du tourisme|to travel; tourism|我想去中国旅游。|Je veux voyager en Chine.|I want to travel to China.
卖|mài|vendre|to sell|这个商店卖水果。|Ce magasin vend des fruits.|This shop sells fruit.
慢|màn|lent ; lentement|slow|请说慢一点儿。|Parlez plus lentement, s'il vous plaît.|Please speak a bit more slowly.
忙|máng|occupé|busy|我这个星期很忙。|Je suis très occupé cette semaine.|I'm very busy this week.
每|měi|chaque|every; each|我每天早上跑步。|Je cours tous les matins.|I run every morning.
妹妹|mèimei|la petite sœur|younger sister|我妹妹很漂亮。|Ma petite sœur est très jolie.|My younger sister is very pretty.
门|mén|la porte|door|请开门。|Ouvre la porte, s'il te plaît.|Please open the door.
面条|miàntiáo|les nouilles|noodles|中午我想吃面条。|À midi, je veux manger des nouilles.|I want noodles for lunch.
男|nán|homme ; masculin|male; man|那个男孩子是我弟弟。|Ce garçon, c'est mon petit frère.|That boy is my younger brother.
您|nín|vous (politesse)|you (polite)|您好！|Bonjour (poli) !|Hello! (polite)
牛奶|niúnǎi|le lait|milk|我每天早上喝牛奶。|Je bois du lait tous les matins.|I drink milk every morning.
女|nǚ|femme ; féminin|female; woman|我们的老师是女的。|Notre professeur est une femme.|Our teacher is a woman.
旁边|pángbiān|à côté|beside; next to|医院旁边有一个商店。|Il y a un magasin à côté de l'hôpital.|There's a shop next to the hospital.
跑步|pǎobù|courir ; faire du jogging|to run; to jog|他每天跑步。|Il court tous les jours.|He runs every day.
便宜|piányi|bon marché|cheap|这里的水果很便宜。|Les fruits sont bon marché ici.|Fruit is cheap here.
票|piào|le billet ; le ticket|ticket|我买了两张电影票。|J'ai acheté deux places de cinéma.|I bought two movie tickets.
妻子|qīzi|l'épouse|wife|他妻子是医生。|Sa femme est médecin.|His wife is a doctor.
起床|qǐchuáng|se lever|to get up|我每天七点起床。|Je me lève à sept heures tous les jours.|I get up at seven every day.
千|qiān|mille|thousand|这个手机三千块。|Ce téléphone coûte trois mille yuans.|This phone costs 3,000 kuai.
铅笔|qiānbǐ|le crayon|pencil|我可以用你的铅笔吗？|Je peux utiliser ton crayon ?|Can I use your pencil?
晴|qíng|ensoleillé ; dégagé|sunny; clear|今天是晴天。|Aujourd'hui, il fait beau.|It's a sunny day today.
去年|qùnián|l'année dernière|last year|我去年去了北京。|Je suis allé à Pékin l'année dernière.|I went to Beijing last year.
让|ràng|laisser ; faire (faire) ; demander à|to let; to make; to ask|妈妈让我早点儿睡觉。|Maman me demande de me coucher tôt.|Mom tells me to go to bed early.
日|rì|le jour ; la date|day; date|五月一日我们不上班。|Le 1er mai, nous ne travaillons pas.|We don't work on May 1st.
上班|shàngbān|aller au travail|to go to work|我八点上班。|Je commence le travail à huit heures.|I start work at eight.
身体|shēntǐ|le corps ; la santé|body; health|你身体怎么样？|Comment va ta santé ?|How's your health?
生病|shēngbìng|tomber malade|to get sick|他生病了，没来上课。|Il est malade, il n'est pas venu en cours.|He's sick and didn't come to class.
生日|shēngrì|l'anniversaire|birthday|今天是我的生日。|C'est mon anniversaire aujourd'hui.|Today is my birthday.
时间|shíjiān|le temps ; l'heure|time|你有时间吗？|Tu as le temps ?|Do you have time?
事情|shìqing|l'affaire ; la chose|matter; thing|我有一件事情想问你。|J'ai une chose à te demander.|There's something I want to ask you.
手表|shǒubiǎo|la montre|wristwatch|这块手表很贵。|Cette montre est très chère.|This watch is very expensive.
手机|shǒujī|le téléphone portable|mobile phone|我的手机没有电了。|Mon téléphone n'a plus de batterie.|My phone's battery is dead.
说话|shuōhuà|parler|to speak; to talk|上课的时候别说话。|Ne parle pas pendant le cours.|Don't talk during class.
送|sòng|offrir ; raccompagner|to give (a gift); to see off|我送你一本书。|Je t'offre un livre.|I'll give you a book.
虽然…但是|suīrán… dànshì|bien que…|although…|虽然汉语很难，但是很有意思。|Bien que le chinois soit difficile, c'est très intéressant.|Although Chinese is hard, it's very interesting.
它|tā|il ; elle (chose, animal)|it|我有一只猫，它很小。|J'ai un chat, il est tout petit.|I have a cat; it's very small.
踢足球|tī zúqiú|jouer au football|to play soccer|他们在外面踢足球。|Ils jouent au football dehors.|They're playing soccer outside.
题|tí|la question (d'exercice)|question; problem|这个题太难了。|Cette question est trop difficile.|This question is too hard.
跳舞|tiàowǔ|danser|to dance|她跳舞跳得很好。|Elle danse très bien.|She dances very well.
外|wài|dehors ; extérieur|outside|外面很冷。|Il fait froid dehors.|It's cold outside.
完|wán|finir ; terminé|to finish; done|我吃完了。|J'ai fini de manger.|I've finished eating.
玩|wán|jouer ; s'amuser|to play; to have fun|孩子们在外面玩。|Les enfants jouent dehors.|The kids are playing outside.
晚上|wǎnshang|le soir|evening|晚上我们去看电影吧。|Allons au cinéma ce soir.|Let's see a movie tonight.
往|wǎng|vers ; en direction de|toward|往前走就是火车站。|Tout droit, c'est la gare.|Go straight and you'll reach the station.
为什么|wèi shénme|pourquoi ?|why|你为什么不高兴？|Pourquoi n'es-tu pas content ?|Why are you unhappy?
问|wèn|demander|to ask|我可以问你一个问题吗？|Je peux te poser une question ?|Can I ask you a question?
问题|wèntí|la question ; le problème|question; problem|没问题！|Pas de problème !|No problem!
西瓜|xīguā|la pastèque|watermelon|我喜欢吃西瓜。|J'aime manger de la pastèque.|I like eating watermelon.
希望|xīwàng|espérer ; l'espoir|to hope; hope|我希望明天是晴天。|J'espère qu'il fera beau demain.|I hope it'll be sunny tomorrow.
洗|xǐ|laver|to wash|吃饭前要洗手。|Il faut se laver les mains avant de manger.|Wash your hands before eating.
向|xiàng|vers ; à (direction)|toward; to|向前走。|Avance tout droit.|Walk straight ahead.
小时|xiǎoshí|l'heure (durée)|hour|我每天工作八个小时。|Je travaille huit heures par jour.|I work eight hours a day.
笑|xiào|rire ; sourire|to laugh; to smile|你笑什么？|Pourquoi tu ris ?|What are you laughing at?
新|xīn|nouveau ; neuf|new|这是我的新手机。|C'est mon nouveau téléphone.|This is my new phone.
姓|xìng|avoir pour nom de famille|surname; to be surnamed|您贵姓？——我姓王。|Votre nom ? — Je m'appelle Wang.|Your surname? — It's Wang.
休息|xiūxi|se reposer|to rest|你累了，休息一下吧。|Tu es fatigué, repose-toi un peu.|You're tired, take a rest.
雪|xuě|la neige|snow|北京下雪了。|Il neige à Pékin.|It's snowing in Beijing.
颜色|yánsè|la couleur|color|你喜欢什么颜色？|Quelle couleur aimes-tu ?|What color do you like?
眼睛|yǎnjing|l'œil ; les yeux|eye|她的眼睛很漂亮。|Elle a de très beaux yeux.|She has beautiful eyes.
羊肉|yángròu|la viande de mouton|mutton; lamb|我不吃羊肉。|Je ne mange pas de mouton.|I don't eat mutton.
药|yào|le médicament|medicine|你吃药了吗？|Tu as pris ton médicament ?|Have you taken your medicine?
要|yào|vouloir ; devoir ; aller (futur)|to want; must; will|我要一杯咖啡。|Je voudrais un café.|I'd like a coffee.
也|yě|aussi|also; too|我也是学生。|Je suis étudiant aussi.|I'm a student too.
一下|yíxià|un peu ; un instant|a bit; once|请等一下。|Un instant, s'il vous plaît.|Just a moment, please.
一起|yìqǐ|ensemble|together|我们一起吃饭吧。|Mangeons ensemble.|Let's eat together.
已经|yǐjīng|déjà|already|我已经吃饭了。|J'ai déjà mangé.|I've already eaten.
意思|yìsi|le sens ; la signification|meaning|这个字是什么意思？|Que veut dire ce caractère ?|What does this character mean?
因为…所以|yīnwèi… suǒyǐ|parce que… donc|because… so|因为下雨，所以我没去。|Comme il pleuvait, je n'y suis pas allé.|Because it rained, I didn't go.
阴|yīn|nuageux ; couvert|cloudy; overcast|今天是阴天。|Le ciel est couvert aujourd'hui.|It's overcast today.
游泳|yóuyǒng|nager|to swim|你会游泳吗？|Tu sais nager ?|Can you swim?
右边|yòubian|à droite|right side|商店在右边。|Le magasin est à droite.|The shop is on the right.
鱼|yú|le poisson|fish|我喜欢吃鱼。|J'aime manger du poisson.|I like eating fish.
远|yuǎn|loin|far|机场离这儿很远。|L'aéroport est loin d'ici.|The airport is far from here.
运动|yùndòng|le sport ; faire du sport|sport; to exercise|你喜欢什么运动？|Quel sport aimes-tu ?|What sport do you like?
再|zài|de nouveau ; encore|again|请再说一次。|Répétez, s'il vous plaît.|Please say it again.
早上|zǎoshang|le matin (tôt)|early morning|早上好！|Bonjour ! (le matin)|Good morning!
丈夫|zhàngfu|le mari|husband|她丈夫是老师。|Son mari est professeur.|Her husband is a teacher.
找|zhǎo|chercher|to look for|你在找什么？|Qu'est-ce que tu cherches ?|What are you looking for?
着|zhe|(particule : état continu)|(particle: continuous state)|门开着。|La porte est ouverte.|The door is open.
真|zhēn|vraiment|really; truly|这个西瓜真大！|Cette pastèque est vraiment grosse !|This watermelon is really big!
正在|zhèngzài|être en train de|in the middle of (doing)|我正在吃饭。|Je suis en train de manger.|I'm eating right now.
知道|zhīdào|savoir|to know|我不知道他在哪儿。|Je ne sais pas où il est.|I don't know where he is.
准备|zhǔnbèi|préparer ; se préparer|to prepare|我在准备考试。|Je prépare l'examen.|I'm preparing for the exam.
走|zǒu|marcher ; partir|to walk; to leave|我们走了，再见！|On s'en va, au revoir !|We're leaving, goodbye!
最|zuì|le plus|most|我最喜欢吃面条。|Ce que je préfère, ce sont les nouilles.|Noodles are my favorite.
左边|zuǒbian|à gauche|left side|医院在左边。|L'hôpital est à gauche.|The hospital is on the left.
"""


def _parse(block):
    rows = []
    for line in block.strip().splitlines():
        parts = [p.strip() for p in line.split("|")]
        if len(parts) != 7:
            raise ValueError("Ligne mal formée (%d champs) : %s" % (len(parts), line))
        rows.append(tuple(parts))
    return rows


HSK1 = _parse(_HSK1)
HSK2 = _parse(_HSK2)
