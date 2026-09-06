'use client';
import { useState, type FormEvent } from 'react';
import { apiFetch } from '../../lib/api';
export default function ResetPasswordPage() {
  const [message, setMessage] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = new FormData(e.currentTarget).get('password');
    const token = new URLSearchParams(window.location.search).get('token');
    await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    setMessage('Password updated. You can now log in.');
  }
  return (
    <main className="min-h-screen p-6">
      <form onSubmit={submit} className="mx-auto grid max-w-md gap-4">
        <h1 className="text-2xl">Choose a new password</h1>
        <label>
          New password
          <input
            required
            minLength={10}
            name="password"
            type="password"
            className="mt-1 w-full rounded bg-slate-800 p-2"
          />
        </label>
        <button className="rounded bg-amber-400 p-2 text-slate-950">Update password</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
