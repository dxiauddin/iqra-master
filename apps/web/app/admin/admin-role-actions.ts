'use server';

import { db } from '@repo/database';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_super_secret_key_change_in_production_123456'
);

async function getSessionRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get('super_admin_session')?.value || cookieStore.get('session_token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload; // Contains userId and role
  } catch {
    return null;
  }
}

// Admin / Super Admin Role Promotion Action
export async function updateUserRole(targetUserId: string, newRole: 'USER' | 'MEMBER' | 'ADMIN') {
  const session: any = await getSessionRole();
  if (!session) return { error: 'Unauthorized.' };

  const actor = await db.user.findUnique({ where: { id: session.userId } });
  if (!actor) return { error: 'Actor not found.' };

  // Permission Checks
  if (actor.role === 'ADMIN') {
    // Admin can only change USER <-> MEMBER
    if (newRole !== 'USER' && newRole !== 'MEMBER') {
      return { error: 'Admins can only promote/demote between User and Member.' };
    }
  } else if (actor.role !== 'SUPER_ADMIN') {
    return { error: 'Insufficient permissions.' };
  }

  await db.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  return { success: true };
}

// User / Admin Deletion Action
export async function deleteAccount(targetUserId: string) {
  const session: any = await getSessionRole();
  if (!session) return { error: 'Unauthorized.' };

  const actor = await db.user.findUnique({ where: { id: session.userId } });
  const target = await db.user.findUnique({ where: { id: targetUserId } });

  if (!actor || !target) return { error: 'User not found.' };

  // Deletion logic rules
  if (actor.role === 'ADMIN') {
    if (target.role !== 'USER') {
      return { error: 'Admins can only delete normal Users.' };
    }
  } else if (actor.role === 'SUPER_ADMIN') {
    if (target.role === 'SUPER_ADMIN') {
      return { error: 'Cannot delete another Super Admin.' };
    }
  } else {
    return { error: 'Unauthorized.' };
  }

  await db.user.delete({ where: { id: targetUserId } });
  return { success: true };
}