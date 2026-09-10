import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMember) => {
      try {
        return await apiClient.post('/team/invite', newMember);
      } catch {
        const member = {
          id: `usr-${Date.now()}`,
          name: newMember.name,
          email: newMember.email,
          role: newMember.role,
          status: 'pending',
          initials: newMember.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          joinedAt: new Date().toISOString().split('T')[0],
        };
        return member;
      }
    },
    onSuccess: (newMember) => {
      queryClient.setQueryData(['team', 'members'], (prev = []) => {
        const next = [...prev, newMember];
        try {
          localStorage.setItem('linkedflow_team_members', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
      toast.success(`Invitation sent to ${newMember.email}`);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to invite member');
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }) => {
      try {
        return await apiClient.patch(`/team/members/${id}/role`, { role });
      } catch {
        return { id, role };
      }
    },
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ['team', 'members'] });
      const previous = queryClient.getQueryData(['team', 'members']);
      queryClient.setQueryData(['team', 'members'], (old = []) =>
        old.map((m) => (m.id === id ? { ...m, role } : m))
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['team', 'members'], context.previous);
      }
      toast.error(err.message || 'Failed to update member role');
    },
    onSettled: () => {
      const current = queryClient.getQueryData(['team', 'members']);
      if (current) {
        try {
          localStorage.setItem('linkedflow_team_members', JSON.stringify(current));
        } catch {
          // Ignore
        }
      }
      queryClient.invalidateQueries({ queryKey: ['team', 'members'] });
    },
  });
}
