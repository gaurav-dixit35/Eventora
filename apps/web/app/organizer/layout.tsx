import type { ReactNode } from 'react';
import { ProtectedPage } from '../../components/protected-page';
export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return <ProtectedPage role="ORGANIZER">{children}</ProtectedPage>;
}
