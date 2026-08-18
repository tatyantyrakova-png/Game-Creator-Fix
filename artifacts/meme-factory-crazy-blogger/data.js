/* Все игровые данные локальные: никаких картинок и сетевых зависимостей. */
var BACKGROUNDS = [
  {id:"candy",label:"Сахарный взрыв",emoji:"🍬",colors:["#ff5ca8","#ffcf40"]},
  {id:"space",label:"Космо-хаос",emoji:"🌌",colors:["#30206b","#9259d8"]},
  {id:"school",label:"Школа жизни",emoji:"🏫",colors:["#54e5ed","#b7ef4e"]},
  {id:"kitchen",label:"Кухня 3000",emoji:"🍳",colors:["#ff8a5b","#ffd83d"]},
  {id:"ocean",label:"Пузырьковый океан",emoji:"🌊",colors:["#157bb8","#54e5ed"]},
  {id:"lava",label:"Лавовая лампа",emoji:"🌋",colors:["#ff4f54","#7626a8"]},
  {id:"forest",label:"Лес мемов",emoji:"🌳",colors:["#236c67","#b7ef4e"]},
  {id:"void",label:"Белый шум",emoji:"🌀",colors:["#efdcff","#ff8bbf"]},
  {id:"castle",label:"Замок",emoji:"🏰",colors:["#5b2ca0","#ff8bbf"]},
  {id:"volcano",label:"Вулкан",emoji:"🌋",colors:["#ff4f54","#ffd83d"]},
  {id:"amusement",label:"Парк развлечений",emoji:"🎢",colors:["#54e5ed","#ff4f91"]},
  {id:"ufo",label:"НЛО",emoji:"🛸",colors:["#203a78","#54e5ed"]},
  {id:"theater",label:"Театр",emoji:"🎭",colors:["#7626a8","#ffcf40"]},
  {id:"stadium",label:"Стадион",emoji:"🏆",colors:["#236c67","#54e5ed"]},
  {id:"circus",label:"Цирк",emoji:"🎪",colors:["#ff4f91","#ffcf40"]},
  {id:"film-studio",label:"Киностудия",emoji:"🎬",colors:["#30165c","#ff8a5b"]},
  {id:"game-room",label:"Игровая комната",emoji:"🎮",colors:["#247c6f","#9259d8"]},
  {id:"rainbow-world",label:"Радужный мир",emoji:"🌈",colors:["#54e5ed","#ffd83d"]}
];
var CHARACTERS = [
  {id:"blob",label:"Пузырь",emoji:"🫠",colors:["#ffcd3c","#ff4f91"]},
  {id:"cat",label:"Котик",emoji:"😼",colors:["#ff9d5c","#6b2f8a"]},
  {id:"alien",label:"Инопланетянин",emoji:"👽",colors:["#b7ef4e","#247c6f"]},
  {id:"skull",label:"Скелетон",emoji:"💀",colors:["#f4ecdf","#9c5da6"]},
  {id:"robot",label:"Робо-бро",emoji:"🤖",colors:["#54e5ed","#4e60b7"]},
  {id:"frog",label:"Лягуш",emoji:"🐸",colors:["#86e65b","#245c43"]}
];
var POSES = [
  {id:"chill",label:"Стою",emoji:"🧍",transform:"chill"},
  {id:"dance",label:"Танцую",emoji:"🕺",transform:"dance"},
  {id:"shock",label:"В шоке",emoji:"😱",transform:"shock"},
  {id:"sleep",label:"Устал",emoji:"😴",transform:"sleep"}
];
var ITEMS = [
  {id:"sunglasses",label:"Очки-вайб",emoji:"🕶️"},{id:"crown",label:"Корона",emoji:"👑"},
  {id:"pizza",label:"Пицца",emoji:"🍕"},{id:"banana",label:"Банан",emoji:"🍌"},
  {id:"money",label:"Деньги",emoji:"💸"},{id:"microphone",label:"Микрофон",emoji:"🎤"},
  {id:"cap",label:"Кепка",emoji:"🧢"},{id:"sparkles",label:"Блёстки",emoji:"✨"},
  {id:"sword",label:"Меч",emoji:"🗡️"},{id:"rubberduck",label:"Утка",emoji:"🦆"},
  {id:"hotdog",label:"Хот-дог",emoji:"🌭"},{id:"rocket",label:"Ракета",emoji:"🚀"},
  {id:"diamond",label:"Алмаз",emoji:"💎"},{id:"cactus",label:"Кактус",emoji:"🌵"},
  {id:"boom",label:"Бум",emoji:"💥"},{id:"heart",label:"Сердце",emoji:"💖"},
  {id:"socks",label:"Носки",emoji:"🧦"},{id:"trophy",label:"Кубок",emoji:"🏆"},
  {id:"cookie",label:"Печенька",emoji:"🍪"},{id:"megaphone",label:"Рупор",emoji:"📣"},
  {id:"rainbow",label:"Радуга",emoji:"🌈"},{id:"fire",label:"Огонёк",emoji:"🔥"},
  {id:"ghost",label:"Привидение",emoji:"👻"},{id:"cowboy",label:"Ковбой",emoji:"🤠"},
  {id:"unicorn",label:"Единорог",emoji:"🦄"},
  {id:"unicorn-hat",label:"Единорог-шапка",emoji:"🦄"},
  {id:"taco-glasses",label:"Тако-очки",emoji:"🌮"},
  {id:"donut-floatie",label:"Пончик-спасательный круг",emoji:"🍩"},
  {id:"cheese-head",label:"Сырная голова",emoji:"🧀"},
  {id:"pizza-shield",label:"Пицца-щит",emoji:"🍕"},
  {id:"shawarma-cape",label:"Шаурма-плащ",emoji:"🌯"},
  {id:"soda-helmet",label:"Газировка-шлем",emoji:"🥤"},
  {id:"burger-crown",label:"Бургер-корона",emoji:"🍔"},
  {id:"fries-earrings",label:"Фри-серьги",emoji:"🍟"},
  {id:"straw-mustache",label:"Соломинка-усы",emoji:"🥤"},
  {id:"cupcake-ears",label:"Кекс-уши",emoji:"🧁"},
  {id:"cookie-eyes",label:"Печенье-глаза",emoji:"🍪"},
  {id:"balloon-head",label:"Воздушный шар-голова",emoji:"🎈"},
  {id:"disco-ball-hat",label:"Диско-шар-шляпа",emoji:"🪩"},
  {id:"guitar-wings",label:"Гитара-крылья",emoji:"🎸"}
];
var SECRET_ITEMS = [
  {id:"toilet",label:"Трон",emoji:"🚽",secret:true},{id:"dinosaur",label:"Дино",emoji:"🦖",secret:true},
  {id:"satellite",label:"Спутник",emoji:"🛰️",secret:true},{id:"shark",label:"Акула",emoji:"🦈",secret:true},
  {id:"clown",label:"Клоун",emoji:"🤡",secret:true}
];
var EFFECTS = [
  {id:"glitch",label:"Глитч",emoji:"📺",className:"fx-glitch"},
  {id:"deepfried",label:"Прожарка",emoji:"🍟",className:"fx-deepfried"},
  {id:"zoom",label:"Зум",emoji:"🔍",className:"fx-zoom"},
  {id:"shake",label:"Тряска",emoji:"🫨",className:"fx-shake"},
  {id:"sad",label:"Грустная скрипка",emoji:"🎻",className:"fx-sad"},
  {id:"rainbow",label:"Радуга",emoji:"🌈",className:"fx-rainbow"}
];
var FAKE_COMMENTS = [
  ["@котлета_в_тапках","ЭТО СЛИШКОМ ЖИЗА 😂"],["@профессор_пельмень","А где купить такие очки?"],
  ["@alien_из_подъезда","я тоже так танцую на контрольной"],["@мама_сказала_нельзя","10/10, отправляю в семейный чат"],
  ["@капибара_онлайн","легендарный контент 💥"],["@бублик2000","повторил — теперь я звезда"]
];
var VIRAL_COMMENT_SETS = {
   low: ["Странно...", "Не понял", "Зачем?", "Кто это придумал?", "Смотрю второй раз и всё ещё не понял", "Ладно, это неожиданно"],
   medium: ["Неплохо 😂", "Жиза", "Повторю", "Вот это поворот", "Скинул другу, он тоже оценил", "Почему это так смешно?", "А продолжение будет?", "Ставлю лайк за наглость"],
   high: ["ГЕНИАЛЬНО 🔥", "Братан ты легенда", "В тренды!", "Это нужно закрепить", "Как вообще можно было такое придумать?", "Лента сегодня спасена", "Пересматриваю уже пятый раз", "Жду реакцию автора"]
};
var FAKE_USERNAMES = ["@котлета_в_тапках","@профессор_пельмень","@alien_из_подъезда","@мама_сказала_нельзя","@капибара_онлайн","@бублик2000","@сонный_хомяк","@дедлайн_горит"];