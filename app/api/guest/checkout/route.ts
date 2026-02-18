import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { ApiResponse } from '@/lib/types';

function generateReceiptNumber(): string {
  const date = new Date();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 1000);
  return `RCP-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const {
      guest_email,
      guest_phone,
      appointment_date,
      appointment_time,
      service_id,
      barber_id,
      amount_paid,
      payment_method,
    } = await request.json();

    // Validation
    if (
      !guest_email ||
      !appointment_date ||
      !appointment_time ||
      !service_id ||
      !barber_id ||
      !amount_paid
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Verify service exists
    const { data: service, error: serviceError } = await db.getServiceById(
      service_id
    );
    if (serviceError || !service) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Check if barber is available
    const { data: existingReservations } = await db.getReservationsByBarber(
      barber_id,
      appointment_date
    );

    const timeSlotTaken = existingReservations?.some(
      (res: any) =>
        res.appointment_time === appointment_time &&
        (res.status === 'Confirmed' || res.status === 'Pending')
    );

    if (timeSlotTaken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Time slot is not available',
        } as ApiResponse<null>,
        { status: 409 }
      );
    }

    // Generate receipt number
    const receipt_number = generateReceiptNumber();

    // Create guest transaction
    const { data: guestTransaction, error: transactionError } =
      await db.createGuestTransaction({
        guest_email,
        guest_phone: guest_phone || null,
        appointment_date,
        appointment_time,
        service_id,
        barber_id,
        amount_paid,
        payment_method: payment_method || 'Cash',
        receipt_number,
        status: 'Completed',
      });

    if (transactionError || !guestTransaction) {
      console.error('Guest transaction error:', transactionError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to complete checkout',
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: guestTransaction,
        message: SUCCESS_MESSAGES.guestCheckoutSuccess,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Guest checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: ERROR_MESSAGES.serverError,
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
