
import Link from "next/link";
import { auth } from "../lib/auth"; // Will create this next
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-dark)] p-4 text-[var(--text-primary)]">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Book Tracker
        </h1>
        <p className="max-w-[600px] text-lg text-[var(--text-secondary)]">
          Your personal library manager. Track books you've read, want to read, and watch your reading stats grow.
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-full bg-[var(--accent)] px-8 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
