'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // User session state & Burger menu state
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);

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

  // Close burger menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.removeItem('iqra_user');
    setUser(null);
    window.location.href = '/';
  };

  // Mouse drag handlers for desktop smooth sliding across the entire Gojes box
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

  // Available Skala levels with updated bullets
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
        'Mengenal baris tanwin',
        'Mengenal bentuk huruf bersambung'
      ] 
    },
    { 
      num: 3, 
      bullets: [
        'Mengenal huruf Mad dan Sabdu',
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
            <div className="relative w-10 h-10 rounded-full overflow-hidden p-[1.5px] flex items-center justify-center">
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
              <div className="relative w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-sm font-bold text-white uppercase shadow-md">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
            </div>
            <span className="text-[15px] font-medium text-zinc-200 tracking-wide">Hai, {user.name}</span>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={menuRef}>
              <div className="relative w-10 h-10 rounded-full overflow-hidden p-[1.5px] flex items-center justify-center transition-transform hover:scale-105">
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="relative w-full h-full rounded-full bg-zinc-950/90 hover:bg-zinc-900 text-zinc-200 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                  title="Menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl py-2 z-35 backdrop-blur-3xl animate-fadeIn">
                  <Link 
                    href="/account" 
                    className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-zinc-200 hover:bg-zinc-900 transition-colors"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Akaun Saya
                  </Link>
                  
                  <Link 
                    href="/pencapaian" 
                    className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-zinc-200 hover:bg-zinc-900 transition-colors"
                  >
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                    Pencapaian
                  </Link>

                  <div className="border-t border-zinc-800 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-red-400 hover:bg-zinc-900 transition-colors text-left cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                    </svg>
                    Log Keluar
                  </button>
                </div>
              )}
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
      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-15 space-y-4 pt-3 pb-28 flex-1">
        
        {/* Hero / Header Section */}
        <div className="w-full text-center space-y-2">
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
          
          <h1 className="text-3xl font-bold tracking-tight text-white" style={{ letterSpacing: '-0.02em' }}>
            Iqra&apos; Master
          </h1>

          {!user && (
            <div className="pt-1 flex justify-center">
              <Link 
                href="/login"
                className="inline-flex items-center justify-center py-2.5 px-7 rounded-full font-semibold text-[15px] text-white shadow-lg transition-transform hover:scale-105 hover:opacity-90"
                style={{ backgroundColor: '#0000FF', letterSpacing: '-0.01em' }}
              >
                Get Started
              </Link>
            </div>
          )}

          <p className="text-[15px] text-zinc-300 font-normal pt-1 leading-snug">
            {user ? 'Selamat kembali!' : 'Selamat datang!'}
          </p>
        </div>

        {/* Skala Horizontal Sliding Carousel with Border Beam */}
        <section className="w-full pt-2 pb-2 relative z-10">
          <div className="relative w-full">
            {/* Spinning Glow Backdrop */}
            <div className="absolute -inset-1 rounded-3xl overflow-hidden opacity-30 blur-md pointer-events-none">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
            </div>

            {/* Spinning Border Container */}
            <div className="relative p-[1.5px] rounded-3xl overflow-hidden w-full shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
              
              <div 
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`relative w-full bg-zinc-950 backdrop-blur-3xl text-white rounded-[22px] py-5 px-0 flex flex-col gap-3.5 overflow-hidden border border-white/10 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
              >
                
                <p className="text-[15px] text-zinc-300 font-medium text-center leading-snug pointer-events-none px-4">
                  Pilih Skala di bawah untuk meneruskan pembelajaran.
                </p>

                <div 
                  ref={scrollRef}
                  className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  <div className="flex gap-3.5 w-max py-2 px-4">
                    {skalaData.map((item) => (
                      <Link
                        key={item.num}
                        href={`/skala/${item.num}`}
                        draggable={false}
                        className="w-60 sm:w-64 bg-zinc-900/80 hover:bg-zinc-900 rounded-2xl p-4.5 flex flex-col justify-start min-h-[175px] transition-all shadow-md group border border-white/10 shrink-0 text-center"
                      >
                        <h3 className="text-base font-bold tracking-tight text-white mb-3 group-hover:text-emerald-400 transition-colors pointer-events-none">
                          Skala {item.num}
                        </h3>

                        <ul className="space-y-2 text-left pointer-events-none mx-auto w-full">
                          {item.bullets.map((bullet, idx) => (
                            <li key={idx} className="text-[14px] text-zinc-200 leading-snug flex items-start whitespace-normal break-words">
                              <span className="mr-2 text-blue-400 shrink-0 font-bold">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <div className="w-full pt-2 flex flex-col items-center text-center space-y-3">
          <span className="text-[15px] font-medium text-zinc-400">Atau</span>
          
          <div className="flex justify-center w-full">
            <Link 
              href="/ujian-skala"
              className="inline-flex items-center justify-center py-2.5 px-7 rounded-full font-semibold text-[15px] text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-600/20 bg-transparent border-2"
              style={{ borderColor: '#0000FF', letterSpacing: '-0.01em' }}
            >
              Mula Ujian Skala
            </Link>
          </div>

          <p className="text-[15px] text-zinc-300 font-normal leading-relaxed max-w-sm px-2">
            Sila ambil ujian ini untuk mengenal pasti tahap penguasaan bacaan anda serta mengetahui skala sebenar yang paling sesuai untuk dimulakan.
          </p>
        </div>

      </div>

      {/* Footer Locked at the Very Bottom */}
      <footer className="w-full pt-3 pb-3 border-t border-blue-900/40 text-center text-[15px] text-blue-300 relative z-10 font-sans shrink-0">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}