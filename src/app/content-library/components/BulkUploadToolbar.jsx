'use client';

import React from 'react';
import { Upload, Plus, Loader2, Send, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';

export default function BulkUploadToolbar({
  postsCount,
  counts,
  bulkGenerating,
  schedulingAll,
  onGenerateAllImages,
  onSetAllPdf,
  onReupload,
  onAddManual,
  onSendForReview,
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onReupload} className="btn-secondary flex items-center gap-1.5 text-sm">
          <Upload size={14} />
          Re-upload File
        </button>
        <button onClick={onAddManual} className="btn-secondary flex items-center gap-1.5 text-sm">
          <Plus size={14} />
          Add Row
        </button>

        {/* Media Breakdown: Images & PDFs only */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50 flex-wrap">
          <span className="font-600 text-foreground">{postsCount} posts:</span>
          <span className="text-emerald-600 font-600 flex items-center gap-1">
            <ImageIcon size={11} />
            {counts.images} Images
          </span>
          <span>·</span>
          <span className="text-red-600 font-600 flex items-center gap-1">
            <FileText size={11} />
            {counts.pdfs} PDFs
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Bulk Format Quick Actions */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={onGenerateAllImages}
            disabled={bulkGenerating}
            className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 hover:text-emerald-600 font-600 cursor-pointer disabled:opacity-50"
            title="Generate AI images for image posts"
          >
            {bulkGenerating ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Sparkles size={11} className="text-emerald-500" />
            )}
            <span>Generate All Images</span>
          </button>
          <button
            type="button"
            onClick={onSetAllPdf}
            disabled={bulkGenerating}
            className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 hover:text-red-600 font-600 cursor-pointer disabled:opacity-50"
            title="Switch all posts to PDF format"
          >
            <FileText size={11} className="text-red-500" />
            <span>Set All to PDF</span>
          </button>
        </div>

        {/* Send All for Review Button (Replaces Schedule All) */}
        <button
          onClick={onSendForReview}
          disabled={schedulingAll}
          className="btn-primary flex items-center gap-1.5 text-sm cursor-pointer shadow-sm font-600"
          title="Submit all posts to Approval Queue for review"
        >
          {schedulingAll ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          <span>Send All for Review</span>
        </button>
      </div>
    </div>
  );
}
