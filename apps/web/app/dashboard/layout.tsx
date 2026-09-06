import type { ReactNode } from 'react';
import { ProtectedPage } from '../../components/protected-page';
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedPage>{children}</ProtectedPage>;
}
