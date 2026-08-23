import { NextResponse } from 'next/server';
import { db } from '@repo/database';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (
      process.env.NODE_ENV === 'production' &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const deletedTokens = await db.verificationToken.deleteMany({
      where: { expires: { lt: now } },
    });

    const deletedSessions = await db.session.deleteMany({
      where: { expires: { lt: now } },
    });

    const deletedLogs = await db.auditLog.deleteMany({
      where: { createdAt: { lt: thirtyDaysAgo } },
    });

    return NextResponse.json({
      success: true,
      message: 'Database cleanup executed successfully.',
      purged: {
        expiredVerificationTokens: deletedTokens.count,
        expiredSessions: deletedSessions.count,
        oldAuditLogs: deletedLogs.count,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}