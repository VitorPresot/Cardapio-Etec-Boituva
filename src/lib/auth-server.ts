import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'etec_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAuthSecret(): string {
  return (process.env.AUTH_SECRET || '').trim();
}

function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || '').trim();
}

function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD || '').trim();
}

function encodeBase64Url(value: Uint8Array): string {
  let binary = '';
  value.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hashSessionPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const valueData = encoder.encode(payload);
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, valueData);
  return encodeBase64Url(new Uint8Array(signature));
}

export function isValidAdminCredentials(email: unknown, password: unknown): boolean {
  if (typeof email !== 'string' || typeof password !== 'string') return false;
  const validEmail = getAdminEmail();
  const validPassword = getAdminPassword();
  return validEmail.length > 0 && validPassword.length > 0 && email.trim() === validEmail && password === validPassword;
}

async function buildSignedToken(email: string, expiresAt: number): Promise<string> {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error('AUTH_SECRET is not configured');
  }

  const payload = `${email}:${expiresAt}`;
  const digest = await hashSessionPayload(payload, secret);
  return `${encodeBase64Url(new TextEncoder().encode(email))}.${expiresAt}.${digest}`;
}

function parseSessionCookieValue(rawValue: string | null): { email: string; expiresAt: number; signature: string } | null {
  if (!rawValue) return null;

  const parts = rawValue.split('.');
  if (parts.length !== 3) return null;

  const [encodedEmail, expiresAtText, signature] = parts;
  const expiresAt = Number(expiresAtText);
  if (!encodedEmail || Number.isNaN(expiresAt) || !signature) return null;

  try {
    return {
      email: new TextDecoder().decode(decodeBase64Url(encodedEmail)),
      expiresAt,
      signature,
    };
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(response: NextResponse): Promise<void> {
  const secret = getAuthSecret();
  const adminEmail = getAdminEmail();
  if (!secret || !adminEmail) {
    return;
  }

  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const value = await buildSignedToken(adminEmail, expiresAt);
  response.cookies.set(SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
    expires: new Date(expiresAt),
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
}

export function getAdminSessionFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((part) => part.trim());
  const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (!sessionCookie) return null;
  return decodeURIComponent(sessionCookie.split('=').slice(1).join('='));
}

export async function verifyAdminSessionValue(sessionValue: string | null): Promise<boolean> {
  if (!sessionValue) return false;

  const secret = getAuthSecret();
  if (!secret) return false;

  const parsed = parseSessionCookieValue(sessionValue);
  if (!parsed) return false;

  const expectedSignature = await hashSessionPayload(`${parsed.email}:${parsed.expiresAt}`, secret);
  if (parsed.signature.length !== expectedSignature.length) return false;

  try {
    return parsed.signature === expectedSignature && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}
