'use client';

import React, { useEffect } from 'react';
import { X, Edit3, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import ComposerPreview from '@/app/post-creation-composer/components/ComposerPreview';
import '@/styles/composer.css';

/**
 * LinkedIn Feed Preview Modal for AI Generator.
 * Uses strict design tokens and secondary styling.
 */
export default function LinkedInPreviewModal({ isOpen, onClose, post, onSendToQueue }) {
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
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[color:var(--card)] border border-[color:var(--border)] rounded-[var(--radius-card)] shadow-xl overflow-hidden flex flex-col max-h-[92vh] z-10 text-[color:var(--text)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[color:var(--border)] bg-[color:var(--card)]">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[color:var(--text)] truncate">
              Post preview
            </h3>
            <p className="text-xs text-[color:var(--text-muted)] truncate">
              {post.title || 'Draft post'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-icon-btn)] text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-[color:var(--chip)] transition-colors cursor-pointer"
            title="Close preview"
            aria-label="Close preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Preview Body (Rendering ComposerPreview scoped in .cmp) */}
        <div className="cmp flex-1 overflow-y-auto p-4 sm:p-6 bg-[color:var(--page-bg)] scrollbar-thin">
          <ComposerPreview
            composedText={post.content || ''}
            hasBody={Boolean((post.content || '').trim())}
            device="mobile"
            imageUrl={post.imageUrl || null}
            visualFormat={post.visualFormat || (post.imageUrl ? 'image' : 'none')}
            carouselSlides={post.carouselSlides}
            infographicData={post.infographicData}
            isGenerating={false}
          />
        </div>

        {/* Modal Footer Actions (Secondary styling only) */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[color:var(--border)] bg-[color:var(--card)] flex-wrap gap-2">
          <Link
            to={`/post-creation-composer?id=${post.id}&mode=edit`}
            className="h-8 px-3 rounded-[var(--radius-input)] border border-[color:var(--border)] bg-[color:var(--card)] hover:border-[color:var(--track)] text-xs font-medium text-[color:var(--text)] flex items-center gap-1.5 transition-colors"
            onClick={onClose}
          >
            <Edit3 size={12} />
            <span>Edit in composer</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded-[var(--radius-input)] border border-[color:var(--border)] bg-[color:var(--card)] hover:border-[color:var(--track)] text-xs font-medium text-[color:var(--text)] transition-colors cursor-pointer"
            >
              Close
            </button>
            {onSendToQueue && (
              <button
                type="button"
                onClick={() => {
                  onSendToQueue(post.id, post);
                  onClose();
                }}
                className="h-8 px-3.5 rounded-[var(--radius-input)] border border-[color:var(--border)] bg-[color:var(--chip)] hover:bg-[color:var(--track)] text-[color:var(--text)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send size={12} />
                <span>Send to queue</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
