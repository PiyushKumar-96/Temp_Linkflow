'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  ChevronDown,
  Radio,
  Clock,
  MoreVertical,
} from 'lucide-react';

export default function DashboardUpcomingPostsCard({ upcomingPosts = [] }) {
  const navigate = useNavigate();
  const [targetFilter, setTargetFilter] = useState('all');

  const defaultPost = {
    id: 'upcoming-1',
    title: 'The Modern B2B Marketing Stack for 2027: What to Keep and What to Drop',
    datetime: '2026-09-12 09:30 UTC',
    format: 'Carousel',
    target: 'Company Page',
    status: 'Scheduled',
  };

  const currentPost = upcomingPosts.length > 0 ? {
    id: upcomingPosts[0].id,
    title: upcomingPosts[0].title || defaultPost.title,
    datetime: upcomingPosts[0].scheduledDate
      ? `${upcomingPosts[0].scheduledDate} ${upcomingPosts[0].scheduledTime || '09:30'} UTC`
      : defaultPost.datetime,
    format: upcomingPosts[0].visualFormat === 'carousel' ? 'Carousel' : 'Image',
    target: upcomingPosts[0].category || 'Company Page',
    status: 'Scheduled',
  } : defaultPost;

  return (
    <div className="card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Calendar size={14} />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            Upcoming Posts (Next 14 Days)
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              className="bg-muted/50 border border-border/80 text-xs font-semibold text-foreground py-1 px-2.5 rounded-lg outline-none cursor-pointer appearance-none pr-6"
            >
              <option value="all">All Targets</option>
              <option value="company">Company Page</option>
              <option value="personal">Personal Profile</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate('/content-calendar')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Calendar</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mt-3.5 bg-muted/20 hover:bg-muted/40 border border-border/70 rounded-xl p-3.5 transition-colors cursor-pointer group flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <Radio size={15} className="group-hover:scale-110 transition-transform" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
            {currentPost.title}
          </h4>

          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1 font-mono">
              <Clock size={11} className="text-muted-foreground" />
              {currentPost.datetime}
            </span>
            <span>·</span>
            <span className="font-semibold text-foreground/80">{currentPost.format}</span>
            <span>·</span>
            <span>{currentPost.target}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {currentPost.status}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/content-calendar');
            }}
            className="text-muted-foreground hover:text-foreground p-0.5 rounded"
          >
            <MoreVertical size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
