'use client';

import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

export default function ApprovalResearchTab({ citations = [] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="text-sm font-700 text-foreground mb-1">
          Verified Research Sources & Citations
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Sources retrieved and evaluated during AI research synthesis.
        </p>

        {citations.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl">
            No external research citations attached to this draft.
          </div>
        ) : (
          <div className="space-y-3">
            {citations.map((src) => (
              <div
                key={src.id}
                className="p-3.5 rounded-lg border border-border bg-muted/20 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-600 text-foreground">{src.sourceName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {src.domain} {src.verifiedDate ? `· ${src.verifiedDate}` : ''}
                    </span>
                    {src.confidence && (
                      <span className="text-[10px] font-600 text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        {src.confidence}% verified
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed italic bg-card p-2.5 rounded border border-border/60">
                  &ldquo;{src.claim}&rdquo;
                </p>
                {src.url && src.url !== '#' && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 w-fit mt-0.5"
                  >
                    <LinkIcon size={11} />
                    <span>View source citation ({src.domain})</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
