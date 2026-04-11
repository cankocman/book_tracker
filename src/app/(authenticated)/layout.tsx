
import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { BookProvider } from "../../context/BookContext";
import { getBooks, getSessions, getNotes } from "../../actions/books";
import AuthProvider from "../../components/AuthProvider";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [books, sessions, notes] = await Promise.all([
    getBooks(),
    getSessions(),
    getNotes(),
  ]);

  return (
    <AuthProvider session={session}>
      <div className="flex min-h-screen bg-[var(--bg-dark)] flex-col md:flex-row relative">
        <Sidebar />
        <main className="flex-1 w-full p-4 pt-20 md:ml-[250px] md:p-8 md:pt-8 min-h-screen overflow-x-hidden">
          <BookProvider initialBooks={books} initialSessions={sessions} initialNotes={notes}>
            {children}
          </BookProvider>
        </main>
      </div>
    </AuthProvider>
  );
}
