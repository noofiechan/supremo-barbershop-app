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
      reservation_id,
      amount_paid,
      discount_applied,
      payment_method,
      cashier_id,
    } = await request.json();

    // Validation
    if (!reservation_id || !amount_paid || !payment_method) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Get reservation
    const { data: reservation, error: reservationError } =
      await db.getReservationById(reservation_id);

    if (reservationError || !reservation) {
      return NextResponse.json(
        {
          success: false,
          error: ERROR_MESSAGES.reservationNotFound,
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Check if payment already exists
    const { data: existingPayment } = await db.getPaymentByReservation(
      reservation_id
    );

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment already processed for this reservation',
        } as ApiResponse<null>,
        { status: 409 }
      );
    }

    // Generate receipt number
    const receipt_number = generateReceiptNumber();

    // Create payment record
    const { data: payment, error: paymentError } = await db.createPayment({
      reservation_id,
      payment_method,
      amount_paid,
      discount_applied: discount_applied || 0,
      payment_date: new Date().toISOString().split('T')[0],
      receipt_number,
      cashier_id: cashier_id || null,
    });

    if (paymentError || !payment) {
      console.error('Payment creation error:', paymentError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process payment',
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Update reservation payment status
    const { data: updatedReservation, error: updateError } = await db.supabase
      .from('reservation')
      .update({ payment_status: 'Paid' })
      .eq('reservation_id', reservation_id)
      .select()
      .single();

    if (updateError) {
      console.error('Reservation update error:', updateError);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          payment,
          reservation: updatedReservation,
          receiptNumber: receipt_number,
        },
        message: SUCCESS_MESSAGES.paymentSuccess,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: ERROR_MESSAGES.serverError,
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
