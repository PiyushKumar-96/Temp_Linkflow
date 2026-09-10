import { useQuery } from '@tanstack/react-query';
import { TopicSchema } from '@/lib/contracts/topic.schema';
import { z } from 'zod';

import { TOPICS } from '@/temp-backend/data/topics';

export const INITIAL_TOPICS = TOPICS;

const STORAGE_KEY = 'linkedflow_topics';

export function getStoredTopics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return z.array(TopicSchema).parse(parsed);
    }
  } catch {
    // Fallback to initial
  }
  return INITIAL_TOPICS;
}

export function saveStoredTopics(topics) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  } catch {
    // Ignore storage errors
  }
}

export function useTopicsQuery(filters = {}) {
  return useQuery({
    queryKey: ['topics', filters],
    queryFn: async () => {
      // Simulate network response
      await new Promise((r) => setTimeout(r, 120));
      let topics = getStoredTopics();

      if (filters.series && filters.series !== 'all') {
        topics = topics.filter((t) => t.seriesId === filters.series || t.seriesName === filters.series);
      }
      if (filters.account && filters.account !== 'all') {
        topics = topics.filter((t) => t.account === filters.account);
      }
      if (filters.status && filters.status !== 'all') {
        topics = topics.filter((t) => t.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        topics = topics.filter((t) => t.title.toLowerCase().includes(q) || t.brief?.toLowerCase().includes(q));
      }
      if (filters.month) {
        topics = topics.filter((t) => t.publicationDate.startsWith(filters.month));
      }

      return topics;
    },
    staleTime: 30000,
  });
}
