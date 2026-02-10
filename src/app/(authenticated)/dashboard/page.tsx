
"use client";

import React from 'react';
import { useBooks } from '../../../context/BookContext';
import { BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
// import '../styles/Dashboard.css'; // We'll try to rely on globals or inline styles/Tailwind. 
// If Dashboard.css is needed, I should import it here or convert to Tailwind.
// For now, I'll use the original classNames and hope globals.css or imports handle it,
// BUT I haven't imported Dashboard.css globally.
// I should probably convert this to Tailwind for consistency, as requested ("modern web app", "Vibrant colors").
// The original used CSS variables.
// Let's converting to Tailwind on the fly for better look.

export default function Dashboard() {
  const { books, sessions } = useBooks();

  const readingBooks = books.filter((book: any) => book.status === 'reading');
  const readBooks = books.filter((book: any) => book.status === 'read');
  
  // Quick stats
  const totalPagesRead = sessions.reduce((acc: number, session: any) => acc + session.pagesRead, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-2 text-[var(--text-secondary)]">Welcome back! Here is your reading progress.</p>
      </header>
      
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-[var(--bg-card)] p-6 shadow-sm border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">Currently Reading</h3>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{readingBooks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-[var(--bg-card)] p-6 shadow-sm border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-500/10 p-3 text-green-500">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">Books Finished</h3>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{readBooks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-[var(--bg-card)] p-6 shadow-sm border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-500/10 p-3 text-purple-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Pages Read</h3>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{totalPagesRead}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Currently Reading</h2>
        {readingBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {readingBooks.map((book: any) => (
              <div key={book.id} className="flex gap-4 rounded-xl bg-[var(--bg-card)] p-4 shadow-sm border border-[var(--border-color)] transition-all hover:bg-[var(--bg-hover)]">
                <div 
                  className="h-32 w-24 flex-shrink-0 rounded-md bg-cover bg-center shadow-md"
                  style={{ backgroundImage: `url(${book.coverUrl})` }}
                ></div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{book.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{book.author}</p>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                      <span>{book.currentPage} / {book.totalPages} pages</span>
                      <span>{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--bg-input)]">
                      <div 
                        className="h-2 rounded-full bg-[var(--accent)]"
                        style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[var(--bg-card)] p-8 text-center text-[var(--text-secondary)] border border-[var(--border-color)]">
            <p>You are not reading any books right now.</p>
          </div>
        )}
      </section>
    </div>
  );
};
