'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { IconTodayFocus } from './DashboardCustomIcons';
import { ModalShell, Pill, buttonStyles, formatDayLabel } from './DashboardPrimitives';

const PRIORITY = {
  critical: { label: 'Critical', tone: 'statusRed', dot: 'bg-[color:var(--danger)]' },
  high: { label: 'High', tone: 'statusAmber', dot: 'bg-[color:var(--warning)]' },
  normal: { label: 'Normal', tone: 'neutral', dot: 'bg-[color:var(--text-muted)]' },
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
      <ol className="flex flex-col gap-3">
        {tasks.map((task) => {
          const p = PRIORITY[task.priority] || PRIORITY.normal;
          return (
            <li
              key={task.id}
              className="flex flex-col justify-between rounded-[18px] bg-[color:var(--track-warm)] border border-[color:color-mix(in_srgb,var(--border)_60%,transparent)] p-4 text-[color:var(--text)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[color:var(--chip)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[color:var(--text)]">
                    {task.time}
                  </span>
                  <Pill tone={p.tone}>{p.label}</Pill>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(task.route);
                  }}
                  className="group inline-flex items-center gap-1 rounded-full bg-white border border-[color:var(--border)] px-3 py-1 text-xs font-semibold text-[color:var(--text)] shadow-xs transition-colors hover:bg-[color:var(--brand)] hover:text-white cursor-pointer"
                >
                  <span>{task.action}</span>
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </div>
              <h4 className="mt-2.5 text-sm font-semibold text-[color:var(--text)]">
                {task.title}
              </h4>
              <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">{task.desc}</p>
            </li>
          );
        })}
      </ol>
    </ModalShell>
  );
}
