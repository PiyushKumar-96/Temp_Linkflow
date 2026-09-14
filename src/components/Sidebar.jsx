'use client';

import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApprovalPosts } from '@/app/approval-workflow/_api/queries';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingPosts } from '@/temp-backend';
import { POST_STATUS, normalizeStatus } from '@/lib/post-status';
import SidebarUserFooter from './SidebarUserFooter';

const GROUP_1 = [
  { id: 'nav-composer', label: 'Post composer', href: '/post-creation-composer' },
  { id: 'nav-approval', label: 'Approval queue', href: '/approval-workflow', countKey: 'approval' },
  {
    id: 'nav-calendar',
    label: 'Content calendar',
    href: '/content-calendar',
    countKey: 'calendar',
  },
  { id: 'nav-planner', label: 'Planner', href: '/planner' },
  { id: 'nav-library', label: 'Library', href: '/content-library' },
  { id: 'nav-ai', label: 'AI generator', href: '/ai-generator' },
];

const GROUP_2 = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'nav-analytics', label: 'Analytics', href: '/analytics' },
];

const FOOTER_NAV = [
  { id: 'nav-team', label: 'Team', href: '/team' },
  { id: 'nav-settings', label: 'Settings', href: '/settings' },
];

const ALL_ITEMS = [...GROUP_1, ...GROUP_2, ...FOOTER_NAV];

const PILL_SPRING = { type: 'spring', stiffness: 360, damping: 30, mass: 0.85 };

