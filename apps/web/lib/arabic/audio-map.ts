// apps/web/lib/arabic/audio-map.ts

const letterAudioMap: Record<string, string> = {
  'Alif': '/audio/letters/alif.mp3',
  'Ba': '/audio/letters/ba.mp3',
  'Ta': '/audio/letters/ta.mp3',
  'Tha': '/audio/letters/tha.mp3',
  'Jim': '/audio/letters/jim.mp3',
  'Hha': '/audio/letters/hha.mp3',
  'Kho': '/audio/letters/kho.mp3',
  'Dal': '/audio/letters/dal.mp3',
  'Dzal': '/audio/letters/dzal.mp3',
  'Ro': '/audio/letters/ro.mp3',
  'Zai': '/audio/letters/zai.mp3',
  'Sin': '/audio/letters/sin.mp3',
  'Shin': '/audio/letters/shin.mp3',
  'Sod': '/audio/letters/sod.mp3',
  'Dhod': '/audio/letters/dhod.mp3',
  'Tho': '/audio/letters/tho.mp3',
  'Zho': '/audio/letters/zho.mp3',
  'Ain': '/audio/letters/ain.mp3',
  'Ghain': '/audio/letters/ghain.mp3',
  'Fa': '/audio/letters/fa.mp3',
  'Qof': '/audio/letters/qof.mp3',
  'Kaf': '/audio/letters/kaf.mp3',
  'Lam': '/audio/letters/lam.mp3',
  'Mim': '/audio/letters/mim.mp3',
  'Nun': '/audio/letters/nun.mp3',
  'Wau': '/audio/letters/wau.mp3',
  'Ha': '/audio/letters/ha.mp3',
  'Lam-Alif': '/audio/letters/lam-alif.mp3',
  'Hamzah': '/audio/letters/hamzah.mp3',
  'Ya': '/audio/letters/ya.mp3',
};

export function playLetterAudio(letterName: string) {
  console.log("Attempting to play audio for:", letterName); // Debug log
  const audioPath = letterAudioMap[letterName];
  console.log("Mapped audio path:", audioPath); // Debug log

  if (audioPath) {
    const audio = new Audio(audioPath);
    audio.play().then(() => {
      console.log("Audio played successfully!");
    }).catch((err) => {
      console.warn(`Failed to play local audio file at ${audioPath}:`, err);
      fallbackSpeech(letterName);
    });
  } else {
    console.warn("No audio path found in map for:", letterName);
    fallbackSpeech(letterName);
  }
}

function fallbackSpeech(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[ًٌٍَُِْ\s]/g, ''));
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}