
"use client";

import React, { createContext, useContext, useState, useEffect, useOptimistic } from 'react';
import { addBook as addBookAction, updateBook as updateBookAction, deleteBook as deleteBookAction, addSession as addSessionAction, addNote as addNoteAction } from '../actions/books';

type Book = any; // Replace with proper types from schema
type Session = any;
type Note = any;

interface BookContextType {
  books: Book[];
  sessions: Session[];
  notes: Note[];
  addBook: (book: any) => Promise<void>;
  updateBook: (id: string, updates: any) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addSession: (session: any) => Promise<void>;
  addNote: (note: any) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ 
  children, 
  initialBooks = [], 
  initialSessions = [], 
  initialNotes = [] 
}: { 
  children: React.ReactNode; 
  initialBooks: Book[]; 
  initialSessions: Session[]; 
  initialNotes: Note[] 
}) => {
  // We can use useOptimistic here for better UX, but for now let's stick to state that matches initial props
  // and rely on revalidation from Server Actions to update the page.
  // Actually, Server Actions revalidatePath will trigger a re-render of the Server Component,
  // passing new initialBooks to this provider.
  // So we just need to sync state with props.
  
  const [books, setBooks] = useState(initialBooks);
  const [sessions, setSessions] = useState(initialSessions);
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    setBooks(initialBooks);
  }, [initialBooks]);

  useEffect(() => {
    setSessions(initialSessions);
  }, [initialSessions]);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const addBook = async (book: any) => {
    // Optimistic update could go here
    await addBookAction(book);
  };

  const updateBook = async (id: string, updates: any) => {
    await updateBookAction(id, updates);
  };
  
  const deleteBook = async (id: string) => {
    await deleteBookAction(id);
  };

  const addSession = async (session: any) => {
    await addSessionAction(session);
  };
  
  const addNote = async (note: any) => {
      await addNoteAction(note);
  };

  return (
    <BookContext.Provider value={{ books, sessions, notes, addBook, updateBook, deleteBook, addSession, addNote }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
