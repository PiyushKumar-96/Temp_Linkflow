'use client';

import React, { useState } from 'react';
import { LayoutGrid, TrendingUp, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const DEFAULT_INFOGRAPHIC_DATA = {
  title: 'The Modern B2B Content Engine',
  metricNumber: '+310%',
  metricLabel: 'Inbound Pipeline Velocity',
  pillars: [
    {
      step: '01',
      title: 'Topic Planning',
      desc: 'Annual roadmaps mapped to audience pain points',
    },
    {
      step: '02',
      title: 'AI Drafting & Audit',
      desc: 'Hook contrast, clarity score, and citation verification',
    },
    {
      step: '03',
      title: 'Buffer Dispatch',
      desc: 'Synchronized publishing with analytics attribution',
    },
  ],
  footerNote: 'Source: LinkedFlow Enterprise Benchmark 2026',
};

export default function InfographicVisual({
  data = DEFAULT_INFOGRAPHIC_DATA,
  onChangeData,
  isEditable = false,
}) {
  const current = data || DEFAULT_INFOGRAPHIC_DATA;

  const handleChange = (field, val) => {
    if (!onChangeData) return;
    onChangeData({ ...current, [field]: val });
  };

  const handlePillarChange = (idx, field, val) => {
    if (!onChangeData) return;
    const newPillars = [...(current.pillars || [])];
    newPillars[idx] = { ...newPillars[idx], [field]: val };
    onChangeData({ ...current, pillars: newPillars });
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[360px] mx-auto">
      {/* Visual Canvas */}
      {current.imageUrl ? (
        <div className="aspect-square max-h-[360px] w-full rounded-xl overflow-hidden shadow-lg border border-border bg-slate-900 flex items-center justify-center relative group">
          <img
            src={current.imageUrl}
            alt={current.title || 'Infographic'}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur text-[10px] uppercase font-mono tracking-wider text-white flex items-center gap-1 font-semibold">
            <LayoutGrid size={11} className="text-primary" />{' '}
            {current.isGif || current.imageUrl?.includes('.gif') ? 'GIF' : 'Infographic'}
          </div>
        </div>
      ) : (
        <div className="aspect-square max-h-[360px] w-full rounded-xl overflow-hidden shadow-lg border border-border bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-5 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-primary flex items-center gap-1 font-semibold">
              <LayoutGrid size={11} /> Framework Infographic
            </span>
            <span className="text-[9px] text-slate-400 font-mono">LinkedFlow Studio</span>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-3 my-auto">
            {/* Title */}
            {isEditable ? (
              <input
                type="text"
                value={current.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs font-bold text-white focus:outline-none"
              />
            ) : (
              <h3 className="text-sm font-extrabold text-white tracking-tight">{current.title}</h3>
            )}

            {/* Stat Callout Banner */}
            <div className="bg-primary/20 border border-primary/40 rounded-lg p-2.5 flex items-center justify-between">
              <div>
                {isEditable ? (
                  <input
                    type="text"
                    value={current.metricNumber}
                    onChange={(e) => handleChange('metricNumber', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-base font-extrabold text-primary w-24"
                  />
                ) : (
                  <span className="text-lg font-black text-primary leading-none block">
                    {current.metricNumber}
                  </span>
                )}
                {isEditable ? (
                  <input
                    type="text"
                    value={current.metricLabel}
                    onChange={(e) => handleChange('metricLabel', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-[10px] text-slate-300 w-full mt-1"
                  />
                ) : (
                  <span className="text-[10px] text-slate-300 font-medium">
                    {current.metricLabel}
                  </span>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-3 gap-1.5">
              {(current.pillars || []).map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded p-2 flex flex-col gap-1"
                >
                  <span className="text-[9px] font-mono text-primary font-bold">{p.step}</span>
                  {isEditable ? (
                    <>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                        className="bg-white/10 border border-white/20 rounded text-[9px] font-bold text-white px-1"
                      />
                      <textarea
                        rows={2}
                        value={p.desc}
                        onChange={(e) => handlePillarChange(idx, 'desc', e.target.value)}
                        className="bg-white/10 border border-white/20 rounded text-[8px] text-slate-300 p-1 resize-none"
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] font-bold text-white leading-tight">{p.title}</p>
                      <p className="text-[8px] text-slate-400 leading-tight">{p.desc}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-[9px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
            <span>{current.footerNote}</span>
            <span className="text-primary font-semibold">Verified Data</span>
          </div>
        </div>
      )}
    </div>
  );
}
