'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string; modNum: string }>;
}

export default function ModuleTestPage({ params }: PageProps) {
  const { id, modNum } = use(params);

  // Dynamic theme configuration based on exact custom color codes
  const getTheme = (skalaId: string) => {
    switch (skalaId) {
      case '1': // Green Theme (#00472B)
        return {
          bgGradient: 'linear-gradient(to bottom, #00472B 0%, #000000 30%, #000000 70%, #00472B 100%)',
          ambientGlow: 'bg-[#00472B]/30',
          footerBorder: 'border-emerald-900/40',
          footerText: 'text-emerald-300/80',
        };
      case '2': // Purple Theme (#54009E)
        return {
          bgGradient: 'linear-gradient(to bottom, #54009E 0%, #000000 30%, #000000 70%, #54009E 100%)',
          ambientGlow: 'bg-[#54009E]/30',
          footerBorder: 'border-purple-900/40',
          footerText: 'text-purple-300/80',
        };
      case '3': // Red Theme (#9E0000)
        return {
          bgGradient: 'linear-gradient(to bottom, #9E0000 0%, #000000 30%, #000000 70%, #9E0000 100%)',
          ambientGlow: 'bg-[#9E0000]/30',
          footerBorder: 'border-red-900/40',
          footerText: 'text-red-300/80',
        };
      case '4': // Yellow Theme (#FFF100)
        return {
          bgGradient: 'linear-gradient(to bottom, #FFF100 0%, #000000 30%, #000000 70%, #FFF100 100%)',
          ambientGlow: 'bg-[#FFF100]/20',
          footerBorder: 'border-yellow-900/40',
          footerText: 'text-yellow-200/80',
        };
      case '5': // White Theme
        return {
          bgGradient: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 30%, #000000 70%, #FFFFFF 100%)',
          ambientGlow: 'bg-white/15',
          footerBorder: 'border-zinc-800',
          footerText: 'text-zinc-400',
        };
      case '6': // Pink Theme (#FF00F7)
        return {
          bgGradient: 'linear-gradient(to bottom, #FF00F7 0%, #000000 30%, #000000 70%, #FF00F7 100%)',
          ambientGlow: 'bg-[#FF00F7]/25',
          footerBorder: 'border-pink-900/40',
          footerText: 'text-pink-300/80',
        };
      default: // Fallback Blue
        return {
          bgGradient: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)',
          ambientGlow: 'bg-blue-500/15',
          footerBorder: 'border-blue-900/40',
          footerText: 'text-blue-300',
        };
    }
  };

  const theme = getTheme(id);

  // Module test score percentage state
  const [scorePercent, setScorePercent] = useState(0);

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 font-sans antialiased"
      style={{ background: theme.bgGradient }}
    >
      
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

      {/* Top Bar: Circular Progress Ring on Top Left */}
      <div className="max-w-4xl mx-auto w-full pt-6 px-4 flex justify-between items-start relative z-20">
        
        {/* Top Left: Larger Circular Ring with "Markah" Below */}
        <div className="flex flex-col items-start">
          <div className="relative w-16 h-16 flex items-center justify-center drop-shadow-lg">
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
                strokeDashoffset={100 - scorePercent}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-white">
              {scorePercent}%
            </span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mt-1 pl-1">
            Markah
          </span>
        </div>

      </div>

      {/* Hero / Header Section with Clickable Logo Back to Module */}
      <div className="max-w-3xl mx-auto w-full pt-2 pb-2 text-center relative z-10 space-y-1">
        <Link 
          href={`/skala/${id}/module/${modNum}`}
          className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto block transition-transform hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          title={`Kembali ke Modul ${modNum}`}
        >
          <Image 
            src="/logo-kagat.png" 
            alt="Iqra' Master Logo" 
            fill
            sizes="112px"
            priority
            className="object-contain"
          />
        </Link>

        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block pt-1">
          Skala {id} &bull; Modul {modNum}
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ujian Modul {modNum}</h1>
        <p className="text-xs text-zinc-400">Sila jawab soalan penilaian bagi Modul {modNum} dengan teliti.</p>
      </div>

      {/* Central Interactive Content Hub with Consistent Gradient Border Glow */}
      <section className="max-w-2xl mx-auto w-full pt-2 pb-12 flex-1 flex flex-col items-center justify-start relative z-10">
        <div className="relative w-full max-w-lg">
          {/* Subtle Multi-Color Shadow Backing */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 opacity-20 blur-sm pointer-events-none" />

          {/* Main Container Box with Theme Border Glow */}
          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full">
            <div className="w-full bg-zinc-950/85 backdrop-blur-3xl text-white rounded-[22px] py-7 px-6 flex flex-col items-center gap-6 shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/15">
              
              <span className="text-xs font-semibold tracking-wide text-zinc-300">
                Soalan Ujian Modul {modNum} (1 / 5)
              </span>

              {/* Assessment Question Mock Container */}
              <div className="w-full bg-zinc-900/90 border border-white/15 rounded-2xl p-6 text-center space-y-4">
                <p className="text-sm text-zinc-200 font-medium">Pilih sebutan yang betul untuk huruf:</p>
                <div className="text-4xl font-bold font-arabic py-2 text-white">أ</div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => setScorePercent(100)}
                    className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold transition-all"
                  >
                    A. a / i / u
                  </button>
                  <button 
                    onClick={() => setScorePercent(0)}
                    className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold transition-all"
                  >
                    B. ba / bi / bu
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`w-full pt-4 pb-4 border-t ${theme.footerBorder} text-center text-xs ${theme.footerText} relative z-10 font-sans`}>
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}