'use client';

import React from 'react';
import { Search, LayoutGrid, Rows3, Upload, X } from 'lucide-react';
import LibrarySourceTabs from './LibrarySourceTabs';

const TYPE_FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'post', label: 'Text posts' },
  { id: 'image', label: 'Images' },
  { id: 'carousel', label: 'Carousels' },
  { id: 'infographic', label: 'Infographics' },
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
  statusCounts = {},
  totalCount,
  selectedCount,
  onSelectAll,
  onClearSelection,
}) {
  const isBulk = view === 'bulk';

  return (
    <div className="flex flex-col gap-4">
      <div className="lib-head">
        <div>
          <div className="lib-title-row">
            <h1 className="lib-title">{isBulk ? 'Bulk upload' : 'Library'}</h1>
            {isBulk ? (
              totalCount > 0 && <span className="lib-count">{totalCount}</span>
            ) : (
              <span className="lib-count">{totalCount}</span>
            )}
          </div>
          <p className="lib-sub">
            {isBulk
              ? 'Review, configure and submit spreadsheet posts for approval.'
              : 'Every post that has cleared approval.'}
          </p>

          {!isBulk && (
            <div className="lib-status-tabs" role="tablist" aria-label="Post status">
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'all'}
                onClick={() => onStatusFilterChange('all')}
                className="lib-status-tab"
              >
                <span>All</span>
                <span className="lib-status-tab-count">
                  {(statusCounts?.published ?? 0) + (statusCounts?.scheduled ?? 0)}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'published'}
                onClick={() => onStatusFilterChange('published')}
                className="lib-status-tab"
              >
                <span>Published</span>
                <span className="lib-status-tab-count">
                  {statusCounts?.published ?? 0}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'scheduled'}
                onClick={() => onStatusFilterChange('scheduled')}
                className="lib-status-tab"
              >
                <span>Scheduled</span>
                <span className="lib-status-tab-count">
                  {statusCounts?.scheduled ?? 0}
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="lib-head-actions">
          {isBulk ? (
            <button
              type="button"
              className="lib-btn"
              onClick={() => onViewChange('grid')}
            >
              ← Back to library
            </button>
          ) : (
            <>
              <div className="lib-view" role="group" aria-label="View">
                <button
                  type="button"
                  onClick={() => onViewChange('grid')}
                  aria-pressed={view === 'grid'}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onViewChange('list')}
                  aria-pressed={view === 'list'}
                  aria-label="List view"
                  title="List view"
                >
                  <Rows3 size={15} />
                </button>
              </div>
              <button
                type="button"
                className="lib-btn"
                onClick={() => onViewChange('bulk')}
              >
                <Upload size={14} />
                Bulk upload
              </button>
            </>
          )}
        </div>
      </div>

      {!isBulk && (
        <div className="lib-controls">
          <label className="lib-search">
            <Search size={15} className="lib-search-icon" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search posts and tags"
              aria-label="Search the library"
            />
          </label>

          <div className="lib-chips" role="group" aria-label="Filter by format">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className="lib-chip"
                aria-pressed={typeFilter === filter.id}
                onClick={() => onTypeFilterChange(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <LibrarySourceTabs
            activeSource={sourceFilter}
            onSelectSource={onSourceFilterChange}
            counts={sourceCounts}
          />
        </div>
      )}

      {selectedCount > 0 && (
        <div className="lib-selbar">
          <strong>{selectedCount}</strong>
          <span>selected</span>
          <span className="lib-selbar-spacer" />
          <button type="button" className="lib-link" onClick={onSelectAll}>
            Select all {totalCount}
          </button>
          <button
            type="button"
            className="lib-btn lib-btn-quiet"
            onClick={onClearSelection}
            aria-label="Clear selection"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
