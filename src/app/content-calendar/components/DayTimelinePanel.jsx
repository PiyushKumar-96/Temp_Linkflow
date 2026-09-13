'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { AVATARS } from '@/temp-backend/data/media';
import EmptyDayState from './EmptyDayState';

const MONTH_SHORT = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];
const DOW_FULL = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

/**
 * Format date string (YYYY-MM-DD) into reference style: "03'JAN, FRIDAY"
 */
function formatDayHeader(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayPadded = String(d).padStart(2, '0');
  const monthName = MONTH_SHORT[dateObj.getMonth()] || '';
  const dowName = DOW_FULL[dateObj.getDay()] || '';
  return `${dayPadded}'${monthName}, ${dowName}`;
}

/**
 * Converts 24h or basic time '14:00' to formatted range '2:00 - 2:30 PM'
 */
function formatTimeRange(timeStr) {
  if (!timeStr) return '10:00 - 10:30 AM';
  const [hourStr, minStr = '00'] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

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
// Author avatar mapping
const AUTHOR_AVATARS = {
  SR: AVATARS.sarah,
  MC: AVATARS.marcus,
  JP: AVATARS.jordan,
  LT: AVATARS.lisa,
};

function AvatarStack({ post }) {
  const authorImg = AUTHOR_AVATARS[post.authorInitials] || AVATARS.sarah;
  const avatarList = [{ src: authorImg, alt: post.author || 'Author' }];
  if (post.category === 'Thought Leadership' || post.series === 'Weekly Metrics Digest') {
    avatarList.push({ src: AVATARS.marcus, alt: 'Marcus' }, { src: AVATARS.jordan, alt: 'Jordan' });
  }

  return (
    <div className="flex items-center -space-x-2 shrink-0">
      {avatarList.map((av, idx) => (
        <img
          key={idx}
          src={av.src}
          alt={av.alt}
          className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-xs"
          loading="lazy"
        />
      ))}
    </div>
  );
}

export default function DayTimelinePanel({ selectedDate, posts = [], selectedPost, onSelectPost }) {
  const navigate = useNavigate();

  // Filter and sort posts scheduled for this day
  const dayPosts = posts
    .filter((p) => p.date === selectedDate)
    .sort((a, b) => (a.time || '10:00').localeCompare(b.time || '10:00'));

  const activePostId = selectedPost?.id || dayPosts[0]?.id;

  return (
    <div className="w-full flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 mb-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {formatDayHeader(selectedDate)}
        </h2>
        <span className="text-[11px] text-slate-400 font-medium">
          {dayPosts.length} {dayPosts.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Thin horizontal divider rule */}
      <div className="w-full h-px bg-slate-200/80 dark:bg-slate-800 mb-5" />

      {/* Event Timeline List */}
      <div className="flex flex-col gap-3.5">
        {dayPosts.map((post) => {
          const isActive = post.id === activePostId;

          return (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className={`group relative rounded-xl p-4 transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 border-l-4 border-l-blue-600 shadow-sm'
                  : 'bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Time Range */}
                  <p className="text-xl font-bold tracking-tight text-slate-950 dark:text-white tabular-nums">
                    {formatTimeRange(post.time)}
                  </p>

                  {/* Title */}
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                    {post.title}
                  </p>

                  {/* Subtitle / Series metadata */}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {post.series || post.category || 'LinkedIn Distribution'}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <StatusBadge status={post.status} />
                  </div>
                </div>

                {/* Team Avatars */}
                <AvatarStack post={post} />
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {dayPosts.length === 0 && <EmptyDayState selectedDate={selectedDate} />}
      </div>

      {/* Footer Quick Action */}
      {dayPosts.length > 0 && (
        <div className="pt-4 mt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => navigate(`/post-creation-composer?date=${selectedDate}`)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Plus size={13} />
            <span>Add another post for this day</span>
          </button>
          <button
            onClick={() => selectedPost && navigate(`/approval-workflow?post=${selectedPost.id}`)}
            className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <span>Review Queue</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
