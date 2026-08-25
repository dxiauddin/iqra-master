'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse drag handlers for desktop smooth sliding
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

  // Available Skala levels with updated bullet point details
  const skalaData = [
    { 
      num: 1, 
      bullets: [
        'Mengenal huruf hijaiyah',
        'Mengenal baris atas bawah dan depan'
      ] 
    },
    { 
      num: 2, 
      bullets: [
        'Mengenal baris tanwin dan sabdu',
        'Mengenal bentuk huruf bersambung'
      ] 
    },
    { 
      num: 3, 
      bullets: [
        'Mengenal huruf Mad',
        'Mengenal hukum Izhar Halqi',
        'Mengenal hukum Ikhfa Haqiqi'
      ] 
    },
    { 
      num: 4, 
      bullets: [
        'Mengenal huruf iklab',
        'Mengenal huruf Idgham maal ghunnah',
        'Mengenal huruf Idham bila ghunnah'
      ] 
    },
    { 
      num: 5, 
      bullets: [
        'Wakaf & Tanda-tanda Bacaan'
      ] 
    },
    { 
      num: 6, 
      bullets: [
        'Ayat Pilihan & Lancar Al-Quran'
      ] 
    },
  ];

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 overflow-x-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
      }}
    >
      
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

      {/* Top Bar: Profile/Login Icon Only (Top Right) */}
      <div className="max-w-4xl mx-auto w-full pt-3 px-4 flex justify-end items-start relative z-20 shrink-0">
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

      {/* Content Wrapper pinned to the top using pt-2 instead of my-auto */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-15 space-y-3 pt-2 pb-6">
        
        {/* Hero / Header Section */}
        <div className="w-full text-center space-y-1.5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto block transition-transform hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Image 
              src="/logo-kagat.png" 
              alt="Iqra' Master Logo" 
              fill
              sizes="96px"
              priority
              className="object-contain"
            />
          </div>
          
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white" style={{ letterSpacing: '-0.02em' }}>
            Iqra&apos; Master
          </h1>

          <div className="pt-0.5 flex justify-center">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center py-1.5 px-5 rounded-full font-medium text-xs text-white shadow-lg transition-transform hover:scale-105 hover:opacity-90"
              style={{ backgroundColor: '#0000FF', letterSpacing: '-0.01em' }}
            >
              Get Started
            </Link>
          </div>

          <p className="text-xs text-zinc-300 font-normal pt-1 leading-snug" style={{ letterSpacing: '-0.005em' }}>
            Pilih Skala di bawah untuk memulakan pembelajaran anda.
          </p>
        </div>

        {/* Skala Horizontal Sliding Carousel (Gojes Box) */}
        <section className="w-full pt-1 pb-1 relative z-10">
          <div className="relative w-full">
            {/* Gojes Box Outer Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 opacity-20 blur-sm pointer-events-none" />

            {/* Gojes Box Container */}
            <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full">
              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`w-full bg-zinc-950 backdrop-blur-3xl text-white rounded-[22px] py-3 px-3 overflow-x-auto scrollbar-none shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/15 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                <div className="flex gap-3 w-max py-1">
                  {skalaData.map((item) => (
                    <Link
                      key={item.num}
                      href={`/skala/${item.num}`}
                      draggable={false}
                      className="w-52 sm:w-56 bg-zinc-900/80 hover:bg-zinc-900 rounded-xl p-3.5 flex flex-col justify-start h-32 transition-all shadow-md group border border-white/10 shrink-0 text-center"
                    >
                      <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white mb-2 group-hover:text-emerald-400 transition-colors pointer-events-none">
                        Skala {item.num}
                      </h3>

                      <ul className="space-y-1 text-left pointer-events-none mx-auto w-full">
                        {item.bullets.map((bullet, idx) => (
                          <li key={idx} className="text-[10px] sm:text-[11px] text-zinc-300 leading-tight flex items-start">
                            <span className="mr-1.5 text-blue-400">•</span>
                            <span className="line-clamp-1">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section: Atau & Mula Ujian Skala Button */}
        <div className="w-full pt-1 flex flex-col items-center text-center space-y-2">
          <span className="text-xs font-medium text-zinc-400">Atau</span>
          
          <div className="flex justify-center">
            <Link 
              href="/ujian-skala"
              className="inline-flex items-center justify-center py-2 px-6 rounded-full font-medium text-xs text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-600/20 bg-transparent border-2"
              style={{ borderColor: '#0000FF', letterSpacing: '-0.01em' }}
            >
              Mula Ujian Skala
            </Link>
          </div>

          <p className="text-xs text-zinc-300 font-normal leading-snug max-w-sm" style={{ letterSpacing: '-0.005em' }}>
            Sila ambil ujian ini untuk mengenal pasti tahap penguasaan bacaan anda serta mengetahui skala sebenar yang paling sesuai untuk dimulakan.
          </p>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full pt-3 pb-3 border-t border-blue-900/40 text-center text-xs text-blue-300 relative z-10 font-sans shrink-0">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}