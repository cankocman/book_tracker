import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { ArrowLeft, BookOpen, Clock, Calendar, CheckCircle, Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import '../styles/BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, sessions, notes, addSession, addNote, deleteBook } = useBooks();
  
  const book = books.find(b => b.id === id);
  const bookSessions = sessions.filter(s => s.bookId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const bookNotes = notes.filter(n => n.bookId === id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [activeTab, setActiveTab] = useState('history');
  const [newPage, setNewPage] = useState('');
  const [newNote, setNewNote] = useState('');

  if (!book) {
    return (
      <div className="book-not-found">
        <h2>Book not found</h2>
        <button onClick={() => navigate('/library')} className="btn-secondary">Back to Library</button>
      </div>
    );
  }

  const progressPercentage = Math.round((book.currentPage / book.totalPages) * 100);

  const handleUpdateProgress = (e) => {
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

  const handleAddNote = (e) => {
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
      navigate('/library');
    }
  };

  return (
    <div className="book-details-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="book-header">
        <div className="book-cover-large" style={{ backgroundImage: `url(${book.coverUrl})` }}></div>
        <div className="book-info-large">
          <div className="info-top">
            <span className={`status-badge-large ${book.status}`}>{book.status.replace(/-/g, ' ')}</span>
            <button className="btn-icon-danger" onClick={handleDelete} title="Delete Book">
              <Trash2 size={20} />
            </button>
          </div>
          <h1>{book.title}</h1>
          <p className="author-large">{book.author}</p>
          
          <div className="meta-stats">
            <div className="meta-item">
              <BookOpen size={18} />
              <span>{book.totalPages} Pages</span>
            </div>
            {book.startDate && (
              <div className="meta-item">
                <Calendar size={18} />
                <span>Started {format(new Date(book.startDate), 'MMM d, yyyy')}</span>
              </div>
            )}
            {book.finishDate && (
              <div className="meta-item">
                <CheckCircle size={18} />
                <span>Finished {format(new Date(book.finishDate), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>

          <div className="progress-section-large">
            <div className="progress-header">
              <span>Progress</span>
              <span>{progressPercentage}% ({book.currentPage} / {book.totalPages})</span>
            </div>
            <div className="progress-bar-large">
              <div className="progress-fill-large" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          {book.status !== 'read' && (
            <form onSubmit={handleUpdateProgress} className="update-progress-form">
              <div className="input-group">
                <label>I'm now on page:</label>
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    value={newPage} 
                    onChange={e => setNewPage(e.target.value)}
                    placeholder={book.currentPage + 1}
                    min={book.currentPage + 1}
                    max={book.totalPages}
                  />
                  <span className="total-suffix">/ {book.totalPages}</span>
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={!newPage}>Update</button>
            </form>
          )}
        </div>
      </div>

      <div className="book-content-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Reading History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes & Thoughts
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'history' && (
            <div className="history-list">
              {bookSessions.length > 0 ? (
                bookSessions.map(session => (
                  <div key={session.id} className="history-item">
                    <div className="history-date">
                      {format(new Date(session.date), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="history-details">
                      Read <strong>{session.pagesRead}</strong> pages
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-tab">No reading sessions logged yet.</p>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="notes-section">
              <form onSubmit={handleAddNote} className="add-note-form">
                <textarea 
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Type your thoughts here..."
                  rows="3"
                ></textarea>
                <button type="submit" className="btn-secondary" disabled={!newNote.trim()}>
                  <Save size={18} /> Save Note
                </button>
              </form>
              
              <div className="notes-list">
                {bookNotes.length > 0 ? (
                  bookNotes.map(note => (
                    <div key={note.id} className="note-card">
                      <div className="note-date">{format(new Date(note.createdAt), 'MMM d, yyyy')}</div>
                      <p className="note-content">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="empty-tab">No notes yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
