// apps/web/lib/skala2-curriculum.ts

export interface HarfCard {
  id: number;
  arabic: string;
  name: string;
}

export const skala2Alphabet: HarfCard[] = [
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

const quranicPureVowelPool: Record<string, string[]> = {
  'أ': ['أَكَلَ', 'أَمَرَ', 'أَحَدٌ', 'أَخَذَ', 'أَثِمَ', 'أَمَراً', 'أَحَدٍ', 'أَكُلاً'],
  'ب': ['بَسَطَ', 'بَرَكَ', 'بَعَثَ', 'بَصَرٌ', 'بَلَغَ', 'بَرِئَ', 'بَحَرَ', 'بَدَلٌ'],
  'ت': ['تَبِعَ', 'تَرَكَ', 'تَلَاَ', 'تَوَبَ', 'تَبَابٌ', 'تَمِرٌ'],
  'ث': ['ثَبَتَ', 'ثَقُلَ', 'ثَمَرَ', 'ثَبْتٌ', 'ثَمَرٌ'],
  'ج': ['جَعَلَ', 'جَمَعَ', 'جَبَلٌ', 'جَزَاَ', 'جَحَدَ', 'جَعَلٌ'],
  'ح': ['حَمَلَ', 'حَسِبَ', 'حَكَمَ', 'حَفِظَ', 'حَسَنٌ', 'حَرَمٌ'],
  'خ': ['خَلَقَ', 'خَرَجَ', 'خَتَمَ', 'خَشِيَ', 'خَبَرٌ', 'خَلَفٌ'],
  'د': ['دَخَلَ', 'دَعَاَ', 'دَرَىَ', 'دَفَعَ', 'دَحَرَ', 'دَرَنٌ'],
  'ذ': ['ذَهَبَ', 'ذَكَرَ', 'ذَبَحَ', 'ذَرَأَ', 'ذَكَرٌ'],
  'ر': ['رَزَقَ', 'رَفَعَ', 'رَحِمَ', 'رَكَبَ', 'رَجُلٌ', 'رَسَمَ'],
  'ز': ['زَرَعَ', 'زَجَرَ', 'زَقَرَ', 'زَمَنٌ'],
  'س': ['سَمِعَ', 'سَجَدَ', 'سَأَلَ', 'سَبَحَ', 'سَلِمَ', 'سَحَرَ'],
  'ش': ['شَهِدَ', 'شَكَرَ', 'شَرِبَ', 'شَفَعَ', 'شَجَرٌ', 'شَرِبٌ'],
  'ص': ['صَبَرَ', 'صَدَقَ', 'صَنَعَ', 'صَرَفَ', 'صَفَحَ', 'صَحُبَ'],
  'ض': ['ضَرَبَ', 'ضَلَّكَ', 'ضَحِكَ', 'ضَمِنَ', 'ضَرَرٌ'],
  'ط': ['طَبَعَ', 'طَلَبَ', 'طَرَقَ', 'طَهِرَ', 'طَبَقٌ'],
  'ظ': ['ظَلَمَ', 'ظَهَرَ', 'ظَنَّكَ', 'ظَفِرَ', 'ظُلْمٌ'],
  'ع': ['عَبَدَ', 'عَلِمَ', 'عَمِلَ', 'عَفَاَ', 'عَدَلَ', 'عَجِبَ'],
  'غ': ['غَفَرَ', 'غَلَبَ', 'غَضِبَ', 'غَمَرَ', 'غَلَقٌ'],
  'ف': ['فَعَلَ', 'فَتَحَ', 'فَرِحَ', 'فَهِمَ', 'فَطَرَ', 'فَحَصَ'],
  'ق': ['قَتَلَ', 'قَرَأَ', 'قَدَرَ', 'قَطَعَ', 'قَبِلَ', 'قَمَرٌ'],
  'ك': ['كَفَرَ', 'كَتَبَ', 'كَسَبَ', 'كَذَبَ', 'كَبُرَ', 'كَرِمَ'],
  'ل': ['لَعَبَ', 'لَقِيَ', 'لَحِقَ', 'لَبِسَ', 'لَحَمَ', 'لَبَنٌ'],
  'م': ['مَلَكَ', 'مَكَرَ', 'مَدَحَ', 'مَنَعَ', 'مَرَضٌ', 'مَسَحَ'],
  'ن': ['نَظَرَ', 'نَصَرَ', 'نَفَعَ', 'نَحَرَ', 'نَجَحَ', 'نَدِمَ'],
  'و': ['وَجَدَ', 'وَضَعَ', 'وَعَدَ', 'وَصَلَ', 'وَقَفَ', 'وَلَدَ'],
  'هـ': ['هَدَىَ', 'هَلَكَ', 'هَزَمَ', 'هَجَرَ', 'هَبَطَ', 'هَفَاَ'],
  'ء': ['أَمَرَ', 'أَخَذَ', 'أَبَىَ', 'أَثِرَ', 'أَسِفَ'],
  'ي': ['يَسِرَ', 'يَفَعَ', 'يَبِسَ', 'يَمَنَ', 'يَقِظَ', 'يَسَرَ']
};

export function generateTanwinForms(letters: HarfCard[]): HarfCard[] {
  let idCounter = 1;
  const result: HarfCard[] = [];
  letters.forEach((l) => {
    if (l.name === 'Alif') {
      result.push({ id: idCounter++, arabic: 'أً', name: 'Alif (An)' });
      result.push({ id: idCounter++, arabic: 'إٍ', name: 'Alif (In)' });
      result.push({ id: idCounter++, arabic: 'أٌ', name: 'Alif (Un)' });
    } else if (l.name === 'Ha') {
      result.push({ id: idCounter++, arabic: 'هًـ', name: `${l.name} (An)` });
      result.push({ id: idCounter++, arabic: 'هٍـ', name: `${l.name} (In)` });
      result.push({ id: idCounter++, arabic: 'هٌـ', name: `${l.name} (Un)` });
    } else {
      const base = l.arabic === '\uFEFB' ? '\uFEFB' : l.arabic.replace('أ', 'ا');
      result.push({ id: idCounter++, arabic: `${base}ً`, name: `${l.name} (An)` });
      result.push({ id: idCounter++, arabic: `${base}ٍ`, name: `${l.name} (In)` });
      result.push({ id: idCounter++, arabic: `${base}ٌ`, name: `${l.name} (Un)` });
    }
  });
  return result;
}

export function generateSkala2BarisForms(letters: HarfCard[]): HarfCard[] {
  let idCounter = 1;
  const result: HarfCard[] = [];
  letters.forEach((l) => {
    if (l.name === 'Alif') {
      result.push({ id: idCounter++, arabic: 'أَ', name: 'Alif (A)' });
      result.push({ id: idCounter++, arabic: 'إِ', name: 'Alif (I)' });
      result.push({ id: idCounter++, arabic: 'أُ', name: 'Alif (U)' });
    } else {
      const base = l.arabic;
      result.push({ id: idCounter++, arabic: `${base}َ`, name: `${l.name} (A)` });
      result.push({ id: idCounter++, arabic: `${base}ِ`, name: `${l.name} (I)` });
      result.push({ id: idCounter++, arabic: `${base}ُ`, name: `${l.name} (U)` });
    }
  });
  return result;
}

export function generateQuranicPureForms(letters: HarfCard[]): HarfCard[] {
  let idCounter = 1;
  const result: HarfCard[] = [];

  letters.forEach((item) => {
    const words = quranicPureVowelPool[item.arabic] || [item.arabic + 'َ' + item.arabic + 'َ' + item.arabic + 'َ'];
    words.forEach((w) => {
      result.push({
        id: idCounter++,
        arabic: w,
        name: `${item.name} (Quran)`,
      });
    });
  });

  const fullList = [...result];
  while (fullList.length < 60) {
    const item = result[fullList.length % result.length];
    fullList.push({ ...item, id: idCounter++ });
  }

  return fullList.slice(0, 60).map((item, idx) => ({ ...item, id: idx + 1 }));
}

function getModuleSubset(mod: number): HarfCard[] {
  switch (mod) {
    case 1: return skala2Alphabet.slice(0, 7);
    case 2: return skala2Alphabet.slice(7, 17);
    case 3: return skala2Alphabet.slice(17, 30).filter((item) => item.arabic !== '\uFEFB');
    case 4: return skala2Alphabet.slice(0, 4);       // Alif to Tha
    case 5: return skala2Alphabet.slice(4, 11);      // Jim to Zai
    case 6: return skala2Alphabet.slice(11, 17);     // Sin to Zho
    case 7: return skala2Alphabet.slice(17, 24);     // Ain to Mim
    case 8: return skala2Alphabet.slice(24, 30).filter((item) => item.arabic !== '\uFEFB'); // Nun to Ya
    case 9: return skala2Alphabet.slice(0, 30).filter((item) => item.arabic !== '\uFEFB');
    case 10: return skala2Alphabet.slice(0, 30).filter((item) => item.arabic !== '\uFEFB');
    default: return skala2Alphabet.slice(0, 4);
  }
}

export function getSkala2IntensiveForms(mod: number): HarfCard[] {
  const subset = getModuleSubset(mod);
  if (mod >= 4) {
    return generateQuranicPureForms(subset);
  }
  return generateTanwinForms(subset);
}

export function getSkala2PriorForms(mod: number): HarfCard[] {
  if (mod >= 5 && mod <= 10) {
    let endIndex = 30;
    switch (mod) {
      case 5: endIndex = 11; break;
      case 6: endIndex = 17; break;
      case 7: endIndex = 24; break;
      case 8: endIndex = 30; break;
      case 9: endIndex = 30; break;
      case 10: endIndex = 30; break;
      default: endIndex = 30;
    }
    const accumulatedSubset = skala2Alphabet.slice(0, endIndex).filter((item) => item.arabic !== '\uFEFB');
    return generateQuranicPureForms(accumulatedSubset);
  }

  if (mod === 4) {
    const rawSubset = skala2Alphabet.slice(0, 4);
    return generateQuranicPureForms(rawSubset);
  }

  let limitIndex = 7;
  switch (mod) {
    case 2: limitIndex = 7; break;
    case 3: limitIndex = 17; break;
    default: limitIndex = 7;
  }
  const subset = skala2Alphabet.slice(0, limitIndex);
  return mod <= 3 ? generateTanwinForms(subset) : generateSkala2BarisForms(subset);
}

const nonLamAlif = skala2Alphabet.filter((_, idx) => idx !== 27);
export const skala2AllTanwinForms = generateTanwinForms(nonLamAlif);