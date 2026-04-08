import { AuthProvider } from '@/contexts/AuthContext';

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
