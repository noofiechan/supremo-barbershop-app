'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { getSessionFromStorage } from '@/lib/auth';
import { db } from '@/lib/supabase';
import { ROUTES } from '@/lib/constants';

export default function CashierDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pendingReservations: 0,
    totalAmount: 0,
    todayAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = getSessionFromStorage();
    if (!sessionData || sessionData.user_type !== 'CASHIER') {
      router.push(ROUTES.login);
      return;
    }
    setSession(sessionData);
    fetchPayments();
  }, [router]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.supabase
        .from('guest_transaction')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        setPayments(data);

        // Revenue logic: Only count "Completed" status
        const totalAmount = data
          .filter((p: any) => p.status === 'Completed')
          .reduce((sum: number, p: any) => sum + (p.amount_paid || 0), 0);
        
        const today = new Date().toISOString().split('T')[0];
        const todayAmount = data
          .filter((p: any) => p.status === 'Completed' && p.created_at?.split('T')[0] === today)
          .reduce((sum: number, p: any) => sum + (p.amount_paid || 0), 0);

        // Reservation logic: Count "Pending" status for onsite queue
        const pendingReservations = data.filter((p: any) => p.status === 'Pending').length;

        setStats({
          pendingReservations,
          totalAmount,
          todayAmount,
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string, currentAmount: number) => {
    const confirmAction = confirm(`Are you sure you want to set this transaction to ${newStatus}?`);
    if (!confirmAction) return;

    try {
      // Calls the function in lib/supabase.ts
      const { error } = await db.updateTransactionStatus(id, newStatus, currentAmount);
      if (error) throw error;
      
      // Re-run fetch to refresh the table and recalculate the stats
      await fetchPayments();
    } catch (err) {
      alert('Failed to update status. Please try again.');
      console.error(err);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="animate-pulse text-lg font-medium">Authenticating...</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cashier Dashboard</h1>
            <p className="text-gray-600">Logged in as {session.email}</p>
          </div>
          <p className="text-xs text-gray-400 font-mono">Server Time: {new Date().toLocaleTimeString()}</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          <Card className="border-l-4 border-l-green-600 shadow-sm">
            <CardContent className="pt-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Revenue</p>
              <p className="text-3xl font-bold text-green-700">₱{stats.todayAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <CardContent className="pt-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Queue</p>
              <p className="text-3xl font-bold text-amber-600">{stats.pendingReservations} Pending</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600 shadow-sm">
            <CardContent className="pt-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-700">₱{stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader className="bg-gray-50/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Transaction Management</CardTitle>
                <CardDescription>Update statuses based on onsite customer activity</CardDescription>
              </div>
              <button 
                onClick={fetchPayments} 
                className="bg-white border px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                Refresh Records
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-20 text-gray-400 italic">Updating transaction log...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-left border-b">
                      <th className="py-4 px-4 font-semibold uppercase text-[10px]">Receipt</th>
                      <th className="py-4 px-4 font-semibold uppercase text-[10px]">Customer</th>
                      <th className="py-4 px-4 font-semibold uppercase text-[10px]">Appointment</th>
                      <th className="py-4 px-4 font-semibold uppercase text-[10px] text-right">Amount</th>
                      <th className="py-4 px-4 font-semibold uppercase text-[10px] text-center">Status Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {payments.map((payment) => (
                      <tr key={payment.guest_transaction_id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-4 font-mono text-xs text-blue-600 font-bold">{payment.receipt_number}</td>
                        <td className="py-4 px-4 font-medium">{payment.guest_email}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span>{new Date(payment.appointment_date).toLocaleDateString()}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">{payment.appointment_time}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-gray-900">
                          ₱{(payment.amount_paid || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center h-full">
                            {payment.status === 'Pending' ? (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleStatusUpdate(payment.guest_transaction_id, 'Completed', payment.amount_paid)}
                                  className="bg-green-600 text-white px-4 py-1.5 rounded-md text-[10px] font-bold uppercase hover:bg-green-700 shadow-sm transition-all active:scale-95"
                                >
                                  Complete & Pay
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(payment.guest_transaction_id, 'Cancelled', 0)}
                                  className="bg-white border border-red-200 text-red-600 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase hover:bg-red-50 shadow-sm transition-all active:scale-95"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1.5">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                  payment.status === 'Completed' 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                                }`}>
                                  {payment.status}
                                </span>
                                {payment.status === 'Completed' && (
                                  <button 
                                    onClick={() => handleStatusUpdate(payment.guest_transaction_id, 'Refunded', 0)}
                                    className="text-[9px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-widest"
                                  >
                                    [ Issue Refund ]
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}