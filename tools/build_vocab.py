# -*- coding: utf-8 -*-
"""Génère le vocabulaire HSK 1 + HSK 2 complet pour js/app.js.

Lit tools/hsk_data.py (listes officielles HSK 2.0 : 150 mots HSK1, 150 mots HSK2),
produit le pinyin via pypinyin, puis remplace le bloc `const vocab = { ... };`
dans js/app.js par les decks fr/en complets.

Usage : python3 tools/build_vocab.py [--check]
"""
import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hsk_data import HSK1, HSK2  # noqa: E402

from pypinyin import lazy_pinyin, Style  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_JS = os.path.join(ROOT, "js", "app.js")

# --- Exemples : quelques phrases types réutilisables (HSK 1 / HSK 2) ---------
# Chaque entrée : mot_chinois -> (phrase chinoise, traduction FR, traduction EN)
EXAMPLES = {
    "爱": ("我爱你。", "Je t'aime.", "I love you."),
    "八": ("我八月出生。", "Je suis né en août.", "I was born in August."),
    "爸爸": ("我爸爸是老师。", "Mon père est professeur.", "My father is a teacher."),
    "杯子": ("这个杯子是我的。", "Cette tasse est à moi.", "This cup is mine."),
    "北京": ("我在北京工作。", "Je travaille à Pékin.", "I work in Beijing."),
    "本": ("我有一本书。", "J'ai un livre.", "I have a book."),
    "不客气": ("谢谢你！——不客气。", "Merci ! — De rien.", "Thank you! — You're welcome."),
    "不": ("我不认识他。", "Je ne le connais pas.", "I don't know him."),
    "菜": ("这个菜很好吃。", "Ce plat est délicieux.", "This dish is delicious."),
    "茶": ("我喜欢喝茶。", "J'aime boire du thé.", "I like drinking tea."),
    "吃": ("我吃米饭。", "Je mange du riz.", "I eat rice."),
    "出租车": ("我们坐出租车去机场。", "Nous allons à l'aéroport en taxi.", "We take a taxi to the airport."),
    "穿": ("今天你穿了什么？", "Qu'as-tu mis aujourd'hui ?", "What are you wearing today?"),
    "打电话": ("我给你打电话。", "Je t'appelle au téléphone.", "I'll call you."),
    "大": ("这个苹果很大。", "Cette pomme est grosse.", "This apple is big."),
    "的": ("这是我的书。", "C'est mon livre.", "This is my book."),
    "点": ("现在三点了。", "Il est trois heures.", "It's three o'clock now."),
    "电脑": ("我的电脑很贵。", "Mon ordinateur est cher.", "My computer is expensive."),
    "电视": ("他喜欢看电视。", "Il aime regarder la télévision.", "He likes watching TV."),
    "电影": ("我们去看电影吧。", "Allons voir un film.", "Let's go see a movie."),
    "东西": ("这个东西多少钱？", "Combien coûte ce truc ?", "How much is this thing?"),
    "都": ("我们都去学校。", "Nous allons tous à l'école.", "We all go to school."),
    "读": ("她在读书。", "Elle lit / étudie.", "She is reading / studying."),
    "对": ("你说得对。", "Tu as raison.", "You are right."),
    "多": ("这里人很多。", "Il y a beaucoup de monde ici.", "There are many people here."),
    "饿": ("我饿了，吃饭吧！", "J'ai faim, mangeons !", "I'm hungry, let's eat!"),
    "儿子": ("他的儿子十岁了。", "Son fils a dix ans.", "His son is ten years old."),
    "二": ("现在是二月。", "Nous sommes en février.", "It's February now."),
    "饭馆": ("这家饭馆的菜很好吃。", "La cuisine de ce restaurant est délicieuse.", "The food at this restaurant is delicious."),
    "房间": ("我的房间很小。", "Ma chambre est petite.", "My room is small."),
    "非常": ("我非常喜欢中国菜。", "J'aime énormément la cuisine chinoise.", "I very much like Chinese food."),
    "服务": ("这里的服务很好。", "Le service ici est très bon.", "The service here is very good."),
    "咖啡": ("他喜欢喝咖啡。", "Il aime boire du café.", "He likes to drink coffee."),
    "跟": ("我跟他一起去。", "J'y vais avec lui.", "I go with him."),
    "更": ("今天比昨天更热。", "Aujourd'hui il fait plus chaud qu'hier.", "Today is hotter than yesterday."),
    "公园": ("我们在公园里散步。", "Nous nous promenons dans le parc.", "We walk in the park."),
    "公司": ("她在一个大公司工作。", "Elle travaille dans une grande entreprise.", "She works at a big company."),
    "狗": ("我家有一只狗。", "J'ai un chien à la maison.", "I have a dog at home."),
    "贵": ("这件衣服太贵了。", "Ce vêtement est trop cher.", "This clothes is too expensive."),
    "国": ("中国是一个大国。", "La Chine est un grand pays.", "China is a big country."),
    "过": ("请过来坐。", "Venez vous asseoir.", "Please come over and sit."),
    "还": ("我还有问题。", "J'ai encore des questions.", "I still have questions."),
    "汉语": ("她在学习汉语。", "Elle apprend le chinois.", "She is learning Chinese."),
    "好": ("你好吗？我很好。", "Comment vas-tu ? Je vais bien.", "How are you? I'm fine."),
    "号": ("今天是五号。", "Nous sommes le 5 du mois.", "Today is the fifth."),
    "喝": ("我想喝水。", "Je voudrais boire de l'eau.", "I want to drink water."),
    "和": ("我喝茶和咖啡。", "Je bois du thé et du café.", "I drink tea and coffee."),
    "后": ("请看后面。", "Regardez derrière.", "Look behind."),
    "话": ("他会说法语。", "Il sait parler français.", "He can speak French."),
    "家": ("我回家吃饭。", "Je rentre manger à la maison.", "I go home to eat."),
    "孩子": ("孩子们在学校。", "Les enfants sont à l'école.", "The children are at school."),
    "白": ("那是一只白色的猫。", "C'est un chat blanc.", "That is a white cat."),
    "分钟": ("请等五分钟。", "Veuillez attendre cinq minutes.", "Please wait five minutes."),
    "看见": ("我看见我的朋友了。", "J'ai vu mon ami.", "I saw my friend."),
    "可以": ("我可以进来吗？", "Puis-je entrer ?", "May I come in?"),
    "课": ("我们的课九点开始。", "Notre cours commence à neuf heures.", "Our class starts at nine."),
    "里": ("猫在房间里。", "Le chat est dans la chambre.", "The cat is in the room."),
    "两": ("我有两个哥哥。", "J'ai deux grands frères.", "I have two older brothers."),
    "人": ("中国人很多。", "Il y a beaucoup de Chinois.", "There are many Chinese people."),
    "认识": ("很高兴认识你！", "Enchanté de vous connaître !", "Nice to meet you!"),
    "日": ("今天是什么日子？", "Quelle est la date aujourd'hui ?", "What's the date today?"),
    "书": ("这本书很有意思。", "Ce livre est intéressant.", "This book is interesting."),
    "水": ("请给我一杯水。", "Donnez-moi un verre d'eau, s'il vous plaît.", "Please give me a glass of water."),
    "谁": ("他是谁？", "Qui est-il ?", "Who is he?"),
    "时间": ("你没有时间吗？", "N'as-tu pas le temps ?", "Don't you have time?"),
    "什么": ("这是什么？", "Qu'est-ce que c'est ?", "What is this?"),
    "十": ("他有十个学生。", "Il a dix étudiants.", "He has ten students."),
    "是": ("我是学生。", "Je suis étudiant.", "I am a student."),
    "手": ("我的手很大。", "Mes mains sont grandes.", "My hands are big."),
    "树": ("树上有很多叶子。", "Il y a beaucoup de feuilles sur l'arbre.", "There are many leaves on the tree."),
    "岁": ("我妈妈四十岁。", "Ma mère a quarante ans.", "My mother is forty years old."),
    "它": ("这是一只猫，它很可爱。", "C'est un chat, il est mignon.", "This is a cat, it's cute."),
    "想": ("我想去中国。", "Je veux aller en Chine.", "I want to go to China."),
    "小": ("我有一个妹妹。", "J'ai une petite sœur.", "I have a younger sister."),
    "少": ("这儿的人很少。", "Il y a peu de gens ici.", "There are few people here."),
    "学校": ("学校在公园旁边。", "L'école est à côté du parc.", "The school is next to the park."),
    "学生": ("她是我的学生。", "C'est mon élève.", "She is my student."),
    "一": ("我要一个杯子。", "Je veux un verre.", "I want one cup."),
    "已经": ("他已经走了。", "Il est déjà parti.", "He has already left."),
    "鱼": ("我喜欢吃鱼。", "J'aime manger du poisson.", "I like to eat fish."),
    "中国": ("我住在中国。", "J'habite en Chine.", "I live in China."),
    "住": ("你住在哪儿？", "Où habites-tu ?", "Where do you live?"),
    "工作": ("我在公司工作。", "Je travaille dans une entreprise.", "I work at a company."),
    "喜欢": ("我喜欢学习汉语。", "J'aime apprendre le chinois.", "I like learning Chinese."),
    "坐": ("请坐！", "Asseyez-vous, je vous prie.", "Please sit down!"),
    "朋友": ("他是我的好朋友。", "C'est mon meilleur ami.", "He is my good friend."),
    "现在": ("现在几点了？", "Quelle heure est-il ?", "What time is it now?"),
    "明天": ("明天见！", "À demain !", "See you tomorrow!"),
    "名字": ("你的名字是什么？", "Comment t'appelles-tu ?", "What is your name?"),
    "妈妈": ("我妈妈在做饭。", "Ma mère cuisine.", "My mother is cooking."),
    "马": ("我想学骑马。", "Je veux apprendre à monter à cheval.", "I want to learn horseback riding."),
    "猫": ("猫在家里。", "Le chat est à la maison.", "The cat is at home."),
    "没": ("我没有钱。", "Je n'ai pas d'argent.", "I don't have money."),
    "句子": ("请再说一遍这个句子。", "Répétez cette phrase, s'il vous plaît.", "Please repeat this sentence."),
    "太": ("今天太热了！", "Il fait trop chaud aujourd'hui !", "It's too hot today!"),
    "她": ("她是我的老师。", "Elle est mon professeur.", "She is my teacher."),
    "天气": ("今天的天气真好。", "Il fait vraiment beau aujourd'hui.", "The weather is really nice today."),
    "他": ("他是我哥哥。", "C'est mon grand frère.", "He is my older brother."),
    "他们": ("他们是学生。", "Ce sont des étudiants.", "They are students."),
    "疼": ("我的头很疼。", "J'ai mal à la tête.", "My head hurts."),
    "身体": ("请注意身体。", "Prenez soin de votre santé.", "Take care of your health."),
    "听": ("我喜欢听音乐。", "J'aime écouter de la musique.", "I like listening to music."),
    "同学": ("她是我的同学。", "C'est ma camarade de classe.", "She is my classmate."),
    "老师": ("老师在教室里。", "Le professeur est dans la classe.", "The teacher is in the classroom."),
    "了": ("下雨了！", "Il pleut !", "It's raining!"),
    "冷": ("今天很冷。", "Il fait très froid aujourd'hui.", "It's very cold today."),
    "离": ("学校离我家很近。", "L'école est près de chez moi.", "The school is close to my home."),
    "路": ("这条路通向火车站。", "Cette route mène à la gare.", "This road leads to the station."),
    "旅游": ("我们去北京旅游。", "Nous voyageons à Pékin.", "We travel to Beijing."),
    "卖": ("这个商店卖水果。", "Ce magasin vend des fruits.", "This store sells fruit."),
    "买": ("我要买一些水果。", "Je veux acheter des fruits.", "I want to buy some fruit."),
    "米饭": ("我们每天吃米饭。", "Nous mangeons du riz tous les jours.", "We eat rice every day."),
    "妹妹": ("我妹妹今年十八岁。", "Ma petite sœur a dix-huit ans cette année.", "My younger sister is eighteen this year."),
    "们": ("我们一起去。", "On y va ensemble.", "We go together."),
    "男": ("那个男人是谁？", "Qui est cet homme ?", "Who is that man?"),
    "你": ("你叫什么名字？", "Comment t'appelles-tu ?", "What's your name?"),
    "您": ("您好，请进！", "Bonjour, entrez !", "Hello, please come in!"),
    "女儿": ("她的女儿很漂亮。", "Sa fille est très belle.", "Her daughter is beautiful."),
    "女人": ("那个女人在做什么？", "Que fait cette femme ?", "What is that woman doing?"),
    "裙子": ("这条裙子很漂亮。", "Cette jupe est très jolie.", "This skirt is pretty."),
    "去": ("我去学校。", "Je vais à l'école.", "I go to school."),
    "热": ("夏天很热。", "L'été est très chaud.", "Summer is hot."),
    "三": ("我三个朋友在中国。", "Trois de mes amis sont en Chine.", "Three of my friends are in China."),
    "商店": ("商店九点开门。", "Le magasin ouvre à neuf heures.", "The store opens at nine."),
    "上": ("书在桌子上。", "Le livre est sur la table.", "The book is on the table."),
    "上午": ("我们上午上课。", "Nous avons cours le matin.", "We have class in the morning."),
    "下午": ("今天下午有空吗？", "Es-tu libre cet après-midi ?", "Are you free this afternoon?"),
    "生病": ("他生病了，不去学校。", "Il est malade, il ne va pas à l'école.", "He's sick and won't go to school."),
    "生日": ("祝你生日快乐！", "Joyeux anniversaire !", "Happy birthday to you!"),
    "上海": ("上海很大也很漂亮。", "Shanghai est grande et magnifique.", "Shanghai is big and beautiful."),
    "说话": ("请小声说话。", "Parlez à voix basse, s'il vous plaît.", "Please speak quietly."),
    "水果": ("我爱吃水果。", "J'adore manger des fruits.", "I love eating fruit."),
    "睡觉": ("我要去睡觉了。", "Je vais me coucher.", "I'm going to sleep."),
    "数学": ("数学很难，但我喜欢。", "Les maths sont difficiles, mais j'adore ça.", "Math is hard, but I love it."),
    "医院": ("他在医院工作。", "Il travaille à l'hôpital.", "He works at the hospital."),
    "医生": ("医生说是小毛病。", "Le médecin dit que c'est bénin.", "The doctor says it's minor."),
    "药": ("请按时吃药。", "Prenez vos médicaments à l'heure.", "Please take your medicine on time."),
    "运动": ("我每天做运动。", "Je fais du sport tous les jours.", "I exercise every day."),
    "飞机": ("飞机在天上飞。", "L'avion vole dans le ciel.", "The plane flies in the sky."),
    "火车": ("我们坐火车去。", "Nous y allons en train.", "We go by train."),
    "汽车": ("他的车是新汽车。", "Sa voiture est neuve.", "His car is new."),
    "自行车": ("我骑自行车上班。", "Je vais au travail à vélo.", "I ride my bike to work."),
    "公共汽车": ("我们坐公共汽车去学校。", "Nous allons à l'école en bus.", "We take the bus to school."),
    "地铁": ("地铁站在前面。", "La station de métro est devant.", "The metro station is ahead."),
    "机场": ("我们去机场接他。", "Nous allons le chercher à l'aéroport.", "We pick him up at the airport."),
    "火车站": ("火车站在哪里？", "Où est la gare ?", "Where is the train station?"),
    "左": ("请往左走。", "Tournez à gauche, s'il vous plaît.", "Please turn left."),
    "右": ("银行在右边。", "La banque est à droite.", "The bank is on the right."),
    "中间": ("他坐在中间。", "Il est assis au milieu.", "He sits in the middle."),
    "前": ("学校前面有公园。", "Il y a un parc devant l'école.", "There's a park in front of the school."),
    "颜色": ("你喜欢什么颜色？", "Quelle est ta couleur préférée ?", "What color do you like?"),
    "眼睛": ("她的眼睛很大。", "Elle a de grands yeux.", "She has big eyes."),
    "耳朵": ("兔子的耳朵很长。", "Les oreilles du lapin sont longues.", "The rabbit's ears are long."),
    "鼻子": ("他鼻子很灵。", "Il a le nez fin.", "He has a keen sense of smell."),
    "嘴巴": ("请张开嘴巴。", "Ouvrez la bouche, s'il vous plaît.", "Please open your mouth."),
    "头发": ("她的头发很长。", "Elle a les cheveux longs.", "She has long hair."),
    "今年": ("今年我学汉语。", "Cette année, j'apprends le chinois.", "This year I study Chinese."),
    "明年": ("明年我去中国。", "L'année prochaine, je vais en Chine.", "Next year I'll go to China."),
    "去年": ("去年我去了日本。", "L'année dernière, je suis allé au Japon.", "Last year I went to Japan."),
    "今天": ("今天是星期一。", "Nous sommes lundi.", "Today is Monday."),
    "昨天": ("昨天我工作了。", "Hier, j'ai travaillé.", "Yesterday I worked."),
    "星期": ("你星期几有空？", "Quel jour es-tu libre ?", "What day are you free?"),
    "年": ("我学习中文一年了。", "J'étudie le chinois depuis un an.", "I've studied Chinese for a year."),
    "月": ("一月很冷。", "Janvier est très froid.", "January is cold."),
    "中午": ("我们中午吃饭。", "Nous déjeunons à midi.", "We eat lunch at noon."),
    "晚上": ("晚上我看电视。", "Le soir, je regarde la télé.", "In the evening I watch TV."),
    "早上": ("我每天早上跑步。", "Je cours chaque matin.", "I run every morning."),
    "小时": ("考试两个小时。", "L'examen dure deux heures.", "The exam lasts two hours."),
    "块": ("这个三块钱。", "Ça coûte trois yuans.", "This costs three yuan."),
    "元": ("一共十元钱。", "Cela fait dix yuans au total.", "Ten yuan in total."),
    "多少": ("多少钱？", "Combien ça coûte ?", "How much is it?"),
    "几": ("你几岁了？", "Quel âge as-tu ?", "How old are you?"),
    "这": ("这是我妈妈。", "Voici ma mère.", "This is my mother."),
    "那": ("那是我的书。", "Cela est mon livre.", "That is my book."),
    "哪儿": ("你去哪儿？", "Où vas-tu ?", "Where are you going?"),
    "哪": ("你要哪个？", "Lequel veux-tu ?", "Which one do you want?"),
    "这儿": ("请到这儿来。", "Viens ici, s'il te plaît.", "Come here, please."),
    "那儿": ("那儿有很多人。", "Il y a beaucoup de monde là-bas.", "There are many people there."),
    # ---- HSK 2 ----
    "吧": ("我们走吧！", "Allons-y !", "Let's go!"),
    "百": ("一百个人来了。", "Cent personnes sont venues.", "One hundred people came."),
    "班": ("我们是同班。", "Nous sommes dans la même classe.", "We're in the same class."),
    "帮": ("能帮我一下吗？", "Peux-tu m'aider ?", "Can you help me?"),
    "洗澡": ("我晚上洗澡。", "Je prends une douche le soir.", "I shower in the evening."),
    "觉得": ("我觉得很好。", "Je trouve ça très bien.", "I think it's great."),
    "欢迎": ("欢迎来到北京！", "Bienvenue à Pékin !", "Welcome to Beijing!"),
    "告诉": ("请告诉我你的地址。", "Donne-moi ton adresse, s'il te plaît.", "Please tell me your address."),
    "歌": ("这首歌很好听。", "Cette chanson est très jolie.", "This song is nice."),
    "哥哥": ("我哥哥在工作。", "Mon grand frère travaille.", "My older brother works."),
    "给": ("请给他一本书。", "Donne-lui un livre, s'il te plaît.", "Please give him a book."),
    "个": ("我要三个苹果。", "Je veux trois pommes.", "I want three apples."),
    "个子": ("他个子很高。", "Il est très grand (de taille).", "He is very tall."),
    "国家": ("你来自哪个国家？", "De quel pays viens-tu ?", "What country are you from?"),
    "果汁": ("我想喝一杯果汁。", "Je voudrais un jus de fruits.", "I'd like a glass of juice."),
    "过程": ("重要的是过程。", "Ce qui compte, c'est le processus.", "The process is what matters."),
    "海军": ("他在海军工作。", "Il sert dans la marine.", "He serves in the navy."),
    "害怕": ("我不怕黑。", "Je n'ai pas peur du noir.", "I'm not afraid of the dark."),
    "河": ("这条河很长。", "Ce fleuve est très long.", "This river is very long."),
    "湖": ("湖边很美。", "Le bord du lac est magnifique.", "The lakeside is beautiful."),
    "环境": ("这里的环境很好。", "L'environnement ici est excellent.", "The environment here is good."),
    "换": ("我想换钱。", "Je veux changer de l'argent.", "I want to exchange money."),
    "灰": ("那件衣服是灰色的。", "Ce vêtement est gris.", "That garment is gray."),
    "回": ("我要回家。", "Je dois rentrer à la maison.", "I want to go back home."),
    "回答": ("请回答问题。", "Répondez à la question.", "Please answer the question."),
    "会议": ("会议三点开始。", "La réunion commence à trois heures.", "The meeting starts at three."),
    "或者": ("喝茶或者喝咖啡？", "Thé ou café ?", "Tea or coffee?"),
    "基本": ("这是基本要求。", "C'est une exigence de base.", "This is a basic requirement."),
    "极": ("这是南极。", "C'est l'Antarctique.", "This is the South Pole."),
    "及": ("老师及学生都来了。", "Le professeur et les élèves sont venus.", "The teacher and students came."),
    "级别": ("这个级别的考试很难。", "L'examen de ce niveau est difficile.", "The test at this level is hard."),
    "即使": "即使下雨我也去。|Même s'il pleut, j'y vais.|Even if it rains, I'll go.".split("|"),
    "挤": ("早上的地铁很挤。", "Le métro est bondé le matin.", "The metro is crowded in the morning."),
    "计划": ("你有什么计划？", "As-tu des projets ?", "Do you have any plans?"),
    "计": ("让我计算一下。", "Laisse-moi calculer.", "Let me calculate."),
    "记忆": ("好的记忆很重要。", "Une bonne mémoire est importante.", "Good memory is important."),
    "季节": ("春天是最好的季节。", "Le printemps est la meilleure saison.", "Spring is the best season."),
    "技术": ("他的技术很好。", "Sa technique est excellente.", "His skill is very good."),
    "继续": ("请继续说。", "Continuez, s'il vous plaît.", "Please go on."),
    "加班": ("我今天要加班。", "Je dois faire des heures sup aujourd'hui.", "I have to work overtime today."),
    "家具": ("我们买新家具。", "Nous achetons des meubles neufs.", "We're buying new furniture."),
    "价格": ("价格太高了。", "Le prix est trop élevé.", "The price is too high."),
    "坚持": ("坚持就是胜利。", "Persévérer, c'est vaincre.", "Perseverance is victory."),
    "减肥": ("她想减肥。", "Elle veut perdre du poids.", "She wants to lose weight."),
    "减少": ("请减少开销。", "Merci de réduire les dépenses.", "Please cut expenses."),
    "建议": ("我有一个建议。", "J'ai une suggestion.", "I have a suggestion."),
    "健康": ("健康最重要。", "La santé est ce qu'il y a de plus important.", "Health is most important."),
    "饺子": ("我们吃饺子吧。", "Mangeons des raviolis !", "Let's eat dumplings!"),
    "接受": ("我接受你的邀请。", "J'accepte ton invitation.", "I accept your invitation."),
    "街道": ("这条街很热闹。", "Cette rue est animée.", "This street is lively."),
    "节目": ("这个节目很好看。", "Cette émission est passionnante.", "This show is great."),
    "结婚": ("他们明年结婚。", "Ils se marient l'année prochaine.", "They're getting married next year."),
    "结束": ("会议结束了。", "La réunion est terminée.", "The meeting is over."),
    "解决": ("我们能解决这个问题。", "Nous pouvons résoudre ce problème.", "We can solve this problem."),
    "借": ("能借我一支笔吗？", "Peux-tu me prêter un stylo ?", "Can you lend me a pen?"),
    "介绍": ("让我介绍一下。", "Permettez-moi de présenter.", "Let me introduce."),
    "金额": ("金额不大。", "Le montant est modeste.", "The amount is small."),
    "金": ("金色很漂亮。", "Le doré est très joli.", "Gold color is beautiful."),
    "仅": ("仅此一次。", "Une seule fois.", "Just this once."),
    "进行": ("比赛正在进行。", "Le match est en cours.", "The game is underway."),
    "经济": ("经济发展很快。", "L'économie croît rapidement.", "The economy grows fast."),
    "经历": ("这是一次有趣的经历。", "C'est une expérience intéressante.", "It's an interesting experience."),
    "尽管": "尽管累，他还工作。|Malgré la fatigue, il travaille encore.|Though tired, he still works.".split("|"),
    "银行": ("银行几点关门？", "À quelle heure ferme la banque ?", "When does the bank close?"),
    "应该": "你应该休息。|Tu devrais te reposer.|You should rest.".split("|"),
    "影响": ("天气影响心情。", "La météo influence l'humeur.", "Weather affects mood."),
    "响": ("外面很响。", "Il y a beaucoup de bruit dehors.", "It's noisy outside."),
    "手机": ("我的手机在哪儿？", "Où est mon portable ?", "Where's my cell phone?"),
    "事情": ("这件事很重要。", "Cette affaire est importante.", "This matter is important."),
    "适合": ("这件衣服很适合你。", "Ce vêtement te va très bien.", "This outfit suits you."),
    "适应": ("我适应了这里的生活。", "Je me suis adapté à la vie ici.", "I've adapted to life here."),
    "首都": ("北京是中国的首都。", "Pékin est la capitale de la Chine.", "Beijing is the capital of China."),
    "双": ("我买了一双鞋。", "J'ai acheté une paire de chaussures.", "I bought a pair of shoes."),
    "希望": "我希望你来。|J'espère que tu viendras.|I hope you'll come.".split("|"),
    "由": ("会议由他主持。", "C'est lui qui préside la réunion.", "He chairs the meeting."),
    "生活": ("这里的生活很方便。", "La vie ici est pratique.", "Life here is convenient."),
    "生物": ("生物课很有趣。", "Le cours de biologie est passionnant.", "Biology class is fun."),
    "声": ("他大声说话。", "Il parle fort.", "He speaks loudly."),
    "生": ("这个词是什么意思？", "Que veut dire ce mot ?", "What does this word mean?"),
    "示范": ("请做一次示范。", "Faites une démonstration, s'il vous plaît.", "Please demonstrate."),
    "试": ("试一下吧。", "Essaie donc.", "Give it a try."),
    "市场": ("我们去市场买菜。", "Nous faisons les courses au marché.", "We shop at the market."),
    "微笑": ("她对我微笑。", "Elle me sourit.", "She smiles at me."),
    "死": ("这只鸟死了。", "Cet oiseau est mort.", "This bird died."),
    "送": ("我去送你。", "Je te raccompagne.", "I'll walk you out."),
    "速度": ("请降低速度。", "Ralentissez, s'il vous plaît.", "Please slow down."),
    "度": ("今天二十五度。", "Il fait vingt-cinq degrés aujourd'hui.", "It's 25 degrees today."),
    "旅行": ("我想去日本旅行。", "Je veux voyager au Japon.", "I want to travel to Japan."),
    "餐馆": ("这家餐馆很有名。", "Ce restaurant est célèbre.", "This restaurant is famous."),
    "年龄": ("请不要问年龄。", "Ne demandez pas l'âge, s'il vous plaît.", "Don't ask about age."),
    "弄": ("我来弄晚饭。", "Je prépare le dîner.", "I'll fix dinner."),
    "提高": ("我想提高汉语水平。", "Je veux améliorer mon chinois.", "I want to improve my Chinese."),
    "体": ("体育很重要。", "Le sport est important.", "Physical education matters."),
    "跳舞": ("她喜欢跳舞。", "Elle adore danser.", "She loves dancing."),
    "贴": ("请把海报贴在墙上。", "Collez l'affiche au mur.", "Paste the poster on the wall."),
    "翻译": ("请翻译这句话。", "Traduisez cette phrase, s'il vous plaît.", "Please translate this sentence."),
    "统计": ("这些统计数据有用。", "Ces statistiques sont utiles.", "These statistics are useful."),
    "天": ("一天有二十四小时。", "Un jour compte vingt-quatre heures.", "A day has twenty-four hours."),
    "条": ("我养了一条狗。", "J'ai un chien.", "I have a dog."),
    "同意": ("我同意你的看法。", "Je suis d'accord avec toi.", "I agree with you."),
    "休息": "我们需要休息。|Nous avons besoin de repos.|We need to rest.".split("|"),
    "习惯": ("我习惯了早起。", "J'ai pris l'habitude de me lever tôt.", "I'm used to getting up early."),
    "次": ("我去过三次。", "J'y suis allé trois fois.", "I've been there three times."),
    "聪明": ("这个孩子很聪明。", "Cet enfant est intelligent.", "This child is smart."),
    "毛巾": ("请给我一条毛巾。", "Donnez-moi une serviette, s'il vous plaît.", "Please give me a towel."),
    "汉堡": ("他喜欢吃汉堡。", "Il aime manger des hamburgers.", "He likes eating hamburgers."),
    "好看": ("这部电影真好看！", "Ce film est vraiment génial !", "This movie is really good!"),
    "好吃": ("中国菜很好吃。", "La cuisine chinoise est délicieuse.", "Chinese food is delicious."),
    "校长": ("校长讲话了。", "Le directeur a pris la parole.", "The principal spoke."),
    "意见": ("你有什么意见？", "Quel est ton avis ?", "What's your opinion?"),
    "月亮": ("今晚月亮很亮。", "La lune est brillante ce soir.", "The moon is bright tonight."),
    "约会": ("我们七点约会。", "On se donne rendez-vous à sept heures.", "We have a date at seven."),
    "也许": ("也许明天会下雨。", "Il pleuvra peut-être demain.", "Maybe it will rain tomorrow."),
    "感冒": ("我感冒了。", "J'ai attrapé un rhume.", "I caught a cold."),
    "感兴趣": ("我对汉语感兴趣。", "Le chinois m'intéresse.", "I'm interested in Chinese."),
    "刚才": ("他刚才在这儿。", "Il était là tout à l'heure.", "He was just here."),
    "帮助": ("谢谢你的帮助！", "Merci pour ton aide !", "Thanks for your help!"),
    "离开": ("我们五点离开。", "Nous partons à cinq heures.", "We leave at five."),
    "城市": ("上海是一座大城市。", "Shanghai est une grande ville.", "Shanghai is a big city."),
    "迟到": ("对不起，我迟到了。", "Désolé, je suis en retard.", "Sorry, I'm late."),
    "出": ("他出门了。", "Il est sorti.", "He went out."),
    "出色": ("他的工作很出色。", "Son travail est remarquable.", "His work is outstanding."),
    "出来": ("请从里面出来。", "Sortez, s'il vous plaît.", "Please come out."),
    "出去": ("我想出去走走。", "Je veux aller marcher dehors.", "I want to go out for a walk."),
    "传": ("请传给我。", "Passe-le-moi, s'il te plaît.", "Pass it to me."),
    "传统": ("春节是中国传统节日。", "Le Nouvel An lunaire est une fête traditionnelle chinoise.", "Spring Festival is a traditional Chinese holiday."),
    "窗户": ("请打开窗户。", "Ouvre la fenêtre, s'il te plaît.", "Please open the window."),
    "单词": ("我每天记十个单词。", "Je retiens dix mots par jour.", "I memorize ten words a day."),
    "担心": ("别为我担心。", "Ne t'inquiète pas pour moi.", "Don't worry about me."),
    "当中": ("他是我们当中最高的。", "Il est le plus grand d'entre nous.", "He's the tallest among us."),
    "到": ("我们六点到。", "Nous arrivons à six heures.", "We arrive at six."),
    "道路": ("这条道路很宽。", "Cette route est large.", "This road is wide."),
    "得": ("你得快点。", "Tu dois te dépêcher.", "You have to hurry."),
    "等": ("请稍等一下。", "Un instant, s'il vous plaît.", "Please wait a moment."),
    "弟弟": ("我弟弟在学校。", "Mon petit frère est à l'école.", "My younger brother is at school."),
    "第一": ("他是第一名。", "Il est premier.", "He came first."),
    "一些": ("给我一些水。", "Donne-moi un peu d'eau.", "Give me some water."),
    "一定": ("你一定要来！", "Tu dois absolument venir !", "You must come!"),
    "一共": ("一共多少钱？", "Cela fait combien au total ?", "How much altogether?"),
    "一起": "我们一起走。|Marchons ensemble.|Let's walk together.".split("|"),
    "意外": ("这是个意外。", "C'est un accident imprévu.", "It was an accident."),
    "往往": ("他往往迟到。", "Il est souvent en retard.", "He's often late."),
    "温度": ("今天温度很高。", "La température est élevée aujourd'hui.", "The temperature is high today."),
    "温暖": ("家里很温暖。", "La maison est chaleureuse.", "Home is warm."),
    "文章": ("他写了一篇文章。", "Il a écrit un article.", "He wrote an article."),
    "文明": ("中国有悠久的文明。", "La Chine a une longue civilisation.", "China has an ancient civilization."),
    "文化": ("我喜欢中国文化。", "J'aime la culture chinoise.", "I like Chinese culture."),
    "西方": ("西方节日很有趣。", "Les fêtes occidentales sont amusantes.", "Western holidays are fun."),
    "新闻": ("你看今天的新闻吗？", "Regardes-tu les infos aujourd'hui ?", "Do you watch the news today?"),
    "新鲜": ("这些鱼很新鲜。", "Ce poisson est frais.", "This fish is fresh."),
    "相信": ("我相信你。", "Je te fais confiance.", "I believe you."),
    "香蕉": ("猴子喜欢吃香蕉。", "Les singes adorent les bananes.", "Monkeys love bananas."),
    "像": ("他像他爸爸。", "Il ressemble à son père.", "He looks like his father."),
    "向": ("请向前走。", "Allez tout droit, s'il vous plaît.", "Please go forward."),
    "小心": ("小心！车来了！", "Attention ! Voici une voiture !", "Careful! Here comes a car!"),
    "笑": ("他们都笑了。", "Ils ont tous ri.", "They all laughed."),
    "新": ("我有一本新书。", "J'ai un nouveau livre.", "I have a new book."),
}