const NavRow = React.memo(function NavRow({
  item,
  isActive,
  count,
  countType,
  onNavigate,
  registerRef,
}) {
  return (
    <Link
      ref={(node) => registerRef(item.id, node)}
      to={item.href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className="group relative flex h-[42px] w-full items-center rounded-[10px] px-3.5 text-[14.5px] font-normal select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-1"
    >
      <span
        className={`relative z-10 truncate transition-[color,transform] duration-200 ease-out ${
          isActive
            ? 'text-[color:var(--rail-label-active)] font-semibold'
            : 'text-[color:var(--rail-label)] group-hover:translate-x-[2px] group-hover:text-[color:var(--rail-label-hover)]'
        }`}
      >
        {item.label}
      </span>

      {count > 0 && (
        <span
          className={`relative z-10 ml-auto text-[12px] font-semibold tabular-nums px-2 py-0.5 rounded-full transition-colors duration-200 ${
            countType === 'attention'
              ? 'bg-[color:var(--rail-count-attention-bg)] text-[color:var(--rail-count-attention)]'
              : isActive
                ? 'text-[color:var(--rail-count-active)]'
                : 'text-[color:var(--rail-count-muted)]'
          }`}
          aria-label={
            countType === 'attention'
              ? `${item.label}, ${count} pending`
              : `${item.label}, ${count} scheduled`
          }
        >
          {count}
        </span>
      )}
    </Link>
  );
});

export default function Sidebar({ mobileOpen = false, onCloseMobile, onOpenCommandPalette }) {
  const { pathname } = useLocation();

  const navRef = useRef(null);
  const rowRefs = useRef({});
  const hasPositioned = useRef(false);
  const [pillY, setPillY] = useState(null);
  const [canAnimate, setCanAnimate] = useState(false);

  const { data: approvalPosts = [] } = useApprovalPosts();
  const { data: upcomingPosts = [] } = useQuery({
    queryKey: ['posts', 'upcoming'],
    queryFn: getUpcomingPosts,
    staleTime: 30 * 1000,
  });

  const approvalCount = useMemo(() => {
    if (!Array.isArray(approvalPosts)) return 0;
    return approvalPosts.filter((p) => {
      const s = normalizeStatus ? normalizeStatus(p.status) : p.status;
      return (
        s === POST_STATUS.AWAITING_REVIEW ||
        s === POST_STATUS.NEEDS_REVISION ||
        s === 'awaiting_review' ||
        s === 'needs_revision' ||
        s === POST_STATUS.FAILED ||
        s === 'failed'
      );
    }).length;
  }, [approvalPosts]);

  const scheduledCount = useMemo(() => {
    if (!Array.isArray(upcomingPosts)) return 0;
    return upcomingPosts.filter((p) => {
      const s = normalizeStatus ? normalizeStatus(p.status) : p.status;
      return s === POST_STATUS.SCHEDULED || (s === POST_STATUS.APPROVED && p.scheduledDate);
    }).length;
  }, [upcomingPosts]);

  const isActive = useCallback(
    (href) => {
      if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
      if (href === '/analytics') return pathname === '/analytics';
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // Exactly one active id. Longest href wins, so nested routes can't double-match.
  const activeId = useMemo(() => {
    const matches = ALL_ITEMS.filter((i) => isActive(i.href));
    if (!matches.length) return null;
    return matches.sort((a, b) => b.href.length - a.href.length)[0].id;
  }, [isActive]);

  const registerRef = useCallback((id, node) => {
    if (node) rowRefs.current[id] = node;
    else delete rowRefs.current[id];
  }, []);

  // Measure only when the active row changes or the rail resizes. The animation
  // itself never triggers a measurement, which is what keeps it smooth.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const row = activeId ? rowRefs.current[activeId] : null;

    if (!nav || !row) {
      setPillY(null);
      hasPositioned.current = false;
      setCanAnimate(false);
      return undefined;
    }

    const measure = () => setPillY(row.offsetTop);
    measure();

    if (!hasPositioned.current) {
      hasPositioned.current = true;
    } else {
      setCanAnimate(true);
    }

    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [activeId]);

  const countFor = useCallback(
    (item) => {
      if (item.countKey === 'approval') return approvalCount;
      if (item.countKey === 'calendar') return scheduledCount;
      return 0;
    },
    [approvalCount, scheduledCount]
  );

  const renderRow = useCallback(
    (item) => (
      <NavRow
        key={item.id}
        item={item}
        isActive={item.id === activeId}
        count={countFor(item)}
        countType={item.countKey === 'approval' ? 'attention' : 'muted'}
        onNavigate={onCloseMobile}
        registerRef={registerRef}
      />
    ),
    [activeId, countFor, onCloseMobile, registerRef]
  );

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs min-[900px]:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex h-screen w-[220px] flex-col overflow-hidden rounded-none border-r border-[color:var(--border,#E4E2DC)] bg-[color:var(--rail-surface,#EFECE8)] pb-3 shadow-none transition-transform duration-200 ease-out min-[900px]:transform-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-[230px]'
        }`}
      >
        <div className="flex shrink-0 items-center px-6 pt-7 pb-6">
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center rounded text-[19px] font-bold tracking-tight text-[color:var(--text,#1B1917)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
          >
            <span>LinkedFlow</span>
          </Link>
        </div>

        <nav ref={navRef} className="relative flex min-h-0 flex-1 flex-col overflow-hidden py-1 px-3">
          {pillY !== null && (
            <motion.span
              className="pointer-events-none absolute left-[12px] right-[12px] top-0 z-0 h-[42px] rounded-[10px] overflow-hidden flex items-center"
              style={{
                backgroundColor: 'var(--rail-active-bg, #E4E0D8)',
              }}
              initial={false}
              animate={{ y: pillY }}
              transition={canAnimate ? PILL_SPRING : { duration: 0 }}
              aria-hidden="true"
            >
              <span className="w-[3.5px] h-[20px] bg-[color:var(--brand)] rounded-r-full shrink-0" />
            </motion.span>
          )}

          <div className="flex flex-col gap-0.5">{GROUP_1.map(renderRow)}</div>

          <div
            className="mx-3 my-3 border-t border-[color:var(--rail-divider)]"
            style={{ borderTopWidth: '0.5px' }}
            role="separator"
          />

          <div className="flex flex-col gap-0.5">{GROUP_2.map(renderRow)}</div>

          <div className="mt-auto flex flex-col gap-0.5 pb-2">{FOOTER_NAV.map(renderRow)}</div>
        </nav>

        <SidebarUserFooter
          onCloseMobile={onCloseMobile}
          onOpenCommandPalette={onOpenCommandPalette}
        />
      </aside>
    </>
  );
}
