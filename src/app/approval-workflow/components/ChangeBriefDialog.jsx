import React, { useState } from 'react';
import { X, RefreshCw, Sparkles } from 'lucide-react';

export default function ChangeBriefDialog({ isOpen, onClose, onConfirm, isSubmitting }) {
  const [newBrief, setNewBrief] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newBrief.trim()) return;
    onConfirm(newBrief.trim());
    setNewBrief('');
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
          <div className="flex items-center gap-2 text-primary font-600">
            <Sparkles size={18} />
            <h2 className="text-base text-foreground">Change Brief & Regenerate</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Changing the topic or prompt brief will loop this item back to the AI generation pipeline. A fresh draft and visual set will be generated based on your instructions.
          </p>

          <div>
            <label className="block text-xs font-600 text-foreground mb-1.5">
              Updated Topic or Prompt Directive <span className="text-primary">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={newBrief}
              onChange={(e) => setNewBrief(e.target.value)}
              placeholder="e.g. Pivot to focus on the developer productivity angle rather than cost savings. Use an assertive hook comparing synchronous meetings to deep work."
              className="w-full text-xs p-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newBrief.trim() || isSubmitting}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw size={13} className={isSubmitting ? 'animate-spin' : ''} />
              <span>{isSubmitting ? 'Regenerating...' : 'Regenerate Draft'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
