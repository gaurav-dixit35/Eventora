'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';
import { useAuth } from './auth-provider';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await apiFetch(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(values) });
      await refresh();
      router.replace(new URLSearchParams(window.location.search).get('next') || '/dashboard');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to continue.');
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="mx-auto grid w-full max-w-md gap-4 rounded-xl border border-slate-700 bg-slate-900 p-6"
    >
      <h1 className="text-2xl font-semibold">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      {mode === 'signup' && (
        <>
          <label>
            Name
            <input required name="name" className="mt-1 w-full rounded bg-slate-800 p-2" />
          </label>
          <label>
            Phone
            <input
              required
              name="phone"
              placeholder="+919000000000"
              className="mt-1 w-full rounded bg-slate-800 p-2"
            />
          </label>
        </>
      )}
      <label>
        Email
        <input
          required
          type="email"
          name="email"
          className="mt-1 w-full rounded bg-slate-800 p-2"
        />
      </label>
      <label>
        Password
        <input
          required
          minLength={mode === 'signup' ? 10 : 1}
          type="password"
          name="password"
          className="mt-1 w-full rounded bg-slate-800 p-2"
        />
      </label>
      {error && (
        <p role="alert" className="text-red-300">
          {error}
        </p>
      )}
      <button
        disabled={submitting}
        className="rounded bg-amber-400 p-2 font-semibold text-slate-950"
      >
        {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
      </button>
    </form>
  );
}
