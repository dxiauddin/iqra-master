'use client';

import { use, useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { getModuleProgress, saveModuleProgress } from '@/app/actions';
import { skala1Alphabet, allBarisForms as skala1AllBaris, getSkala1IntensiveForms, getSkala1PriorForms } from '@/lib/skala1-curriculum';
import { skala2Alphabet, skala2AllTanwinForms, getSkala2IntensiveForms, getSkala2PriorForms } from '@/lib/skala2-curriculum';
import { playLetterAudio } from '@/lib/arabic/audio-map';

interface PageProps {
  params: Promise<{ id: string; modNum: string }>;
}

export default function ModuleDetailPage({ params }: PageProps) {
  const { id, modNum } = use(params);
  const [isPending, startTransition] = useTransition();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic theme configuration ensuring all modules match the Skala theme accurately
  const getTheme = (skalaId: string) => {
    switch (skalaId) {
      case '1':
        return {
          bgGradient: 'linear-gradient(to bottom, #00472B 0%, #000000 30%, #000000 70%, #00472B 100%)',
          ambientGlow: 'bg-[#00472B]/30',
          accentText: 'text-emerald-400',
          accentBorder: 'border-emerald-500/40',
          accentBg: 'bg-[#00472B]/30 hover:bg-[#00472B]/50 text-emerald-200',
          doneCard: 'bg-[#00472B]/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(0,71,43,0.4)]',
          footerBorder: 'border-emerald-900/40',
          gradientStops: '#00472B,#10B981,#047857,#00472B',
          ringColor: '#10B981',
        };
      case '2':
        return {
          bgGradient: 'linear-gradient(to bottom, #54009E 0%, #000000 30%, #000000 70%, #54009E 100%)',
          ambientGlow: 'bg-[#54009E]/30',
          accentText: 'text-purple-300',
          accentBorder: 'border-purple-500/40',
          accentBg: 'bg-[#54009E]/30 hover:bg-[#54009E]/50 text-purple-200',
          doneCard: 'bg-[#54009E]/40 border-purple-500/60 text-purple-300 shadow-[0_0_10px_rgba(84,0,158,0.4)]',
          footerBorder: 'border-purple-900/40',
          gradientStops: '#54009E,#A855F7,#7C3AED,#54009E',
          ringColor: '#A855F7',
        };
      case '3':
        return {
          bgGradient: 'linear-gradient(to bottom, #9E0000 0%, #000000 30%, #000000 70%, #9E0000 100%)',
          ambientGlow: 'bg-[#9E0000]/30',
          accentText: 'text-red-400',
          accentBorder: 'border-red-500/40',
          accentBg: 'bg-[#9E0000]/30 hover:bg-[#9E0000]/50 text-red-200',
          doneCard: 'bg-[#9E0000]/40 border-red-500/60 text-red-300 shadow-[0_0_10px_rgba(158,0,0,0.4)]',
          footerBorder: 'border-red-900/40',
          gradientStops: '#9E0000,#EF4444,#B91C1C,#9E0000',
          ringColor: '#EF4444',
        };
      case '4':
        return {
          bgGradient: 'linear-gradient(to bottom, #FFF100 0%, #000000 30%, #000000 70%, #FFF100 100%)',
          ambientGlow: 'bg-[#FFF100]/20',
          accentText: 'text-yellow-300',
          accentBorder: 'border-yellow-500/40',
          accentBg: 'bg-[#FFF100]/20 hover:bg-[#FFF100]/30 text-yellow-200',
          doneCard: 'bg-[#FFF100]/30 border-yellow-500/60 text-yellow-200 shadow-[0_0_10px_rgba(255,241,0,0.3)]',
          footerBorder: 'border-yellow-900/40',
          gradientStops: '#FFF100,#EAB308,#CA8A04,#FFF100',
          ringColor: '#FFF100',
        };
      case '5':
        return {
          bgGradient: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 30%, #000000 70%, #FFFFFF 100%)',
          ambientGlow: 'bg-white/15',
          accentText: 'text-white',
          accentBorder: 'border-white/40',
          accentBg: 'bg-white/20 hover:bg-white/30 text-white',
          doneCard: 'bg-white/30 border-white/60 text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]',
          footerBorder: 'border-zinc-800',
          gradientStops: '#FFFFFF,#A1A1AA,#52525B,#FFFFFF',
          ringColor: '#FFFFFF',
        };
      case '6':
        return {
          bgGradient: 'linear-gradient(to bottom, #FF00F7 0%, #000000 30%, #000000 70%, #FF00F7 100%)',
          ambientGlow: 'bg-[#FF00F7]/25',
          accentText: 'text-pink-300',
          accentBorder: 'border-pink-500/40',
          accentBg: 'bg-[#FF00F7]/25 hover:bg-[#FF00F7]/40 text-pink-200',
          doneCard: 'bg-[#FF00F7]/35 border-pink-500/60 text-pink-200 shadow-[0_0_10px_rgba(255,0,247,0.4)]',
          footerBorder: 'border-pink-900/40',
          gradientStops: '#FF00F7,#DB2777,#9D174D,#FF00F7',
          ringColor: '#FF00F7',
        };
      default:
        return {
          bgGradient: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)',
          ambientGlow: 'bg-blue-500/15',
          accentText: 'text-blue-400',
          accentBorder: 'border-blue-500/40',
          accentBg: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300',
          doneCard: 'bg-blue-600/30 border-blue-500/60 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
          footerBorder: 'border-blue-900/40',
          gradientStops: '#3B82F6,#FACC15,#EF4444,#3B82F6',
          ringColor: '#3B82F6',
        };
    }
  };

  const theme = getTheme(id);
  const moduleNumber = parseInt(modNum, 10);
  const isSkala1 = id === '1';
  const isSkala2 = id === '2';

  const page1Letters = useMemo(() => {
    if (isSkala2) {
      const intensive = getSkala2IntensiveForms(moduleNumber);
      return intensive.map((item, idx) => ({ ...item, id: idx + 1 }));
    }
    if (isSkala1) {
      if (moduleNumber === 1) {
        return skala1Alphabet.slice(0, 30).map((item, idx) => ({ id: idx + 1, arabic: item.arabic, name: item.name }));
      }
      if (moduleNumber >= 9) {
        const res = [];
        for (let i = 0; i < 60; i++) {
          const r = skala1AllBaris[Math.floor(Math.random() * skala1AllBaris.length)];
          res.push({ id: i + 1, arabic: r.arabic, name: r.name });
        }
        return res;
      }
      const intensive = getSkala1IntensiveForms(moduleNumber);
      if (moduleNumber === 2) {
        const a = intensive[0], i = intensive[1], u = intensive[2];
        const ba = intensive[3], bi = intensive[4], bu = intensive[5];
        const ta = intensive[6], ti = intensive[7], tu = intensive[8];
        const tha = intensive[9], thi = intensive[10], thu = intensive[11];
        return [a, i, u, ba, bi, bu, ta, ti, tu, tha, thi, thu].map((item, idx) => ({ ...item, id: idx + 1 }));
      }
      return intensive.map((item, idx) => ({ ...item, id: idx + 1 }));
    }
    return skala1Alphabet.slice(0, 30).map((item, idx) => ({ id: idx + 1, arabic: item.arabic, name: item.name }));
  }, [isSkala1, isSkala2, moduleNumber]);

  const generateMixedPages = () => {
    if (isSkala2) {
      const intensive = getSkala2IntensiveForms(moduleNumber);
      const prior = getSkala2PriorForms(moduleNumber);
      const totalCards = 60;
      const intensiveCount = Math.round(totalCards * 0.3);
      const priorCount = totalCards - intensiveCount;
      const selected = [];
      for (let i = 0; i < intensiveCount; i++) {
        selected.push(intensive[Math.floor(Math.random() * intensive.length)]);
      }
      for (let i = 0; i < priorCount; i++) {
        selected.push(prior[Math.floor(Math.random() * prior.length)]);
      }
      return selected.sort(() => Math.random() - 0.5).map((item, idx) => ({ ...item, id: idx + 1 }));
    }
    if (isSkala1) {
      if (moduleNumber === 1) {
        return [...skala1Alphabet].sort(() => Math.random() - 0.5).slice(0, 60).map((item, idx) => ({ id: idx + 1, arabic: item.arabic, name: item.name }));
      }
      if (moduleNumber >= 9) {
        const results = [];
        for (let i = 0; i < 60; i++) {
          const rand = skala1AllBaris[Math.floor(Math.random() * skala1AllBaris.length)];
          results.push({ id: i + 1, arabic: rand.arabic, name: rand.name });
        }
        return results;
      }
      const intensive = getSkala1IntensiveForms(moduleNumber);
      const prior = getSkala1PriorForms(moduleNumber);
      const totalCards = 60;
      const intensiveCount = Math.round(totalCards * 0.3);
      const priorCount = totalCards - intensiveCount;
      const selected = [];
      for (let i = 0; i < intensiveCount; i++) {
        selected.push(intensive[Math.floor(Math.random() * intensive.length)]);
      }
      for (let i = 0; i < priorCount; i++) {
        selected.push(prior[Math.floor(Math.random() * prior.length)]);
      }
      return selected.sort(() => Math.random() - 0.5).map((item, idx) => ({ ...item, id: idx + 1 }));
    }
    return [...skala1Alphabet].sort(() => Math.random() - 0.5).slice(0, 60).map((item, idx) => ({ id: idx + 1, arabic: item.arabic, name: item.name }));
  };

  const page2Letters = useMemo(() => generateMixedPages(), [isSkala1, isSkala2, moduleNumber]);
  const page3Letters = useMemo(() => generateMixedPages(), [isSkala1, isSkala2, moduleNumber]);

  const currentLetters = 
    currentPage === 1 ? page1Letters : 
    currentPage === 2 ? page2Letters : 
    page3Letters;

  const totalCardsCount = page1Letters.length + page2Letters.length + page3Letters.length;
  const [completedCards, setCompletedCards] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const currentUserId = 1; 
        const skalaNum = parseInt(id, 10);
        const modNumVal = parseInt(modNum, 10);
        const data = await getModuleProgress(currentUserId, skalaNum, modNumVal);
        if (data && data.completed_cards) {
          setCompletedCards(data.completed_cards);
        }
      } catch (err) {
        console.error('Error loading module progress:', err);
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
      const updatedCards = [...completedCards, cardKey];
      setCompletedCards(updatedCards);
      const newPercentage = Math.round((updatedCards.length / totalCardsCount) * 100);

      startTransition(async () => {
        try {
          await saveModuleProgress(1, parseInt(id, 10), parseInt(modNum, 10), updatedCards, newPercentage);
        } catch (err) {
          console.error('Error saving progress:', err);
        }
      });
    }

    playLetterAudio(item.name);
  };

  const isThreeColumnGrid = 
    (currentPage === 1 && isSkala1 && moduleNumber > 1 && moduleNumber < 9) || 
    (isSkala2 && moduleNumber >= 4);

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

      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-15 space-y-4 pt-6 pb-24 flex-1">
        <div className="w-full text-center space-y-2 flex flex-col items-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center drop-shadow-2xl mb-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-white/10" strokeWidth="3.2" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="transition-all duration-500 ease-out" stroke={theme.ringColor} strokeWidth="3.2" strokeDasharray="100" strokeDashoffset={100 - progressPercent} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-[15px] font-bold font-mono text-white flex items-center gap-1">
              {isLoading ? <span className={`w-3 h-3 border-2 ${theme.accentText} border-t-transparent rounded-full animate-spin`} /> : `${progressPercent}%`}
            </span>
          </div>

          <span className={`text-[12px] font-semibold ${theme.accentText} uppercase tracking-widest block flex items-center justify-center gap-2`}>
            Skala {id} &bull; Modul {modNum} 
            {isPending && <span className="text-[12px] text-yellow-400 animate-pulse">(Menyimpan...)</span>}
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {moduleNumber === 1 && isSkala1 ? 'Pengenalan Huruf Hijaiyah' : `Modul Pembelajaran Asas ${modNum}`}
          </h1>
          
          <ul className="text-[15px] text-zinc-300 font-normal pt-1 space-y-1 text-left max-w-xs mx-auto">
            <li className="flex items-center">
              <span className={`mr-2 ${theme.accentText}`}>•</span>
              <span>{moduleNumber === 1 && isSkala1 ? 'Mengenal, mengecam dan menghafal huruf hijaiyah' : 'Latihan intensif harf baru dan ulangkaji berterusan'}</span>
            </li>
          </ul>
        </div>

        {/* Modules Content Box with Multi-Color Spinning Border Beam */}
        <section className="w-full pt-2 pb-2 relative z-10">
          <div className="relative w-full">
            {/* Spinning Glow Backdrop */}
            <div className="absolute -inset-1 rounded-3xl overflow-hidden opacity-30 blur-md pointer-events-none">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
            </div>

            {/* Spinning Border Container */}
            <div className="relative p-[1.5px] rounded-3xl overflow-hidden w-full shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
              
              <div className="w-full bg-zinc-950 backdrop-blur-3xl text-white rounded-[22px] py-6 px-4 sm:px-6 flex flex-col items-center gap-4 border border-white/10 relative">
                
                {isLoading && (
                  <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[22px]">
                    <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-[15px] text-zinc-300 font-medium">Memuatkan pencapaian...</span>
                  </div>
                )}

                <span className="text-[15px] font-semibold tracking-wide text-zinc-300">
                  {currentPage === 1 && moduleNumber > 1 && isSkala1 ? 'Halaman 1: Intensive Harf (3 Harf sebaris)' : currentPage === 1 ? 'Halaman 1: Pengenalan Huruf' : `Halaman ${currentPage}: Latihan & Ulangkaji`}
                </span>

                <div className={`grid ${isThreeColumnGrid ? 'grid-cols-3' : 'grid-cols-6'} gap-3 w-full`} dir="rtl">
                  {currentLetters.map((item) => {
                    const cardKey = `${currentPage}-${item.id}`;
                    const isDone = completedCards.includes(cardKey);
                    const isSingleYa = item.name === 'Ya' || item.arabic === 'ي' || item.arabic === 'يَ' || item.arabic === 'يِ' || item.arabic === 'يُ';

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleCardClick(item)}
                        className={`cursor-pointer rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center transition-all shadow-md hover:scale-105 group ${
                          isDone ? theme.doneCard : 'bg-zinc-900/90 hover:bg-zinc-800 border border-white/15'
                        }`}
                        title={`Sebut ${item.name}`}
                      >
                        <span 
                          className={`text-2xl sm:text-3xl font-bold tracking-wider transition-colors ${isDone ? '' : 'text-white group-hover:' + theme.accentText} ${isSingleYa ? 'font-serif' : 'font-arabic'}`}
                          style={isSingleYa ? { fontFamily: '"Amiri", serif' } : undefined}
                        >
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
                    className={`px-4 py-1.5 rounded-full text-[15px] font-medium border border-white/15 transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-900 text-zinc-300'}`}
                  >
                    &lt;
                  </button>

                  <span className="text-[15px] font-mono text-zinc-400">{currentPage} / {totalPages}</span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-1.5 rounded-full text-[15px] font-medium border border-white/15 transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-900 text-zinc-300'}`}
                  >
                    &gt;
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
              className={`inline-flex items-center justify-center py-2.5 px-6 rounded-full font-medium text-[15px] shadow-lg transition-transform hover:scale-105 bg-transparent border-2 ${theme.accentBorder} ${theme.accentBg}`}
            >
              Mula Ujian Modul {modNum}
            </Link>
          </div>
        </div>
      </div>

      <footer className={`w-full pt-3 pb-3 border-t ${theme.footerBorder} text-center text-[15px] text-white relative z-10 font-sans shrink-0`}>
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}