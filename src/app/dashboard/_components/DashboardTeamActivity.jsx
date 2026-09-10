'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle } from 'lucide-react';
import { Panel, PanelHeader, PanelLink, LiveDot, Avatar } from './DashboardPrimitives';

const DEFAULT_ACTIVITIES = [
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
  { id: 'act-3', kind: 'system', name: 'System', action: 'flagged a publishing error', time: '1 hour ago' },
  { id: 'act-4', name: 'You', action: 'updated topic settings', time: '2 hours ago' },
  { id: 'act-5', name: 'Rohan Mehta', action: 'added a new draft', time: '3 hours ago' },
];

export default function DashboardTeamActivity({ activities = DEFAULT_ACTIVITIES, limit = 5 }) {
  const navigate = useNavigate();

  return (
    <Panel className="flex h-full flex-col p-5">
      <PanelHeader
        icon={Users}
        tone="indigo"
        title="Team activity"
        badge={<LiveDot label="Live updates" />}
        action={<PanelLink onClick={() => navigate('/approval-workflow')}>View all</PanelLink>}
      />

      <ul className="mt-3 flex flex-col">
        {activities.slice(0, limit).map((item, idx, arr) => (
          <li key={item.id} className="relative flex gap-3 py-2">
            {/* connector */}
            {idx < arr.length - 1 && (
              <span aria-hidden="true" className="absolute left-4 top-10 bottom-0 w-px -translate-x-1/2 bg-border/70" />
            )}

            {item.kind === 'system' ? (
              <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600 ring-2 ring-card dark:bg-rose-400/10 dark:text-rose-300">
                <AlertTriangle size={14} strokeWidth={2.2} />
              </span>
            ) : (
              <Avatar src={item.avatar} name={item.name} className="relative" />
            )}

            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] leading-snug text-foreground">
                <span className={`font-semibold ${item.kind === 'system' ? 'text-rose-600 dark:text-rose-300' : ''}`}>
                  {item.name}
                </span>{' '}
                <span className="text-muted-foreground">{item.action}</span>
              </p>
              <span className="text-[11px] text-muted-foreground/80">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
