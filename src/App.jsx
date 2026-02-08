import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Stats from './pages/Stats';
import BookDetails from './pages/BookDetails';
import { BookProvider } from './context/BookContext';
import './App.css';

function App() {
  return (
    <BookProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="stats" element={<Stats />} />
            <Route path="book/:id" element={<BookDetails />} />
          </Route>
        </Routes>
      </Router>
    </BookProvider>
  );
}

export default App;
