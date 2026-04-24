// ─── ДАННЫЕ ───────────────────────────────────────────────────────────────────
// Этот файл будет заменён данными из скрейпера (data.json → data.js)
// Структура posts[] должна совпадать с форматом скрейпера

const CATEGORIES = [
  {
    id: 'recipes_photo',
    name: 'Рецепты фото',
    emoji: '📷',
    desc: 'Техники и секреты съёмки',
    posts: [
      {
        id: 162,
        date: '2025-10-09',
        text: 'фото провокация я ее называю \n\nможно повторить хоть где. дерзко вкусно, я люблю такое \n\nделаем в dazz. используем вспышку обязательно \n\nважно: белье должно быть какое-то необычное, либо блестки либо принт \n\nна ногах обязательно шпильки!!!',
        media_type: 'photo',
        photos: ['media/3_162_photo.jpg']
      },
      {
        id: 102,
        date: '2025-10-02',
        text: 'фишка: белье и карты. карты яркие, контрастные \nбелье создает ощущение домашней простоты, непринужденности\n\nв картинке рецепт \n\nполароид эффект есть в dazz 📸',
        media_type: 'photo',
        photos: ['media/3_102_photo.jpg', 'media/3_103_photo.jpg', 'media/3_104_photo.jpg']
      },
      {
        id: 93,
        date: '2025-10-01',
        text: 'ох, это один из моих любимых стилей- гламурная обнаженка \n\nсупер просто но при этом вау \n\n❤️фишка в том, что повторит образ очень просто - белье, ботфорты, аксессуары, сплошной фон. \n\nзаметьте, идея пространства в том, что она находится в фрейме: стены создают некую рамку',
        media_type: 'photo',
        photos: ['media/3_93_photo.jpg', 'media/3_94_photo.jpg']
      },
      {
        id: 88,
        date: '2025-09-30',
        text: 'как сфоткаться с цветами не как все 🌸\n\nрецепт обработки: \n\nприложение prequel \nэффект EXHO 1\nфильтр Cine film 3',
        media_type: 'photo',
        photos: ['media/3_88_photo.jpg', 'media/3_89_photo.jpg', 'media/3_90_photo.jpg']
      },
      {
        id: 76,
        date: '2025-09-29',
        text: 'вот тут обратите внимание на позу. \nочень просто, но как классно смотрится сверху. \n\nвот прям попробуйте в след раз взять именно такой кадр с такими позами\n\nрецепт фото в картинке ❤️',
        media_type: 'photo',
        photos: ['media/3_76_photo.jpg', 'media/3_77_photo.jpg', 'media/3_78_photo.jpg']
      },
      {
        id: 42,
        date: '2025-09-26',
        text: 'Рецепт фото: «Драма в отеле»\n\nЛокация: гостиничный номер или спальня в классическом стиле — массивная мебель, светильники с абажуром, плотные шторы.\n\nСвет: жёсткая вспышка прямо в лицо — создаёт театральный эффект, блеск на коже и волосах.\n\nКамера/ракурс: съёмка с нижней точки, немного под углом.\n\nОбраз: нейтральный однотонный наряд, естественный макияж с акцентом на губы и ресницы.\n\nПозирование: модель лежит на кровати, взгляд устремлён в сторону.\n\nЭффект: фотография выглядит как стоп-кадр из старого фильма.',
        media_type: 'photo',
        photos: ['media/3_42_photo.jpg', 'media/3_43_photo.jpg']
      },
      {
        id: 41,
        date: '2025-09-26',
        text: '📸 Рецепт фото: «Дива у полки с консервами»\n\nЛокация: супермаркет — яркие ряды банок создают графичный ритм.\n\nСвет: встроенная вспышка — жёсткий свет и тени, ощущение «глянца + ретро-папарацци».\n\nОбраз: яркий total look, акцентный аксессуар, очки.\n\nПозирование: дерзкая поза, выражение лица без «милоты», скорее с вызовом.\n\nЭффект: сочетание гламура и бытовой обстановки.',
        media_type: 'photo',
        photos: ['media/3_41_photo.jpg']
      }
    ]
  },
  {
    id: 'recipes_editing',
    name: 'Обработка',
    emoji: '🎨',
    desc: 'Приложения, фильтры, текстуры',
    posts: [
      {
        id: 528,
        date: '2025-12-17',
        text: 'необычная обработка фотки на телефоне за 1 мин , мне нравится такое использовать \n\nв видео туториал 🤍',
        media_type: 'video',
        media_path: 'media/109_528_video.mp4',
        poster:     'media/thumb_528.jpg',
        photos: ['media/109_527_photo.jpg']
      },
      {
        id: 431,
        date: '2025-12-01',
        text: 'такс, щас такое покажу!!!!\nдевочки, обязательно пробуем!\n\nфотка на пляже из фотки на фоне шторы\n\n1) фоткаемся на фоне шторы в летнем луке\n2) заходим в hypic (бесплатный)\n3) выбираем ai эффекты — закат, рассвет и прочее\n4) сверху обрабатываем ещё где-нибудь\n\nи просто посмотрите как красиво получается!',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_431_photo.jpg', 'media/109_430_photo.jpg', 'media/109_429_photo.jpg', 'media/109_428_photo.jpg']
      },
      {
        id: 381,
        date: '2025-11-19',
        text: '❤️ мое топ приложение для визуала. даже если вы не знаете ничего в дизайне, можно делать стильно\n\nbazaart — очень советую, очень много классных и стильных шаблонов и удобная функция обрезания фона\n\nвот пример с шаблоном art alert',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_381_photo.jpg', 'media/109_380_photo.jpg']
      },
      {
        id: 289,
        date: '2025-11-12',
        text: '💧 текстурки для фото и визуала постов\n(я часто их накладываю)',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_289_photo.jpg', 'media/109_288_photo.jpg', 'media/109_287_photo.jpg', 'media/109_286_photo.jpg']
      },
      {
        id: 276,
        date: '2025-11-10',
        text: 'идея фото просто пока готовим супчик 🍎\n\nфильтр на скрине, приложение meitu',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_276_photo.jpg', 'media/109_275_photo.jpg', 'media/109_274_photo.jpg', 'media/109_273_photo.jpg']
      },
      {
        id: 214,
        date: '2025-10-20',
        text: 'ой девочки\n\n🫀приложение meitu\n\nвсе эти ai эффекты просто афигеть какие крутые. просто посмотрите что делают\n\n🎀свечение сзади особенно хорошо\nскрин эффектов приложила, пробуйте все',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_214_photo.jpg', 'media/109_213_photo.jpg', 'media/109_212_photo.jpg', 'media/109_211_photo.jpg']
      },
      {
        id: 175,
        date: '2025-10-14',
        text: '❤️\n\nприложение: Fomz\n\n📸DV-core ↓\nсоздает очень крутой эффект блюра и загадочной дымки\n\n#обработка',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_175_photo.jpg']
      },
      {
        id: 167,
        date: '2025-10-11',
        text: 'такс, есть приложение аналог dazz cam ❤️\n\nназвание: Fomz\n\n📷 4s-mode ↓\nафигенный фильтр который имитирует камеру старого айфона 4s\n\n#обработка',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_167_photo.jpg']
      },
      {
        id: 122,
        date: '2025-10-06',
        text: 'такс\nделюсь обработкой!!\n\nопять наш любимый prequel\nэффект и фильтр в картинке',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_122_photo.jpg', 'media/109_121_photo.jpg', 'media/109_120_photo.jpg', 'media/109_119_photo.jpg']
      },
      {
        id: 112,
        date: '2025-10-05',
        text: 'так, это поиграться\n\nai эффект в hypic (в картинке)\nбесплатно кстати',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_112_photo.jpg', 'media/109_111_photo.jpg', 'media/109_110_photo.jpg']
      }
    ]
  },
  {
    id: 'video_lessons',
    name: 'Видео уроки',
    emoji: '🎬',
    desc: 'Обучение в формате видео',
    posts: [
      {
        id: 550,
        date: '2026-01-06',
        text: 'как быть узнаваемым в блоге\n\nчтобы люди листая ленту понимали, «это она» \n\nличный стиль и бренд, как собрать свою уникальность',
        media_type: 'video',
        media_path: 'https://github.com/nastyabazueva125-blip/business-consulting/releases/download/v1.0/64_550_IMG_0529.MOV',
        poster:     'media/thumb_550.jpg'
      },
      {
        id: 538,
        date: '2025-12-28',
        text: 'девчонкииии!! это супер полезный урок по фреймингу. делюсь своими секретами съемки',
        media_type: 'video',
        media_path: 'https://github.com/nastyabazueva125-blip/business-consulting/releases/download/v1.0/64_538_video.mp4',
        poster:     'media/thumb_538.jpg'
      },
      {
        id: 523,
        date: '2025-12-11',
        text: 'как монетизировать фото, блог и визуал \n\nтут рассказала на чем я зарабатывала во всех этих нишах\n\nкак сразу поставить $200 за фотосессию, \nна чем можно зарабатывать 80к в день \n\nпросто мой опыт и предложения вам для доп заработка 🌟',
        media_type: 'video',
        media_path: 'https://github.com/nastyabazueva125-blip/business-consulting/releases/download/v1.0/64_523_video.mp4',
        poster:     'media/thumb_523.jpg'
      },
      {
        id: 481,
        date: '2025-12-01',
        text: 'super clamp называется \n\nэто прям вместо вашего фотографа',
        media_type: 'video',
        media_path: 'media/64_481_video_note.mp4',
        poster:     'media/thumb_481.jpg'
      },
      {
        id: 410,
        date: '2025-11-27',
        text: 'урок по позингу в моменте сбора 👄\n\nя очень очень очень рекомендую вам прям подойти к зеркалу и повторить как некий танец 🤩\n\nжелательно в образе на каблучках, чтобы кайфануть от себя \n\nкогда вы телом запоминаете позы, вы можете их автоматически вспомнить в нужный момент!',
        media_type: 'video',
        media_path: 'https://github.com/nastyabazueva125-blip/business-consulting/releases/download/v1.0/64_410_video.mp4',
        poster:     'media/thumb_410.jpg'
      },
      {
        id: 385,
        date: '2025-11-20',
        text: 'ВИДЕОУРОК «КАК СОЗДАВАТЬ ДИЗАЙН ПОСТОВ НА ТЕЛЕФОНЕ»\n\nрассказала про карусели, оформление, как работать в bazart, и приемы для оформления \n\n#визуал #посты',
        media_type: 'video',
        media_path: 'https://github.com/nastyabazueva125-blip/business-consulting/releases/download/v1.0/64_385_video.mp4',
        poster:     'media/thumb_385.jpg'
      },
      {
        id: 271,
        date: '2025-11-09',
        text: '✨как делать ai фотки ✨подробный урок\n\nтут уже с промптами учимся создавать кастомные фотки, как я выкладывала с розовыми лошадьми в стиле сюрреализма  💧\n\nготовые промпты будут ниже 🌼',
        media_type: 'video',
        media_path: 'https://github.com/nastyabazueva125-blip/business-consulting/releases/download/v1.0/64_271_video.mp4',
        poster:     'media/thumb_271.jpg'
      },
      {
        id: 172,
        date: '2025-10-12',
        text: '⭐️ первое задание: сформируй свой визуальный код\n\n✔️ цель:\nсоздать личную визуальную карту (vibecore), которая отражает твою индивидуальность, эстетику и внутренние коды\n\n1️⃣открой pinterest и начни собирать изображения, которые тебя вдохновляют\n\n2️⃣собери всё, что тебе внутренне откликается — позы, цвет, свет, настроение кадра, фактуры\n\n3️⃣анализируй, почему тебе это нравится: «что именно меня зацепило?»\n\n4️⃣сохрани и оформи свою подборку — это и есть твой визуальный ДНК',
        media_type: null,
        media_path: null
      }
    ]
  },
  {
    id: 'ai',
    name: 'AI',
    emoji: '🤖',
    desc: 'Нейросети, промпты, AI-фото',
    posts: [
      {
        id: 526,
        date: '2025-12-15',
        text: '💌 кстати, многие из вас мне лично писали и спрашивали, какими я пользуюсь нейронками\n\nв целом, можно всегда писать сюда, я отвечаю на все запросы\n\nно вот мой список:\n— Higgsfield (AI фото и видео)\n— Meitu (AI эффекты)\n— Hypic (AI фото)\n— ChatGPT / Claude (тексты, идеи)\n— Midjourney (арт)',
        media_type: 'photo',
        media_path: null,
        photos: ['media/509_526_photo.jpg']
      },
      {
        id: 518,
        date: '2025-12-08',
        text: 'в ленте постоянно вижу какие-то колхозные ai фото 🙄 если честно\n\nпоэтому придумала свой промпт!\n\nзаписываем, повторяем ↓',
        media_type: 'photo',
        media_path: null,
        photos: ['media/509_518_photo.jpg', 'media/509_519_photo.jpg', 'media/509_520_photo.jpg']
      },
      {
        id: 513,
        date: '2025-12-08',
        text: 'технология та же, промпт другой:\n\nUse the uploaded winter Christmas street photograph as the primary visual reference.',
        media_type: 'photo',
        media_path: null,
        photos: ['media/509_513_photo.jpg', 'media/509_512_photo.jpg']
      },
      {
        id: 404,
        date: '2025-11-23',
        text: 'Как сделать такое фото в Higgsfield\n\n1) заходим в higgsfield\n2) нажать создать изображение\n3) выбрать nano banana pro\n4) ввести промпт ниже\n5) приложить свою фотку, где хорошо видно лицо\n\nPrompt: Transform my attached photo into a futuristic high-fashion editorial image. Ultra-bright studio lighting, clean white background, high contrast. Strong chromatic aberration along all edges. Motion blur streaks on hair. Dramatic elongated low-angle perspective. Keep my real face exactly the same.',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_404_photo.jpg', 'media/109_403_photo.jpg']
      },
      {
        id: 226,
        date: '2025-10-26',
        text: 'ой девочки\n\nai фотосессия в higgsfield\nэто бесплатно и некоторые фото реально правдоподобны\n\nинструкция ниже 😈',
        media_type: 'photo',
        media_path: null,
        photos: ['media/109_226_photo.jpg', 'media/109_225_photo.jpg', 'media/109_224_photo.jpg', 'media/109_223_photo.jpg']
      }
    ]
  },
  {
    id: 'watched',
    name: 'Насмотрелись',
    emoji: '👁',
    desc: 'Вдохновение, референсы, кураторство',
    posts: [
      {
        id: 419,
        date: '2025-11-28',
        text: '💧 подборка креаторов для повышения насмотренности\n\nкатегория: профессиональные фотографы\n\n🦋 dimakruykov — дима крюков\n🦋 bchokoshvili — бека чокошвили\n🦋 antoineandcharlie — энтони и чарли\n🦋 johnnydufort — джони дуфорт\n🦋 campbelladdy — кембелл эдди\n🦋 kito.munoz — кито муньоз\n🦋 kamillahanapova — камилла ханапова',
        media_type: 'photo',
        media_path: null,
        photos: ['media/12_419_photo.jpg', 'media/12_418_photo.jpg', 'media/12_417_photo.jpg', 'media/12_416_photo.jpg', 'media/12_415_photo.jpg', 'media/12_414_photo.jpg', 'media/12_413_photo.jpg']
      },
      {
        id: 266,
        date: '2025-11-07',
        text: 'хочу поделиться с вами моей папкой для сюреалистичного вайба\n\nобожаю такой кор, для аишек как референсы классно заходит\n\nhttps://pin.it/2oANWcSy3',
        media_type: 'photo',
        media_path: null,
        photos: ['media/12_266_photo.jpg']
      },
      {
        id: 245,
        date: '2025-10-28',
        text: 'насмотренность — дело многогранное. даже насмотренность в моде влияет на визуал и фото 🌼\n\nсейчас лежу смотрю перед сном: https://youtu.be/e9eph77ruwc\n\nеще часто смотрю показы и фешн кампейны.\n\nчем больше образов у вас в голове, тем более креативно вы мыслите\n\nкреатив влияет на все — рилс, фото, визуал, стиль в одежде 💧',
        media_type: null,
        media_path: null,
        photos: []
      },
      {
        id: 182,
        date: '2025-10-16',
        text: 'недавно нашла афигенную тему для насмотренности\n\nэто сайт с короткими арт фильмами. там просто капец какие стильные съемки и кадры.\n\nчем больше вы насматриваетесь на вау контенте, тем стильнее у вас будет получаться свой\n\nnowness.com — заходите и смотрите',
        media_type: 'photo',
        media_path: null,
        photos: ['media/12_182_photo.jpg', 'media/12_181_photo.jpg', 'media/12_180_photo.jpg']
      },
      {
        id: 84,
        date: '2025-09-29',
        text: 'вау.\n\nэто просто невероятно. давно не смотрела сериалы, но этот.\n\nгде-то год моей любимой песней был клип the weeknd — one of the girls. и тут оказалось, что это саундтрек сериала.\n\nтакого сильного вдохновения я давно не получала. кадры, музыка — всё сплетается в единую гармонию.\n\nпросто посмотрите. увидите искусство в каждом кадре.\n\n___\nцветовая гармония: красный и белый. контурный свет. в картинке расписала все приёмы',
        media_type: 'photo',
        media_path: null,
        photos: ['media/12_84_photo.jpg', 'media/12_83_photo.jpg', 'media/12_82_photo.jpg', 'media/12_81_photo.jpg', 'media/12_80_photo.jpg', 'media/12_79_photo.jpg']
      }
    ]
  }
];

const COURSE = {
  title: 'Сам себе фотограф',
  desc: 'Полный видеокурс — от нуля до уверенной съёмки',
  price: 2900,
  currency: '₽',
  payLink: 'https://t.me/+PkPK2V6cA-U4NGI6', // TODO: заменить на ссылку оплаты
  lessons: [
    { id: 1, title: 'Как видит камера',            free: true,  duration: '14:32' },
    { id: 2, title: 'Свет — основа всего',          free: true,  duration: '21:18' },
    { id: 3, title: 'Композиция и кадрирование',    free: false, duration: '18:45' },
    { id: 4, title: 'Портретная съёмка',            free: false, duration: '25:10' },
    { id: 5, title: 'Съёмка в движении',            free: false, duration: '19:55' },
    { id: 6, title: 'Обработка в Lightroom',        free: false, duration: '31:20' },
    { id: 7, title: 'Создание своего стиля',        free: false, duration: '28:05' },
  ]
};
