'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

const HOOK_EXAMPLES = [
  {
    title: 'The contrarian shift',
    preview: 'The conventional wisdom on B2B LinkedIn growth is backwards. Here is what actually worked for our team after 90 days:',
    topicText: 'The conventional wisdom on B2B LinkedIn growth is backwards. Here is what actually worked:',
    metric: '96% engagement score',
  },
  {
    title: 'Case breakdown with metric',
    preview: 'How we reduced onboarding churn by 40% in 90 days without adding more automated emails or complex bots:',
    topicText: 'How we reduced onboarding churn by 40% in 90 days without adding new features:',
    metric: '94% engagement score',
  },
  {
    title: 'Tactical framework',
    preview: '5 non-obvious rules that saved our distributed engineering team 12 hours a week across asynchronous workflows:',
    topicText: '5 non-obvious rules that saved our distributed engineering team 12 hours a week:',
    metric: '98% engagement score',
  },
];

export default function AIGeneratorEmptyState({
  topic,
  theme,
  reference,
  visualFormat,
  onSelectTopic,
}) {
  const formatLabel = {
    image: '3 image options per post',
    carousel: '5-slide document deck',
    infographic: 'Metric cards and 3-step pillar frameworks',
    none: 'Plain narrative layout',
  }[visualFormat] || 'Visual options';

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 flex flex-col gap-7 transition-all">
      {/* 1. Hero Content Preview: Boldest item on the page */}
      <div>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2">
          Preview headline
        </p>

        <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white leading-tight">
          {topic || '5 Async communication rules for distributed engineering'}
        </h3>

        <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
          <span>Pillar: <strong className="font-medium text-slate-700 dark:text-slate-200">{theme || 'Thought Leadership'}</strong></span>
          <span>&bull;</span>
          <span>Format: <strong className="font-medium text-slate-700 dark:text-slate-200 capitalize">{visualFormat}</strong></span>
          {reference && (
            <>
              <span>&bull;</span>
              <span className="truncate max-w-[260px]">Source: {reference}</span>
            </>
          )}
        </div>
      </div>

      {/* 2. Connected 3-Step Sequence */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
          Generation pipeline
        </h4>

        <div className="relative flex flex-col sm:flex-row items-start justify-between gap-4">
          {/* Subtle connecting rail */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute top-3.5 left-4 right-4 h-px bg-slate-200 dark:bg-slate-800 -z-0"
          />

          {/* Step 1 */}
          <div className="relative z-10 flex-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                1
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Opening line
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-8 sm:pl-0 leading-relaxed">
              Drafts a concise opening hook spaced for the mobile feed fold.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                2
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Visuals
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-8 sm:pl-0 leading-relaxed">
              {formatLabel}.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                3
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Quality check
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-8 sm:pl-0 leading-relaxed">
              Scores the draft and slots it into your next open publishing time.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Visuals for this post (No dashed border, plain editorial notice) */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          Visuals for this post
        </h4>

        {visualFormat === 'image' && (
          <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-4">
            <p className="text-xs font-medium text-slate-900 dark:text-white">
              3 image options per post
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              You'll pick from 3 styles before it goes to review.
            </p>
          </div>
        )}

        {visualFormat === 'carousel' && (
          <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-4">
            <p className="text-xs font-medium text-slate-900 dark:text-white">
              5-slide document deck
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Structured as a swipeable presentation with phase breakdowns and slide tags.
            </p>
          </div>
        )}

        {visualFormat === 'infographic' && (
          <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-4">
            <p className="text-xs font-medium text-slate-900 dark:text-white">
              Metric cards and pillar frameworks
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Extracts key comparison statistics and a 3-step actionable breakdown.
            </p>
          </div>
        )}

        {visualFormat === 'none' && (
          <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-4">
            <p className="text-xs font-medium text-slate-900 dark:text-white">
              Text-only narrative
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Clean spacing focused on narrative rhythm and comments.
            </p>
          </div>
        )}
      </div>

      {/* 4. Hooks that performed well */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
          Hooks that performed well
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HOOK_EXAMPLES.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => onSelectTopic(item.topicText)}
              className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-colors flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {item.metric}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {item.preview}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 pt-1">
                <span>Use this hook</span>
                <ArrowRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
