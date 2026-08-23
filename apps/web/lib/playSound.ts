export function playSound(audioPath: string) {
  if (typeof window === 'undefined') return;
  const sound = new Audio(audioPath);
  sound.play().catch((err) => console.log('Audio playback error:', err));
}