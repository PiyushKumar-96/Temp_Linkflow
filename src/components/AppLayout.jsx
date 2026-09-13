'use client';

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from './CommandPalette';

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[color:var(--page-bg,#F1F0EC)] flex flex-col">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <div className="min-h-screen flex flex-col min-[900px]:pl-[244px] transition-[padding] duration-200">
        <Topbar onToggleSidebar={() => setMobileOpen((o) => !o)} />
        <main className="flex-1 px-6 lg:px-8 xl:px-10 pb-10 max-w-screen-2xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>

      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
