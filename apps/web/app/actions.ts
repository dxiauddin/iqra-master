'use server';

import { db } from '@repo/database';
import { hashPassword, verifyPassword, createSessionToken } from '@repo/auth';
import { cookies } from 'next/headers';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Enforce 14+ character password rule on the server side
  if (password.length < 14) {
    return { error: 'Password must be at least 14 characters long for high-security compliance.' };
  }

  try {
    // Check if user exists in the Neon database
    let user = await db.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create one for demonstration purposes
    if (!user) {
      const hashedPassword = await hashPassword(password);
      user = await db.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name: email.split('@')[0], // Default name from email prefix
        },
      });
    } else if (user.passwordHash) {
      // If user exists and has a password, verify it
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return { error: 'Invalid email or password.' };
      }
    } else {
      // If account uses social/passkey only, require fallback update
      return { error: 'This account uses external authentication. Please sign in via Passkey or Social.' };
    }

    // Create session token using @repo/auth
    const token = await createSessionToken(user.id);

    // Await cookies() and set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'session_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return { success: true };
  } catch (err: any) {
    console.error('Authentication error:', err);
    return { error: err.message || 'An internal authentication error occurred.' };
  }
}

// --- MODULE PROGRESS ACTIONS (Neon Database Sync) ---

export async function saveModuleProgress(userId: number, skalaId: number, moduleNum: number, completedCards: string[], progressPercent: number) {
  if (!userId) {
    return { error: 'Unauthorized user.' };
  }

  try {
    await db.$executeRaw`
      INSERT INTO user_module_progress (user_id, skala_id, module_num, completed_cards, progress_percent, updated_at)
      VALUES (${userId}, ${skalaId}, ${moduleNum}, ${completedCards}, ${progressPercent}, NOW())
      ON CONFLICT (user_id, skala_id, module_num) 
      DO UPDATE SET 
        completed_cards = EXCLUDED.completed_cards, 
        progress_percent = EXCLUDED.progress_percent, 
        updated_at = NOW();
    `;

    return { success: true };
  } catch (err: any) {
    console.error('Failed to save module progress:', err);
    return { error: err.message || 'Database error while saving progress.' };
  }
}

export async function getModuleProgress(userId: number, skalaId: number, moduleNum: number) {
  if (!userId) {
    return { completed_cards: [], progress_percent: 0 };
  }

  try {
    const result: any[] = await db.$queryRaw`
      SELECT completed_cards, progress_percent 
      FROM user_module_progress 
      WHERE user_id = ${userId} AND skala_id = ${skalaId} AND module_num = ${moduleNum}
    `;

    if (result && result.length > 0) {
      return {
        completed_cards: result[0].completed_cards || [],
        progress_percent: result[0].progress_percent || 0,
      };
    }

    return { completed_cards: [], progress_percent: 0 };
  } catch (err) {
    console.error('Failed to fetch module progress:', err);
    return { completed_cards: [], progress_percent: 0 };
  }
}

// --- AGGREGATE SKALA PROGRESS ACTION ---

export async function getSkalaProgress(userId: number, skalaId: number, totalModules: number = 10) {
  if (!userId) {
    return { overall_percent: 0, current_module: 1 };
  }

  try {
    const results: any[] = await db.$queryRaw`
      SELECT module_num, progress_percent 
      FROM user_module_progress 
      WHERE user_id = ${userId} AND skala_id = ${skalaId}
    `;

    let totalSum = 0;
    const progressMap: Record<number, number> = {};

    results.forEach((row) => {
      progressMap[row.module_num] = row.progress_percent;
      totalSum += row.progress_percent;
    });

    // Calculate aggregate average across all total modules (e.g., divided by 10)
    const overallPercent = Math.round(totalSum / totalModules);

    // Find the first module that is not yet 100% complete
    let activeModule = 1;
    for (let i = 1; i <= totalModules; i++) {
      if ((progressMap[i] || 0) < 100) {
        activeModule = i;
        break;
      }
      if (i === totalModules && (progressMap[i] || 0) === 100) {
        activeModule = totalModules;
      }
    }

    return { overall_percent: overallPercent, current_module: activeModule };
  } catch (err) {
    console.error('Failed to fetch Skala aggregate progress:', err);
    return { overall_percent: 0, current_module: 1 };
  }
}

// --- RESET PROGRESS ACTION (Development Testing) ---

export async function resetSkalaProgress(userId: number, skalaId: number) {
  if (!userId) {
    return { error: 'Unauthorized user.' };
  }

  try {
    await db.$executeRaw`
      DELETE FROM user_module_progress 
      WHERE user_id = ${userId} AND skala_id = ${skalaId}
    `;

    return { success: true };
  } catch (err: any) {
    console.error('Failed to reset Skala progress:', err);
    return { error: err.message || 'Database error while resetting progress.' };
  }
}