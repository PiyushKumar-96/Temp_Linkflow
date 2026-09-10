'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTeamMembers } from './_api/queries';
import { useInviteMember, useUpdateMemberRole } from './_api/mutations';
import TeamHeader from './_components/TeamHeader';
import MemberList from './_components/MemberList';
import InviteMemberModal from './_components/InviteMemberModal';
import { AlertCircle, RotateCcw, Users } from 'lucide-react';

export default function TeamPage() {
  const { isOwner } = useAuth();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const { data: members = [], isLoading, isError, error, refetch } = useTeamMembers();
  const safeMembers = Array.isArray(members) ? members : [];
  const inviteMutation = useInviteMember();
  const updateRoleMutation = useUpdateMemberRole();

  const handleRoleChange = (memberId, newRole) => {
    updateRoleMutation.mutate({ id: memberId, role: newRole });
  };

  const handleInvite = async (memberData) => {
    await inviteMutation.mutateAsync(memberData);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-9 w-32 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="card p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-44 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto my-12 border border-danger/20">
        <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-600 text-foreground mb-1">Failed to load team members</h2>
        <p className="text-xs text-muted-foreground mb-4">
          {error?.message || 'A network error occurred while fetching the team roster.'}
        </p>
        <button
          onClick={() => refetch()}
          className="btn-primary text-xs py-2 px-4 mx-auto flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (safeMembers.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <TeamHeader
          memberCount={0}
          onOpenInvite={() => setInviteModalOpen(true)}
          isOwner={isOwner}
        />
        <div className="card p-12 text-center">
          <Users size={36} className="text-muted-foreground mx-auto mb-3" />
          <h2 className="text-sm font-600 text-foreground mb-1">No team members found</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Invite your team to collaborate on topic creation and approvals.
          </p>
          <button
            onClick={() => setInviteModalOpen(true)}
            className="btn-primary text-xs py-2 px-4 mx-auto"
          >
            Invite Member
          </button>
        </div>
        <InviteMemberModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInvite}
          isOwner={isOwner}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <TeamHeader
        memberCount={safeMembers.length}
        onOpenInvite={() => setInviteModalOpen(true)}
        isOwner={isOwner}
      />

      <MemberList
        members={safeMembers}
        isOwner={isOwner}
        onRoleChange={handleRoleChange}
      />

      <InviteMemberModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInvite}
        isOwner={isOwner}
      />
    </div>
  );
}
