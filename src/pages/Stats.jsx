import React from 'react';
import { useBooks } from '../context/BookContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import '../styles/Stats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Stats = () => {
  const { books, sessions, notes } = useBooks();

  // 1. Pages read in last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return d;
  });

  const pagesPerDay = last7Days.map(day => {
    const daySessions = sessions.filter(s => isSameDay(parseISO(s.date), day));
    return daySessions.reduce((acc, s) => acc + s.pagesRead, 0);
  });

  const barData = {
    labels: last7Days.map(d => format(d, 'MMM d')),
    datasets: [
      {
        label: 'Pages Read',
        data: pagesPerDay,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Reading Activity (Last 7 Days)',
        color: '#eeeeee',
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#333333'
        },
        ticks: { color: '#aaaaaa' }
      },
      x: {
        grid: {
          display: false
        },
        ticks: { color: '#aaaaaa' }
      }
    }
  };

  // 2. Books by Status
  const statusCounts = {
    read: books.filter(b => b.status === 'read').length,
    reading: books.filter(b => b.status === 'reading').length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
  };

  const doughnutData = {
    labels: ['Read', 'Reading', 'Want to Read'],
    datasets: [
      {
        data: [statusCounts.read, statusCounts.reading, statusCounts.wantToRead],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
        borderColor: '#1e1e1e',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#eeeeee' }
      },
       title: {
        display: true,
        text: 'Library Status',
        color: '#eeeeee',
        font: { size: 16 }
      },
    },
  };

  return (
    <div className="stats-page">
      <header className="stats-header">
        <h1>Statistics</h1>
        <p>Your reading habits visualized.</p>
      </header>
      
      <div className="charts-grid">
        <div className="chart-card">
          <Bar options={barOptions} data={barData} />
        </div>
        
        <div className="chart-card">
          <div className="doughnut-container">
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
        </div>
      </div>

       <div className="stats-summary">
        <div className="summary-item">
          <h3>Total Books</h3>
          <p>{books.length}</p>
        </div>
        <div className="summary-item">
          <h3>Total Sessions</h3>
          <p>{sessions.length}</p>
        </div>
        <div className="summary-item">
          <h3>Total Notes</h3>
          <p>{notes.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
