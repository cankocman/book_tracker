import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { X, Upload } from 'lucide-react';
import '../styles/AddBookModal.css';

const AddBookModal = ({ onClose }) => {
  const { addBook } = useBooks();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    coverUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.totalPages) return;

    addBook({
      title: formData.title,
      author: formData.author,
      totalPages: parseInt(formData.totalPages),
      coverUrl: formData.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800' // Default placeholder
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Book</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add-book-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. The Hobbit"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Author</label>
            <input 
              type="text" 
              value={formData.author} 
              onChange={e => setFormData({...formData, author: e.target.value})}
              placeholder="e.g. J.R.R. Tolkien"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Pages</label>
              <input 
                type="number" 
                value={formData.totalPages} 
                onChange={e => setFormData({...formData, totalPages: e.target.value})}
                placeholder="300"
                required
                min="1"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Cover URL (Optional)</label>
            <input 
              type="url" 
              value={formData.coverUrl} 
              onChange={e => setFormData({...formData, coverUrl: e.target.value})}
              placeholder="https://..."
            />
          </div>
          
          <button type="submit" className="btn-submit">Add to Library</button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
