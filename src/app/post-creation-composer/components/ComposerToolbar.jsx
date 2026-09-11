'use client';

import React from 'react';
import { ArrowLeft, CalendarClock, Check, FolderOpen, GitCommit, History, Save, Send } from 'lucide-react';
import { formatSlot } from '../_model/composer-utils';

function SlotChip({ date, time, onClick }) {
  const slot = formatSlot(date, time);
  return (
    <button
      type="button"
      className={`cmp-slot ${slot.isPast ? 'is-past' : ''}`}
      onClick={onClick}
      aria-label={`Publishing slot ${slot.day} ${slot.time}. Change slot`}
    >
      <span className={`cmp-badge is-sm ${slot.isPast ? 'tone-amber' : 'tone-blue'}`} aria-hidden="true">
        <CalendarClock size={15} />
      </span>
      <span>
        <span className="cmp-slot-day">{slot.day}</span>
        <span className="cmp-slot-meta">{slot.isPast ? 'This slot has passed' : slot.time}</span>
      </span>
    </button>
  );
}

function SaveButton({ state, onClick, idleLabel, savedLabel, icon: Icon }) {
  return (
    <button
      type="button"
      className="cmp-btn cmp-btn-outline is-lg cmp-save"
      data-state={state}
      onClick={() => state === 'idle' && onClick()}
    >
      <span key={state} className="cmp-send-icon" aria-hidden="true">
        {state === 'saved' ? <Check size={16} strokeWidth={2.6} /> : <Icon size={15} />}
      </span>
      <span aria-live="polite">{state === 'saved' ? savedLabel : idleLabel}</span>
    </button>
  );
}

function SendButton({ state, disabled, onClick, idleLabel, sentLabel }) {
  const label = state === 'sending' ? 'Sending…' : state === 'sent' ? sentLabel : idleLabel;
  return (
    <button
      type="button"
      className="cmp-btn cmp-btn-primary is-lg cmp-send"
      data-state={state}
      disabled={disabled && state === 'idle'}
      aria-disabled={state !== 'idle' || undefined}
      onClick={() => state === 'idle' && onClick()}
    >
      <span className="cmp-send-fill" aria-hidden="true" />
      <span key={state === 'sent' ? 'sent' : 'send'} className="cmp-send-icon" aria-hidden="true">
        {state === 'sent' ? <Check size={16} strokeWidth={2.6} /> : <Send size={15} />}
      </span>
      <span aria-live="polite">{label}</span>
    </button>
  );
}

export default function ComposerToolbar({
  onSaveDraft,
  onViewDrafts,
  onSubmitReview,
  onSchedule,
  onOpenHistory,
  hasContent,
  isEditMode = false,
  returnUrl = '/approval-workflow',
  scheduledDate,
  scheduledTime,
  saveState = 'idle',
  submitState = 'idle',
}) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {isEditMode && (
        <>
          <Link to={returnUrl} className="cmp-btn cmp-btn-outline is-lg" title="Leave without saving and go back to review">
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back to review</span>
          </Link>
          <button type="button" className="cmp-btn cmp-btn-outline is-lg" onClick={onOpenHistory} title="Compare earlier versions">
            <History size={15} />
            <span className="hidden sm:inline">History</span>
          </button>
        </>
      )}

      <SlotChip date={scheduledDate} time={scheduledTime} onClick={onSchedule} />

      <button
        type="button"
        className="cmp-btn cmp-btn-outline is-lg flex items-center gap-1.5"
        onClick={onViewDrafts}
        title="View all saved drafts"
      >
        <FolderOpen size={15} />
        <span>Saved drafts</span>
      </button>

      <SaveButton
        state={saveState}
        onClick={onSaveDraft}
        icon={isEditMode ? GitCommit : Save}
        idleLabel={isEditMode ? 'Save version' : 'Save draft'}
        savedLabel={isEditMode ? 'Version saved' : 'Draft saved'}
      />

      <SendButton
        state={submitState}
        disabled={!hasContent}
        onClick={onSubmitReview}
        idleLabel={isEditMode ? 'Send revision' : 'Send for review'}
        sentLabel={isEditMode ? 'Revision sent' : 'Sent for review'}
      />
    </div>
  );
}
