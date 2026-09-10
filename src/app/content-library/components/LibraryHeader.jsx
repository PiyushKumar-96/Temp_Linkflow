'use client';

import React from 'react';
import { BookImage, Search, Grid3X3, List, Trash2, Copy, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

import LibrarySourceTabs from './LibrarySourceTabs';

const typeFilters = [
  { value: 'all', label: 'All Assets' },
  { value: 'post', label: 'Posts' },
  { value: 'image', label: 'Images' },
  { value: 'carousel', label: 'Carousels' },
  { value: 'infographic', label: 'Infographics' },
  { value: 'hashtag_set', label: 'Hashtag Sets' },
];

export default function LibraryHeader({
  view,
  onViewChange,
  search,
  onSearchChange,
  sourceFilter,
  onSourceFilterChange,
  sourceCounts,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  selectedCount,
  onSelectAll,
  onClearSelection,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookImage size={20} className="text-primary" />
          <h1 className="text-2xl font-700 text-foreground">Content Library</h1>
          <span className="text-sm text-muted-foreground">
            · {totalCount} {view === 'bulk' ? 'bulk posts' : 'assets'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            <button
              onClick={() => onViewChange('grid')}
              className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground hover:text-foreground'}`}
              title="Grid view"
            >
              <Grid3X3 size={15} />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground hover:text-foreground'}`}
              title="List view"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => onViewChange('bulk')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-colors text-xs font-600 ${view === 'bulk' ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground hover:text-foreground'}`}
              title="Bulk upload"
            >
              <Upload size={13} />
              Bulk Upload
            </button>
          </div>
        </div>
      </div>

      {/* Source Tabs — All Sources, Post Composer, AI Generator, Bulk Upload */}
      {view !== 'bulk' && (
        <LibrarySourceTabs
          activeSource={sourceFilter}
          onSelectSource={onSourceFilterChange}
          counts={sourceCounts}
        />
      )}

      {/* Filters row — only show for grid/list views */}
      {view !== 'bulk' && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search assets, tags..."
              className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            {typeFilters.map((f) => (
              <button
                key={`type-${f.value}`}
                onClick={() => onTypeFilterChange(f.value)}
                className={`px-2.5 py-1.5 text-xs font-500 rounded-md transition-all duration-150 ${
                  typeFilter === f.value
                    ? 'bg-card text-foreground card-shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="input-base text-sm py-1.5 px-3 w-auto"
            style={{ width: 140 }}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      )}

      {/* Bulk action bar */}
      {selectedCount > 0 && view !== 'bulk' && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg slide-up">
          <span className="text-sm font-600 text-primary">{selectedCount} selected</span>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => {
                toast.success(`${selectedCount} items copied to clipboard`);
                onClearSelection();
              }}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <Copy size={13} />
              Copy
            </button>
            <button
              onClick={() => {
                toast.success(`${selectedCount} items exported`);
                onClearSelection();
              }}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <Download size={13} />
              Export
            </button>
            <button
              onClick={() => {
                toast.success(`${selectedCount} items deleted`);
                onClearSelection();
              }}
              className="btn-danger text-xs py-1.5 px-3"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
          <button
            onClick={onClearSelection}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
