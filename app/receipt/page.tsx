'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react'; //
import { MainLayout } from '@/components/layout/main-layout';

const ReceiptViewNoSSR = dynamic(
  () => import('./receipt-view'),
  { ssr: false }
);

export default function ReceiptPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        {/* Vercel is crashing because this tag is missing */}
        <Suspense fallback={<div>Loading receipt details...</div>}>
          <ReceiptViewNoSSR />
        </Suspense>
      </div>
    </MainLayout>
  );
}
