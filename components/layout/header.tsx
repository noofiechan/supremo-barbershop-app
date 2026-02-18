'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { clearSession, getSessionFromStorage } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';

export function Header() {
  const router = useRouter();
  const session = getSessionFromStorage();

  const handleLogout = () => {
    clearSession();
    router.push(ROUTES.login);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href={ROUTES.home} className="text-xl font-bold">
          Supremo Barbershop
        </Link>

        <nav className="flex items-center gap-6">
          {session ? (
            <>
              <span className="text-sm text-gray-600">
                {session.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href={ROUTES.login}>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href={ROUTES.guestBook}>
                <Button>Book as Guest</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
