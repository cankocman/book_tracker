
"use client";

import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh(); 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-dark)] px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[var(--bg-card)] p-8 shadow-lg border border-[var(--border-color)]">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Welcome back to Book Tracker
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
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
                autoComplete="current-password"
                required
                className="relative block w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:z-10 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        
         <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
              Register here
            </Link>
          </p>
      </div>
    </div>
  );
}
