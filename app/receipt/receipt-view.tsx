'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/supabase';
import { GuestTransaction, Service, Barber } from '@/lib/types';
import { generateReceiptPDF, downloadReceipt, generateReceiptFilename } from '@/lib/receipt';
import { ROUTES } from '@/lib/constants';

export default function ReceiptView() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transaction_id');

  const [transaction, setTransaction] = useState<GuestTransaction | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTransaction() {
      if (!transactionId) {
        setLoading(false);
        setError('No transaction ID provided in the URL.');
        return;
      }

      try {
        const { data, error: dbError } = await db.getGuestTransaction(parseInt(transactionId));
        
        if (dbError || !data) {
          setError('Receipt not found in our records.');
        } else {
          setTransaction(data);
          if (data.service) setService(data.service);
          if (data.barber) setBarber(data.barber);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load receipt details.');
      } finally {
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [transactionId]);

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

  if (loading) return <div className="text-center py-10 italic">Verifying transaction...</div>;

  if (error || !transaction || !service) {
    return (
      <Card className="max-w-md mx-auto mt-10 border-red-200">
        <CardContent className="pt-6 text-center">
          <p className="text-red-600 font-medium mb-4">{error || 'Something went wrong.'}</p>
          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.home}>Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black text-primary">BOOKING CONFIRMED</CardTitle>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Digital Receipt</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-xl text-center border border-dashed">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Receipt Number</span>
            <p className="text-2xl font-mono font-bold tracking-tight">{transaction.receipt_number}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-bold">{service.service_name}</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-bold">{new Date(transaction.appointment_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-bold">{transaction.appointment_time}</span>
            </div>
            <div className="flex justify-between pt-4">
              <span className="text-lg font-black">TOTAL PAID:</span>
              <span className="text-2xl font-black text-primary">₱{transaction.amount_paid.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={handleDownload} className="w-full h-12 text-lg shadow-md">
              📥 Download PDF Receipt
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href={ROUTES.home}>Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}