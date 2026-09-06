'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';

export function ProtectedPage({ children, role }: { children: ReactNode; role?: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, pathname, router, user]);
  if (loading || !user) return <main className="p-6">Loading session…</main>;
  if (role && !user.roles.includes(role))
    return <main className="p-6">You are not authorized to access this page.</main>;
  return <>{children}</>;
}
