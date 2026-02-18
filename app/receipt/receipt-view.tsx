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
        setError('No transaction ID provided');
        return;
      }

      try {
        const { data, error: dbError } = await db.getGuestTransaction(parseInt(transactionId));
        if (dbError || !data) {
          setError('Receipt not found');
        } else {
          setTransaction(data);
          if (data.service) setService(data.service);
          if (data.barber) setBarber(data.barber);
        }
      } catch (err) {
        setError('Failed to load receipt');
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
    if (pdf) downloadReceipt(pdf, generateReceiptFilename(transaction.receipt_number));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader><CardTitle>Receipt {transaction?.receipt_number}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p><strong>Service:</strong> {service?.service_name}</p>
        <p><strong>Total:</strong> ₱{transaction?.amount_paid.toFixed(2)}</p>
        <Button onClick={handleDownload} className="w-full">Download PDF</Button>
        <Button variant="outline" asChild className="w-full"><Link href={ROUTES.home}>Back Home</Link></Button>
      </CardContent>
    </Card>
  );
}