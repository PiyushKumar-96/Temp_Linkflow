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

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  currentDate: Date;
  posts: CalendarPost[];
  selectedPost: CalendarPost | null;
  onSelectPost: (p: CalendarPost | null) => void;
}

export default function MonthView({ currentDate, posts, selectedPost, onSelectPost }: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = '2026-09-08';

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const getPostsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.date === dateStr);
  };

  return (
    <div className="card overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DOW.map(d => (
          <div key={`dow-${d}`} className="py-2.5 text-center text-xs font-600 text-muted-foreground uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const dayPosts = getPostsForDay(day);
          const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
          const isToday = dateStr === todayStr;

          return (
            <div
              key={`cell-${idx}`}
              className={`min-h-[100px] p-2 border-b border-r border-border last:border-r-0 transition-colors ${
                day ? 'hover:bg-muted/30' : 'bg-muted/20'
              } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
            >
              {day && (
                <>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full mb-1.5 text-xs font-600 ${
                    isToday ? 'bg-primary text-white' : 'text-foreground'
                  }`}>
                    {day}
                  </div>

                  <div className="flex flex-col gap-1">
                    {dayPosts.slice(0, 3).map(post => (
                      <button
                        key={post.id}
                        onClick={() => onSelectPost(selectedPost?.id === post.id ? null : post)}
                        className={`text-left w-full px-1.5 py-1 rounded text-xs border truncate font-500 transition-all duration-150 hover:opacity-80 ${statusColors[post.status]}`}
                        title={post.title}
                      >
                        {post.time && <span className="opacity-70 mr-1">{post.time}</span>}
                        {post.title.slice(0, 28)}...
                      </button>
                    ))}
                    {dayPosts.length > 3 && (
                      <span className="text-xs text-muted-foreground px-1">+{dayPosts.length - 3} more</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 flex-wrap">
        {Object.entries(statusColors).map(([status, cls]) => (
          <div key={`legend-${status}`} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm border ${cls}`} />
            <span className="text-xs text-muted-foreground capitalize">{status}</span>
          </div>
        ))}
      </div>

      {/* Post detail popover */}
      {selectedPost && (
        <PostDetailPopover post={selectedPost} onClose={() => onSelectPost(null)} />
      )}
    </div>
  );
}