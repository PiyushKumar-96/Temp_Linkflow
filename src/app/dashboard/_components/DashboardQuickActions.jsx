'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Plus,
  Target,
  CheckSquare,
  BarChart2,
} from 'lucide-react';

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'qa-new-post',
      label: 'New Post',
      icon: Plus,
      route: '/post-creation-composer',
    },
    {
      id: 'qa-plan-topic',
      label: 'Plan Topic',
      icon: Target,
      route: '/topics',
    },
    {
      id: 'qa-open-queue',
      label: 'Open Queue',
      icon: CheckSquare,
      route: '/approval-workflow',
    },
    {
      id: 'qa-view-reports',
      label: 'View Reports',
      icon: BarChart2,
      route: '/analytics',
    },
  ];

  return (
    <div className="card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Zap size={15} className="text-amber-500 fill-amber-500" />
        <h3 className="text-sm font-bold text-foreground">Quick Actions</h3>
      </div>

      {/* 2x2 Grid of Actions */}
      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => navigate(act.route)}
              className="p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer group shadow-2xs"
            >
              <div className="w-6 h-6 rounded-lg bg-card border border-border/80 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all shrink-0">
                <Icon size={13} />
              </div>
              <span className="truncate">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
