'use client';

import dynamic from 'next/dynamic';
import { MainLayout } from '@/components/layout/main-layout';

// This is the magic line that fixes the Prerender Error
const ReceiptViewNoSSR = dynamic(
  () => import('./receipt-view'),
  { ssr: false }
);

export default function ReceiptPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <ReceiptViewNoSSR />
      </div>
    </MainLayout>
  );
}