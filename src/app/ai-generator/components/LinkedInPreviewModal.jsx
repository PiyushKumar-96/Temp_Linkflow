'use client';

import React, { useEffect } from 'react';
import { X, Edit3, CheckSquare } from 'lucide-react';
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
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              Post preview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {post.title || 'Draft post'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Preview Body (Rendering ComposerPreview) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f3f2ef] dark:bg-slate-950/80 scrollbar-thin">
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
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-wrap gap-2">
          <Link
            to={`/post-creation-composer?id=${post.id}&mode=edit`}
            className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            onClick={onClose}
          >
            <Edit3 size={12} />
            <span>Edit in composer</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Close
            </button>
            {onSendToQueue && (
              <button
                onClick={() => {
                  onSendToQueue(post.id);
                  onClose();
                }}
                className="h-8 px-3.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <CheckSquare size={12} />
                <span>Send to approval queue</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
