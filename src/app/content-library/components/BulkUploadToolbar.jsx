'use client';

import React from 'react';
import { Upload, Plus, Loader2, Send, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';

export default function BulkUploadToolbar({
  postsCount,
  readyCount,
  outstandingCount,
  bulkGenerating,
  schedulingAll,
  onGenerateAllImages,
  onSetAllFormat,
  onReupload,
  onAddManual,
  onSendForReview,
}) {
  const isAllReady = postsCount > 0 && outstandingCount === 0;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={onReupload}
          className="lib-btn flex items-center gap-1.5 text-sm"
        >
          <Upload size={14} />
          Re-upload file
        </button>
        <button
          type="button"
          onClick={onAddManual}
          className="lib-btn flex items-center gap-1.5 text-sm"
        >
          <Plus size={14} />
          Add row
        </button>

        {/* Readiness Status Chip with Status Dot */}
        {postsCount > 0 && (
          <div
            className={`lib-readiness-chip ${
              isAllReady ? 'lib-readiness-chip-ready' : 'lib-readiness-chip-outstanding'
            }`}
            aria-live="polite"
          >
            <span className="lib-readiness-dot" aria-hidden="true" />
            <span className="lib-readiness-label">
              {isAllReady
                ? `All ${postsCount} posts ready to send`
                : `${outstandingCount} ${
                    outstandingCount === 1 ? 'post' : 'posts'
                  } outstanding`}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Bulk Format Quick Actions — Outlined Neutral Secondaries */}
        <button
          type="button"
          onClick={onGenerateAllImages}
          disabled={bulkGenerating}
          className="lib-btn text-xs h-8 px-2.5 flex items-center gap-1.5 disabled:opacity-50"
          title="Generate AI images for image posts"
        >
          {bulkGenerating ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Sparkles size={12} className="text-[color:var(--text-subtle)]" />
          )}
          <span>Generate all images</span>
        </button>

        {/* Format Setter dropdown / selector covering all three */}
        <select
          className="lib-select text-xs h-8 py-0 pl-2.5 pr-7 font-normal"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onSetAllFormat(e.target.value);
              e.target.value = '';
            }
          }}
          aria-label="Set all format"
        >
          <option value="" disabled>
            Set all format…
          </option>
          <option value="post">Set all to Text only</option>
          <option value="image">Set all to Image</option>
          <option value="pdf">Set all to PDF</option>
        </select>

        {/* Single Primary Action: Send all for review (Matching New Post & Approve & Schedule) */}
        <button
          type="button"
          onClick={onSendForReview}
          disabled={!isAllReady || schedulingAll}
          className="lib-btn lib-btn-primary text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          title={
            isAllReady
              ? 'Submit all posts to Approval Queue for review'
              : `Cannot send: ${outstandingCount} ${outstandingCount === 1 ? 'post is' : 'posts are'} outstanding`
          }
        >
          {schedulingAll ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          <span>
            {isAllReady
              ? 'Send all for review'
              : `Send all for review (${outstandingCount} left)`}
          </span>
        </button>
      </div>
    </div>
  );
}
