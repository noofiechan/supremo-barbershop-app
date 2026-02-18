import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { SessionUser } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || '44e8ead1-d062-4736-bfbb-da89fc2f4edd'
);

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // We use compareSync to eliminate any async/await confusion in the library
    const isMatch = bcrypt.compareSync(password.trim(), hash.trim());
    
    console.log(`DEBUG: Comparing "${password.trim()}" against hash... Result: ${isMatch}`);
    return isMatch;
  } catch (error) {
    console.error("Bcrypt Error:", error);
    return false;
  }
}

// JWT Token management - CORRECTED SYNTAX
export async function createToken(user: SessionUser): Promise<string> {
  // Use the builder pattern required by jose
  const token = await new SignJWT({
      user_id: user.user_id,
      email: user.email,
      user_type: user.user_type,
      related_id: user.related_id,
    })
    .setProtectedHeader({ alg: 'HS256' }) // This line is mandatory
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    // jwtVerify returns an object with a 'payload' property
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Session helpers
export function setSessionCookie(token: string): void {
  // In Next.js, this would be handled by the server
  // Store in httpOnly cookie via Set-Cookie header
  if (typeof window === 'undefined') {
    // Server-side only
  }
}

export function getSessionFromStorage(): SessionUser | null {
  if (typeof window === 'undefined') return null;

  const session = localStorage.getItem('supremo_session');
  if (!session) return null;

  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}

export function setSessionInStorage(user: SessionUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('supremo_session', JSON.stringify(user));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('supremo_session');
  localStorage.removeItem('supremo_auth_token');
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password: string): boolean {
  // At least 6 characters, contains number and letter
  const passwordRegex = /^(?=.*[a-z])(?=.*[0-9]).{6,}$/i;
  return passwordRegex.test(password);
}
