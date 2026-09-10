'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

export default function DashboardTeamActivity({
  activities = [
    {
      id: 'act-1',
      name: 'Lisa Tran',
      action: 'approved a post',
      time: '2 minutes ago',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'act-2',
      name: 'Mayank Chen',
      action: 'scheduled a post',
      time: '12 minutes ago',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    },
  ],
}) {
  const navigate = useNavigate();

  return (
    <div className="card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Users size={14} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Team Activity</h3>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/approval-workflow')}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Activity List */}
      <div className="mt-3 flex flex-col divide-y divide-border/50">
        {activities.map((item) => (
          <div
            key={item.id}
            className="py-2.5 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <p className="text-xs text-foreground truncate">
                  <span className="font-bold">{item.name}</span>{' '}
                  <span className="text-muted-foreground">{item.action}</span>
                </p>
                <span className="text-[10px] text-muted-foreground">
                  {item.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
