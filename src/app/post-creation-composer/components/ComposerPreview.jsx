'use client';

import React from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal, Globe, Layers, LayoutGrid, FileText } from 'lucide-react';
import { CarouselVisual, InfographicVisual } from '@/components/visuals';

export default function ComposerPreview({
  content = '',
  cta = '',
  hashtags = [],
  imageUrl,
  visualFormat = 'image',
  carouselSlides,
  infographicData,
  isGenerating,
}) {
  const safeContent = content || '';
  const safeHashtags = Array.isArray(hashtags) ? hashtags : [];

  const formattedContent = safeContent.split('\n').map((line, i) => (
    <React.Fragment key={`line-${i}`}>
      {line || <br />}
      {i < safeContent.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className="card p-4 flex flex-col gap-3 sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-600 text-foreground">LinkedIn Preview</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
          {visualFormat === 'none' ? 'Text-Only' : visualFormat}
        </span>
      </div>

      {/* LinkedIn post mockup */}
      <div className="border border-border rounded-xl overflow-hidden bg-white">
        {/* Post header */}
        <div className="p-3 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-700">SR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-700 text-gray-900">Sarah Reeves</p>
            <p className="text-xs text-gray-500">Content Manager at Acme Corp</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-gray-500">Just now</span>
              <span className="text-gray-300">·</span>
              <Globe size={10} className="text-gray-400" />
            </div>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-3 pb-2">
          {isGenerating ? (
            <div className="space-y-2">
              {[100, 90, 95, 80, 85].map((w, i) => (
                <div
                  key={`skel-line-${i}`}
                  className="animate-pulse bg-gray-100 rounded h-3"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          ) : content ? (
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {formattedContent}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Your post content will appear here...</p>
          )}

          {cta && (
            <p className="mt-2.5 text-xs font-600 text-gray-900 border-l-2 border-primary pl-2 italic">
              {cta}
            </p>
          )}

          {safeHashtags.length > 0 && safeContent && (
            <div className="mt-2 flex flex-wrap gap-1">
              {safeHashtags.map((tag) => (
                <span key={`prev-${tag}`} className="text-xs text-blue-600 font-500">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Visual Attachment Preview by Format */}
        {visualFormat === 'carousel' && (
          <div className="border-t border-gray-100 p-2 bg-slate-50">
            <CarouselVisual slides={carouselSlides} isEditable={false} />
          </div>
        )}

        {visualFormat === 'infographic' && (
          <div className="border-t border-gray-100 p-2 bg-slate-50">
            <InfographicVisual data={infographicData} isEditable={false} />
          </div>
        )}

        {visualFormat === 'image' && imageUrl && (
          <div className="border-t border-gray-100">
            <img
              src={imageUrl}
              alt="LinkedIn post image"
              className="w-full object-cover max-h-56"
            />
          </div>
        )}

        {/* Reactions row */}
        <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>👍 ❤️ 🎉 24 reactions</span>
          <span>3 comments</span>
        </div>

        {/* Action buttons */}
        <div className="px-1 py-1 border-t border-gray-100 flex items-center">
          {[
            { icon: ThumbsUp, label: 'Like' },
            { icon: MessageSquare, label: 'Comment' },
            { icon: Repeat2, label: 'Repost' },
            { icon: Send, label: 'Send' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={`action-${label}`}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-600 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Character usage */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              safeContent.length > 2700
                ? 'bg-danger'
                : safeContent.length > 2400
                  ? 'bg-warning'
                  : 'bg-primary'
            }`}
            style={{ width: `${Math.min((safeContent.length / 3000) * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{safeContent.length}/3000</span>
      </div>
    </div>
  );
}
