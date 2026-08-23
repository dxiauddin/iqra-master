export const dynamic = 'force-dynamic';

import { db } from '@repo/database';
import { getUserSessions, revokeSession } from './actions';

export default async function SessionsPage() {
  const testUser = await db.user.findFirst();
  if (!testUser) return <div className="p-8 text-white">Please sign in first.</div>;

  const { sessions, error } = await getUserSessions(testUser.id);

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Active Sessions</h1>
      <p className="text-gray-400 mb-6">Manage devices currently logged into your account.</p>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div className="space-y-4">
        {!sessions || sessions.length === 0 ? (
          <p className="text-gray-500">No active sessions found.</p>
        ) : (
          sessions.map((session: { id: string; expires: Date }) => (
            <div key={session.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-gray-300">Session ID: {session.id.slice(0, 8)}...</p>
                <p className="text-xs text-gray-500">Expires: {new Date(session.expires).toLocaleString()}</p>
              </div>
              <form action={async () => {
                'use server';
                await revokeSession(session.id, testUser.id);
              }}>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm font-medium rounded transition"
                >
                  Revoke
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}