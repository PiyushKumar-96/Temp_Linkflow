'use client';

import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Globe,
  Smartphone,
  Monitor,
  Heart,
} from 'lucide-react';
import { CarouselVisual, InfographicVisual } from '@/components/visuals';
import { AVATARS } from '@/temp-backend/data/media';
import { useAuth } from '@/context/AuthContext';

/**
 * Parses a string of text and turns hashtags, @mentions, and URLs into styled spans.
 */
function renderFormattedLine(text) {
  if (!text) return null;
  const parts = text.split(/(https?:\/\/[^\s]+|#[\w\d_-]+|@[\w\d_-]+)/g);
  return parts.map((part, index) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <span key={index} className="text-[#0a66c2] hover:underline cursor-pointer break-all font-normal">
          {part}
        </span>
      );
    }
    if (/^#/.test(part)) {
      return (
        <span key={index} className="text-[#0a66c2] font-medium hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    if (/^@/.test(part)) {
      return (
        <span key={index} className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ComposerPreview({
  content = '',
  cta = '',
  hashtags = [],
  imageUrl,
  visualFormat = 'image',
  carouselSlides,
  infographicData,
  isGenerating = false,
}) {
  const { user } = useAuth?.() || {};
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [isLiked, setIsLiked] = useState(false);

  const safeContent = content || '';
  const safeHashtags = Array.isArray(hashtags) ? hashtags : [];

  // Author details matching user screenshot or fallback to profile
  const authorName = user?.name || 'Alex Dahud';
  const authorHeadline = user?.headline || 'Growth at Typegrow | Helping you grow LinkedIn audience with AI';
  const authorAvatar =
    user?.avatarUrl ||
    AVATARS?.alex ||
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80';

  // Fold threshold based on device (desktop ~5 lines, mobile ~3 lines)
  const foldThreshold = device === 'mobile' ? 3 : 5;
  const rawLines = safeContent.split('\n');
  const hasMultipleLines = rawLines.length > foldThreshold;
  const aboveFoldLines = hasMultipleLines ? rawLines.slice(0, foldThreshold) : rawLines;
  const belowFoldLines = hasMultipleLines ? rawLines.slice(foldThreshold) : [];

  return (
    <div className="card p-0 overflow-hidden flex flex-col sticky top-20 border border-border shadow-xs bg-card">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">Post Preview</h3>
          {visualFormat && visualFormat !== 'none' && (
            <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
              {visualFormat}
            </span>
          )}
        </div>

        {/* Device Switcher (Mobile vs Desktop) */}
        <div className="flex items-center rounded-lg border border-gray-200 p-0.5 bg-white">
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded transition-all ${
              device === 'mobile'
                ? 'border border-[#0a66c2] text-[#0a66c2] bg-sky-50/80 shadow-xs'
                : 'text-gray-400 hover:text-gray-600 border border-transparent'
            }`}
            title="Mobile preview (fold at 3 lines)"
            aria-label="Mobile preview"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded transition-all ${
              device === 'desktop'
                ? 'border border-[#0a66c2] text-[#0a66c2] bg-sky-50/80 shadow-xs'
                : 'text-gray-400 hover:text-gray-600 border border-transparent'
            }`}
            title="Desktop preview (fold at 5 lines)"
            aria-label="Desktop preview"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LinkedIn Feed Canvas */}
      <div className="bg-[#f4f2ee] p-3 sm:p-5 transition-all">
        <div className={`transition-all duration-200 ${device === 'mobile' ? 'max-w-[380px] mx-auto' : 'w-full'}`}>
          {/* Post Card */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden">
            {/* Header: Author Info */}
            <div className="p-3.5 flex items-start gap-3">
              {/* Avatar with cyan-to-blue gradient ring */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full p-[2.5px] bg-gradient-to-tr from-[#00A0DC] via-[#0077B5] to-[#0A66C2]">
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
              </div>

              {/* Author text info */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[14.5px] font-semibold text-[#191919] hover:text-[#0a66c2] cursor-pointer transition-colors leading-tight">
                    {authorName}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 leading-snug line-clamp-1 mt-0.5">
                  {authorHeadline}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[11.5px] text-gray-500">
                  <span>12h</span>
                  <span>·</span>
                  <Globe className="w-3.5 h-3.5 text-gray-500 inline-block" />
                </div>
              </div>

              {/* Options menu */}
              <button
                type="button"
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                aria-label="More options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-3.5 pb-3">
              {isGenerating ? (
                <div className="space-y-2 py-1">
                  {[100, 92, 96, 84, 88].map((w, i) => (
                    <div
                      key={`skel-line-${i}`}
                      className="animate-pulse bg-gray-100 rounded h-3.5"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              ) : safeContent.trim() ? (
                <div className="text-[14px] sm:text-[14.5px] leading-[1.45] text-[#191919] font-normal break-words">
                  {/* Above fold content */}
                  <div className="space-y-1">
                    {aboveFoldLines.map((line, i) => (
                      <p key={`above-${i}`} className="min-h-[1.4em]">
                        {renderFormattedLine(line)}
                      </p>
                    ))}
                  </div>

                  {/* Fold indicator if content is long */}
                  {hasMultipleLines && (
                    <div className="my-2.5">
                      <div className="flex items-center justify-end text-[13px] font-medium text-gray-500 mb-1">
                        <span className="hover:text-[#0a66c2] cursor-pointer font-semibold">...more</span>
                      </div>
                      <div className="relative">
                        <div className="border-t border-dashed border-gray-300 w-full" />
                        <span className="absolute -top-2 left-2 bg-white px-1.5 text-[10px] text-gray-400 select-none">
                          {device === 'mobile' ? 'Mobile fold (~3 lines)' : 'Desktop fold (~5 lines)'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Below fold content */}
                  {belowFoldLines.length > 0 && (
                    <div className="space-y-1 mt-2 text-gray-700">
                      {belowFoldLines.map((line, i) => (
                        <p key={`below-${i}`} className="min-h-[1.4em]">
                          {renderFormattedLine(line)}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* CTA if supplied */}
                  {cta && (
                    <p className="mt-2.5 text-xs font-semibold text-[#0a66c2] border-l-2 border-[#0a66c2] pl-2 italic">
                      {cta}
                    </p>
                  )}

                  {/* Hashtags row */}
                  {safeHashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {safeHashtags.map((tag) => (
                        <span
                          key={`tag-${tag}`}
                          className="text-[13px] text-[#0a66c2] font-medium hover:underline cursor-pointer"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Default authentic placeholder matching user screenshot */
                <div className="space-y-2.5 text-[14px] sm:text-[14.5px] leading-[1.45] text-[#191919] select-none py-0.5">
                  <p>Start writing and your post will appear here..</p>
                  <div className="flex items-center justify-between">
                    <p>
                      You can add images, links,{' '}
                      <span className="text-[#0a66c2] font-medium hover:underline cursor-pointer">#hashtags</span> and
                      emojis 🤩
                    </p>
                    <span className="text-gray-500 font-medium hover:text-[#0a66c2] cursor-pointer text-[13px] shrink-0 ml-2">
                      ...more
                    </span>
                  </div>
                  <div className="relative py-1">
                    <div className="border-t border-dashed border-gray-300 w-full" />
                  </div>
                  <p className="text-gray-700">This line will appear below the more...</p>
                </div>
              )}
            </div>

            {/* Visual Media Attachment */}
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
              <div className="border-t border-gray-100 bg-neutral-900/5">
                <img
                  src={imageUrl}
                  alt="LinkedIn post attachment"
                  className="w-full object-cover max-h-[380px]"
                />
              </div>
            )}

            {/* Engagement Metrics Row */}
            <div className="px-3.5 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              {/* Stacked reaction badges */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center text-white ring-1 ring-white">
                    <ThumbsUp className="w-2.5 h-2.5 fill-white" />
                  </span>
                  <span className="w-4 h-4 rounded-full bg-[#df704d] flex items-center justify-center text-white ring-1 ring-white">
                    <Heart className="w-2.5 h-2.5 fill-white" />
                  </span>
                </div>
                <span className="font-normal text-gray-600">{isLiked ? 58 : 57}</span>
              </div>

              <div className="text-gray-500">
                <span>24 comments</span>
                <span className="mx-1">·</span>
                <span>6 reposts</span>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="px-1 py-1 border-t border-gray-100 flex items-center">
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold rounded-md transition-colors ${
                  isLiked ? 'text-[#0a66c2] bg-sky-50/60' : 'text-[#5e5e5e] hover:bg-gray-100/80'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[#0a66c2]' : ''}`} />
                Like
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold text-[#5e5e5e] hover:bg-gray-100/80 rounded-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Comment
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold text-[#5e5e5e] hover:bg-gray-100/80 rounded-md transition-colors"
              >
                <Repeat2 className="w-4 h-4" />
                Repost
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold text-[#5e5e5e] hover:bg-gray-100/80 rounded-md transition-colors"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Character Counter Progress Bar */}
      <div className="px-4 py-2.5 bg-white border-t border-gray-200 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              safeContent.length > 2700
                ? 'bg-rose-500'
                : safeContent.length > 2400
                  ? 'bg-amber-500'
                  : 'bg-[#0a66c2]'
            }`}
            style={{ width: `${Math.min((safeContent.length / 3000) * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 font-medium tabular-nums shrink-0">
          {safeContent.length}/3000
        </span>
      </div>
    </div>
  );
}

