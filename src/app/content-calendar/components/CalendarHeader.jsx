'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Filter, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STATUS_BUCKET_LIST, STATUS_FILTER_ORDER, STATUS_META } from '@/lib/post-status';

const members = [
  { id: 'all', label: 'All Members', initials: 'ALL' },
  { id: 'SR', label: 'Sarah Reeves', initials: 'SR' },
  { id: 'MC', label: 'Marcus Chen', initials: 'MC' },
  { id: 'JP', label: 'Jordan Patel', initials: 'JP' },
  { id: 'LT', label: 'Lisa Tran', initials: 'LT' },
];

const SERIES_LIST = [
  { id: 'all', label: 'All Series' },
  { id: 'Async Work Transition', label: 'Async Work Transition' },
  { id: 'B2B Growth Playbook', label: 'B2B Growth Playbook' },
  { id: 'Product Transparency', label: 'Product Transparency' },
  { id: 'Weekly Metrics Digest', label: 'Weekly Metrics Digest' },
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function CalendarHeader({
  view,
  onViewChange,
  currentDate,
  onNavigate,
  filterMember,
  onFilterChange,
  filterSeries = 'all',
  onSeriesChange,
  filterStatus = 'all',
  onStatusChange,
}) {
  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + dir);
    else d.setDate(d.getDate() + 7 * dir);
    onNavigate(d);
  };

  const title =
    view === 'month'
      ? `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      : `Week of ${MONTH_NAMES[currentDate.getMonth()].slice(0, 3)} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-primary" />
          <div>
            <h1 className="text-2xl font-700 text-foreground">Content Calendar</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Scheduled distribution and content pipeline visualization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            {['month', 'week'].map((v) => (
              <button
                key={`view-${v}`}
                onClick={() => onViewChange(v)}
                className={`px-3 py-1.5 text-xs font-600 rounded-md capitalize transition-all duration-150 ${
                  view === v
                    ? 'bg-card text-foreground card-shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {v} View
              </button>
            ))}
          </div>

          {/* Month / Week Navigation */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"
              title="Previous period"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-600 text-foreground px-2 min-w-[150px] text-center tabular-nums">
              {title}
            </span>
            <button
              onClick={() => navigate(1)}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"
              title="Next period"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <Link to="/post-creation-composer">
            <button className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5">
              <Plus size={14} />
              <span>New Post</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Secondary Filter Bar: Series, Status, Member */}
      <div className="flex items-center gap-3 p-2 bg-card border border-border rounded-xl flex-wrap">
        {/* Series Filter */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Layers size={13} className="text-primary" />
          <span className="font-600 text-foreground">Series:</span>
          <select
            value={filterSeries}
            onChange={(e) => onSeriesChange(e.target.value)}
            className="input-base text-xs py-1 px-2 h-7 bg-background border-border"
          >
            {SERIES_LIST.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter from post-status.js */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter size={13} className="text-primary" />
          <span className="font-600 text-foreground">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input-base text-xs py-1 px-2 h-7 bg-background border-border"
          >
            <option value="all">All Statuses</option>
            <optgroup label="Workflow Stages">
              {STATUS_BUCKET_LIST.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Specific States">
              {STATUS_FILTER_ORDER.map((st) => (
                <option key={st} value={st}>
                  {STATUS_META[st]?.label || st}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Member filter pills */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs font-600 text-muted-foreground mr-1 hidden md:inline">
            Member:
          </span>
          <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
            {members.map((m) => (
              <button
                key={`member-${m.id}`}
                onClick={() => onFilterChange(m.id)}
                className={`px-2 py-1 text-xs font-500 rounded-md transition-all duration-150 ${
                  filterMember === m.id
                    ? 'bg-card text-foreground card-shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={m.label}
              >
                {m.id === 'all' ? 'All' : m.initials}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
