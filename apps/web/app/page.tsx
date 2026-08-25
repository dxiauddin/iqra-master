'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // User session state
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in via localStorage
    const storedUser = localStorage.getItem('iqra_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user session');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('iqra_user');
    setUser(null);
    window.location.href = '/';
  };

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

  // Available Skala levels
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
      className="min-h-screen text-white flex flex-col items-center justify-start relative px-4 overflow-x-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
      }}
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
      <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

      {/* Top Bar: Dynamic User Profile vs Login Icon */}
      <div className="max-w-4xl mx-auto w-full pt-3 px-4 flex justify-between items-center relative z-20 shrink-0">
        {user ? (
          <div className="flex items-center gap-2.5">
            {/* Spinning Gojes Ring around Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden p-[1.5px] flex items-center justify-center">
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
              <div className="relative w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold text-white uppercase shadow-md">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
            </div>
            <span className="text-xs font-medium text-zinc-200 tracking-wide">Hai, {user.name}</span>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden p-[1.5px] flex items-center justify-center transition-transform hover:scale-105">
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#EF4444,#F97316,#EF4444)] animate-spin-slow" />
              <button
                onClick={handleLogout}
                className="relative w-full h-full rounded-full bg-zinc-950/90 hover:bg-zinc-900 text-red-400 hover:text-red-300 flex items-center justify-center transition-all shadow-md cursor-pointer"
                title="Log Keluar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative w-10 h-10 rounded-full overflow-hidden p-[1.5px] flex items-center justify-center transition-transform hover:scale-105">
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
              <Link
                href="/login"
                className="relative w-full h-full rounded-full bg-zinc-950/90 hover:bg-zinc-900 text-zinc-200 hover:text-white flex items-center justify-center transition-all shadow-md"
                title="Log Masuk"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-15 space-y-3 pt-2 pb-8">
        
        {/* Hero / Header Section */}
        <div className="w-full text-center space-y-1.5">
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
          
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white" style={{ letterSpacing: '-0.02em' }}>
            Iqra&apos; Master
          </h1>

          {!user && (
            <div className="pt-0.5 flex justify-center">
              <Link 
                href="/login"
                className="inline-flex items-center justify-center py-2 px-6 rounded-full font-medium text-xs text-white shadow-lg transition-transform hover:scale-105 hover:opacity-90"
                style={{ backgroundColor: '#0000FF', letterSpacing: '-0.01em' }}
              >
                Get Started
              </Link>
            </div>
          )}

          <p className="text-xs text-zinc-300 font-normal pt-1 leading-snug" style={{ letterSpacing: '-0.005em' }}>
            {user ? 'Selamat kembali! Pilih Skala di bawah untuk meneruskan pembelajaran.' : 'Pilih Skala di bawah untuk memulakan pembelajaran anda.'}
          </p>
        </div>

        {/* Skala Horizontal Sliding Carousel with Spinning Gojes Border */}
        <section className="w-full pt-1 pb-1 relative z-10">
          <div className="relative w-full">
            {/* Spinning Glow Backdrop */}
            <div className="absolute -inset-1 rounded-3xl overflow-hidden opacity-30 blur-md pointer-events-none">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
            </div>

            {/* Spinning Border Container */}
            <div className="relative p-[1.5px] rounded-3xl overflow-hidden w-full shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
              
              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`relative w-full bg-zinc-950 backdrop-blur-3xl text-white rounded-[22px] py-3 px-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-white/10 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
              >
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

        {/* Bottom Section */}
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
      <footer className="w-full mt-auto pt-3 pb-3 border-t border-blue-900/40 text-center text-xs text-blue-300 relative z-10 font-sans shrink-0">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}