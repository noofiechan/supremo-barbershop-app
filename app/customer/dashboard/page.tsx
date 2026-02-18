'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/main-layout';
import { getSessionFromStorage } from '@/lib/auth';
import { db } from '@/lib/supabase';
import { Reservation } from '@/lib/types';
import { ROUTES } from '@/lib/constants';

export default function CustomerDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSessionFromStorage();
    if (!session || session.user_type !== 'CUSTOMER') {
      router.push(ROUTES.login);
      return;
    }
    setSession(session);
    fetchReservations(session.related_id);
  }, [router]);

  const fetchReservations = async (customerId: number) => {
    const { data, error } = await db.getReservationsByCustomer(customerId);
    if (!error && data) {
      setReservations(data);
    }
    setLoading(false);
  };

  if (!session) {
    return <MainLayout>Loading...</MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {session.email}</h1>
          <p className="text-gray-600">Manage your appointments and bookings</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          <Link href={ROUTES.guestBook}>
            <Button variant="outline" className="w-full h-12">
              New Booking
            </Button>
          </Link>
          <Button variant="outline" className="w-full h-12">
            View Profile
          </Button>
          <Button variant="outline" className="w-full h-12">
            Payment History
          </Button>
        </div>

        {/* Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
            <CardDescription>
              {reservations.length} total reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading appointments...</div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No appointments yet</p>
                <Link href={ROUTES.guestBook}>
                  <Button>Book Now</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <Card
                    key={res.reservation_id}
                    className="bg-white border border-gray-200"
                  >
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        <div>
                          <p className="text-xs text-gray-600">Date</p>
                          <p className="font-semibold">
                            {new Date(res.appointment_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Time</p>
                          <p className="font-semibold">{res.appointment_time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Service</p>
                          <p className="font-semibold">
                            {(res.service as any)?.service_name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Status</p>
                          <p className={`font-semibold text-sm ${
                            res.status === 'Completed'
                              ? 'text-green-600'
                              : res.status === 'Cancelled'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }`}>
                            {res.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Payment</p>
                          <p className={`font-semibold text-sm ${
                            res.payment_status === 'Paid'
                              ? 'text-green-600'
                              : 'text-orange-600'
                          }`}>
                            {res.payment_status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
