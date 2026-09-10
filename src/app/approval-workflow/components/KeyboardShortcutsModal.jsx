import React from 'react';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { key: 'j', description: 'Select next post in approval queue' },
  { key: 'k', description: 'Select previous post in approval queue' },
  { key: 'a', description: 'Approve current post (Account Owner only)' },
  { key: 'r', description: 'Open reject feedback dialog' },
  { key: 'e', description: 'Open post in Composer edit mode' },
  { key: '?', description: 'Toggle this keyboard shortcuts cheat-sheet' },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl card-shadow-md w-full max-w-sm slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-foreground font-600">
            <Keyboard size={18} className="text-primary" />
            <h2 className="text-base">Reviewer Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
            >
              <span className="text-xs text-muted-foreground">{s.description}</span>
              <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono font-700 text-foreground shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-border bg-muted/20 text-center">
          <p className="text-[11px] text-muted-foreground">
            Press <kbd className="font-mono font-600">?</kbd> anywhere in the queue to open
          </p>
        </div>
      </div>
    </div>
  );
}
