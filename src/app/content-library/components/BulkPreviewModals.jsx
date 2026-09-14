'use client';

import React, { useEffect } from 'react';
import { X, Eye, Maximize2, Download, Sparkles, ExternalLink, Calendar } from 'lucide-react';
import ComposerPreview from '@/app/post-creation-composer/components/ComposerPreview';

import '@/styles/composer.css';

/**
 * LinkedIn Feed Preview Modal for Bulk Upload posts.
 */
export function BulkPostPreviewModal({ isOpen, onClose, post, onViewImage }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const parsedHashtags =
    typeof post.hashtags === 'string'
      ? post.hashtags.split(/\s+/).filter(Boolean)
      : Array.isArray(post.hashtags)
        ? post.hashtags
        : [];

  const hashtagsSuffix = parsedHashtags.length > 0 ? `\n\n${parsedHashtags.join(' ')}` : '';
  const fullComposedText = `${post.content || ''}${hashtagsSuffix}`.trim();

  // Map visual format
  const rawFormat = post.visualFormat || (post.imageUrl ? 'image' : 'none');
  const normalizedFormat =
    rawFormat === 'pdf' ? 'pdf' : rawFormat === 'carousel' ? 'carousel' : rawFormat === 'image' ? 'image' : rawFormat === 'infographic' ? 'infographic' : 'none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[color:var(--card)] border border-[color:var(--border)] rounded-[var(--radius-card)] shadow-xl overflow-hidden flex flex-col max-h-[92vh] z-10 text-[color:var(--text)]">
        {/* Top-Right Modal Close Control */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-[var(--radius-icon-btn)] text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-[color:var(--chip)] transition-colors cursor-pointer"
          title="Close preview"
          aria-label="Close preview"
        >
          <X size={16} />
        </button>

        {/* LinkedIn Feed Preview (Scoped in .cmp container) */}
        <div className="cmp flex-1 overflow-y-auto p-4 sm:p-6 bg-[color:var(--page-bg)] scrollbar-thin">
          <ComposerPreview
            composedText={fullComposedText}
            hasBody={Boolean(fullComposedText)}
            device="mobile"
            imageUrl={post.imageUrl || null}
            visualFormat={normalizedFormat}
            carouselSlides={post.carouselSlides}
            infographicData={post.infographicData}
            isGenerating={false}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Image Lightbox Modal for AI-generated or uploaded post images.
 */
export function BulkImageModal({ isOpen, onClose, image }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !image || !image.url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between px-4 py-2.5 mb-2 bg-black/60 text-white rounded-xl backdrop-blur-md border border-white/10">
          <div className="min-w-0 pr-3">
            <h4 className="text-sm font-600 truncate">{image.title || 'Generated Visual'}</h4>
            <p className="text-[11px] text-white/70">AI-Generated LinkedIn Post Media</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-xs"
              title="Open full size in new tab"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Open</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Close image view"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Image Frame */}
        <div className="relative bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-2 max-h-[80vh] flex items-center justify-center">
          <img
            src={image.url}
            alt={image.title || 'Full Post Image'}
            className="max-h-[74vh] max-w-full rounded-xl object-contain shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
