'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Building2,
  User,
  ShieldCheck,
  UserCheck,
  LogOut,
  Check,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-alert-1',
    title: 'DISPATCH FAILED: 5 AI Automation Workflows halted (Buffer 429)',
    time: '8m ago',
    type: 'failure',
    unread: true,
    href: '/approval-workflow?post=appr-005',
    isAlert: true,
    requestId: 'req_9f41b2f0a1c',
  },
  {
    id: 'notif-1',
    title: 'Review Required: Customer Onboarding Case Study',
    time: '12m ago',
    type: 'review',
    unread: true,
    href: '/approval-workflow',
  },
  {
    id: 'notif-2',
    title: 'AI Generator created 5 candidate drafts',
    time: '1h ago',
    type: 'generation',
    unread: true,
    href: '/approval-workflow',
  },
  {
    id: 'notif-3',
    title: 'Post successfully scheduled to Buffer',
    time: '3h ago',
    type: 'published',
    unread: false,
    href: '/content-calendar',
  },
];

export default function Topbar({ sidebarCollapsed }) {
  const { isOwner, toggleRole, activeAccount, accounts, switchAccount, logout } = useAuth();

  const [searchFocused, setSearchFocused] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const accountRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleRoleToggle = () => {
    const nextRole = toggleRole();
    toast.info(`Switched role to: ${nextRole === 'owner' ? 'Account Owner' : 'Marketing User'}`);
  };

  const handleSelectAccount = (acc) => {
    switchAccount(acc);
    setAccountMenuOpen(false);
    toast.success(`Active context switched to: ${acc.name} (${acc.type})`);
  };

  return (
    <header
      className="fixed top-0 right-0 bg-card border-b border-border z-20 flex items-center px-6 gap-3 transition-all duration-300"
      style={{
        left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        height: 'var(--topbar-height)',
      }}
    >
      {/* Search */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-150 flex-1 max-w-md ${
          searchFocused ? 'border-primary bg-card shadow-sm' : 'border-border bg-input'
        }`}
      >
        <Search size={15} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search posts, topics, reviews..."
          className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] text-muted-foreground font-mono">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Role Gating Switcher Pill */}
        <button
          onClick={handleRoleToggle}
          title="Click to toggle role between Account Owner and Marketing User to test role-gated UI"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 border transition-all ${
            isOwner
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
          }`}
        >
          {isOwner ? <ShieldCheck size={13} /> : <UserCheck size={13} />}
          <span>{isOwner ? 'Role: Owner (Approver)' : 'Role: Marketing (Creator)'}</span>
        </button>

        {/* Create Post Button */}
        <Link to="/post-creation-composer">
          <button className="btn-primary text-xs py-1.5 px-3">
            <Plus size={14} />
            <span className="hidden sm:inline">New Post</span>
          </button>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} className={notifications.some((n) => n.unread && n.isAlert) ? 'text-destructive' : ''} />
            {unreadCount > 0 && (
              <span
                className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-card ${
                  notifications.some((n) => n.unread && n.isAlert)
                    ? 'bg-destructive animate-pulse'
                    : 'bg-primary'
                }`}
              />
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden slide-up">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-600 text-sm text-foreground">Notifications & Alerts</span>
                  {notifications.some((n) => n.isAlert && n.unread) && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-destructive text-white rounded-full">
                      Alert Active
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() =>
                      setNotifications(notifications.map((n) => ({ ...n, unread: false })))
                    }
                    className="text-[11px] text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.href}
                    onClick={() => setNotifMenuOpen(false)}
                    className={`block px-4 py-3 hover:bg-muted/60 transition-colors ${
                      n.isAlert && n.unread
                        ? 'bg-destructive/10 border-l-2 border-destructive'
                        : n.unread
                        ? 'bg-primary/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-xs font-500 leading-snug ${
                          n.isAlert ? 'text-destructive font-semibold' : 'text-foreground'
                        }`}
                      >
                        {n.title}
                      </p>
                      {n.unread && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${
                            n.isAlert ? 'bg-destructive' : 'bg-primary'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock size={10} />
                      {n.time}
                      {n.requestId && <span className="font-mono text-[9px] ml-1">({n.requestId})</span>}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account Switcher Dropdown */}
        <div className="relative" ref={accountRef}>
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-input hover:bg-muted transition-colors text-left"
          >
            <div className="w-5 h-5 rounded gradient-primary flex items-center justify-center shrink-0">
              {activeAccount.type.includes('Company') ? (
                <Building2 size={11} className="text-white" />
              ) : (
                <User size={11} className="text-white" />
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-600 text-foreground leading-tight">
                {activeAccount.name}
              </span>
              <span className="text-[10px] text-muted-foreground leading-none">
                {activeAccount.type}
              </span>
            </div>
            <ChevronDown size={13} className="text-muted-foreground" />
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden slide-up">
              <div className="px-3 py-2 border-b border-border bg-muted/40">
                <span className="text-[11px] font-600 text-muted-foreground uppercase tracking-wider">
                  Switch LinkedIn Target
                </span>
              </div>
              <div className="p-1.5 divide-y divide-border/50">
                {accounts.map((acc) => {
                  const isCurrent = acc.id === activeAccount.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => handleSelectAccount(acc)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                        isCurrent
                          ? 'bg-primary/10 text-primary font-600'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center ${
                          isCurrent ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {acc.type.includes('Company') ? (
                          <Building2 size={12} />
                        ) : (
                          <User size={12} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{acc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{acc.type}</p>
                      </div>
                      {isCurrent && <Check size={14} className="text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-1.5 border-t border-border bg-muted/20">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs text-danger hover:bg-danger/10 transition-colors"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
