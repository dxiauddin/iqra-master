'use server';

import { db } from '@repo/database';
import bcrypt from 'bcryptjs';

export async function updatePasswordWithStepUp(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const userId = formData.get('userId') as string;

  if (!currentPassword || !newPassword || !userId) {
    return { error: 'All fields are required for verification.' };
  }

  // 1. Fetch user to check existing password hash
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) {
    return { error: 'User session invalid or account uses passkey-only login.' };
  }

  // 2. STEP-UP AUTHENTICATION: Verify the current password matches
  const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    return { error: 'Incorrect current password. Step-up verification failed.' };
  }

  // 3. Enforce strict complexity on the new password (12+ chars, upper, lower, number, special)
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  if (!strongPasswordRegex.test(newPassword)) {
    return { 
      error: 'New password must be at least 12 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.' 
    };
  }

  // 4. Hash and update the new password in the database
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });

  return { success: true, message: 'Password updated successfully following step-up verification.' };
}