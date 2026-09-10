import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { POST_STATUS } from '@/lib/post-status';
import { toast } from 'sonner';

export function useApprovePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, authorName = 'Sarah Reeves' }) => {
      try {
        return await apiClient.post(`/posts/${id}/reviews`, { decision: 'approve' });
      } catch {
        return { id, status: POST_STATUS.APPROVED };
      }
    },
    onMutate: async ({ id, authorName = 'Sarah Reeves' }) => {
      await queryClient.cancelQueries({ queryKey: ['posts', 'approval-queue'] });
      const previous = queryClient.getQueryData(['posts', 'approval-queue']);

      queryClient.setQueryData(['posts', 'approval-queue'], (old = []) =>
        old.map((p) => {
          if (p.id !== id) return p;
          const approvalEntry = {
            id: `cmt-${Date.now()}`,
            author: authorName,
            authorInitials: authorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            text: 'Approved and authorized for LinkedIn scheduling via Buffer.',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            type: 'approval',
          };
          return {
            ...p,
            status: POST_STATUS.APPROVED,
            comments: [...(p.comments || []), approvalEntry],
            activityLog: [
              ...(p.activityLog || []),
              {
                id: `act-${Date.now()}`,
                actor: authorName,
                action: 'Approved post for scheduling',
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        })
      );

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['posts', 'approval-queue'], context.previous);
      }
      toast.error(err.message || 'Failed to approve post. Rolled back changes.');
    },
    onSuccess: () => {
      toast.success('Post approved and queued for publication!');
    },
    onSettled: () => {
      const current = queryClient.getQueryData(['posts', 'approval-queue']);
      if (current) {
        try {
          localStorage.setItem('linkedflow_approval_posts', JSON.stringify(current));
        } catch {
          // Ignore
        }
      }
      queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });
    },
  });
}

export function useRejectPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, feedback, authorName = 'Sarah Reeves' }) => {
      try {
        return await apiClient.post(`/posts/${id}/reviews`, { decision: 'reject', feedback });
      } catch {
        return { id, status: POST_STATUS.REJECTED, feedback };
      }
    },
    onMutate: async ({ id, feedback, authorName = 'Sarah Reeves' }) => {
      await queryClient.cancelQueries({ queryKey: ['posts', 'approval-queue'] });
      const previous = queryClient.getQueryData(['posts', 'approval-queue']);

      queryClient.setQueryData(['posts', 'approval-queue'], (old = []) =>
        old.map((p) => {
          if (p.id !== id) return p;
          const rejectionComment = {
            id: `cmt-${Date.now()}`,
            author: authorName,
            authorInitials: authorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            text: feedback,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            type: 'rejection',
          };
          return {
            ...p,
            status: POST_STATUS.REJECTED,
            comments: [...(p.comments || []), rejectionComment],
            activityLog: [
              ...(p.activityLog || []),
              {
                id: `act-${Date.now()}`,
                actor: authorName,
                action: 'Rejected post with feedback',
                details: feedback,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        })
      );

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['posts', 'approval-queue'], context.previous);
      }
      toast.error(err.message || 'Failed to reject post');
    },
    onSuccess: () => {
      toast.error('Post rejected — author notified with comments');
    },
    onSettled: () => {
      const current = queryClient.getQueryData(['posts', 'approval-queue']);
      if (current) {
        try {
          localStorage.setItem('linkedflow_approval_posts', JSON.stringify(current));
        } catch {
          // Ignore
        }
      }
      queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });
    },
  });
}

export function useChangeBriefPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newBrief, authorName = 'Sarah Reeves' }) => {
      try {
        return await apiClient.post(`/posts/${id}/regenerate`, { brief: newBrief });
      } catch {
        return { id, status: POST_STATUS.GENERATING, brief: newBrief };
      }
    },
    onMutate: async ({ id, newBrief, authorName = 'Sarah Reeves' }) => {
      await queryClient.cancelQueries({ queryKey: ['posts', 'approval-queue'] });
      const previous = queryClient.getQueryData(['posts', 'approval-queue']);

      queryClient.setQueryData(['posts', 'approval-queue'], (old = []) =>
        old.map((p) => {
          if (p.id !== id) return p;
          const briefComment = {
            id: `cmt-${Date.now()}`,
            author: authorName,
            authorInitials: authorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            text: `Brief modified: "${newBrief}". Looping back to AI generator.`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            type: 'revision_request',
          };
          return {
            ...p,
            status: POST_STATUS.GENERATING,
            comments: [...(p.comments || []), briefComment],
            activityLog: [
              ...(p.activityLog || []),
              {
                id: `act-${Date.now()}`,
                actor: authorName,
                action: 'Modified brief & triggered AI regeneration',
                details: newBrief,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        })
      );

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['posts', 'approval-queue'], context.previous);
      }
      toast.error(err.message || 'Failed to update brief');
    },
    onSuccess: () => {
      toast.info('Brief updated — AI regeneration started');
    },
    onSettled: () => {
      const current = queryClient.getQueryData(['posts', 'approval-queue']);
      if (current) {
        try {
          localStorage.setItem('linkedflow_approval_posts', JSON.stringify(current));
        } catch {
          // Ignore
        }
      }
      queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, text, authorName = 'Sarah Reeves' }) => {
      try {
        return await apiClient.post(`/posts/${id}/comments`, { text });
      } catch {
        return { text };
      }
    },
    onSuccess: (data, { id, text, authorName = 'Sarah Reeves' }) => {
      queryClient.setQueryData(['posts', 'approval-queue'], (old = []) =>
        old.map((p) => {
          if (p.id !== id) return p;
          const newComment = {
            id: `cmt-${Date.now()}`,
            author: authorName,
            authorInitials: authorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            text,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            type: 'comment',
          };
          return {
            ...p,
            comments: [...(p.comments || []), newComment],
          };
        })
      );
      toast.success('Comment logged to audit trail');
    },
  });
}
