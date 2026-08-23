'use server';

import { db } from '@repo/database';
import { 
  generateRegistrationOptions, 
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from '@simplewebauthn/server';
import { createSessionToken } from '@repo/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const rpName = 'Secure Monorepo App';
const rpID = 'localhost';
const expectedOrigin = 'http://localhost:3000';

const challengeStore = new Map<string, string>();

/**
 * Helper to record session in database and browser cookie
 */
async function createAndStoreSession(userId: string) {
  const token = await createSessionToken(userId);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  // Save session to Prisma Session table for admin monitoring
  await db.session.create({
    data: {
      sessionToken: token,
      userId,
      expires,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: 'session_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });
}

export async function getRegistrationOptions(email: string) {
  if (!email) return { error: 'Email is required to register a passkey.' };

  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({ data: { email } });
  }

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new TextEncoder().encode(user.id),
    userName: email,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
  });

  challengeStore.set(user.id, options.challenge);
  return { options, userId: user.id };
}

export async function verifyAndRegisterPasskey(userId: string, credential: any) {
  const expectedChallenge = challengeStore.get(userId);
  if (!expectedChallenge) {
    return { error: 'Registration challenge expired or missing.' };
  }

  try {
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { 
        credentialPublicKey, 
        credentialID, 
        counter, 
        credentialDeviceType, 
        credentialBackedUp 
      } = verification.registrationInfo;

      await db.passkey.create({
        data: {
          userId,
          credentialID,
          publicKey: Buffer.from(credentialPublicKey),
          webAuthnUserId: userId,
          counter,
          deviceType: credentialDeviceType,
          backedUp: credentialBackedUp,
          transports: credential.response.transports ? credential.response.transports.join(',') : '',
        },
      });

      challengeStore.delete(userId);

      // Create database session record & cookie
      await createAndStoreSession(userId);

      return { success: true };
    }

    return { error: 'Passkey verification failed.' };
  } catch (err: any) {
    console.error('Passkey registration error:', err);
    return { error: err.message || 'Passkey registration failed.' };
  }
}

/**
 * Step 3: Generate WebAuthn Authentication (Sign In) Options
 */
export async function getAuthenticationOptions(email: string) {
  if (!email) return { error: 'Email is required to sign in with a passkey.' };

  const user = await db.user.findUnique({
    where: { email },
    include: { passkeys: true },
  });

  if (!user || user.passkeys.length === 0) {
    return { error: 'No passkeys found for this account. Please register first.' };
  }

  const allowCredentials = user.passkeys.map((p: any) => ({
    id: p.credentialID,
    transports: p.transports ? (p.transports.split(',') as any) : undefined,
  }));

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: 'preferred',
  });

  challengeStore.set(user.id, options.challenge);
  return { options, userId: user.id };
}

/**
 * Step 4: Verify WebAuthn Authentication Response
 */
export async function verifyAndAuthenticatePasskey(userId: string, credential: any) {
  const expectedChallenge = challengeStore.get(userId);
  if (!expectedChallenge) {
    return { error: 'Authentication challenge expired or missing.' };
  }

  const passkey = await db.passkey.findFirst({
    where: { userId, credentialID: credential.id },
  });

  if (!passkey) {
    return { error: 'Authenticator not registered with this account.' };
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: {
        credentialPublicKey: passkey.publicKey,
        credentialID: new Uint8Array(Buffer.from(passkey.credentialID)),
        counter: passkey.counter,
      } as any,
    });

    if (verification.verified) {
      await db.passkey.update({
        where: { id: passkey.id },
        data: { counter: verification.authenticationInfo.newCounter },
      });

      challengeStore.delete(userId);

      // Create database session record & cookie
      await createAndStoreSession(userId);

      return { success: true };
    }

    return { error: 'Passkey verification failed.' };
  } catch (err: any) {
    console.error('Passkey authentication error:', err);
    return { error: err.message || 'Passkey authentication failed.' };
  }
}

/**
 * Delete a registered passkey for the current user
 */
export async function deletePasskey(passkeyId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return { error: 'Unauthorized session.' };
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    const userId = payload.userId || payload.sub;

    const passkey = await db.passkey.findFirst({
      where: { id: passkeyId, userId },
    });

    if (!passkey) {
      return { error: 'Passkey not found or unauthorized.' };
    }

    await db.passkey.delete({
      where: { id: passkeyId },
    });

    return { success: true };
  } catch (err: any) {
    console.error('Passkey deletion error:', err);
    return { error: err.message || 'Failed to delete passkey.' };
  }
}

/**
 * Handle user logout by removing session from database and clearing cookie
 */
export async function handleLogout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (token) {
    // Clean up session record from database
    await db.session.deleteMany({
      where: { sessionToken: token },
    }).catch(() => {});
  }

  cookieStore.delete('session_token');
  redirect('/');
}