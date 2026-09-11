'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  X,
  Loader2,
  Image as ImageIcon,
  Layers,
  BarChart2,
  FileText,
  Link as LinkIcon,
  Sparkles,
  ChevronDown,
  Check,
} from 'lucide-react';

const DEFAULT_THEMES = [
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

const POST_COUNTS = [1, 2, 3, 4, 5];
const STORAGE_CUSTOM_PILLARS_KEY = 'linkedflow_custom_pillars';

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
  // Topic suggestions collapsible
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Content pillars list & custom pillar addition
  const [pillarsList, setPillarsList] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_PILLARS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const combined = Array.from(new Set([...DEFAULT_THEMES, ...parsed]));
        return combined;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_THEMES;
  });

  const [pillarDropdownOpen, setPillarDropdownOpen] = useState(false);
  const [isAddingPillar, setIsAddingPillar] = useState(false);
  const [newPillarInput, setNewPillarInput] = useState('');
  const pillarRef = useRef(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (pillarRef.current && !pillarRef.current.contains(e.target)) {
        setPillarDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setPillarDropdownOpen(false);
        setIsAddingPillar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAddCustomPillar = () => {
    const trimmed = newPillarInput.trim();
    if (!trimmed) return;
    if (!pillarsList.includes(trimmed)) {
      const updated = [...pillarsList, trimmed];
      setPillarsList(updated);
      try {
        const customOnly = updated.filter((p) => !DEFAULT_THEMES.includes(p));
        localStorage.setItem(STORAGE_CUSTOM_PILLARS_KEY, JSON.stringify(customOnly));
      } catch {
        // Fallback
      }
    }
    onThemeChange(trimmed);
    setNewPillarInput('');
    setIsAddingPillar(false);
    setPillarDropdownOpen(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_24px_-12px_rgba(0,0,0,0.04)] flex flex-col gap-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
            Post settings
          </h2>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
            Configure topics, pillars, and visual output for this batch.
          </p>
        </div>
        <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Batch parameters
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {/* 1. Topic */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Topic
            </label>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium transition-colors"
              >
                <Sparkles size={11} />
                <span>Need inspiration?</span>
              </button>
              <span className="w-px h-2.5 bg-slate-200 dark:bg-slate-700" />
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-500 dark:text-red-400">
                <span className="size-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
                <span className="leading-none">Required</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              placeholder="e.g. 5 Async communication rules for distributed engineering"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-[13px] text-slate-950 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all pr-9"
            />
            {topic && (
              <button
                type="button"
                onClick={() => onTopicChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded transition-colors"
                title="Clear input"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Clean Collapsible Suggestions */}
          {showSuggestions && (
            <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col gap-1.5 mt-1 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 px-1 mb-0.5">
                <span>Select a topic angle:</span>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {SUGGESTED_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onTopicChange(t);
                      setShowSuggestions(false);
                    }}
                    className="text-left text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-800 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Content Pillar: Simple, Clean Dropdown with Custom Pillar Addition */}
        <div className="flex flex-col gap-2 relative" ref={pillarRef}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Content pillar
            </label>
            <button
              type="button"
              onClick={() => {
                setIsAddingPillar(!isAddingPillar);
                setPillarDropdownOpen(false);
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium transition-colors"
            >
              <Plus size={11} />
              <span>Add custom pillar</span>
            </button>
          </div>

          {/* Clean Selector Trigger */}
          <button
            type="button"
            onClick={() => setPillarDropdownOpen(!pillarDropdownOpen)}
            className="w-full h-11 px-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-[13px] text-slate-950 dark:text-white flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-left"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="size-2.5 rounded-full bg-blue-600 shrink-0" />
              <span className="font-medium truncate">{theme || 'Select pillar'}</span>
            </div>
            <ChevronDown
              size={15}
              className={`text-slate-400 transition-transform ${pillarDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Pillar Options Dropdown */}
          {pillarDropdownOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5 flex flex-col gap-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
              {pillarsList.map((p) => {
                const isSelected = theme === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      onThemeChange(p);
                      setPillarDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{p}</span>
                    {isSelected && <Check size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Add Custom Pillar Input Modal/Row */}
          {isAddingPillar && (
            <div className="mt-1 flex gap-1.5 animate-in fade-in duration-150">
              <input
                type="text"
                value={newPillarInput}
                onChange={(e) => setNewPillarInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomPillar()}
                placeholder="Enter new content pillar name..."
                className="flex-1 h-9.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddCustomPillar}
                className="h-9.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingPillar(false);
                  setNewPillarInput('');
                }}
                className="h-9.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* 3. Source Material */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Source material
            </label>
            <span className="text-[11px] text-slate-400 font-normal">Optional</span>
          </div>
          <div className="relative">
            <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={reference}
              onChange={(e) => onReferenceChange(e.target.value)}
              placeholder="https://notion.so/... or key reference points"
              className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-[13px] text-slate-950 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        {/* 4. Visual Format Grid */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Visual format
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
              {visualFormat} output
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {VISUAL_FORMATS.map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = visualFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onVisualFormatChange(fmt.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/25 dark:border-blue-500 ring-1 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`grid size-6 place-items-center rounded-lg ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Icon size={13} />
                      </span>
                      <span className="text-xs font-semibold text-slate-950 dark:text-white">
                        {fmt.label}
                      </span>
                    </div>

                    <span
                      className={`size-2 rounded-full transition-all ${
                        isSelected ? 'bg-blue-600' : 'bg-transparent'
                      }`}
                    />
                  </div>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {fmt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Notes for this Batch */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-800 dark:text-slate-200">
            Notes for this batch
          </label>
          <div className="relative">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => onNewTopicChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddCustomTopic()}
              placeholder="Add custom angle or directive..."
              className="w-full h-11 pl-3.5 pr-20 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-[13px] text-slate-950 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
            <button
              type="button"
              onClick={onAddCustomTopic}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </div>

          {customTopics.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1 max-h-28 overflow-y-auto">
              {customTopics.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs"
                >
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium text-xs">
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

        {/* 6. Number of Posts: Segmented Selector */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Number of posts
            </label>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            {POST_COUNTS.map((count) => {
              const isSelected = postCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => onPostCountChange(count)}
                  className={`h-9 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Auto-schedule Toggle Card */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Auto-schedule
              </span>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                Slots posts into your open calendar publishing windows.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={useScheduleRules}
                onChange={(e) => onUseScheduleRulesChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {!useScheduleRules && (
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
              <div className="relative">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Start date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Default time
                </label>
                <input
                  type="time"
                  value={defaultTime}
                  onChange={(e) => onDefaultTimeChange(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* 8. Primary Action: Modern Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {isGenerating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Generating {postCount} {postCount === 1 ? 'post' : 'posts'}...</span>
            </>
          ) : (
            <>
              <Sparkles size={14} className="text-blue-400 dark:text-white" />
              <span>Generate {postCount} {postCount === 1 ? 'post' : 'posts'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
