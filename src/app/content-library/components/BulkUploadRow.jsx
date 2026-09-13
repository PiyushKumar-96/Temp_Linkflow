'use client';

import React from 'react';
import {
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
  isOutstanding,
  missingFields = {},
  onUpdatePost,
  onRemovePost,
  onSelectFormat,
  onGenerateImage,
  onImageFileUpload,
  onPdfFileUpload,
  onPreviewPost,
}) {
  const currentFormat =
    post.visualFormat === 'pdf' ? 'pdf' : post.visualFormat === 'image' ? 'image' : 'post';

  return (
    <tr
      className={`transition-colors ${
        isOutstanding ? 'lib-row-outstanding' : 'hover:bg-[color:var(--track-warm)]'
      }`}
    >
      {/* Header / Title */}
      <td className="lib-bulk-cell-title">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={post.header}
            onChange={(e) => onUpdatePost(post.id, { header: e.target.value })}
            placeholder="Post header / title..."
            className="w-full bg-transparent text-sm font-semibold text-[color:var(--text)] outline-none border-b border-transparent hover:border-[color:var(--border)] focus:border-[color:var(--brand)] transition-colors py-0.5"
          />
          {missingFields.header && (
            <span className="lib-cell-hint">Needs a title</span>
          )}
        </div>
      </td>

      {/* Post Content & Hashtags */}
      <td className="lib-bulk-cell-content">
        <div className="flex flex-col gap-1.5">
          <textarea
            value={post.content}
            onChange={(e) => onUpdatePost(post.id, { content: e.target.value })}
            placeholder="Write post content hook & body..."
            rows={3}
            className="w-full bg-transparent text-xs text-[color:var(--text)] outline-none border border-transparent hover:border-[color:var(--border)] focus:border-[color:var(--brand)] focus:bg-[color:var(--card)] rounded-[var(--radius-input)] p-1.5 transition-colors resize-none leading-relaxed"
          />
          {missingFields.content && (
            <span className="lib-cell-hint">Needs post content</span>
          )}
          <input
            type="text"
            value={post.hashtags}
            onChange={(e) => onUpdatePost(post.id, { hashtags: e.target.value })}
            placeholder="#hashtags..."
            className="w-full bg-transparent text-[11px] text-[color:var(--text-muted)] font-medium outline-none border-b border-transparent hover:border-[color:var(--border)] focus:border-[color:var(--brand)] transition-colors px-1 py-0.5"
          />
        </div>
      </td>

      {/* Scheduled Slot (Single Box Container with Divider) */}
      <td className="lib-bulk-cell-slot">
        <div className="flex flex-col gap-1">
          <div className="lib-slot-container">
            <input
              type="date"
              value={post.scheduledDate || ''}
              onChange={(e) => onUpdatePost(post.id, { scheduledDate: e.target.value })}
              className="lib-slot-date"
              aria-label="Scheduled date"
            />
            <span className="lib-slot-divider" aria-hidden="true" />
            <input
              type="time"
              value={post.scheduledTime || ''}
              onChange={(e) => onUpdatePost(post.id, { scheduledTime: e.target.value })}
              className="lib-slot-time"
              aria-label="Scheduled time"
            />
          </div>
          {missingFields.slot && (
            <span className="lib-cell-hint">
              {!post.scheduledDate && !post.scheduledTime
                ? 'No slot set'
                : !post.scheduledDate
                  ? 'No date set'
                  : 'No time set'}
            </span>
          )}
        </div>
      </td>

      {/* Format & Media (Text only, Image, PDF) */}
      <td className="lib-bulk-cell-format">
        <div className="flex flex-col gap-2">
          {/* Neutral Format Toggle: Text only vs Image vs PDF */}
          <div className="lib-format-toggle" role="group" aria-label="Visual format">
            <button
              type="button"
              onClick={() => onSelectFormat(post.id, 'post')}
              className="lib-format-btn"
              aria-pressed={currentFormat === 'post'}
              title="Post with text only (no media)"
            >
              <span>Text only</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectFormat(post.id, 'image')}
              className="lib-format-btn"
              aria-pressed={currentFormat === 'image'}
              title="Post with single image visual"
            >
              <ImageIcon size={12} />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectFormat(post.id, 'pdf')}
              className="lib-format-btn"
              aria-pressed={currentFormat === 'pdf'}
              title="Post with multi-page PDF document"
            >
              <FileText size={12} />
              <span>PDF</span>
            </button>
          </div>

          {/* Outstanding in-place hint for media */}
          {missingFields.media && (
            <span className="lib-cell-hint">
              {currentFormat === 'image' ? 'Needs an image' : 'Needs a PDF'}
            </span>
          )}

          {/* Loading status */}
          {generatingId === post.id && (
            <div className="flex items-center gap-1.5 text-xs text-[color:var(--text-muted)] font-medium">
              <Loader2 size={12} className="animate-spin text-[color:var(--text-subtle)]" />
              <span>Generating AI image...</span>
            </div>
          )}

          {/* IMAGE Mode */}
          {generatingId !== post.id && currentFormat === 'image' && (
            <div className="flex items-center gap-2 flex-wrap">
              {post.imageUrl ? (
                <div className="flex items-center gap-2">
                  <img
                    src={post.imageUrl}
                    alt={post.imageAlt || 'Post image'}
                    className="w-9 h-9 rounded-[var(--radius-input)] object-cover border border-[color:var(--border)] shrink-0 bg-[color:var(--chip)]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-[color:var(--text)] font-semibold">
                      {post.imageStatus === 'provided' ? 'Uploaded image' : 'AI image ready'}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <label className="text-[11px] text-[color:var(--text-muted)] hover:text-[color:var(--text)] cursor-pointer flex items-center gap-0.5 font-medium">
                        <Upload size={10} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onImageFileUpload(post.id, e)}
                        />
                      </label>
                      <span className="text-[color:var(--text-subtle)]">·</span>
                      <button
                        type="button"
                        onClick={() => onGenerateImage(post.id)}
                        className="text-[11px] text-[color:var(--text-muted)] hover:text-[color:var(--text)] cursor-pointer flex items-center gap-0.5 font-medium"
                        title="Regenerate with AI"
                      >
                        <Sparkles size={10} />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onGenerateImage(post.id)}
                    className="lib-btn text-xs h-7 px-2.5 flex items-center gap-1 font-medium shadow-xs"
                  >
                    <Sparkles size={11} className="text-[color:var(--text-subtle)]" />
                    <span>Generate AI</span>
                  </button>
                  <label className="lib-btn text-xs h-7 px-2.5 flex items-center gap-1 font-medium cursor-pointer shadow-xs">
                    <Upload size={11} className="text-[color:var(--text-subtle)]" />
                    <span>Upload image</span>
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

          {/* PDF Mode */}
          {generatingId !== post.id && currentFormat === 'pdf' && (
            <div>
              {post.pdfName || (post.carouselSlides && post.carouselSlides.length > 0) ? (
                <div className="lib-attached-chip">
                  <div className="lib-attached-badge">
                    PDF
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[color:var(--text)] truncate max-w-[130px]">
                      {post.pdfName || `${(post.header || 'Document').slice(0, 18)}.pdf`}
                    </span>
                    <span className="text-[11px] text-[color:var(--text-muted)] tabular-nums">
                      {post.pdfPages || (post.carouselSlides ? post.carouselSlides.length : 5)}{' '}
                      pages
                    </span>
                  </div>
                  <label
                    className="text-[11px] text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:underline cursor-pointer flex items-center gap-0.5 ml-auto font-medium shrink-0"
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
                <label className="lib-btn text-xs h-8 px-3 flex items-center gap-1.5 font-medium cursor-pointer shadow-xs w-fit">
                  <FileText size={13} className="text-[color:var(--text-subtle)]" />
                  <span>Upload PDF</span>
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

      {/* Actions (Pinned right) */}
      <td className="lib-bulk-cell-actions">
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => onPreviewPost(post)}
            className="lib-btn text-xs h-8 px-3 flex items-center gap-1.5 hover:border-[color:var(--brand)] transition-colors shadow-xs cursor-pointer font-medium"
            title="Preview how this post looks on LinkedIn"
          >
            <Eye size={12} className="text-[color:var(--text-subtle)]" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => onRemovePost(post.id)}
            className="p-1.5 rounded-[var(--radius-icon-btn)] hover:bg-[color:var(--chip)] text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors cursor-pointer"
            title="Delete row"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
