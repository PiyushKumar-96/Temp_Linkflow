'use client';

import React from 'react';
import { FileText, Type, CheckCircle2 } from 'lucide-react';

export default function TextOnlyVisual({ content = '' }) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[360px] mx-auto">
      {/* Editorial Typography Card */}
      <div className="p-6 rounded-xl border border-border/80 bg-muted/20 shadow-xs flex flex-col justify-between min-h-[180px]">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <FileText size={13} className="text-primary" />
            <span>Text-Only Publication</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
            Zero Media
          </span>
        </div>

        <div className="py-4">
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            &ldquo;Text-only posts generate up to 2.4x more in-depth comment discussions by placing 100% of reader attention on the written hook and insight.&rdquo;
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/60">
          <span>Optimized for LinkedIn Feed</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 size={11} /> High Contrast Hook
          </span>
        </div>
      </div>
    </div>
  );
}
