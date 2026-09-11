'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { IconTodayFocus } from './DashboardCustomIcons';
import { ModalShell, Pill, buttonStyles, formatDayLabel } from './DashboardPrimitives';

const PRIORITY = {
  critical: { label: 'Critical', tone: 'rose', rail: 'bg-rose-500' },
  high: { label: 'High', tone: 'amber', rail: 'bg-amber-500' },
  normal: { label: 'Normal', tone: 'blue', rail: 'bg-blue-500' },
};

const DEFAULT_TASKS = [
  {
    id: 'ag-1',
    time: '10:00 AM',
    priority: 'high',
    title: 'Review 2 drafts in the approval queue',
    desc: 'Check hooks, hashtags and LinkedIn formatting before scheduling.',
    action: 'Open queue',
    route: '/approval-workflow?status=awaiting_review',
  },
  {
    id: 'ag-2',
    time: '12:30 PM',
    priority: 'critical',
    title: 'Fix the failed Buffer dispatch',
    desc: '1 post timed out on its way to LinkedIn. Retry it or publish manually.',
    action: 'Fix failure',
    route: '/approval-workflow?status=failed',
  },
  {
    id: 'ag-3',
    time: '03:00 PM',
    priority: 'normal',
    title: 'Quarterly topic review',
    desc: 'Look for coverage gaps and plan next week’s topics in one batch.',
    action: 'View topics',
    route: '/topics',
  },
];

export default function DashboardAgendaModal({ isOpen, onClose, tasks = DEFAULT_TASKS }) {
  const navigate = useNavigate();
  const urgent = tasks.filter((t) => t.priority === 'critical' || t.priority === 'high').length;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={IconTodayFocus}
      tone="blue"
      title="Today's agenda"
      subtitle={`${formatDayLabel(new Date())} · ${urgent} urgent item${urgent === 1 ? '' : 's'}`}
      footer={
        <button type="button" onClick={onClose} className={`${buttonStyles.dark} h-9`}>
          Done
        </button>
      }
    >
      <ol className="flex flex-col gap-2.5">
        {tasks.map((task) => {
          const p = PRIORITY[task.priority] || PRIORITY.normal;
          return (
            <li
              key={task.id}
              className="relative overflow-hidden rounded-xl border border-border/70 bg-card py-3.5 pl-5 pr-4"
            >
              <span aria-hidden="true" className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${p.rail}`} />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <time className="text-xs font-medium text-muted-foreground tabular-nums">{task.time}</time>
                  <Pill tone={p.tone}>{p.label}</Pill>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(task.route);
                  }}
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 cursor-pointer"
                >
                  {task.action}
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
              <h4 className="mt-2 text-[13px] font-semibold text-foreground">{task.title}</h4>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{task.desc}</p>
            </li>
          );
        })}
      </ol>
    </ModalShell>
  );
}
