import type { ReactNode } from 'react';
import { ProtectedPage } from '../../components/protected-page';
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ProtectedPage role="ADMIN">{children}</ProtectedPage>;
}
