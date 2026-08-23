import { NextResponse } from 'next/server';
import { db } from '@repo/database';
import { logSecurityEvent, checkBruteForceLockout } from '@/app/security/actions';

export async function GET() {
  try {
    // 1. Find a test user
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'No user found in database.' }, { status: 400 });
    }

    // 2. Log a single test security event
    await logSecurityEvent({
      userId: user.id,
      action: 'LOGIN_FAILED',
      metadata: JSON.stringify({ reason: 'Invalid password test' }),
    });

    // 3. Simulate multiple failed attempts to trigger the 5-attempt threshold lockout
    const simulationPromises = [];
    for (let i = 0; i < 5; i++) {
      simulationPromises.push(
        db.auditLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN_FAILED',
            ipAddress: '192.168.1.100',
            userAgent: 'Test-Agent',
            metadata: 'Brute-force simulation attempt',
          },
        })
      );
    }
    await Promise.all(simulationPromises);

    // 4. Test the brute-force lockout guard
    const isLockedOut = await checkBruteForceLockout(user.id, '192.168.1.100');

    // 5. Fetch recent audit logs for confirmation
    const logs = await db.auditLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    return NextResponse.json({
      success: true,
      testedUser: user.email,
      isLockedOut, // Should be true since we injected 5+ failed attempts
      auditLogsCount: logs.length,
      latestLogs: logs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}