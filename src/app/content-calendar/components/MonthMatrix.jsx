'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { normalizeStatus, POST_STATUS } from '@/lib/post-status';

const DOW_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_FULL = [
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

function getMonDayIndex(date) {
  return (date.getDay() + 6) % 7;
}

/**
 * Clean up title text without mid-word truncation artifacts
 */
function formatTitle(title, maxLen = 36) {
  if (!title) return '';
  const cleanTitle = title.replace(/\s*\.\.\.$/, '').trim();
  if (cleanTitle.length <= maxLen) return cleanTitle;
  const truncated = cleanTitle.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 18) {
    return truncated.slice(0, lastSpace) + '…';
  }
  return truncated + '…';
}

/**
 * Status dot color mapping:
 * - Approved / Scheduled / Published: --success (#0F8A5F)
 * - Awaiting Review: --info (#378ADD)
 * - Needs Revision / Planned: --warning (#E8A33D)
 * - Failed / Rejected: --danger (#D64545)
 */
function getStatusDotColor(status) {
  const norm = normalizeStatus(status);
  if (norm === POST_STATUS.PUBLISHED || norm === POST_STATUS.SCHEDULED || norm === POST_STATUS.APPROVED) {
    return 'bg-[color:var(--success)]';
  }
  if (norm === POST_STATUS.AWAITING_REVIEW) {
    return 'bg-[color:var(--info)]';
  }
  if (norm === POST_STATUS.NEEDS_REVISION || norm === POST_STATUS.DRAFT || norm === POST_STATUS.PLANNED) {
    return 'bg-[color:var(--warning)]';
  }
  if (norm === POST_STATUS.FAILED || norm === POST_STATUS.REJECTED) {
    return 'bg-[color:var(--danger)]';
  }
  return 'bg-[color:var(--text-subtle)]';
}

/**
 * Status Tint Precedence:
 * 1. any blocked/failed post   → --danger tint (6-10% color-mix)
 * 2. else any needs-attention  → --warning tint (6-10% color-mix)
 * 3. else any in review        → --info tint (6-10% color-mix)
 * 4. else all on track         → --success tint (6-10% color-mix)
 * 5. no posts                  → no tint (plain --card surface)
 */
function getDayStatusTintClass(posts = []) {
  if (!posts || posts.length === 0) return 'bg-[color:var(--card)]';

  const normalizedStatuses = posts.map((p) => normalizeStatus(p.status));

  // Precedence 1: Failed / Rejected
  if (normalizedStatuses.some((s) => s === POST_STATUS.FAILED || s === POST_STATUS.REJECTED)) {
    return 'bg-[color:color-mix(in_srgb,var(--danger)_20%,white)]';
  }
  // Precedence 2: Needs Revision / Draft / Planned
  if (normalizedStatuses.some((s) => s === POST_STATUS.NEEDS_REVISION || s === POST_STATUS.PLANNED || s === POST_STATUS.GENERATING)) {
    return 'bg-[color:color-mix(in_srgb,var(--warning)_20%,white)]';
  }
  // Precedence 3: Awaiting Review / Auto Review
  if (normalizedStatuses.some((s) => s === POST_STATUS.AWAITING_REVIEW || s === POST_STATUS.AUTO_REVIEW)) {
    return 'bg-[color:color-mix(in_srgb,var(--info)_20%,white)]';
  }
  // Precedence 4: Approved / Scheduled / Published
  if (normalizedStatuses.every((s) => s === POST_STATUS.APPROVED || s === POST_STATUS.SCHEDULED || s === POST_STATUS.PUBLISHED || s === POST_STATUS.MANUAL)) {
    return 'bg-[color:color-mix(in_srgb,var(--success)_20%,white)]';
  }

  return 'bg-[color:var(--card)]';
}

