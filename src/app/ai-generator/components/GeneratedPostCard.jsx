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
  Image as ImageIcon,
  Layers,
  BarChart2,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/ui/StatusBadge';
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

  return (
    <div className="card overflow-hidden transition-all border border-border shadow-xs hover:border-border/80">
      <div className="flex items-start gap-3 p-4">
        {/* Visual Format Thumbnail / Indicator */}
        <div
          onClick={() => onOpenPreview(post)}
          className="cursor-pointer group relative shrink-0"
          title="Click to preview on LinkedIn"
        >
          {visualFormat === 'image' && post.imageUrl ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Eye size={16} />
              </div>
            </div>
          ) : visualFormat === 'carousel' ? (
            <div className="w-16 h-16 rounded-lg border border-primary/20 bg-primary/10 flex flex-col items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
              <Layers size={20} />
              <span className="text-[10px] font-bold mt-1">Carousel</span>
            </div>
          ) : visualFormat === 'infographic' ? (
            <div className="w-16 h-16 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-600 group-hover:bg-emerald-500/15 transition-colors">
              <BarChart2 size={20} />
              <span className="text-[10px] font-bold mt-1">Infographic</span>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg border border-border bg-muted/60 flex flex-col items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
              <FileText size={20} />
              <span className="text-[10px] font-semibold mt-1">Text Only</span>
            </div>
          )}
        </div>

        {/* Content & Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-700 text-foreground">
              Post #{index + 1}: {post.title}
            </span>
            <StatusBadge status={post.status} size="sm" />

            {post.category && (
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-muted text-muted-foreground">
                {post.category}
              </span>
            )}

            {post.status === POST_STATUS.GENERATING && (
              <span className="text-[10px] text-indigo-600 font-mono flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> Drafting hook & narrative
              </span>
            )}
            {post.status === POST_STATUS.AUTO_REVIEW && (
              <span className="text-[10px] text-purple-600 font-mono flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> Automated quality audit
              </span>
            )}
            {post.status === POST_STATUS.AWAITING_REVIEW && (
              <span className="text-[10px] text-emerald-600 font-600 flex items-center gap-1">
                <CheckCircle2 size={10} /> Ready for Review
              </span>
            )}
          </div>

          <p
            onClick={() => onOpenPreview(post)}
            className="text-xs text-muted-foreground line-clamp-2 leading-relaxed cursor-pointer hover:text-foreground transition-colors"
          >
            {post.content}
          </p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock size={10} />
              Slot: {post.scheduledDate} at {post.scheduledTime}
            </span>

            {post.reference && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 truncate max-w-[180px]">
                  <LinkIcon size={10} />
                  Ref: {post.reference}
                </span>
              </>
            )}

            <span className="text-muted-foreground">·</span>
            {(post.hashtags || []).slice(0, 3).map((h) => (
              <span key={h} className="text-[11px] text-primary font-500">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onOpenPreview(post)}
            className="p-1.5 rounded-lg hover:bg-muted text-primary transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Open LinkedIn Live Preview"
          >
            <Eye size={14} />
            <span className="hidden sm:inline text-[11px]">Preview</span>
          </button>
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            title="Expand details"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-danger transition-colors"
            title="Remove item"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 flex flex-col gap-3 bg-muted/10">
          <p className="text-xs text-foreground whitespace-pre-line leading-relaxed bg-card p-3 rounded-lg border border-border">
            {post.content}
          </p>

          {/* Visual format preview in accordion */}
          {visualFormat === 'image' && post.candidateImages?.length > 0 && (
            <div className="mt-1">
              <ImageCarouselSelector
                images={post.candidateImages}
                selectedIndex={post.selectedImageIndex ?? 0}
                onSelectIndex={onSelectImageIndex}
                title="Select Visual Variation (3 AI Options)"
              />
            </div>
          )}

          {visualFormat === 'carousel' && post.carouselSlides?.length > 0 && (
            <div className="p-3 bg-card rounded-lg border border-border">
              <span className="text-xs font-semibold text-foreground block mb-2">Carousel Deck Preview</span>
              <CarouselVisual slides={post.carouselSlides} isEditable={false} />
            </div>
          )}

          {visualFormat === 'infographic' && post.infographicData && (
            <div className="p-3 bg-card rounded-lg border border-border">
              <span className="text-xs font-semibold text-foreground block mb-2">Infographic Breakdown</span>
              <InfographicVisual data={post.infographicData} isEditable={false} />
            </div>
          )}

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenPreview(post)}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-primary"
              >
                <Eye size={12} />
                <span>LinkedIn Feed Preview</span>
              </button>
              <Link
                to={`/post-creation-composer?id=${post.id}&mode=edit`}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Edit3 size={12} />
                <span>Edit in Composer</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => onSendToQueue(post.id)}
              className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-sm"
            >
              <CheckSquare size={12} />
              <span>Send to Approval Queue</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
