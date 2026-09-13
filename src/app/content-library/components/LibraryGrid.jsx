'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Pencil, FileText } from 'lucide-react';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';
import { hookOf, hookLength } from './libraryFace';

function getPillar(item) {
  const text = `${item.category || ''} ${(item.tags || []).join(' ')} ${item.title || ''}`.toLowerCase();
  if (text.includes('thought') || text.includes('leadership') || text.includes('culture')) return 'thought';
  if (text.includes('case') || text.includes('study') || text.includes('metric') || text.includes('growth')) return 'case';
  if (text.includes('engineer') || text.includes('tech') || text.includes('remote')) return 'engineering';
  if (text.includes('industry') || text.includes('insight') || text.includes('marketing') || text.includes('product')) return 'industry';
  return 'default';
}

function getFormatMarker(item) {
  if (item.type === 'carousel' || item.visualFormat === 'carousel') {
    const slides = item.slideCount || 5;
    return `PDF · ${slides} slides`;
  }
  if (item.type === 'gif' || (item.imageUrl && item.imageUrl.endsWith('.gif'))) {
    return 'GIF';
  }
  return null;
}

export default function LibraryGrid({ items, selectedIds, onToggleSelect }) {
  const navigate = useNavigate();

  if (items.length === 0) return <EmptyState />;

  return (
    <div className="lib-grid">
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          onToggleSelect={onToggleSelect}
          navigate={navigate}
        />
      ))}
    </div>
  );
}

function Card({ item, isSelected, onToggleSelect, navigate }) {
  const open = () => navigate(`/post-creation-composer?id=${item.id}&mode=edit`);

  const copy = (e) => {
    e.stopPropagation();
    if (navigator?.clipboard) navigator.clipboard.writeText(item.preview || '');
    toast.success('Post copied to clipboard');
  };

  const toggle = (e) => {
    e.stopPropagation();
    onToggleSelect(item.id);
  };

  const formatMarker = getFormatMarker(item);
  const dateStr = item.publishDate || item.savedAt || 'Not scheduled';

  return (
    <div className="lib-card" data-selected={isSelected} onClick={open}>
      {/* 16:10 Media Band */}
      <div className="lib-band">
        <button
          type="button"
          className="lib-check"
          data-on={isSelected}
          onClick={toggle}
          aria-pressed={isSelected}
          aria-label={isSelected ? `Deselect ${item.title}` : `Select ${item.title}`}
        >
          {isSelected && <Check size={13} strokeWidth={3} />}
        </button>

        <div className="lib-actions">
          <button type="button" className="lib-icon-btn" onClick={copy} title="Copy post text">
            <Copy size={13} />
          </button>
          <button
            type="button"
            className="lib-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            title="Open in composer"
          >
            <Pencil size={13} />
          </button>
        </div>

        <MediaBandContent item={item} />
      </div>

      {/* Card Body */}
      <div className="lib-card-body">
        <span className="lib-card-title">{item.title}</span>
        <div className="lib-card-meta">
          <span>{dateStr}</span>
          {formatMarker && (
            <>
              <span className="lib-card-meta-sep">·</span>
              <span className="lib-card-format">{formatMarker}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaBandContent({ item }) {
  const isCarousel = item.type === 'carousel' || item.visualFormat === 'carousel';
  const isPhoto = Boolean(item.imageUrl);

  if (isPhoto) {
    return (
      <div className="lib-band-photo w-full h-full">
        <AppImage src={item.imageUrl} alt={item.title} className="lib-band-img" />
      </div>
    );
  }

  if (isCarousel) {
    const slides = item.slideCount || 5;
    return (
      <div className="lib-band-carousel w-full h-full">
        <span className="lib-band-slide-count">1 / {slides}</span>
        <span className="lib-band-carousel-title">{item.title}</span>
      </div>
    );
  }

  const pillar = getPillar(item);
  const hook = hookOf(item);

  return (
    <div className="lib-band-text w-full h-full" data-pillar={pillar}>
      <span className="lib-band-hook" data-len={hookLength(hook)}>
        {hook}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="lib-empty">
      <FileText size={22} strokeWidth={1.5} color="var(--text-subtle)" />
      <p className="lib-empty-title">Nothing saved yet</p>
      <p className="lib-empty-body">
        Posts land here once you approve them in the queue. Approve one and it will show up.
      </p>
    </div>
  );
}
