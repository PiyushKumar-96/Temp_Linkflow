'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { getStoredPosts, saveStoredPosts } from '@/temp-backend';

export default function SavedDraftsDialog({
  isOpen,
  onClose,
  onSelectDraft,
  activeDraftId = null,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const drafts = useMemo(() => {
    if (!isOpen) return [];
    try {
      const allPosts = getStoredPosts() || [];
      // Filter for drafts or composer-created posts
      const draftList = allPosts.filter((p) => p.status === 'draft' || p.source === 'composer');
      // Sort newest first
      return draftList.sort(
        (a, b) =>
          new Date(b.submittedAt || b.updatedAt || b.createdAt || 0) -
          new Date(a.submittedAt || a.updatedAt || a.createdAt || 0)
      );
    } catch {
      return [];
    }
  }, [isOpen, refreshKey]);

  const filteredDrafts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return drafts;
    return drafts.filter(
      (d) =>
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.content && d.content.toLowerCase().includes(q)) ||
        (d.target && d.target.toLowerCase().includes(q))
    );
  }, [drafts, searchQuery]);

  if (!isOpen) return null;

  const handleDelete = (e, draftId) => {
    e.stopPropagation();
    try {
      const allPosts = getStoredPosts() || [];
      const updated = allPosts.filter((p) => p.id !== draftId);
      saveStoredPosts(updated);
      setRefreshKey((k) => k + 1);
      toast.success('Draft removed');
    } catch {
      toast.error('Could not delete draft');
    }
  };

  const handleSelect = (draft) => {
    onSelectDraft(draft);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drafts-dialog-title"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium">
              <FolderOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="drafts-dialog-title"
                  className="text-lg font-semibold text-slate-900 dark:text-white"
                >
                  Saved Drafts
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {drafts.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select any draft to open and continue editing in the composer
              </p>
            </div>
          </div>

          <button
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search drafts by title, content or keyword…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredDrafts.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                <FileText size={22} />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {searchQuery ? 'No matching drafts found' : 'No saved drafts yet'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                {searchQuery
                  ? 'Try searching with a different keyword or phrase.'
                  : 'Click "Save draft" in the top bar while writing to save drafts here.'}
              </p>
            </div>
          ) : (
            filteredDrafts.map((draft) => {
              const isActive = draft.id === activeDraftId;
              const preview =
                (draft.content || '').split('\n').filter(Boolean).slice(0, 2).join(' ') ||
                'No content preview available';

              return (
                <div
                  key={draft.id}
                  onClick={() => handleSelect(draft)}
                  className={`group relative p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isActive
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-md">
                          {draft.title || 'Untitled Draft'}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-600 text-white">
                            Editing
                          </span>
                        )}
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                          {draft.target === 'company' ? 'Company Page' : 'Personal Profile'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, draft.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete draft"
                        aria-label="Delete draft"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelect(draft)}
                        className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                        title="Open in editor"
                        aria-label="Open in editor"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {preview}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                    {(draft.scheduledDate || draft.dueDate) && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {draft.scheduledDate || draft.dueDate}
                      </span>
                    )}
                    {draft.scheduledTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {draft.scheduledTime}
                      </span>
                    )}
                    {draft.visualFormat && (
                      <span className="flex items-center gap-1 capitalize">
                        {draft.visualFormat === 'image' && <ImageIcon size={12} />}
                        {draft.visualFormat === 'carousel' && <Layers size={12} />}
                        {draft.visualFormat === 'infographic' && <LayoutGrid size={12} />}
                        {draft.visualFormat}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <span>Click any draft to load into editor</span>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
