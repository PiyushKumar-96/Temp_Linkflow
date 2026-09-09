'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from 'lucide-react';

const members = [
  { id: 'all', label: 'All Members', initials: 'ALL' },
  { id: 'SR', label: 'Sarah Reeves', initials: 'SR' },
  { id: 'MC', label: 'Marcus Chen', initials: 'MC' },
  { id: 'JP', label: 'Jordan Patel', initials: 'JP' },
  { id: 'LT', label: 'Lisa Tran', initials: 'LT' },
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
      : `Week of Sep ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <CalendarDays size={20} className="text-primary" />
        <h1 className="text-2xl font-700 text-foreground">Content Calendar</h1>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Member filter */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {members.map((m) => (
            <button
              key={`member-${m.id}`}
              onClick={() => onFilterChange(m.id)}
              className={`px-2.5 py-1 text-xs font-500 rounded-md transition-all duration-150 ${
                filterMember === m.id
                  ? 'bg-card text-foreground card-shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.id === 'all' ? 'All' : m.initials}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-muted rounded-lg p-0.5">
          {['month', 'week'].map((v) => (
            <button
              key={`view-${v}`}
              onClick={() => onViewChange(v)}
              className={`px-3 py-1.5 text-sm font-500 rounded-md capitalize transition-all duration-150 ${
                view === v
                  ? 'bg-card text-foreground card-shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm font-600 text-foreground px-2 min-w-[180px] text-center">
            {title}
          </span>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        <Link href="/post-creation-composer">
          <button className="btn-primary">
            <Plus size={14} />
            New Post
          </button>
        </Link>
      </div>
    </div>
  );
}
