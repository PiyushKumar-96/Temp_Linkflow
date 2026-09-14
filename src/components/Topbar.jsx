'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Plus, Menu, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IconHeaderCalendar } from '@/app/dashboard/_components/DashboardCustomIcons';
import { formatDayLabel } from '@/app/dashboard/_components/DashboardPrimitives';

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

export default function Topbar({ onToggleSidebar }) {
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const now = new Date();

  return (
    <header className="w-full px-6 lg:px-8 xl:px-10 pt-5 pb-3 sm:pt-6 sm:pb-4">
      <div className="w-full max-w-none flex items-center justify-between min-h-[36px]">
        {/* Mobile menu trigger */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="min-[900px]:hidden p-1.5 text-[#6B6760] hover:text-[#1B1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BD6] rounded"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Header Controls: Date Pill, Outline "New Post" & Notification Bell */}
        <div className="flex items-center gap-3 sm:gap-4 h-[36px] ml-auto">
          {/* Date pill (neutral) */}
          <div className="hidden h-9 items-center gap-2 rounded-full border border-[#E4E2DC] bg-white px-3.5 text-xs font-medium text-[#1B1B1F] shadow-[0_1px_2px_rgba(27,27,31,0.03)] md:flex">
            <IconHeaderCalendar date={now} size={17} className="text-[#6B6760]" />
            <span>{formatDayLabel(now)}</span>
          </div>

          {/* New Post: outline button to avoid competing with page-level filled blue actions */}
          <Link to="/post-creation-composer" className="inline-flex items-center" tabIndex={-1}>
            <button
              className="border border-[color:var(--brand,#0A66C2)] text-[color:var(--brand,#0A66C2)] hover:bg-[color:color-mix(in_srgb,var(--brand,#0A66C2)_10%,transparent)] text-xs sm:text-[13px] font-medium px-3.5 h-[32px] flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BD6]"
              style={{ borderRadius: 'var(--radius, 6px)' }}
            >
              <Plus size={14} />
              <span>New Post</span>
            </button>
          </Link>

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifMenuOpen((v) => !v)}
              className="relative w-[32px] h-[32px] flex items-center justify-center text-[#6B6760] hover:text-[#1B1917] transition-colors bg-transparent border-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BD6] rounded"
              aria-label="Notifications"
              aria-expanded={notifMenuOpen}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[color:var(--brand,#0A66C2)]" />
              )}
            </button>

            {/* Notifications menu */}
            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] border border-[#302E2A]/15 rounded-xl shadow-xl z-50 overflow-hidden slide-up">
                <div className="px-4 py-3 border-b border-[#302E2A]/10 flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1B1917]">
                    Notifications & Alerts
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                      }
                      className="text-[11px] text-[color:var(--brand,#0A66C2)] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#302E2A]/10">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      to={n.href}
                      onClick={() => setNotifMenuOpen(false)}
                      className={`block px-4 py-2.5 hover:bg-black/[0.03] transition-colors ${
                        n.unread ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <p
                        className={`text-xs leading-snug ${
                          n.isAlert ? 'text-red-600 font-semibold' : 'text-[#1B1917]'
                        }`}
                      >
                        {n.title}
                      </p>
                      <span className="text-[10px] text-[#6B6760] flex items-center gap-1 mt-1">
                        <Clock size={10} />
                        {n.time}
                        {n.requestId && (
                          <span className="font-mono text-[9px] ml-1">({n.requestId})</span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
