
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library, BarChart2, BookOpen, LogOut } from 'lucide-react';
import { signOut, useSession } from "next-auth/react";

const UserDisplay = () => {
  const { data: session } = useSession();
  return <p className="truncate text-sm font-medium text-[var(--text-primary)]">{session?.user?.email || 'User'}</p>;
};

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="fixed inset-y-0 left-0 flex w-[250px] flex-col border-r border-[var(--border-color)] bg-[var(--bg-card)] p-6">
      <div className="mb-8 flex items-center gap-2 text-[var(--accent)]">
        <BookOpen className="h-7 w-7" />
        <span className="text-2xl font-bold text-[var(--text-primary)]">Tracker</span>
      </div>
      
      <nav className="flex flex-col gap-1">
        <Link 
          href="/dashboard" 
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
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-md p-3 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--error)]"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
