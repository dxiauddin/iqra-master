import { db } from '@repo/database';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

// Secret key for JWT generation (must be set in environment variables in production)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'secure-fallback-secret-key-change-me-in-production'
);

/**
 * Validates password strength (enforcing 14+ characters minimum) and hashes it.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 14) {
    throw new Error('Password must be at least 14 characters long for high-security compliance.');
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies a plain-text password against a stored bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a signed JWT session token for an authenticated user.
 */
export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Session valid for 7 days
    .sign(JWT_SECRET);
}

/**
 * Verifies and decodes a JWT session token.
 */
export async function verifySessionToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch (error) {
    return null;
  }
}