'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles, X, Maximize2 } from 'lucide-react';

export default function ImageCarouselSelector({
  images = [],
  selectedIndex = 0,
  onSelectIndex,
  onRemove,
  title = 'AI Generated Visual Candidates',
}) {
  const [activeSlide, setActiveSlide] = useState(selectedIndex || 0);
  const [zoomed, setZoomed] = useState(false);

  if (!images || images.length === 0) return null;

  const total = images.length;
  const currentImage = images[activeSlide];
  const isSelected = activeSlide === selectedIndex;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + total) % total);
  };

  const handleChoose = () => {
    if (onSelectIndex) {
      onSelectIndex(activeSlide);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/80 overflow-hidden card-shadow-sm">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-600 text-foreground">
          <Sparkles size={13} className="text-accent" />
          <span>{title}</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-accent/10 text-accent font-700 rounded-full">
            {total} Variations
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {activeSlide + 1} of {total}
          </span>
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-danger transition-colors"
              title="Remove images"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Slide Display */}
      <div className="relative bg-black/5 flex items-center justify-center overflow-hidden group">
        <img
          src={typeof currentImage === 'string' ? currentImage : currentImage?.url}
          alt={
            typeof currentImage === 'object' ? currentImage?.alt : `AI Visual ${activeSlide + 1}`
          }
          className="w-full object-cover max-h-56 select-none transition-transform duration-300"
        />

        {/* Selected badge overlay */}
        {isSelected ? (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-success/90 text-white text-[11px] font-600 shadow-sm backdrop-blur-xs">
            <CheckCircle2 size={12} />
            <span>Active on Post</span>
          </div>
        ) : (
          <button
            onClick={handleChoose}
            className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-foreground/80 hover:bg-foreground text-primary-foreground text-[11px] font-600 shadow-md backdrop-blur-xs transition-colors"
          >
            Click to Select
          </button>
        )}

        {/* Zoom trigger */}
        <button
          onClick={() => setZoomed(true)}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-foreground/60 hover:bg-foreground/80 text-white text-xs transition-colors opacity-0 group-hover:opacity-100"
          title="Zoom preview"
        >
          <Maximize2 size={12} />
        </button>

        {/* Carousel Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card/90 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-card transition-all"
              aria-label="Previous variation"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card/90 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-card transition-all"
              aria-label="Next variation"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Footer selector bar */}
      <div className="px-3.5 py-2.5 bg-muted/20 border-t border-border flex items-center justify-between gap-3">
        {/* Thumbnails / Indicators */}
        <div className="flex items-center gap-2">
          {images.map((img, idx) => {
            const url = typeof img === 'string' ? img : img?.url;
            const isCurrentActive = idx === activeSlide;
            const isCurrentlyChosen = idx === selectedIndex;
            return (
              <button
                key={`thumb-${idx}`}
                onClick={() => setActiveSlide(idx)}
                className={`relative rounded-md overflow-hidden border-2 transition-all w-9 h-7 ${
                  isCurrentActive
                    ? 'border-primary ring-2 ring-primary/20 scale-105'
                    : 'border-border/80 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                {isCurrentlyChosen && (
                  <div className="absolute inset-0 bg-success/30 flex items-center justify-center">
                    <CheckCircle2 size={11} className="text-white drop-shadow" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {!isSelected ? (
          <button onClick={handleChoose} className="btn-primary text-xs py-1 px-3 shadow-xs">
            Select Variation #{activeSlide + 1}
          </button>
        ) : (
          <span className="text-xs text-success font-600 flex items-center gap-1">
            <CheckCircle2 size={13} />
            Variation #{activeSlide + 1} Attached
          </span>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-foreground/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div
            className="bg-card border border-border rounded-xl max-w-2xl w-full p-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-600 text-foreground">
                Variation #{activeSlide + 1} of {total}
              </span>
              <button
                onClick={() => setZoomed(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <img
              src={typeof currentImage === 'string' ? currentImage : currentImage?.url}
              alt=""
              className="w-full rounded-lg max-h-[70vh] object-contain"
            />
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  handleChoose();
                  setZoomed(false);
                }}
                className="btn-primary text-xs"
              >
                {isSelected ? 'Already Attached' : 'Attach This Variation'}
              </button>
              <span className="text-xs text-muted-foreground">Click outside to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
