'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react'; // MUST add this import
import { MainLayout } from '@/components/layout/main-layout';

const ReceiptViewNoSSR = dynamic(
  () => import('./receipt-view'),
  { ssr: false }
);

export default function ReceiptPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        {/* Wrapping in Suspense is what fixes the Build Error in your screenshot */}
        <Suspense fallback={<div className="text-center py-20 font-mono">Loading receipt...</div>}>
          <ReceiptViewNoSSR />
        </Suspense>
      </div>
    </MainLayout>
  );
}