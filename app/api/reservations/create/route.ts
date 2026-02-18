import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const {
      appointment_date,
      appointment_time,
      appointment_type,
      customer_id,
      barber_id,
      service_id,
    } = await request.json();

    // Validation
    if (
      !appointment_date ||
      !appointment_time ||
      !appointment_type ||
      !barber_id ||
      !service_id
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

    // Check if barber is available at that time
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

    // Create reservation
    const { data: reservation, error: reservationError } =
      await db.createReservation({
        appointment_date,
        appointment_time,
        appointment_type,
        customer_id: customer_id || null,
        barber_id,
        service_id,
        status: 'Confirmed',
        payment_status: 'Unpaid',
      });

    if (reservationError || !reservation) {
      console.error('Reservation creation error:', reservationError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create reservation',
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: reservation,
        message: SUCCESS_MESSAGES.bookingSuccess,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: ERROR_MESSAGES.serverError,
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
