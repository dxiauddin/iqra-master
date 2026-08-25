'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  // Available Skala levels with descriptions for the card layout
  const skalaData = [
    { num: 1, desc: 'Asas Huruf Hijaiyah Tunggal' },
    { num: 2, desc: 'Huruf Bersambung & Baris Atas' },
    { num: 3, desc: 'Baris Bawah, Depan & Tanwin' },
    { num: 4, desc: 'Mad Asli & Huruf Mad' },
    { num: 5, desc: 'Wakaf & Tanda-tanda Bacaan' },
    { num: 6, desc: 'Ayat Pilihan & Lancar Al-Quran' },
  ];

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 font-sans antialiased overflow-x-hidden"
      style={{ background: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)' }}
    >
      
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

      {/* Top Bar: Profile/Login Icon Only (Top Right) */}
      <div className="max-w-4xl mx-auto w-full pt-3 px-4 flex justify-end items-start relative z-20">
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 blur-[2px] opacity-25 pointer-events-none" />
          <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 transition-transform hover:scale-105">
            <Link
              href="/login"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-950/85 hover:bg-zinc-900 text-zinc-200 hover:text-white transition-all shadow-md"
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

      {/* Hero / Header Section: Shifted higher to prevent scrolling */}
      <div className="max-w-md mx-auto w-full pt-0 pb-1 text-center relative z-10 space-y-1.5">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto block transition-transform hover:scale-105 drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
          <Image 
            src="/logo-kagat.png" 
            alt="Iqra' Master Logo" 
            fill
            sizes="80px"
            priority
            className="object-contain"
          />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Iqra&apos; Master
        </h1>

        <div className="pt-0.5 flex justify-center">
          <Link 
            href="/login"
            className="inline-flex items-center justify-center py-2 px-6 rounded-full font-medium text-xs tracking-normal text-white shadow-lg transition-transform hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: '#0000FF' }}
          >
            Get Started
          </Link>
        </div>

        <p className="text-xs text-zinc-300 font-normal pt-0.5 leading-snug">
          Atau <br /> Pilih Skala di bawah untuk memulakan pembelajaran anda.
        </p>
      </div>

      {/* Skala Horizontal Sliding Carousel with Hidden Scrollbar */}
      <section className="max-w-4xl mx-auto w-full pt-1 pb-2 relative z-10">
        <div 
          className="relative w-full overflow-x-auto px-4 scrollbar-none"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none',  // Internet Explorer 10+
          }}
        >
          {/* Inline style to hide scrollbar for Chrome, Safari, and Opera */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex gap-4 w-max py-2">
            {skalaData.map((item) => (
              <div key={item.num} className="relative w-48 sm:w-56 shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 opacity-20 blur-sm pointer-events-none" />
                
                <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full h-full">
                  <Link
                    href={`/skala/${item.num}`}
                    className="w-full bg-zinc-950/90 backdrop-blur-3xl text-white rounded-[14px] p-4 flex flex-col justify-between h-36 hover:bg-zinc-900 transition-all shadow-xl group border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Tahap</span>
                      <span className="text-lg font-bold text-blue-400 group-hover:text-emerald-400 transition-colors">0{item.num}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold tracking-tight text-white">Skala {item.num}</h3>
                      <p className="text-[11px] text-zinc-400 leading-tight line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Section: Atau, Ujian Skala Button & Description */}
      <div className="max-w-md mx-auto w-full pb-3 px-6 flex flex-col items-center text-center relative z-10 space-y-1.5">
        <span className="text-xs font-medium text-zinc-400 tracking-widest uppercase">Atau</span>
        
        <div className="flex justify-center">
          <Link 
            href="/ujian-skala"
            className="inline-flex items-center justify-center py-2 px-6 rounded-full font-medium text-xs tracking-normal text-white shadow-lg transition-transform hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: '#0000FF' }}
          >
            Mula Ujian Skala
          </Link>
        </div>

        <p className="text-xs text-zinc-300 font-normal leading-snug max-w-sm">
          Sila ambil ujian ini untuk mengenal pasti tahap penguasaan bacaan anda serta mengetahui skala sebenar yang paling sesuai untuk dimulakan.
        </p>
      </div>

      {/* Footer */}
      <footer className="w-full pt-2 pb-3 border-t border-blue-900/40 text-center text-xs text-blue-300 relative z-10 font-sans">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}