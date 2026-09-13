'use client';

import React from 'react';
import { Bell, Briefcase, Home, MessageSquare, Search, Users } from 'lucide-react';

const DESKTOP_NAV_ITEMS = [
  { icon: Home, active: true },
  { icon: Users },
  { icon: Briefcase },
  { icon: MessageSquare },
  { icon: Bell },
];

/**
 * The feed hugs its content between MIN and MAX rather than sitting at a fixed
 * height. A short draft used to leave ~155px of empty grey inside the lid, which
 * read as a rendering fault rather than as an empty feed. The stage wrapping this
 * frame is a fixed height, so the device growing or shrinking never moves anything
 * below it on the page.
 */
// The lid interior is 464px wide, so a true MacBook 16:10 screen is 290px tall.
// The LinkedIn nav takes 38 of that, leaving 252 for the feed. Going taller than
// this makes the lid read as a monitor rather than a laptop.
const FEED_H = 252;

/** Feed filler, so a single short draft doesn't sit above empty grey. */
function GhostPost() {
  return (
    <div
      aria-hidden="true"
      style={{
        marginTop: 8,
        borderRadius: 8,
        background: '#fff',
        padding: 14,
        opacity: 0.55,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e6e4e0' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 9, width: '38%', borderRadius: 4, background: '#e6e4e0' }} />
          <div style={{ height: 8, width: '60%', borderRadius: 4, background: '#efedea', marginTop: 6 }} />
        </div>
      </div>
      {[97, 90, 76].map((w) => (
        <div
          key={w}
          style={{ height: 8, width: `${w}%`, borderRadius: 4, background: '#efedea', marginTop: 8 }}
        />
      ))}
    </div>
  );
}

export function LaptopPreview({ children, avatarUrl }) {
  return (
    <div
      style={{
        position: 'relative',
        margin: '0 auto',
        width: 480,
        maxWidth: '100%',
      }}
    >
      {/* ── MacBook Space Black lid casing ── */}
      <div
        style={{
          background: 'linear-gradient(175deg, #2a2a2a 0%, #1a1a1a 55%, #111 100%)',
          borderRadius: '12px 12px 0 0',
          padding: '6px 8px 0 8px',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.08),' +
            '0 -1px 0 rgba(0,0,0,0.5),' +
            '0 22px 52px -14px rgba(0,0,0,0.55)',
        }}
      >
        {/* Camera */}
        <div
          style={{
            height: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 3,
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 35%, #3a3a3a, #1a1a1a)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 1px rgba(0,0,0,0.6)',
            }}
          />
        </div>

        {/* Screen inside lid — black thin bezel */}
        <div
          style={{
            borderRadius: '7px 7px 0 0',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.5)',
            background: '#000',
          }}
        >
          {/* LinkedIn nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 38,
              padding: '0 10px',
              background: '#fff',
              borderBottom: '1px solid #e9e9e9',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: '#0a66c2',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '-0.5px',
                }}
              >
                in
              </div>
              <div
                style={{
                  width: 100,
                  height: 24,
                  background: '#f3f2ef',
                  borderRadius: 4,
                  padding: '0 7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: '#8c8c8c',
                  fontSize: 10.5,
                }}
              >
                <Search size={10} style={{ flexShrink: 0 }} />
                <span>Search</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {DESKTOP_NAV_ITEMS.map(({ icon: Icon, active }, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    color: active ? '#191919' : 'var(--text-subtle)',
                  }}
                >
                  <Icon size={14} strokeWidth={active ? 2.2 : 1.7} />
                  <span
                    style={{
                      height: 2,
                      width: 12,
                      borderRadius: 1,
                      background: active ? '#191919' : 'transparent',
                    }}
                  />
                </div>
              ))}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{ width: 20, height: 20, borderRadius: '50%', background: '#e2e8f0' }}
                />
              )}
            </div>
          </div>

          {/* Feed — sizes to content, scrolls once past FEED_MAX */}
          <div
            style={{
              height: FEED_H,
              overflowY: 'auto',
              overflowX: 'hidden',
              background: '#f3f2ef',
              padding: '10px 12px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div style={{ maxWidth: 440, margin: '0 auto' }}>
              {children}
              <GhostPost />
            </div>
          </div>
        </div>
      </div>

      {/* Hinge */}
      <div style={{ height: 2, background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)' }} />

      {/* Keyboard base — wider than lid, black */}
      <div
        style={{
          marginLeft: '-3%',
          width: '106%',
          height: 13,
          background: 'linear-gradient(180deg, #222 0%, #141414 100%)',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 8px 24px -6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 2,
        }}
      >
        <div
          style={{
            width: 36,
            height: 5,
            background: '#2a2a2a',
            borderRadius: '0 0 3px 3px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
          }}
        />
      </div>
    </div>
  );
}

export default LaptopPreview;