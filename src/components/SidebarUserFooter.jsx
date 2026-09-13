'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Check, Shield, LogOut } from 'lucide-react';

export default function SidebarUserFooter({ onCloseMobile, onOpenCommandPalette }) {
  const { user, isOwner, activeAccount, accounts, switchAccount, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative border-t border-[#302E2A] px-4 py-3 shrink-0"
      style={{ borderTopWidth: '0.5px' }}
      ref={userMenuRef}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => setUserMenuOpen((v) => !v)}
          className="flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] rounded py-0.5"
          aria-label="Account details and actions"
          aria-expanded={userMenuOpen}
        >
          <span className="text-[13px] text-white font-semibold leading-tight truncate max-w-[124px]">
            {user?.name || 'Sarah Reeves'}
          </span>
          <span className="text-[11px] text-[color:var(--rail-count-muted)] font-normal leading-tight truncate max-w-[124px] mt-0.5">
            {isOwner ? 'Owner' : 'Marketing'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            onOpenCommandPalette?.();
            onCloseMobile?.();
          }}
          title="Search / Command Palette (⌘K)"
          className="text-[12px] font-mono text-[#8E8A82] hover:text-white px-1.5 py-0.5 rounded-[6px] hover:bg-[#2A2926] transition-colors select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--accent)]"
        >
          ⌘K
        </button>
      </div>

      {userMenuOpen && (
        <div className="absolute bottom-full left-2 right-2 mb-2 bg-[#232220] border border-[#302E2A] rounded-lg shadow-xl z-50 p-1.5 text-xs text-[color:var(--rail-label-hover)] slide-up">
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-[color:var(--rail-count-muted)] tracking-wider">
            Switch Target Account
          </div>
          <div className="flex flex-col gap-0.5 my-1">
            {(accounts || []).map((acc) => {
              const isCurrent = acc.id === activeAccount?.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    switchAccount(acc);
                    setUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
                    isCurrent
                      ? 'bg-[#302E2A] text-white'
                      : 'hover:bg-[#2A2926] text-[color:var(--rail-label)]'
                  }`}
                >
                  <span className="truncate">{acc.name}</span>
                  {isCurrent && <Check size={12} className="text-[color:var(--brand)] shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#302E2A] my-1" />
          <Link
            to="/login"
            onClick={() => {
              setUserMenuOpen(false);
              onCloseMobile?.();
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#2A2926] text-[color:var(--rail-label)] hover:text-[color:var(--rail-label-hover)] transition-colors"
          >
            <Shield size={12} />
            <span>Auth & Role Details</span>
          </Link>
          <button
            onClick={() => {
              setUserMenuOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-red-950/40 text-red-400 transition-colors text-left"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
