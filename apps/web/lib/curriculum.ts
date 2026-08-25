// apps/web/lib/curriculum.ts

export interface HarfCard {
  id: number;
  arabic: string;
  name: string;
}

// 1. Base Hijaiyah Alphabet (Lam Alif at 28, Hamzah at 29, Ya at 30)
export const baseAlphabet: HarfCard[] = [
  { id: 1, arabic: 'أ', name: 'Alif' },
  { id: 2, arabic: 'ب', name: 'Ba' },
  { id: 3, arabic: 'ت', name: 'Ta' },
  { id: 4, arabic: 'ث', name: 'Tha' },
  { id: 5, arabic: 'ج', name: 'Jim' },
  { id: 6, arabic: 'ح', name: 'Ha' },
  { id: 7, arabic: 'خ', name: 'Kha' },
  { id: 8, arabic: 'د', name: 'Dal' },
  { id: 9, arabic: 'ذ', name: 'Dhal' },
  { id: 10, arabic: 'ر', name: 'Ra' },
  { id: 11, arabic: 'ز', name: 'Zai' },
  { id: 12, arabic: 'س', name: 'Sin' },
  { id: 13, arabic: 'ش', name: 'Shin' },
  { id: 14, arabic: 'ص', name: 'Sad' },
  { id: 15, arabic: 'ض', name: 'Dhad' },
  { id: 16, arabic: 'ط', name: 'Ta' },
  { id: 17, arabic: 'ظ', name: 'Zha' },
  { id: 18, arabic: 'ع', name: 'Ain' },
  { id: 19, arabic: 'غ', name: 'Ghain' },
  { id: 20, arabic: 'ف', name: 'Fa' },
  { id: 21, arabic: 'ق', name: 'Qaf' },
  { id: 22, arabic: 'ك', name: 'Kaf' },
  { id: 23, arabic: 'ل', name: 'Lam' },
  { id: 24, arabic: 'م', name: 'Mim' },
  { id: 25, arabic: 'ن', name: 'Nun' },
  { id: 26, arabic: 'و', name: 'Wau' },
  { id: 27, arabic: 'هـ', name: 'Ha' },
  { id: 28, arabic: 'لا', name: 'Lam Alif' },
  { id: 29, arabic: 'ء', name: 'Hamzah' },
  { id: 30, arabic: 'ي', name: 'Ya' },
];

// Helper to generate basic baris (A, I, U)
export function generateBarisForms(letters: HarfCard[]): HarfCard[] {
  let idCounter = 1;
  const result: HarfCard[] = [];
  letters.forEach((l) => {
    const base = l.arabic.replace('هـ', 'ه').replace('أ', 'ا');
    result.push({ id: idCounter++, arabic: `${base}َ`, name: `${l.name} (A)` });
    result.push({ id: idCounter++, arabic: `${base}ِ`, name: `${l.name} (I)` });
    result.push({ id: idCounter++, arabic: `${base}ُ`, name: `${l.name} (U)` });
  });
  return result;
}

// Get Intensive Harf subset for Skala 1 modules (2 to 8)
export function getSkala1IntensiveForms(modNum: number): HarfCard[] {
  let rawSubset: HarfCard[] = [];
  switch (modNum) {
    case 2: // Alif, Ba, Ta, Tha
      rawSubset = [baseAlphabet[0], baseAlphabet[1], baseAlphabet[2], baseAlphabet[3]];
      break;
    case 3: // Jim, Ha, Kha
      rawSubset = [baseAlphabet[4], baseAlphabet[5], baseAlphabet[6]];
      break;
    case 4: // Dal, Dhal, Ra, Zai
      rawSubset = [baseAlphabet[7], baseAlphabet[8], baseAlphabet[9], baseAlphabet[10]];
      break;
    case 5: // Sin, Shin, Sad, Dhad, Ta, Zha
      rawSubset = [baseAlphabet[11], baseAlphabet[12], baseAlphabet[13], baseAlphabet[14], baseAlphabet[15], baseAlphabet[16]];
      break;
    case 6: // Ain, Ghain, Fa, Qaf
      rawSubset = [baseAlphabet[17], baseAlphabet[18], baseAlphabet[19], baseAlphabet[20]];
      break;
    case 7: // Kaf, Lam, Mim, Nun
      rawSubset = [baseAlphabet[21], baseAlphabet[22], baseAlphabet[23], baseAlphabet[24]];
      break;
    case 8: // Wau, Ha, Lam Alif, Hamzah, Ya (Indices 25 through 29)
      rawSubset = [baseAlphabet[25], baseAlphabet[26], baseAlphabet[27], baseAlphabet[28], baseAlphabet[29]];
      break;
    default:
      rawSubset = [baseAlphabet[0], baseAlphabet[1]];
  }
  return generateBarisForms(rawSubset);
}

// Get Cumulative Prior Harfs up to previous module
export function getSkala1PriorForms(modNum: number): HarfCard[] {
  let limitIndex = 4;
  switch (modNum) {
    case 3: limitIndex = 4; break;
    case 4: limitIndex = 7; break;
    case 5: limitIndex = 11; break;
    case 6: limitIndex = 17; break;
    case 7: limitIndex = 21; break;
    case 8: limitIndex = 25; break;
    default: limitIndex = 4;
  }
  return generateBarisForms(baseAlphabet.slice(0, limitIndex));
}