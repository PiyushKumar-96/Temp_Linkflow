'use client';

import React from 'react';
import {
  Clock,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  Edit3,
  CheckSquare,
  Eye,
  Layers,
  BarChart2,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageCarouselSelector from '@/components/ui/ImageCarouselSelector';
import { CarouselVisual, InfographicVisual } from '@/components/visuals';
import { POST_STATUS } from '@/lib/post-status';

export default function GeneratedPostCard({
  post,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
  onSelectImageIndex,
  onSendToQueue,
  onOpenPreview,
}) {
  const visualFormat = post.visualFormat || (post.imageUrl ? 'image' : 'none');
  const isReady = post.status === POST_STATUS.AWAITING_REVIEW;
  const isGenerating = post.status === POST_STATUS.GENERATING;
  const isAutoReview = post.status === POST_STATUS.AUTO_REVIEW;

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all overflow-hidden shadow-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        {/* Author / Slot / Status Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700">
              {post.authorInitials || 'SR'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white truncate">
                  {post.author || 'Sarah Reeves'}
                </span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500 dark:text-slate-400 truncate">
                  {post.authorRole || 'Content Strategist'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock size={11} />
                <span>Slot: {post.scheduledDate} at {post.scheduledTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {post.qualityAudit && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                Score {post.qualityAudit.score} &bull; Grade {post.qualityAudit.grade}
              </span>
            )}
            <button
              type="button"
              onClick={onRemove}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Remove draft"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Post Title & Status Indicator */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1 text-xs">
              <span className="font-medium text-slate-500">
                Post #{index + 1}
              </span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="text-slate-600 dark:text-slate-400">
                {post.category || 'Thought Leadership'}
              </span>

              {isGenerating && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Loader2 size={11} className="animate-spin text-blue-600" /> Drafting...
                </span>
              )}
              {isAutoReview && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Loader2 size={11} className="animate-spin text-blue-600" /> Reviewing...
                </span>
              )}
              {isReady && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 size={11} /> Ready for review
                </span>
              )}
            </div>

            <h3
              onClick={() => onOpenPreview(post)}
              className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.title}
            </h3>
          </div>

          {/* Format Thumbnail / Indicator */}
          <div
            onClick={() => onOpenPreview(post)}
            className="cursor-pointer group shrink-0"
            title="Click to preview on LinkedIn"
          >
            {visualFormat === 'image' && post.imageUrl ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Eye size={14} />
                </div>
              </div>
            ) : visualFormat === 'carousel' ? (
              <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-600 dark:text-slate-300">
                <Layers size={16} />
                <span className="text-[9px] mt-0.5 font-medium">Deck</span>
              </div>
            ) : visualFormat === 'infographic' ? (
              <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-600 dark:text-slate-300">
                <BarChart2 size={16} />
                <span className="text-[9px] mt-0.5 font-medium">Chart</span>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-500">
                <FileText size={16} />
                <span className="text-[9px] mt-0.5 font-medium">Text</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Snippet */}
        <p
          onClick={() => onOpenPreview(post)}
          className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {post.content}
        </p>

        {/* Citations & Expand Toggle */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
          {post.reference && (
            <span className="flex items-center gap-1 text-[11px] truncate max-w-[200px]">
              <LinkIcon size={10} />
              Source: {post.reference}
            </span>
          )}

          {(post.hashtags || []).slice(0, 2).map((h) => (
            <span key={h} className="text-blue-600 dark:text-blue-400 text-[11px]">
              {h}
            </span>
          ))}

          <button
            type="button"
            onClick={onToggleExpand}
            className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <span>{isExpanded ? 'Hide details' : 'Show details'}</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20 flex flex-col gap-3">
          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              Draft text
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
              {post.content}
            </p>
          </div>

          {visualFormat === 'image' && post.candidateImages?.length > 0 && (
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <ImageCarouselSelector
                images={post.candidateImages}
                selectedIndex={post.selectedImageIndex ?? 0}
                onSelectIndex={onSelectImageIndex}
                title="Select image option (3 styles)"
              />
            </div>
          )}

          {visualFormat === 'carousel' && post.carouselSlides?.length > 0 && (
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-900 dark:text-white block mb-2">
                5-slide deck preview
              </span>
              <CarouselVisual slides={post.carouselSlides} isEditable={false} />
            </div>
          )}

          {visualFormat === 'infographic' && post.infographicData && (
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-900 dark:text-white block mb-2">
                Infographic preview
              </span>
              <InfographicVisual data={post.infographicData} isEditable={false} />
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenPreview(post)}
            className="h-7 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Eye size={12} className="text-blue-600 dark:text-blue-400" />
            <span>Preview</span>
          </button>
          <Link
            to={`/post-creation-composer?id=${post.id}&mode=edit`}
            className="h-7 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
          >
            <Edit3 size={12} />
            <span>Edit in composer</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => onSendToQueue(post.id)}
          className="h-7 px-3 rounded-md bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <CheckSquare size={12} />
          <span>Send to approval queue</span>
        </button>
      </div>
    </div>
  );
}
