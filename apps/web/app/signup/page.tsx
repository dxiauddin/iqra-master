'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Kata laluan tidak sepadan!');
      return;
    }
    alert(`Signing up with email: ${email}`);
  };

  return (
    <main 
      className="min-h-screen text-white flex flex-col justify-between relative px-4 font-sans antialiased"
      style={{ background: 'linear-gradient(to bottom, #00472B 0%, #000000 30%, #000000 70%, #00472B 100%)' }}
    >
      
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-[#00472B]/30 rounded-full blur-3xl pointer-events-none top-1/4 left-1/2 -translate-x-1/2" />

      {/* SVG Gradient Definition for Borders & Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
      </svg>

      {/* Spacer for Top Alignment */}
      <div className="pt-6"></div>

      {/* Hero / Header Section: Logo & Iqra' Master Name */}
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
        <p className="text-xs text-zinc-400">Sila daftar akaun baru untuk menyimpan rekod pencapaian anda.</p>
      </div>

      {/* Central Signup Container Hub with Gradient Border Glow */}
      <section className="max-w-md mx-auto w-full pt-2 pb-12 flex-1 flex flex-col items-center justify-start relative z-10">
        <div className="relative w-full">
          {/* Subtle Multi-Color Shadow Backing */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 opacity-20 blur-sm pointer-events-none" />

          {/* Main Container Box with Theme Border Glow */}
          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full">
            <div className="w-full bg-zinc-950/85 backdrop-blur-3xl text-white rounded-[22px] py-7 px-6 flex flex-col items-center gap-6 shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/15">
              
              <span className="text-xs font-semibold tracking-wide text-zinc-300">
                Daftar Akaun Baru
              </span>

              {/* TOP: Social Signups (Google & Facebook with Proper Icons) */}
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={() => alert('Google Sign-Up clicked')}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-sm group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"/>
                  </svg>
                  Daftar dengan Google
                </button>

                <button 
                  onClick={() => alert('Facebook Sign-Up clicked')}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-sm group"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Daftar dengan Facebook
                </button>
              </div>

              {/* Toggle Option for Email/Password (Uppercase class removed) */}
              <div className="flex items-center w-full my-1 cursor-pointer" onClick={() => setShowEmailModal(!showEmailModal)}>
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="px-3 text-[10px] text-emerald-400 font-semibold tracking-wider hover:underline">
                  {showEmailModal ? 'Tutup e-mail' : 'Atau melalui e-mail'}
                </span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              {/* COLLAPSIBLE / POPUP EMAIL FORM */}
              {showEmailModal && (
                <form onSubmit={handleEmailSignup} className="flex flex-col gap-4 w-full bg-zinc-900/80 p-4 rounded-2xl border border-white/10 animate-fadeIn">
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
                    <label className="text-[11px] font-medium text-zinc-400">Kata Laluan</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium text-zinc-400">Sahkan Kata Laluan</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md"
                  >
                    Daftar Akaun
                  </button>
                </form>
              )}

              {/* Login Redirect Link */}
              <div className="text-center text-xs text-zinc-400 pt-1">
                Sudah mempunyai akaun?{' '}
                <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
                  Log masuk
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full pt-4 pb-4 border-t border-emerald-900/40 text-center text-xs text-emerald-300/80 relative z-10 font-sans">
        &copy; {new Date().getFullYear()} Iqra&apos; Master By DxiaTech. All Rights Reserved.
      </footer>
    </main>
  );
}