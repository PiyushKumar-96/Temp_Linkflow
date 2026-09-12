'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PenTool,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Bookmark,
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ArrowRight,
  X,
} from 'lucide-react';

const PALETTE_ITEMS = [
  { id: 'composer', label: 'Post Composer', href: '/post-creation-composer', category: 'Content Creation', icon: PenTool },
  { id: 'approval', label: 'Approval Queue', href: '/approval-workflow', category: 'Review & Approvals', icon: CheckCircle2 },
  { id: 'calendar', label: 'Content Calendar', href: '/content-calendar', category: 'Planning', icon: Calendar },
  { id: 'topics', label: 'Content Topics', href: '/topics', category: 'Planning', icon: Layers },
  { id: 'ai', label: 'AI Post Generator', href: '/ai-generator', category: 'AI Tools', icon: Sparkles },
  { id: 'templates', label: 'Post Templates', href: '/post-templates', category: 'Library', icon: Bookmark },
  { id: 'library', label: 'Content Library', href: '/content-library', category: 'Library', icon: Bookmark },
  { id: 'dashboard', label: 'Operations Dashboard', href: '/dashboard', category: 'Analytics', icon: LayoutDashboard },
  { id: 'analytics', label: 'Performance Analytics', href: '/analytics', category: 'Analytics', icon: BarChart3 },
  { id: 'team', label: 'Team Members & Roles', href: '/team', category: 'Workspace', icon: Users },
  { id: 'settings', label: 'Account & Workspace Settings', href: '/settings', category: 'Workspace', icon: Settings },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
        else onClose(true); // toggle
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const filteredItems = PALETTE_ITEMS.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item) => {
    onClose();
    navigate(item.href);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4 bg-black/40 backdrop-blur-xs fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[560px] bg-[#181715] text-[#E8E5DE] rounded-[18px] border border-[#2E2C28] shadow-2xl overflow-hidden slide-up">
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#2A2824] gap-3">
          <Search size={18} className="text-[#8E8A82] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, topics, actions..."
            className="w-full bg-transparent text-[14px] text-white placeholder:text-[#6B6760] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#8E8A82] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline text-[11px] font-mono text-[#6B6760] border border-[#302E2A] px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-[340px] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#8E8A82]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-[10px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#2A2824] text-white'
                        : 'text-[#8E8A82] hover:text-[#E8E5DE] hover:bg-[#22211E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isSelected ? 'text-[var(--brand,#0A66C2)]' : 'text-[#6B6760]'} />
                      <span className="text-[13.5px] font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#6B6760]">{item.category}</span>
                      {isSelected && <ArrowRight size={13} className="text-[#8E8A82]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#2A2824] text-[11px] text-[#6B6760] bg-[#141312]">
          <span>Use ↑ ↓ to navigate, ↵ to select</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
