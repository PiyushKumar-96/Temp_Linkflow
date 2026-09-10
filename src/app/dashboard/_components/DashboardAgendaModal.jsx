'use client';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function DashboardAgendaModal({ isOpen, onClose }) {
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

  const agendaTasks = [
    {
      id: 'ag-1',
      time: '10:00 AM',
      priority: 'high',
      title: 'Review 2 Pending Drafts in Approval Queue',
      desc: 'Verify hooks, hashtags, and LinkedIn formatting before scheduling.',
      action: 'Open Queue',
      route: '/approval-workflow?status=awaiting_review',
    },
    {
      id: 'ag-2',
      time: '12:30 PM',
      priority: 'critical',
      title: 'Resolve Buffer Dispatch Failure',
      desc: '1 post failed due to worker timeout. Retry dispatch or publish manually.',
      action: 'Fix Failure',
      route: '/approval-workflow?status=failed',
    },
    {
      id: 'ag-3',
      time: '03:00 PM',
      priority: 'normal',
      title: 'Quarterly Topic Strategy Review',
      desc: 'Check February 2026 coverage gaps and batch plan new weekly topics.',
      action: 'View Topics',
      route: '/topics',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Today&apos;s Operations Agenda</h3>
              <p className="text-[11px] text-muted-foreground">
                Monday, 09 Sep 2026 · 2 critical attention items
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

        {/* Tasks List */}
        <div className="p-5 space-y-3">
          {agendaTasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                    {task.time}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      task.priority === 'critical'
                        ? 'bg-red-500/10 text-red-600'
                        : task.priority === 'high'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(task.route);
                  }}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{task.action}</span>
                  <ArrowRight size={11} />
                </button>
              </div>

              <h4 className="text-xs font-bold text-foreground">{task.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {task.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-card flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary text-xs py-1.5 px-4 font-semibold cursor-pointer"
          >
            Close Agenda
          </button>
        </div>
      </div>
    </div>
  );
}
