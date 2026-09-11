'use client';

import React from 'react';
import {
  Plus,
  X,
  Loader2,
  Image as ImageIcon,
  Layers,
  BarChart2,
  FileText,
} from 'lucide-react';

const SUGGESTED_THEMES = [
  'Thought Leadership',
  'B2B SaaS Growth',
  'Founder Journey',
  'Culture & Remote Work',
  'AI & Engineering',
];

const SUGGESTED_TOPICS = [
  '5 Async Communication Rules',
  'Why B2B Companies Fail on LinkedIn',
  'From $0 to $1M ARR: What Worked',
  'How to Reduce Churn by 40%',
];

const VISUAL_FORMATS = [
  { id: 'image', label: 'Images', icon: ImageIcon, desc: '3 image options per post' },
  { id: 'carousel', label: 'Carousels', icon: Layers, desc: '5-slide document deck' },
  { id: 'infographic', label: 'Infographics', icon: BarChart2, desc: 'Metric cards & pillars' },
  { id: 'none', label: 'Text only', icon: FileText, desc: 'Plain narrative layout' },
];

export default function AIGeneratorForm({
  topic,
  onTopicChange,
  theme,
  onThemeChange,
  reference,
  onReferenceChange,
  visualFormat,
  onVisualFormatChange,
  customTopics = [],
  newTopic = '',
  onNewTopicChange,
  onAddCustomTopic,
  onRemoveCustomTopic,
  postCount,
  onPostCountChange,
  useScheduleRules,
  onUseScheduleRulesChange,
  startDate,
  onStartDateChange,
  defaultTime,
  onDefaultTimeChange,
  isGenerating,
  onGenerate,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 flex flex-col gap-5 transition-all">
      {/* Panel header: quiet and editorial */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Post settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Set the topic, pillar, and visual style for this batch.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* 1. Topic */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Topic</span>
            <span className="text-[11px] text-slate-400 font-normal">Required</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g. 5 Async communication rules for distributed engineering"
            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
          />

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 mr-0.5">Suggestions:</span>
            {SUGGESTED_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTopicChange(t)}
                className="text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Content pillar */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Content pillar
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_THEMES.map((th) => {
              const isSelected = theme === th;
              return (
                <button
                  key={th}
                  type="button"
                  onClick={() => onThemeChange(th)}
                  className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {th}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Source material */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Source material</span>
            <span className="text-[11px] text-slate-400 font-normal">Optional</span>
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
            placeholder="e.g. https://notion.so/spec or key bullet points"
            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
          />
        </div>

        {/* 4. Visual format */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Visual format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VISUAL_FORMATS.map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = visualFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onVisualFormatChange(fmt.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className="text-slate-500 dark:text-slate-400" />
                    <span className="text-xs font-medium text-slate-900 dark:text-white">
                      {fmt.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {fmt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Notes for this batch */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Notes for this batch
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => onNewTopicChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddCustomTopic()}
              placeholder="Add specific angle or prompt note..."
              className="flex-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
            <button
              type="button"
              onClick={onAddCustomTopic}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </div>

          {customTopics.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              {customTopics.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <span className="truncate text-slate-700 dark:text-slate-300">
                    #{i + 1}: {t}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveCustomTopic(i)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Number of posts */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Number of posts
            </label>
            <span className="text-xs font-medium text-slate-900 dark:text-white">
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={postCount}
            onChange={(e) => onPostCountChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
        </div>

        {/* 7. Auto-schedule */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div>
            <span className="text-xs font-medium text-slate-900 dark:text-white block">
              Auto-schedule
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Slots posts into your open calendar publishing windows.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={useScheduleRules}
              onChange={(e) => onUseScheduleRulesChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {!useScheduleRules && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                Default time
              </label>
              <input
                type="time"
                value={defaultTime}
                onChange={(e) => onDefaultTimeChange(e.target.value)}
                className="w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Primary Action: Single Generate button for the entire page */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full h-10 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
        >
          {isGenerating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Generating {postCount} {postCount === 1 ? 'post' : 'posts'}...</span>
            </>
          ) : (
            <span>Generate {postCount} {postCount === 1 ? 'post' : 'posts'}</span>
          )}
        </button>
      </div>
    </div>
  );
}
