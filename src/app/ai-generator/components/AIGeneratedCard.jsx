'use client';

import React from 'react';
import { Eye, Send, RotateCw, X, Loader2, Image as ImageIcon, Layers, BarChart2, FileText } from 'lucide-react';

export default function AIGeneratedCard({
  post,
  onDismiss,
  onPreview,
  onSendToQueue,
  onRetry,
}) {
  const {
    state,
    title,
    content,
    visualFormat,
    scheduledDate,
    scheduledTime,
    pillar,
    topic,
    imageUrl,
    carouselSlides,
    failureReason,
  } = post;

  // Format label & icon helper
  const formatIcon =
    visualFormat === 'image' ? (
      <ImageIcon size={11} />
    ) : visualFormat === 'carousel' ? (
      <Layers size={11} />
    ) : visualFormat === 'infographic' ? (
      <BarChart2 size={11} />
    ) : (
      <FileText size={11} />
    );

  const formatLabel =
    visualFormat === 'image'
      ? 'Image'
      : visualFormat === 'carousel'
        ? 'Carousel'
        : visualFormat === 'infographic'
          ? 'Infographic'
          : 'Text only';

  // 1. FAILED State
  if (state === 'failed') {
    return (
      <div className="aig-card" data-state="failed">
        <div className="aig-card-failed">
          <h4 className="aig-failed-title">Generation failed</h4>
          <p className="aig-failed-msg">
            {failureReason || 'Could not synthesize post draft. API timeout.'}
          </p>
          <button
            type="button"
            onClick={() => onRetry(post.id)}
            className="aig-btn-retry"
          >
            <RotateCw size={13} />
            <span>Retry post</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. GENERATING State (Skeleton)
  if (state === 'generating') {
    return (
      <div className="aig-card">
        <div className="aig-card-generating">
          <div className="aig-generating-head">
            <Loader2 size={14} className="animate-spin text-[color:var(--aig-brand)]" />
            <span>Drafting post…</span>
          </div>
          <div className="aig-skel-band" />
          <div className="aig-skel-line" style={{ width: '85%' }} />
          <div className="aig-skel-line" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  // 3. GENERATED State (Library card look)
  const pillarKey =
    pillar === 'Case Studies'
      ? 'case'
      : pillar === 'Engineering Culture'
        ? 'engineering'
        : pillar === 'Industry Insights'
          ? 'industry'
          : 'thought';

  // Extract short first sentence for text band preview to ensure it differs from title and body excerpt
  const hookSummary = content.split('\n')[0] || content;

  return (
    <div className="aig-card">
      {/* Media Band matching Library */}
      <div className="aig-band">
        {visualFormat === 'image' && imageUrl ? (
          <img src={imageUrl} alt={title} className="aig-band-img" />
        ) : visualFormat === 'carousel' ? (
          <div className="aig-band-carousel">
            <span className="aig-band-slide-count">
              {carouselSlides?.length || 5} slides
            </span>
            <div className="aig-band-carousel-title">{carouselSlides?.[1]?.headline || title}</div>
          </div>
        ) : visualFormat === 'infographic' ? (
          <div className="aig-band-text" data-pillar={pillarKey}>
            <div className="aig-band-hook">+62% Lift &bull; {pillar}</div>
          </div>
        ) : (
          <div className="aig-band-text" data-pillar={pillarKey}>
            <div className="aig-band-hook">{hookSummary}</div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="aig-card-body">
        {/* Group Context Chips: Format & Pillar/Topic for clear legibility in flat list */}
        <div className="aig-card-tags">
          <span className="aig-tag-format">
            {formatIcon}
            <span>{formatLabel}</span>
          </span>
          {topic && topic !== formatLabel && (
            <span className="aig-tag-topic" title={topic}>
              {topic}
            </span>
          )}
        </div>

        <h4 className="aig-card-title">{title}</h4>
        <p className="aig-card-content">{content}</p>
        <div className="aig-card-meta">
          <span>{pillar}</span>
          <span>&bull;</span>
          <span>
            {scheduledDate} {scheduledTime}
          </span>
        </div>
      </div>

      {/* Footer Actions (Secondary weights only) */}
      <div className="aig-card-footer">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(post)}
            className="aig-btn-secondary"
            title="Preview LinkedIn post"
          >
            <Eye size={12} />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => onSendToQueue(post.id)}
            className="aig-btn-secondary"
            title="Send to approval queue"
          >
            <Send size={12} />
            <span>Send to queue</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(post.id)}
          className="aig-btn-dismiss"
          title="Dismiss draft"
          aria-label="Dismiss draft"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
