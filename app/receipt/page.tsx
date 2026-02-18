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

// Tells Next.js to skip static generation for this page
export const dynamic = 'force-dynamic';

export default function ReceiptPage() {
  return (
    <MainLayout>
      {/* Suspense is required when using useSearchParams in a client component */}
      <Suspense fallback={<div className="text-center py-20">Loading receipt details...</div>}>
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
      setError('Transaction ID missing from URL.');
    }
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      const { data, error: dbError } = await db.getGuestTransaction(parseInt(transactionId!));
      if (dbError || !data) {
        setError('Receipt not found.');
        return;
      }
      setTransaction(data);
      if (data.service) setService(data.service);
      if (data.barber) setBarber(data.barber);
    } catch (err) {
      setError('Failed to fetch transaction data.');
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

  if (loading) return <div className="text-center py-20">Locating your booking...</div>;

  if (error || !transaction || !service) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button asChild className="w-full"><Link href={ROUTES.home}>Return Home</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Booking Confirmed!</CardTitle>
          <p className="text-muted-foreground">Thank you for choosing Supremo Barbershop</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/30 p-4 rounded-lg text-center font-mono">
            <span className="text-xs text-muted-foreground uppercase">Receipt Number</span>
            <p className="text-xl font-bold">{transaction.receipt_number}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2"><span>Service:</span><span className="font-semibold">{service.service_name}</span></div>
            <div className="flex justify-between border-b pb-2"><span>Date:</span><span className="font-semibold">{transaction.appointment_date}</span></div>
            <div className="flex justify-between border-b pb-2"><span>Time:</span><span className="font-semibold">{transaction.appointment_time}</span></div>
            <div className="flex justify-between pt-2 text-lg font-bold"><span>Total:</span><span>₱{transaction.amount_paid.toFixed(2)}</span></div>
          </div>

          <Button onClick={handleDownload} className="w-full h-12 gap-2">
            Download PDF Summary
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href={ROUTES.home}>Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}