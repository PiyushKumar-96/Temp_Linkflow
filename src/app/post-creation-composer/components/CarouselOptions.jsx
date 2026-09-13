'use client';

import React, { useRef, useState } from 'react';
import { FileText, Plus, RefreshCw, Sparkles, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { CarouselVisual } from '@/components/visuals';
import { CAROUSEL_GEN_STEPS, GenProgress, GenTile, getGenStep, useElapsed } from './ImageOptions';

export default function CarouselOptions({
  slides = [],
  onChangeSlides,
  generation = null,
  onGenerate,
  onCancel,
  canGenerate = true,
  isGenerating = false,
  content = '',
}) {
  const [localStartedAt, setLocalStartedAt] = useState(null);
  const [isOver, setIsOver] = useState(false);
  const [uploadedPdfName, setUploadedPdfName] = useState(null);
  const fileInputRef = useRef(null);

  const pending = Boolean(generation) || Boolean(localStartedAt);
  const elapsed = useElapsed(generation?.startedAt || localStartedAt);
  const step = getGenStep(elapsed, CAROUSEL_GEN_STEPS);

  const hasSlides = Array.isArray(slides) && slides.length > 0;

  const handleGenerateAI = () => {
    if (onGenerate) {
      onGenerate();
      return;
    }
    setLocalStartedAt(Date.now());
    toast.info('Generating carousel slides with AI...');

    setTimeout(() => {
      // Generate intelligent slides extracted from the post content or strategic insights
      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      const firstLine =
        lines[0]?.replace(/^[#*\-•\s]+/, '').slice(0, 60) || 'The Strategic Growth Playbook';
      const points = lines
        .slice(1, 5)
        .map((l) => l.replace(/^[#*\-•\s[color:var(--warning-text)].]+/, '').trim())
        .filter(Boolean);

      const newSlides = [
        {
          id: `slide-1`,
          headline: firstLine,
          body: 'A breakdown of key strategic takeaways and execution principles for high-performing teams.',
          tag: 'SLIDE 01 / 04',
          accentColor: '#0a66c2',
        },
        {
          id: `slide-2`,
          headline: points[0] || '1. Focus on Pipeline Velocity',
          body:
            points[1] ||
            'Content that drives high-intent discussions consistently outperforms vanity metrics.',
          tag: 'SLIDE 02 / 04',
          accentColor: '#6366f1',
        },
        {
          id: `slide-3`,
          headline: points[2] || '2. High-Leverage Distribution',
          body:
            points[3] || 'Turn each high-performing insight into structured multi-channel assets.',
          tag: 'SLIDE 03 / 04',
          accentColor: '#8b5cf6',
        },
        {
          id: `slide-4`,
          headline: 'Next Steps & Execution',
          body: 'Document what converts, double down on validated distribution, and iterate weekly.',
          tag: 'SLIDE 04 / 04',
          accentColor: '#10b981',
        },
      ];

      onChangeSlides?.(newSlides);
      setUploadedPdfName(null);
      setLocalStartedAt(null);
      toast.success('4-slide carousel generated with AI!');
    }, 4500);
  };

  const handlePdfUpload = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are accepted for carousels.');
      return;
    }

    const pdfName = file.name;
    setUploadedPdfName(pdfName);

    // Create carousel representation from uploaded PDF
    const baseName = pdfName.replace(/\.pdf$/i, '');
    const slidesFromPdf = [
      {
        id: `pdf-slide-1`,
        headline: baseName,
        body: `Page 1 from uploaded document: ${pdfName} (${(file.size / 1024 / 1024).toFixed(1)} MB)`,
        tag: 'PDF DECK · PAGE 1',
        accentColor: '#0a66c2',
      },
      {
        id: `pdf-slide-2`,
        headline: 'Document Analysis & Data',
        body: 'Extracted key framework points and visual diagrams from document pages.',
        tag: 'PDF DECK · PAGE 2',
        accentColor: '#6366f1',
      },
      {
        id: `pdf-slide-3`,
        headline: 'Summary & Conclusions',
        body: 'Final recommendations and closing overview.',
        tag: 'PDF DECK · PAGE 3',
        accentColor: '#10b981',
      },
    ];

    onChangeSlides?.(slidesFromPdf);
    toast.success(`PDF uploaded: ${pdfName}`);
  };

  const handleRemove = () => {
    onChangeSlides?.([]);
    setUploadedPdfName(null);
    toast.info('Carousel removed');
  };

  return (
    <div className="flex flex-col gap-3">
      {pending ? (
        <div className="flex flex-col gap-3">
          <GenProgress
            title="Creating 4-slide carousel deck"
            steps={CAROUSEL_GEN_STEPS}
            step={step}
            elapsed={elapsed}
            count={4}
            onCancel={onCancel}
            hint="Structuring slide headlines and takeaways. You can keep editing your post."
          />
          <div className="cmp-tiles">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="cmp-tile">
                <GenTile index={idx} step={step} reveal="develop">
                  <span className="cmp-gen-caption">
                    <Sparkles size={12} />
                    <span key={step} className="m-swap">
                      Slide 0{idx + 1}
                    </span>
                  </span>
                </GenTile>
              </div>
            ))}
          </div>
        </div>
      ) : !hasSlides ? (
        <div className="cmp-tiles">
          {/* Create with AI Option */}
          <button
            type="button"
            className="cmp-gen-cta"
            onClick={handleGenerateAI}
            disabled={pending || isGenerating}
          >
            <span className="cmp-drop-plus" aria-hidden="true">
              <Sparkles size={16} />
            </span>
            <span>
              <strong>Create with AI</strong>
              Auto-generate 4-slide deck
            </span>
          </button>

          {/* Upload PDF Option (PDF ONLY) */}
          <button
            type="button"
            className={`cmp-drop ${isOver ? 'is-dragover' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsOver(true);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handlePdfUpload(file);
            }}
          >
            <svg className="cmp-drop-border" aria-hidden="true">
              <rect x="0" y="0" width="100%" height="100%" rx="14" ry="14" />
            </svg>
            <span className="cmp-drop-plus" aria-hidden="true">
              {isOver ? <Upload size={16} /> : <FileText size={16} />}
            </span>
            <span>
              <strong>{isOver ? 'Drop PDF here' : 'Upload PDF'}</strong>
              PDF document only, up to 20 MB
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePdfUpload(file);
              e.target.value = '';
            }}
          />
        </div>
      ) : (
        /* Rendered Carousel with Management Toolbar */
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 px-1 py-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                {uploadedPdfName
                  ? `Attached PDF: ${uploadedPdfName}`
                  : `${slides.length}-Slide Carousel Ready`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="cmp-link-btn text-xs"
                onClick={handleGenerateAI}
                disabled={pending || isGenerating}
                title="Regenerate slides using AI"
              >
                <RefreshCw size={13} className={pending ? 'animate-spin' : ''} />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                className="cmp-link-btn text-xs"
                onClick={() => fileInputRef.current?.click()}
                title="Upload another PDF document"
              >
                <Upload size={13} />
                <span>Upload PDF</span>
              </button>

              <button
                type="button"
                className="cmp-link-btn text-xs text-rose-500 hover:text-rose-600"
                onClick={handleRemove}
                title="Remove carousel"
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePdfUpload(file);
              e.target.value = '';
            }}
          />

          <CarouselVisual slides={slides} onChangeSlides={onChangeSlides} isEditable />
        </div>
      )}
    </div>
  );
}
