import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl">Access denied</h1>
      <p className="mt-2">Your account does not have permission for that area.</p>
      <Link className="mt-4 inline-block underline" href="/">
        Return home
      </Link>
    </main>
  );
}
