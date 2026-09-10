'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Plus, Target, CheckSquare, AlertTriangle, Calendar, Building2, User } from 'lucide-react';

export default function DashboardHeader({
  pendingReviewCount = 0,
  upcomingCount = 0,
  failureCount = 0,
  topicsCount = 0,
}) {
  const navigate = useNavigate();
  const { activeAccount, isOwner } = useAuth();

  return (
    <div className="flex flex-col gap-5">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-foreground tracking-tight">Operations Cockpit</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
              {activeAccount.type.includes('Company') ? <Building2 size={11} /> : <User size={11} />}
              {activeAccount.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active pipeline health, immediate review queues, upcoming scheduled content, and dispatch alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/topics')}
            className="btn btn-outline text-xs flex items-center gap-1.5"
            title="Set campaign themes and generate batch drafts"
          >
            <Target size={13} />
            Plan Topic
          </button>
          <button
            onClick={() => navigate('/post-creation-composer')}
            className="btn btn-primary text-xs flex items-center gap-1.5"
            title="Directly write copy and select visuals in Post Composer"
          >
            <Plus size={14} />
            Compose Post
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => navigate('/approval-workflow')}
          className="card p-3.5 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckSquare size={18} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Pending Review</p>
            <p className="text-lg font-bold text-foreground leading-tight">{pendingReviewCount}</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/content-calendar')}
          className="card p-3.5 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Upcoming 14 Days</p>
            <p className="text-lg font-bold text-foreground leading-tight">{upcomingCount}</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/topics')}
          className="card p-3.5 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Target size={18} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Planned Topics</p>
            <p className="text-lg font-bold text-foreground leading-tight">{topicsCount}</p>
          </div>
        </div>

        <div
          className={`card p-3.5 flex items-center gap-3 transition-all ${
            failureCount > 0
              ? 'border-destructive/40 bg-destructive/5 text-destructive cursor-pointer hover:border-destructive'
              : 'text-muted-foreground'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              failureCount > 0 ? 'bg-destructive/15 text-destructive' : 'bg-muted text-muted-foreground'
            }`}
          >
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-[11px] font-medium">Pipeline Alerts</p>
            <p className={`text-lg font-bold leading-tight ${failureCount > 0 ? 'text-destructive' : 'text-foreground'}`}>
              {failureCount}
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Orientation Guide */}
      <div className="p-3.5 bg-card border border-border rounded-xl flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-bold text-foreground">Standard Workflow:</span>
          <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
            <span className="bg-muted px-2 py-0.5 rounded text-foreground font-medium">1. Set Slots in Settings</span>
            <span>→</span>
            <span className="bg-muted px-2 py-0.5 rounded text-foreground font-medium">2. Plan Topic or Draft Post</span>
            <span>→</span>
            <span className="bg-muted px-2 py-0.5 rounded text-foreground font-medium">3. Owner Approves in Queue</span>
            <span>→</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">4. Auto-Publish to LinkedIn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
