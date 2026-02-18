import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyPassword, createToken } from '@/lib/auth';
import { ERROR_MESSAGES } from '@/lib/constants';
import { ApiResponse, SessionUser } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Trim the email right away to avoid query misses
    const email = body.email?.trim();
    const password = body.password;

    console.log('--- Login Attempt Starting ---');
    console.log('Email received:', email);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // 1. Get auth user from database
    const { data: authUser, error: authError } = await db.getAuthUser(email);

    if (authError || !authUser) {
      console.error('Database Error or User Not Found:', authError);
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.invalidCredentials } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // --- DEBUG: Generate a fresh hash to compare ---
    // Copy the output of this from your terminal if login still fails!
    const bcrypt = require('bcryptjs');
    const freshHash = await bcrypt.hash('password123', 10);
    console.log('DEBUG: If you are typing "password123", your DB hash SHOULD be:', freshHash);
    // -----------------------------------------------

    console.log('User found in DB:', authUser.email);
    
    // 2. Verify password
    // We trim both sides to ensure no hidden newlines or spaces from the DB/Form cause a fail
    const passwordValid = await verifyPassword(password.trim(), authUser.password_hash.trim());
    
    console.log('Is password valid?:', passwordValid);

    if (!passwordValid) {
      console.warn('Password mismatch for user:', email);
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.invalidCredentials } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // 3. Create session user
    const sessionUser: SessionUser = {
      user_id: authUser.user_id,
      email: authUser.email,
      user_type: authUser.user_type,
      related_id: authUser.related_id,
    };

    // 4. Create token
    const token = await createToken(sessionUser);
    console.log('Login successful, token created for:', email);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: sessionUser,
          token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.serverError } as ApiResponse<null>,
      { status: 500 }
    );
  }
}