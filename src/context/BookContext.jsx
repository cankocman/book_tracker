import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BookContext = createContext();

const INITIAL_BOOKS = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    totalPages: 180,
    currentPage: 180,
    status: 'read',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    startDate: '2023-01-10T00:00:00.000Z',
    finishDate: '2023-01-15T00:00:00.000Z',
    rating: 5,
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    totalPages: 320,
    currentPage: 120,
    status: 'reading',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    startDate: '2023-10-01T00:00:00.000Z',
    finishDate: null,
    rating: 0,
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    totalPages: 496,
    currentPage: 0,
    status: 'want-to-read',
    coverUrl: 'https://images.unsplash.com/photo-1614726365723-49cfae9f0563?auto=format&fit=crop&q=80&w=800',
    startDate: null,
    finishDate: null,
    rating: 0,
  }
];

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('book_tracker_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('book_tracker_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [notes, setNotes] = useState(() => {
     const saved = localStorage.getItem('book_tracker_notes');
     return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('book_tracker_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('book_tracker_sessions', JSON.stringify(sessions));
  }, [sessions]);
  
  useEffect(() => {
    localStorage.setItem('book_tracker_notes', JSON.stringify(notes));
  }, [notes]);

  const addBook = (book) => {
    const newBook = { ...book, id: uuidv4(), status: 'want-to-read', currentPage: 0, startDate: null, finishDate: null, rating: 0 };
    setBooks([...books, newBook]);
  };

  const updateBook = (id, updates) => {
    setBooks(books.map(book => book.id === id ? { ...book, ...updates } : book));
  };
  
  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
    // Also delete associated notes and sessions? Maybe keep logic simple for now.
    setSessions(sessions.filter(s => s.bookId !== id));
    setNotes(notes.filter(n => n.bookId !== id));
  };

  const addSession = (session) => {
    const newSession = { ...session, id: uuidv4(), date: new Date().toISOString() };
    setSessions([...sessions, newSession]);
    
    // Update book progress
    const book = books.find(b => b.id === session.bookId);
    if (book) {
      const newPage = Math.min(book.totalPages, book.currentPage + session.pagesRead);
      const updates = { currentPage: newPage };
      
      if (newPage === book.totalPages && book.status !== 'read') {
        updates.status = 'read';
        updates.finishDate = new Date().toISOString();
      } else if (book.status === 'want-to-read') {
        updates.status = 'reading';
        updates.startDate = new Date().toISOString();
      }
      
      updateBook(book.id, updates);
    }
  };
  
  const addNote = (note) => {
      const newNote = { ...note, id: uuidv4(), createdAt: new Date().toISOString() };
      setNotes([...notes, newNote]);
  };

  return (
    <BookContext.Provider value={{ books, sessions, notes, addBook, updateBook, deleteBook, addSession, addNote }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);
