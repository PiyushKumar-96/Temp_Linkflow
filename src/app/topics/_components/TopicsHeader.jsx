'use client';

import React from 'react';
import { Plus, Search, Calendar, List, Filter, Building2, User } from 'lucide-react';

export default function TopicsHeader({
  activeView,
  onViewChange,
  search,
  onSearchChange,
  selectedSeries,
  onSeriesChange,
  selectedAccount,
  onAccountChange,
  selectedStatus,
  onStatusChange,
  onOpenCreate,
  totalCount,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Title and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground tracking-tight">Content Topics</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {totalCount} Planned
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Plan your annual content strategy ahead, map audience angles, and generate downstream drafts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-input border border-border rounded-lg p-0.5">
            <button
              onClick={() => onViewChange('year')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'year'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar size={13} />
              Year View
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'list'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List size={13} />
              List View
            </button>
          </div>

          <button
            onClick={onOpenCreate}
            className="btn btn-primary text-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus size={14} />
            Plan Topic
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics or briefs..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input pl-8 py-1.5 text-xs w-full"
            />
          </div>

          {/* Series Filter */}
          <select
            value={selectedSeries}
            onChange={(e) => onSeriesChange(e.target.value)}
            className="input py-1.5 text-xs bg-input border border-border"
          >
            <option value="all">All Series</option>
            <option value="Thought Leadership">Thought Leadership</option>
            <option value="Case Studies">Case Studies</option>
            <option value="Engineering Culture">Engineering Culture</option>
            <option value="Industry Insights">Industry Insights</option>
          </select>

          {/* Account Filter */}
          <select
            value={selectedAccount}
            onChange={(e) => onAccountChange(e.target.value)}
            className="input py-1.5 text-xs bg-input border border-border"
          >
            <option value="all">All Targets</option>
            <option value="personal">Personal Profile</option>
            <option value="company">Company Page</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input py-1.5 text-xs bg-input border border-border"
          >
            <option value="all">All Statuses</option>
            <option value="planned">Draft & Planned</option>
            <option value="in_review">In Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
    </div>
  );
}
