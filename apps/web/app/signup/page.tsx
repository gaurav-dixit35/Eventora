import Link from 'next/link';
import { AuthForm } from '../../components/auth-form';
export default function SignupPage() {
  return (
    <main className="min-h-screen p-6">
      <AuthForm mode="signup" />
      <p className="mt-4 text-center">
        <Link href="/login">Already have an account? Log in</Link>
      </p>
    </main>
  );
}
