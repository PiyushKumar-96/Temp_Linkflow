import React from 'react';

const labels = {
  draft: 'Draft',
  pending: 'Pending Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  rejected: 'Rejected',
  archived: 'Archived',
};

const classMap = {
  draft: 'status-draft',
  pending: 'status-pending',
  approved: 'status-approved',
  scheduled: 'status-scheduled',
  published: 'status-published',
  rejected: 'status-rejected',
  archived: 'status-archived',
};

export default function StatusBadge({ status, size = 'md' }) {
  return (
    <span
      className={`inline-flex items-center font-500 rounded-full ${classMap[status]} ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
    >
      {labels[status]}
    </span>
  );
}
