'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/components/layout/main-layout';
import { getSessionFromStorage } from '@/lib/auth';
import { db } from '@/lib/supabase';
import { ROUTES } from '@/lib/constants';

export default function ManagerDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [reservations, setReservations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalBarbers: 0,
    todayRevenue: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const session = getSessionFromStorage();
    if (!session || session.user_type !== 'MANAGER') {
      router.push(ROUTES.login);
      return;
    }
    setSession(session);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    // Fetch barbers
    const { data: barbersData } = await db.getAvailableBarbers();
    if (barbersData) {
      setBarbers(barbersData);
      setStats((prev) => ({ ...prev, totalBarbers: barbersData.length }));
    }

    // Fetch all reservations
    const { data: allReservations } = await db.supabase
      .from('reservation')
      .select('*')
      .order('appointment_date', { ascending: false })
      .limit(50);

    if (allReservations) {
      setReservations(allReservations);
      setStats((prev) => ({ ...prev, totalReservations: allReservations.length }));
    }

    // Fetch payments
    const { data: paymentsData } = await db.supabase
      .from('guest_transaction')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (paymentsData) {
      setPayments(paymentsData);

      const totalRevenue = paymentsData.reduce(
        (sum: number, p: any) => sum + (p.amount_paid || 0),
        0
      );
      const today = new Date().toISOString().split('T')[0];
      const todayRevenue = paymentsData
        .filter((p: any) => p.created_at?.split('T')[0] === today)
        .reduce((sum: number, p: any) => sum + (p.amount_paid || 0), 0);

      setStats((prev) => ({
        ...prev,
        totalRevenue,
        todayRevenue,
      }));
    }

    setLoading(false);
  };

  if (!session) {
    return <MainLayout>Loading...</MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Overview and management of all operations</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold">₱{stats.todayRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold">₱{stats.totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Total Reservations</p>
              <p className="text-3xl font-bold">{stats.totalReservations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Active Barbers</p>
              <p className="text-3xl font-bold">{stats.totalBarbers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="barbers">Barbers</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Reservations Today</span>
                    <span className="font-bold">
                      {reservations.filter(
                        (r) => r.appointment_date === selectedDate
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Barbers</span>
                    <span className="font-bold">{barbers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Payments</span>
                    <span className="font-bold">
                      {reservations.filter(
                        (r) => r.payment_status === 'Unpaid'
                      ).length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Manage staff, services, and system settings from the admin panel
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Reservations</CardTitle>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No reservations
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reservations.slice(0, 20).map((res) => (
                      <div
                        key={res.reservation_id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">
                            {res.appointment_date} at {res.appointment_time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {res.status}
                          </p>
                        </div>
                        <span className={`text-sm font-semibold ${
                          res.payment_status === 'Paid'
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }`}>
                          {res.payment_status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Barbers Tab */}
          <TabsContent value="barbers">
            <Card>
              <CardHeader>
                <CardTitle>Barber Staff</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : barbers.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No barbers registered
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {barbers.map((barber) => (
                      <div
                        key={barber.barber_id}
                        className="rounded-lg border p-4"
                      >
                        <p className="font-semibold">
                          {barber.barber_fname} {barber.barber_lname}
                        </p>
                        <p className="text-sm text-gray-600">
                          ID: {barber.barber_id}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No transactions
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-2 px-2">Receipt</th>
                          <th className="text-left py-2 px-2">Date</th>
                          <th className="text-left py-2 px-2">Time</th>
                          <th className="text-right py-2 px-2">Amount</th>
                          <th className="text-left py-2 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {payments.slice(0, 20).map((payment) => (
                          <tr key={payment.guest_transaction_id}>
                            <td className="py-2 px-2 font-mono text-xs">
                              {payment.receipt_number}
                            </td>
                            <td className="py-2 px-2">
                              {new Date(
                                payment.appointment_date
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-2">{payment.appointment_time}</td>
                            <td className="py-2 px-2 text-right font-semibold">
                              ₱{payment.amount_paid.toFixed(2)}
                            </td>
                            <td className="py-2 px-2">
                              <span className="inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
