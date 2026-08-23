import { db } from '@repo/database';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { handleLogout, deletePasskey } from '../passkey-actions';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    redirect('/');
  }

  let userId = '';
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) redirect('/');
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    userId = payload.userId || payload.sub || payload.id;
  } catch (err) {
    redirect('/');
  }

  // Safety guard: if userId is empty or malformed string, redirect instead of querying Prisma
  if (!userId || typeof userId !== 'string' || userId.length < 5) {
    redirect('/');
  }

  // 2. Safely fetch user and their registered passkeys from Neon database
  let user = null;
  try {
    user = await db.user.findUnique({
      where: { id: userId },
      include: { passkeys: true },
    });
  } catch (dbErr) {
    console.error('Database query error on dashboard:', dbErr);
    redirect('/');
  }

  if (!user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-6">
      <div className="w-full max-w-xl p-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
            <p className="text-sm text-gray-400">Secured Monorepo Session</p>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600/25 hover:bg-red-600/40 text-red-400 border border-red-800 text-sm font-medium rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-xs text-gray-400 block mb-1">Account Email</span>
            <span className="text-lg font-medium text-white">{user.email}</span>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800">
            <span className="text-xs text-gray-400 block mb-1">User ID</span>
            <span className="text-xs font-mono text-indigo-400 break-all">{user.id}</span>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-300">Registered Passkeys</span>
              <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs rounded-full">
                {user.passkeys.length} Active
              </span>
            </div>

            {user.passkeys.length === 0 ? (
              <p className="text-xs text-gray-500">No hardware passkeys registered yet.</p>
            ) : (
              <div className="space-y-2">
                {user.passkeys.map((passkey, index) => (
                  <div key={passkey.id} className="p-3 bg-gray-900 rounded-lg border border-gray-800 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-300 block">Authenticator #{index + 1}</span>
                      <span className="text-gray-500">Type: {passkey.deviceType} | Backed Up: {passkey.backedUp ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] text-gray-500 font-mono">Counter: {passkey.counter}</span>
                      <form action={async () => {
                        'use server';
                        await deletePasskey(passkey.id);
                      }}>
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-[10px] rounded transition-colors"
                        >
                          Revoke
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}