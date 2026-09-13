import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function RejectFeedbackDialog({ isOpen, onClose, onConfirm, isSubmitting }) {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onConfirm(feedback.trim());
    setFeedback('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl card-shadow-md w-full max-w-md slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-danger font-600">
            <AlertTriangle size={18} />
            <h2 className="text-base text-foreground">Reject Post with Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Consequence of Rejection:</span>
              <span>
                This draft will be removed from the active publishing schedule and halted. The
                author will be notified to revise or discard the draft.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-600 text-foreground mb-1.5">
              Rejection Reason & Required Changes <span className="text-danger">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. The statistics in line 3 contradict our latest security whitepaper. Please re-verify source..."
              className="w-full text-xs p-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="btn-secondary text-xs py-2 px-3">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!feedback.trim() || isSubmitting}
              className="btn-danger text-xs py-2 px-4 disabled:opacity-50"
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
