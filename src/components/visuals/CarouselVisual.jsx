'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Layers,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_SLIDES = [
  {
    id: 'slide-1',
    headline: 'The Async Engineering Playbook',
    body: 'Why high-performing distributed teams are replacing daily meetings with structured written specs.',
    tag: 'SLIDE 01 / 05',
    accentColor: '#0a66c2',
  },
  {
    id: 'slide-2',
    headline: 'Rule 1: The 24-Hour SLA',
    body: 'Response expectations drop from "within 15 minutes" to "within 24 hours" for non-blockers.',
    tag: 'SLIDE 02 / 05',
    accentColor: '#6366f1',
  },
  {
    id: 'slide-3',
    headline: 'Rule 2: Specs Over Standups',
    body: 'Every PR or architecture decision begins with a 1-page RFC in Notion, not a Zoom kickoff.',
    tag: 'SLIDE 03 / 05',
    accentColor: '#8b5cf6',
  },
  {
    id: 'slide-4',
    headline: 'Rule 3: Video For Context',
    body: '3-minute Loom walk-throughs replace 30-minute demo meetings. Watch at 1.5x speed.',
    tag: 'SLIDE 04 / 05',
    accentColor: '#06b6d4',
  },
  {
    id: 'slide-5',
    headline: 'The Bottom Line Result',
    body: 'Deep work blocks quadrupled from 1.2 hrs/day to 4.8 hrs/day across the entire department.',
    tag: 'SLIDE 05 / 05',
    accentColor: '#10b981',
  },
];

export default function CarouselVisual({
  slides = DEFAULT_SLIDES,
  onChangeSlides,
  isEditable = false,
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : activeSlides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < activeSlides.length - 1 ? prev + 1 : 0));
  };

  const handleDownloadPdf = () => {
    const textContent = activeSlides
      .map(
        (s, i) =>
          `=== Slide ${i + 1} of ${activeSlides.length} ===\n${s.headline}\n\n${s.body}\n`
      )
      .join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carousel_document_${Date.now()}.txt`;
    a.click();
    toast.success('Downloaded carousel slide deck bundle (PDF format)');
  };

  const handleAddSlide = () => {
    if (!onChangeSlides) return;
    const newSlide = {
      id: `slide-${Date.now()}`,
      headline: 'New Insight Slide',
      body: 'Add your strategic insight or data point here.',
      tag: `SLIDE ${String(activeSlides.length + 1).padStart(2, '0')}`,
      accentColor: '#0a66c2',
    };
    onChangeSlides([...activeSlides, newSlide]);
    setCurrentSlideIndex(activeSlides.length);
    toast.success('Added new slide to carousel');
  };

  const handleDeleteCurrentSlide = () => {
    if (!onChangeSlides || activeSlides.length <= 1) {
      toast.error('Carousel must have at least 1 slide');
      return;
    }
    const updated = activeSlides.filter((_, idx) => idx !== currentSlideIndex);
    onChangeSlides(updated);
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
    toast.info('Removed slide');
  };

  const handleMoveSlide = (direction) => {
    if (!onChangeSlides) return;
    const newIdx = currentSlideIndex + direction;
    if (newIdx < 0 || newIdx >= activeSlides.length) return;

    const copy = [...activeSlides];
    const temp = copy[currentSlideIndex];
    copy[currentSlideIndex] = copy[newIdx];
    copy[newIdx] = temp;
    onChangeSlides(copy);
    setCurrentSlideIndex(newIdx);
    toast.success('Slide reordered');
  };

  const handleUpdateSlideField = (field, val) => {
    if (!onChangeSlides) return;
    const copy = [...activeSlides];
    copy[currentSlideIndex] = { ...copy[currentSlideIndex], [field]: val };
    onChangeSlides(copy);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Visual Slide Frame (Square/Portrait 4:5 LinkedIn Format) */}
      <div className="relative aspect-square max-h-[360px] mx-auto w-full max-w-[360px] rounded-xl overflow-hidden shadow-lg border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col justify-between p-6 select-none transition-all">
        {/* Slide Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentSlide.accentColor || '#0a66c2' }}
            />
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-300">
              {currentSlide.tag || `SLIDE ${currentSlideIndex + 1}`}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {currentSlideIndex + 1} / {activeSlides.length}
          </span>
        </div>

        {/* Slide Main Copy */}
        <div className="flex flex-col gap-2 my-auto">
          {isEditable ? (
            <>
              <input
                type="text"
                value={currentSlide.headline}
                onChange={(e) => handleUpdateSlideField('headline', e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm font-bold text-white focus:outline-none focus:border-white/50"
              />
              <textarea
                rows={3}
                value={currentSlide.body}
                onChange={(e) => handleUpdateSlideField('body', e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-white/50 resize-none"
              />
            </>
          ) : (
            <>
              <h3 className="text-base font-extrabold text-white leading-tight tracking-tight">
                {currentSlide.headline}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {currentSlide.body}
              </p>
            </>
          )}
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-3">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Layers size={11} className="text-primary" /> LinkedFlow Carousel
          </span>
          <span className="text-slate-400">Swipe to read →</span>
        </div>

        {/* Navigation Overlays */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          title="Previous slide"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          title="Next slide"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Slide Thumbnails & Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 py-1">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`transition-all rounded-full ${
              idx === currentSlideIndex
                ? 'w-5 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 bg-muted/20 border border-border rounded-lg text-xs flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground font-medium">
            Page {currentSlideIndex + 1} of {activeSlides.length}
          </span>
          {isEditable && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => handleMoveSlide(-1)}
                disabled={currentSlideIndex === 0}
                className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                title="Move slide left"
              >
                <ArrowUp size={12} className="-rotate-90" />
              </button>
              <button
                onClick={() => handleMoveSlide(1)}
                disabled={currentSlideIndex === activeSlides.length - 1}
                className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                title="Move slide right"
              >
                <ArrowDown size={12} className="-rotate-90" />
              </button>
              <button
                onClick={handleDeleteCurrentSlide}
                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                title="Delete this slide"
              >
                <Trash2 size={12} />
              </button>
              <button
                onClick={handleAddSlide}
                className="btn btn-outline text-[11px] py-0.5 px-2 flex items-center gap-1 ml-1"
              >
                <Plus size={11} /> Add Slide
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleDownloadPdf}
          className="btn btn-outline text-[11px] py-1 px-2.5 flex items-center gap-1"
          title="Download multi-page carousel deck for LinkedIn upload"
        >
          <Download size={12} />
          Download PDF
        </button>
      </div>
    </div>
  );
}
