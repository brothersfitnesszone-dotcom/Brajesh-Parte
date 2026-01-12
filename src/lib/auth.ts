import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'cyber-discipline-secret-key-2024';

export interface TokenPayload {
    userId: string;
    email: string;
}

export function generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}

export async function setAuthCookie(userId: string, email: string): Promise<void> {
    const token = generateToken(userId, email);
    const cookieStore = await cookies();

    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;
    return verifyToken(token);
}

export async function authenticateUser(email: string, password: string): Promise<{ userId: string; email: string } | null> {
    // 1. Check Environment Variables (Master Admin)
    const envEmail = process.env.ADMIN_EMAIL?.trim();
    const envPassword = process.env.ADMIN_PASSWORD?.trim();

    if (envEmail && email === envEmail) {
        // Direct string comparison for env password
        if (password === envPassword) {
            return { userId: 'master-admin', email: envEmail };
        }
    }

    // 2. Fallback to Supabase Database
    const user = await getUserByEmail(email);
    if (!user) return null;

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) return null;

    return { userId: user.id, email: user.email };
}
