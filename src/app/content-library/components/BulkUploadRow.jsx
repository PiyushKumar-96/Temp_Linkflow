'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  Image as ImageIcon,
  Loader2,
  Eye,
  Trash2,
  Upload,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function BulkUploadRow({
  post,
  idx,
  generatingId,
  onUpdatePost,
  onRemovePost,
  onSelectFormat,
  onGenerateImage,
  onImageFileUpload,
  onPdfFileUpload,
  onPreviewPost,
}) {
  const currentFormat = post.visualFormat === 'pdf' ? 'pdf' : 'image';

  return (
    <tr className="hover:bg-muted/15 transition-colors align-top">
      {/* # Column */}
      <td className="px-3 py-3.5 text-xs text-muted-foreground tabular-nums text-center font-600">
        {idx + 1}
      </td>

      {/* Header / Title */}
      <td className="px-3 py-3.5">
        <input
          type="text"
          value={post.header}
          onChange={(e) => onUpdatePost(post.id, { header: e.target.value })}
          placeholder="Post header / title..."
          className="w-full bg-transparent text-sm font-600 text-foreground outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors py-1"
        />
      </td>

      {/* Post Content */}
      <td className="px-3 py-3.5">
        <textarea
          value={post.content}
          onChange={(e) => onUpdatePost(post.id, { content: e.target.value })}
          placeholder="Write post content hook & body..."
          rows={3}
          className="w-full bg-transparent text-xs text-foreground outline-none border border-transparent hover:border-border/80 focus:border-primary focus:bg-background rounded-md p-1.5 transition-colors resize-none leading-relaxed"
        />
      </td>

      {/* Hashtags */}
      <td className="px-3 py-3.5">
        <input
          type="text"
          value={post.hashtags}
          onChange={(e) => onUpdatePost(post.id, { hashtags: e.target.value })}
          placeholder="#milestone #saas..."
          className="w-full bg-transparent text-xs text-primary font-500 outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors py-1"
        />
      </td>

      {/* Scheduled Slot (Date & Time merged) */}
      <td className="px-3 py-3.5">
        <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
          <div className="flex items-center gap-1.5 text-xs text-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/50">
            <Calendar size={11} className="text-muted-foreground shrink-0" />
            <input
              type="date"
              value={post.scheduledDate}
              onChange={(e) => onUpdatePost(post.id, { scheduledDate: e.target.value })}
              className="bg-transparent text-xs text-foreground outline-none w-full font-500 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/50">
            <Clock size={11} className="text-muted-foreground shrink-0" />
            <input
              type="time"
              value={post.scheduledTime}
              onChange={(e) => onUpdatePost(post.id, { scheduledTime: e.target.value })}
              className="bg-transparent text-xs text-foreground outline-none w-full font-500 cursor-pointer"
            />
          </div>
        </div>
      </td>

      {/* Format & Media (Only Image and PDF options) */}
      <td className="px-3 py-3.5 min-w-[260px]">
        <div className="flex flex-col gap-2.5">
          {/* Format Toggle Buttons: Image vs PDF */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/60 w-fit">
            <button
              type="button"
              onClick={() => onSelectFormat(post.id, 'image')}
              className={`px-2.5 py-1 rounded text-xs font-600 transition-all cursor-pointer flex items-center gap-1.5 ${
                currentFormat === 'image'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-emerald-600'
              }`}
              title="Post with single image visual"
            >
              <ImageIcon size={12} />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectFormat(post.id, 'pdf')}
              className={`px-2.5 py-1 rounded text-xs font-600 transition-all cursor-pointer flex items-center gap-1.5 ${
                currentFormat === 'pdf'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-red-600'
              }`}
              title="Post with multi-page PDF document"
            >
              <FileText size={12} />
              <span>PDF</span>
            </button>
          </div>

          {/* Loading status */}
          {generatingId === post.id && (
            <div className="flex items-center gap-1 text-xs text-primary font-500">
              <Loader2 size={11} className="animate-spin" />
              <span>Generating AI image...</span>
            </div>
          )}

          {/* IMAGE Mode: Options to Generate AI Image OR Upload Image Manually */}
          {generatingId !== post.id && currentFormat === 'image' && (
            <div className="flex items-center gap-2 flex-wrap">
              {post.imageUrl ? (
                <div className="flex items-center gap-2">
                  <img
                    src={post.imageUrl}
                    alt={post.imageAlt || 'Post image'}
                    className="w-9 h-9 rounded-md object-cover border border-border shrink-0 bg-muted shadow-2xs"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-emerald-600 font-600">
                      {post.imageStatus === 'provided' ? 'Uploaded Image' : 'AI Image Ready'}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <label className="text-[11px] text-muted-foreground hover:text-primary cursor-pointer flex items-center gap-0.5 font-500">
                        <Upload size={10} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onImageFileUpload(post.id, e)}
                        />
                      </label>
                      <span className="text-muted-foreground/40">·</span>
                      <button
                        type="button"
                        onClick={() => onGenerateImage(post.id)}
                        className="text-[11px] text-muted-foreground hover:text-emerald-600 cursor-pointer flex items-center gap-0.5 font-500"
                        title="Regenerate with AI"
                      >
                        <Sparkles size={10} />
                        <span>AI Gen</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onGenerateImage(post.id)}
                    className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-600 cursor-pointer shadow-2xs"
                  >
                    <Sparkles size={11} />
                    <span>Generate AI</span>
                  </button>
                  <label className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 text-foreground font-600 cursor-pointer shadow-2xs">
                    <Upload size={11} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onImageFileUpload(post.id, e)}
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {/* PDF Mode: Manual PDF File Upload Only */}
          {generatingId !== post.id && currentFormat === 'pdf' && (
            <div>
              {post.pdfName || (post.carouselSlides && post.carouselSlides.length > 0) ? (
                <div className="flex items-center gap-2 bg-red-50/70 border border-red-200/80 px-2.5 py-1.5 rounded-lg shadow-2xs">
                  <div className="w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs">
                    PDF
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-600 text-foreground truncate max-w-[130px]">
                      {post.pdfName || `${(post.header || 'Document').slice(0, 18)}.pdf`}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {post.pdfPages || (post.carouselSlides ? post.carouselSlides.length : 5)} pages · Multi-slide
                    </span>
                  </div>
                  <label
                    className="text-[11px] text-red-600 hover:underline cursor-pointer flex items-center gap-0.5 ml-auto font-600 shrink-0"
                    title="Upload different PDF file"
                  >
                    <Upload size={10} />
                    <span>Replace</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => onPdfFileUpload(post.id, e)}
                    />
                  </label>
                </div>
              ) : (
                <label className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-dashed border-red-300 hover:border-red-500 bg-red-50/40 text-red-700 hover:bg-red-50 transition-all font-600 cursor-pointer shadow-2xs w-fit">
                  <FileText size={13} className="text-red-600" />
                  <span>Upload PDF Document</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => onPdfFileUpload(post.id, e)}
                  />
                </label>
              )}
            </div>
          )}
        </div>
      </td>

      {/* Actions (Only Preview and Delete — View button removed) */}
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => onPreviewPost(post)}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 hover:text-primary hover:border-primary/40 transition-colors shadow-2xs cursor-pointer font-600"
            title="Preview how this post looks on LinkedIn"
          >
            <Eye size={12} className="text-primary" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => onRemovePost(post.id)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            title="Delete row"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}
