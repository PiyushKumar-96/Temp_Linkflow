'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MonthMatrix from './MonthMatrix';
import DayTimelinePanel from './DayTimelinePanel';
import WeekView from './WeekView';
import PostDetailPopover from './PostDetailPopover';
import { normalizeStatus, matchesStatusBucket } from '@/lib/post-status';
import { CALENDAR_POSTS } from '@/temp-backend/data/posts';

export default function CalendarShell() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters
  const view = searchParams.get('view') === 'week' ? 'week' : 'month';
  const filterMember = searchParams.get('member') || 'all';
  const filterSeries = searchParams.get('series') || 'all';
  const filterStatus = searchParams.get('status') || 'all';
  const monthParam = searchParams.get('month'); // 'YYYY-MM'
  const dateParam = searchParams.get('date');   // 'YYYY-MM-DD'

  // Selected viewed month
  const currentDate = useMemo(() => {
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(2026, 8, 1); // September 2026 default
  }, [monthParam]);

  // Selected day for the right-hand schedule panel
  const selectedDate = useMemo(() => {
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return dateParam;
    }
    // Default to Sept 8, 2026 or current month 8th
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-08`;
  }, [dateParam, currentDate]);

  const [selectedPost, setSelectedPost] = useState(null);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || (key === 'view' && value === 'month')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const handleViewChange = (v) => updateParam('view', v);
  const handleFilterMember = (m) => updateParam('member', m);
  const handleFilterSeries = (s) => updateParam('series', s);
  const handleFilterStatus = (st) => updateParam('status', st);

  const handleNavigate = (newDate) => {
    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, '0');
    const next = new URLSearchParams(searchParams);
    next.set('month', `${y}-${m}`);
    // Auto-update selectedDate to first day of new month
    next.set('date', `${y}-${m}-01`);
    setSearchParams(next, { replace: true });
  };

  const handleSelectDate = (dateStr) => {
    updateParam('date', dateStr);
  };

  // Filter posts based on active filters
  const filteredPosts = useMemo(() => {
    return CALENDAR_POSTS.filter((p) => {
      if (filterMember !== 'all' && p.authorInitials !== filterMember) {
        return false;
      }
      if (filterSeries !== 'all' && p.series !== filterSeries) {
        return false;
      }
      if (filterStatus !== 'all') {
        const canonical = normalizeStatus(p.status);
        if (canonical !== filterStatus && !matchesStatusBucket(p.status, filterStatus)) {
          return false;
        }
      }
      return true;
    });
  }, [filterMember, filterSeries, filterStatus]);

  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_12px_28px_-12px_rgba(15,23,42,0.06)]">
      {/* Main Content Area */}
      {view === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Column: Month Matrix (Spans 7 cols on lg, 7 cols on xl) */}
          <div className="lg:col-span-7 xl:col-span-7 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800 pb-8 lg:pb-0">
            <MonthMatrix
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onNavigate={handleNavigate}
              posts={filteredPosts}
            />
          </div>

          {/* Right Column: Selected Day Timeline (Spans 5 cols on lg, 5 cols on xl) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <DayTimelinePanel
              selectedDate={selectedDate}
              posts={filteredPosts}
              selectedPost={selectedPost}
              onSelectPost={setSelectedPost}
            />
          </div>
        </div>
      ) : (
        <WeekView
          currentDate={currentDate}
          posts={filteredPosts}
          selectedPost={selectedPost}
          onSelectPost={setSelectedPost}
        />
      )}

      {/* Post details popover for deep-dive actions */}
      {selectedPost && (
        <PostDetailPopover
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
