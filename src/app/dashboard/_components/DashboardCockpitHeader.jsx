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
import { Pill, formatDayLabel, getGreeting } from './DashboardPrimitives';

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

  const tabletBase =
    'h-11 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-md transition-all duration-200';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'SR';

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

      {/* Controls: Date, Profile, and Compose Post styled as premium tablets */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {/* Date Tablet */}
        <div
          className={`${tabletBase} hidden items-center gap-3 px-3.5 md:flex select-none hover:border-blue-200 dark:hover:border-blue-900/60 hover:shadow-md`}
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 ring-1 ring-blue-500/20 shadow-xs">
            <Calendar size={13} strokeWidth={2.3} />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[12px] font-bold leading-tight tracking-tight text-slate-800 dark:text-slate-100">
              {formatDayLabel(now)}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5 leading-none">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Have a productive day!
              </span>
            </div>
          </div>
        </div>

        {/* Profile Tablet */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={showUserMenu}
            className={`${tabletBase} flex items-center gap-2.5 pl-1.5 pr-3 hover:border-violet-200 dark:hover:border-violet-900/60 hover:shadow-md cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40`}
          >
            {/* Avatar with luxury gradient ring */}
            <div className="relative shrink-0">
              <div className="size-8 rounded-full bg-gradient-to-tr from-violet-600 via-purple-500 to-indigo-500 p-[1.5px] shadow-xs transition-transform duration-200 group-hover:scale-105">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={displayName}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <div className="size-full rounded-full bg-white dark:bg-slate-900 grid place-items-center">
                    <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="hidden flex-col text-left sm:flex">
              <span className="text-[12px] font-bold leading-tight tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {displayName}
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium leading-none text-violet-600/90 dark:text-violet-400">
                <Shield size={9} strokeWidth={2.4} className="text-violet-500 shrink-0" />
                {displayRole}
              </span>
            </div>

            <span className="ml-1 grid size-5 place-items-center rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:bg-slate-200/70 transition-all">
              <ChevronDown
                size={12}
                strokeWidth={2.5}
                className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 z-50 mt-2.5 w-64 overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl p-1.5 text-[13px] shadow-[0_12px_36px_-10px_rgba(15,23,42,0.22)] animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none ring-1 ring-black/5">
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

        {/* Primary CTA Tablet */}
        <button
          type="button"
          onClick={() => navigate('/post-creation-composer')}
          className="group relative h-11 rounded-full bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 hover:from-slate-900 hover:via-indigo-950 hover:to-purple-950 text-white pl-2.5 pr-4 flex items-center gap-2.5 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.35),0_2px_6px_rgba(99,102,241,0.2)] hover:shadow-[0_6px_22px_-2px_rgba(99,102,241,0.45),0_2px_8px_rgba(15,23,42,0.3)] ring-1 ring-white/20 hover:ring-white/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="grid size-7 place-items-center rounded-full bg-white/15 text-white shadow-xs group-hover:bg-white/25 group-hover:scale-110 transition-all duration-200">
            <Plus size={14} strokeWidth={2.8} />
          </span>
          <span className="text-[13px] font-bold tracking-tight text-white/95 group-hover:text-white">
            Compose post
          </span>
          <Sparkles
            size={14}
            className="text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.65)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
          />
        </button>
      </div>
    </header>
  );
}

