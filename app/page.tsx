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
        {/* This boundary is required to fix the 'missing-suspense' error */}
        <Suspense fallback={<div className="text-center py-20">Loading receipt details...</div>}>
          <ReceiptViewNoSSR />
        </Suspense>
      </div>
    </MainLayout>
  );
}
