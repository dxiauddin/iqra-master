'use client';

import { use, useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { getModuleProgress, saveModuleProgress } from '@/app/actions';

interface PageProps {
  params: Promise<{ id: string; modNum: string }>;
}

export default function ModuleDetailPage({ params }: PageProps) {
  const { id, modNum } = use(params);
  const [isPending, startTransition] = useTransition();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic theme configuration mapping matching your Skala dashboard setup
  const getTheme = (skalaId: string) => {
    switch (skalaId) {
      case '1': // Green Theme (#00472B)
        return {
          bgGradient: 'linear-gradient(to bottom, #00472B 0%, #000000 30%, #000000 70%, #00472B 100%)',
          ambientGlow: 'bg-[#00472B]/30',
          accentText: 'text-emerald-400',
          accentBorder: 'border-emerald-500/40',
          accentBg: 'bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-200',
          doneCard: 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
          footerBorder: 'border-emerald-900/40',
        };
      case '2': // Purple Theme (#54009E)
        return {
          bgGradient: 'linear-gradient(to bottom, #54009E 0%, #000000 30%, #000000 70%, #54009E 100%)',
          ambientGlow: 'bg-[#54009E]/30',
          accentText: 'text-purple-400',
          accentBorder: 'border-purple-500/40',
          accentBg: 'bg-purple-950/30 hover:bg-purple-950/50 text-purple-200',
          doneCard: 'bg-purple-950/40 border-purple-500/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
          footerBorder: 'border-purple-900/40',
        };
      case '3': // Red Theme (#9E0000)
        return {
          bgGradient: 'linear-gradient(to bottom, #9E0000 0%, #000000 30%, #000000 70%, #9E0000 100%)',
          ambientGlow: 'bg-[#9E0000]/30',
          accentText: 'text-red-400',
          accentBorder: 'border-red-500/40',
          accentBg: 'bg-red-950/30 hover:bg-red-950/50 text-red-200',
          doneCard: 'bg-red-950/40 border-red-500/60 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
          footerBorder: 'border-red-900/40',
        };
      case '4': // Yellow Theme (#FFF100)
        return {
          bgGradient: 'linear-gradient(to bottom, #FFF100 0%, #000000 30%, #000000 70%, #FFF100 100%)',
          ambientGlow: 'bg-[#FFF100]/20',
          accentText: 'text-yellow-400',
          accentBorder: 'border-yellow-500/40',
          accentBg: 'bg-yellow-950/30 hover:bg-yellow-950/50 text-yellow-200',
          doneCard: 'bg-yellow-950/40 border-yellow-500/60 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
          footerBorder: 'border-yellow-900/40',
        };
      case '5': // White Theme
        return {
          bgGradient: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 30%, #000000 70%, #FFFFFF 100%)',
          ambientGlow: 'bg-white/15',
          accentText: 'text-white',
          accentBorder: 'border-white/40',
          accentBg: 'bg-white/20 hover:bg-white/30 text-white',
          doneCard: 'bg-zinc-800/60 border-white/60 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]',
          footerBorder: 'border-zinc-800',
        };
      case '6': // Pink Theme (#FF00F7)
        return {
          bgGradient: 'linear-gradient(to bottom, #FF00F7 0%, #000000 30%, #000000 70%, #FF00F7 100%)',
          ambientGlow: 'bg-[#FF00F7]/25',
          accentText: 'text-pink-400',
          accentBorder: 'border-pink-500/40',
          accentBg: 'bg-pink-950/30 hover:bg-pink-950/50 text-pink-200',
          doneCard: 'bg-pink-950/40 border-pink-500/60 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
          footerBorder: 'border-pink-900/40',
        };
      default: // Fallback Blue
        return {
          bgGradient: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)',
          ambientGlow: 'bg-blue-500/15',
          accentText: 'text-blue-400',
          accentBorder: 'border-blue-500/40',
          accentBg: 'bg-blue-950/30 hover:bg-blue-950/50 text-blue-200',
          doneCard: 'bg-blue-950/40 border-blue-500/60 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
          footerBorder: 'border-blue-900/40',
        };
    }
  };

  const theme = getTheme(id);

  const fullAlphabet = [
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
    { id: 26, arabic: 'هـ', name: 'Ha' },
    { id: 27, arabic: 'و', name: 'Wau' },
    { id: 28, arabic: 'ي', name: 'Ya' },
  ];

  const page1Letters = fullAlphabet;
  const page2Letters = useMemo(() => [...fullAlphabet].sort(() => Math.random() - 0.5), []);
  const page3Letters = useMemo(() => [...fullAlphabet].reverse(), []);

  const currentLetters = 
    currentPage === 1 ? page1Letters : 
    currentPage === 2 ? page2Letters : 
    page3Letters;

  const totalCardsCount = fullAlphabet.length * totalPages;
  const [completedCards, setCompletedCards] = useState<string[]>([]);

  // Fetch progress from Neon Database on mount with loading state
  useEffect(() => {
    async function fetchProgress() {
      try {
        const currentUserId = 1; 
        const skalaNum = parseInt(id, 10);
        const moduleNum = parseInt(modNum, 10);

        const data = await getModuleProgress(currentUserId, skalaNum, moduleNum);
        if (data && data.completed_cards) {
          setCompletedCards(data.completed_cards);
        }
      } catch (err) {
        console.error('Error loading module progress from database:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProgress();
  }, [id, modNum]);

  const progressPercent = Math.round((completedCards.length / totalCardsCount) * 100);

  const handleCardClick = (item: { id: number; name: string; arabic: string }) => {
    const cardKey = `${currentPage}-${item.id}`;
    
    if (!completedCards.includes(cardKey)) {
      // 1. Optimistic UI Update (Immediate response for user)
      const updatedCards = [...completedCards, cardKey];
      setCompletedCards(updatedCards);
      const newPercentage = Math.round((updatedCards.length / totalCardsCount) * 100);

      // 2. Background Neon Database Sync
      startTransition(async () => {
        try {
          const currentUserId = 1;
          const skalaNum = parseInt(id, 10);
          const moduleNum = parseInt(modNum, 10);
          await saveModuleProgress(currentUserId, skalaNum, moduleNum, updatedCards, newPercentage);
        } catch (err) {
          console.error('Error saving progress to database:', err);
        }
      });
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

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

      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-15 space-y-4 pt-6 pb-24 flex-1">
        
        <div className="w-full text-center space-y-2 flex flex-col items-center">
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center drop-shadow-2xl mb-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="transition-all duration-500 ease-out"
                stroke="url(#themeGradient)"
                strokeWidth="3.2"
                strokeDasharray="100"
                strokeDashoffset={100 - progressPercent}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm sm:text-base font-bold font-mono text-white flex items-center gap-1">
              {isLoading ? (
                <span className={`w-3 h-3 border-2 ${theme.accentText} border-t-transparent rounded-full animate-spin`} />
              ) : (
                `${progressPercent}%`
              )}
            </span>
          </div>

          <span className={`text-[10px] font-semibold ${theme.accentText} uppercase tracking-widest block flex items-center justify-center gap-2`}>
            Skala {id} &bull; Modul {modNum} 
            {currentPage === 1 ? ' (Urutan Alif - Ya)' : currentPage === 2 ? ' (Susunan Rawak)' : ' (Urutan Menurun Ya - Alif)'}
            {isPending && <span className="text-[9px] text-yellow-400 animate-pulse">(Menyimpan...)</span>}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Pengenalan Huruf Hijaiyah</h1>
          
          <ul className="text-xs text-zinc-300 font-normal pt-1 space-y-1 text-left max-w-xs mx-auto" style={{ letterSpacing: '-0.005em' }}>
            <li className="flex items-center">
              <span className={`mr-2 ${theme.accentText}`}>•</span>
              <span>Mengenal, mengecam dan menghafal huruf hijaiyah</span>
            </li>
          </ul>
        </div>

        <section className="w-full pt-2 pb-2 relative z-10">
          <div className="relative w-full">
            <div className="absolute -inset-1 rounded-3xl overflow-hidden opacity-30 blur-md pointer-events-none">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
            </div>

            <div className="relative p-[1.5px] rounded-3xl overflow-hidden w-full shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
              
              <div className="w-full bg-zinc-950 backdrop-blur-3xl text-white rounded-[22px] py-6 px-4 sm:px-6 flex flex-col items-center gap-4 border border-white/10 relative">
                
                {/* Loading overlay when initially fetching from Neon */}
                {isLoading && (
                  <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[22px]">
                    <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs text-zinc-300 font-medium">Memuatkan pencapaian...</span>
                  </div>
                )}

                <span className="text-xs font-semibold tracking-wide text-zinc-300">
                  {currentPage === 1 ? 'Halaman 1: Urutan Asas (Alif - Ya)' : currentPage === 2 ? 'Halaman 2: Susunan Rawak' : 'Halaman 3: Urutan Menurun (Ya - Alif)'}
                </span>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 w-full" dir="rtl">
                  {currentLetters.map((item) => {
                    const cardKey = `${currentPage}-${item.id}`;
                    const isDone = completedCards.includes(cardKey);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleCardClick(item)}
                        className={`cursor-pointer rounded-2xl p-3 flex flex-col items-center justify-center transition-all shadow-md hover:scale-105 group ${
                          isDone 
                            ? theme.doneCard
                            : 'bg-zinc-900/90 hover:bg-zinc-800 border border-white/15'
                        }`}
                        title={`Sebut ${item.name}`}
                      >
                        <span className={`text-3xl sm:text-4xl font-bold font-arabic transition-colors ${isDone ? '' : 'text-white group-hover:' + theme.accentText}`}>
                          {item.arabic}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center w-full pt-4 border-t border-white/10 mt-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border border-white/15 transition-all ${
                      currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    &larr; Halaman Sebelumnya
                  </button>

                  <span className="text-xs font-mono text-zinc-400">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border border-white/15 transition-all ${
                      currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    Halaman Seterusnya &rarr;
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        <div className="w-full pt-2 flex flex-col items-center text-center space-y-2">
          <div className="flex justify-center">
            <Link 
              href={`/skala/${id}/module/${modNum}/test`}
              className={`inline-flex items-center justify-center py-2 px-6 rounded-full font-medium text-xs shadow-lg transition-transform hover:scale-105 bg-transparent border-2 ${theme.accentBorder} ${theme.accentBg}`}
              style={{ letterSpacing: '-0.01em' }}
            >
              Mula Ujian Modul {modNum}
            </Link>
          </div>

          <p className="text-xs text-zinc-300 font-normal leading-snug max-w-sm" style={{ letterSpacing: '-0.005em' }}>
            Sila ambil ujian modul ini untuk menilai pencapaian keseluruhan anda sebelum beralih ke Modul 2.
          </p>
        </div>

      </div>

      <footer className={`w-full pt-3 pb-3 border-t ${theme.footerBorder} text-center text-xs text-white relative z-10 font-sans shrink-0`}>
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}