'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
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
    description: 'Create a post with AI or from scratch',
    icon: IconQuickNewPost,
    route: '/post-creation-composer',
    isPrimary: true,
  },
  {
    id: 'qa-plan-topic',
    label: 'Plan topic',
    description: 'Organize pillars and campaigns',
    icon: IconQuickPlanTopic,
    route: '/topics',
    isPrimary: false,
  },
  {
    id: 'qa-open-queue',
    label: 'Open queue',
    description: 'Review pending approvals',
    icon: IconQuickOpenQueue,
    route: '/approval-workflow',
    isPrimary: false,
  },
  {
    id: 'qa-view-reports',
    label: 'View reports',
    description: 'Explore reach and performance',
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

      {/* 2x2 grid: Only New Post is #0A66C2 blue with white text; other 3 are neutral #F0EFEB with ink icons */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {actions.map((action) => {
          const Icon = action.icon;
          const isPrimary = action.isPrimary;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => navigate(action.route)}
              className={`group relative flex flex-col justify-between rounded-[18px] p-3.5 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
                isPrimary
                  ? 'bg-[#0A66C2] text-white shadow-xs hover:bg-[#084E96]'
                  : 'bg-[#F0EFEB] text-[#1B1B1F] hover:bg-[#E4E2DC]'
              }`}
            >
              {/* Top row: Icon + small ↗ in corner */}
              <div className="flex items-start justify-between w-full">
                <span className={isPrimary ? 'text-white' : 'text-[#1B1B1F]'}>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span
                  className={`${
                    isPrimary ? 'text-white' : 'text-[#1B1B1F]'
                  } transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                >
                  <ArrowUpRight size={14} strokeWidth={2.4} />
                </span>
              </div>

              {/* Bottom: Bold label + one-line description */}
              <div className="mt-3">
                <span
                  className={`block text-xs sm:text-sm font-bold leading-snug ${
                    isPrimary ? 'text-white' : 'text-[#1B1B1F]'
                  }`}
                >
                  {action.label}
                </span>
                <span
                  className={`mt-0.5 block line-clamp-1 text-[11px] leading-tight ${
                    isPrimary ? 'text-white/80' : 'text-[#6B6B70]'
                  }`}
                >
                  {action.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}