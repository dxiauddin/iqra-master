'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SkalaDashboardPage({ params }: PageProps) {
  const { id } = use(params);

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

  // Grouped module rows: 1,2,3 | 4,5,6 | 7,8,9 | 10
  const row1 = [1, 2, 3];
  const row2 = [4, 5, 6];
  const row3 = [7, 8, 9];
  const row4 = [10];

  // Skala progress percentage
  const progressPercent = 0;

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

      {/* Top Bar: Larger Circular Progress + Pencapaian label below ring (Top Left) & Ujian Skala Button (Top Right) */}
      <div className="max-w-4xl mx-auto w-full pt-6 px-4 flex justify-between items-start relative z-20">
        
        {/* Top Left: Bigger Progress Ring with "Pencapaian" placed right below */}
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

        {/* Top Right: Ujian Skala Button */}
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 blur-[2px] opacity-25 pointer-events-none" />
          <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 transition-transform hover:scale-105">
            <Link
              href={`/skala/${id}/test?type=skala`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-950/85 hover:bg-zinc-900 transition-all shadow-md flex items-center gap-1.5 ${theme.testBtn}`}
              title={`Ujian Skala ${id}`}
            >
              Ujian Skala {id}
            </Link>
          </div>
        </div>

      </div>

      {/* Hero / Header Section: Exact Layout and Spot Matching Home Page (/) */}
      <div className="max-w-3xl mx-auto w-full pt-2 pb-4 text-center relative z-10 space-y-3">
        <Link 
          href="/" 
          className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto block transition-transform hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          title="Kembali ke Laman Utama"
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
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Skala {id}</h1>
        <p className="text-blue-100 text-xs sm:text-sm max-w-md mx-auto">
          Pilih modul pembelajaran di bawah untuk memulakan latihan anda.
        </p>
      </div>

      {/* Module Circular Grid Hub with Exact Gradient Border Glow Spot as Homepage */}
      <section className="max-w-2xl mx-auto w-full pt-2 pb-12 flex-1 flex flex-col items-center justify-start relative z-10">
        <div className="relative w-full max-w-lg">
          {/* Subtle Multi-Color Shadow Backing */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 opacity-20 blur-sm pointer-events-none" />

          {/* Main Container Box */}
          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full">
            <div className="w-full bg-zinc-950/85 backdrop-blur-3xl text-white rounded-[22px] py-7 px-6 flex flex-col items-center gap-5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/15">
              
              <span className="text-xs font-semibold tracking-wide text-zinc-300">
                Pilih Modul Pembelajaran
              </span>

              {/* Module Circular Grid (1, 2, 3 | 4, 5, 6 | 7, 8, 9 | 10) */}
              <div className="flex flex-col gap-4 w-full max-w-xs mx-auto items-center">
                {/* Row 1: 1, 2, 3 */}
                <div className="grid grid-cols-3 gap-4 justify-items-center w-full">
                  {row1.map((modNum) => (
                    <Link
                      key={modNum}
                      href={`/skala/${id}/module/${modNum}`}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all border border-white/20 bg-zinc-900/90 hover:bg-zinc-800 hover:border-white/50 text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:scale-105 group font-sans"
                    >
                      <span className="text-[10px] font-medium text-zinc-400 tracking-tighter leading-none mb-1">Modul</span>
                      <span className={`text-lg sm:text-xl font-bold transition-colors leading-none ${theme.hoverColor}`}>{modNum}</span>
                    </Link>
                  ))}
                </div>

                {/* Row 2: 4, 5, 6 */}
                <div className="grid grid-cols-3 gap-4 justify-items-center w-full">
                  {row2.map((modNum) => (
                    <Link
                      key={modNum}
                      href={`/skala/${id}/module/${modNum}`}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all border border-white/20 bg-zinc-900/90 hover:bg-zinc-800 hover:border-white/50 text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:scale-105 group font-sans"
                    >
                      <span className="text-[10px] font-medium text-zinc-400 tracking-tighter leading-none mb-1">Modul</span>
                      <span className={`text-lg sm:text-xl font-bold transition-colors leading-none ${theme.hoverColor}`}>{modNum}</span>
                    </Link>
                  ))}
                </div>

                {/* Row 3: 7, 8, 9 */}
                <div className="grid grid-cols-3 gap-4 justify-items-center w-full">
                  {row3.map((modNum) => (
                    <Link
                      key={modNum}
                      href={`/skala/${id}/module/${modNum}`}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all border border-white/20 bg-zinc-900/90 hover:bg-zinc-800 hover:border-white/50 text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:scale-105 group font-sans"
                    >
                      <span className="text-[10px] font-medium text-zinc-400 tracking-tighter leading-none mb-1">Modul</span>
                      <span className={`text-lg sm:text-xl font-bold transition-colors leading-none ${theme.hoverColor}`}>{modNum}</span>
                    </Link>
                  ))}
                </div>

                {/* Row 4: 10 */}
                <div className="flex items-center justify-center w-full">
                  {row4.map((modNum) => (
                    <Link
                      key={modNum}
                      href={`/skala/${id}/module/${modNum}`}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all border border-white/20 bg-zinc-900/90 hover:bg-zinc-800 hover:border-white/50 text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:scale-105 group font-sans"
                    >
                      <span className="text-[10px] font-medium text-zinc-400 tracking-tighter leading-none mb-1">Modul</span>
                      <span className={`text-lg sm:text-xl font-bold transition-colors leading-none ${theme.hoverColor}`}>{modNum}</span>
                    </Link>
                  ))}
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