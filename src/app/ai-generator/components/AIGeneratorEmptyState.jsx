'use client';

import React from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  BarChart2,
  FileText,
  ArrowRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';

const HOOK_FORMULAS = [
  {
    title: 'The Contrarian Shift',
    preview: 'Everyone says X. Here is what actually worked for our team...',
    topicText: 'The conventional wisdom on B2B LinkedIn growth is backwards. Here is what actually worked:',
    tag: 'Virality 96%',
  },
  {
    title: 'Metric Case Breakdown',
    preview: 'We reduced churn by 40% with one simple operational change...',
    topicText: 'How we reduced churn by 40% in 90 days without adding new features:',
    tag: 'Conversion 94%',
  },
  {
    title: '5 Tactical Rules',
    preview: '5 non-obvious principles high-performing engineering teams use...',
    topicText: '5 non-obvious rules that saved our distributed engineering team 12 hours a week:',
    tag: 'High Saves 98%',
  },
];

export default function AIGeneratorEmptyState({
  topic,
  theme,
  reference,
  visualFormat,
  postCount,
  onSelectTopic,
  onGenerate,
}) {
  const formatLabel = {
    image: 'Image Candidates (3 variations per post)',
    carousel: '5-Slide PDF Presentation Decks',
    infographic: 'Visual Metric & Pillar Charts',
    none: 'Text-Only High-Hook Narratives',
  }[visualFormat] || 'Visual Candidates';

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Live Blueprint Card */}
      <div className="card p-5 border border-primary/25 bg-gradient-to-br from-primary/5 via-card to-card shadow-xs">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Pipeline Blueprint Ready
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              {topic || '5 Async Communication Rules'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Theme: <span className="font-semibold text-foreground">{theme || 'Thought Leadership'}</span> · Format:{' '}
              <span className="font-semibold text-foreground capitalize">{visualFormat}</span>
              {reference ? ` · Ref: ${reference.slice(0, 30)}...` : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={onGenerate}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-2 shadow-sm shrink-0"
          >
            <Sparkles size={14} />
            <span>Generate {postCount} Posts Directly</span>
          </button>
        </div>

        {/* Pipeline Stages Mini Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3.5 border-t border-border/70">
          <div className="p-2.5 rounded-lg bg-card border border-border/80 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Zap size={13} className="text-amber-500" />
              <span>1. Hook Synthesis</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Generates high-contrast mobile hooks with curiosity gaps.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border/80 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Layers size={13} className="text-primary" />
              <span>2. Asset Studio</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              {formatLabel}.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border/80 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>3. Quality Audit</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Virality score, clarity check, and direct dispatch to Review Queue.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Format Studio Preview */}
      <div className="card p-4 border border-border flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-primary" />
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
              Active Format Engine: <span className="text-primary capitalize">{visualFormat}</span>
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {postCount} scheduled slot{postCount > 1 ? 's' : ''} reserved
          </span>
        </div>

        {visualFormat === 'image' && (
          <div className="p-3 bg-muted/40 rounded-xl border border-dashed border-border flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ImageIcon size={22} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-foreground">3 Image Candidate Variations per Post</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                AI curates matched visual candidates. In the review queue or LinkedIn preview, you can click through to choose the highest-performing asset.
              </p>
            </div>
          </div>
        )}

        {visualFormat === 'carousel' && (
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers size={22} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-foreground">5-Slide Swipeable Presentation Deck</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Formatted as high-converting LinkedIn carousel PDF document with phase breakdowns, metrics, and actionable slide tags.
              </p>
            </div>
          </div>
        )}

        {visualFormat === 'infographic' && (
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-dashed border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <BarChart2 size={22} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-foreground">Structured Infographic & Metric Cards</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Auto-extracts key comparison statistics (+62% lift) and 3-step pillar frameworks ready for LinkedIn scannability.
              </p>
            </div>
          </div>
        )}

        {visualFormat === 'none' && (
          <div className="p-3 bg-muted/40 rounded-xl border border-dashed border-border flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
              <FileText size={22} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-foreground">Text-Only Pure Narrative Mode</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Zero distractions. Optimizes spacing for the 3-line / 5-line LinkedIn fold to drive maximum comment engagement and profile clicks.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Proven High-Hook Inspiration Formulas */}
      <div className="card p-4 border border-border flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-primary" />
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
              Hook Formulas (Click to inject)
            </h4>
          </div>
          <span className="text-[11px] text-muted-foreground">Proven Top 1% LinkedIn Hooks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {HOOK_FORMULAS.map((f) => (
            <button
              key={f.title}
              type="button"
              onClick={() => onSelectTopic(f.topicText)}
              className="p-3 rounded-lg border border-border bg-card hover:bg-muted/60 text-left transition-all group flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {f.title}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                    {f.tag}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                  {f.preview}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-primary opacity-80 group-hover:opacity-100">
                <span>Use this topic</span>
                <ArrowRight size={10} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
