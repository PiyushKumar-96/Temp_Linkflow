import React, { useState } from 'react';
import {
  Bell,
  Briefcase,
  Globe,
  Heart,
  Home,
  Lock,
  MessageSquare,
  Monitor,
  MoreHorizontal,
  Plus,
  Repeat2,
  Search,
  Send,
  Smartphone,
  ThumbsUp,
  Users,
  Wifi,
} from 'lucide-react';

const LINKEDIN_BLUE = '#0a66c2';

const AVATAR =
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80';

const SAMPLE_TEXT = `Three years ago I couldn't get a single reply to cold outreach. Today our pipeline is 80% inbound.

Here's the shift that made the difference: we stopped selling the product and started sharing the problem-solving process behind it.

Every post is now a small case study — what broke, what we tried, what actually worked. No hype, just the work.

If you're building in public, the process is the pitch.`;

function renderFormatted(text) {
  return text.split(/(#[A-Za-z0-9_]+)/g).map((part, i) =>
    part.startsWith('#') ? (
      <span key={i} style={{ color: LINKEDIN_BLUE }} className="font-semibold">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/* ---------- shared post card ---------- */

function PostImage() {
  return (
    <div className="border-t border-gray-100 h-40 relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 flex items-end p-4">
      <div className="flex items-end gap-1.5">
        {[14, 24, 18, 32, 26, 38].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-t bg-white/80"
            style={{ height: `${h * 2}px`, opacity: 0.55 + i * 0.07 }}
          />
        ))}
      </div>
      <span className="absolute top-3 left-4 text-white text-xs font-semibold tracking-wide">
        Q3 pipeline growth
      </span>
    </div>
  );
}

function EngagementGhost() {
  return (
    <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-slate-400">
      <span className="flex -space-x-1 shrink-0">
        <span className="w-4 h-4 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center">
          <ThumbsUp size={8} className="text-slate-400" />
        </span>
        <span className="w-4 h-4 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center">
          <Heart size={8} className="text-slate-400" />
        </span>
      </span>
      <span className="truncate">Reactions and comments will appear here once you publish</span>
    </div>
  );
}

function ActionBar({ device }) {
  const actions = [
    { icon: ThumbsUp, label: 'Like' },
    { icon: MessageSquare, label: 'Comment' },
    { icon: Repeat2, label: 'Repost' },
    { icon: Send, label: 'Send' },
  ];
  return (
    <div className="px-1 border-t border-gray-100 flex items-stretch text-slate-500">
      {actions.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className={`flex-1 flex items-center justify-center gap-1.5 ${
            device === 'mobile' ? 'py-3' : 'flex-col gap-1 py-2.5'
          }`}
        >
          <Icon size={device === 'mobile' ? 19 : 18} strokeWidth={1.8} />
          {device !== 'mobile' && <span className="text-xs font-semibold">{label}</span>}
        </span>
      ))}
    </div>
  );
}

