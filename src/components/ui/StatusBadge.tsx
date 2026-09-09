import React from 'react';

type Status = 'draft' | 'pending' | 'approved' | 'scheduled' | 'published' | 'rejected' | 'archived';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

const labels: Record<Status, string> = {
  draft: 'Draft',
  pending: 'Pending Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  rejected: 'Rejected',
  archived: 'Archived',
};

const classMap: Record<Status, string> = {
  draft: 'status-draft',
  pending: 'status-pending',
  approved: 'status-approved',
  scheduled: 'status-scheduled',
  published: 'status-published',
  rejected: 'status-rejected',
  archived: 'status-archived',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-500 rounded-full ${classMap[status]} ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
    >
      {labels[status]}
    </span>
  );
}