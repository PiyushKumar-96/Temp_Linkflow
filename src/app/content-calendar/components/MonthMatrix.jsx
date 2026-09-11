'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { normalizeStatus } from '@/lib/post-status';

const DOW_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_FULL = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

function getMonDayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function SparkleStar({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-[#F59E0B] shrink-0`} stroke="none">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

function getStatusBadgeClass(status) {
  const s = normalizeStatus(status);
  if (s === 'published') return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  if (s === 'scheduled') return 'bg-sky-50 text-sky-700 border-sky-200/80';
  if (s === 'awaiting_review' || s === 'needs_revision') return 'bg-amber-50 text-amber-800 border-amber-200/80';
  return (s === 'failed' || s === 'rejected') ? 'bg-rose-50 text-rose-700 border-rose-200/80' : 'bg-slate-100 text-slate-700 border-slate-200';
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
  const monthName = MONTH_FULL[month] || 'SEPTEMBER';

  const postsByDate = useMemo(() => {
    const map = {};
    posts.forEach((p) => {
      if (p.date) {
        if (!map[p.date]) map[p.date] = [];
        map[p.date].push(p);
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
      result.push({ dayNum: prevDay, dateStr: `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`, isCurrentMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ dayNum: day, dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`, isCurrentMonth: true });
    }
    let nextDay = 1;
    while (result.length % 7 !== 0 || result.length < 35) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      result.push({ dayNum: nextDay, dateStr: `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`, isCurrentMonth: false });
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
    <div className="w-full flex flex-col select-none">
      {/* Top Header: Star + CALENDAR + Chevrons */}
      <div className="flex items-center justify-between mb-6 pl-1 pr-1">
        <div className="flex items-center gap-2.5">
          <SparkleStar className="w-6 h-6" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CALENDAR
          </h2>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => navMonth(-1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => navMonth(1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid with Vertical Month Text */}
      <div className="flex items-stretch gap-2 sm:gap-4">
        <div className="flex items-center justify-center pr-1 sm:pr-2 shrink-0">
          <span
            className="text-lg sm:text-2xl font-extrabold tracking-[0.25em] text-slate-800 dark:text-slate-200 uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {monthName}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
            {DOW_HEADERS.map((dow) => (
              <div
                key={dow}
                className="text-center text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 py-1"
              >
                {dow}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {cells.map((cell) => {
              const dayPosts = postsByDate[cell.dateStr] || [];
              const isSelected = cell.dateStr === selectedDate;
              const hasPosts = dayPosts.length > 0;
              const firstPost = dayPosts[0];

              const cellStyle = !cell.isCurrentMonth
                ? 'border border-slate-200/50 dark:border-slate-800 text-slate-300 dark:text-slate-600 bg-transparent'
                : isSelected
                  ? 'bg-[#FBBF24] text-slate-950 border-2 border-slate-950 shadow-md font-bold'
                  : hasPosts
                    ? 'bg-white dark:bg-slate-800/90 border-[1.5px] border-slate-800 dark:border-slate-400 text-slate-900 dark:text-slate-100 hover:bg-slate-50/80 shadow-xs'
                    : 'bg-white/80 dark:bg-slate-800/50 border-[1.5px] border-slate-700/70 dark:border-slate-500/70 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800';

              return (
                <button
                  type="button"
                  key={cell.dateStr}
                  onClick={() => onSelectDate(cell.dateStr)}
                  className={`relative rounded-[16px] sm:rounded-[20px] p-1.5 sm:p-2 flex flex-col justify-between text-left transition-all duration-150 aspect-[4/4.8] sm:aspect-[4/4.5] min-h-[64px] sm:min-h-[76px] ${cellStyle}`}
                >
                  <span className={`text-[11px] sm:text-xs font-bold leading-none tabular-nums ${isSelected ? 'text-slate-950' : 'text-slate-900 dark:text-slate-100'}`}>
                    {String(cell.dayNum).padStart(2, '0')}
                  </span>

                  {cell.isCurrentMonth && hasPosts && (
                    <div className="flex flex-col mt-auto overflow-hidden">
                      <span className={`text-[9px] sm:text-[10px] font-bold leading-tight truncate ${isSelected ? 'text-slate-950' : 'text-slate-900 dark:text-white'}`}>
                        {firstPost.series || firstPost.category || 'Post'}
                      </span>
                      {isSelected ? (
                        <span className="text-[8px] sm:text-[9px] font-semibold text-slate-800 tabular-nums">
                          {firstPost.time || '10:00'}
                        </span>
                      ) : (
                        <span className={`text-[8px] sm:text-[9px] font-semibold px-1 py-0.2 rounded border w-fit leading-tight mt-0.5 tabular-nums ${getStatusBadgeClass(firstPost.status)}`}>
                          {firstPost.time || '10:00'}
                        </span>
                      )}
                    </div>
                  )}

                  {!cell.isCurrentMonth && cell.dayNum === 27 && (
                    <div className="flex flex-col mt-auto opacity-30 text-[8px] sm:text-[9px] truncate">
                      <span>Event</span>
                      <span>12:00</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
