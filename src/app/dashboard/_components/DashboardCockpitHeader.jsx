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
  User,
  Shield,
  Building2,
} from 'lucide-react';

export default function DashboardCockpitHeader() {
  const navigate = useNavigate();
  const { user, activeAccount, role } = useAuth();

  // Dynamic user data from AuthContext
  const displayName = user?.name || 'Sarah Reeves';
  const firstName = displayName.split(' ')[0] || 'User';
  const displayRole = role === 'owner' ? 'Account Owner' : 'Content Operations';
  const userInitials = user?.initials || displayName.slice(0, 2).toUpperCase();
  const avatarUrl = user?.avatarUrl;

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('cockpit-search-input')?.focus();
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Greeting & Title (Dynamic from logged-in user) */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>🌤️ Good morning, {firstName}</span>
            <span>👋</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-0.5">
            Operations Cockpit
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Keep your pipeline moving. Review, schedule and publish with confidence.
          </p>
        </div>

        {/* Right Controls: Search Bar, Notifications, Date Pill, User Profile, CTA */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search bar with fixed, non-wrapping ⌘K badge */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-card border border-border rounded-xl px-3 py-2 shadow-2xs hover:border-border/80 focus-within:border-primary transition-all w-full sm:w-72 md:w-80 min-w-[240px]"
          >
            <Search size={14} className="text-muted-foreground shrink-0 mr-2" />
            <input
              id="cockpit-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, posts, creators..."
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-muted-foreground hover:text-foreground p-0.5 mr-1.5 shrink-0 cursor-pointer"
              >
                <X size={13} />
              </button>
            ) : null}
            <kbd className="shrink-0 whitespace-nowrap inline-flex items-center justify-center text-[10px] text-muted-foreground bg-muted/90 px-1.5 py-0.5 rounded border border-border/80 font-mono font-semibold ml-1.5 select-none leading-none">
              ⌘ K
            </kbd>
          </form>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shadow-2xs cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-card" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-border px-1">
                  <span className="text-xs font-bold text-foreground">Notifications</span>
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-border/60 text-xs py-1">
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/approval-workflow?status=failed');
                    }}
                    className="py-2 px-1 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors flex items-start gap-2"
                  >
                    <AlertTriangle size={14} className="text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Pipeline Dispatch Alert</p>
                      <p className="text-[11px] text-muted-foreground">
                        Buffer worker timeout contacting LinkedIn API.
                      </p>
                      <span className="text-[10px] text-muted-foreground/60">4 hours ago</span>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/approval-workflow?status=awaiting_review');
                    }}
                    className="py-2 px-1 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors flex items-start gap-2"
                  >
                    <Clock size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">2 Posts Pending Review</p>
                      <p className="text-[11px] text-muted-foreground">
                        Drafts are ready for stakeholder approval.
                      </p>
                      <span className="text-[10px] text-muted-foreground/60">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date pill */}
          <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1.5 shadow-2xs">
            <Calendar size={14} className="text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground leading-none">
                Mon, 09 Sep 2026
              </span>
              <span className="text-[9px] text-muted-foreground leading-none mt-0.5">
                Have a productive day!
              </span>
            </div>
          </div>

          {/* User profile badge (Bound to logged-in user from AuthContext) */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 bg-card border border-border rounded-xl p-1.5 pr-2.5 shadow-2xs hover:border-border/80 transition-all cursor-pointer"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-7 h-7 rounded-lg object-cover border border-border/80"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
                  {userInitials}
                </div>
              )}
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="text-xs font-bold text-foreground leading-none">
                  {displayName}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  {displayRole}
                </span>
              </div>
              <ChevronDown size={13} className="text-muted-foreground ml-0.5" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                <div className="px-3 py-2 border-b border-border">
                  <p className="font-bold text-foreground truncate">{displayName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email || 'Logged in'}</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-primary">
                    <Shield size={10} />
                    <span>{displayRole}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Account Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/content-calendar');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Schedule Preferences
                </button>
                {activeAccount && (
                  <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-t border-border mt-1 flex items-center gap-1">
                    <Building2 size={11} />
                    <span className="truncate">{activeAccount.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Compose Post Primary CTA */}
          <button
            type="button"
            onClick={() => navigate('/post-creation-composer')}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            <Plus size={14} className="text-white" />
            <span>Compose Post</span>
            <Sparkles size={13} className="text-amber-400 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