# --- Liste des verbes (formes citées) pour constructions génériques ----------
VERB_PATTERNS_FR = (
    "aimer", "adorer", "avoir", "être", "faire", "aller", "venir", "voir", "regarder",
    "écouter", "parler", "dormir", "travailler", "voyager", "acheter", "vendre",
    "donner", "prendre", "payer", "rencontrer", "attendre", "chercher", "jouer",
    "lire", "étudier", "apprendre", "enseigner", "écrire", "ouvrir", "fermer",
    "finir", "terminer", "continuer", "commencer", "danser", "chanter", "courir",
    "nager", "tomber", "s'asseoir", "se reposer", "se marier", "s'inquiéter",
    "porter", "mettre", "manger", "boire", "téléphoner", "habiter", "rester",
    "connaître", "aider", "changer", "échanger", "essayer", "tester", "répondre",
    "demander", "expliquer", "présenter", "introduire", "accepter", "refuser",
    "oublier", "prêter", "emprunter", "traduire", "vérifier", "calculer",
    "utiliser", "montrer", "démontrer", "partir", "quitter", "arriver", "sortir",
    "entrer", "durer", "coûter", "pouvoir", "devoir", "vouloir", "sembler",
    "paraître", "croire", "espérer", "penser", "trouver", "perdre", "gagner",
    "louer", "conduire", "respirer", "vivre", "mourir", "rire", "sourire",
    "suivre", "persévérer", "maintenir", "diminuer", "réduire", "augmenter",
    "élever", "améliorer", "s'adapter", "convvenir", "manipuler", "maigrir",
    "dessiner", "offrir", "accompagner", "raccompagner", "servir", "recevoir",
    "collecter", "récolter", "transmettre", "propager", "coller", "apposer",
    "compter", "négliger", "couper", "casser", "pousser", "tirer", "jeter",
)


