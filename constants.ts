import { GameConfig, QuizItem } from './types';

export const TOTAL_QUESTIONS = 20;

export const GAME_MODES: GameConfig[] = [
  {
    id: 'uan-uang',
    name: '前鼻音 vs 后鼻音 (uan / uang)',
    description: '小船 (chuan) 還是 窗戶 (chuang)？',
    pairs: ['uan', 'uang'],
    color: 'bg-candy-blue'
  },
  {
    id: 'in-ing',
    name: '前鼻音 vs 后鼻音 (in / ing)',
    description: '音樂 (yin) 還是 老鷹 (ying)？',
    pairs: ['in', 'ing'],
    color: 'bg-candy-pink'
  },
  {
    id: 'ong-iong',
    name: '韻母大挑戰 (ong / iong)',
    description: '紅燈 (hong) 還是 熊貓 (xiong)？',
    pairs: ['ong', 'iong'],
    color: 'bg-candy-purple'
  }
];

export const STATIC_QUESTIONS: Record<string, QuizItem[]> = {
  'uan-uang': [
    { character: '船', pinyin: 'chuán', initial: 'ch', definition: 'Boat 🛶', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '床', pinyin: 'chuáng', initial: 'ch', definition: 'Bed 🛏️', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '關', pinyin: 'guān', initial: 'g', definition: 'Close 🚪', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '光', pinyin: 'guāng', initial: 'g', definition: 'Light 💡', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '碗', pinyin: 'wǎn', initial: 'w', definition: 'Bowl 🥣', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '網', pinyin: 'wǎng', initial: 'w', definition: 'Net 🕸️', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '換', pinyin: 'huàn', initial: 'h', definition: 'Change 🔄', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '黃', pinyin: 'huáng', initial: 'h', definition: 'Yellow 🟡', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '玩', pinyin: 'wán', initial: 'w', definition: 'Play 🪀', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '王', pinyin: 'wáng', initial: 'w', definition: 'King 👑', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '團', pinyin: 'tuán', initial: 't', definition: 'Group 👥', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '窗', pinyin: 'chuāng', initial: 'ch', definition: 'Window 🪟', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '穿', pinyin: 'chuān', initial: 'ch', definition: 'Wear 👕', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '雙', pinyin: 'shuāng', initial: 'sh', definition: 'Pair 👯', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '短', pinyin: 'duǎn', initial: 'd', definition: 'Short 📏', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '筐', pinyin: 'kuāng', initial: 'k', definition: 'Basket 🧺', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '暖', pinyin: 'nuǎn', initial: 'n', definition: 'Warm ☀️', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '逛', pinyin: 'guàng', initial: 'g', definition: 'Stroll 🚶', correctFinal: 'uang', options: ['uan', 'uang'] },
    { character: '蒜', pinyin: 'suàn', initial: 's', definition: 'Garlic 🧄', correctFinal: 'uan', options: ['uan', 'uang'] },
    { character: '霜', pinyin: 'shuāng', initial: 'sh', definition: 'Frost ❄️', correctFinal: 'uang', options: ['uan', 'uang'] }
  ],
  'in-ing': [
    { character: '音', pinyin: 'yīn', initial: 'y', definition: 'Sound 🔊', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '英', pinyin: 'yīng', initial: 'y', definition: 'Hero/English 🦸', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '心', pinyin: 'xīn', initial: 'x', definition: 'Heart ❤️', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '星', pinyin: 'xīng', initial: 'x', definition: 'Star ⭐', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '金', pinyin: 'jīn', initial: 'j', definition: 'Gold 🥇', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '睛', pinyin: 'jīng', initial: 'j', definition: 'Eye 👁️', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '林', pinyin: 'lín', initial: 'l', definition: 'Forest 🌲', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '零', pinyin: 'líng', initial: 'l', definition: 'Zero 0️⃣', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '親', pinyin: 'qīn', initial: 'q', definition: 'Dear/Kiss 😽', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '青', pinyin: 'qīng', initial: 'q', definition: 'Green 🟢', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '近', pinyin: 'jìn', initial: 'j', definition: 'Near 📍', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '鏡', pinyin: 'jìng', initial: 'j', definition: 'Mirror 🪞', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '信', pinyin: 'xìn', initial: 'x', definition: 'Letter ✉️', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '杏', pinyin: 'xìng', initial: 'x', definition: 'Apricot 🍑', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '陰', pinyin: 'yīn', initial: 'y', definition: 'Cloudy ☁️', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '鷹', pinyin: 'yīng', initial: 'y', definition: 'Eagle 🦅', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '拼', pinyin: 'pīn', initial: 'p', definition: 'Spell/Piece 🧩', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '瓶', pinyin: 'píng', initial: 'p', definition: 'Bottle 🍼', correctFinal: 'ing', options: ['in', 'ing'] },
    { character: '琴', pinyin: 'qín', initial: 'q', definition: 'Piano 🎹', correctFinal: 'in', options: ['in', 'ing'] },
    { character: '停', pinyin: 'tíng', initial: 't', definition: 'Stop 🛑', correctFinal: 'ing', options: ['in', 'ing'] }
  ],
  'ong-iong': [
    { character: '紅', pinyin: 'hóng', initial: 'h', definition: 'Red 🔴', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '熊', pinyin: 'xióng', initial: 'x', definition: 'Bear 🐻', correctFinal: 'iong', options: ['ong', 'iong'] },
    { character: '龍', pinyin: 'lóng', initial: 'l', definition: 'Dragon 🐉', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '兄', pinyin: 'xiōng', initial: 'x', definition: 'Brother 👦', correctFinal: 'iong', options: ['ong', 'iong'] },
    { character: '蟲', pinyin: 'chóng', initial: 'ch', definition: 'Insect 🐛', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '窮', pinyin: 'qióng', initial: 'q', definition: 'Poor 💸', correctFinal: 'iong', options: ['ong', 'iong'] },
    { character: '工', pinyin: 'gōng', initial: 'g', definition: 'Work 👷', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '胸', pinyin: 'xiōng', initial: 'x', definition: 'Chest 🧍', correctFinal: 'iong', options: ['ong', 'iong'] },
    { character: '東', pinyin: 'dōng', initial: 'd', definition: 'East 🧭', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '凶', pinyin: 'xiōng', initial: 'x', definition: 'Fierce 🐯', correctFinal: 'iong', options: ['ong', 'iong'] },
    { character: '松', pinyin: 'sōng', initial: 's', definition: 'Pine Tree 🌲', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '雄', pinyin: 'xióng', initial: 'x', definition: 'Hero/Male 🦸‍♂️', correctFinal: 'iong', options: ['ong', 'iong'] },
    { character: '空', pinyin: 'kōng', initial: 'k', definition: 'Empty 📦', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '擁', pinyin: 'yōng', initial: 'y', definition: 'Embrace 🫂', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '動', pinyin: 'dòng', initial: 'd', definition: 'Move 🏃', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '炯', pinyin: 'jiǒng', initial: 'j', definition: 'Bright ✨', correctFinal: 'iong', options: ['ong', 'iong'] },
    { character: '桶', pinyin: 'tǒng', initial: 't', definition: 'Bucket 🪣', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '中', pinyin: 'zhōng', initial: 'zh', definition: 'Middle 🎯', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '恐', pinyin: 'kǒng', initial: 'k', definition: 'Fear 😱', correctFinal: 'ong', options: ['ong', 'iong'] },
    { character: '送', pinyin: 'sòng', initial: 's', definition: 'Deliver 🎁', correctFinal: 'ong', options: ['ong', 'iong'] }
  ]
};
