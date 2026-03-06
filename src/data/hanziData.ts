export interface StrokeData {
  id: number;
  label: string;
  path: string;
  color: string;
}

export interface HanziData {
  char: string;
  pinyin: string;
  tone: string;
  meaning: string;
  imageEmoji: string;
  imageDesc: string;
  mnemonic: string;
  strokeCount: number;
  difficulty: 1 | 2 | 3; // 1=简单(1-2笔), 2=中等(3-4笔), 3=较难(5笔+)
  strokes: StrokeData[];
}

export const HANZI_LIST: HanziData[] = [
  // ——— 难度1：1-2笔 ———
  {
    char: "一",
    pinyin: "yī",
    tone: "一声",
    meaning: "数字一，最小的正整数，也表示唯一",
    imageEmoji: "➖",
    imageDesc: "一条平平的横线，像地平线",
    mnemonic: "一横到底，简单又直",
    strokeCount: 1,
    difficulty: 1,
    strokes: [
      { id: 1, label: "第一笔：横", path: "M 50 90 L 150 90", color: "hsl(var(--sky))" },
    ],
  },
  {
    char: "人",
    pinyin: "rén",
    tone: "二声",
    meaning: "人类，有思想和语言的高级动物",
    imageEmoji: "🚶",
    imageDesc: "一撇一捺，像一个人张开双腿站立",
    mnemonic: "撇捺相交，顶天立地一个人",
    strokeCount: 2,
    difficulty: 1,
    strokes: [
      { id: 1, label: "第一笔：撇", path: "M 100 30 L 60 130", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：捺", path: "M 100 30 L 145 130", color: "hsl(var(--coral))" },
    ],
  },
  {
    char: "口",
    pinyin: "kǒu",
    tone: "三声",
    meaning: "嘴巴，也表示开口说话",
    imageEmoji: "👄",
    imageDesc: "一个方形的框，像张开的嘴巴",
    mnemonic: "四方形框，张口说话",
    strokeCount: 3,
    difficulty: 1,
    strokes: [
      { id: 1, label: "第一笔：竖", path: "M 65 50 L 65 130", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：横折", path: "M 65 50 L 135 50 L 135 130", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：横", path: "M 65 130 L 135 130", color: "hsl(var(--mint))" },
    ],
  },
  // ——— 难度2：3-4笔 ———
  {
    char: "山",
    pinyin: "shān",
    tone: "一声",
    meaning: "山峰、山脉，大地上高耸的自然地形",
    imageEmoji: "⛰️",
    imageDesc: "高高的山峰，像三座竖立的石柱",
    mnemonic: "三座山峰并排站，中间最高两边矮",
    strokeCount: 3,
    difficulty: 2,
    strokes: [
      { id: 1, label: "第一笔：竖", path: "M 100 40 L 100 140", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：竖折横", path: "M 60 70 L 60 140 L 95 140", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：竖", path: "M 140 70 L 140 140", color: "hsl(var(--mint))" },
    ],
  },
  {
    char: "日",
    pinyin: "rì",
    tone: "四声",
    meaning: "太阳，也表示一天的时间",
    imageEmoji: "☀️",
    imageDesc: "一个方框中间有一横，像太阳的样子",
    mnemonic: "圆圆的太阳，中间一横代表光芒",
    strokeCount: 4,
    difficulty: 2,
    strokes: [
      { id: 1, label: "第一笔：竖", path: "M 65 40 L 65 140", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：横折", path: "M 65 40 L 135 40 L 135 140", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：横", path: "M 65 90 L 135 90", color: "hsl(var(--mint))" },
      { id: 4, label: "第四笔：横", path: "M 65 140 L 135 140", color: "hsl(var(--lavender))" },
    ],
  },
  {
    char: "月",
    pinyin: "yuè",
    tone: "四声",
    meaning: "月亮，也表示月份",
    imageEmoji: "🌙",
    imageDesc: "像月牙形状，右边没有封口",
    mnemonic: "弯弯月亮，两条横线是月光",
    strokeCount: 4,
    difficulty: 2,
    strokes: [
      { id: 1, label: "第一笔：撇", path: "M 80 40 L 65 140", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：横折钩", path: "M 80 40 L 135 40 L 135 140", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：横", path: "M 70 80 L 130 80", color: "hsl(var(--mint))" },
      { id: 4, label: "第四笔：横", path: "M 70 110 L 130 110", color: "hsl(var(--lavender))" },
    ],
  },
  {
    char: "木",
    pinyin: "mù",
    tone: "四声",
    meaning: "树木，植物的主干部分",
    imageEmoji: "🌳",
    imageDesc: "上面一横像树枝，下面一竖像树干，两撇像树根",
    mnemonic: "一横一竖像树干，下面两根要扎稳",
    strokeCount: 4,
    difficulty: 2,
    strokes: [
      { id: 1, label: "第一笔：横", path: "M 55 70 L 145 70", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：竖", path: "M 100 40 L 100 140", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：撇", path: "M 100 100 L 60 140", color: "hsl(var(--mint))" },
      { id: 4, label: "第四笔：捺", path: "M 100 100 L 145 140", color: "hsl(var(--lavender))" },
    ],
  },
  // ——— 难度3：5笔以上 ———
  {
    char: "水",
    pinyin: "shuǐ",
    tone: "三声",
    meaning: "水，液态的H₂O，生命之源",
    imageEmoji: "💧",
    imageDesc: "像河流流动，中间一竖两边各有波浪",
    mnemonic: "一竖四点，像河水流淌",
    strokeCount: 4,
    difficulty: 2,
    strokes: [
      { id: 1, label: "第一笔：竖钩", path: "M 100 35 L 100 130", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：横撇", path: "M 100 75 L 60 110", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：点", path: "M 55 80 L 50 95", color: "hsl(var(--mint))" },
      { id: 4, label: "第四笔：撇点", path: "M 115 75 L 145 125", color: "hsl(var(--lavender))" },
    ],
  },
  {
    char: "火",
    pinyin: "huǒ",
    tone: "三声",
    meaning: "火焰，燃烧产生的光和热",
    imageEmoji: "🔥",
    imageDesc: "像跳动的火焰，两边有小火苗",
    mnemonic: "两点夹中间，火焰往上窜",
    strokeCount: 4,
    difficulty: 2,
    strokes: [
      { id: 1, label: "第一笔：点", path: "M 80 50 L 75 70", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：撇", path: "M 95 45 L 65 135", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：捺", path: "M 105 45 L 140 135", color: "hsl(var(--mint))" },
      { id: 4, label: "第四笔：点", path: "M 120 50 L 128 70", color: "hsl(var(--lavender))" },
    ],
  },
  {
    char: "土",
    pinyin: "tǔ",
    tone: "三声",
    meaning: "泥土、土地，植物生长的地方",
    imageEmoji: "🌱",
    imageDesc: "上面一短横，中间一竖，下面一长横，像土地的剖面",
    mnemonic: "短横竖长横，大地厚又宽",
    strokeCount: 3,
    difficulty: 2,
    strokes: [
      { id: 1, label: "第一笔：横", path: "M 75 60 L 125 60", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：竖", path: "M 100 60 L 100 130", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：横", path: "M 50 130 L 150 130", color: "hsl(var(--mint))" },
    ],
  },
  {
    char: "手",
    pinyin: "shǒu",
    tone: "三声",
    meaning: "手，人体上肢的末端，用来抓握和劳动",
    imageEmoji: "✋",
    imageDesc: "像张开的手掌，三横像三根手指",
    mnemonic: "三横一竖加一撇，五个手指记心间",
    strokeCount: 4,
    difficulty: 3,
    strokes: [
      { id: 1, label: "第一笔：横", path: "M 65 50 L 135 50", color: "hsl(var(--sky))" },
      { id: 2, label: "第二笔：横", path: "M 60 80 L 140 80", color: "hsl(var(--coral))" },
      { id: 3, label: "第三笔：横", path: "M 60 110 L 140 110", color: "hsl(var(--mint))" },
      { id: 4, label: "第四笔：弯钩", path: "M 100 45 L 100 110 Q 100 140 80 150", color: "hsl(var(--lavender))" },
    ],
  },
];

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "入门",
  2: "基础",
  3: "进阶",
};

export const DIFFICULTY_COLORS: Record<number, string> = {
  1: "hsl(var(--mint))",
  2: "hsl(var(--sky))",
  3: "hsl(var(--coral))",
};
