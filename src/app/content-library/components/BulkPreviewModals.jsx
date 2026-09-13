'use client';

import React, { useEffect } from 'react';
import { X, Eye, Maximize2, Download, Sparkles, ExternalLink, Calendar } from 'lucide-react';
import ComposerPreview from '@/app/post-creation-composer/components/ComposerPreview';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0a66c2]/10 text-[#0a66c2] flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  LinkedIn Post Preview
                </h3>
                {post.scheduledDate && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-500 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    <Calendar size={10} />
                    {post.scheduledDate} {post.scheduledTime ? `· ${post.scheduledTime}` : ''}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {post.header || 'Bulk Upload Post Preview'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            title="Close preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* LinkedIn Feed Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f4f2ee] scrollbar-thin">
          <ComposerPreview
            content={post.content || ''}
            cta=""
            hashtags={parsedHashtags}
            imageUrl={post.imageUrl || null}
            visualFormat={post.visualFormat || (post.imageUrl ? 'image' : 'none')}
            carouselSlides={post.carouselSlides}
            infographicData={post.infographicData}
            isGenerating={false}
          />
        </div>

        {/* Footer — only Done / Close button */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card">
          <span className="text-xs text-muted-foreground capitalize font-500">
            {post.visualFormat === 'pdf' || post.visualFormat === 'carousel'
              ? '📄 PDF Document Deck'
              : post.imageUrl
                ? '🖼️ Single Image Post'
                : '📝 Post'}
          </span>

          <button onClick={onClose} className="btn-primary text-xs py-1.5 px-4 cursor-pointer">
            Done
          </button>
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
