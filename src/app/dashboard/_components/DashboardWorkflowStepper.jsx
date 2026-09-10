'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Play,
  ArrowRight,
  Settings,
  FileText,
  UserCheck,
  Send,
  Check,
  ChevronRight,
} from 'lucide-react';

export default function DashboardWorkflowStepper({ onOpenWorkflowModal }) {
  const navigate = useNavigate();

  const steps = [
    {
      stepNumber: 1,
      title: 'Set Slots in Settings',
      description: 'Configure time slots and posting preferences.',
      icon: Settings,
      iconBg: 'bg-blue-500/10 text-blue-600',
      badge: 'Completed',
      badgeClass: 'bg-emerald-500/10 text-emerald-600',
      isCheck: true,
      subtext: '2 slots set',
      route: '/settings',
    },
    {
      stepNumber: 2,
      title: 'Plan Topic or Draft Post',
      description: 'Create or choose a topic and prepare your content.',
      icon: FileText,
      iconBg: 'bg-purple-500/10 text-purple-600',
      badge: 'In Progress',
      badgeClass: 'bg-blue-500/10 text-blue-600',
      isDot: true,
      subtext: '4 drafts',
      route: '/topics',
    },
    {
      stepNumber: 3,
      title: 'Owner Approves in Queue',
      description: 'Content goes for human review and approval.',
      icon: UserCheck,
      iconBg: 'bg-amber-500/10 text-amber-600',
      badge: 'Pending',
      badgeClass: 'bg-amber-500/10 text-amber-600',
      isDot: true,
      subtext: '2 in queue',
      route: '/approval-workflow',
    },
    {
      stepNumber: 4,
      title: 'Auto-Publish to LinkedIn',
      description: 'Approved posts are automatically published.',
      icon: Send,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      badge: 'Upcoming',
      badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
      isDot: true,
      subtext: 'Scheduled via Buffer',
      route: '/content-calendar',
    },
  ];

  return (
    <div className="card p-5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.03] via-card to-primary/[0.01] shadow-xs flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <Zap size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Standard Workflow</h3>
            <p className="text-xs text-muted-foreground">
              From draft to LinkedIn, in 4 simple steps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenWorkflowModal}
            className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
          >
            <Play size={11} className="text-primary fill-primary" />
            <span>How it works?</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/approval-workflow')}
            className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5 font-semibold text-foreground hover:text-primary cursor-pointer shadow-2xs"
          >
            <span>View Workflow</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* 4 Connected Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.stepNumber}
              onClick={() => navigate(step.route)}
              className="relative p-4 rounded-xl border border-border bg-card/80 hover:bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Step number badge & arrow */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    {idx < steps.length - 1 && (
                      <ChevronRight size={12} className="text-muted-foreground/40 hidden lg:block" />
                    )}
                  </div>
                  <div className={`w-8 h-8 rounded-xl ${step.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={15} />
                  </div>
                </div>

                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {step.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Status footer pill + metric */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${step.badgeClass}`}>
                  {step.isCheck && <Check size={10} />}
                  {step.isDot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  {step.badge}
                </span>
                <span className="text-muted-foreground font-medium text-[10px]">
                  {step.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
