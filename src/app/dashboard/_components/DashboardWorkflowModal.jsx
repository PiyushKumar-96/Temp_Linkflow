'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Settings, FileText, UserCheck, Send, ArrowRight } from 'lucide-react';
import { ModalShell, TONES, buttonStyles } from './DashboardPrimitives';

const STEPS = [
  {
    title: 'Set slots in settings',
    description:
      'Choose when you publish (for example Tuesday and Thursday at 09:00 UTC) and where: your personal profile or company page.',
    icon: Settings,
    tone: 'blue',
    actionLabel: 'Configure slots',
    route: '/settings',
  },
  {
    title: 'Plan a topic or draft a post',
    description:
      'Plan campaigns in Topics, or write a draft with AI help — hooks, hashtags, and an image or PDF carousel.',
    icon: FileText,
    tone: 'violet',
    actionLabel: 'Open composer',
    route: '/post-creation-composer',
  },
  {
    title: 'Owner approves in the queue',
    description:
      'Reviewers leave inline comments, request changes, or approve in one click from the approval queue.',
    icon: UserCheck,
    tone: 'amber',
    actionLabel: 'Open queue',
    route: '/approval-workflow',
  },
  {
    title: 'Auto-publish to LinkedIn',
    description:
      'Approved posts are locked, matched to their slot, and sent to LinkedIn through Buffer automatically.',
    icon: Send,
    tone: 'emerald',
    actionLabel: 'View calendar',
    route: '/content-calendar',
  },
];

export default function DashboardWorkflowModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={Zap}
      tone="violet"
      title="How the workflow works"
      subtitle="Four steps from idea to published LinkedIn post"
      maxWidth="max-w-2xl"
      footer={
        <button type="button" onClick={onClose} className={`${buttonStyles.dark} h-9`}>
          Got it
        </button>
      }
    >
      <ol className="relative flex flex-col">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const last = idx === STEPS.length - 1;
          return (
            <li key={s.title} className="relative flex gap-4 pb-5 last:pb-1">
              {!last && (
                <span aria-hidden="true" className="absolute left-5 top-12 bottom-1 w-px -translate-x-1/2 bg-border" />
              )}
              <span className={`relative grid size-10 shrink-0 place-items-center rounded-xl ${TONES[s.tone].chip}`}>
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-muted-foreground">Step {idx + 1}</p>
                    <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(s.route);
                    }}
                    className={`${buttonStyles.outline} h-8 px-3`}
                  >
                    {s.actionLabel}
                    <ArrowRight size={13} />
                  </button>
                </div>
                <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </ModalShell>
  );
}
