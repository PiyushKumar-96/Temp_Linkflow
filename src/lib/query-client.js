import { QueryClient } from '@tanstack/react-query';

/**
 * Standard QueryClient configuration for LinkedFlow
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute fresh window
      gcTime: 5 * 60 * 1000, // 5 minutes cache retention
      retry: (failureCount, error) => {
        // Do not retry 401, 403, or 404
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
