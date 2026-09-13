import React from 'react';
import { Users, UserPlus } from 'lucide-react';

export default function TeamHeader({ memberCount, onOpenInvite, isOwner }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Users size={22} className="text-primary" />
        <div>
          <h1 className="text-2xl font-700 text-foreground">Team Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage workspace members, roles, and review privileges ({memberCount} members)
          </p>
        </div>
      </div>

      <button
        onClick={onOpenInvite}
        className="btn-primary self-start sm:self-auto"
        title={
          !isOwner ? 'Only workspace owners can invite new members' : 'Invite a new team member'
        }
      >
        <UserPlus size={15} />
        <span>Invite Member</span>
      </button>
    </div>
  );
}
