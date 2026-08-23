import { NextResponse } from 'next/server';
import { db } from '@repo/database';
import { getUserSessions, revokeSession } from '@/app/settings/sessions/actions';

export async function GET() {
  try {
    // 1. Find any user in your database to test with
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'No users found in database. Create a user first.' }, { status: 400 });
    }

    // 2. Create a dummy active session for this user
    const dummyToken = `session_token_${Date.now()}`;
    const newSession = await db.session.create({
      data: {
        sessionToken: dummyToken,
        userId: user.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      },
    });

    // 3. Test fetching active sessions
    const { sessions } = await getUserSessions(user.id);

    // 4. Test revoking the session
    const revokeResult = await revokeSession(newSession.id, user.id);

    // 5. Verify it's gone
    const { sessions: remainingSessions } = await getUserSessions(user.id);

    return NextResponse.json({
      success: true,
      testedUser: user.email,
      createdSessionId: newSession.id,
      fetchedSessionsCount: sessions?.length,
      revokeResult,
      remainingSessionsCount: remainingSessions?.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}