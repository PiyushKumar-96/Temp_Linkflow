'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { POST_STATUS, normalizeStatus, matchesStatusBucket } from '@/lib/post-status';

import { CALENDAR_POSTS } from '@/temp-backend/data/posts';

const initialCalendarPosts = CALENDAR_POSTS;

export default function CalendarShell() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const view = searchParams.get('view') === 'week' ? 'week' : 'month';
  const filterMember = searchParams.get('member') || 'all';
  const filterSeries = searchParams.get('series') || 'all';
  const filterStatus = searchParams.get('status') || 'all';

  const monthParam = searchParams.get('month'); // 'YYYY-MM'
  const currentDate = useMemo(() => {
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(2026, 8, 1); // Sep 2026 default
  }, [monthParam]);

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
    updateParam('month', `${y}-${m}`);
  };

  const filteredPosts = useMemo(() => {
    return initialCalendarPosts.filter((p) => {
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
    <div className="flex flex-col gap-5">
      <CalendarHeader
        view={view}
        onViewChange={handleViewChange}
        currentDate={currentDate}
        onNavigate={handleNavigate}
        filterMember={filterMember}
        onFilterChange={handleFilterMember}
        filterSeries={filterSeries}
        onSeriesChange={handleFilterSeries}
        filterStatus={filterStatus}
        onStatusChange={handleFilterStatus}
      />

      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          posts={filteredPosts}
          selectedPost={selectedPost}
          onSelectPost={setSelectedPost}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          posts={filteredPosts}
          selectedPost={selectedPost}
          onSelectPost={setSelectedPost}
        />
      )}
    </div>
  );
}
