import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostDetailPopover from './PostDetailPopover';
import { normalizeStatus, STATUS_META, STATUS_FILTER_ORDER } from '@/lib/post-status';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Plus } from 'lucide-react';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthView({ currentDate, posts, selectedPost, onSelectPost }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handlePrefetch = (postId) => {
    queryClient.prefetchQuery({
      queryKey: ['post', 'detail', postId],
      queryFn: async () => apiClient.get(`/posts/${postId}`),
      staleTime: 60 * 1000,
    });
  };
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = '2026-09-08';

  const cells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const getPostsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter((p) => p.date === dateStr);
  };

  return (
    <div className="card overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DOW.map((d) => (
          <div
            key={`dow-${d}`}
            className="py-2.5 text-center text-xs font-600 text-muted-foreground uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const dayPosts = getPostsForDay(day);
          const dateStr = day
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : '';
          const isToday = dateStr === todayStr;

          return (
            <div
              key={`cell-${idx}`}
              className={`min-h-[100px] p-2 border-b border-r border-border last:border-r-0 transition-colors relative group/cell ${
                day ? 'hover:bg-muted/30' : 'bg-muted/20'
              } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-600 ${
                        isToday ? 'bg-primary text-white' : 'text-foreground'
                      }`}
                    >
                      {day}
                    </div>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/topics?view=year&date=${dateStr}`)}
                        className="text-[10px] text-muted-foreground hover:text-foreground px-1 py-0.5 rounded hover:bg-muted"
                        title="Plan a topic brief for this day"
                      >
                        Plan
                      </button>
                      <button
                        onClick={() => navigate(`/post-creation-composer?date=${dateStr}`)}
                        className="text-[10px] text-primary font-semibold flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-primary/10"
                        title="Draft post for this day in Composer"
                      >
                        <Plus size={9} />
                        Post
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    {dayPosts.slice(0, 3).map((post) => (
                      <button
                        key={post.id}
                        onClick={() => onSelectPost(selectedPost?.id === post.id ? null : post)}
                        onMouseEnter={() => handlePrefetch(post.id)}
                        className={`text-left w-full px-1.5 py-1 rounded text-xs border truncate font-500 transition-all duration-150 hover:opacity-80 ${(STATUS_META[normalizeStatus(post.status)] || STATUS_META.planned).badgeClass}`}
                        title={post.title}
                      >
                        {post.time && <span className="opacity-70 mr-1">{post.time}</span>}
                        {post.title.slice(0, 28)}...
                      </button>
                    ))}
                    {dayPosts.length > 3 && (
                      <span className="text-xs text-muted-foreground px-1">
                        +{dayPosts.length - 3} more
                      </span>
                    )}
                    {dayPosts.length === 0 && (
                      <button
                        onClick={() => navigate(`/topics?view=year&date=${dateStr}`)}
                        className="w-full text-left py-1 px-1.5 rounded border border-dashed border-border/60 text-[10px] text-muted-foreground opacity-0 group-hover/cell:opacity-100 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1 mt-1"
                      >
                        <Plus size={10} />
                        Plan topic
                      </button>
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
        {STATUS_FILTER_ORDER.map((statusKey) => {
          const meta = STATUS_META[statusKey];
          if (!meta) return null;
          return (
            <div key={`legend-${statusKey}`} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm border ${meta.badgeClass}`} />
              <span className="text-xs text-muted-foreground">{meta.label}</span>
            </div>
          );
        })}
      </div>

      {/* Post detail popover */}
      {selectedPost && <PostDetailPopover post={selectedPost} onClose={() => onSelectPost(null)} />}
    </div>
  );
}
