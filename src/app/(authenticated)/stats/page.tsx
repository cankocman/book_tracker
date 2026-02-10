
"use client";

import React from 'react';
import { useBooks } from '../../../context/BookContext';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Stats() {
  const { books, sessions, notes } = useBooks();

  // 1. Pages read in last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return d;
  });

  const pagesPerDay = last7Days.map(day => {
    const daySessions = sessions.filter((s: any) => {
        // Handle string date or Date object
        const date = typeof s.date === 'string' ? parseISO(s.date) : new Date(s.date);
        return isSameDay(date, day);
    });
    return daySessions.reduce((acc: number, s: any) => acc + s.pagesRead, 0);
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
    read: books.filter((b: any) => b.status === 'read').length,
    reading: books.filter((b: any) => b.status === 'reading').length,
    wantToRead: books.filter((b: any) => b.status === 'want-to-read').length,
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
        position: 'bottom' as const,
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
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Statistics</h1>
        <p className="mt-2 text-[var(--text-secondary)]">Your reading habits visualized.</p>
      </header>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-[var(--bg-card)] p-6 shadow-sm border border-[var(--border-color)]">
          <Bar options={barOptions} data={barData} />
        </div>
        
        <div className="rounded-xl bg-[var(--bg-card)] p-6 shadow-sm border border-[var(--border-color)]">
          <div className="mx-auto max-w-[300px]">
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
        </div>
      </div>

       <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Books</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{books.length}</p>
        </div>
        <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Sessions</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{sessions.length}</p>
        </div>
        <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Notes</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{notes.length}</p>
        </div>
      </div>
    </div>
  );
}
