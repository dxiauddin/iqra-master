'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string; modNum: string }>;
}

export default function ModuleTestPage({ params }: PageProps) {
  const { id, modNum } = use(params);

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 font-sans antialiased"
      style={{ background: 'linear-gradient(to bottom, #0000FF 0%, #000000 30%, #000000 70%, #0000FF 100%)' }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

      {/* Top Bar: Back Link */}
      <div className="max-w-xl mx-auto w-full pt-6 px-4 flex justify-between items-center relative z-20">
        <Link 
          href={`/skala/${id}/module/${modNum}`} 
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          &larr; Kembali ke Modul {modNum}
        </Link>
        <span className="text-xs font-semibold text-yellow-400 tracking-wide">
          Ujian Modul {modNum} (Skala {id})
        </span>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-15 space-y-4 pt-4 pb-24 flex-1">
        
        <div className="w-full bg-zinc-950/85 backdrop-blur-3xl text-white rounded-[22px] py-8 px-6 border border-white/15 shadow-2xl">
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-full">
              Penilaian Modul {modNum}
            </span>
            <h2 className="text-base sm:text-lg font-bold mt-3 text-white">
              Ujian Penguasaan Pembelajaran Modul {modNum}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Jawab soalan di bawah untuk menguji kefahaman anda bagi modul ini.
            </p>
          </div>

          {/* Test Questions Placeholder / Interactive Flow */}
          <div className="py-12 text-center text-zinc-400 text-xs border border-dashed border-zinc-800 rounded-xl my-6">
            [ Soalan Interaktif Ujian Modul {modNum} untuk Skala {id} dipaparkan di sini ]
          </div>

          <button
            onClick={() => {
              alert(`Tahniah! Anda telah berjaya menghantar Ujian Modul ${modNum}.`);
              window.location.href = `/skala/${id}`;
            }}
            className="w-full py-2.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            Hantar Jawapan Modul
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