'use client';

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import EmptyDayState from './EmptyDayState';
import { formatSlot } from '@/app/dashboard/_components/DashboardPrimitives';
import { normalizeStatus, STATUS_META, POST_STATUS } from '@/lib/post-status';

/**
 * Converts 24h or basic time '14:00' to formatted range '2:00 - 2:30 PM'
 */
function formatTimeRange(timeStr) {
  if (!timeStr) return '10:00 - 10:30 AM';
  const cleanTime = timeStr.replace(/\s*UTC$/i, '').trim();
  const [hourStr, minStr = '00'] = cleanTime.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  if (isNaN(hour)) hour = 10;
  const endMinute = (minute + 30) % 60;
  const endHour = minute + 30 >= 60 ? (hour + 1) % 24 : hour;

  const fmt = (h, m) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const mStr = String(m).padStart(2, '0');
    return { str: `${h12}:${mStr}`, ampm };
  };

  const start = fmt(hour, minute);
  const end = fmt(endHour, endMinute);

  if (start.ampm === end.ampm) {
    return `${start.str} - ${end.str} ${end.ampm}`;
  }
  return `${start.str} ${start.ampm} - ${end.str} ${end.ampm}`;
}

/**
 * Bare status dot color & label class mapping:
 * - Published / Scheduled / Approved: --success (#1D9E75)
 * - Awaiting Review: --info (#378ADD)
 * - Needs Revision / Planned / Manual: --warning / --warning-text
 * - Failed / Rejected: --danger (#E24B4A)
 */
function getStatusDisplay(status) {
  const norm = normalizeStatus(status);
  const meta = STATUS_META[norm] || STATUS_META.planned;
  const label = meta.label; // sentence case from post-status domain model

  if (norm === POST_STATUS.PUBLISHED || norm === POST_STATUS.SCHEDULED || norm === POST_STATUS.APPROVED) {
    return {
      dotColor: 'bg-[color:var(--success)]',
      textColor: 'text-[color:var(--success)]',
      label,
    };
  }
  if (norm === POST_STATUS.AWAITING_REVIEW) {
    return {
      dotColor: 'bg-[color:var(--info)]',
      textColor: 'text-[color:var(--info)]',
      label,
    };
  }
  if (norm === POST_STATUS.NEEDS_REVISION || norm === POST_STATUS.PLANNED || norm === POST_STATUS.MANUAL) {
    return {
      dotColor: 'bg-[color:var(--warning)]',
      textColor: 'text-[color:var(--text-muted)]',
      label,
    };
  }
  if (norm === POST_STATUS.FAILED || norm === POST_STATUS.REJECTED) {
    return {
      dotColor: 'bg-[color:var(--danger)]',
      textColor: 'text-[color:var(--danger)]',
      label,
    };
  }
  return {
    dotColor: 'bg-[color:var(--text-subtle)]',
    textColor: 'text-[color:var(--text-muted)]',
    label,
  };
}

export default function DayTimelinePanel({ selectedDate, posts = [], selectedPost, onSelectPost }) {
  const navigate = useNavigate();

  // Deduplicate and filter posts for selected day
  const dayPosts = useMemo(() => {
    const raw = posts.filter((p) => p.date === selectedDate);
    const map = new Map();

    raw.forEach((p) => {
      const cleanTitle = (p.title || '').replace(/\s*\.\.\.$/, '').trim();
      const cleanTime = (p.time || '10:00').replace(/\s*UTC$/i, '').trim();
      // Deduplicate key based on title + time + date
      const key = `${selectedDate}-${cleanTime}-${cleanTitle}`;
      if (!map.has(key)) {
        map.set(key, p);
      }
    });

    return Array.from(map.values()).sort((a, b) => (a.time || '10:00').localeCompare(b.time || '10:00'));
  }, [posts, selectedDate]);

  const activePostId = selectedPost?.id || dayPosts[0]?.id;
  const formattedDayTitle = formatSlot(selectedDate) || selectedDate;

  return (
    <div className="w-full flex flex-col min-h-[220px] max-h-[660px] h-fit bg-[color:var(--track-warm)] p-4 rounded-xl border border-[color:var(--border)]">
      {/* Panel Header & Quick Actions */}
      <div className="pb-3 border-b border-[color:var(--border)] shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold tracking-tight text-[color:var(--text)]">
              {formattedDayTitle}
            </h2>
            <span className="text-xs text-[color:var(--text-muted)] font-normal tabular-nums">
              ({dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'})
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/post-creation-composer?date=${selectedDate}`)}
            className="text-xs font-semibold text-[color:var(--brand)] hover:text-[color:var(--brand-hover)] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus size={13} />
            <span>Add post</span>
          </button>
        </div>
      </div>

      {/* Internal Scrollable Table / Hairline Row List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[color:var(--border)] pr-1">
        {dayPosts.map((post) => {
          const isActive = post.id === activePostId;
          const statusDisp = getStatusDisplay(post.status);
          const rawTitle = post.title || post.content || 'Untitled Post';
          const cleanTitle = rawTitle.replace(/\s*\.\.\.$/, '').trim();

          return (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className={`py-3 px-2 flex flex-col gap-1 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[color:var(--accent-tint)]/70'
                  : 'hover:bg-[color:var(--chip)]/50'
              }`}
            >
              {/* Top Row: Time Range + Status Dot & Plain Text Label */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[color:var(--text)] tabular-nums">
                  {formatTimeRange(post.time)}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDisp.dotColor}`} />
                  <span className={`text-[11px] font-medium ${statusDisp.textColor}`}>
                    {statusDisp.label}
                  </span>
                </div>
              </div>

              {/* Title Row */}
              <p className="text-xs text-[color:var(--text)] leading-normal font-normal line-clamp-2">
                {cleanTitle}
              </p>
            </div>
          );
        })}

        {/* Empty State */}
        {dayPosts.length === 0 && (
          <div className="py-3">
            <EmptyDayState />
          </div>
        )}
      </div>

      {/* Panel Footer: Review Queue Navigation directly below list in all states */}
      <div className="pt-3 border-t border-[color:var(--border)] shrink-0 flex items-center justify-end mt-auto">
        <button
          type="button"
          onClick={() => navigate(selectedPost ? `/approval-workflow?post=${selectedPost.id}` : '/approval-workflow')}
          className="text-xs text-[color:var(--text-subtle)] hover:text-[color:var(--text)] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Review queue</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
