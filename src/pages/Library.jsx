import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { Search, Plus, Filter } from 'lucide-react';
import AddBookModal from '../components/AddBookModal';
import { Link } from 'react-router-dom';
import '../styles/Library.css';

const Library = () => {
  const { books } = useBooks();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBooks = books.filter(book => {
    const matchesFilter = filter === 'all' || book.status === filter;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="library-page">
      <header className="library-header">
        <div className="header-top">
          <h1>Library</h1>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>Add Book</span>
          </button>
        </div>
        
        <div className="controls-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title or author..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >All</button>
            <button 
              className={`filter-tab ${filter === 'reading' ? 'active' : ''}`}
              onClick={() => setFilter('reading')}
            >Reading</button>
            <button 
              className={`filter-tab ${filter === 'want-to-read' ? 'active' : ''}`}
              onClick={() => setFilter('want-to-read')}
            >Want to Read</button>
            <button 
              className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >Read</button>
          </div>
        </div>
      </header>

      <div className="library-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <Link to={`/book/${book.id}`} key={book.id} className="library-book-card">
              <div className="card-cover" style={{ backgroundImage: `url(${book.coverUrl})` }}>
                {book.status === 'reading' && <span className="status-badge reading">Reading</span>}
                {book.status === 'read' && <span className="status-badge read">Read</span>}
              </div>
              <div className="card-details">
                <h3>{book.title}</h3>
                <p className="card-author">{book.author}</p>
                {book.status === 'reading' && (
                   <div className="mini-progress">
                     <div className="mini-bar" style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}></div>
                   </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <p>No books found.</p>
          </div>
        )}
      </div>

      {isModalOpen && <AddBookModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Library;
