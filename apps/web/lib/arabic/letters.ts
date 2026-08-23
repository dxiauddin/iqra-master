export interface ArabicLetter {
  name: string;
  arabic: string;
  transliteration: string;
}

export const BASE_LETTERS: ArabicLetter[] = [
  { name: 'Alif', arabic: 'أ', transliteration: 'A' },
  { name: 'Ba', arabic: 'ب', transliteration: 'Ba' },
  { name: 'Ta', arabic: 'ت', transliteration: 'Ta' },
  // ... add remaining letters
];

export const POSITIONS = ['initial', 'medial', 'final'] as const;