function PostCard({ device, text, expanded, setExpanded }) {
  const foldAt = device === 'mobile' ? 132 : 210;
  const isTruncated = text.length > foldAt;

  return (
    <article className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden w-full">
      <header className="p-3 flex items-start gap-2.5">
        <img src={AVATAR} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
        <div className="min-w-0 pt-0.5 flex-1">
          <p className="text-sm font-semibold leading-tight truncate text-slate-900">Sarah Reeves</p>
          <p className="text-xs text-slate-500 leading-snug mt-0.5 line-clamp-1">
            Growth at Typegrow · Helping you grow on LinkedIn
          </p>
          <p className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
            Now <span>·</span> <Globe size={12} />
          </p>
        </div>
        <MoreHorizontal size={18} className="text-slate-500 shrink-0" />
      </header>

      <div className="px-3 pb-2.5 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap break-words">
        {isTruncated && !expanded ? (
          <>
            {renderFormatted(text.slice(0, foldAt).replace(/\s+$/, ''))}{' '}
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="font-semibold text-slate-500 hover:underline"
            >
              …more
            </button>
          </>
        ) : (
          <>
            {renderFormatted(text)}
            {isTruncated && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="block mt-1 font-semibold text-slate-500 hover:underline"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>

      <PostImage />
      <EngagementGhost />
      <ActionBar device={device} />
    </article>
  );
}

/* ---------- phone frame ---------- */

function PhoneFrame({ children }) {
  const tabs = [
    { icon: Home, label: 'Home', active: true },
    { icon: Users, label: 'Network' },
    { icon: null, label: 'Post', isPost: true },
    { icon: Bell, label: 'Alerts' },
    { icon: Briefcase, label: 'Jobs' },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 shadow-2xl">
        <div className="relative rounded-3xl p-1.5 bg-black">
          <div className="relative overflow-hidden rounded-3xl bg-slate-100 flex flex-col" style={{ height: 600 }}>
            {/* status bar */}
            <div className="relative flex items-center justify-between px-5 pt-2.5 pb-1 bg-white border-b border-slate-100 shrink-0">
              <span className="text-xs font-bold">9:41</span>
              <div className="w-20 h-5 bg-black rounded-full" />
              <div className="flex items-center gap-1.5 text-black">
                <Wifi size={11} strokeWidth={2.5} />
                <div className="w-4 h-2.5 rounded-sm border border-current p-px">
                  <div className="w-full h-full rounded-sm bg-current" />
                </div>
              </div>
            </div>

            {/* app header */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-b border-slate-100 shrink-0">
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-black shrink-0"
                style={{ backgroundColor: LINKEDIN_BLUE }}
              >
                in
              </div>
              <div className="h-7 flex-1 bg-slate-100 rounded-full px-2.5 flex items-center gap-1.5 text-slate-400 min-w-0">
                <Search size={12} className="shrink-0" />
                <span className="text-xs truncate">Search</span>
              </div>
              <MessageSquare size={18} className="text-slate-600 shrink-0" />
            </div>

            {/* feed */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2 bg-slate-100">{children}</div>

            {/* tab bar */}
            <div className="shrink-0 flex items-stretch justify-between px-1 pt-1.5 pb-0.5 bg-white border-t border-slate-100">
              {tabs.map((tab) =>
                tab.isPost ? (
                  <div key="post" className="flex-1 flex flex-col items-center justify-center gap-0.5 py-0.5">
                    <span className="w-5 h-5 rounded border-2 border-slate-800 flex items-center justify-center">
                      <Plus size={12} strokeWidth={3} className="text-slate-800" />
                    </span>
                    <span className="text-xs text-slate-500 font-medium" style={{ fontSize: 9 }}>
                      Post
                    </span>
                  </div>
                ) : (
                  <div
                    key={tab.label}
                    className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-0.5 ${
                      tab.active ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    <tab.icon size={19} strokeWidth={tab.active ? 2.4 : 1.8} fill={tab.active ? 'currentColor' : 'none'} />
                    <span className={tab.active ? 'font-semibold' : ''} style={{ fontSize: 9 }}>
                      {tab.label}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* home indicator */}
            <div className="shrink-0 py-1.5 bg-white flex justify-center">
              <span className="h-1 w-24 rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- laptop frame ---------- */

function LaptopFrame({ children }) {
  const navItems = [
    { icon: Home, active: true },
    { icon: Users },
    { icon: Briefcase },
    { icon: MessageSquare },
    { icon: Bell },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative rounded-t-xl border-8 border-b-0 border-slate-800 bg-slate-950 shadow-2xl">
        <div className="h-3 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* browser chrome */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-mono text-slate-500 max-w-xs w-full justify-center">
            <Lock size={10} className="text-emerald-600 shrink-0" />
            <span className="truncate">linkedin.com/feed</span>
          </div>
          <div className="w-8" />
        </div>

        {/* linkedin top nav */}
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-white font-black text-sm shrink-0"
              style={{ backgroundColor: LINKEDIN_BLUE }}
            >
              in
            </div>
            <div className="hidden sm:flex items-center gap-1.5 h-9 w-40 bg-slate-100 rounded-md px-2.5 text-slate-400 shrink-0">
              <Search size={13} className="shrink-0" />
              <span className="text-xs truncate">Search</span>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {navItems.map(({ icon: Icon, active }, i) => (
              <div key={i} className={`flex flex-col items-center gap-1 ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />
                <span className={`h-0.5 w-5 rounded-full ${active ? 'bg-slate-900' : 'bg-transparent'}`} />
              </div>
            ))}
            <img src={AVATAR} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
          </div>
        </div>

        {/* feed */}
        <div className="overflow-y-auto p-4 bg-slate-100" style={{ height: 440 }}>
          <div className="max-w-md mx-auto">{children}</div>
        </div>
      </div>

      <div className="relative w-full">
        <div className="h-1.5 bg-slate-800 w-full" />
        <div className="h-3 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 rounded-b-xl shadow-md flex items-start justify-center">
          <span className="h-1 w-14 rounded-b bg-slate-500" />
        </div>
      </div>
    </div>
  );
}

/* ---------- demo shell ---------- */

export default function LinkedInPreviewDemo() {
  const [device, setDevice] = useState('desktop');
  const [text, setText] = useState(SAMPLE_TEXT);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Preview</h2>
          <p className="text-xs text-slate-500">How your post will look on LinkedIn</p>
        </div>
        <div className="flex items-center bg-slate-100 rounded-full p-1">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              device === 'desktop' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            <Monitor size={14} /> Web
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              device === 'mobile' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            <Smartphone size={14} /> Phone
          </button>
        </div>
      </div>

      <div className="mb-5">
        {device === 'mobile' ? (
          <PhoneFrame>
            <PostCard device={device} text={text} expanded={expanded} setExpanded={setExpanded} />
          </PhoneFrame>
        ) : (
          <LaptopFrame>
            <PostCard device={device} text={text} expanded={expanded} setExpanded={setExpanded} />
          </LaptopFrame>
        )}
      </div>

      <div className="max-w-lg mx-auto">
        <label className="text-xs font-medium text-slate-500 mb-1 block">Edit the post text to test wrapping</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': LINKEDIN_BLUE }}
        />
      </div>
    </div>
  );
}
