'use client';

import React, { useEffect } from 'react';
import { X, Send, Edit3, CheckSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ComposerPreview from '@/app/post-creation-composer/components/ComposerPreview';

/**
 * LinkedIn Feed Preview Modal for AI Generator.
 * Reuses the authentic LinkedIn preview card from ComposerPreview.
 */
export default function LinkedInPreviewModal({
  isOpen,
  onClose,
  post,
  onSendToQueue,
}) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#0a66c2]/10 text-[#0a66c2] flex items-center justify-center shrink-0">
              <Sparkles size={15} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                LinkedIn Feed Preview
              </h3>
              <p className="text-[11px] text-muted-foreground truncate">
                {post.title || 'Generated AI LinkedIn Post'}
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

        {/* Scrollable Preview Body (Rendering ComposerPreview) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f4f2ee] scrollbar-thin">
          <ComposerPreview
            content={post.content || ''}
            cta={post.cta || ''}
            hashtags={post.hashtags || []}
            imageUrl={post.imageUrl || null}
            visualFormat={post.visualFormat || (post.imageUrl ? 'image' : 'none')}
            carouselSlides={post.carouselSlides}
            infographicData={post.infographicData}
            isGenerating={false}
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Link
              to={`/post-creation-composer?id=${post.id}&mode=edit`}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              onClick={onClose}
            >
              <Edit3 size={13} />
              <span>Open in Composer</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Close
            </button>
            {onSendToQueue && (
              <button
                onClick={() => {
                  onSendToQueue(post.id);
                  onClose();
                }}
                className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-sm"
              >
                <CheckSquare size={13} />
                <span>Send to Approval Queue</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
