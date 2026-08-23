'use client';

import React, { useState } from 'react';
import { getSuperAdminAuthOptions, verifySuperAdminPasskey } from '../super-admin-actions';
import { startAuthentication } from '@simplewebauthn/browser';
import { useRouter } from 'next/navigation';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your authorized administrator email.');
      return;
    }

    try {
      setLoading(true);
      const res = (await getSuperAdminAuthOptions(email)) as any;
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      let cred;
      try {
        cred = await startAuthentication({ optionsJSON: res.options });
      } catch (authErr: any) {
        setError('Hardware security key prompt was cancelled or dismissed.');
        setLoading(false);
        return;
      }

      const verificationRes = (await verifySuperAdminPasskey(res.userId, cred)) as any;
      if (verificationRes.error) {
        setError(verificationRes.error);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError('Admin hardware sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl shadow-2xl border border-red-900/50">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">Restricted Access</span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Super Admin Gateway</h1>
          <p className="text-xs text-zinc-400 mt-1">Hardware Security Key (Passkey) Required. Passwords Disabled.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Admin Identity (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-600"
              placeholder="admin@orderwira.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>{loading ? 'Verifying Hardware Token...' : 'Authenticate with Security Key 🛡️'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}