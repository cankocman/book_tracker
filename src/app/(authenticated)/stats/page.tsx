"use client";

import React, { useState, useMemo } from 'react';
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
import { 
  format, subDays, subMonths, subYears, isSameDay, parseISO, 
  startOfDay, endOfDay, isSameMonth, eachDayOfInterval, 
  eachWeekOfInterval, eachMonthOfInterval, endOfWeek 
} from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type TimeFrame = '7days' | '1month' | '3months' | '6months' | '1year' | 'custom';

export default function Stats() {
  const { books, sessions, notes } = useBooks();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('7days');
  const [customStart, setCustomStart] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [customEnd, setCustomEnd] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const {
    chartLabels,
    chartData,
    titleText,
    totalFilteredPages,
    totalFilteredSessions,
    filteredBooks,
    filteredNotes,
    avgDaily,
    avgWeekly
  } = useMemo(() => {
    const nowLocal = new Date();
    let startDate = startOfDay(nowLocal);
    let endDate = endOfDay(nowLocal);
    let currentTitleText = '';
    
    if (timeFrame === '7days') { startDate = startOfDay(subDays(nowLocal, 6)); currentTitleText = 'Reading Activity (Last 7 Days)'; }
    else if (timeFrame === '1month') { startDate = startOfDay(subMonths(nowLocal, 1)); currentTitleText = 'Reading Activity (Last Month)'; }
    else if (timeFrame === '3months') { startDate = startOfDay(subMonths(nowLocal, 3)); currentTitleText = 'Reading Activity (Last 3 Months)'; }
    else if (timeFrame === '6months') { startDate = startOfDay(subMonths(nowLocal, 6)); currentTitleText = 'Reading Activity (Last 6 Months)'; }
    else if (timeFrame === '1year') { startDate = startOfDay(subYears(nowLocal, 1)); currentTitleText = 'Reading Activity (Last Year)'; }
    else if (timeFrame === 'custom') {
       startDate = startOfDay(parseISO(customStart));
       endDate = endOfDay(parseISO(customEnd));
       currentTitleText = `Reading Activity (${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')})`;
    }

    const getSessionDate = (s: any) => typeof s.date === 'string' ? parseISO(s.date) : new Date(s.date);
    const getNoteDate = (n: any) => typeof n.createdAt === 'string' ? parseISO(n.createdAt) : new Date(n.createdAt);

    const filteredSessions = sessions.filter((s: any) => {
      const d = getSessionDate(s);
      return d >= startDate && d <= endDate;
    });

    const filteredNotesItems = notes.filter((n: any) => {
      const d = getNoteDate(n);
      return d >= startDate && d <= endDate;
    });

    // We consider "Books Read" in this timeframe if they were finished within it, or we can just list books that have sessions in this timeframe.
    // The prompt says "name of the books read in a compact list". Usually means books interacted with or finished.
    // Let's find all books that had reading sessions in this timeframe.
    const activeBookIds = new Set(filteredSessions.map((s: any) => s.bookId));
    const activeBooks = books.filter((b: any) => activeBookIds.has(b.id));

    let labels: string[] = [];
    let data: number[] = [];

    let chartGrouping: 'daily' | 'weekly' | 'monthly' = 'daily';
    
    if (timeFrame === '7days') chartGrouping = 'daily';
    else if (timeFrame === '1month' || timeFrame === '3months') chartGrouping = 'weekly';
    else if (timeFrame === '6months' || timeFrame === '1year') chartGrouping = 'monthly';
    else if (timeFrame === 'custom') {
       const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
       if (daysDiff <= 31) chartGrouping = 'daily';
       else if (daysDiff <= 180) chartGrouping = 'weekly';
       else chartGrouping = 'monthly';
    }

    if (chartGrouping === 'daily') {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      labels = days.map(d => format(d, 'MMM d'));
      data = days.map(d => {
        return filteredSessions.reduce((acc: number, s: any) => isSameDay(getSessionDate(s), d) ? acc + s.pagesRead : acc, 0);
      });
    } else if (chartGrouping === 'weekly') {
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
      labels = weeks.map(w => {
         const end = endOfWeek(w, { weekStartsOn: 1 });
         return `${format(w, 'MMM d')} - ${format(end > endDate ? endDate : end, 'MMM d')}`;
      });
      data = weeks.map(w => {
         const end = endOfWeek(w, { weekStartsOn: 1 });
         return filteredSessions.reduce((acc: number, s: any) => {
            const sd = getSessionDate(s);
            return sd >= w && sd <= end ? acc + s.pagesRead : acc;
         }, 0);
      });
    } else if (chartGrouping === 'monthly') {
      const months = eachMonthOfInterval({ start: startDate, end: endDate });
      labels = months.map(m => format(m, 'MMM yyyy'));
      data = months.map(m => {
         return filteredSessions.reduce((acc: number, s: any) => {
            return isSameMonth(getSessionDate(s), m) ? acc + s.pagesRead : acc;
         }, 0);
      });
    }

    const totalPages = filteredSessions.reduce((acc: number, s: any) => acc + s.pagesRead, 0);
    const dayCount = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyAvg = Math.round(totalPages / dayCount);
    const weeklyAvg = Math.round(dailyAvg * 7);

    return {
      chartLabels: labels,
      chartData: data,
      titleText: currentTitleText,
      totalFilteredPages: totalPages,
      totalFilteredSessions: filteredSessions.length,
      filteredBooks: activeBooks,
      filteredNotes: filteredNotesItems,
      avgDaily: dailyAvg,
      avgWeekly: weeklyAvg
    };
  }, [sessions, books, notes, timeFrame, customStart, customEnd]);

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Pages Read',
        data: chartData,
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
        text: titleText,
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
        text: 'Library Status (All Time)',
        color: '#eeeeee',
        font: { size: 16 }
      },
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Statistics</h1>
          <p className="mt-2 text-[var(--text-secondary)]">Your reading habits visualized.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {timeFrame === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                className="rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-2 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
              <span className="text-[var(--text-secondary)]">-</span>
              <input 
                type="date" 
                className="rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-2 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </div>
          )}
          <select 
            className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </header>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Pages Read</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{totalFilteredPages}</p>
        </div>
        <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Books Interacted</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{filteredBooks.length}</p>
        </div>
        <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Sessions</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{totalFilteredSessions}</p>
        </div>
        <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Notes Taken</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{filteredNotes.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-[var(--bg-card)] p-6 shadow-sm border border-[var(--border-color)]">
            <Bar options={barOptions} data={barData} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Avg Daily Pages</span>
                <p className="mt-1 text-xl font-bold text-blue-400">{avgDaily}</p>
             </div>
             <div className="rounded-lg bg-[var(--bg-card)] p-4 text-center border border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Avg Weekly Pages</span>
                <p className="mt-1 text-xl font-bold text-indigo-400">{avgWeekly}</p>
             </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-[var(--bg-card)] p-6 shadow-sm border border-[var(--border-color)] h-fit">
          <div className="mx-auto max-w-[300px]">
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
        </div>
      </div>

      {/* Books and Notes Nesting */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Books & Notes ({titleText})</h2>
        {filteredBooks.length > 0 ? (
          <div className="space-y-4">
            {filteredBooks.map((book: any) => {
              const bookNotes = filteredNotes.filter((n: any) => n.bookId === book.id).sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              
              return (
                <div key={book.id} className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden">
                  <div className="px-5 py-3 bg-[var(--bg-input)] border-b border-[var(--border-color)]">
                     <h3 className="font-semibold text-[var(--text-primary)]">{book.title} <span className="text-xs font-normal text-[var(--text-secondary)]">by {book.author}</span></h3>
                  </div>
                  {bookNotes.length > 0 ? (
                    <div className="p-5 space-y-3">
                      {bookNotes.map((note: any) => (
                        <div key={note.id} className="text-sm bg-[var(--bg-dark)] rounded p-3 text-[var(--text-primary)]">
                           <div className="text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-widest">{format(new Date(note.createdAt), 'MMM d, yyyy')}</div>
                           <p className="whitespace-pre-wrap">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-sm text-[var(--text-secondary)] italic">No notes taken for this book in this period.</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg bg-[var(--bg-card)] p-8 text-center border border-[var(--border-color)] text-[var(--text-secondary)]">
            No reading activity found in this time frame. Start reading!
          </div>
        )}
      </div>

    </div>
  );
}
