'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

export default function DashboardTodayFocus({
  items = [
    {
      id: 'focus-1',
      time: '10:00 AM',
      color: 'bg-emerald-500',
      title: 'Review pending posts',
      detail: '3 items',
      link: '/approval-workflow?status=awaiting_review',
    },
    {
      id: 'focus-2',
      time: '12:30 PM',
      color: 'bg-blue-500',
      title: 'Approve campaign draft',
      detail: 'Marketing · High priority',
      link: '/approval-workflow',
    },
    {
      id: 'focus-3',
      time: '03:00 PM',
      color: 'bg-amber-500',
      title: 'Check pipeline alerts',
      detail: '1 critical issue',
      link: '/approval-workflow?status=failed',
    },
  ],
}) {
  const navigate = useNavigate();

  return (
    <div className="card p-5 flex flex-col justify-between rounded-2xl border border-border shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Today&apos;s Focus</h3>
        <button
          type="button"
          onClick={() => navigate('/content-calendar')}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View Calendar</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Timeline List */}
      <div className="flex flex-col gap-3.5 my-auto pt-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => navigate(item.link)}
            className="flex items-start gap-3 text-xs group cursor-pointer hover:bg-muted/30 p-1 rounded-lg transition-colors"
          >
            {/* Timestamp */}
            <span className="text-[11px] font-semibold text-muted-foreground tabular-nums shrink-0 w-16 pt-0.5">
              {item.time}
            </span>

            {/* Indicator Dot with vertical guideline */}
            <div className="relative flex flex-col items-center shrink-0 pt-1.5">
              <span className={`w-2 h-2 rounded-full ${item.color} group-hover:scale-125 transition-transform`} />
              {idx < items.length - 1 && (
                <span className="w-px h-6 bg-border absolute top-3.5" />
              )}
            </div>

            {/* Task Info */}
            <div className="flex flex-col min-w-0 flex-1 pl-1">
              <span className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {item.title}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {item.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