def generic_example(word, fr, en):
    first_fr = fr.split(" ; ")[0].strip()
    first_en = en.split(";")[0].strip()
    is_verb = any(first_fr.startswith(v) for v in VERB_PATTERNS_FR) or first_en.startswith("to ")
    if is_verb:
        zh = "他很喜欢%s。" % word
        f = "Il/Elle aime beaucoup %s." % first_fr
        e = "He/She really likes %s." % first_en.replace("to ", "")
        return zh, f, e
    zh = "这个%s很有名。" % word
    f = "Ce/Cette « %s » est très connu(e)." % first_fr
    e = "This '%s' is very well known." % first_en
    return zh, f, e


def pinyin_of(word):
    parts = lazy_pinyin(word, style=Style.TONE)
    # majuscule pour les noms propres détectés (première lettre capitale dans data?)
    py = " ".join(parts)
    if word[0] in ("北", "上", "中") and len(word) >= 2 and word in ("北京", "上海", "中国"):
        py = py[0].upper() + py[1:]
    return py


def build_cards(level_list, level_no, lang):
    cards = []
    for word, fr_tr, en_tr in level_list:
        py = pinyin_of(word)
        ex = EXAMPLES.get(word)
        if ex is None:
            ex = generic_example(word, fr_tr, en_tr)
        zh_ex, fr_ex, en_ex = ex
        tr = fr_tr if lang == "fr" else en_tr
        example = "「%s」— %s" % (zh_ex, fr_ex if lang == "fr" else en_ex)
        # échapper les guillemets doubles
        safe_word = word  # sinogrammes, pas de guillemets
        esc_tr = tr.replace('"', '\\"')
        esc_ex = example.replace('"', '\\"')
        cards.append(
            '        { word: "%s", pinyin: "%s", translation: "%s", level: %d, example: "%s" },'
            % (word, py, esc_tr, level_no, esc_ex)
        )
    return cards


