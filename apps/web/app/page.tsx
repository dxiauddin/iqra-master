'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  // Available Skala levels
  const skalaLevels = [1, 2, 3, 4, 5, 6];

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 font-sans antialiased"
      style={{ background: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)' }}
    >
      
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

      {/* Top Bar: Profile/Login Icon Only (Top Right) */}
      <div className="max-w-4xl mx-auto w-full pt-4 px-4 flex justify-end items-start relative z-20">
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 blur-[2px] opacity-25 pointer-events-none" />
          <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 transition-transform hover:scale-105">
            <Link
              href="/login"
              className="w-11 h-11 rounded-full flex items-center justify-center bg-zinc-950/85 hover:bg-zinc-900 text-zinc-200 hover:text-white transition-all shadow-md"
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

      {/* Hero / Header Section: Apple-inspired typography scaling */}
      <div className="max-w-md mx-auto w-full pt-1 pb-3 text-center relative z-10 space-y-3">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto block transition-transform hover:scale-105 drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
          <Image 
            src="/logo-kagat.png" 
            alt="Iqra' Master Logo" 
            fill
            sizes="96px"
            priority
            className="object-contain"
          />
        </div>
        
        {/* Apple style prominent headline */}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Iqra&apos; Master
        </h1>

        {/* Get Started Button with Apple-like clear weight */}
        <div className="pt-1 flex justify-center">
          <Link 
            href="/login"
            className="inline-flex items-center justify-center py-2.5 px-7 rounded-full font-medium text-sm tracking-normal text-white shadow-lg transition-transform hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: '#0000FF' }}
          >
            Get Started
          </Link>
        </div>

        {/* Subtext description with improved readability */}
        <p className="text-sm text-zinc-300 font-normal pt-1.5 leading-relaxed">
          Atau <br /> Pilih Skala di bawah untuk memulakan pembelajaran anda.
        </p>
      </div>

      {/* Skala Circular Grid Hub (Theme Box) */}
      <section className="max-w-2xl mx-auto w-full pt-1 pb-3 flex flex-col items-center justify-start relative z-10">
        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 opacity-20 blur-sm pointer-events-none" />

          {/* Main Container Box */}
          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full">
            <div className="w-full bg-zinc-950/85 backdrop-blur-3xl text-white rounded-[22px] py-5 px-6 flex flex-col items-center gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/15">
              
              {/* Skala Selection Circles Grid with clearer font layout */}
              <div className="grid grid-cols-3 gap-5 sm:gap-6 justify-items-center w-full max-w-sm mx-auto">
                {skalaLevels.map((skalaNum) => (
                  <Link
                    key={skalaNum}
                    href={`/skala/${skalaNum}`}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all border border-white/20 bg-zinc-900/90 hover:bg-zinc-800 hover:border-white/50 text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:scale-105 group font-sans"
                  >
                    <span className="text-[11px] font-medium text-zinc-400 tracking-wide leading-none mb-1">Skala</span>
                    <span className="text-xl sm:text-2xl font-semibold group-hover:text-emerald-400 transition-colors leading-none">{skalaNum}</span>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Atau, Ujian Skala Button & Description */}
      <div className="max-w-md mx-auto w-full pb-6 px-6 flex flex-col items-center text-center relative z-10 space-y-2.5">
        <span className="text-xs font-medium text-zinc-400 tracking-widest uppercase">Atau</span>
        
        <div className="flex justify-center">
          <Link 
            href="/ujian-skala"
            className="inline-flex items-center justify-center py-2.5 px-7 rounded-full font-medium text-sm tracking-normal text-white shadow-lg transition-transform hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: '#0000FF' }}
          >
            Mula Ujian Skala
          </Link>
        </div>

        <p className="text-sm text-zinc-300 font-normal leading-relaxed max-w-sm pt-1">
          Sila ambil ujian ini untuk mengenal pasti tahap penguasaan bacaan anda serta mengetahui skala sebenar yang paling sesuai untuk dimulakan.
        </p>
      </div>

      {/* Footer */}
      <footer className="w-full pt-3 pb-4 border-t border-blue-900/40 text-center text-xs text-blue-300 relative z-10 font-sans">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}