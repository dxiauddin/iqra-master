'use client';

import { useState } from 'react';
import { requestPasswordReset, resetPasswordWithCode } from './actions';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  // Password requirements live check
  const hasLength = password.length >= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[\W_]/.test(password);

  async function handleRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await requestPasswordReset(formData);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else if (result?.email) {
      setEmail(result.email);
      setStep('verify');
      setSuccessMessage('A 6-digit verification code has been sent to your email.');
    }
  }

  async function handleVerifyAndReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append('email', email); // Attach email state securely

    const result = await resetPasswordWithCode(formData);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = '/?reset=success';
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-6">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-sm text-gray-400">
            {step === 'request' 
              ? "Enter your email address to receive a secure recovery code." 
              : "Enter the 6-digit code sent to your email and your new password."}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-900 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        {successMessage && step === 'verify' && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-xs rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-white hover:bg-gray-200 text-gray-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending Code...' : 'Send Recovery Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">6-Digit Verification Code</label>
              <input
                name="code"
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white text-center tracking-widest font-mono focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">New Password</label>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            {/* Live Password Strength Indicator Checklist */}
            <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg space-y-1.5 text-xs text-gray-400">
              <p className="font-medium text-gray-300 mb-1">Password Requirements:</p>
              <p className={hasLength ? 'text-green-400' : 'text-gray-500'}>✓ At least 12 characters</p>
              <p className={hasUpper ? 'text-green-400' : 'text-gray-500'}>✓ One uppercase letter (A-Z)</p>
              <p className={hasLower ? 'text-green-400' : 'text-gray-500'}>✓ One lowercase letter (a-z)</p>
              <p className={hasNumber ? 'text-green-400' : 'text-gray-500'}>✓ One number (0-9)</p>
              <p className={hasSpecial ? 'text-green-400' : 'text-gray-500'}>✓ One special character (!@#$%^&*)</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-white hover:bg-gray-200 text-gray-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-500">
          Remembered your password?{' '}
          <Link href="/" className="text-zinc-300 hover:underline font-medium">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}