"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library, BarChart2, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { signOut, useSession } from "next-auth/react";

const UserDisplay = () => {
  const { data: session } = useSession();
  return <p className="truncate text-sm font-medium text-[var(--text-primary)]">{session?.user?.email || 'User'}</p>;
};

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex items-center px-4 z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2 ml-4 text-[var(--accent)]">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold text-[var(--text-primary)]">Tracker</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 flex w-[250px] flex-col border-r border-[var(--border-color)] bg-[var(--bg-card)] p-6 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between gap-2 text-[var(--accent)]">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">Tracker</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-1">
          <Link 
            href="/dashboard" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] ${
              isActive('/dashboard') 
                ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent)] hover:text-white' 
                : 'text-[var(--text-secondary)]'
            }`}
          >
            <LayoutDashboard size={20} className={isActive('/dashboard') ? 'stroke-white' : ''} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            href="/library" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] ${
              isActive('/library') 
                ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent)] hover:text-white' 
                : 'text-[var(--text-secondary)]'
            }`}
          >
            <Library size={20} className={isActive('/library') ? 'stroke-white' : ''} />
            <span>Library</span>
          </Link>
          
          <Link 
            href="/stats" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] ${
              isActive('/stats') 
                ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent)] hover:text-white' 
                : 'text-[var(--text-secondary)]'
            }`}
          >
            <BarChart2 size={20} className={isActive('/stats') ? 'stroke-white' : ''} />
            <span>Statistics</span>
          </Link>
        </nav>

        <div className="mt-auto border-t border-[var(--border-color)] pt-4">
          <div className="mb-2 px-3">
              <p className="text-xs font-semibold text-[var(--text-secondary)]">Signed in as</p>
              <UserDisplay />
          </div>
          <button 
            onClick={() => {
              signOut({ callbackUrl: '/login' });
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-md p-3 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--error)]"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
