'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/main-layout';

// Disable SSR for the receipt content to prevent 'window is not defined' and searchParam errors
const ReceiptViewNoSSR = dynamic(
  () => import('./receipt-view'),
  { 
    ssr: false,
    loading: () => <div className="text-center py-20">Loading receipt engine...</div> 
  }
);

export default function ReceiptPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        {/* Suspense is mandatory for useSearchParams in Next.js 13+ */}
        <Suspense fallback={<div className="text-center py-20">Preparing your document...</div>}>
          <ReceiptViewNoSSR />
        </Suspense>
      </div>
    </MainLayout>
  );
}