import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { AVATARS } from '@/temp-backend/data/media';
import EmptyDayState from './EmptyDayState';
import { formatSlot } from '@/app/dashboard/_components/DashboardPrimitives';
import { normalizeStatus } from '@/lib/post-status';

function getStatusBorderClass(status) {
  const s = normalizeStatus(status);
  if (s === 'published') return 'border-l-[color:var(--success)]';
  if (s === 'scheduled') return 'border-l-[color:var(--info)]';
  if (s === 'awaiting_review' || s === 'needs_revision') return 'border-l-[color:var(--warning)]';
  if (s === 'failed' || s === 'rejected') return 'border-l-[color:var(--danger)]';
  return 'border-l-[color:var(--border)]';
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
          className="w-7 h-7 rounded-full object-cover border-2 border-[color:var(--card)] shadow-xs"
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
  const formattedDayTitle = formatSlot(selectedDate) || selectedDate;

  return (
    <div className="w-full flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 mb-2">
        <h2 className="text-xs font-bold tracking-wide text-[color:var(--text-muted)]">
          {formattedDayTitle}
        </h2>
        <span className="text-[11px] text-[color:var(--text-subtle)] font-medium">
          {dayPosts.length} {dayPosts.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Thin horizontal divider rule */}
      <div className="w-full h-px bg-[color:var(--border)] mb-5" />

      {/* Event Timeline List */}
      <div className="flex flex-col gap-3.5">
        {dayPosts.map((post) => {
          const isActive = post.id === activePostId;
          const statusBorder = getStatusBorderClass(post.status);

          return (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className={`group relative rounded-xl p-4 transition-all duration-150 cursor-pointer border-l-4 ${statusBorder} ${
                isActive
                  ? 'bg-[color:var(--card)] border border-[color:var(--border)] shadow-sm'
                  : 'bg-[color:var(--chip)] hover:bg-[color:var(--card)] border border-[color:var(--border)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Time Range */}
                  <p className="text-xl font-bold tracking-tight text-[color:var(--text)] tabular-nums">
                    {formatTimeRange(post.time)}
                  </p>

                  {/* Title */}
                  <p className="text-sm font-semibold text-[color:var(--text)] mt-1 line-clamp-1">
                    {post.title}
                  </p>

                  {/* Subtitle / Series metadata */}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-[color:var(--text-muted)] font-medium">
                      {post.series || post.category || 'LinkedIn Distribution'}
                    </span>
                    <span className="text-[color:var(--border)]">·</span>
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
        <div className="pt-4 mt-2 border-t border-[color:var(--border)] flex items-center justify-between">
          <button
            onClick={() => navigate(`/post-creation-composer?date=${selectedDate}`)}
            className="text-xs font-semibold text-[color:var(--brand)] hover:text-[color:var(--brand-hover)] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add another post for this day</span>
          </button>
          <button
            onClick={() => selectedPost && navigate(`/approval-workflow?post=${selectedPost.id}`)}
            className="text-xs text-[color:var(--text-subtle)] hover:text-[color:var(--text)] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Review queue</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
