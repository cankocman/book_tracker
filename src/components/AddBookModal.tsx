
"use client";

import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { X } from 'lucide-react';

const AddBookModal = ({ onClose }: { onClose: () => void }) => {
  const { addBook } = useBooks();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    coverUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-[var(--bg-card)] p-6 shadow-xl border border-[var(--border-color)]" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Add New Book</h2>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Title</label>
            <input 
              type="text" 
              className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. The Hobbit"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Author</label>
            <input 
              type="text" 
              className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={formData.author} 
              onChange={e => setFormData({...formData, author: e.target.value})}
              placeholder="e.g. J.R.R. Tolkien"
              required
            />
          </div>
          
          <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Pages</label>
              <input 
                type="number" 
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                value={formData.totalPages} 
                onChange={e => setFormData({...formData, totalPages: e.target.value})}
                placeholder="300"
                required
                min="1"
              />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Cover URL (Optional)</label>
            <input 
              type="url" 
              className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={formData.coverUrl} 
              onChange={e => setFormData({...formData, coverUrl: e.target.value})}
              placeholder="https://..."
            />
          </div>
          
          <button type="submit" className="w-full rounded-md bg-[var(--accent)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]">Add to Library</button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
