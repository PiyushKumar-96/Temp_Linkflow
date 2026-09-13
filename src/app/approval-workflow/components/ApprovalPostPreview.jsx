'use client';

import React, { useState } from 'react';
import {
  Globe,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
} from 'lucide-react';
import ProgressRing from '@/components/ui/ProgressRing';
import { CarouselVisual, InfographicVisual } from '@/components/visuals';

export default function ApprovalPostPreview({
  post,
  authorAvatar,
  targetSlotText,
  qualityAudit,
  candidateImages,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {/* 1. Compact Sleek AI Quality Bar */}
      <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 p-3 flex flex-col gap-2 transition-all">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <ProgressRing
              value={(qualityAudit.score || 0) / 100}
              size={32}
              stroke={3.5}
              tone={(qualityAudit.score || 0) >= 80 ? 'green' : 'amber'}
            >
              <span className="text-[10.5px] font-bold tabular-nums text-slate-800 dark:text-slate-100">
                {qualityAudit.score || 0}
              </span>
            </ProgressRing>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  AI Quality Grade {qualityAudit.grade || 'A'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800">
                  {qualityAudit.verdict || 'Ready for Review'}
                </span>
              </div>
            </div>
          </div>

          {/* Compact sub-metrics & optional suggestions toggle */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Hook{' '}
              <strong className="text-slate-700 dark:text-slate-200 font-bold">
                {(qualityAudit.hookScore / 10).toFixed(1)}
              </strong>
            </span>
            <span>·</span>
            <span>
              Clarity{' '}
              <strong className="text-slate-700 dark:text-slate-200 font-bold">
                {(qualityAudit.clarityScore / 10).toFixed(1)}
              </strong>
            </span>
            <span>·</span>
            <span>
              Voice{' '}
              <strong className="text-slate-700 dark:text-slate-200 font-bold">
                {(qualityAudit.voiceScore / 10).toFixed(1)}
              </strong>
            </span>

            {qualityAudit.issues?.length > 0 && (
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="ml-1 text-[11px] text-[#0a66c2] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{qualityAudit.issues.length} Suggestions</span>
                {showSuggestions ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        </div>

        {/* Expandable Suggestions (only shown when toggled) */}
        {showSuggestions && qualityAudit.issues?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-1.5 animate-in fade-in-50 duration-200">
            {qualityAudit.issues.map((issue, idx) => (
              <div
                key={`issue-${idx}`}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs flex items-start justify-between gap-2"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">
                    {issue.type}:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {issue.suggestion || issue.message}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 shrink-0">
                  {issue.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Authentic LinkedIn Post Preview Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 flex flex-col gap-4">
        {/* Post Author Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt={post.author}
              className="w-11 h-11 rounded-full object-cover border border-slate-100 dark:border-slate-800 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {post.author}
                </h4>
                <span className="text-xs text-slate-400 font-normal">• 1st</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {post.authorRole || 'Content Strategist'}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Scheduled for {targetSlotText}</span>
                <span>•</span>
                <Globe size={11} />
              </p>
            </div>
          </div>
        </div>

        {/* Full Continuous Post Copy */}
        <div className="text-[13.5px] leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap font-normal">
          {post.content}
        </div>

        {/* Target Hashtags */}
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-[#0a66c2] hover:underline cursor-pointer"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}

        {/* Attached Visual Asset Preview */}
        {post.visualFormat && post.visualFormat !== 'none' && (
          <div className="mt-2 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
            {post.visualFormat === 'carousel' ? (
              <CarouselVisual slides={post.carouselSlides || post.slides} isEditable={false} />
            ) : post.visualFormat === 'infographic' ? (
              <InfographicVisual data={post.infographicData} isEditable={false} />
            ) : (
              <img
                src={
                  post.imageUrl ||
                  candidateImages?.[0]?.url ||
                  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80'
                }
                alt={post.title || 'Post attachment'}
                className="w-full max-h-[460px] object-cover bg-slate-100 dark:bg-slate-800 select-none"
                loading="lazy"
              />
            )}
          </div>
        )}

        {/* LinkedIn Interaction Mock Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 hover:text-[#0a66c2] cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <ThumbsUp size={14} /> Like
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#0a66c2] cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <MessageSquare size={14} /> Comment
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#0a66c2] cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <Repeat2 size={14} /> Repost
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#0a66c2] cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <Send size={14} /> Send
          </span>
        </div>
      </div>
    </div>
  );
}
