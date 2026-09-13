'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FileSpreadsheet, Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getStoredPosts, saveStoredPosts } from '@/temp-backend';
import { BulkPostPreviewModal } from './BulkPreviewModals';
import BulkUploadToolbar from './BulkUploadToolbar';
import BulkUploadRow from './BulkUploadRow';
import {
  MOCK_IMAGE_URLS,
  SAMPLE_POSTS,
  generateId,
  generateMockCarousel,
} from './bulkUploadHelpers';

export default function BulkUploadTable({ posts, onPostsChange }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [sendingReview, setSendingReview] = useState(false);
  const [previewingPost, setPreviewingPost] = useState(null);

  // Parse Excel / CSV file
  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mockParsed = SAMPLE_POSTS.map((p) => ({
      ...p,
      id: generateId(),
    }));
    onPostsChange(mockParsed);
    toast.success(`Parsed ${mockParsed.length} posts from ${file.name}`);
    e.target.value = '';
  };

  const handleAddManual = () => {
    const newPost = {
      id: generateId(),
      header: '',
      content: '',
      hashtags: '',
      scheduledDate: '2026-09-25',
      scheduledTime: '09:00',
      visualFormat: 'image',
      imageStatus: 'none',
    };
    onPostsChange([...posts, newPost]);
  };

  const updatePost = (id, patch) => {
    onPostsChange(posts.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removePost = (id) => {
    onPostsChange(posts.filter((p) => p.id !== id));
  };

  // Format Switcher: Image vs PDF
  const handleSelectFormat = (id, format) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    if (format === 'pdf') {
      updatePost(id, {
        visualFormat: 'pdf',
        imageUrl: null,
        imageAlt: null,
        imageStatus: 'ready',
        pdfName: post.pdfName || `${(post.header || 'Document').replace(/\s+/g, '-')}.pdf`,
        pdfPages: post.pdfPages || 5,
        carouselSlides: post.carouselSlides || generateMockCarousel(post.header),
      });
      toast.info('Switched to PDF format. Please upload your PDF document.');
    } else {
      updatePost(id, {
        visualFormat: 'image',
        pdfName: null,
        pdfPages: null,
        carouselSlides: null,
        imageStatus: post.imageUrl ? 'ready' : 'none',
      });
      toast.info('Switched to Image format.');
    }
  };

  // AI Image generator for a specific post
  const generateImageForPost = async (id) => {
    setGeneratingId(id);
    await new Promise((r) => setTimeout(r, 800));
    const mockUrl = MOCK_IMAGE_URLS[Math.floor(Math.random() * MOCK_IMAGE_URLS.length)];
    updatePost(id, {
      visualFormat: 'image',
      imageUrl: mockUrl,
      imageAlt: 'AI generated image for LinkedIn post',
      pdfName: null,
      pdfPages: null,
      carouselSlides: null,
      imageStatus: 'ready',
    });
    setGeneratingId(null);
    toast.success('Generated AI Image');
  };

  // Manual image upload
  const handleImageFileUpload = (postId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updatePost(postId, {
      visualFormat: 'image',
      imageUrl: url,
      imageAlt: `Uploaded image: ${file.name}`,
      pdfName: null,
      pdfPages: null,
      carouselSlides: null,
      imageStatus: 'provided',
    });
    toast.success(`Image uploaded: ${file.name}`);
    e.target.value = '';
  };

  // Manual PDF file upload
  const handlePdfFileUpload = (postId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const post = posts.find((p) => p.id === postId);
    updatePost(postId, {
      visualFormat: 'pdf',
      pdfName: file.name,
      pdfPages: Math.floor(Math.random() * 4) + 4,
      imageUrl: null,
      imageAlt: null,
      imageStatus: 'ready',
      carouselSlides: generateMockCarousel(
        (post && post.header) || file.name.replace(/\.pdf$/i, '')
      ),
    });
    toast.success(`PDF document uploaded: ${file.name}`);
    e.target.value = '';
  };

  // Bulk actions: Generate all images
  const handleGenerateAllImages = async () => {
    setBulkGenerating(true);
    await new Promise((r) => setTimeout(r, 900));

    onPostsChange(
      posts.map((p) => {
        const mockUrl = MOCK_IMAGE_URLS[Math.floor(Math.random() * MOCK_IMAGE_URLS.length)];
        return {
          ...p,
          visualFormat: 'image',
          imageUrl: mockUrl,
          imageAlt: 'AI generated image for LinkedIn post',
          pdfName: null,
          pdfPages: null,
          carouselSlides: null,
          imageStatus: 'ready',
        };
      })
    );

    setBulkGenerating(false);
    toast.success('Generated AI images for all posts');
  };

  // Bulk action: Set all to PDF
  const handleSetAllPdf = () => {
    onPostsChange(
      posts.map((p) => ({
        ...p,
        visualFormat: 'pdf',
        imageUrl: null,
        imageAlt: null,
        imageStatus: 'ready',
        pdfName: p.pdfName || `${(p.header || 'Document').replace(/\s+/g, '-')}.pdf`,
        pdfPages: p.pdfPages || 5,
        carouselSlides: p.carouselSlides || generateMockCarousel(p.header),
      }))
    );
    toast.info('Switched all posts to PDF format');
  };

  // Send all posts to Approval Queue for review
  const handleSendAllForReview = async () => {
    if (posts.length === 0) return;
    setSendingReview(true);
    await new Promise((r) => setTimeout(r, 600));

    const formattedBulkPosts = posts.map((p, idx) => {
      const isPdf = p.visualFormat === 'pdf';

      return {
        id: p.id || `bulk-${Date.now()}-${idx}`,
        title: p.header || (p.content || '').slice(0, 50) || `Bulk Upload Post #${idx + 1}`,
        content: p.content || '',
        hashtags:
          typeof p.hashtags === 'string'
            ? p.hashtags.split(/\s+/).filter(Boolean)
            : Array.isArray(p.hashtags)
              ? p.hashtags
              : [],
        scheduledDate: p.scheduledDate || '2026-09-25',
        scheduledTime: p.scheduledTime || '09:00',
        dueDate: p.scheduledDate || '2026-09-25',
        visualFormat: isPdf ? 'carousel' : 'image',
        imageUrl: isPdf ? null : p.imageUrl,
        pdfName: isPdf ? p.pdfName : null,
        pdfPages: isPdf ? p.pdfPages : null,
        carouselSlides: isPdf ? p.carouselSlides || generateMockCarousel(p.header) : null,
        infographicData: null,
        status: 'awaiting_review',
        source: 'bulk_upload',
        author: 'Sarah Reeves',
        authorInitials: 'SR',
        authorRole: 'Head of Content',
        submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        revisions: 1,
        revisionsList: [
          {
            id: `rev-${Date.now()}-${idx}`,
            versionNumber: 1,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            author: 'Sarah Reeves',
            authorType: 'human',
            summary: 'Imported from spreadsheet file',
          },
        ],
        activityLog: [
          {
            id: `act-${Date.now()}-${idx}`,
            actor: 'Sarah Reeves',
            action: `Imported and sent for review with scheduled date ${p.scheduledDate || '2026-09-25'} ${p.scheduledTime || '09:00'}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          },
        ],
        qualityAudit: {
          score: 88,
          grade: 'B+',
          verdict: 'Ready for Review',
          hookScore: 86,
          clarityScore: 90,
          voiceScore: 88,
          readabilityWpm: 205,
          issues: [],
        },
        citations: [],
        comments: [],
      };
    });

    try {
      const stored = localStorage.getItem('linkedflow_approval_posts');
      const approvalPosts = stored ? JSON.parse(stored) : [];
      const newIds = new Set(formattedBulkPosts.map((p) => p.id));
      const nextApproval = [
        ...formattedBulkPosts,
        ...approvalPosts.filter((p) => !newIds.has(p.id)),
      ];
      localStorage.setItem('linkedflow_approval_posts', JSON.stringify(nextApproval));

      const masterPosts = getStoredPosts();
      const nextMaster = [...formattedBulkPosts, ...masterPosts.filter((p) => !newIds.has(p.id))];
      saveStoredPosts(nextMaster);

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'approval-queue'] });

      setSendingReview(false);
      toast.success(`${posts.length} posts sent to Approval Queue for review!`, {
        action: {
          label: 'View Queue',
          onClick: () => navigate('/approval-workflow?source=bulk_upload'),
        },
      });
    } catch {
      setSendingReview(false);
      toast.error('Failed to submit posts for review');
    }
  };

  // Summary counts for Images vs PDFs
  const counts = useMemo(() => {
    let images = 0;
    let pdfs = 0;
    posts.forEach((p) => {
      if (p.visualFormat === 'pdf') pdfs++;
      else images++;
    });
    return { images, pdfs };
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileSpreadsheet size={28} className="text-primary" />
        </div>
        <div className="text-center max-w-md">
          <h3 className="text-base font-600 text-foreground mb-1">Upload posts in bulk</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload an Excel (.xlsx) or CSV file with your post headers, content, hashtags, and
            dates. Then configure each post with an Image or PDF document.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Upload size={14} />
            Upload Excel / CSV
          </button>
          <button
            onClick={handleAddManual}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Plus size={14} />
            Add Manually
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleExcelUpload}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top Toolbar */}
      <BulkUploadToolbar
        postsCount={posts.length}
        counts={counts}
        bulkGenerating={bulkGenerating}
        schedulingAll={sendingReview}
        onGenerateAllImages={handleGenerateAllImages}
        onSetAllPdf={handleSetAllPdf}
        onReupload={() => fileInputRef.current?.click()}
        onAddManual={handleAddManual}
        onSendForReview={handleSendAllForReview}
      />

      {/* Spacious Uncramped Table with Smooth Scroll */}
      <div className="card overflow-x-auto p-0 border border-border shadow-xs">
        <table className="w-full min-w-[1240px] text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider w-10 text-center">
                #
              </th>
              <th className="px-3 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider min-w-[190px]">
                Header / Title
              </th>
              <th className="px-3 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider min-w-[340px]">
                Post Content
              </th>
              <th className="px-3 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider min-w-[150px]">
                Hashtags
              </th>
              <th className="px-3 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider min-w-[150px]">
                Scheduled Slot
              </th>
              <th className="px-3 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider min-w-[260px]">
                Format & Media
              </th>
              <th className="px-3 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider min-w-[110px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post, idx) => (
              <BulkUploadRow
                key={post.id}
                post={post}
                idx={idx}
                generatingId={generatingId}
                onUpdatePost={updatePost}
                onRemovePost={removePost}
                onSelectFormat={handleSelectFormat}
                onGenerateImage={generateImageForPost}
                onImageFileUpload={handleImageFileUpload}
                onPdfFileUpload={handlePdfFileUpload}
                onPreviewPost={(p) => setPreviewingPost(p)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleExcelUpload}
      />

      {/* Post Preview Modal */}
      <BulkPostPreviewModal
        isOpen={!!previewingPost}
        onClose={() => setPreviewingPost(null)}
        post={previewingPost}
      />
    </div>
  );
}
