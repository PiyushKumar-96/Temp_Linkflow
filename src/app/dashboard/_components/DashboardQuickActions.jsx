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
      <h3 className="text-base font-semibold tracking-tight text-[#1B1B1F] mb-3">
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
              className={`group relative flex h-full flex-col justify-between rounded-[14px] border p-4 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
                isPrimary
                  ? 'border-[#0A66C2] bg-[#0A66C2] text-white shadow-xs hover:border-[#084E96] hover:bg-[#084E96]'
                  : 'border-[#E3E1DA] bg-transparent text-[#1B1B1F] hover:bg-[#F0EFEB]'
              }`}
            >
              {/* Top: Icon */}
              <div className="flex h-5 items-center">
                <span
                  className={isPrimary ? 'text-white' : 'text-[#5A5A60]'}
                  aria-hidden="true"
                >
                  <Icon size={20} strokeWidth={2} />
                </span>
              </div>

              {/* Bottom: Title */}
              <span
                className={`mt-auto block text-[13px] sm:text-[14px] font-semibold leading-tight whitespace-nowrap ${
                  isPrimary ? 'text-white' : 'text-[#1B1B1F]'
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