def main():
    src = open(APP_JS, encoding="utf-8").read()

    fr_cards = build_cards(HSK1, 1, "fr") + [""] + build_cards(HSK2, 2, "fr")
    en_cards = build_cards(HSK1, 1, "en") + [""] + build_cards(HSK2, 2, "en")
    # retirer la virgule finale du dernier élément de chaque liste
    def join(cards):
        # cartes vides = séparateur HSK1/HSK2 ; on le remplace par un commentaire,
        # en gardant la virgule sur la dernière carte HSK 1 (sinon : erreur de syntaxe JS).
        sep = cards.index("")
        before = cards[:sep]
        after = cards[sep + 1:]
        if after:
            after[-1] = after[-1].rstrip(" ,")
        body = before + ["", "        // — HSK 2 · Élémentaire"] + after
        return "\n".join(body)

    fr_block = join(fr_cards)
    en_block = join(en_cards)

    new_vocab = (
        "  const vocab = {\n"
        "    fr: {\n"
        "      flag: '🇫🇷', name: 'Français → Chinois', tts: 'zh-CN',\n"
        "      desc: 'Tout le vocabulaire officiel HSK 1 et HSK 2 (300 mots).',\n"
        "      cards: [\n"
        "        // — HSK 1 · Débutant\n"
        + fr_block + "\n"
        "      ]\n"
        "    },\n"
        "    en: {\n"
        "      flag: '🇬🇧', name: 'Anglais → Chinois', tts: 'zh-CN',\n"
        "      desc: 'Complete official HSK 1 & HSK 2 vocabulary (300 words).',\n"
        "      cards: [\n"
        "        // — HSK 1 · Beginner\n"
        + en_block + "\n"
        "      ]\n"
        "    }\n"
        "  };"
    )

    pattern = re.compile(r"  const vocab = \{.*?\n  \};", re.S)
    if not pattern.search(src):
        print("ERREUR : bloc `const vocab` introuvable dans app.js")
        sys.exit(1)
    out = pattern.sub(lambda m: new_vocab, src, count=1)
    if "--check" in sys.argv:
        print("FR cartes:", fr_block.count("{ word:"))
        print("EN cartes:", en_block.count("{ word:"))
        print("--- échantillon FR ---")
        print("\n".join(fr_block.splitlines()[:6]))
        print("--- échantillon EN (HSK2) ---")
        print("\n".join(en_block.splitlines()[-4:]))
    else:
        open(APP_JS, "w", encoding="utf-8").write(out)
        print("js/app.js mis à jour —",
              fr_block.count("{ word:"), "cartes FR,",
              en_block.count("{ word:"), "cartes EN")


if __name__ == "__main__":
    main()
