'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Layers, FileText } from 'lucide-react';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';
import { faceOf, typeLabel } from './libraryFace';

export default function LibraryList({ items, selectedIds, onToggleSelect }) {
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="lib-empty">
        <p className="lib-empty-title">No matches</p>
        <p className="lib-empty-body">Nothing here fits those filters. Try widening the search.</p>
      </div>
    );
  }

  return (
    <div className="lib-list">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const face = faceOf(item);

        return (
          <div
            key={item.id}
            className="lib-row"
            data-selected={isSelected}
            onClick={() => navigate(`/post-creation-composer?id=${item.id}&mode=edit`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/post-creation-composer?id=${item.id}&mode=edit`);
            }}
            role="button"
            tabIndex={0}
          >
            <button
              type="button"
              className="lib-row-check"
              data-on={isSelected}
              aria-pressed={isSelected}
              aria-label={isSelected ? `Deselect ${item.title}` : `Select ${item.title}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(item.id);
              }}
            >
              {isSelected && <Check size={12} strokeWidth={3} />}
            </button>

            <div className="lib-thumb" data-face={face} title={typeLabel(item.type)}>
              {face === 'photo' ? (
                <AppImage src={item.imageUrl} alt={item.title} />
              ) : face === 'stack' ? (
                <Layers size={15} />
              ) : (
                <FileText size={15} />
              )}
            </div>

            <div className="min-w-0">
              <p className="lib-row-title">{item.title}</p>
              <p className="lib-row-preview">{item.preview}</p>
            </div>

            <span className="lib-row-date">{item.publishDate || item.savedAt || '—'}</span>

            <span className="lib-row-eng">
              {item.engagementRate ? `${item.engagementRate}%` : '—'}
            </span>

            <div className="lib-row-actions">
              <button
                type="button"
                className="lib-icon-btn"
                title="Copy post text"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator?.clipboard) navigator.clipboard.writeText(item.preview || '');
                  toast.success('Post copied to clipboard');
                }}
              >
                <Copy size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
