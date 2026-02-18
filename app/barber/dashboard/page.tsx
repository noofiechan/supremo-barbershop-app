'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/components/layout/main-layout';
import { getSessionFromStorage } from '@/lib/auth';
import { db } from '@/lib/supabase';
import { Reservation } from '@/lib/types';
import { ROUTES } from '@/lib/constants';

export default function BarberDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const session = getSessionFromStorage();
    if (!session || session.user_type !== 'BARBER') {
      router.push(ROUTES.login);
      return;
    }
    setSession(session);
    fetchReservations(session.related_id, selectedDate);
  }, [router]);

  const fetchReservations = async (barberId: number, date: string) => {
    const { data, error } = await db.getReservationsByBarber(barberId, date);
    if (!error && data) {
      setReservations(data);
    }
    setLoading(false);
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    if (session) {
      fetchReservations(session.related_id, newDate);
    }
  };

  if (!session) {
    return <MainLayout>Loading...</MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Barber Dashboard</h1>
          <p className="text-gray-600">View your daily schedule</p>
        </div>

        {/* Date Selector */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="font-semibold">Select Date:</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
            <CardDescription>
              {reservations.length} appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading schedule...</div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No appointments scheduled for this date
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <Card
                    key={res.reservation_id}
                    className="bg-white border border-gray-200"
                  >
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-xs text-gray-600">Time</p>
                          <p className="text-2xl font-bold">{res.appointment_time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Service</p>
                          <p className="font-semibold">
                            {(res.service as any)?.service_name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Customer</p>
                          <p className="font-semibold">
                            {(res.customer as any)?.fname || 'Guest'}{' '}
                            {(res.customer as any)?.lname || ''}
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
