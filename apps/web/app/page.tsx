'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  // Available Skala levels
  const skalaLevels = [1, 2, 3, 4, 5, 6];

  // Overall app progress percentage mock
  const progressPercent = 0;

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 font-sans antialiased"
      style={{ background: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)' }}
    >
      
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

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

      {/* Top Bar: Circular Progress Ring (Top Left) & Login/Profile Icon (Top Right) */}
      <div className="max-w-4xl mx-auto w-full pt-6 px-4 flex justify-between items-start relative z-20">
        
        {/* Top Left: Larger Progress Ring with "Tahap Skala Anda" placed right below */}
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
            Tahap Skala Anda
          </span>
        </div>

        {/* Top Right: Profile / Login Icon with Multi-Color Border */}
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 blur-[2px] opacity-25 pointer-events-none" />
          <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 transition-transform hover:scale-105">
            <Link
              href="/login"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-950/85 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all shadow-md"
              title="Log Masuk"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
                />
              </svg>
            </Link>
          </div>
        </div>

      </div>

      {/* Hero / Header Section with Larger Logo */}
      <div className="max-w-3xl mx-auto w-full pt-2 pb-4 text-center relative z-10 space-y-3">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto block transition-transform hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <Image 
            src="/logo-kagat.png" 
            alt="Iqra' Master Logo" 
            fill
            sizes="112px"
            priority
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Iqra&apos; Master</h1>
        <p className="text-blue-100 text-xs sm:text-sm max-w-md mx-auto">
          Pilih tahap Skala di bawah untuk memulakan pembelajaran anda.
        </p>
      </div>

      {/* Skala Circular Grid Hub */}
      <section className="max-w-2xl mx-auto w-full pt-2 pb-12 flex-1 flex flex-col items-center justify-start relative z-10">
        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 opacity-20 blur-sm pointer-events-none" />

          {/* Main Container Box */}
          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full">
            <div className="w-full bg-zinc-950/85 backdrop-blur-3xl text-white rounded-[22px] py-7 px-6 flex flex-col items-center gap-5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/15">
              
              <span className="text-xs font-semibold tracking-wide text-zinc-300">
                Pilih Tahap Skala
              </span>

              {/* Skala Selection Circles Grid */}
              <div className="grid grid-cols-3 gap-6 sm:gap-8 justify-items-center w-full max-w-xs mx-auto">
                {skalaLevels.map((skalaNum) => (
                  <Link
                    key={skalaNum}
                    href={`/skala/${skalaNum}`}
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center transition-all border border-white/20 bg-zinc-900/90 hover:bg-zinc-800 hover:border-white/50 text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:scale-105 group font-sans"
                  >
                    <span className="text-[10px] font-medium text-zinc-400 tracking-tighter leading-none mb-1">Skala</span>
                    <span className="text-xl sm:text-2xl font-bold group-hover:text-emerald-400 transition-colors leading-none">{skalaNum}</span>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full pt-4 pb-4 border-t border-blue-900/40 text-center text-xs text-blue-300 relative z-10 font-sans">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}