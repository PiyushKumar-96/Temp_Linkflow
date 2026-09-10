'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  IconWorkflow,
  IconQuickNewPost,
  IconQuickPlanTopic,
  IconQuickOpenQueue,
  IconQuickViewReports,
} from './DashboardCustomIcons';
import { Panel, PanelHeader } from './DashboardPrimitives';

const ACTIONS = [
  {
    id: 'qa-new-post',
    label: 'New post',
    description: 'Create a post with AI or from scratch',
    icon: IconQuickNewPost,
    route: '/post-creation-composer',
    color: 'blue',
  },
  {
    id: 'qa-plan-topic',
    label: 'Plan topic',
    description: 'Organize pillars and campaigns',
    icon: IconQuickPlanTopic,
    route: '/topics',
    color: 'violet',
  },
  {
    id: 'qa-open-queue',
    label: 'Open queue',
    description: 'Review pending approvals',
    icon: IconQuickOpenQueue,
    route: '/approval-workflow',
    color: 'amber',
  },
  {
    id: 'qa-view-reports',
    label: 'View reports',
    description: 'Explore reach and performance',
    icon: IconQuickViewReports,
    route: '/analytics',
    color: 'emerald',
  },
];

const COLOR_MAP = {
  blue: {
    icon: 'bg-blue-500',
    iconShadow: 'shadow-blue-500/20',
    dot: 'bg-blue-500',
    hover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    line: 'group-hover:bg-blue-500',
  },
  violet: {
    icon: 'bg-violet-500',
    iconShadow: 'shadow-violet-500/20',
    dot: 'bg-violet-500',
    hover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
    line: 'group-hover:bg-violet-500',
  },
  amber: {
    icon: 'bg-amber-500',
    iconShadow: 'shadow-amber-500/20',
    dot: 'bg-amber-500',
    hover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    line: 'group-hover:bg-amber-500',
  },
  emerald: {
    icon: 'bg-emerald-500',
    iconShadow: 'shadow-emerald-500/20',
    dot: 'bg-emerald-500',
    hover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    line: 'group-hover:bg-emerald-500',
  },
};

export default function DashboardQuickActions({ actions = ACTIONS }) {
  const navigate = useNavigate();

  return (
    <Panel className="flex flex-1 flex-col p-5">
      <PanelHeader
        icon={IconWorkflow}
        tone="amber"
        title="Quick actions"
        badge={
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
            Shortcuts
          </span>
        }
      />

      <div className="mt-5 flex flex-1 flex-col">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colors = COLOR_MAP[action.color];

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => navigate(action.route)}
              className={`
                group relative flex flex-1 items-center
                gap-3.5 text-left
                ${index !== actions.length - 1
                  ? 'border-b border-border/70'
                  : ''}
                focus-visible:outline-none
              `}
            >
              {/* Left accent */}
              <span
                className={`
                  absolute left-0 top-1/2
                  h-0 w-[2px]
                  -translate-y-1/2
                  rounded-full
                  transition-all duration-200
                  group-hover:h-9
                  ${colors.line}
                `}
              />

              {/* Icon */}
              <span
                className={`
                  ml-1 grid size-9 shrink-0
                  place-items-center
                  rounded-xl
                  ${colors.icon}
                  text-white
                  shadow-md ${colors.iconShadow}
                  transition-transform duration-200
                  group-hover:scale-105
                `}
              >
                <Icon size={16} strokeWidth={2.3} />
              </span>

              {/* Text */}
              <span className="min-w-0 flex-1">
                <span
                  className={`
                    block text-[13px]
                    font-semibold
                    tracking-[-0.01em]
                    text-foreground
                    transition-colors duration-150
                    ${colors.hover}
                  `}
                >
                  {action.label}
                </span>

                <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">
                  {action.description}
                </span>
              </span>

              {/* Status dot */}
              <span
                className={`
                  hidden size-1.5 shrink-0
                  rounded-full opacity-50
                  sm:block
                  ${colors.dot}
                `}
              />

              {/* Arrow */}
              <span
                className="
                  grid size-7 shrink-0
                  place-items-center
                  rounded-full
                  text-muted-foreground/50
                  transition-all duration-200
                  group-hover:bg-muted
                  group-hover:text-foreground
                "
              >
                <ArrowUpRight
                  size={14}
                  className="
                    transition-transform duration-200
                    group-hover:translate-x-[1px]
                    group-hover:-translate-y-[1px]
                  "
                />
              </span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}