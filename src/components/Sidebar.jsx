'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import {
  PenSquare,
  CalendarDays,
  CheckSquare,
  BookImage,
  LayoutTemplate,
  ChevronLeft,
  ChevronRight,
  Settings,
  Users,
  BarChart3,
  Sparkles,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

const navItems = [
  { id: 'nav-analytics', label: 'Analytics', href: '/', icon: BarChart3, group: 'main' },
  {
    id: 'nav-composer',
    label: 'Post Composer',
    href: '/post-creation-composer',
    icon: PenSquare,
    group: 'main',
  },
  { id: 'nav-ai', label: 'AI Generator', href: '/ai-generator', icon: Sparkles, group: 'main' },
  {
    id: 'nav-calendar',
    label: 'Content Calendar',
    href: '/content-calendar',
    icon: CalendarDays,
    group: 'main',
  },
  {
    id: 'nav-approval',
    label: 'Approval Queue',
    href: '/approval-workflow',
    icon: CheckSquare,
    badge: 5,
    group: 'main',
  },
  {
    id: 'nav-library',
    label: 'Content Library',
    href: '/content-library',
    icon: BookImage,
    group: 'content',
  },
  {
    id: 'nav-templates',
    label: 'Post Templates',
    href: '/post-templates',
    icon: LayoutTemplate,
    group: 'content',
  },
];

const bottomItems = [
  { id: 'nav-team', label: 'Team', href: '#', icon: Users },
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { pathname } = useLocation();
  const { user, isOwner } = useAuth();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const mainItems = navItems.filter((i) => i.group === 'main');
  const contentItems = navItems.filter((i) => i.group === 'content');

  return (
    <aside
      className="fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-30 sidebar-transition"
      style={{ width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 py-4 border-b border-border"
        style={{ height: 'var(--topbar-height)' }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-bold text-base text-foreground tracking-tight truncate">
              LinkedFlow
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-thin">
        {/* Main section */}
        {!collapsed && (
          <p className="text-xs font-600 text-muted-foreground uppercase tracking-widest px-2 mb-2">
            Workspace
          </p>
        )}
        <div className="flex flex-col gap-0.5 mb-4">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`nav-item relative group ${active ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && item.badge && item.badge > 0 && (
                  <span className="ml-auto text-xs font-700 bg-warning text-white px-1.5 py-0.5 rounded-full tabular-nums">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                    {item.badge ? ` (${item.badge})` : ''}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Content section */}
        {!collapsed && (
          <p className="text-xs font-600 text-muted-foreground uppercase tracking-widest px-2 mb-2 mt-2">
            Content
          </p>
        )}
        {collapsed && <div className="border-t border-border my-2" />}
        <div className="flex flex-col gap-0.5">
          {contentItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`nav-item relative group ${active ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-border flex flex-col gap-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href}
              className="nav-item relative group"
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* User */}
        <Link
          to="/login"
          className={`flex items-center gap-2 mt-2 px-2 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group relative ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Click to view Auth & Switch Role"
        >
          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-700">{user?.initials || 'SR'}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-foreground truncate">
                {user?.name || 'Sarah Reeves'}
              </p>
              <p className="text-[11px] text-muted-foreground truncate font-500">
                {isOwner ? 'Account Owner' : 'Marketing User'}
              </p>
            </div>
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {user?.name} ({isOwner ? 'Owner' : 'Marketing'})
            </div>
          )}
        </Link>

        {collapsed && (
          <button
            onClick={onToggle}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
