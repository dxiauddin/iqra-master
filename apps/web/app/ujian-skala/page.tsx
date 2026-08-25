'use client';

import { useState } from 'react';
import Link from 'next/link';
import SkalaTestView from '@/app/components/SkalaTestView';

export default function ComprehensiveUjianSkalaPage() {
  const [currentSkala, setCurrentSkala] = useState(1);
  const totalSkalas = 6;

  const handleNext = () => {
    if (currentSkala < totalSkalas) {
      setCurrentSkala((prev) => prev + 1);
    } else {
      alert('Tahniah! Anda telah selesai menjawab Ujian Skala Keseluruhan.');
      window.location.href = '/pencapaian';
    }
  };

  const handlePrev = () => {
    if (currentSkala > 1) {
      setCurrentSkala((prev) => prev - 1);
    }
  };

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 font-sans antialiased overflow-x-hidden"
      style={{ background: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)' }}
    >
      {/* Top Header & Wizard Progress */}
      <div className="max-w-xl mx-auto w-full pt-6 px-4 flex justify-between items-center relative z-20">
        <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">
          &larr; Kembali
        </Link>
        <span className="text-xs font-semibold text-yellow-400 tracking-wide">
          Ujian Keseluruhan (Skala {currentSkala} / {totalSkalas})
        </span>
      </div>

      {/* Main Wizard Area */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-15 space-y-4 pt-4 pb-24 flex-1">
        
        {/* Render the shared test view for the active Skala */}
        <div className="w-full">
          <SkalaTestView skalaId={currentSkala} />
        </div>

        {/* Wizard Step Controls */}
        <div className="w-full flex justify-between items-center px-2">
          <button
            onClick={handlePrev}
            disabled={currentSkala === 1}
            className={`px-4 py-2 rounded-full text-xs font-semibold border border-white/10 transition-all ${
              currentSkala === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-900 text-zinc-200'
            }`}
          >
            Sebelumnya
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105"
          >
            {currentSkala === totalSkalas ? 'Hantar Keputusan' : 'Seterusnya'}
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full pt-3 pb-3 border-t border-blue-900/40 text-center text-xs text-blue-300 relative z-10 shrink-0 font-sans">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}