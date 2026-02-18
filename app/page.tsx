import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/main-layout';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center gap-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Supremo Barbershop</h1>
          <p className="text-xl text-gray-600">
            Premium barbering services at your convenience
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href={ROUTES.guestBook}>
            <Button size="lg" variant="outline" className="w-full h-20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold">Guest Booking</span>
                <span className="text-xs text-gray-600">
                  No account needed
                </span>
              </div>
            </Button>
          </Link>

          <Link href={ROUTES.login}>
            <Button size="lg" variant="outline" className="w-full h-20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold">Customer Login</span>
                <span className="text-xs text-gray-600">
                  View bookings & history
                </span>
              </div>
            </Button>
          </Link>

          <Link href={ROUTES.login}>
            <Button size="lg" variant="outline" className="w-full h-20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold">Staff Login</span>
                <span className="text-xs text-gray-600">
                  Employee access
                </span>
              </div>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-semibold">Expert Barbers</h3>
            <p className="text-sm text-gray-600">
              Skilled professionals with years of experience
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-semibold">Quality Service</h3>
            <p className="text-sm text-gray-600">
              Premium cuts and styling techniques
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-semibold">Easy Booking</h3>
            <p className="text-sm text-gray-600">
              Simple online scheduling system
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
