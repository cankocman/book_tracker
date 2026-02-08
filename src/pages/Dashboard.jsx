import React from 'react';
import { useBooks } from '../context/BookContext';
import { BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { books, sessions } = useBooks();

  const readingBooks = books.filter(book => book.status === 'reading');
  const readBooks = books.filter(book => book.status === 'read');
  
  // Quick stats
  const totalPagesRead = sessions.reduce((acc, session) => acc + session.pagesRead, 0);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome back! Here is your reading progress.</p>
      </header>
      
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon reading">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>Currently Reading</h3>
            <p className="stat-value">{readingBooks.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon finished">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Books Finished</h3>
            <p className="stat-value">{readBooks.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pages">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Pages Read</h3>
            <p className="stat-value">{totalPagesRead}</p>
          </div>
        </div>
      </section>

      <section className="reading-section">
        <h2>Currently Reading</h2>
        {readingBooks.length > 0 ? (
          <div className="books-grid">
            {readingBooks.map(book => (
              <div key={book.id} className="book-card-active">
                <div className="book-cover" style={{ backgroundImage: `url(${book.coverUrl})` }}></div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                  
                  <div className="progress-container">
                    <div className="progress-info">
                      <span>{book.currentPage} / {book.totalPages} pages</span>
                      <span>{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You are not reading any books right now.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
