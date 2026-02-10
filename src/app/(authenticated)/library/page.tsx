
"use client";

import React, { useState } from 'react';
import { useBooks } from '../../../context/BookContext';
import { Search, Plus } from 'lucide-react';
import AddBookModal from '../../../components/AddBookModal';
import Link from 'next/link';

export default function Library() {
  const { books } = useBooks();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBooks = books.filter((book: any) => {
    const matchesFilter = filter === 'all' || book.status === filter;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Library</h1>
          <button 
            className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]" 
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            <span>Add Book</span>
          </button>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search by title or author..." 
              className="w-full rounded-full border border-[var(--border-color)] bg-[var(--bg-input)] py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex rounded-lg bg-[var(--bg-input)] p-1">
            {['all', 'reading', 'want-to-read', 'read'].map((f) => (
              <button 
                key={f}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                  filter === f 
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                onClick={() => setFilter(f)}
              >
                {f.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book: any) => (
            <Link href={`/book/${book.id}`} key={book.id} className="group relative flex flex-col overflow-hidden rounded-lg bg-[var(--bg-card)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-[var(--border-color)]">
              <div 
                className="aspect-[2/3] w-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${book.coverUrl})` }}
              >
                {book.status === 'reading' && <span className="absolute right-2 top-2 rounded-full bg-blue-500/90 px-2 py-0.5 text-xs font-medium text-white">Reading</span>}
                {book.status === 'read' && <span className="absolute right-2 top-2 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">Read</span>}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="line-clamp-1 font-semibold text-[var(--text-primary)]" title={book.title}>{book.title}</h3>
                <p className="line-clamp-1 text-xs text-[var(--text-secondary)]">{book.author}</p>
                {book.status === 'reading' && (
                   <div className="mt-2 h-1 w-full rounded-full bg-[var(--bg-input)]">
                     <div className="h-1 rounded-full bg-[var(--accent)]" style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}></div>
                   </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-[var(--text-secondary)]">
            <p>No books found.</p>
          </div>
        )}
      </div>

      {isModalOpen && <AddBookModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
