'use client';

import React from 'react';
import { Plus, Search, Calendar, List } from 'lucide-react';

export default function TopicsHeader({
  activeView,
  onViewChange,
  search,
  onSearchChange,
  selectedAccount,
  onAccountChange,
  onOpenCreate,
  totalCount,
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Page Title & Subtitle */}
      <div className="tpc-head">
        <h1 className="tpc-title">Topics</h1>
        <p className="tpc-sub">
          Plan thematic subjects to seed downstream AI drafting and scheduled posts.
        </p>
      </div>

      <div className="tpc-top-bar">
      <div className="tpc-top-bar-left">
        {/* View Toggle (Month / List) */}
        <div
          className="tpc-view-toggle"
          role="tablist"
          aria-label="View toggle"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'month' || activeView === 'grid' || activeView === 'timeline'}
            onClick={() => onViewChange('month')}
            className="tpc-view-btn"
          >
            <Calendar size={13} />
            Month
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'list'}
            onClick={() => onViewChange('list')}
            className="tpc-view-btn"
          >
            <List size={13} />
            List
          </button>
        </div>

        {/* Search */}
        <div className="tpc-search-box">
          <Search size={13} className="tpc-search-icon" />
          <input
            type="text"
            placeholder="Search topics or briefs..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="tpc-search-input"
          />
        </div>

        {/* Target Profile filter */}
        <select
          value={selectedAccount}
          onChange={(e) => onAccountChange(e.target.value)}
          className="tpc-select"
          aria-label="Filter by target profile"
        >
          <option value="all">All targets</option>
          <option value="personal">Personal Profile</option>
          <option value="company">Company Page</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        {/* Plan Topic Primary Button */}
        <button
          type="button"
          onClick={onOpenCreate}
          className="tpc-btn-primary"
        >
          <Plus size={14} />
          Plan topic
        </button>
      </div>
    </div>
    </div>
  );
}
