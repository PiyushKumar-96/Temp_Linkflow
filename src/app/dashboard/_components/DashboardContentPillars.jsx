'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel, CornerArrowButton } from './DashboardPrimitives';

const DEFAULT_PILLARS = [
  { id: 'pillar-1', name: 'Thought leadership', current: 12, target: 15, account: 'Personal profile', color: '#0A66C2' },
  { id: 'pillar-2', name: 'Case studies & proof', current: 6, target: 8, account: 'Company page', color: '#1B1B1F' },
  { id: 'pillar-3', name: 'Engineering culture', current: 5, target: 6, account: 'Company page', color: '#1B1B1F' },
  { id: 'pillar-4', name: 'Industry insights', current: 4, target: 5, account: 'Personal profile', color: '#1B1B1F' },
];

export default function DashboardContentPillars({ pillars = DEFAULT_PILLARS }) {
  const navigate = useNavigate();

  const totalPlanned = pillars.reduce((acc, p) => acc + p.current, 0);
  const totalTarget = pillars.reduce((acc, p) => acc + p.target, 0);
  const balance = totalTarget ? Math.round((totalPlanned / totalTarget) * 100) : 79;
  const healthy = balance >= 75;

  return (
    <Panel className="flex h-full flex-col justify-between p-5 sm:p-6">
      {/* Header: Title + Neutral Corner ↗ button */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-[#1B1B1F]">
          Content pillars
        </h3>
        <CornerArrowButton
          onClick={() => navigate('/topics')}
          label="Manage topics"
        />
      </div>

      {/* Hero number: 79% with muted "of target" */}
      <div className="mt-2 flex items-baseline gap-2.5">
        <span className="text-4xl sm:text-[48px] font-semibold leading-none tabular-nums text-[#1B1B1F] tracking-tight">
          {balance}%
        </span>
        <span className="text-xs sm:text-sm font-medium text-[#6B6B70]">
          of target
        </span>
      </div>

      {/* Pillars list: neutral #E4E2DC tracks, ink fills, top pillar in blue */}
      <ul className="my-auto flex flex-col gap-3 py-2">
        {pillars.map((pillar) => {
          const pct = Math.min(100, Math.round((pillar.current / pillar.target) * 100));

          return (
            <li key={pillar.id}>
              <button
                type="button"
                onClick={() => navigate(`/topics?series=${encodeURIComponent(pillar.name)}`)}
                className="group w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] rounded-xl p-1 -m-1"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-xs font-semibold text-[#1B1B1F] transition-colors group-hover:text-[#0A66C2]">
                      {pillar.name}
                    </span>
                    <span className="text-[11px] text-[#6B6B70]">
                      {pillar.account}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-[#6B6B70]">
                    <strong className="font-bold text-[#1B1B1F]">{pillar.current}</strong>/{pillar.target}
                  </span>
                </div>

                {/* Thick (10px) rounded progress bar: neutral track #E4E2DC */}
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#E4E2DC]">
                  <div
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pillar.color,
                    }}
                    className="h-full rounded-full transition-[width] duration-600 ease-out"
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer: 27 of 34 monthly posts planned + Mint pill for Cadence healthy */}
      <div className="flex items-center justify-between border-t border-[#E4E2DC] pt-3 text-xs text-[#6B6B70]">
        <span>
          <span className="font-semibold text-[#1B1B1F] tabular-nums">{totalPlanned}</span> of {totalTarget} monthly posts planned
        </span>
        <span className="inline-flex items-center rounded-full bg-[#E6F4EC] px-2.5 py-0.5 text-[11px] font-semibold text-[#0F8A5F]">
          {healthy ? 'Cadence healthy' : 'Behind plan'}
        </span>
      </div>
    </Panel>
  );
}
