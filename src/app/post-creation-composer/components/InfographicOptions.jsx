'use client';

import React, { useRef, useState } from 'react';
import { LayoutGrid, Plus, RefreshCw, Sparkles, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { InfographicVisual } from '@/components/visuals';

export default function InfographicOptions({
  data,
  onChangeData,
  canGenerate = false,
  isGenerating = false,
  content = '',
}) {
  const [generating, setGenerating] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const fileInputRef = useRef(null);

  const hasData = Boolean(data && (data.title || data.pillars?.length > 0 || data.imageUrl));

  const handleGenerateAI = () => {
    setGenerating(true);
    toast.info('Generating infographic framework with AI...');

    setTimeout(() => {
      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      const title = lines[0]?.replace(/^[#*\-•\s]+/, '').slice(0, 50) || 'B2B Growth Engine Framework';
      const points = lines.slice(1, 4).map((l) => l.replace(/^[#*\-•\s\d.]+/, '').trim()).filter(Boolean);

      const generatedData = {
        title,
        metricNumber: '+280%',
        metricLabel: 'Pipeline Growth Rate',
        pillars: [
          {
            step: '01',
            title: points[0] ? points[0].slice(0, 30) : 'Audience Validation',
            desc: points[1] ? points[1].slice(0, 60) : 'Direct feedback loops and customer conversation mapping',
          },
          {
            step: '02',
            title: points[2] ? points[2].slice(0, 30) : 'High-Intent Distribution',
            desc: 'Targeted reach across relevant decision-maker communities',
          },
          {
            step: '03',
            title: 'Revenue Attribution',
            desc: 'Direct correlation between thought leadership and qualified pipeline',
          },
        ],
        footerNote: 'Source: LinkedFlow Insights Studio',
      };

      onChangeData?.(generatedData);
      setGenerating(false);
      toast.success('Infographic framework generated with AI!');
    }, 1200);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChangeData?.({
      ...(data || {}),
      imageUrl: url,
      title: file.name.replace(/\.[^/.]+$/, ''),
      pillars: data?.pillars || [],
    });
    toast.success(`Infographic uploaded: ${file.name}`);
  };

  const handleRemove = () => {
    onChangeData?.(null);
    toast.info('Infographic removed');
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Option Cards when no infographic exists */}
      {!hasData ? (
        <div className="cmp-tiles">
          {/* Create with AI Option */}
          <button
            type="button"
            className="cmp-gen-cta"
            onClick={handleGenerateAI}
            disabled={generating || isGenerating}
          >
            <span className="cmp-drop-plus" aria-hidden="true">
              <Sparkles size={16} className={generating ? 'animate-spin' : ''} />
            </span>
            <span>
              <strong>{generating ? 'Generating graphic...' : 'Create with AI'}</strong>
              Auto-generate framework & stats
            </span>
          </button>

          {/* Upload Infographic Option */}
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
              if (file) handleImageUpload(file);
            }}
          >
            <svg className="cmp-drop-border" aria-hidden="true">
              <rect x="0" y="0" width="100%" height="100%" rx="14" ry="14" />
            </svg>
            <span className="cmp-drop-plus" aria-hidden="true">
              {isOver ? <Upload size={16} /> : <Plus size={16} />}
            </span>
            <span>
              <strong>{isOver ? 'Drop file here' : 'Upload infographic'}</strong>
              PNG, JPG or WEBP, up to 10 MB
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />
        </div>
      ) : (
        /* Rendered Infographic with Management Toolbar */
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 px-1 py-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Infographic Framework Ready</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="cmp-link-btn text-xs"
                onClick={handleGenerateAI}
                disabled={generating || isGenerating}
                title="Regenerate infographic using AI"
              >
                <RefreshCw size={13} className={generating ? 'animate-spin' : ''} />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                className="cmp-link-btn text-xs"
                onClick={() => fileInputRef.current?.click()}
                title="Upload another graphic"
              >
                <Upload size={13} />
                <span>Upload</span>
              </button>

              <button
                type="button"
                className="cmp-link-btn text-xs text-rose-500 hover:text-rose-600"
                onClick={handleRemove}
                title="Remove infographic"
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />

          <InfographicVisual data={data} onChangeData={onChangeData} isEditable />
        </div>
      )}
    </div>
  );
}
