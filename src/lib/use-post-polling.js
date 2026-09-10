import { useQuery } from '@tanstack/react-query';
import { isInProgress, isTerminal, normalizeStatus } from './post-status';
import apiClient from './api-client';

/**
 * usePostPolling Hook
 * Wraps useQuery with dynamic refetch interval based on the post's current state.
 * Polls every 3000ms while post is generating or undergoing auto_review.
 * Disables polling immediately on any terminal status or when complete.
 *
 * @param {string} postId - Target post identifier
 * @param {Object} [options={}] - Additional useQuery options
 */
export function usePostPolling(postId, options = {}) {
  return useQuery({
    queryKey: ['post', 'poll', postId],
    queryFn: async () => {
      if (!postId) return null;
      return apiClient.get(`/posts/${postId}`);
    },
    enabled: Boolean(postId),
    // refetchInterval is a function of the query's current data
    refetchInterval: (query) => {
      const data = query?.state?.data;
      if (!data?.status) return false;

      const canonical = normalizeStatus(data.status);

      // Stop immediately on terminal states
      if (isTerminal(canonical)) {
        return false;
      }

      // Poll every 3 seconds only while in an active generation or audit phase
      if (isInProgress(canonical)) {
        return 3000;
      }

      return false;
    },
    refetchIntervalInBackground: false,
    ...options,
  });
}

export default usePostPolling;
