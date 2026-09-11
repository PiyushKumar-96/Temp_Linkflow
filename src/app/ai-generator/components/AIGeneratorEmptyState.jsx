'use client';

import React from 'react';
import {
  ArrowRight,
  PenLine,
  Image as ImageIcon,
  Layers,
  BarChart2,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

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

  const VisualIcon = {
    image: ImageIcon,
    carousel: Layers,
    infographic: BarChart2,
    none: FileText,
  }[visualFormat] || ImageIcon;

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 flex flex-col gap-7 transition-all">
      {/* 1. Hero Content Preview: Boldest item on the page */}
      <div>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2">
          {topic?.trim() ? 'Preview headline' : 'General overview'}
        </p>

        <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white leading-tight">
          {topic?.trim() || 'Turn your core insights into high-performing LinkedIn posts'}
        </h3>

        <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
          <span>
            Pillar:{' '}
            <strong className="font-medium text-slate-700 dark:text-slate-200">
              {topic?.trim() ? (theme || 'General') : 'General'}
            </strong>
          </span>
          <span>&bull;</span>
          <span>
            Format:{' '}
            <strong className="font-medium text-slate-700 dark:text-slate-200 capitalize">
              {topic?.trim() ? visualFormat : 'General'}
            </strong>
          </span>
          {topic?.trim() && reference && (
            <>
              <span>&bull;</span>
              <span className="truncate max-w-[260px]">Source: {reference}</span>
            </>
          )}
        </div>
      </div>

      {/* 2. Modern Connected Generation Pipeline */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-600" />
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
              Generation pipeline
            </h4>
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            3-stage editorial flow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Step 1: Opening line */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-3.5 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="size-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/80 dark:border-blue-900/50">
                <PenLine size={14} />
              </span>
              <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-2 py-0.5 rounded-md">
                Step 01
              </span>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                Opening hook
              </h5>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Drafts a concise opening hook formatted for the mobile feed fold to maximize engagement.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Mobile fold optimized</span>
            </div>
          </div>

          {/* Step 2: Visuals */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-3.5 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/80 dark:border-indigo-900/50">
                <VisualIcon size={14} />
              </span>
              <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-2 py-0.5 rounded-md">
                Step 02
              </span>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                Visual synthesis
              </h5>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {formatLabel}. Custom styled to reinforce the core narrative topic.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="size-1.5 rounded-full bg-blue-500" />
              <span className="capitalize">{visualFormat} asset</span>
            </div>
          </div>

          {/* Step 3: Quality check */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-3.5 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="size-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/80 dark:border-emerald-900/50">
                <ShieldCheck size={14} />
              </span>
              <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-2 py-0.5 rounded-md">
                Step 03
              </span>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                Quality & Scheduling
              </h5>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Scores clarity and readability, then queues into your next calendar publishing slot.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span>Automated schedule</span>
            </div>
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
