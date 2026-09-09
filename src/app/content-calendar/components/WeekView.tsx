'use client';

import React from 'react';
import type { CalendarPost } from './CalendarShell';
import PostDetailPopover from './PostDetailPopover';

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-blue-50 text-blue-700 border-blue-200',
  scheduled: 'bg-violet-50 text-violet-700 border-violet-200',
  published: 'bg-green-50 text-green-700 border-green-200',
};

const HOURS = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'];
const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  currentDate: Date;
  posts: CalendarPost[];
  selectedPost: CalendarPost | null;
  onSelectPost: (p: CalendarPost | null) => void;
}

function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(d);
    nd.setDate(d.getDate() + i);
    return nd;
  });
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function WeekView({ currentDate, posts, selectedPost, onSelectPost }: Props) {
  const weekDays = getWeekDays(currentDate);
  const todayStr = '2026-09-08';

  const getPostsForDayHour = (day: Date, hour: number) => {
    const dateStr = toDateStr(day);
    return posts.filter(p => {
      if (p.date !== dateStr) return false;
      if (!p.time) return hour === 9;
      const h = parseInt(p.time.split(':')[0]);
      return h === (hour < 12 ? hour : hour === 12 ? 12 : hour + 12 - 12);
    });
  };

  return (
    <div className="card overflow-hidden">
      {/* Header row */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
        <div className="py-2.5 border-r border-border" />
        {weekDays.map((day, i) => {
          const isToday = toDateStr(day) === todayStr;
          return (
            <div key={`wday-${i}`} className={`py-2.5 text-center border-r border-border last:border-r-0 ${isToday ? 'bg-primary/5' : ''}`}>
              <p className="text-xs text-muted-foreground font-500">{DOW_SHORT[day.getDay()]}</p>
              <p className={`text-sm font-700 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full mx-auto ${isToday ? 'bg-primary text-white' : 'text-foreground'}`}>
                {day.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: 520 }}>
        {HOURS.map((hour, hi) => {
          const hourNum = hi + 6;
          return (
            <div key={`hour-${hour}`} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: '56px repeat(7, 1fr)', minHeight: 56 }}>
              <div className="px-2 py-1 border-r border-border flex items-start justify-end">
                <span className="text-xs text-muted-foreground font-500">{hour}</span>
              </div>
              {weekDays.map((day, di) => {
                const dayPosts = getPostsForDayHour(day, hourNum);
                const isToday = toDateStr(day) === todayStr;
                return (
                  <div key={`slot-${hi}-${di}`} className={`p-1 border-r border-border last:border-r-0 ${isToday ? 'bg-primary/3' : 'hover:bg-muted/20'} transition-colors`}>
                    {dayPosts.map(post => (
                      <button
                        key={post.id}
                        onClick={() => onSelectPost(selectedPost?.id === post.id ? null : post)}
                        className={`w-full text-left px-1.5 py-1 rounded text-xs border font-500 truncate transition-all hover:opacity-80 mb-0.5 ${statusColors[post.status]}`}
                        title={post.title}
                      >
                        {post.title.slice(0, 20)}...
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {selectedPost && (
        <PostDetailPopover post={selectedPost} onClose={() => onSelectPost(null)} />
      )}
    </div>
  );
}