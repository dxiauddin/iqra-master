'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string; modNum: string }>;
}

export default function DynamicModulePage({ params }: PageProps) {
  const { id, modNum } = use(params);

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
          footerText: 'text-emerald-300/80',
        };
      case '2': // Purple Theme (#54009E)
        return {
          bgGradient: 'linear-gradient(to bottom, #54009E 0%, #000000 30%, #000000 70%, #54009E 100%)',
          ambientGlow: 'bg-[#54009E]/30',
          hoverColor: 'group-hover:text-purple-300',
          testBtn: 'bg-[#54009E]/30 hover:bg-[#54009E]/50 text-purple-200 border-purple-500/40',
          footerBorder: 'border-purple-900/40',
          footerText: 'text-purple-300/80',
        };
      case '3': // Red Theme (#9E0000)
        return {
          bgGradient: 'linear-gradient(to bottom, #9E0000 0%, #000000 30%, #000000 70%, #9E0000 100%)',
          ambientGlow: 'bg-[#9E0000]/30',
          hoverColor: 'group-hover:text-red-400',
          testBtn: 'bg-[#9E0000]/30 hover:bg-[#9E0000]/50 text-red-200 border-red-500/40',
          footerBorder: 'border-red-900/40',
          footerText: 'text-red-300/80',
        };
      case '4': // Yellow Theme (#FFF100)
        return {
          bgGradient: 'linear-gradient(to bottom, #FFF100 0%, #000000 30%, #000000 70%, #FFF100 100%)',
          ambientGlow: 'bg-[#FFF100]/20',
          hoverColor: 'group-hover:text-yellow-300',
          testBtn: 'bg-[#FFF100]/20 hover:bg-[#FFF100]/30 text-yellow-200 border-yellow-500/40',
          footerBorder: 'border-yellow-900/40',
          footerText: 'text-yellow-200/80',
        };
      case '5': // White Theme
        return {
          bgGradient: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 30%, #000000 70%, #FFFFFF 100%)',
          ambientGlow: 'bg-white/15',
          hoverColor: 'group-hover:text-white',
          testBtn: 'bg-white/20 hover:bg-white/30 text-white border-white/40',
          footerBorder: 'border-zinc-800',
          footerText: 'text-zinc-400',
        };
      case '6': // Pink Theme (#FF00F7)
        return {
          bgGradient: 'linear-gradient(to bottom, #FF00F7 0%, #000000 30%, #000000 70%, #FF00F7 100%)',
          ambientGlow: 'bg-[#FF00F7]/25',
          hoverColor: 'group-hover:text-pink-300',
          testBtn: 'bg-[#FF00F7]/25 hover:bg-[#FF00F7]/40 text-pink-200 border-pink-500/40',
          footerBorder: 'border-pink-900/40',
          footerText: 'text-pink-300/80',
        };
      default: // Fallback Blue
        return {
          bgGradient: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)',
          ambientGlow: 'bg-blue-500/15',
          hoverColor: 'group-hover:text-blue-400',
          testBtn: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/40',
          footerBorder: 'border-blue-900/40',
          footerText: 'text-blue-300',
        };
    }
  };

  const theme = getTheme(id);

  // Mock dataset for testing the live percentage ring:
  const moduleData: Record<string, { title: string; items: { id: number; arabic: string; name: string; sound: string }[] }> = {
    '1': {
      title: 'Pengenalan Huruf Hijaiyah',
      items: [
        { id: 1, arabic: 'أ', name: 'Alif', sound: 'a / i / u' },
        { id: 2, arabic: 'ب', name: 'Ba', sound: 'ba / bi / bu' },
        { id: 3, arabic: 'ت', name: 'Ta', sound: 'ta / ti / tu' },
        { id: 4, arabic: 'ث', name: 'Tha', sound: 'tha / thi / thu' },
      ],
    },
    'default': {
      title: `Kandungan Skala ${id} - Modul ${modNum}`,
      items: [
        { id: 1, arabic: 'ج', name: 'Jim', sound: 'ja / ji / ju' },
        { id: 2, arabic: 'ح', name: 'Ha', sound: 'ha / hi / hu' },
        { id: 3, arabic: 'خ', name: 'Kha', sound: 'kha / khi / khu' },
      ],
    }
  };

  const currentModule = moduleData[modNum] || moduleData['default'];

  // Track completed items to calculate percentage
  const [completedItems, setCompletedItems] = useState<number[]>([]);

  const toggleComplete = (itemId: number) => {
    if (completedItems.includes(itemId)) {
      setCompletedItems(completedItems.filter((i) => i !== itemId));
    } else {
      setCompletedItems([...completedItems, itemId]);
    }
  };

  // Calculate live percentage
  const progressPercent = Math.round((completedItems.length / currentModule.items.length) * 100);

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

      {/* Top Bar: Circular Progress (Top Left) & Ujian Modul Button (Top Right) */}
      <div className="max-w-4xl mx-auto w-full pt-6 px-4 flex justify-between items-start relative z-20">
        
        {/* Top Left: Larger Progress Ring with "Pencapaian" placed right below */}
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
                strokeDashoffset={100 - progressPercent}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-white">
              {progressPercent}%
            </span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mt-1 pl-1">
            Pencapaian
          </span>
        </div>

        {/* Top Right: Ujian Modul Button */}
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 blur-[2px] opacity-25 pointer-events-none" />
          <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 transition-transform hover:scale-105">
            <Link
              href={`/skala/${id}/module/${modNum}/test`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-950/85 hover:bg-zinc-900 transition-all shadow-md flex items-center gap-1.5 ${theme.testBtn}`}
              title={`Ujian Modul ${modNum}`}
            >
              Ujian Modul {modNum}
            </Link>
          </div>
        </div>

      </div>

      {/* Hero / Header Section with Clickable Logo Back to Skala */}
      <div className="max-w-3xl mx-auto w-full pt-2 pb-2 text-center relative z-10 space-y-1">
        <Link 
          href={`/skala/${id}`}
          className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto block transition-transform hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          title={`Kembali ke Skala ${id}`}
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
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{currentModule.title}</h1>
        <p className="text-xs text-zinc-400">Klik kad pembelajaran di bawah untuk menguji penjejakan peratusan.</p>
      </div>

      {/* Interactive Cards Hub */}
      <section className="max-w-2xl mx-auto w-full pt-2 pb-12 flex-1 flex flex-col items-center justify-start relative z-10">
        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 opacity-20 blur-sm pointer-events-none" />

          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full">
            <div className="w-full bg-zinc-950/85 backdrop-blur-3xl text-white rounded-[22px] py-7 px-6 flex flex-col items-center gap-5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/15">
              
              <span className="text-xs font-semibold tracking-wide text-zinc-300">
                Item Pembelajaran Modul {modNum}
              </span>

              {/* Grid of Cards */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {currentModule.items.map((item) => {
                  const isDone = completedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleComplete(item.id)}
                      className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center transition-all border ${
                        isDone 
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]' 
                          : 'bg-zinc-900/90 border-white/15 hover:border-white/40 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-4xl font-bold font-arabic mb-2 text-white">{item.arabic}</span>
                      <span className="text-xs font-semibold text-zinc-300">{item.name}</span>
                      <span className="text-[10px] text-zinc-500">{item.sound}</span>
                      <span className={`mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                        {isDone ? 'Selesai ✓' : 'Belum'}
                      </span>
                    </div>
                  );
                })}
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