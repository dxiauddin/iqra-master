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