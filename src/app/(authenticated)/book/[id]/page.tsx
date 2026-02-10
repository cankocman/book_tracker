
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBooks } from '../../../../context/BookContext';
import { ArrowLeft, BookOpen, Clock, Calendar, CheckCircle, Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function BookDetails() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) return <div>Invalid Book ID</div>;
  const router = useRouter();
  const { books, sessions, notes, addSession, addNote, deleteBook } = useBooks();
  
  const book = books.find((b: any) => b.id === id);
  const bookSessions = sessions.filter((s: any) => s.bookId === id).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const bookNotes = notes.filter((n: any) => n.bookId === id).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [activeTab, setActiveTab] = useState('history');
  const [newPage, setNewPage] = useState('');
  const [newNote, setNewNote] = useState('');

  if (!book) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Book not found</h2>
        <button onClick={() => router.push('/library')} className="rounded-md bg-[var(--bg-input)] px-4 py-2 font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)]">Back to Library</button>
      </div>
    );
  }

  const progressPercentage = Math.round((book.currentPage / book.totalPages) * 100);

  const handleUpdateProgress = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(newPage);
    if (!pageNum || pageNum <= book.currentPage || pageNum > book.totalPages) return;
    
    const pagesRead = pageNum - book.currentPage;
    addSession({
      bookId: book.id,
      pagesRead: pagesRead,
      durationMinutes: 0 // Optional for now
    });
    setNewPage('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    addNote({
      bookId: book.id,
      content: newNote
    });
    setNewNote('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(book.id);
      router.push('/library');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex flex-col gap-8 md:flex-row">
        <div 
          className="h-80 w-56 flex-shrink-0 self-center rounded-lg bg-cover bg-center shadow-lg md:self-start" 
          style={{ backgroundImage: `url(${book.coverUrl})` }}
        ></div>
        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex items-start justify-between">
            <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
              book.status === 'read' ? 'bg-green-500/20 text-green-500' :
              book.status === 'reading' ? 'bg-blue-500/20 text-blue-500' :
              'bg-yellow-500/20 text-yellow-500'
            }`}>{book.status.replace(/-/g, ' ')}</span>
            <button className="text-red-500 hover:text-red-400" onClick={handleDelete} title="Delete Book">
              <Trash2 size={20} />
            </button>
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">{book.title}</h1>
          <p className="mt-2 text-xl text-[var(--text-secondary)]">{book.author}</p>
          
          <div className="mt-6 flex flex-wrap gap-6 text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>{book.totalPages} Pages</span>
            </div>
            {book.startDate && (
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Started {format(new Date(book.startDate), 'MMM d, yyyy')}</span>
              </div>
            )}
            {book.finishDate && (
              <div className="flex items-center gap-2">
                <CheckCircle size={18} />
                <span>Finished {format(new Date(book.finishDate), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-xl bg-[var(--bg-card)] p-6 border border-[var(--border-color)]">
            <div className="mb-2 flex justify-between text-sm font-medium text-[var(--text-secondary)]">
              <span>Progress</span>
              <span>{progressPercentage}% ({book.currentPage} / {book.totalPages})</span>
            </div>
            <div className="h-4 w-full rounded-full bg-[var(--bg-input)]">
              <div className="h-4 rounded-full bg-[var(--accent)] transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          {book.status !== 'read' && (
            <form onSubmit={handleUpdateProgress} className="mt-6 flex gap-4">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-[var(--text-secondary)]">I'm now on page:</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    value={newPage} 
                    onChange={e => setNewPage(e.target.value)}
                    placeholder={(book.currentPage + 1).toString()}
                    min={book.currentPage + 1}
                    max={book.totalPages}
                  />
                  <span className="absolute right-3 top-2 text-[var(--text-secondary)]">/ {book.totalPages}</span>
                </div>
              </div>
              <button type="submit" className="self-end rounded-md bg-[var(--accent)] px-4 py-2 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50" disabled={!newPage}>Update</button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6 flex border-b border-[var(--border-color)]">
          <button 
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            onClick={() => setActiveTab('history')}
          >
            Reading History
          </button>
          <button 
             className={`px-6 py-3 font-medium transition-colors ${activeTab === 'notes' ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes & Thoughts
          </button>
        </div>

        <div>
          {activeTab === 'history' && (
            <div className="space-y-3">
              {bookSessions.length > 0 ? (
                bookSessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg bg-[var(--bg-card)] p-4 border border-[var(--border-color)]">
                    <div className="text-[var(--text-secondary)]">
                      {format(new Date(session.date), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="text-[var(--text-primary)]">
                      Read <strong>{session.pagesRead}</strong> pages
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-[var(--text-secondary)]">No reading sessions logged yet.</p>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea 
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Type your thoughts here..."
                  rows={3}
                ></textarea>
                <button type="submit" className="flex items-center gap-2 rounded-md bg-[var(--bg-input)] px-4 py-2 font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50" disabled={!newNote.trim()}>
                  <Save size={18} /> Save Note
                </button>
              </form>
              
              <div className="space-y-4">
                {bookNotes.length > 0 ? (
                  bookNotes.map((note: any) => (
                    <div key={note.id} className="rounded-lg bg-[var(--bg-card)] p-4 shadow-sm border border-[var(--border-color)]">
                      <div className="mb-2 text-xs text-[var(--text-secondary)]">{format(new Date(note.createdAt), 'MMM d, yyyy')}</div>
                      <p className="whitespace-pre-wrap text-[var(--text-primary)]">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-[var(--text-secondary)]">No notes yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
