'use client';

import React, { useState } from 'react';
import { Search, Bell, Plus, ChevronDown, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Topbar({ sidebarCollapsed }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className="fixed top-0 right-0 bg-card border-b border-border z-20 flex items-center px-6 gap-4 transition-all duration-300"
      style={{
        left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        height: 'var(--topbar-height)',
      }}
    >
      {/* Search */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-150 flex-1 max-w-md ${searchFocused ? 'border-primary bg-card shadow-sm' : 'border-border bg-input'}`}
      >
        <Search size={15} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search posts, templates, assets..."
          className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />

        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-muted border border-border rounded text-xs text-muted-foreground font-mono">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Create Post */}
        <Link href="/post-creation-composer">
          <button className="btn-primary text-sm">
            <Plus size={15} />
            <span className="hidden sm:inline">New Post</span>
          </button>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-warning rounded-full" />
        </button>

        {/* Workspace badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-input cursor-pointer hover:bg-muted transition-colors">
          <div className="w-5 h-5 rounded gradient-primary flex items-center justify-center">
            <Zap size={11} className="text-white" />
          </div>
          <span className="text-sm font-500 text-foreground">Acme Corp</span>
          <ChevronDown size={13} className="text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
