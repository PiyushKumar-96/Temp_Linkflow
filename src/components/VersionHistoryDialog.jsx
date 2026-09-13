'use client';

import React, { useState } from 'react';
import {
  X,
  History,
  GitCommit,
  User,
  Sparkles,
  RotateCcw,
  Eye,
  Columns,
  Check,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function VersionHistoryDialog({
  isOpen,
  onClose,
  revisions = [],
  currentContent = '',
  currentPostTitle = 'Post Draft',
  onRestoreVersion,
}) {
  // Build a full list of versions including the current draft as the latest version
  const allVersions = [
    ...(revisions || []),
    {
      id: 'rev-current',
      versionNumber: (revisions?.length || 0) + 1,
      createdAt: 'Current Draft',
      author: 'Active Editor',
      authorType: 'human',
      summary: 'Current working draft',
      content: currentContent,
    },
  ].sort((a, b) => b.versionNumber - a.versionNumber);

  const [selectedVersionId, setSelectedVersionId] = useState(
    revisions?.length > 0 ? revisions[revisions.length - 1].id : 'rev-current'
  );

  const [compareWithCurrent, setCompareWithCurrent] = useState(true);

  if (!isOpen) return null;

  const selectedVersion = allVersions.find((v) => v.id === selectedVersionId) || allVersions[0];

  // Helper to compute line diff
  const computeDiff = (oldText = '', newText = '') => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const result = [];

    let i = 0;
    let j = 0;

    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        result.push({ type: 'same', text: oldLines[i] });
        i++;
        j++;
      } else if (j < newLines.length && (!oldLines[i] || !newLines.includes(oldLines[i]))) {
        result.push({ type: 'add', text: newLines[j] });
        j++;
      } else if (i < oldLines.length) {
        result.push({ type: 'remove', text: oldLines[i] });
        i++;
      } else {
        j++;
      }
    }

    return result;
  };

  const diffLines = computeDiff(selectedVersion?.content || '', currentContent);

  const handleRestore = () => {
    if (selectedVersion && onRestoreVersion) {
      onRestoreVersion(selectedVersion);
      toast.success(
        `Restored v${selectedVersion.versionNumber} content as new incremental revision`
      );
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl slide-up overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white">
              <History size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Version History & Diff Compare</h2>
              <p className="text-[11px] text-muted-foreground truncate max-w-lg">
                &ldquo;{currentPostTitle}&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body: Split between Version Timeline and Diff View */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Version List (4 cols) */}
          <div className="md:col-span-4 border-r border-border p-4 overflow-y-auto space-y-3 bg-muted/20">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Revision Timeline
            </p>

            <div className="space-y-2">
              {allVersions.map((v) => {
                const isSelected = v.id === selectedVersionId;
                const isCurrent = v.id === 'rev-current';

                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVersionId(v.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-foreground">
                          v{v.versionNumber}
                        </span>
                        <span className="text-xs font-semibold text-foreground truncate">
                          {v.author}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{v.createdAt}</span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {v.summary || 'Content revision'}
                    </p>

                    {isCurrent && (
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                        Active Draft
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Diff & Content View (8 cols) */}
          <div className="md:col-span-8 p-5 flex flex-col overflow-hidden">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Comparing v{selectedVersion?.versionNumber} → Current Version
                </span>
              </div>

              {selectedVersion && selectedVersion.id !== 'rev-current' && onRestoreVersion && (
                <button
                  onClick={handleRestore}
                  className="btn btn-primary text-xs py-1 px-3 flex items-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  Restore v{selectedVersion.versionNumber}
                </button>
              )}
            </div>

            {/* Visual Diff View */}
            <div className="flex-1 overflow-y-auto border border-border rounded-lg bg-card p-4 font-mono text-xs leading-relaxed space-y-1">
              {diffLines.length === 0 ? (
                <p className="text-muted-foreground italic font-sans text-center py-8">
                  Versions are identical.
                </p>
              ) : (
                diffLines.map((line, idx) => {
                  if (line.type === 'add') {
                    return (
                      <div
                        key={idx}
                        className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded flex items-start gap-2"
                      >
                        <span className="text-emerald-600 font-bold select-none">+</span>
                        <span className="flex-1 whitespace-pre-wrap">{line.text || ' '}</span>
                      </div>
                    );
                  }
                  if (line.type === 'remove') {
                    return (
                      <div
                        key={idx}
                        className="bg-destructive/10 text-destructive line-through px-2 py-0.5 rounded flex items-start gap-2 opacity-80"
                      >
                        <span className="text-destructive font-bold select-none">-</span>
                        <span className="flex-1 whitespace-pre-wrap">{line.text || ' '}</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={idx}
                      className="text-foreground/80 px-2 py-0.5 flex items-start gap-2"
                    >
                      <span className="text-muted-foreground select-none opacity-40"> </span>
                      <span className="flex-1 whitespace-pre-wrap">{line.text || ' '}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Restoring a version creates an incremental revision (
            <span className="font-mono">v{allVersions.length + 1}</span>) without destroying
            history.
          </span>
          <button onClick={onClose} className="btn btn-outline text-xs py-1 px-4">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
