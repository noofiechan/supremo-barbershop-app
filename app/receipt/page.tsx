'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/supabase';
import { GuestTransaction, Service, Barber } from '@/lib/types';
import { generateReceiptPDF, downloadReceipt, generateReceiptFilename } from '@/lib/receipt';
import { ROUTES } from '@/lib/constants';

// 1. Force dynamic rendering to prevent build-time static generation
export const dynamic = 'force-dynamic';

export default function ReceiptPage() {
  return (
    <MainLayout>
      {/* 2. Wrap in Suspense to fix the useSearchParams build error */}
      <Suspense fallback={<div className="text-center py-12">Initializing receipt engine...</div>}>
        <ReceiptContent />
      </Suspense>
    </MainLayout>
  );
}

function ReceiptContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transaction_id');

  const [transaction, setTransaction] = useState<GuestTransaction | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // 3. Ensure component is mounted on client before using browser APIs
  useEffect(() => {
    setIsMounted(true);
    if (transactionId) {
      fetchTransaction();
    } else {
      setLoading(false);
      setError('No transaction ID provided');
    }
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      if (!transactionId) return;

      const { data, error } = await db.getGuestTransaction(parseInt(transactionId));

      if (error || !data) {
        setError('Receipt not found in our records');
        return;
      }

      setTransaction(data);
      if (data.service) setService(data.service);
      if (data.barber) setBarber(data.barber);
      
    } catch (err) {
      setError('Failed to load receipt details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!transaction || !service || !isMounted) return;

    // Pass the status so the utility can verify payment
    const pdf = generateReceiptPDF({
      receiptNumber: transaction.receipt_number,
      date: transaction.appointment_date,
      time: transaction.appointment_time,
      service,
      barber: barber || undefined,
      amount: transaction.amount_paid,
      paymentMethod: transaction.payment_method,
      customerEmail: transaction.guest_email,
      status: transaction.status || 'Pending' 
    });

    if (pdf) {
      const filename = generateReceiptFilename(transaction.receipt_number);
      downloadReceipt(pdf, filename);
    } else {
      alert("Receipt can only be downloaded for 'Completed' transactions.");
    }
  };

  if (loading) return <div className="text-center py-12">Loading receipt...</div>;

  if (error || !transaction || !service) {
    return (
      <Card className="max-w-md mx-auto mt-12 shadow-lg border-red-100">
        <CardContent className="pt-6 text-center">
          <div className="mb-4 text-red-500 text-4xl">⚠️</div>
          <p className="text-gray-800 font-semibold mb-4">{error}</p>
          <Link href={ROUTES.home}>
            <Button className="w-full">Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="shadow-xl border-t-4 border-t-green-600">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 text-green-700 p-2 rounded-full">✓</div>
          </div>
          <CardTitle className="text-2xl font-black">Booking Confirmed</CardTitle>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Official Receipt</p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="space-y-4 rounded-xl bg-gray-50 p-6 border border-gray-100">
            <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
              <p className="text-[10px] uppercase font-bold text-gray-400">Transaction ID</p>
              <p className="text-xl font-mono font-bold text-blue-700">
                {transaction.receipt_number}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Customer:</span>
                <span className="font-bold">{transaction.guest_email}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service:</span>
                <span className="font-bold">{service.service_name}</span>
              </div>

              {barber && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Barber:</span>
                  <span className="font-bold">{barber.barber_fname} {barber.barber_lname}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Schedule:</span>
                <span className="font-bold text-right">
                  {new Date(transaction.appointment_date).toLocaleDateString()}<br/>
                  <span className="text-xs text-gray-400">at {transaction.appointment_time}</span>
                </span>
              </div>

              <div className="pt-4 mt-4 border-t flex justify-between items-center">
                <span className="font-black text-lg">TOTAL PAID</span>
                <span className="text-2xl font-black text-green-700">
                  ₱{transaction.amount_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={handleDownloadPDF} 
              className="w-full bg-blue-700 hover:bg-blue-800 h-12"
            >
              📥 Download PDF Receipt
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href={ROUTES.home}>Return to Homepage</Link>
            </Button>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
            <p className="text-xs text-amber-800 leading-relaxed text-center italic">
              A confirmation has been sent to your email. Please present this digital receipt or the receipt number upon arrival.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}