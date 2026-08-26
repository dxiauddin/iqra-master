// apps/web/lib/skala1-curriculum.ts

export interface HarfCard {
  id: number;
  arabic: string;
  name: string;
}

export const skala1Alphabet: HarfCard[] = [
  { id: 1, arabic: 'أ', name: 'Alif' },
  { id: 2, arabic: 'ب', name: 'Ba' },
  { id: 3, arabic: 'ت', name: 'Ta' },
  { id: 4, arabic: 'ث', name: 'Tha' },
  { id: 5, arabic: 'ج', name: 'Jim' },
  { id: 6, arabic: 'ح', name: 'Hha' },
  { id: 7, arabic: 'خ', name: 'Kho' },
  { id: 8, arabic: 'د', name: 'Dal' },
  { id: 9, arabic: 'ذ', name: 'Dzal' },
  { id: 10, arabic: 'ر', name: 'Ro' },
  { id: 11, arabic: 'ز', name: 'Zai' },
  { id: 12, arabic: 'س', name: 'Sin' },
  { id: 13, arabic: 'ش', name: 'Shin' },
  { id: 14, arabic: 'ص', name: 'Sod' },
  { id: 15, arabic: 'ض', name: 'Dhod' },
  { id: 16, arabic: 'ط', name: 'Tho' },
  { id: 17, arabic: 'ظ', name: 'Zho' },
  { id: 18, arabic: 'ع', name: 'Ain' },
  { id: 19, arabic: 'غ', name: 'Ghain' },
  { id: 20, arabic: 'ف', name: 'Fa' },
  { id: 21, arabic: 'ق', name: 'Qof' },
  { id: 22, arabic: 'ك', name: 'Kaf' },
  { id: 23, arabic: 'ل', name: 'Lam' },
  { id: 24, arabic: 'م', name: 'Mim' },
  { id: 25, arabic: 'ن', name: 'Nun' },
  { id: 26, arabic: 'و', name: 'Wau' },
  { id: 27, arabic: 'هـ', name: 'Ha' },
  { id: 28, arabic: '\uFEFB', name: 'Lam-Alif' },
  { id: 29, arabic: 'ء', name: 'Hamzah' },
  { id: 30, arabic: 'ي', name: 'Ya' },
];

export function generateBarisForms(letters: HarfCard[]): HarfCard[] {
  let idCounter = 1;
  const result: HarfCard[] = [];
  letters.forEach((l) => {
    if (l.name === 'Alif') {
      result.push({ id: idCounter++, arabic: 'أَ', name: 'Alif (A)' });
      result.push({ id: idCounter++, arabic: 'إِ', name: 'Alif (I)' });
      result.push({ id: idCounter++, arabic: 'أُ', name: 'Alif (U)' });
    } else if (l.name === 'Ha' && l.arabic === 'هـ') {
      result.push({ id: idCounter++, arabic: 'هَـ', name: `${l.name} (A)` });
      result.push({ id: idCounter++, arabic: 'هِـ', name: `${l.name} (I)` });
      result.push({ id: idCounter++, arabic: 'هُـ', name: `${l.name} (U)` });
    } else {
      const base = l.arabic === '\uFEFB' ? '\uFEFB' : l.arabic.replace('أ', 'ا');
      result.push({ id: idCounter++, arabic: `${base}َ`, name: `${l.name} (A)` });
      result.push({ id: idCounter++, arabic: `${base}ِ`, name: `${l.name} (I)` });
      result.push({ id: idCounter++, arabic: `${base}ُ`, name: `${l.name} (U)` });
    }
  });
  return result;
}

const nonLamAlifAlphabet = skala1Alphabet.filter((_, idx) => idx !== 27);
export const allBarisForms = generateBarisForms(nonLamAlifAlphabet);

export function getSkala1IntensiveForms(mod: number): HarfCard[] {
  let rawSubset: HarfCard[] = [];
  switch (mod) {
    case 2:
      rawSubset = [skala1Alphabet[0], skala1Alphabet[1], skala1Alphabet[2], skala1Alphabet[3]];
      break;
    case 3:
      rawSubset = [skala1Alphabet[4], skala1Alphabet[5], skala1Alphabet[6]];
      break;
    case 4:
      rawSubset = [skala1Alphabet[7], skala1Alphabet[8], skala1Alphabet[9], skala1Alphabet[10]];
      break;
    case 5:
      rawSubset = [skala1Alphabet[11], skala1Alphabet[12], skala1Alphabet[13], skala1Alphabet[14], skala1Alphabet[15], skala1Alphabet[16]];
      break;
    case 6:
      rawSubset = [skala1Alphabet[17], skala1Alphabet[18], skala1Alphabet[19], skala1Alphabet[20]];
      break;
    case 7:
      rawSubset = [skala1Alphabet[21], skala1Alphabet[22], skala1Alphabet[23], skala1Alphabet[24]];
      break;
    case 8:
      rawSubset = [
        skala1Alphabet[25], 
        skala1Alphabet[26], 
        skala1Alphabet[28], 
        skala1Alphabet[29]
      ];
      break;
    default:
      rawSubset = [skala1Alphabet[0], skala1Alphabet[1]];
  }
  return generateBarisForms(rawSubset);
}

export function getSkala1PriorForms(mod: number): HarfCard[] {
  let limitIndex = 4;
  switch (mod) {
    case 3: limitIndex = 4; break;
    case 4: limitIndex = 7; break;
    case 5: limitIndex = 11; break;
    case 6: limitIndex = 17; break;
    case 7: limitIndex = 21; break;
    case 8: limitIndex = 25; break;
    default: limitIndex = 4;
  }
  const priorSubset = skala1Alphabet.slice(0, limitIndex).filter((_, idx) => idx !== 27);
  return generateBarisForms(priorSubset);
}