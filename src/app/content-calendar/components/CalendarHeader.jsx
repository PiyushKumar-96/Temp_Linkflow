'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Filter, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STATUS_BUCKET_LIST, STATUS_FILTER_ORDER, STATUS_META } from '@/lib/post-status';

const MEMBERS = [
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

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
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
  const navigateMonth = (dir) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    onNavigate(d);
  };

  const jumpToToday = () => {
    onNavigate(new Date(2026, 8, 8)); // September 2026 demo reference
  };

  const monthLabel = `${MONTH_NAMES_SHORT[currentDate.getMonth()]}' ${currentDate.getFullYear()}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex flex-col">
          {/* Workspace Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold w-fit mb-3">
            <span>LinkedFlow</span>
          </div>

          {/* Month Heading & Inline Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
              {monthLabel}
            </h1>

            {/* < · > Chevrons Navigation */}
            <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={jumpToToday}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs font-bold"
                aria-label="Jump to current month"
                title="Current month"
              >
                •
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Calendar icon with subtle colon */}
            <div className="flex items-center gap-1 text-neutral-400 pl-2 border-l border-neutral-200 dark:border-neutral-800">
              <CalendarIcon size={16} />
              <span className="text-xs font-semibold">:</span>
            </div>
          </div>

          {/* Subtitle description */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-xl font-normal leading-relaxed">
            Here all your planned events and posts. You will find information for each event as well you can plan a new one.
          </p>
        </div>

        {/* Action Button: Add event */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/post-creation-composer">
            <button className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white shadow-sm transition-all flex items-center gap-2">
              <Plus size={15} />
              <span>Add event</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filter Bar (Integrated Minimalist Editorial Bar) */}
      <div className="flex items-center gap-3 p-2 bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 rounded-xl flex-wrap text-xs">
        {/* Series Filter */}
        <div className="flex items-center gap-1.5 text-neutral-500">
          <Layers size={13} className="text-[var(--cal-accent)]" />
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Series:</span>
          <select
            value={filterSeries}
            onChange={(e) => onSeriesChange(e.target.value)}
            className="input-base text-xs py-1 px-2 h-7 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-md font-medium"
          >
            {SERIES_LIST.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-neutral-500">
          <Filter size={13} className="text-[var(--cal-accent)]" />
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input-base text-xs py-1 px-2 h-7 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-md font-medium"
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
          <span className="text-neutral-400 font-medium mr-1 hidden sm:inline">
            Member:
          </span>
          <div className="flex items-center gap-0.5 bg-neutral-200/60 dark:bg-neutral-800 rounded-lg p-0.5">
            {MEMBERS.map((m) => (
              <button
                key={m.id}
                onClick={() => onFilterChange(m.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  filterMember === m.id
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
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
