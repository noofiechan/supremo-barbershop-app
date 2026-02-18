'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/supabase';
import { GuestTransaction, Service, Barber } from '@/lib/types';
import { generateReceiptPDF, downloadReceipt, generateReceiptFilename } from '@/lib/receipt';
import { ROUTES } from '@/lib/constants';

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transaction_id');
  const email = searchParams.get('email');

  const [transaction, setTransaction] = useState<GuestTransaction | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      if (!transactionId) return;

      const { data, error } = await db.getGuestTransaction(parseInt(transactionId));

      if (error || !data) {
        setError('Receipt not found');
        setLoading(false);
        return;
      }

      setTransaction(data);

      // Fetch related service and barber data
      if (data.service) {
        setService(data.service);
      }
      if (data.barber) {
        setBarber(data.barber);
      }
    } catch (err) {
      setError('Failed to load receipt');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
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
    });

    const filename = generateReceiptFilename(transaction.receipt_number);
    downloadReceipt(pdf, filename);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">Loading receipt...</div>
      </MainLayout>
    );
  }

  if (error || !transaction || !service) {
    return (
      <MainLayout>
        <Card className="max-w-md mx-auto mt-12">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <Link href={ROUTES.guestBook}>
              <Button className="w-full">Back to Booking</Button>
            </Link>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Booking Confirmed! ✓</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Receipt Details */}
            <div className="space-y-4 rounded-lg bg-gray-50 p-6">
              <div className="text-center mb-6">
                <p className="text-gray-600">Receipt Number</p>
                <p className="text-2xl font-bold font-mono">
                  {transaction.receipt_number}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Booking Information</h3>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{transaction.guest_email}</span>
                </div>

                {transaction.guest_phone && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{transaction.guest_phone}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold">{service.service_name}</span>
                  </div>

                  {barber && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Barber:</span>
                      <span className="font-semibold">
                        {barber.barber_fname} {barber.barber_lname}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {new Date(transaction.appointment_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{transaction.appointment_time}</span>
                  </div>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Total Amount:</span>
                  <span className="text-xl font-bold">
                    ₱{transaction.amount_paid.toFixed(2)}
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Payment Method:</strong> {transaction.payment_method} (Pay upon arrival)
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleDownloadPDF}
                className="w-full"
              >
                Download Receipt (PDF)
              </Button>

              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href={ROUTES.home}>Back to Home</Link>
              </Button>
            </div>

            {/* Footer Message */}
            <div className="rounded-lg bg-amber-50 p-4 text-center text-sm">
              <p className="text-amber-800">
                <strong>Please arrive 5-10 minutes before your appointment.</strong>
              </p>
              <p className="text-amber-700 mt-1">
                A copy of your receipt has been sent to {transaction.guest_email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
