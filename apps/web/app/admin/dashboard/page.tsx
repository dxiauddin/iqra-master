import { db } from '@repo/database';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { handleLogout } from '../../passkey-actions';
import { updateUserRole, deleteAccount } from '../admin-role-actions';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value || cookieStore.get('super_admin_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  // Clean expired sessions
  await db.session.deleteMany({
    where: { expires: { lt: new Date() } },
  }).catch(() => {});

  const users = await db.user.findMany({
    include: { passkeys: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex min-h-screen bg-gray-950 text-white p-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enterprise Role & Security Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Multi-tier role management and real-time session tracking</p>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800 text-sm font-medium rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Registered Users & Role Management Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-200">Account Management & Role Tiers</h3>
            <span className="text-xs text-gray-400 font-mono">Total Users: {users.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-950/50 text-xs font-semibold text-gray-400 uppercase">
                  <th className="px-6 py-3">Profile</th>
                  <th className="px-6 py-3">Email & ID</th>
                  <th className="px-6 py-3">Role Badge</th>
                  <th className="px-6 py-3">Passkeys</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {users.map((u: any) => {
                  let badgeColor = 'bg-zinc-800 text-zinc-300 border-zinc-700';
                  if (u.role === 'MEMBER') badgeColor = 'bg-blue-950 text-blue-400 border-blue-800';
                  if (u.role === 'ADMIN') badgeColor = 'bg-indigo-950 text-indigo-400 border-indigo-800';
                  if (u.role === 'SUPER_ADMIN') badgeColor = 'bg-red-950 text-red-400 border-red-800';

                  return (
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      {/* Profile Picture */}
                      <td className="px-6 py-4">
                        {u.image ? (
                          <img src={u.image} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 border border-zinc-700">
                            {u.email ? u.email.substring(0, 2).toUpperCase() : 'U'}
                          </div>
                        )}
                      </td>

                      {/* Email & ID */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{u.email || 'No Email'}</div>
                        <div className="font-mono text-xs text-zinc-500 truncate" style={{ maxWidth: '220px' }}>{u.id}</div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeColor}`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Passkeys count */}
                      <td className="px-6 py-4 text-xs text-zinc-300">
                        {u.passkeys.length} Key{u.passkeys.length === 1 ? '' : 's'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        <form action={async (formData) => {
                          'use server';
                          const newRole = formData.get('newRole') as any;
                          await updateUserRole(u.id, newRole);
                        }} className="inline-block">
                          {u.role === 'USER' && <input type="hidden" name="newRole" value="MEMBER" />}
                          {u.role === 'MEMBER' && <input type="hidden" name="newRole" value="ADMIN" />}
                          {u.role === 'ADMIN' && <input type="hidden" name="newRole" value="USER" />}
                          {u.role !== 'SUPER_ADMIN' && (
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors border border-zinc-700"
                            >
                              {u.role === 'USER' ? 'Promote to Member' : u.role === 'MEMBER' ? 'Promote to Admin' : 'Demote'}
                            </button>
                          )}
                        </form>

                        {u.role !== 'SUPER_ADMIN' && (
                          <form action={async () => {
                            'use server';
                            await deleteAccount(u.id);
                          }} className="inline-block">
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900 text-red-400 text-xs font-medium rounded-lg transition-colors border border-red-900"
                            >
                              Delete
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}