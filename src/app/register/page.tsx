
"use client";

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { register } from '../../actions/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex w-full justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50"
    >
      {pending ? "Creating account..." : "Register"}
    </button>
  );
}

const initialState = {
  error: null as string | null,
  success: false,
};

export default function RegisterPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await register(null, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        redirect('/login?registered=true');
      }
    });
  }



  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-dark)] px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[var(--bg-card)] p-8 shadow-lg border border-[var(--border-color)]">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Start your reading journey
          </p>
        </div>
        
        <form action={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="relative block w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:z-10 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:z-10 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="relative block w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:z-10 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:text-sm"
                placeholder="Password (min 6 chars)"
              />
            </div>
          </div>

          <div>
            <SubmitButton pending={isPending} />
          </div>
        </form>
        
         <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
              Sign in
            </Link>
          </p>
      </div>
    </div>
  );
}
