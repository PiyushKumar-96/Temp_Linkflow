'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Plus, RefreshCw, Sparkles, Trash2, Upload } from 'lucide-react';

// Steps are paced by elapsed time. The last step holds until the images
// actually arrive, so the UI never claims to be finished before it is.
export const GEN_STEPS = [
  { at: 0, label: 'Reading your post' },
  { at: 2000, label: 'Sketching layouts' },
  { at: 4500, label: 'Rendering details' },
  { at: 7500, label: 'Finishing up' },
];

const NOISE_BY_STEP = [0.5, 0.38, 0.27, 0.18];

export function getGenStep(elapsed) {
  let step = 0;
  GEN_STEPS.forEach((s, i) => {
    if (elapsed >= s.at) step = i;
  });
  return step;
}

export function useElapsed(startedAt) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) {
      setElapsed(0);
      return undefined;
    }
    setElapsed(Date.now() - startedAt);
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => clearInterval(id);
  }, [startedAt]);
  return elapsed;
}

function formatElapsed(ms) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function DevelopingImage({ src, alt, onLoaded }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) onLoaded(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      draggable={false}
      className="cmp-gen-img"
      onLoad={() => onLoaded(src)}
      onError={() => onLoaded(src)}
    />
  );
}

// One tile. Renders the "forming" placeholder until `src` exists AND has loaded,
// so a slow API and a slow image download look like the same continuous process.
export function GenTile({ src, alt = '', index = 0, step = 0, reveal = 'develop', className = '', children }) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const developed = Boolean(src) && loadedSrc === src;

  return (
    <div
      className={`cmp-gen-tile ${developed ? 'is-developed' : ''} ${className}`}
      data-reveal={reveal}
      style={{ '--i': index, '--noise': NOISE_BY_STEP[step] ?? 0.2 }}
      aria-busy={!developed}
    >
      <div className="cmp-gen-field" aria-hidden="true">
        <span className="cmp-gen-blob b1" />
        <span className="cmp-gen-blob b2" />
        <span className="cmp-gen-blob b3" />
      </div>
      {src && <DevelopingImage key={src} src={src} alt={alt} onLoaded={setLoadedSrc} />}
      <span className="cmp-gen-grain" aria-hidden="true" />
      <span className="cmp-gen-sweep" aria-hidden="true" />
      {children}
    </div>
  );
}

export function GenProgress({ step, elapsed, count = 3, onCancel }) {
  return (
    <div className="cmp-gen-head">
      <span className="cmp-badge tone-violet cmp-gen-badge" aria-hidden="true">
        <Sparkles size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="cmp-gen-title">Creating {count} image options</p>
          <span className="cmp-gen-time" aria-hidden="true">
            {formatElapsed(elapsed)}
          </span>
        </div>
        <p className="cmp-gen-step" aria-live="polite">
          <span key={step} className="m-swap">
            {GEN_STEPS[step].label}
          </span>
        </p>
        <div className="cmp-gen-bar" style={{ '--steps': GEN_STEPS.length }} aria-hidden="true">
          {GEN_STEPS.map((s, i) => (
            <span key={s.label} className={i < step ? 'is-done' : i === step ? 'is-current' : ''} />
          ))}
        </div>
        <p className="mt-2 text-[12px] cmp-muted">Usually takes 10–20 seconds. You can keep editing your post.</p>
      </div>
      {onCancel && (
        <button type="button" className="cmp-link-btn shrink-0 mt-0.5" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
}

function UploadTile({ onUpload }) {
  const inputRef = useRef(null);
  const [isOver, setIsOver] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`cmp-drop ${isOver ? 'is-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onUpload(file);
        }}
      >
        <svg className="cmp-drop-border" aria-hidden="true">
          <rect x="0" y="0" width="100%" height="100%" rx="14" ry="14" />
        </svg>
        <span className="cmp-drop-plus" aria-hidden="true">
          {isOver ? <Upload size={16} /> : <Plus size={16} />}
        </span>
        <span>
          <strong>{isOver ? 'Drop to upload' : 'Upload image'}</strong>
          PNG, JPG or WEBP, up to 10 MB
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = '';
        }}
      />
    </>
  );
}

export default function ImageOptions({
  images = [],
  imageUrl,
  generation,
  revealMode = 'develop',
  canGenerate,
  onSelect,
  onRemove,
  onUpload,
  onGenerate,
  onCancel,
}) {
  const pending = Boolean(generation);
  const elapsed = useElapsed(generation?.startedAt);
  const step = getGenStep(elapsed);
  const uploads = images.filter((img) => img.source !== 'ai');
  const generated = images.filter((img) => img.source === 'ai');
  const placeholderCount = generation?.count ?? 3;

  // Pending placeholders and the generated results share keys (gen-0, gen-1…),
  // so each tile stays mounted and develops in place when its image arrives.
  const tiles = pending
    ? [...uploads, ...Array.from({ length: placeholderCount }, (_, i) => ({ slotKey: `gen-${i}`, source: 'ai', pending: true }))]
    : [...uploads, ...generated];

  return (
    <div>
      {pending ? (
        <GenProgress step={step} elapsed={elapsed} count={placeholderCount} onCancel={onCancel} />
      ) : (
        tiles.length > 0 && (
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-[13px] cmp-muted">
              {tiles.length > 1 ? 'Choose the image for your post.' : 'This image will be attached to your post.'}
            </p>
            {generated.length > 0 && (
              <button type="button" className="cmp-link-btn" onClick={onGenerate} disabled={!canGenerate}>
                <RefreshCw size={14} />
                Regenerate
              </button>
            )}
          </div>
        )
      )}

      <div className="cmp-tiles">
        {tiles.map((img, i) => {
          const key = img.slotKey || img.id || img.url;
          const selected = !img.pending && img.url === imageUrl;
          const genIndex = img.source === 'ai' ? Number(String(img.slotKey || '').split('-')[1] || i) : 0;
          return (
            <div key={key} className={`cmp-tile ${selected ? 'is-selected' : ''}`}>
              <GenTile
                src={img.pending ? undefined : img.url}
                alt={img.alt || 'Image option'}
                index={genIndex}
                step={step}
                reveal={img.source === 'ai' ? revealMode : 'quick'}
              />
              {!img.pending && (
                <>
                  <button
                    type="button"
                    className="cmp-tile-select"
                    aria-pressed={selected}
                    aria-label={`Use ${img.alt || `image ${i + 1}`}`}
                    onClick={() => onSelect(img.url)}
                  />
                  {selected && (
                    <span className="cmp-tile-check" aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  )}
                  <button
                    type="button"
                    className="cmp-tile-remove"
                    aria-label={`Remove ${img.alt || `image ${i + 1}`}`}
                    onClick={() => onRemove(img.url)}
                  >
                    <Trash2 size={14} />
                  </button>
                  <span className="cmp-tile-source">{img.source === 'ai' ? 'AI' : 'Uploaded'}</span>
                </>
              )}
            </div>
          );
        })}

        {!pending && tiles.length === 0 && (
          <button type="button" className="cmp-gen-cta" onClick={onGenerate} disabled={!canGenerate}>
            <span className="cmp-drop-plus" aria-hidden="true">
              <Sparkles size={16} />
            </span>
            <span>
              <strong>Create with AI</strong>
              Generate 3 visual options
            </span>
          </button>
        )}

        <UploadTile onUpload={onUpload} />
      </div>
    </div>
  );
}
