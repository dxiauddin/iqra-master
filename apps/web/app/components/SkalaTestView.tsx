'use client';

import { useState } from 'react';

interface SkalaTestViewProps {
  skalaId: number;
  onComplete?: () => void;
}

export default function SkalaTestView({ skalaId, onComplete }: SkalaTestViewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock questions mapping per Skala level
  const skalaQuestions: Record<number, { question: string; options: string[]; correct: string }> = {
    1: {
      question: 'Apakah sebutan huruf alif yang berbaris atas (أَ)?',
      options: ['a', 'i', 'u', 'ba'],
      correct: 'a',
    },
    2: {
      question: `Pilih hukum atau tanda bacaan yang betul bagi Skala ${skalaId}:`,
      options: ['Tanwin', 'Idgham', 'Qalqalah', 'Mad Asli'],
      correct: 'Tanwin',
    },
    3: {
      question: `Ujian kefahaman bagi hukum tajwid Skala ${skalaId}:`,
      options: ['Izhar Halqi', 'Ikhfa Haqiqi', 'Iqlab', 'Idgham Bila Ghunnah'],
      correct: 'Izhar Halqi',
    },
    4: {
      question: `Kenal pasti hukum bacaan bagi Skala ${skalaId}:`,
      options: ['Idgham Maal Ghunnah', 'Mad Silah', 'Mad Lazim', 'Qalqalah Kubra'],
      correct: 'Idgham Maal Ghunnah',
    },
    5: {
      question: `Tanda wakaf yang mengharuskan berhenti di Skala ${skalaId}:`,
      options: ['جيم (Jim)', 'لا (La)', 'صلي (Sli)', 'قلى (Qala)'],
      correct: 'جيم (Jim)',
    },
    6: {
      question: `Penilaian penguasaan bacaan surah pilihan untuk Skala ${skalaId}:`,
      options: ['Lancar & Bertajwid', 'Teragak-agak', 'Perlu Ulangan', 'Asas Sahaja'],
      correct: 'Lancar & Bertajwid',
    },
  };

  const currentQ = skalaQuestions[skalaId] || skalaQuestions[1];

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-zinc-950/85 backdrop-blur-3xl text-white rounded-[22px] py-8 px-6 border border-white/15 shadow-2xl">
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
          Penilaian Tahap Skala {skalaId}
        </span>
        <h2 className="text-base sm:text-lg font-bold mt-3 text-white">{currentQ.question}</h2>
      </div>

      <div className="space-y-2.5 my-6">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={idx}
              onClick={() => !isSubmitted && setSelectedAnswer(opt)}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                isSelected 
                  ? 'bg-blue-600/30 border-blue-500 text-white shadow-md' 
                  : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:bg-zinc-900 hover:border-white/30'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isSubmitted ? (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 text-center font-medium">
          Jawapan direkodkan! Sila ke soalan seterusnya.
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className={`w-full py-2.5 rounded-full text-xs font-semibold shadow-lg transition-all ${
            selectedAnswer 
              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer' 
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
          }`}
        >
          Semak Jawapan
        </button>
      )}
    </div>
  );
}