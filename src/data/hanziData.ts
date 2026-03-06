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

// ── 象形演化数据 ──────────────────────────────────────────────────────────────
export interface EvolutionStage {
  label: string;
  svg: string;
  desc: string;
}
export interface CharEvolution {
  oracle: EvolutionStage;
  bronze: EvolutionStage;
}

export const CHAR_EVOLUTION: Record<string, CharEvolution> = {
  山: {
    oracle: {
      label: "甲骨文", desc: "刻在龟壳上的三座山形",
      svg: `<path d="M6,36 L13,12 L20,36" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20,36 L28,20 L36,36" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13,30 L20,14 L27,30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="2,1" opacity="0.5"/>`,
    },
    bronze: {
      label: "金文", desc: "铸在青铜器上，更规整",
      svg: `<path d="M8,34 L14,14 L20,34" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20,34 L26,18 L32,34" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="8" y1="34" x2="32" y2="34" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>`,
    },
  },
  水: {
    oracle: {
      label: "甲骨文", desc: "像三道弯弯的水流",
      svg: `<path d="M20,5 Q17,12 20,20 Q23,28 20,36" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M12,10 Q9,18 12,28" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M28,10 Q31,18 28,28" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M15,8 L20,12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            <path d="M25,8 L20,12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    },
    bronze: {
      label: "金文", desc: "水流更清晰，有了波点",
      svg: `<path d="M20,5 L20,36" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M12,12 Q9,20 13,30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M28,12 Q31,20 27,30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            <circle cx="14" cy="8" r="2" fill="currentColor" opacity="0.6"/>
            <circle cx="26" cy="8" r="2" fill="currentColor" opacity="0.6"/>`,
    },
  },
  日: {
    oracle: {
      label: "甲骨文", desc: "圆圆的太阳，中间有光点",
      svg: `<circle cx="20" cy="20" r="13" stroke="currentColor" stroke-width="2.5" fill="none"/>
            <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.8"/>`,
    },
    bronze: {
      label: "金文", desc: "变成方形，光点变成横线",
      svg: `<rect x="8" y="8" width="24" height="24" rx="3" stroke="currentColor" stroke-width="2.5" fill="none"/>
            <line x1="8" y1="20" x2="32" y2="20" stroke="currentColor" stroke-width="2" opacity="0.7"/>`,
    },
  },
  木: {
    oracle: {
      label: "甲骨文", desc: "树干、树枝、树根的样子",
      svg: `<line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M10,16 Q15,13 20,15 Q25,13 30,16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M14,28 L20,36 L26,28" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    bronze: {
      label: "金文", desc: "树形更方正，根向两侧",
      svg: `<line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="8" y1="16" x2="32" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="12" y1="28" x2="20" y2="36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="28" y1="28" x2="20" y2="36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    },
  },
  火: {
    oracle: {
      label: "甲骨文", desc: "火焰跳动，迸出火星",
      svg: `<path d="M20,36 Q14,28 16,20 Q20,14 20,8 Q20,14 24,20 Q26,28 20,36" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="32" r="2" fill="currentColor" opacity="0.7"/>
            <circle cx="31" cy="32" r="2" fill="currentColor" opacity="0.7"/>`,
    },
    bronze: {
      label: "金文", desc: "火焰更规整，两点更明显",
      svg: `<path d="M20,34 Q15,26 17,18 Q20,12 20,6 Q20,12 23,18 Q25,26 20,34" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <line x1="12" y1="32" x2="16" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="28" y1="32" x2="24" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    },
  },
  月: {
    oracle: {
      label: "甲骨文", desc: "弯弯月牙，里面有点",
      svg: `<path d="M26,6 Q10,8 10,20 Q10,32 26,34 Q16,30 16,20 Q16,10 26,6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="13" cy="16" r="2" fill="currentColor" opacity="0.6"/>
            <circle cx="13" cy="24" r="2" fill="currentColor" opacity="0.6"/>`,
    },
    bronze: {
      label: "金文", desc: "月牙更方正，两横更清晰",
      svg: `<path d="M26,6 Q10,8 10,20 Q10,32 26,34 Q18,30 18,20 Q18,10 26,6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="16" x2="18" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="12" y1="24" x2="18" y2="24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    },
  },
  土: {
    oracle: {
      label: "甲骨文", desc: "土堆立在地面上",
      svg: `<ellipse cx="20" cy="14" rx="8" ry="7" stroke="currentColor" stroke-width="2" fill="none"/>
            <line x1="20" y1="21" x2="20" y2="30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="10" y1="34" x2="30" y2="34" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    bronze: {
      label: "金文", desc: "土堆变成短横，地面是长横",
      svg: `<line x1="14" y1="10" x2="26" y2="10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="20" y1="10" x2="20" y2="30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="8" y1="30" x2="32" y2="30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    },
  },
  手: {
    oracle: {
      label: "甲骨文", desc: "五根手指张开的手掌",
      svg: `<path d="M12,36 L12,18 M16,36 L16,12 M20,36 L20,10 M24,36 L24,14 M28,36 L28,20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M11,20 Q20,16 29,22" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    },
    bronze: {
      label: "金文", desc: "手指归纳成三横，加手腕",
      svg: `<line x1="8" y1="12" x2="32" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="8" y1="20" x2="32" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="8" y1="28" x2="32" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="20" y1="28" x2="20" y2="36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    },
  },
  人: {
    oracle: {
      label: "甲骨文", desc: "侧身站立、弯腰的人形",
      svg: `<circle cx="22" cy="5" r="3" fill="currentColor" opacity="0.7"/>
            <path d="M22,8 Q18,16 14,28" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M22,8 Q26,20 30,34" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    },
    bronze: {
      label: "金文", desc: "两腿撑地，变成撇和捺",
      svg: `<path d="M20,6 L10,34" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M20,6 L30,34" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="20" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"/>`,
    },
  },
  一: {
    oracle: {
      label: "甲骨文", desc: "一道刻痕代表数字一",
      svg: `<path d="M8,22 Q20,18 32,22" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    },
    bronze: {
      label: "金文", desc: "一横更加平直规整",
      svg: `<line x1="8" y1="20" x2="32" y2="20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
    },
  },
  口: {
    oracle: {
      label: "甲骨文", desc: "张开的嘴巴形状",
      svg: `<path d="M10,12 Q20,8 30,12 L32,30 Q20,34 8,30 Z" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    bronze: {
      label: "金文", desc: "变成规整的方框",
      svg: `<rect x="10" y="10" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/>`,
    },
  },
};

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
