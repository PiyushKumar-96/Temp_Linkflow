'use client';

import React from 'react';
import { Sparkles, Save, Send, Clock } from 'lucide-react';

interface Props {
  showAIPanel: boolean;
  onToggleAI: () => void;
  onSaveDraft: () => void;
  onSubmitReview: () => void;
  onSchedule: () => void;
  hasContent: boolean;
}

export default function ComposerToolbar({ showAIPanel, onToggleAI, onSaveDraft, onSubmitReview, onSchedule, hasContent }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleAI}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-500 rounded-lg border transition-all duration-150 ${
          showAIPanel
            ? 'bg-accent/10 border-accent/30 text-accent' :'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <Sparkles size={14} />
        AI Panel
      </button>

      <button onClick={onSaveDraft} className="btn-secondary">
        <Save size={14} />
        Save Draft
      </button>

      <button
        onClick={onSchedule}
        disabled={!hasContent}
        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Clock size={14} />
        Schedule
      </button>

      <button
        onClick={onSubmitReview}
        disabled={!hasContent}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={14} />
        Submit for Review
      </button>
    </div>
  );
}