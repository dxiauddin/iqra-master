'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { skala1Alphabet } from '@/lib/skala1-curriculum';
import { skala2Alphabet } from '@/lib/skala2-curriculum';
import { playLetterAudio } from '@/lib/arabic/audio-map';
import * as htmlToImage from 'html-to-image';

interface PageProps {
  params: Promise<{ id: string; modNum: string }>;
}

export default function ModuleTestPage({ params }: PageProps) {
  const { id, modNum } = use(params);
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Pengguna");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('iqra_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.name) {
          const formattedName = parsedUser.name.charAt(0).toUpperCase() + parsedUser.name.slice(1);
          setUserName(formattedName);
        }
      }
    } catch (err) {
      console.error('Gagal membaca data pengguna:', err);
    }
  }, []);

  // Theme configuration perfectly matching the exact Skala gradients and accents
  const getTheme = (skalaId: string) => {
    switch (skalaId) {
      case '1':
        return {
          bgGradient: 'linear-gradient(to bottom, #00472B 0%, #000000 30%, #000000 70%, #00472B 100%)',
          ambientGlow: 'bg-[#00472B]/30',
          accentText: 'text-emerald-400',
          accentBorder: 'border-emerald-500/40',
          cardBg: 'from-emerald-950 via-zinc-950 to-black',
          footerBorder: 'border-emerald-900/40',
          ringColor: '#10B981',
        };
      case '2':
        return {
          bgGradient: 'linear-gradient(to bottom, #54009E 0%, #000000 30%, #000000 70%, #54009E 100%)',
          ambientGlow: 'bg-[#54009E]/30',
          accentText: 'text-purple-300',
          accentBorder: 'border-purple-500/40',
          cardBg: 'from-purple-950 via-zinc-950 to-black',
          footerBorder: 'border-purple-900/40',
          ringColor: '#A855F7',
        };
      case '3':
        return {
          bgGradient: 'linear-gradient(to bottom, #9E0000 0%, #000000 30%, #000000 70%, #9E0000 100%)',
          ambientGlow: 'bg-[#9E0000]/30',
          accentText: 'text-red-400',
          accentBorder: 'border-red-500/40',
          cardBg: 'from-red-950 via-zinc-950 to-black',
          footerBorder: 'border-red-900/40',
          ringColor: '#EF4444',
        };
      case '4':
        return {
          bgGradient: 'linear-gradient(to bottom, #FFF100 0%, #000000 30%, #000000 70%, #FFF100 100%)',
          ambientGlow: 'bg-[#FFF100]/20',
          accentText: 'text-yellow-300',
          accentBorder: 'border-yellow-500/40',
          cardBg: 'from-yellow-950 via-zinc-950 to-black',
          footerBorder: 'border-yellow-900/40',
          ringColor: '#FFF100',
        };
      case '5':
        return {
          bgGradient: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 30%, #000000 70%, #FFFFFF 100%)',
          ambientGlow: 'bg-white/15',
          accentText: 'text-white',
          accentBorder: 'border-white/40',
          cardBg: 'from-zinc-900 via-zinc-950 to-black',
          footerBorder: 'border-zinc-800',
          ringColor: '#FFFFFF',
        };
      case '6':
        return {
          bgGradient: 'linear-gradient(to bottom, #FF00F7 0%, #000000 30%, #000000 70%, #FF00F7 100%)',
          ambientGlow: 'bg-[#FF00F7]/25',
          accentText: 'text-pink-300',
          accentBorder: 'border-pink-500/40',
          cardBg: 'from-pink-950 via-zinc-950 to-black',
          footerBorder: 'border-pink-900/40',
          ringColor: '#FF00F7',
        };
      default:
        return {
          bgGradient: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)',
          ambientGlow: 'bg-blue-500/15',
          accentText: 'text-blue-400',
          accentBorder: 'border-blue-500/40',
          cardBg: 'from-blue-950 via-zinc-950 to-black',
          footerBorder: 'border-blue-900/40',
          ringColor: '#3B82F6',
        };
    }
  };

  const theme = getTheme(id);

  // Generate Questions & Preload Audio into browser memory instantly to prevent Vercel lag
  useEffect(() => {
    const alphabet = id === '1' ? skala1Alphabet : skala2Alphabet;
    
    // Preload audio files immediately on mount
    alphabet.forEach((item) => {
      const audio = new Audio(`/audio/letters/${item.name.toLowerCase()}.mp3`);
      audio.load();
    });

    const shuffledAlphabet = [...alphabet].sort(() => Math.random() - 0.5);
    
    const generatedQuestions = shuffledAlphabet.slice(0, 10).map((item) => {
      const wrongOptions = alphabet
        .filter((a) => a.name !== item.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 47)
        .map((a) => ({ arabic: a.arabic, name: a.name }));

      const targetOption = { arabic: item.arabic, name: item.name };
      const options = [...wrongOptions, targetOption].sort(() => Math.random() - 0.5);

      return {
        targetName: item.name,
        targetArabic: item.arabic,
        options,
      };
    });

    setQuestions(generatedQuestions);
    setIsLoading(false);
  }, [id]);

  const playTargetAudio = (name: string) => {
    setIsPlayingAudio(true);
    playLetterAudio(name);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1000);
  };

  // Instant response execution without unnecessary heavy delays
  const handleAnswerSelect = (optionName: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionName);
    const correct = optionName === questions[currentIndex].targetName;
    setIsCorrect(correct);

    const currentScoreIncrement = 10;
    const newScore = correct ? score + currentScoreIncrement : score;
    if (correct) setScore(newScore);

    // Fast-tracked transition to keep mobile audio gesture contexts alive
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setSelectedOption(null);
        setIsCorrect(null);
        playTargetAudio(questions[nextIndex]?.targetName);
      } else {
        setScore(correct ? score + 10 : score);
        setIsCompleted(true);
      }
    }, 500); // Reduced from 1200ms to 500ms for snappy mobile response
  };

  const handleShareWhatsApp = async () => {
    if (!resultCardRef.current) return;

    try {
      const dataUrl = await htmlToImage.toJpeg(resultCardRef.current, { quality: 0.95 });
      
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const file = new File([blob], `Iqra-Test-Skala-${id}-Modul-${modNum}.jpg`, { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Keputusan Ujian Iqra Master',
          text: `Alhamdulillah! Saya baru sahaja mengambil Ujian Skala ${id} Modul ${modNum} dengan markah ${score}%!`,
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.download = `Iqra-Test-Skala-${id}-Modul-${modNum}.jpg`;
        link.href = dataUrl;
        link.click();

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `Alhamdulillah! Saya baru sahaja mengambil Ujian Skala ${id} Modul ${modNum} dengan markah ${score}%!`
        )}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (err) {
      console.error('Gagal menjana imej sijil:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-[15px] text-zinc-400">Menyediakan soalan ujian...</span>
      </div>
    );
  }

  const finalPercentage = score;
  const isPassed = finalPercentage >= 95;
  const currentQ = questions[currentIndex];

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 overflow-x-hidden font-sans antialiased"
      style={{ background: theme.bgGradient }}
    >
      <style jsx global>{`
        @keyframes spinGradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinGradient 6s linear infinite;
        }
      `}</style>

      <div className={`absolute w-96 h-96 ${theme.ambientGlow} rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2`} />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 space-y-6 pt-8 pb-28 flex-1">
        
        {/* Header */}
        <div className="w-full text-center space-y-1">
          <span className={`text-[12px] font-semibold ${theme.accentText} uppercase tracking-widest block`}>
            Ujian Pendengaran &bull; Skala {id} Modul {modNum}
          </span>
          <h1 className="text-xl font-extrabold">Ujian Sebutan Audio</h1>
        </div>

        {!isCompleted && currentQ && (
          <div className="w-full relative">
            {/* Spinning Glow Backdrop */}
            <div className="absolute -inset-1 rounded-3xl overflow-hidden opacity-30 blur-md pointer-events-none">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
            </div>

            {/* Spinning Border Container with Multi-Color Beam */}
            <div className="relative p-[1.5px] rounded-3xl overflow-hidden w-full shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />

              <div className="w-full bg-zinc-950 backdrop-blur-3xl rounded-[22px] p-6 border border-white/10 shadow-2xl flex flex-col items-center space-y-6 relative">
                
                {/* Question Progress Tracker */}
                <div className="flex justify-between w-full text-[15px] text-zinc-400 font-mono">
                  <span>Soalan {currentIndex + 1} / {questions.length}</span>
                  <span>Markah: {score}</span>
                </div>

                {/* Professional Audio Trigger Component */}
                <div className="flex flex-col items-center space-y-3">
                  <div 
                    onClick={() => playTargetAudio(currentQ.targetName)}
                    className={`w-28 h-28 bg-zinc-900 border ${isPlayingAudio ? 'border-emerald-400 scale-105 shadow-[0_0_25px_rgba(16,185,129,0.4)]' : 'border-white/20 hover:border-white/40'} rounded-3xl flex items-center justify-center cursor-pointer shadow-2xl transition-all group relative`}
                    title="Tekan untuk dengar audio"
                  >
                    {isPlayingAudio && (
                      <span className="absolute inset-0 rounded-3xl border-2 border-emerald-500 animate-ping opacity-30 pointer-events-none" />
                    )}
                    <svg 
                      className={`w-12 h-12 transition-transform group-hover:scale-110 ${isPlayingAudio ? 'text-emerald-400' : 'text-zinc-200'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.8" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  </div>
                  <span className="text-[15px] text-zinc-300 font-medium tracking-wide">Tekan ikon untuk mendengar sebutan</span>
                </div>

                {/* 6 Columns Grid Options */}
                <div className="w-full pt-2">
                  <span className="text-[15px] text-zinc-400 block pb-2 text-center">Pilih huruf yang betul daripada pilihan di bawah:</span>
                  <div className="grid grid-cols-6 gap-2 w-full max-h-[450px] overflow-y-auto p-1" dir="rtl">
                    {currentQ.options.map((opt: { arabic: string; name: string }, idx: number) => {
                      let btnStyle = 'bg-zinc-900/90 hover:bg-zinc-800 border-white/15 text-white';
                      if (selectedOption !== null) {
                        if (opt.name === currentQ.targetName) {
                          btnStyle = 'bg-emerald-600/40 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
                        } else if (opt.name === selectedOption) {
                          btnStyle = 'bg-red-600/40 border-red-500 text-red-200';
                        } else {
                          btnStyle = 'opacity-30 bg-zinc-900 border-white/10 text-zinc-500';
                        }
                      }

                      const isSingleYa = opt.name === 'Ya' || opt.arabic === 'ي';

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(opt.name)}
                          disabled={selectedOption !== null}
                          className={`py-3 px-1 rounded-xl border text-xl font-bold transition-all shadow-sm flex items-center justify-center ${btnStyle} ${isSingleYa ? 'font-serif' : 'font-arabic'}`}
                          style={isSingleYa ? { fontFamily: '"Amiri", serif' } : undefined}
                        >
                          {opt.arabic}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* COMPLETED POPUP MODAL OVERLAY */}
      {isCompleted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-6 px-4 pb-20 overflow-y-auto font-sans">
          <div className="w-full max-w-sm flex flex-col items-center space-y-3 animate-in fade-in zoom-in duration-300 relative my-auto">
            
            {/* Printable Certificate Card Wrapper with Border Beam */}
            <div className="relative p-[1.5px] rounded-[26px] overflow-hidden w-full shadow-2xl">
              <div 
                className="absolute inset-[-150%] animate-spin-slow opacity-90 pointer-events-none" 
                style={{ background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${theme.ringColor} 360deg)` }}
              />

              {/* Snapshot Target Ref */}
              <div 
                ref={resultCardRef}
                className={`relative w-full bg-gradient-to-br ${theme.cardBg} p-5 rounded-[24px] text-white text-center border border-white/15 space-y-3`}
              >
                {/* Close (✕) Button */}
                <Link
                  href={`/skala/${id}/module/${modNum}`}
                  className="absolute top-1.5 right-1.5 z-30 w-5 h-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-zinc-300 hover:text-white transition-colors text-[10px] font-bold"
                  title="Tutup"
                >
                  ✕
                </Link>

                <div className="py-1.5 px-6 bg-white/5 rounded-xl border border-white/10 text-[15px] text-zinc-300">
                  <span>Penerima: <strong className="text-white">{userName}</strong></span>
                </div>

                <div className="py-4 bg-white/5 rounded-2xl border border-white/10 space-y-1 shadow-inner">
                  <span className="block text-3xl font-mono font-extrabold text-yellow-400">{finalPercentage}%</span>
                  <div className="space-y-0.5 pt-0.5">
                    <h2 className="text-[15px] font-bold">Sijil Keputusan Ujian Audio</h2>
                    <p className={`text-[15px] font-semibold ${theme.accentText}`}>Skala {id} &bull; Modul {modNum}</p>
                  </div>
                  <span className={`text-[15px] font-semibold block pt-1.5 ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPassed ? 'Tahniah. Anda lulus.' : 'Anda gagal. Sila cuba lagi.'}
                  </span>
                </div>

                <div className="pt-0.5 border-t border-white/10">
                  <span className="text-[12px] text-zinc-500 tracking-wider block">
                    &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button with Professional WhatsApp Icon */}
            <div className="flex flex-col w-full space-y-2">
              <button
                onClick={handleShareWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-6 rounded-full text-[15px] transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Kongsi Keputusan ke WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Trademark Footer */}
      <footer className={`w-full pt-3 pb-3 border-t ${theme.footerBorder} text-center text-[15px] text-white relative z-10 font-sans shrink-0`}>
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}