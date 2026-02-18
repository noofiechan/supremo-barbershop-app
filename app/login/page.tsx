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

// Force dynamic to prevent prerender errors during pnpm build
export const dynamic = 'force-dynamic';

export default function ReceiptPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="text-center py-20">Loading your receipt...</div>}>
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

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    } else {
      setLoading(false);
      setError('Missing Transaction ID');
    }
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      const { data, error: dbError } = await db.getGuestTransaction(parseInt(transactionId!));
      if (dbError || !data) {
        setError('We couldn\'t find that receipt.');
        return;
      }
      setTransaction(data);
      if (data.service) setService(data.service);
      if (data.barber) setBarber(data.barber);
    } catch (err) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!transaction || !service) return;

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
      downloadReceipt(pdf, generateReceiptFilename(transaction.receipt_number));
    }
  };

  if (loading) return <div className="text-center py-20">Verifying transaction...</div>;

  if (error || !transaction || !service) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardContent className="pt-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild className="w-full"><Link href={ROUTES.home}>Go Home</Link></Button>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = transaction.status === 'Completed';

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card className={`border-t-4 ${isCompleted ? 'border-t-green-600' : 'border-t-amber-500'}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isCompleted ? 'Payment Received! ✓' : 'Booking Confirmed!'}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {isCompleted ? 'Official Receipt' : 'Appointment Summary'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Receipt Number</span>
            <p className="text-2xl font-mono font-bold">{transaction.receipt_number}</p>
            <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-white border">
              STATUS: {transaction.status?.toUpperCase()}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Service</span><span className="font-bold">{service.service_name}</span></div>
            {barber && <div className="flex justify-between"><span>Barber</span><span className="font-bold">{barber.barber_fname}</span></div>}
            <div className="flex justify-between"><span>Date</span><span className="font-bold">{transaction.appointment_date}</span></div>
            <div className="flex justify-between"><span>Time</span><span className="font-bold">{transaction.appointment_time}</span></div>
            <div className="border-t pt-2 flex justify-between text-base font-bold">
              <span>Amount Paid</span>
              <span>₱{transaction.amount_paid.toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={handleDownload} className="w-full bg-primary h-12">
            📥 Download {isCompleted ? 'Official Receipt' : 'Booking Summary'} (PDF)
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href={ROUTES.home}>Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}