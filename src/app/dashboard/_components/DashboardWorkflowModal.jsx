'use client';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Zap,
  Settings,
  FileText,
  UserCheck,
  Send,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardWorkflowModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Set Slots in Settings',
      description:
        'Define your preferred publication schedule (e.g. Tuesday & Thursday at 09:00 UTC) and target accounts (Personal profile or Company page).',
      icon: Settings,
      iconColor: 'text-blue-500 bg-blue-500/10',
      actionLabel: 'Configure Slots',
      route: '/settings',
    },
    {
      step: '02',
      title: 'Plan Topic or Draft Post',
      description:
        'Plan quarterly campaigns in Topics or generate AI-assisted drafts with verified hooks, hashtags, and single image / PDF document deck visual assets.',
      icon: FileText,
      iconColor: 'text-purple-500 bg-purple-500/10',
      actionLabel: 'Go to Composer',
      route: '/post-creation-composer',
    },
    {
      step: '03',
      title: 'Owner Approves in Queue',
      description:
        'Human stakeholders review AI drafts in the Approval Queue, provide inline comments, request revisions, and issue one-click approvals.',
      icon: UserCheck,
      iconColor: 'text-amber-500 bg-amber-500/10',
      actionLabel: 'Open Queue',
      route: '/approval-workflow',
    },
    {
      step: '04',
      title: 'Auto-Publish to LinkedIn via Buffer',
      description:
        'Once approved, posts are locked, automatically matched to their scheduled publication slot, and delivered to LinkedIn without manual intervention.',
      icon: Send,
      iconColor: 'text-emerald-500 bg-emerald-500/10',
      actionLabel: 'View Calendar',
      route: '/content-calendar',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Standard Workflow Walkthrough</h3>
              <p className="text-[11px] text-muted-foreground">
                How LinkedFlow moves ideas from draft to LinkedIn seamlessly
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-3.5 scrollbar-thin">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex items-start gap-3.5"
              >
                <div className={`w-9 h-9 rounded-xl ${s.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                      STEP {s.step}
                    </span>
                    <h4 className="text-xs font-bold text-foreground">{s.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(s.route);
                  }}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 shrink-0 font-semibold cursor-pointer shadow-2xs hover:text-primary"
                >
                  <span>{s.actionLabel}</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-card flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary text-xs py-1.5 px-4 font-semibold cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
