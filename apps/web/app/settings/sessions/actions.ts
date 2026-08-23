'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';

// Fetch all active sessions for a specific user
export async function getUserSessions(userId: string) {
  try {
    const sessions = await db.session.findMany({
      where: {
        userId,
        expires: { gt: new Date() }, // Only fetch active, non-expired sessions
      },
      orderBy: { expires: 'desc' }, // Fixed: order by expiration or remove orderBy if not needed
    });
    return { sessions };
  } catch (error) {
    return { error: 'Failed to load active sessions.' };
  }
}

// Revoke / terminate a specific session remotely
export async function revokeSession(sessionId: string, userId: string) {
  try {
    await db.session.deleteMany({
      where: {
        id: sessionId,
        userId: userId, // Security check: ensure session belongs to user
      },
    });

    revalidatePath('/settings/sessions');
    return { success: true, message: 'Session revoked successfully.' };
  } catch (error) {
    return { error: 'Failed to revoke session.' };
  }
}