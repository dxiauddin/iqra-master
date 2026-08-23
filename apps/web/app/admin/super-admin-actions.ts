'use server';

import { db } from '@repo/database';
import { Redis } from '@upstash/redis';
import { 
  generateAuthenticationOptions, 
  verifyAuthenticationResponse 
} from '@simplewebauthn/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const rpID = process.env.NODE_ENV === 'production' ? 'orderwira.com' : 'localhost';
const expectedOrigin = process.env.NODE_ENV === 'production' 
  ? 'https://orderwira.com' 
  : 'http://localhost:3000';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_super_secret_key_change_in_production_123456'
);

export async function getSuperAdminAuthOptions(email: string) {
  try {
    if (!email) return { error: 'Admin email is required.' };

    const user = await db.user.findUnique({
      where: { email },
      include: { passkeys: true },
    });

    if (!user || user.passkeys.length === 0) {
      return { error: 'Unauthorized. Hardware security key required.' };
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.passkeys.map((p: any) => ({
        id: String(p.credentialID),
        type: 'public-key' as const,
        transports: Array.isArray(p.transports) 
          ? p.transports 
          : (typeof p.transports === 'string' && p.transports.length > 0 
              ? (p.transports.split(',') as AuthenticatorTransport[]) 
              : undefined),
      })),
      userVerification: 'required',
    });

    await redis.set(`admin_challenge:${user.id}`, options.challenge, { ex: 300 });

    return { userId: user.id, options };
  } catch (err: any) {
    console.error('Super Admin Auth options error:', err);
    return { error: 'Failed to initialize hardware authentication.' };
  }
}

export async function verifySuperAdminPasskey(userId: string, credential: any) {
  try {
    const expectedChallenge = await redis.get<string>(`admin_challenge:${userId}`);
    if (!expectedChallenge) {
      return { error: 'Admin challenge expired or missing.' };
    }

    const passkey = await db.passkey.findFirst({
      where: { userId, credentialID: credential.id },
    });

    if (!passkey) {
      return { error: 'Unrecognized hardware security token.' };
    }

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: passkey.credentialID,
        credentialPublicKey: Buffer.from(passkey.publicKey),
        counter: passkey.counter,
        transports: Array.isArray(passkey.transports) 
          ? passkey.transports 
          : (typeof passkey.transports === 'string' && passkey.transports.length > 0 
              ? (passkey.transports.split(',') as AuthenticatorTransport[]) 
              : undefined),
      } as any,
      requireUserVerification: true,
    });

    if (!verification.verified) {
      return { error: 'Hardware key verification failed.' };
    }

    await redis.del(`admin_challenge:${userId}`);

    const token = await new SignJWT({ userId, role: 'SUPER_ADMIN' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'super_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 4,
      path: '/',
    });

    return { success: true };
  } catch (err: any) {
    console.error('Super Admin verification error:', err);
    return { error: 'Hardware authentication failed.' };
  }
}