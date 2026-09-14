import React from 'react';
import { UserPlus } from 'lucide-react';

export default function TeamHeader({ memberCount, onOpenInvite, isOwner, isPanelOpen }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--text)] tracking-tight">
          Team
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] font-normal mt-1">
          Manage workspace members, role assignments, and capabilities ({memberCount} members)
        </p>
      </div>

      <button
        onClick={onOpenInvite}
        className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] disabled:opacity-50 disabled:cursor-not-allowed ${
          isPanelOpen
            ? 'border border-[color:var(--border)] text-[color:var(--text)] bg-[color:var(--card)] hover:bg-[color:var(--chip)]'
            : 'bg-[color:var(--brand)] text-white hover:bg-[color:var(--brand-hover)]'
        }`}
        disabled={!isOwner}
        title={
          !isOwner ? 'Only workspace owners can invite new members' : 'Invite a new team member'
        }
      >
        <UserPlus size={14} />
        <span>Invite member</span>
      </button>
    </div>
  );
}
