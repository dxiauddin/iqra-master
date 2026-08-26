'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function BottomNav() {
  const [user, setUser] = useState<any>(null);
  const [showSkalaPopup, setShowSkalaPopup] = useState(false);
  const [showModulePopup, setShowModulePopup] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  
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

  // Automatically sync active tab based on current URL path
  useEffect(() => {
    if (pathname === '/') {
      setActiveTab('home');
    } else if (pathname.includes('/module')) {
      setActiveTab('module');
    } else if (pathname.startsWith('/skala')) {
      setActiveTab('skala');
    } else if (pathname === '/pencapaian') {
      setActiveTab('result');
    } else if (pathname === '/account') {
      setActiveTab('profile');
    }
  }, [pathname]);

  // Extract current Skala number from pathname if available
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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      
      {/* Skala 1-6 Popup */}
      {showSkalaPopup && (
        <div ref={skalaRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[300px] bg-zinc-950/50 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-[0_8px_25px_rgba(0,0,0,0.3)] animate-fadeIn mb-2">
          <p className="text-xs font-semibold text-zinc-300 text-center mb-2">Pilih Skala Pembelajaran</p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Link
                key={num}
                href={`/skala/${num}`}
                onClick={() => { setShowSkalaPopup(false); setActiveTab('skala'); }}
                className="bg-zinc-900/60 hover:bg-zinc-800/80 text-white rounded-xl py-2 text-center text-xs font-semibold transition-colors border border-white/10"
              >
                Skala {num}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Module 1-10 Popup */}
      {showModulePopup && (
        <div ref={moduleRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[300px] bg-zinc-950/50 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-[0_8px_25px_rgba(0,0,0,0.3)] animate-fadeIn mb-2 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <p className="text-xs font-semibold text-zinc-300 text-center mb-2">Pilih Modul Skala {currentSkala}</p>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((mod) => (
              <Link
                key={mod}
                href={`/skala/${currentSkala}/module/${mod}`}
                onClick={() => { setShowModulePopup(false); setActiveTab('module'); }}
                className="bg-zinc-900/60 hover:bg-zinc-800/80 text-white rounded-xl py-2 text-center text-xs font-semibold transition-colors border border-white/10"
              >
                Modul {mod}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="bg-zinc-950/5 backdrop-blur-[2px] text-white rounded-full p-1.5 flex items-center gap-1 shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-white/5">
        
        {/* Home */}
        <Link 
          href="/" 
          onClick={() => setActiveTab('home')}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${
            activeTab === 'home' ? 'bg-zinc-800/90 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
          title="Home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </Link>

        {/* 20px Spacer between Home and Skala */}
        <div style={{ width: '20px' }} />

        {/* Skala Toggle Button */}
        <button 
          onClick={() => { 
            setShowSkalaPopup(!showSkalaPopup); 
            setShowModulePopup(false); 
            setActiveTab('skala');
          }}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all cursor-pointer bg-transparent border-0 ${
            activeTab === 'skala' || showSkalaPopup ? 'bg-zinc-800/90 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
          title="Skala"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
        </button>

        {/* 20px Spacer between Skala and Module */}
        <div style={{ width: '20px' }} />

        {/* Module Toggle Button */}
        <button 
          onClick={() => { 
            setShowModulePopup(!showModulePopup); 
            setShowSkalaPopup(false); 
            setActiveTab('module');
          }}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all cursor-pointer bg-transparent border-0 ${
            activeTab === 'module' || showModulePopup ? 'bg-zinc-800/90 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
          title="Module"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253v13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </button>

        {/* 20px Spacer between Module and Result */}
        <div style={{ width: '20px' }} />

        {/* Result */}
        <Link 
          href="/pencapaian" 
          onClick={() => setActiveTab('result')}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${
            activeTab === 'result' ? 'bg-zinc-800/90 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
          title="Result"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4"/>
          </svg>
        </Link>

        {/* 20px Spacer between Result and Profile */}
        <div style={{ width: '20px' }} />

        {/* Profile */}
        <Link 
          href="/account" 
          onClick={() => setActiveTab('profile')}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${
            activeTab === 'profile' ? 'bg-zinc-800/90 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
          title="Profile"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </Link>
      </nav>
    </div>
  );
}