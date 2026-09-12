'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  ChevronDown,
  Building2,
  Settings,
  CalendarClock,
  Plus,
} from 'lucide-react';
import {
  IconHeaderCalendar,
} from './DashboardCustomIcons';
import { formatDayLabel, getGreeting } from './DashboardPrimitives';

export default function DashboardCockpitHeader() {
  const navigate = useNavigate();
  const { user, activeAccount, role } = useAuth();

  const displayName = user?.name || 'Sarah Reeves';
  const firstName = displayName.split(' ')[0] || 'there';
  const displayRole = role === 'owner' ? 'Account owner' : 'Content operations';

  const now = new Date();
  const greeting = getGreeting(now);

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

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'SR';

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pt-1 pb-2">
      {/* Greeting + title */}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">
          Operations Cockpit
        </p>
        <h1 className="mt-1 text-2xl sm:text-[32px] font-semibold tracking-tight text-[#1B1B1F] leading-tight">
          {greeting.text},{' '}
          <span className="text-[#0A66C2]">{firstName}</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#6B6B70]">
          Review, schedule, and publish with confidence.
        </p>
      </div>

      {/* Controls: Date, Profile pill, and Compose Post */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {/* Date pill (neutral) */}
        <div className="hidden h-9 items-center gap-2 rounded-full border border-[#E4E2DC] bg-white px-3.5 text-xs font-medium text-[#1B1B1F] shadow-[0_1px_2px_rgba(27,27,31,0.03)] md:flex">
          <IconHeaderCalendar size={14} className="text-[#6B6B70]" />
          <span>{formatDayLabel(now)}</span>
        </div>

        {/* Profile menu pill (neutral) */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={showUserMenu}
            className="flex h-9 items-center gap-2.5 rounded-full border border-[#E4E2DC] bg-white pl-1.5 pr-3 text-xs font-medium text-[#1B1B1F] shadow-[0_1px_2px_rgba(27,27,31,0.03)] transition-all hover:bg-[#F0EFEB] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
          >
            <div className="size-6 rounded-full bg-[#F0EFEB] text-[#1B1B1F] grid place-items-center overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={displayName} className="size-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold">{initials}</span>
              )}
            </div>

            <div className="hidden flex-col text-left sm:flex">
              <span className="text-xs font-semibold leading-none text-[#1B1B1F]">{displayName}</span>
              <span className="mt-0.5 text-[10px] leading-none text-[#6B6B70]">{displayRole}</span>
            </div>

            <ChevronDown
              size={12}
              className={`text-[#6B6B70] transition-transform duration-150 ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 z-50 mt-1.5 w-60 overflow-hidden rounded-[20px] bg-white p-1.5 text-xs shadow-xl border border-[#E4E2DC] animate-in fade-in zoom-in-95 duration-100 motion-reduce:animate-none">
              <div className="px-3 py-2.5 border-b border-[#E4E2DC]">
                <p className="truncate font-semibold text-[#1B1B1F]">{displayName}</p>
                <p className="truncate text-[11px] text-[#6B6B70]">{user?.email || 'Signed in'}</p>
                <p className="mt-1 text-[11px] font-medium text-[#0A66C2]">{displayRole}</p>
              </div>
              <div className="pt-1">
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
                    className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-[#1B1B1F] transition-colors hover:bg-[#F0EFEB] cursor-pointer"
                  >
                    <item.icon size={14} className="text-[#6B6B70]" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              {activeAccount && (
                <div className="mt-1 flex items-center gap-1.5 border-t border-[#E4E2DC] px-3 py-2 text-[11px] text-[#6B6B70]">
                  <Building2 size={12} />
                  <span className="truncate">{activeAccount.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary CTA: Solid blue pill with white text and a white circular "+" icon inside */}
        <button
          type="button"
          onClick={() => navigate('/post-creation-composer')}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#0A66C2] pl-3 pr-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#084E96] hover:scale-[1.02] active:scale-[0.98] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
        >
          <span className="grid size-4 place-items-center rounded-full bg-white text-[#0A66C2]">
            <Plus size={12} strokeWidth={3} />
          </span>
          <span>Compose post</span>
        </button>
      </div>
    </header>
  );
}
