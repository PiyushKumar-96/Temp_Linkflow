import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredTopics, saveStoredTopics } from './queries';
import { toast } from 'sonner';

export function useCreateTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTopicData) => {
      await new Promise((r) => setTimeout(r, 150));
      const topics = getStoredTopics();
      const newTopic = {
        ...newTopicData,
        id: `top-${Date.now()}`,
        status: 'planned',
        cadence: newTopicData.cadence || 'custom',
        startDate: newTopicData.startDate || newTopicData.publicationDate,
        endDate: newTopicData.endDate || newTopicData.startDate || newTopicData.publicationDate,
        publicationDate: newTopicData.publicationDate || newTopicData.startDate,
        createdAt: new Date().toISOString(),
      };
      const updated = [newTopic, ...topics];
      saveStoredTopics(updated);
      return newTopic;
    },
    onSuccess: (newTopic) => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success(`Planned topic: "${newTopic.title.slice(0, 35)}..."`);
    },
    onError: (err) => {
      toast.error(`Failed to plan topic: ${err.message}`);
    },
  });
}

export function useBulkCreateTopicsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTopicsList) => {
      await new Promise((r) => setTimeout(r, 200));
      const topics = getStoredTopics();
      const now = Date.now();
      const prepared = newTopicsList.map((item, idx) => ({
        ...item,
        id: `top-${now}-${idx}`,
        status: 'planned',
        cadence: item.cadence || 'weekly',
        startDate: item.startDate || item.publicationDate,
        endDate: item.endDate || item.startDate || item.publicationDate,
        publicationDate: item.publicationDate || item.startDate,
        createdAt: new Date(now + idx * 1000).toISOString(),
      }));
      const updated = [...prepared, ...topics];
      saveStoredTopics(updated);
      return prepared;
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success(`Batch planned ${created.length} topics`);
    },
    onError: (err) => {
      toast.error(`Batch planning failed: ${err.message}`);
    },
  });
}

export function useUpdateTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      await new Promise((r) => setTimeout(r, 150));
      const topics = getStoredTopics();
      const updated = topics.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveStoredTopics(updated);
      return { id, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Topic updated successfully');
    },
    onError: (err) => {
      toast.error(`Failed to update topic: ${err.message}`);
    },
  });
}

export function useDeleteTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await new Promise((r) => setTimeout(r, 150));
      const topics = getStoredTopics();
      const updated = topics.filter((t) => t.id !== id);
      saveStoredTopics(updated);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Topic deleted');
    },
    onError: (err) => {
      toast.error(`Failed to delete topic: ${err.message}`);
    },
  });
}

export function useBulkUpdateTopicsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, updates }) => {
      await new Promise((r) => setTimeout(r, 200));
      const topics = getStoredTopics();
      const updated = topics.map((t) => {
        if (ids.includes(t.id)) {
          return { ...t, ...updates };
        }
        return t;
      });
      saveStoredTopics(updated);
      return { ids, updates };
    },
    onSuccess: ({ ids }) => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success(`Updated ${ids.length} topics`);
    },
    onError: (err) => {
      toast.error(`Bulk update failed: ${err.message}`);
    },
  });
}

export function useStartTopicGenerationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topicId) => {
      await new Promise((r) => setTimeout(r, 250));
      const topics = getStoredTopics();
      const topic = topics.find((t) => t.id === topicId);
      if (!topic) throw new Error('Topic not found');

      const newPostId = `post-${Date.now()}`;
      const updatedTopics = topics.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            status: 'generating',
            downstreamPostId: newPostId,
            downstreamPostStatus: 'generating',
          };
        }
        return t;
      });
      saveStoredTopics(updatedTopics);

      // Also create an entry in linkedflow_approval_posts so it appears in Approval workflow
      try {
        const approvalPostsRaw = localStorage.getItem('linkedflow_approval_posts');
        const approvalPosts = approvalPostsRaw ? JSON.parse(approvalPostsRaw) : [];
        const newApprovalPost = {
          id: newPostId,
          title: topic.title,
          category: topic.seriesName || 'Thought Leadership',
          content: `${topic.title}\n\n${topic.brief || 'Generated based on planned topic brief.'}\n\nKey takeaways:\n→ Insight 1: Focus on quality\n→ Insight 2: Build consistency\n\nWhat are your thoughts?`,
          cta: 'What is your experience with this? Share below 👇',
          hashtags: ['#B2BMarketing', '#Growth', '#LinkedInStrategy'],
          scheduledFor: topic.publicationDate,
          status: 'generating',
          stage: 'analyzing',
          author: topic.account === 'company' ? 'Acme Corp' : 'Sarah Reeves',
          authorRole: topic.account === 'company' ? 'Company Page' : 'Founder',
          authorAvatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          authorInitials: 'SR',
          qualityScore: 88,
          readTime: '2 min read',
          visualFormat: 'image',
          imageUrl:
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
          revisions: 1,
          revisionsList: [
            {
              version: 1,
              author: 'AI Generator (GPT-4o)',
              authorRole: 'AI Workflow',
              timestamp: 'Just now',
              reason: 'Initial generation from planned topic',
              content: topic.title,
            },
          ],
        };
        localStorage.setItem(
          'linkedflow_approval_posts',
          JSON.stringify([newApprovalPost, ...approvalPosts])
        );
      } catch {
        // Ignore
      }

      return { topicId, newPostId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['approval-posts'] });
      toast.success('Queued topic for AI generation pipeline 🚀');
    },
  });
}
