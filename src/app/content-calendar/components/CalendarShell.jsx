'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MonthMatrix from './MonthMatrix';
import DayTimelinePanel from './DayTimelinePanel';
import WeekView from './WeekView';
import PostDetailPopover from './PostDetailPopover';
import { normalizeStatus, matchesStatusBucket, POST_STATUS } from '@/lib/post-status';
import { CALENDAR_POSTS } from '@/temp-backend/data/posts';
import { getStoredPosts } from '@/temp-backend';

export default function CalendarShell() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [version, setVersion] = useState(0);

  // Synchronize when posts are approved, scheduled, or updated in storage
  useEffect(() => {
    const handleSync = (e) => {
      if (
        !e ||
        !e.key ||
        e.key === 'linkedflow_master_posts' ||
        e.key === 'linkedflow_approval_posts'
      ) {
        setVersion((v) => v + 1);
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('linkedflow_posts_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('linkedflow_posts_updated', handleSync);
    };
  }, []);

  // URL parameters
  const view = searchParams.get('view') === 'week' ? 'week' : 'month';
  const filterMember = searchParams.get('member') || 'all';
  const filterSeries = searchParams.get('series') || 'all';
  const filterStatus = searchParams.get('status') || 'all';
  const monthParam = searchParams.get('month'); // 'YYYY-MM'
  const dateParam = searchParams.get('date'); // 'YYYY-MM-DD'

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
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const viewYear = currentDate.getFullYear();
    const viewMonth = currentDate.getMonth();

    if (todayYear === viewYear && todayMonth === viewMonth) {
      const y = String(todayYear);
      const m = String(todayMonth + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    const y = String(viewYear);
    const m = String(viewMonth + 1).padStart(2, '0');
    return `${y}-${m}-01`;
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

  // Combine static calendar posts with live approved/scheduled/published posts from storage
  const allCalendarPosts = useMemo(() => {
    const stored = getStoredPosts();
    let approvalStored = [];
    try {
      const rawApproval = localStorage.getItem('linkedflow_approval_posts');
      if (rawApproval) approvalStored = JSON.parse(rawApproval);
    } catch {
      // ignore
    }

    // Merge stored posts and approval queue posts
    const combinedStored = [...stored];
    const seen = new Set(combinedStored.map((p) => p.id));
    approvalStored.forEach((p) => {
      if (!seen.has(p.id)) {
        combinedStored.push(p);
        seen.add(p.id);
      } else {
        const idx = combinedStored.findIndex((item) => item.id === p.id);
        if (idx !== -1 && (p.status === POST_STATUS.APPROVED || p.status === 'approved')) {
          combinedStored[idx] = { ...combinedStored[idx], ...p };
        }
      }
    });

    // Extract approved, scheduled, and published posts
    const approvedAndPublished = combinedStored
      .filter((p) => {
        const s = normalizeStatus(p.status);
        return (
          s === POST_STATUS.APPROVED || s === POST_STATUS.SCHEDULED || s === POST_STATUS.PUBLISHED
        );
      })
      .map((p) => {
        const date = p.date || p.scheduledDate || p.dueDate || '2026-09-15';
        const time = p.time || p.scheduledTime || '10:00';
        return {
          id: p.id,
          title: p.title || p.excerpt || (p.content || '').slice(0, 60),
          status: p.status,
          date,
          time,
          author: p.author || 'Sarah Reeves',
          authorInitials: p.authorInitials || 'SR',
          category: p.category || 'Thought Leadership',
          series: p.series || 'B2B Growth Playbook',
          content: p.content,
          hashtags: p.hashtags,
          imageUrl: p.imageUrl,
          visualFormat: p.visualFormat,
        };
      });

    // Merge with default CALENDAR_POSTS (deduplicating by id)
    const existingIds = new Set(approvedAndPublished.map((p) => p.id));
    const defaultCalendar = CALENDAR_POSTS.filter((p) => !existingIds.has(p.id));

    return [...defaultCalendar, ...approvedAndPublished];
  }, [version]);

  // Filter posts based on active filters
  const filteredPosts = useMemo(() => {
    return allCalendarPosts.filter((p) => {
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
  }, [allCalendarPosts, filterMember, filterSeries, filterStatus]);

  return (
    <div className="flex flex-col gap-6 bg-[color:var(--card)] rounded-2xl sm:rounded-3xl p-6 lg:p-8 border border-[color:var(--border)]">
      {/* Main Content Area */}
      {view === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Column: Month Matrix (Spans 7 cols on lg, 7 cols on xl) */}
          <div className="lg:col-span-7 xl:col-span-7 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-[color:var(--border)] pb-8 lg:pb-0">
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
        <PostDetailPopover post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}
