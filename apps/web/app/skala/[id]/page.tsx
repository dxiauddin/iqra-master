'use client';

import { useState, use, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { getSkalaProgress, resetSkalaProgress } from '@/app/actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SkalaDashboardPage({ params }: PageProps) {
  const { id } = use(params);
  const [isPending, startTransition] = useTransition();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // State for aggregate multi-module progress & active module indicator
  const [overallPercent, setOverallPercent] = useState(0);
  const [currentModule, setCurrentModule] = useState(1);
  const [moduleProgressMap, setModuleProgressMap] = useState<Record<number, number>>({});

  // Locked module popup alert state
  const [lockedPopupModule, setLockedPopupModule] = useState<number | null>(null);

  // Fetch true multi-module aggregated progress from Neon Database on mount
  useEffect(() => {
    async function fetchSkalaAggregateProgress() {
      try {
        const currentUserId = 1; // Match user session ID
        const skalaNum = parseInt(id, 10);
        const totalModulesCount = 10; // Total modules in this Skala

        const data = await getSkalaProgress(currentUserId, skalaNum, totalModulesCount);
        
        if (data) {
          setOverallPercent(data.overall_percent);
          setCurrentModule(data.current_module);
          
          const map: Record<number, number> = {};
          if (data.overall_percent > 0) {
            map[1] = data.current_module > 1 ? 100 : data.overall_percent * 10; 
          }
          setModuleProgressMap(map);
        }
      } catch (err) {
        console.error('Failed to fetch aggregate progress from Neon database:', err);
      }
    }

    startTransition(() => {
      fetchSkalaAggregateProgress();
    });
  }, [id]);

  // Handle click on module card to enforce locking rules
  const handleModuleClick = (e: React.MouseEvent, modNum: number) => {
    if (modNum > 1) {
      const prevModuleProgress = moduleProgressMap[modNum - 1] || 0;
      
      if (prevModuleProgress < 100 && currentModule < modNum) {
        e.preventDefault();
        setLockedPopupModule(modNum);
        return;
      }
    }
  };

  // Handle resetting progress for development testing
  const handleReset = async () => {
    if (window.confirm('Adakah anda pasti mahu menetapkan semula (reset) semua pencapaian untuk Skala ini?')) {
      startTransition(async () => {
        try {
          const currentUserId = 1;
          const skalaNum = parseInt(id, 10);
          await resetSkalaProgress(currentUserId, skalaNum);
          window.location.reload();
        } catch (err) {
          console.error('Failed to reset progress:', err);
        }
      });
    }
  };

  // Dynamic theme configuration based on exact custom color codes
  const getTheme = (skalaId: string) => {
    switch (skalaId) {
      case '1': // Green Theme (#00472B)
        return {
          bgGradient: 'linear-gradient(to bottom, #00472B 0%, #000000 30%, #000000 70%, #00472B 100%)',
          ambientGlow: 'bg-[#00472B]/30',
          hoverColor: 'group-hover:text-emerald-400',
          testBtn: 'bg-[#00472B]/30 hover:bg-[#00472B]/50 text-emerald-200 border-emerald-500/40',
          footerBorder: 'border-emerald-900/40',
        };
      case '2': // Purple Theme (#54009E)
        return {
          bgGradient: 'linear-gradient(to bottom, #54009E 0%, #000000 30%, #000000 70%, #54009E 100%)',
          ambientGlow: 'bg-[#54009E]/30',
          hoverColor: 'group-hover:text-purple-300',
          testBtn: 'bg-[#54009E]/30 hover:bg-[#54009E]/50 text-purple-200 border-purple-500/40',
          footerBorder: 'border-purple-900/40',
        };
      case '3': // Red Theme (#9E0000)
        return {
          bgGradient: 'linear-gradient(to bottom, #9E0000 0%, #000000 30%, #000000 70%, #9E0000 100%)',
          ambientGlow: 'bg-[#9E0000]/30',
          hoverColor: 'group-hover:text-red-400',
          testBtn: 'bg-[#9E0000]/30 hover:bg-[#9E0000]/50 text-red-200 border-red-500/40',
          footerBorder: 'border-red-900/40',
        };
      case '4': // Yellow Theme (#FFF100)
        return {
          bgGradient: 'linear-gradient(to bottom, #FFF100 0%, #000000 30%, #000000 70%, #FFF100 100%)',
          ambientGlow: 'bg-[#FFF100]/20',
          hoverColor: 'group-hover:text-yellow-300',
          testBtn: 'bg-[#FFF100]/20 hover:bg-[#FFF100]/30 text-yellow-200 border-yellow-500/40',
          footerBorder: 'border-yellow-900/40',
        };
      case '5': // White Theme
        return {
          bgGradient: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 30%, #000000 70%, #FFFFFF 100%)',
          ambientGlow: 'bg-white/15',
          hoverColor: 'group-hover:text-white',
          testBtn: 'bg-white/20 hover:bg-white/30 text-white border-white/40',
          footerBorder: 'border-zinc-800',
        };
      case '6': // Pink Theme (#FF00F7)
        return {
          bgGradient: 'linear-gradient(to bottom, #FF00F7 0%, #000000 30%, #000000 70%, #FF00F7 100%)',
          ambientGlow: 'bg-[#FF00F7]/25',
          hoverColor: 'group-hover:text-pink-300',
          testBtn: 'bg-[#FF00F7]/25 hover:bg-[#FF00F7]/40 text-pink-200 border-pink-500/40',
          footerBorder: 'border-pink-900/40',
        };
      default: // Fallback Blue
        return {
          bgGradient: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)',
          ambientGlow: 'bg-blue-500/15',
          hoverColor: 'group-hover:text-blue-400',
          testBtn: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/40',
          footerBorder: 'border-blue-900/40',
        };
    }
  };

  const theme = getTheme(id);
  const isSkala2 = id === '2';

  // Mouse drag handlers for desktop smooth sliding across the module carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Modules data with custom curriculum subtitles for Skala 2 vs others
  const modulesData = isSkala2 ? [
    { num: 1, title: 'Modul 1', subtitle: 'Mengenal baris tanwin' },
    { num: 2, title: 'Modul 2', subtitle: 'Mengenal baris tanwin' },
    { num: 3, title: 'Modul 3', subtitle: 'Mengenal baris tanwin' },
    { num: 4, title: 'Modul 4', subtitle: 'Mengenal bentuk huruf bersambung' },
    { num: 5, title: 'Modul 5', subtitle: 'Mengenal bentuk huruf bersambung' },
    { num: 6, title: 'Modul 6', subtitle: 'Mengenal bentuk huruf bersambung' },
    { num: 7, title: 'Modul 7', subtitle: 'Mengenal bentuk huruf bersambung' },
    { num: 8, title: 'Modul 8', subtitle: 'Mengenal bentuk huruf bersambung' },
    { num: 9, title: 'Modul 9', subtitle: 'Mengenal bentuk huruf bersambung' },
    { num: 10, title: 'Modul 10', subtitle: 'Mengenal bentuk huruf bersambung' },
  ] : [
    { num: 1, title: 'Modul 1', subtitle: 'Mengenal huruf hijaiyah' },
    { num: 2, title: 'Modul 2', subtitle: 'Mengenal baris atas, bawah dan depan' },
    { num: 3, title: 'Modul 3', subtitle: 'Implimentasi baris atas, bawah dan depan' },
    { num: 4, title: 'Modul 4', subtitle: 'Implimentasi baris atas, bawah dan depan' },
    { num: 5, title: 'Modul 5', subtitle: 'Implimentasi baris atas, bawah dan depan' },
    { num: 6, title: 'Modul 6', subtitle: 'Implimentasi baris atas, bawah dan depan' },
    { num: 7, title: 'Modul 7', subtitle: 'Implimentasi baris atas, bawah dan depan' },
    { num: 8, title: 'Modul 8', subtitle: 'Implimentasi baris atas, bawah dan depan' },
    { num: 9, title: 'Modul 9', subtitle: 'Implimentasi baris atas, bawah dan depan' },
    { num: 10, title: 'Modul 10', subtitle: 'Implimentasi baris atas, bawah dan depan' },
  ];

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 overflow-x-hidden font-sans antialiased"
      style={{ background: theme.bgGradient }}
    >
      
      {/* Global Spin Animation Styles */}
      <style jsx global>{`
        @keyframes spinGradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinGradient 6s linear infinite;
        }
      `}</style>

      {/* Background Ambient Glow */}
      <div className={`absolute w-96 h-96 ${theme.ambientGlow} rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2`} />

      {/* SVG Gradient Definition for Circular Progress Bar */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Content Area */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-15 space-y-4 pt-6 pb-28 flex-1">
        
        {/* Hero / Header Section */}
        <div className="w-full text-center space-y-2.5 flex flex-col items-center">
          
          {/* Main Percentage Ring */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center drop-shadow-2xl mb-1">
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
                strokeDashoffset={100 - overallPercent}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            
            {/* Inner Ring Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[12px] uppercase tracking-wider font-semibold text-zinc-300">
                Sedang Belajar
              </span>
              <span className="text-[15px] uppercase tracking-wider font-extrabold text-emerald-400 my-0.5">
                Modul {currentModule}
              </span>
              <span className="text-[15px] font-bold font-mono text-white flex items-center gap-1">
                {isPending ? (
                  <span className="w-2.5 h-2.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  `${overallPercent}%`
                )}
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Skala {id}
          </h1>

          {/* Bulleted Subtitle List standardized to 15px */}
          <ul className="text-[15px] text-zinc-200 font-normal pt-1 space-y-1.5 text-left max-w-sm mx-auto w-full px-4">
            {isSkala2 ? (
              <>
                <li className="flex items-start whitespace-normal break-words">
                  <span className="mr-2 text-blue-400 shrink-0 font-bold">•</span>
                  <span className="leading-snug">Mengenal baris tanwin dan sabdu</span>
                </li>
                <li className="flex items-start whitespace-normal break-words">
                  <span className="mr-2 text-blue-400 shrink-0 font-bold">•</span>
                  <span className="leading-snug">Mengenal bentuk huruf bersambung</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start whitespace-normal break-words">
                  <span className="mr-2 text-blue-400 shrink-0 font-bold">•</span>
                  <span className="leading-snug">Mengenal huruf hijaiyah</span>
                </li>
                <li className="flex items-start whitespace-normal break-words">
                  <span className="mr-2 text-blue-400 shrink-0 font-bold">•</span>
                  <span className="leading-snug">Mengenal baris atas, bawah dan depan</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Modules Horizontal Sliding Carousel with Border Beam */}
        <section className="w-full pt-3 pb-2 relative z-10">
          <div className="relative w-full">
            {/* Spinning Glow Backdrop */}
            <div className="absolute -inset-1 rounded-3xl overflow-hidden opacity-30 blur-md pointer-events-none">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
            </div>

            {/* Spinning Border Container */}
            <div className="relative p-[1.5px] rounded-3xl overflow-hidden w-full shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
              
              {/* Entire Box Draggable & Styled */}
              <div 
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`relative w-full bg-zinc-950 backdrop-blur-3xl text-white rounded-[22px] py-5 px-0 flex flex-col gap-3.5 overflow-hidden border border-white/10 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
              >
                
                {/* Pinned Instruction Text standardized to 15px */}
                <p className="text-[15px] text-zinc-300 font-medium text-center leading-snug pointer-events-none px-4">
                  Pilih modul pembelajaran.
                </p>

                {/* Horizontally Scrolling Cards Container */}
                <div 
                  ref={scrollRef}
                  className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  <div className="flex gap-3.5 w-max py-1 px-4">
                    {modulesData.map((mod) => {
                      const isLocked = mod.num > 1 && mod.num > currentModule && (moduleProgressMap[mod.num - 1] || 0) < 100;
                      return (
                        <Link
                          key={mod.num}
                          href={`/skala/${id}/module/${mod.num}`}
                          onClick={(e) => handleModuleClick(e, mod.num)}
                          draggable={false}
                          className={`w-56 sm:w-60 rounded-2xl p-4 flex flex-col justify-start h-36 transition-all shadow-md group border shrink-0 text-center relative ${
                            isLocked 
                              ? 'bg-zinc-950/60 border-white/5 opacity-60 cursor-not-allowed' 
                              : 'bg-zinc-900/80 hover:bg-zinc-900 border-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full mb-2.5 pointer-events-none">
                            <h3 className={`text-[15px] font-bold tracking-tight text-white ${theme.hoverColor} transition-colors`}>
                              {mod.title}
                            </h3>
                            {isLocked && (
                              <span className="text-[15px] text-zinc-400 select-none" title="Berkunci">
                                🔒
                              </span>
                            )}
                          </div>

                          <ul className="space-y-1 text-left pointer-events-none mx-auto w-full">
                            <li className="text-[15px] text-zinc-200 leading-snug flex items-start whitespace-normal break-words">
                              <span className="mr-2 text-blue-400 shrink-0 font-bold">•</span>
                              <span className="line-clamp-2">{mod.subtitle}</span>
                            </li>
                          </ul>
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <div className="w-full pt-2 flex flex-col items-center text-center space-y-3">
          <span className="text-[15px] font-medium text-zinc-400">Atau</span>
          
          <div className="flex justify-center">
            <Link 
              href={`/skala/${id}/test?type=skala`}
              className={`inline-flex items-center justify-center py-2.5 px-7 rounded-full font-semibold text-[15px] text-white shadow-lg transition-transform hover:scale-105 bg-transparent border-2 ${theme.testBtn}`}
            >
              Mula Ujian Skala {id}
            </Link>
          </div>

          <p className="text-[15px] text-zinc-300 font-normal leading-relaxed max-w-sm pb-1 px-2">
            Sila ambil ujian skala ini untuk menilai pencapaian keseluruhan anda sebelum beralih ke Skala {parseInt(id) + 1}.
          </p>

          {/* Development Reset Button */}
          <button
            onClick={handleReset}
            className="text-[15px] text-red-400 hover:text-red-300 underline tracking-wider uppercase pt-1 transition-colors cursor-pointer"
          >
            [Dev] Reset Semua Pencapaian Skala {id}
          </button>
        </div>

      </div>

      {/* Locked Module Warning Popup Modal */}
      {lockedPopupModule !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-white/20 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-2xl mx-auto flex items-center justify-center text-[15px]">
              🔒
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-[15px] font-bold text-white">Modul Berkunci</h3>
              <p className="text-[15px] text-zinc-200 leading-relaxed">
                Anda perlu mengambil dan lulus <span className="text-emerald-400 font-semibold">Ujian Modul {lockedPopupModule - 1}</span> terlebih dahulu sebelum anda boleh mengakses Modul {lockedPopupModule}.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href={`/skala/${id}/module/${lockedPopupModule - 1}/test`}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[15px] shadow-lg transition-all"
              >
                Ambil Ujian Modul {lockedPopupModule - 1} Sekarang
              </Link>
              
              <button
                onClick={() => setLockedPopupModule(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-[15px] border border-white/10 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`w-full pt-3 pb-3 border-t ${theme.footerBorder} text-center text-[15px] text-white relative z-10 font-sans shrink-0`}>
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}