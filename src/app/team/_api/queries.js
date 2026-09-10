import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export const INITIAL_TEAM_MEMBERS = [
  {
    id: 'usr-1',
    name: 'Sarah Reeves',
    email: 'sarah.reeves@acme.corp',
    role: 'owner',
    status: 'active',
    initials: 'SR',
    joinedAt: '2024-01-15',
  },
  {
    id: 'usr-2',
    name: 'Marcus Chen',
    email: 'marcus.chen@acme.corp',
    role: 'marketing',
    status: 'active',
    initials: 'MC',
    joinedAt: '2024-03-20',
  },
  {
    id: 'usr-3',
    name: 'Lisa Tran',
    email: 'lisa.tran@acme.corp',
    role: 'marketing',
    status: 'active',
    initials: 'LT',
    joinedAt: '2024-06-10',
  },
  {
    id: 'usr-4',
    name: 'Jordan Patel',
    email: 'jordan.patel@acme.corp',
    role: 'reviewer',
    status: 'pending',
    initials: 'JP',
    joinedAt: '2026-09-01',
  },
];

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team', 'members'],
    queryFn: async () => {
      try {
        const data = await apiClient.get('/team/members');
        const list = Array.isArray(data?.members) ? data.members : (Array.isArray(data) ? data : null);
        if (list && list.length > 0) return list;
      } catch {
        // Fallback below
      }
      const stored = localStorage.getItem('linkedflow_team_members');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // Ignore parse error
        }
      }
      return INITIAL_TEAM_MEMBERS;
    },
    staleTime: 60 * 1000,
  });
}
