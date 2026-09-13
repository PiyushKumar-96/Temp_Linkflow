'use client';

import React from 'react';
import { Search } from 'lucide-react';

/**
 * The screen hugs its content between MIN and MAX rather than sitting at a fixed
 * 395px. A short draft used to leave ~220px of empty feed below the card, which
 * read as a rendering fault. The stage wrapping this frame is a fixed height, so
 * the device growing or shrinking never moves anything below it on the page.
 *
 * Width is 282px: a 320px-natural card at zoom 0.8 needs 256px of content, plus
 * 5px feed padding, 5px bezel and 3px rim on each side.
 */
// 250 x 510 is ~2.04:1 — a real phone proportion, whole device visible, and short
// enough for the column. Text inside lands at 9.8px, which is deliberate: the phone
// view is for judging shape and line breaks, the Web view is for reading. Trying to
// keep phone text readable forces a ~613px device that dominates the panel.
//
// The feed is always filled — post plus ghost posts — because empty feed grey below
// a short draft reads as a rendering fault, not as an empty feed.
const DEVICE_W = 250;
const SCREEN_H = 494;

/** Feed filler, so a single short draft doesn't sit above 300px of empty grey. */
function GhostPost() {
  return (
    <div
      aria-hidden="true"
      style={{
        marginTop: 6,
        borderRadius: 8,
        background: '#fff',
        padding: 12,
        opacity: 0.55,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e6e4e0' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, width: '46%', borderRadius: 4, background: '#e6e4e0' }} />
          <div style={{ height: 7, width: '68%', borderRadius: 4, background: '#efedea', marginTop: 5 }} />
        </div>
      </div>
      {[96, 88, 72].map((w) => (
        <div
          key={w}
          style={{ height: 7, width: `${w}%`, borderRadius: 4, background: '#efedea', marginTop: 7 }}
        />
      ))}
    </div>
  );
}

export function PhonePreview({ children }) {
  // Dynamic Island is absolutely centred in the status bar — not in a flex row.
  return (
    <div
      style={{
        position: 'relative',
        margin: '0 auto',
        width: DEVICE_W,
        maxWidth: '100%',
      }}
    >
      {/* Outer titanium rim */}
      <div
        style={{
          borderRadius: 44,
          padding: 3,
          background: 'linear-gradient(150deg, #e4e4e7 0%, #a1a1aa 50%, #52525b 100%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.28),' +
            '0 12px 32px -8px rgba(0,0,0,0.55)',
        }}
      >
        {/* Inner black bezel */}
        <div style={{ borderRadius: 41, background: '#080808', padding: 5 }}>
          {/* Screen — fixed, so the device keeps a real phone aspect ratio */}
          <div
            style={{
              borderRadius: 36,
              height: SCREEN_H,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: '#f4f2ee',
            }}
          >
            {/* ── Status bar: time left, island ABSOLUTE centre, icons right ── */}
            <div
              style={{
                flexShrink: 0,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px 5px',
                background: '#ffffff',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: -0.3, zIndex: 1 }}>
                9:41
              </span>

              {/* Dynamic Island — perfectly centred via absolute */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 76,
                  height: 20,
                  borderRadius: 12,
                  background: '#000',
                }}
              />

              {/* Status icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 3.5, zIndex: 1 }}>
                <svg style={{ height: 8, width: 11 }} viewBox="0 0 17 12" fill="currentColor">
                  <rect x="0" y="9" width="2.5" height="3" rx="0.6" />
                  <rect x="4.5" y="6" width="2.5" height="6" rx="0.6" />
                  <rect x="9" y="3" width="2.5" height="9" rx="0.6" />
                  <rect x="13.5" y="0" width="2.5" height="12" rx="0.6" />
                </svg>
                <svg
                  style={{ height: 9, width: 10 }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                </svg>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 15,
                      height: 8,
                      border: '1px solid currentColor',
                      borderRadius: 2,
                      padding: 1,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        background: 'currentColor',
                        borderRadius: 1,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: 1.5,
                      height: 4,
                      background: 'currentColor',
                      borderRadius: '0 1px 1px 0',
                      marginLeft: 1,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── LinkedIn mobile header ── */}
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px',
                background: '#ffffff',
                borderBottom: '1px solid #e9e9e9',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  background: '#0a66c2',
                  color: '#fff',
                  fontSize: 9.5,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '-0.5px',
                  flexShrink: 0,
                }}
              >
                in
              </div>
              <div
                style={{
                  flex: 1,
                  height: 24,
                  background: '#eef3f8',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '0 8px',
                  color: '#8c8c8c',
                  fontSize: 10,
                }}
              >
                <Search size={9.5} style={{ flexShrink: 0 }} />
                <span>Search LinkedIn</span>
              </div>
            </div>

            {/* ── Feed ── (scrollbar hidden) */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '5px 5px 0',
                background: '#f4f2ee',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {children}
              <GhostPost />
              <GhostPost />
            </div>

            {/* ── Home indicator ── */}
            <div
              style={{
                flexShrink: 0,
                padding: '5px 0 7px',
                background: '#f4f2ee',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{ width: 80, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.6)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhonePreview;