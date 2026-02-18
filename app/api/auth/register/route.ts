import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { hashPassword, isValidEmail, isStrongPassword, createToken } from '@/lib/auth';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { ApiResponse, SessionUser } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fname, lname, phone_no, address_line1, address_line2 } =
      await request.json();

    // Validation
    if (!email || !password || !fname || !lname) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email, password, first name, and last name are required',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 6 characters with numbers and letters',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingAuth } = await db.getAuthUser(email);
    if (existingAuth) {
      return NextResponse.json(
        {
          success: false,
          error: ERROR_MESSAGES.emailAlreadyExists,
        } as ApiResponse<null>,
        { status: 409 }
      );
    }

    // Create customer
    const { data: customer, error: customerError } = await db.createCustomer({
      fname,
      lname,
      email,
      phone_no: phone_no || null,
      address_line1: address_line1 || null,
      address_line2: address_line2 || null,
    });

    if (customerError || !customer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create customer profile',
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create auth user
    const { data: authUser, error: authError } = await db.createAuthUser({
      email,
      password_hash: passwordHash,
      user_type: 'CUSTOMER',
      related_id: customer.customer_id,
    });

    if (authError || !authUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create user account',
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Create session
    const sessionUser: SessionUser = {
      user_id: authUser.user_id,
      email: authUser.email,
      user_type: authUser.user_type,
      related_id: authUser.related_id,
    };

    const token = await createToken(sessionUser);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: sessionUser,
          token,
        },
        message: SUCCESS_MESSAGES.loginSuccess,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      {
        success: false,
        error: ERROR_MESSAGES.serverError,
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
