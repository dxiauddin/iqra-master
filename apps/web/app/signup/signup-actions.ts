'use server';

import { db } from '@repo/database';
import bcrypt from 'bcryptjs';

const COMMON_PASSWORDS = new Set([
  'password123!', 'password1234!', 'admin123456!', 'welcome12345!', 
  'qwertyuiop12!', 'letmein123456!', 'changeme12345!'
]);

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Please enter a valid email address format (e.g., name@example.com).' };
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  if (!strongPasswordRegex.test(password)) {
    return { 
      error: 'Password must be at least 12 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.' 
    };
  }

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return { error: 'This password is too commonly used. Please choose a more unique password.' };
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: 'An account with this email already exists. Try signing in instead.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  return { success: true };
}