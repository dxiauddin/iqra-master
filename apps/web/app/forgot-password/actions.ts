'use server';

import { db } from '@repo/database';
import { sendVerificationEmail } from '@/lib/mail';
import { authRatelimit } from '../../lib/ratelimit';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// 1. Request OTP Code Securely with Upstash Rate Limiting
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email || !email.includes('@')) {
    return { error: 'A valid email address is required.' };
  }

  // RATE LIMIT CHECK: 5 requests per 60 seconds per email identifier
  const identifier = email.toLowerCase().trim();
  const { success, reset } = await authRatelimit.limit(identifier);

  if (!success) {
    const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
    return { 
      error: `Too many password reset requests. Please try again in ${retryAfterSeconds} seconds.` 
    };
  }

  const user = await db.user.findUnique({ where: { email } });
  
  // ANTI-ENUMERATION: Always return a generic success message.
  // This prevents attackers from guessing which emails are registered in your system.
  if (!user) {
    return { success: true, email };
  }

  // CRYPTOGRAPHICALLY SECURE: Use Node.js crypto module instead of Math.random()
  const rawCode = crypto.randomInt(100000, 999999).toString();
  
  // HASH THE TOKEN: Store a bcrypt hash of the token in DB so database leaks don't expose raw OTPs
  const tokenHash = await bcrypt.hash(rawCode, 10);
  
  // SHORT EXPIRATION: Strict 5-minute time-to-live (TTL)
  const expires = new Date(Date.now() + 5 * 60 * 1000); 

  // Upsert token to ensure only 1 active token exists per email address
  await db.verificationToken.upsert({
    where: { identifier: email },
    update: { token: tokenHash, expires, attempts: 0 },
    create: { identifier: email, token: tokenHash, expires, attempts: 0 },
  });

  // Dispatch email safely via Gmail
  await sendVerificationEmail(email, rawCode);

  return { success: true, email };
}

// 2. Verify Code & Reset Password Securely
export async function resetPasswordWithCode(formData: FormData) {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;
  const newPassword = formData.get('password') as string;

  if (!email || !code || !newPassword) {
    return { error: 'All fields are required.' };
  }

  // Strict password complexity enforcement matching your existing app standards
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  if (!strongPasswordRegex.test(newPassword)) {
    return { 
      error: 'Password must be at least 12 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.' 
    };
  }

  const record = await db.verificationToken.findUnique({
    where: { identifier: email },
  });

  // Check if token exists and hasn't expired
  if (!record || record.expires < new Date()) {
    return { error: 'Verification code is invalid or has expired.' };
  }

  // BRUTE-FORCE PROTECTION: Lock out after 5 failed attempts
  if (record.attempts >= 5) {
    await db.verificationToken.delete({ where: { identifier: email } });
    return { error: 'Too many incorrect attempts. Please request a new code.' };
  }

  // Verify input code against the secure database hash
  const isValidCode = await bcrypt.compare(code, record.token);
  if (!isValidCode) {
    // Increment failure counter on incorrect entry
    await db.verificationToken.update({
      where: { identifier: email },
      data: { attempts: record.attempts + 1 },
    });
    return { error: `Invalid verification code. ${4 - record.attempts} attempts remaining.` };
  }

  // Hash the new password securely
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Update user record
  await db.user.update({
    where: { email },
    data: { passwordHash },
  });

  // SINGLE-USE ENFORCEMENT: Immediately destroy token so it cannot be reused
  await db.verificationToken.delete({
    where: { identifier: email },
  });

  return { success: true };
}