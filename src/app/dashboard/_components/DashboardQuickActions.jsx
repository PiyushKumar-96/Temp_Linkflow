'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconQuickNewPost,
  IconQuickPlanTopic,
  IconQuickOpenQueue,
  IconQuickViewReports,
} from './DashboardCustomIcons';
import { Panel } from './DashboardPrimitives';

const ACTIONS = [
  {
    id: 'qa-new-post',
    label: 'New post',
    icon: IconQuickNewPost,
    route: '/post-creation-composer',
    isPrimary: true,
  },
  {
    id: 'qa-plan-topic',
    label: 'Plan topic',
    icon: IconQuickPlanTopic,
    route: '/topics',
    isPrimary: false,
  },
  {
    id: 'qa-open-queue',
    label: 'Open queue',
    icon: IconQuickOpenQueue,
    route: '/approval-workflow',
    isPrimary: false,
  },
  {
    id: 'qa-view-reports',
    label: 'View reports',
    icon: IconQuickViewReports,
    route: '/analytics',
    isPrimary: false,
  },
];

export default function DashboardQuickActions({ actions = ACTIONS }) {
  const navigate = useNavigate();

  return (
    <Panel className="flex flex-1 flex-col justify-between p-5 sm:p-6">
      <h3 className="text-base font-semibold tracking-tight text-[color:var(--text)] mb-3">
        Quick actions
      </h3>

      {/* 2x2 grid: equal row heights so all tiles match */}
      <div className="grid grid-cols-2 grid-rows-2 [grid-template-rows:repeat(2,1fr)] auto-rows-fr gap-3 flex-1">
        {actions.map((action) => {
          const Icon = action.icon;
          const isPrimary = action.isPrimary;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => navigate(action.route)}
              className={`group relative flex h-full flex-col justify-between rounded-[14px] p-4 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] ${
                isPrimary
                  ? 'border border-[color:var(--brand)] bg-[color:var(--brand)] text-white hover:border-[color:var(--brand-hover)] hover:bg-[color:var(--brand-hover)]'
                  : 'border border-[color:var(--border)] bg-transparent text-[color:var(--text)] hover:bg-[color:var(--chip)]'
              }`}
            >
              {/* Top: Icon */}
              <div className="flex h-5 items-center">
                <span className={isPrimary ? 'text-white' : 'text-[#5A5A60]'} aria-hidden="true">
                  <Icon size={20} strokeWidth={2} />
                </span>
              </div>

              {/* Bottom: Title */}
              <span
                className={`mt-auto block text-[13px] sm:text-[14px] font-semibold leading-tight whitespace-nowrap ${
                  isPrimary ? 'text-white' : 'text-[color:var(--text)]'
                }`}
              >
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
