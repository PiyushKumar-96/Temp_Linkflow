'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Sparkles,
  Plus,
  AlertTriangle,
  Clock,
  X,
  Shield,
  Building2,
  Settings,
  CalendarClock,
  Sun,
  CloudSun,
  Moon,
} from 'lucide-react';
import { Avatar, Pill, TONES, buttonStyles, formatDayLabel, getGreeting } from './DashboardPrimitives';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n-1',
    icon: AlertTriangle,
    tone: 'rose',
    title: 'Publishing failed',
    body: 'Buffer timed out while sending a post to LinkedIn.',
    time: '4 hours ago',
    route: '/approval-workflow?status=failed',
  },
  {
    id: 'n-2',
    icon: Clock,
    tone: 'amber',
    title: '2 posts waiting for review',
    body: 'Drafts are ready for approval.',
    time: '2 hours ago',
    route: '/approval-workflow?status=awaiting_review',
  },
];

const GREETING_ICONS = { morning: Sun, afternoon: CloudSun, evening: Moon };

export default function DashboardCockpitHeader({ notifications = DEFAULT_NOTIFICATIONS }) {
  const navigate = useNavigate();
  const { user, activeAccount, role } = useAuth();

  const displayName = user?.name || 'Sarah Reeves';
  const firstName = displayName.split(' ')[0] || 'there';
  const displayRole = role === 'owner' ? 'Account owner' : 'Content operations';

  const now = new Date();
  const greeting = getGreeting(now);
  const GreetingIcon = GREETING_ICONS[greeting.period];

  const [isMac, setIsMac] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // ⌘K / Ctrl+K focuses search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/content-library?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const controlBase =
    'h-10 rounded-xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors';

  return (
    <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      {/* Greeting + title */}
      <div className="min-w-0 xl:flex-1">
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
          <GreetingIcon size={15} className="text-amber-500" strokeWidth={2.2} />
          {greeting.text}, {firstName}
        </p>
        <h1 className="mt-1.5 text-[28px] font-bold leading-none tracking-[-0.025em] text-foreground sm:text-[32px]">
          Operations Cockpit
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep your pipeline moving. Review, schedule and publish with confidence.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 xl:shrink-0 xl:items-end">
        <div className="flex flex-wrap items-center gap-2.5 xl:flex-nowrap">
          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className={`${controlBase} flex w-full items-center px-3 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 sm:w-80 xl:w-64 2xl:w-[340px]`}
          >
            <Search size={15} className="mr-2.5 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              id="cockpit-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, topics…"
              aria-label="Search topics, posts and creators"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/80"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="mr-1 grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X size={13} />
              </button>
            ) : (
              <kbd className="ml-2 inline-flex shrink-0 select-none items-center gap-0.5 whitespace-nowrap rounded-md border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-muted-foreground">
                {isMac ? '⌘' : 'Ctrl'} K
              </kbd>
            )}
          </form>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              aria-label={`Notifications, ${notifications.length} new`}
              aria-haspopup="true"
              aria-expanded={showNotifications}
              className={`${controlBase} relative grid w-10 place-items-center text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer`}
            >
              <Bell size={17} />
              {notifications.length > 0 && (
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-card" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <Pill tone="rose">{notifications.length} new</Pill>
                </div>
                <ul className="border-t border-border/60 p-1.5">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <li key={n.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNotifications(false);
                            navigate(n.route);
                          }}
                          className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted/60 cursor-pointer"
                        >
                          <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${TONES[n.tone].chip}`}>
                            <Icon size={15} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[13px] font-semibold text-foreground">{n.title}</span>
                            <span className="block text-xs text-muted-foreground">{n.body}</span>
                            <span className="mt-1 block text-[11px] text-muted-foreground/70">{n.time}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Date */}
          <div className={`${controlBase} hidden items-center gap-2.5 px-3 md:flex`}>
            <Calendar size={15} className="text-muted-foreground" />
            <div className="flex flex-col leading-none">
              <span className="text-xs font-semibold text-foreground">{formatDayLabel(now)}</span>
              <span className="mt-1 text-[10px] text-muted-foreground">Have a productive day!</span>
            </div>
          </div>

          {/* Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={showUserMenu}
              className={`${controlBase} flex items-center gap-2.5 pl-1.5 pr-2.5 hover:bg-muted/40 cursor-pointer`}
            >
              <Avatar src={user?.avatarUrl} name={displayName} size="size-7" className="ring-0" />
              <span className="hidden flex-col text-left leading-none sm:flex">
                <span className="text-xs font-semibold text-foreground">{displayName}</span>
                <span className="mt-1 text-[10px] text-muted-foreground">{displayRole}</span>
              </span>
              <ChevronDown
                size={14}
                className={`text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border/70 bg-card p-1.5 text-[13px] shadow-2xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
                <div className="px-3 pb-3 pt-2">
                  <p className="truncate font-semibold text-foreground">{displayName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email || 'Signed in'}</p>
                  <Pill tone="blue" icon={Shield} className="mt-2">
                    {displayRole}
                  </Pill>
                </div>
                <div className="border-t border-border/60 pt-1.5">
                  {[
                    { label: 'Account settings', icon: Settings, route: '/settings' },
                    { label: 'Schedule preferences', icon: CalendarClock, route: '/content-calendar' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate(item.route);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-foreground transition-colors hover:bg-muted/70 cursor-pointer"
                    >
                      <item.icon size={15} className="text-muted-foreground" />
                      {item.label}
                    </button>
                  ))}
                </div>
                {activeAccount && (
                  <div className="mt-1.5 flex items-center gap-2 border-t border-border/60 px-3 py-2 text-xs text-muted-foreground">
                    <Building2 size={13} />
                    <span className="truncate">{activeAccount.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => navigate('/post-creation-composer')}
          className={`${buttonStyles.dark} h-10 self-start px-4 xl:self-end`}
        >
          <Plus size={15} />
          <span>Compose post</span>
          <Sparkles size={14} className="text-amber-300" />
        </button>
      </div>
    </header>
  );
}

