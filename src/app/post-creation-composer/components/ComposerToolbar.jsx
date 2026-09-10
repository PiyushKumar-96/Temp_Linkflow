'use client';

import React from 'react';
import { Sparkles, Save, Send, Clock, GitCommit, ArrowLeft, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComposerToolbar({
  showAIPanel,
  onToggleAI,
  onSaveDraft,
  onSubmitReview,
  onSchedule,
  onOpenHistory,
  hasContent,
  isEditMode = false,
  returnUrl = '/approval-workflow',
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* AI Panel Toggle */}
      <button
        onClick={onToggleAI}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-500 rounded-lg border transition-all duration-150 ${
          showAIPanel
            ? 'bg-accent/10 border-accent/30 text-accent'
            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <Sparkles size={13} />
        <span>AI Panel</span>
      </button>

      {isEditMode ? (
        <>
          <Link
            to={returnUrl}
            className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 text-muted-foreground"
            title="Discard unsaved edits and return to review"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Back to Review</span>
          </Link>

          <button
            onClick={onOpenHistory}
            className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
            title="View revision history and compare diffs"
          >
            <History size={13} />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={onSaveDraft}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Creates an incremental revision without overwriting history"
          >
            <GitCommit size={13} className="text-primary" />
            <span>Save New Version</span>
          </button>

          <button
            onClick={onSubmitReview}
            disabled={!hasContent}
            className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send size={13} />
            <span>Submit Revision</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onSaveDraft}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Save size={13} />
            <span>Save Draft</span>
          </button>

          <button
            onClick={onSchedule}
            disabled={!hasContent}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock size={13} />
            <span>Schedule</span>
          </button>

          <button
            onClick={onSubmitReview}
            disabled={!hasContent}
            className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={13} />
            <span>Submit for Review</span>
          </button>
        </>
      )}
    </div>
  );
}
