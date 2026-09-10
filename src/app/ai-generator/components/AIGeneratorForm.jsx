'use client';

import React from 'react';
import {
  Sparkles,
  Plus,
  X,
  Loader2,
  Image as ImageIcon,
  Layers,
  BarChart2,
  FileText,
  Link as LinkIcon,
  BookOpen,
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
  { id: 'image', label: 'Images', icon: ImageIcon, desc: 'AI visual candidate variations' },
  { id: 'carousel', label: 'Carousels', icon: Layers, desc: 'Multi-slide swipeable deck' },
  { id: 'infographic', label: 'Infographics', icon: BarChart2, desc: 'Key stats & metric cards' },
  { id: 'none', label: 'Text Only', icon: FileText, desc: 'Focused high-hook narrative' },
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
  customTopics,
  newTopic,
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
    <div className="card p-5 flex flex-col gap-4 border border-border shadow-xs">
      <h2 className="text-xs font-700 text-foreground uppercase tracking-wider flex items-center justify-between">
        <span>Generation Settings</span>
        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full normal-case">
          AI Directives
        </span>
      </h2>

      {/* 1. Topic */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-600 text-foreground flex items-center gap-1.5">
          <span>Topic / Directive</span>
          <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="e.g. 5 Async Communication Rules for Distributed Engineering"
          className="input-base text-xs"
        />

        <div className="flex flex-wrap gap-1 mt-1">
          {SUGGESTED_TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTopicChange(t)}
              className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Theme */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-600 text-foreground flex items-center gap-1.5">
          <BookOpen size={12} className="text-primary" />
          <span>Theme / Content Pillar</span>
        </label>
        <input
          type="text"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
          placeholder="e.g. Thought Leadership or B2B SaaS Growth"
          className="input-base text-xs"
        />

        <div className="flex flex-wrap gap-1 mt-1">
          {SUGGESTED_THEMES.map((th) => (
            <button
              key={th}
              type="button"
              onClick={() => onThemeChange(th)}
              className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                theme === th
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Reference Material / Link / Doc */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-600 text-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <LinkIcon size={12} className="text-primary" />
            <span>Reference (Link, Doc, or Source Material)</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
        </label>
        <input
          type="text"
          value={reference}
          onChange={(e) => onReferenceChange(e.target.value)}
          placeholder="e.g. https://linkedin.com/posts/... or Notion spec URL or key notes"
          className="input-base text-xs"
        />
        <p className="text-[10px] text-muted-foreground">
          AI incorporates takeaways and anchors citations to this reference doc or past post.
        </p>
      </div>

      {/* 4. Visual Format Selection */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-border/60">
        <label className="text-xs font-600 text-foreground">Visual Asset Format</label>
        <div className="grid grid-cols-2 gap-2">
          {VISUAL_FORMATS.map((fmt) => {
            const Icon = fmt.icon;
            const isSelected = visualFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onVisualFormatChange(fmt.id)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted/50 text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon size={14} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                  <span className="text-xs font-bold">{fmt.label}</span>
                </div>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {fmt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Custom topics per post */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-border/60">
        <label className="text-xs font-600 text-foreground">Custom Topics per Post</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => onNewTopicChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAddCustomTopic()}
            placeholder="Add specific prompt directive..."
            className="input-base text-xs flex-1"
          />
          <button
            type="button"
            onClick={onAddCustomTopic}
            className="btn-secondary text-xs px-2.5"
          >
            <Plus size={13} />
          </button>
        </div>
        {customTopics.length > 0 && (
          <div className="flex flex-col gap-1 mt-1">
            {customTopics.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2.5 py-1 bg-muted/60 border border-border/60 rounded text-xs"
              >
                <span className="truncate">{t}</span>
                <button
                  type="button"
                  onClick={() => onRemoveCustomTopic(i)}
                  className="text-muted-foreground hover:text-danger"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Batch Output Count */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-600 text-foreground">Batch Output Count</label>
          <span className="text-xs font-bold text-primary">{postCount} posts</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={postCount}
          onChange={(e) => onPostCountChange(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>

      {/* 7. Publishing Schedule Rules */}
      <div className="pt-2 border-t border-border flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-foreground">Follow Publishing Schedule Rules</span>
            <p className="text-[11px] text-muted-foreground">
              Sequentially books slots from your configured weekly windows in Settings.
            </p>
          </div>
          <input
            type="checkbox"
            checked={useScheduleRules}
            onChange={(e) => onUseScheduleRulesChange(e.target.checked)}
            className="rounded border-border text-primary h-4 w-4 shrink-0"
          />
        </div>
      </div>

      {!useScheduleRules && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[11px] font-600 text-muted-foreground block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="input-base text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-600 text-muted-foreground block mb-1">
              Default Time
            </label>
            <input
              type="time"
              value={defaultTime}
              onChange={(e) => onDefaultTimeChange(e.target.value)}
              className="input-base text-xs"
            />
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-xs font-700 shadow-sm mt-1"
      >
        {isGenerating ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>Generating {postCount} Posts...</span>
          </>
        ) : (
          <>
            <Sparkles size={15} />
            <span>Generate {postCount} Posts Directly</span>
          </>
        )}
      </button>
    </div>
  );
}
