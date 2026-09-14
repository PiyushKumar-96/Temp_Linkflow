import { useQuery } from '@tanstack/react-query';
import { TopicSchema } from '@/lib/contracts/topic.schema';
import { z } from 'zod';
import { matchesStatusBucket } from '@/lib/post-status';

import { TOPICS } from '@/temp-backend/data/topics';

export const INITIAL_TOPICS = TOPICS;

const STORAGE_KEY = 'linkedflow_topics_v2';

export function getStoredTopics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map((item) => {
            const start = item.startDate || item.publicationDate || '2026-09-14';
            const end = item.endDate || start;
            const pub = item.publicationDate || start;
            return {
              id: item.id || `top-${Date.now()}`,
              title: item.title || 'Untitled topic',
              seriesId: item.seriesId || 'series-1',
              seriesName: item.seriesName || 'Thought Leadership',
              account: item.account || 'personal',
              audience: item.audience || 'B2B SaaS Founders',
              cadence: item.cadence || 'custom',
              startDate: start,
              endDate: end,
              publicationDate: pub,
              brief: item.brief || '',
              status: item.status || 'planned',
              downstreamPostId: item.downstreamPostId,
              downstreamPostStatus: item.downstreamPostStatus,
              createdAt: item.createdAt || new Date().toISOString(),
            };
          })
          .filter((item) => TopicSchema.safeParse(item).success);
        return normalized;
      }
    }
  } catch (err) {
    console.error('Failed to parse stored topics:', err);
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
        topics = topics.filter(
          (t) => t.seriesId === filters.series || t.seriesName === filters.series
        );
      }
      if (filters.account && filters.account !== 'all') {
        topics = topics.filter((t) => t.account === filters.account);
      }
      if (filters.status && filters.status !== 'all') {
        topics = topics.filter(
          (t) => t.status === filters.status || matchesStatusBucket(t.status, filters.status)
        );
      }
      if (filters.cadence && filters.cadence !== 'all') {
        topics = topics.filter((t) => (t.cadence || 'custom') === filters.cadence);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        topics = topics.filter(
          (t) => t.title.toLowerCase().includes(q) || t.brief?.toLowerCase().includes(q)
        );
      }
      if (filters.month) {
        topics = topics.filter((t) => t.publicationDate.startsWith(filters.month));
      }

      return topics;
    },
    staleTime: 30000,
  });
}
