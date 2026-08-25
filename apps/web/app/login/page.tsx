'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for toggling password visibility on login
  const [showPassword, setShowPassword] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('iqra_user', JSON.stringify(data.user));
        setPopupMessage('Log masuk berjaya! Sedang dibawa ke laman utama...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      } else {
        setPopupMessage(data.error || 'Log masuk gagal. Sila cuba lagi.');
      }
    } catch (err) {
      setPopupMessage('Ralat rangkaian. Sila semak sambungan anda.');
    }
  };

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 font-sans antialiased overflow-x-hidden"
      style={{ background: 'linear-gradient(to bottom, #00472B 0%, #000000 30%, #000000 70%, #00472B 100%)' }}
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

      <div className="absolute w-96 h-96 bg-[#00472B]/30 rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

      {popupMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fadeIn">
          <div className="bg-zinc-950 border border-white/20 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <p className="text-sm text-zinc-200 font-medium">{popupMessage}</p>
            <button
              onClick={() => setPopupMessage(null)}
              className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <div className="pt-6"></div>

      <div className="max-w-3xl mx-auto w-full pt-2 pb-2 text-center relative z-10 space-y-2">
        <Link 
          href="/" 
          className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto block transition-transform hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          title="Kembali ke Laman Utama"
        >
          <Image 
            src="/logo-kagat.png" 
            alt="Iqra' Master Logo" 
            fill
            sizes="112px"
            priority
            className="object-contain"
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Iqra&apos; Master</h1>
        <p className="text-xs text-zinc-400">Sila log masuk untuk menyimpan rekod pencapaian anda.</p>
      </div>

      <section className="max-w-md mx-auto w-full pt-2 pb-12 flex-1 flex flex-col items-center justify-start relative z-10">
        <div className="relative w-full">
          {/* Spinning Glow Backdrop */}
          <div className="absolute -inset-1 rounded-3xl overflow-hidden opacity-30 blur-md pointer-events-none">
            <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />
          </div>

          {/* Spinning Border Container */}
          <div className="relative p-[1.5px] rounded-3xl overflow-hidden w-full shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#3B82F6,#FACC15,#EF4444,#3B82F6)] animate-spin-slow" />

            <div className="relative w-full bg-zinc-950/95 backdrop-blur-3xl text-white rounded-[22px] pt-5 pb-7 px-6 flex flex-col items-center gap-6 border border-white/10">
              
              <div className="w-full relative flex items-center justify-center pb-1">
                <span className="text-xs font-semibold tracking-wide text-zinc-300">
                  Log Masuk Akaun
                </span>
                
                <Link
                  href="/"
                  className="absolute right-0 w-7 h-7 rounded-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-white/20 shadow-sm"
                  title="Batal / Kembali"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={() => setPopupMessage('Google Sign-In akan datang!')}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-sm group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"/>
                  </svg>
                  Teruskan dengan Google
                </button>

                <button 
                  onClick={() => setPopupMessage('Facebook Sign-In akan datang!')}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-sm group"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Teruskan dengan Facebook
                </button>
              </div>

              <div className="flex items-center w-full my-1 cursor-pointer" onClick={() => setShowEmailModal(!showEmailModal)}>
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="px-3 text-[10px] text-emerald-400 font-semibold tracking-wider hover:underline">
                  {showEmailModal ? 'Tutup e-mail' : 'Atau melalui e-mail'}
                </span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              {showEmailModal && (
                <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 w-full bg-zinc-900/80 p-4 rounded-2xl border border-white/10 animate-fadeIn">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium text-zinc-400">E-mail</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@contoh.com"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-medium text-zinc-400">Kata Laluan</label>
                      <Link href="/forgot-password" className="text-[10px] text-emerald-400 hover:underline">
                        Lupa kata laluan?
                      </Link>
                    </div>
                    {/* Password Input with Eye Toggle */}
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3 py-2 pr-9 rounded-xl bg-zinc-950 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                        title={showPassword ? 'Sembunyikan kata laluan' : 'Papar kata laluan'}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m14.41 14.41l-3.59-3.59"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md"
                  >
                    Log Masuk
                  </button>
                </form>
              )}

              <div className="text-center text-xs text-zinc-400 pt-1">
                Tiada akaun?{' '}
                <Link href="/signup" className="text-emerald-400 font-semibold hover:underline">
                  Daftar sekarang
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      <footer className="w-full pt-4 pb-4 border-t border-emerald-900/40 text-center text-xs text-emerald-300/80 relative z-10 font-sans">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}