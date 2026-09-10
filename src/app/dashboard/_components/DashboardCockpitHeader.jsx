'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  ChevronDown,
  Sparkles,
  Plus,
  Shield,
  Building2,
  Settings,
  CalendarClock,
  Sun,
  CloudSun,
  Moon,
} from 'lucide-react';
import { Avatar, Pill, buttonStyles, formatDayLabel, getGreeting } from './DashboardPrimitives';

const GREETING_ICONS = { morning: Sun, afternoon: CloudSun, evening: Moon };

export default function DashboardCockpitHeader() {
  const navigate = useNavigate();
  const { user, activeAccount, role } = useAuth();

  const displayName = user?.name || 'Sarah Reeves';
  const firstName = displayName.split(' ')[0] || 'there';
  const displayRole = role === 'owner' ? 'Account owner' : 'Content operations';

  const now = new Date();
  const greeting = getGreeting(now);
  const GreetingIcon = GREETING_ICONS[greeting.period];

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
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

  const controlBase =
    'h-10 rounded-xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors';

  return (
    <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
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

      {/* Controls: Date, Profile, and Compose Post all in one line */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
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

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => navigate('/post-creation-composer')}
          className={`${buttonStyles.dark} h-10 px-4`}
        >
          <Plus size={15} />
          <span>Compose post</span>
          <Sparkles size={14} className="text-amber-300" />
        </button>
      </div>
    </header>
  );
}

