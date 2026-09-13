'use client';

import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Upload,
  Link as LinkIcon,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { STOCK_IMAGES, STOCK_IMAGES_LIST } from '@/temp-backend/data/media';

const DEFAULT_CANDIDATES = [
  {
    id: STOCK_IMAGES.teamBrainstorm.id,
    url: STOCK_IMAGES.teamBrainstorm.url,
    title: STOCK_IMAGES.teamBrainstorm.label,
  },
  {
    id: STOCK_IMAGES.modernWorkspace.id,
    url: STOCK_IMAGES.modernWorkspace.url,
    title: STOCK_IMAGES.modernWorkspace.label,
  },
  {
    id: STOCK_IMAGES.growthDashboard.id,
    url: STOCK_IMAGES.growthDashboard.url,
    title: STOCK_IMAGES.growthDashboard.label,
  },
];

export default function MarketingImageVisual({
  imageUrl = '',
  onSelectImage,
  candidateImages = DEFAULT_CANDIDATES,
  onUpdateCandidates,
  isEditable = false,
}) {
  const [candidates, setCandidates] = useState(
    candidateImages && candidateImages.length > 0 ? candidateImages : DEFAULT_CANDIDATES
  );
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef(null);

  const activeUrl = imageUrl || candidates[0]?.url || '';

  const handleSelect = (url) => {
    if (onSelectImage) onSelectImage(url);
    toast.success('Selected image variation');
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise((r) => setTimeout(r, 1200));

    const newCandidates = [
      {
        id: `cand-new-1-${Date.now()}`,
        url: STOCK_IMAGES.collaborationDesk.url,
        title: STOCK_IMAGES.collaborationDesk.label,
      },
      {
        id: `cand-new-2-${Date.now()}`,
        url: STOCK_IMAGES.strategicPlanning.url,
        title: STOCK_IMAGES.strategicPlanning.label,
      },
      {
        id: `cand-new-3-${Date.now()}`,
        url: STOCK_IMAGES.executivePortrait.url,
        title: STOCK_IMAGES.executivePortrait.label,
      },
    ];

    setCandidates(newCandidates);
    if (onUpdateCandidates) onUpdateCandidates(newCandidates);
    if (onSelectImage) onSelectImage(newCandidates[0].url);
    setIsRegenerating(false);
    toast.success('Generated 3 new image variations with GPT-4o Vision');
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      if (onSelectImage) onSelectImage(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
      toast.success('Applied custom image URL');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (onSelectImage) onSelectImage(url);
      toast.success('Uploaded custom image asset');
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[360px] mx-auto">
      {/* Main Image Frame */}
      <div className="relative aspect-video max-h-[220px] w-full rounded-xl overflow-hidden shadow-md border border-border bg-muted">
        {activeUrl ? (
          <img src={activeUrl} alt="Marketing Visual" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <ImageIcon size={28} className="opacity-40 mb-1" />
            <span className="text-xs">No image attached</span>
          </div>
        )}
      </div>

      {/* Candidate Variations Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          AI Candidate Variations ({candidates.length})
        </span>

        <div className="grid grid-cols-3 gap-2">
          {candidates.map((cand, idx) => {
            const isSelected = activeUrl === cand.url;
            return (
              <div
                key={cand.id || idx}
                onClick={() => handleSelect(cand.url)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30 shadow-xs'
                    : 'border-border opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={cand.url}
                  alt={cand.title || 'Option'}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check size={10} />
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-0.5 text-center truncate">
                  Option #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      {isEditable && (
        <div className="flex items-center justify-between gap-1.5 p-2 bg-muted/20 border border-border rounded-lg text-xs flex-wrap">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="btn btn-outline text-[11px] py-1 px-2 flex items-center gap-1 hover:bg-primary/10 hover:text-primary"
            title="Generate 3 new AI images based on post content"
          >
            <RefreshCw size={11} className={isRegenerating ? 'animate-spin' : ''} />
            {isRegenerating ? 'Generating...' : 'Regenerate'}
          </button>

          <button
            onClick={() => setShowUrlInput((s) => !s)}
            className="btn btn-outline text-[11px] py-1 px-2 flex items-center gap-1"
          >
            <LinkIcon size={11} />
            URL
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-outline text-[11px] py-1 px-2 flex items-center gap-1"
          >
            <Upload size={11} />
            Upload
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {/* URL Input Box */}
      {showUrlInput && (
        <div className="p-2 border border-border bg-card rounded-lg flex items-center gap-2 slide-up">
          <input
            type="text"
            placeholder="Paste image URL (https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="input text-xs py-1 flex-1"
          />
          <button onClick={handleApplyCustomUrl} className="btn btn-primary text-xs py-1 px-2.5">
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
