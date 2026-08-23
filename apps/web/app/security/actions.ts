'use server';

import { db } from '@repo/database';
import { headers } from 'next/headers';

export async function logSecurityEvent({
  userId,
  action,
  metadata,
}: {
  userId?: string;
  action: string;
  metadata?: string;
}) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await db.auditLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent,
        metadata,
      },
    });
  } catch (error) {
    console.error('Failed to write security audit log:', error);
  }
}

// Check if an IP or User has exceeded maximum failed attempts (Brute-Force Lockout Guard)
export async function checkBruteForceLockout(userId?: string, ipAddress?: string): Promise<boolean> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  try {
    const failedAttemptsCount = await db.auditLog.count({
      where: {
        OR: [
          userId ? { userId } : {},
          ipAddress ? { ipAddress } : {},
        ],
        action: 'LOGIN_FAILED',
        createdAt: { gte: fifteenMinutesAgo },
      },
    });

    // Lock out if more than 5 failed attempts occur within 15 minutes
    return failedAttemptsCount >= 5;
  } catch (error) {
    return false;
  }
}