export default function MonthMatrix({
  currentDate,
  selectedDate,
  onSelectDate,
  onNavigate,
  posts = [],
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = MONTH_FULL[month] || 'September';

  // Format today's date ISO string (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const today = new Date();
    const y = String(today.getFullYear());
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const postsByDate = useMemo(() => {
    const map = {};
    const seenPostKeys = new Set();

    posts.forEach((p) => {
      if (p.date) {
        // Deduplicate records with duplicate IDs or identical title + date + time
        const cleanTitle = (p.title || '').replace(/\s*\.\.\.$/, '').trim();
        const uniqueKey = `${p.id}-${p.date}-${p.time || '10:00'}-${cleanTitle}`;
        const titleDateKey = `${p.date}-${p.time || '10:00'}-${cleanTitle}`;

        if (!seenPostKeys.has(uniqueKey) && !seenPostKeys.has(titleDateKey)) {
          seenPostKeys.add(uniqueKey);
          seenPostKeys.add(titleDateKey);

          if (!map[p.date]) map[p.date] = [];
          map[p.date].push(p);
        }
      }
    });
    return map;
  }, [posts]);

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const leadingCount = getMonDayIndex(firstDay);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const result = [];

    for (let i = leadingCount - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      result.push({
        dayNum: prevDay,
        dateStr: `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`,
        isCurrentMonth: false,
      });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      result.push({
        dayNum: day,
        dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        isCurrentMonth: true,
      });
    }
    let nextDay = 1;
    while (result.length % 7 !== 0 || result.length < 35) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      result.push({
        dayNum: nextDay,
        dateStr: `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`,
        isCurrentMonth: false,
      });
      nextDay++;
    }
    return result;
  }, [year, month]);

  const navMonth = (dir) => {
    if (!onNavigate) return;
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    onNavigate(d);
  };

  return (
    <div className="w-full flex flex-col select-none gap-4">
      {/* Header Row: Horizontal Month Name + Restored Year + Stepper */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--text)] tracking-tight">
          {monthName} {year}
        </h2>

        {onNavigate && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navMonth(-1)}
              className="p-1.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-[color:var(--chip)] transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => navMonth(1)}
              className="p-1.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-[color:var(--chip)] transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Flat Calendar Grid Container with Hairline Borders */}
      <div className="w-full border border-[color:var(--border)] rounded-none overflow-hidden bg-[color:var(--border)]">
        {/* Days of Week Header: Warm tinted background from --track-warm */}
        <div className="grid grid-cols-7 bg-[color:var(--track-warm)] border-b-2 border-[color:var(--border)]">
          {DOW_HEADERS.map((dow) => (
            <div
              key={dow}
              className="text-center text-[11px] font-medium text-[color:var(--text)] py-2 tracking-wide border-r last:border-r-0 border-[color:var(--border)]"
            >
              {dow}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-px bg-[color:var(--border)]">
          {cells.map((cell) => {
            const dayPosts = postsByDate[cell.dateStr] || [];
            const isSelected = cell.dateStr === selectedDate;
            const isToday = cell.dateStr === todayStr;
            const hasPosts = dayPosts.length > 0;
            const statusTintClass = getDayStatusTintClass(dayPosts);

            // Render limit: max 2 posts shown per cell, or 1 post + (+N more) if 3+ posts exist, preventing clipping
            const maxVisiblePosts = dayPosts.length > 2 ? 1 : 2;
            const visiblePosts = dayPosts.slice(0, maxVisiblePosts);
            const overflowCount = dayPosts.length - maxVisiblePosts;

            // Background & Border treatment:
            // - Out-of-month cell: bg-[color:var(--page-bg)] opacity-40 (recedes, no status tint)
            // - In-month cell: status-derived subtle background tint mixed 20% against white
            // - Today cell: solid --accent circular date badge + distinct inset accent ring on top of status tint
            // - Selected cell: 2px --accent border ring outline
            const cellStyle = !cell.isCurrentMonth
              ? 'bg-[color:var(--page-bg)] text-[color:var(--text-subtle)] opacity-40 cursor-default'
              : isToday
                ? `${statusTintClass} text-[color:var(--text)] ring-2 ring-inset ring-[color:var(--accent)] cursor-pointer`
                : isSelected
                  ? `${statusTintClass} text-[color:var(--text)] ring-2 ring-inset ring-[color:var(--accent)] cursor-pointer`
                  : `${statusTintClass} text-[color:var(--text)] hover:opacity-90 cursor-pointer`;

            return (
              <div
                key={cell.dateStr}
                onClick={() => cell.isCurrentMonth && onSelectDate(cell.dateStr)}
                className={`relative min-h-[92px] sm:min-h-[100px] h-auto p-2 flex flex-col justify-start transition-colors overflow-hidden ${cellStyle}`}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between w-full shrink-0">
                  {isToday && cell.isCurrentMonth ? (
                    <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-[color:var(--accent)] text-white text-[11px] font-bold tabular-nums shadow-xs">
                      {cell.dayNum}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        cell.isCurrentMonth
                          ? isSelected
                            ? 'text-[color:var(--accent-text)] font-bold'
                            : 'text-[color:var(--text-muted)]'
                          : 'text-[color:var(--text-subtle)]'
                      }`}
                    >
                      {String(cell.dayNum).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Day Posts List: Vertically top-aligned entries with zero mid-row clipping */}
                {cell.isCurrentMonth && hasPosts && (
                  <div className="flex flex-col gap-1.5 mt-1 w-full overflow-hidden">
                    {visiblePosts.map((post) => {
                      const rawTitle = post.title || post.series || post.category || 'Post';
                      const formattedTitle = formatTitle(rawTitle, 36);
                      const displayTime = (post.time || '10:00').replace(/\s*UTC$/i, '').trim();
                      const dotColor = getStatusDotColor(post.status);

                      return (
                        <div
                          key={post.id}
                          className="flex flex-col group/post shrink-0"
                          title={`${rawTitle} (${displayTime})`}
                        >
                          {/* Title with single status dot indicator */}
                          <div className="flex items-start gap-1.5 min-w-0">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 mt-1`}
                            />
                            <span className="text-[9px] leading-snug text-[color:var(--text)] line-clamp-2 font-normal break-words">
                              {formattedTitle}
                            </span>
                          </div>

                          {/* Time label in app default font */}
                          <span className="text-[8px] text-[color:var(--text-muted)] tabular-nums font-sans mt-0.5 pl-3">
                            {displayTime}
                          </span>
                        </div>
                      );
                    })}

                    {/* Overflow affordance (+N more) selecting day to view all in right panel */}
                    {overflowCount > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDate(cell.dateStr);
                        }}
                        className="text-[9px] text-[color:var(--accent-text)] font-semibold hover:underline text-left cursor-pointer pt-0.5 shrink-0"
                      >
                        +{overflowCount} more
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Single Quiet Legend Line Mapping Surface Tints to Status Meaning */}
      <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)] font-normal pt-1">
        <span>Cell tint reflects highest priority status:</span>
        <span className="text-[color:var(--danger-text)] font-medium">failed</span>
        <span>·</span>
        <span className="text-[color:var(--warning-text)] font-medium">needs attention</span>
        <span>·</span>
        <span className="text-[color:var(--info-text)] font-medium">in review</span>
        <span>·</span>
        <span className="text-[color:var(--success-text)] font-medium">on track</span>
      </div>
    </div>
  );
}
