'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function BottomNav() {
  const [user, setUser] = useState<any>(null);
  const [showSkalaPopup, setShowSkalaPopup] = useState(false);
  const [showModulePopup, setShowModulePopup] = useState(false);
  
  const skalaRef = useRef<HTMLDivElement>(null);
  const moduleRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('iqra_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  // Extract current Skala number from pathname if available (e.g., /skala/3/module/10 -> 3)
  const skalaMatch = pathname.match(/\/skala\/(\d+)/);
  const currentSkala = skalaMatch ? skalaMatch[1] : '1';

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skalaRef.current && !skalaRef.current.contains(event.target as Node)) {
        setShowSkalaPopup(false);
      }
      if (moduleRef.current && !moduleRef.current.contains(event.target as Node)) {
        setShowModulePopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 pointer-events-auto">
      
      {/* Skala 1-6 Popup */}
      {showSkalaPopup && (
        <div ref={skalaRef} className="absolute bottom-16 left-0 w-full bg-zinc-950/5 backdrop-blur-[2px] border border-white/5 rounded-2xl p-3 shadow-[0_8px_25px_rgba(0,0,0,0.15)] animate-fadeIn mb-2">
          <p className="text-[10px] font-semibold text-zinc-300 text-center mb-2">Pilih Skala Pembelajaran</p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Link
                key={num}
                href={`/skala/${num}`}
                onClick={() => setShowSkalaPopup(false)}
                className="bg-zinc-900/40 hover:bg-zinc-800/60 text-white rounded-xl py-2 text-center text-xs font-semibold transition-colors border border-white/5"
              >
                Skala {num}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Module 1-10 Popup (Transparent glass, Modul 1 naming, 2-column grid layout) */}
      {showModulePopup && (
        <div ref={moduleRef} className="absolute bottom-16 left-0 w-full bg-zinc-950/5 backdrop-blur-[2px] border border-white/5 rounded-2xl p-3 shadow-[0_8px_25px_rgba(0,0,0,0.15)] animate-fadeIn mb-2 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <p className="text-[10px] font-semibold text-zinc-300 text-center mb-2">Pilih Modul Skala {currentSkala}</p>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((mod) => (
              <Link
                key={mod}
                href={`/skala/${currentSkala}/module/${mod}`}
                onClick={() => setShowModulePopup(false)}
                className="bg-zinc-900/40 hover:bg-zinc-800/60 text-white rounded-xl py-2 text-center text-xs font-semibold transition-colors border border-white/5"
              >
                Modul {mod}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="w-full bg-zinc-950/5 backdrop-blur-[2px] text-white rounded-full px-4 py-1.5 flex items-center justify-around shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-white/5">
        
        {/* Home */}
        <Link href="/" className="flex flex-col items-center gap-0 text-white/70 hover:text-white transition-colors group">
          <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span className="text-[9px] font-medium leading-tight">Home</span>
        </Link>

        {/* Skala Toggle Button */}
        <button 
          onClick={() => { setShowSkalaPopup(!showSkalaPopup); setShowModulePopup(false); }}
          className="flex flex-col items-center gap-0 text-white/70 hover:text-white transition-colors group cursor-pointer bg-transparent border-0"
        >
          <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span className="text-[9px] font-medium leading-tight">Skala</span>
        </button>

        {/* Module Toggle Button */}
        <button 
          onClick={() => { setShowModulePopup(!showModulePopup); setShowSkalaPopup(false); }}
          className="flex flex-col items-center gap-0 text-white/70 hover:text-white transition-colors group cursor-pointer bg-transparent border-0"
        >
          <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253v13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <span className="text-[9px] font-medium leading-tight">Module</span>
        </button>

        {/* Result */}
        <Link href="/pencapaian" className="flex flex-col items-center gap-0 text-white/70 hover:text-white transition-colors group">
          <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4"/>
          </svg>
          <span className="text-[9px] font-medium leading-tight">Result</span>
        </Link>

        {/* Profile */}
        <Link href="/account" className="flex flex-col items-center gap-0 text-white/70 hover:text-white transition-colors group">
          <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span className="text-[9px] font-medium leading-tight">Profile</span>
        </Link>
      </nav>
    </div>
  );
}