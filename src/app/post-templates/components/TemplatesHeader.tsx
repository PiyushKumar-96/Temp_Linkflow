'use client';

import React from 'react';
import { LayoutTemplate, Search, Plus } from 'lucide-react';

interface Props {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (c: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
  totalCount: number;
  onCreateNew: () => void;
}

export default function TemplatesHeader({
  categories, activeCategory, onCategoryChange,
  search, onSearchChange, totalCount, onCreateNew
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutTemplate size={20} className="text-primary" />
          <h1 className="text-2xl font-700 text-foreground">Post Templates</h1>
          <span className="text-sm text-muted-foreground">· {totalCount} templates</span>
        </div>
        <button onClick={onCreateNew} className="btn-primary">
          <Plus size={14} />
          New Template
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card min-w-[220px]">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search templates..."
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {categories.map(cat => (
            <button
              key={`cat-tab-${cat}`}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 text-sm font-500 rounded-lg border transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary' :'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}