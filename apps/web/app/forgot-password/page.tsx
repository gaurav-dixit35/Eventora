'use client';
import { useState, type FormEvent } from 'react';
import { apiFetch } from '../../lib/api';
export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    await apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    setMessage('If an account exists, reset instructions have been sent.');
  }
  return (
    <main className="min-h-screen p-6">
      <form onSubmit={submit} className="mx-auto grid max-w-md gap-4">
        <h1 className="text-2xl">Reset password</h1>
        <label>
          Email
          <input
            required
            name="email"
            type="email"
            className="mt-1 w-full rounded bg-slate-800 p-2"
          />
        </label>
        <button className="rounded bg-amber-400 p-2 text-slate-950">Send reset link</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
