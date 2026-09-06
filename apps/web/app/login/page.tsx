import Link from 'next/link';
import { AuthForm } from '../../components/auth-form';
export default function LoginPage() {
  return (
    <main className="min-h-screen p-6">
      <AuthForm mode="login" />
      <p className="mt-4 text-center">
        <Link href="/forgot-password">Forgot password?</Link> ·{' '}
        <Link href="/signup">Create an account</Link>
      </p>
    </main>
  );
}
