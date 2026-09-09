'use client';

import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Sparkles, Image as ImageIcon, Trash2, Calendar, CheckCircle2, Loader2, Download, Plus } from 'lucide-react';
import type { BulkPost } from './LibraryShell';
import { toast } from 'sonner';

const MOCK_IMAGE_URLS = [
  'https://img.rocket.new/generatedImages/rocket_gen_img_1b4fc0b68-1773435165826.png',
  'https://img.rocket.new/generatedImages/rocket_gen_img_11c4a0e7e-1767621207129.png',
];

const SAMPLE_POSTS: Omit<BulkPost, 'id' | 'imageStatus'>[] = [
  { header: 'Milestone: 10K Customers', content: 'We just crossed 10,000 customers — here\'s what we learned about building trust at scale...', hashtags: '#milestone #growth #saas', scheduledDate: '2026-09-15', scheduledTime: '09:00' },
  { header: 'Remote Work Insights', content: 'After 3 years of async-first culture, here are the 5 habits that changed everything for our team...', hashtags: '#remotework #culture #productivity', scheduledDate: '2026-09-17', scheduledTime: '10:00' },
  { header: 'Product Launch Announcement', content: 'Excited to announce our new AI-powered analytics dashboard — built for teams who move fast...', hashtags: '#productlaunch #ai #saas', scheduledDate: '2026-09-19', scheduledTime: '11:00' },
  { header: 'LinkedIn Growth Strategy', content: 'The 5 LinkedIn habits that helped us grow from 800 to 22,000 followers in 18 months...', hashtags: '#linkedin #growth #contentmarketing', scheduledDate: '2026-09-22', scheduledTime: '09:00' },
  { header: 'Customer Success Story', content: 'How one of our customers reduced onboarding time by 62% using our platform...', hashtags: '#customersuccess #casestudy #saas', scheduledDate: '2026-09-24', scheduledTime: '10:00' },
];

function generateId() {
  return `bulk-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

interface Props {
  posts: BulkPost[];
  onPostsChange: React.Dispatch<React.SetStateAction<BulkPost[]>>;
}

export default function BulkUploadTable({ posts, onPostsChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [schedulingAll, setSchedulingAll] = useState(false);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock parsing — in production this would use xlsx library
    const mockParsed: BulkPost[] = SAMPLE_POSTS.map((p, i) => ({
      ...p,
      id: generateId(),
      imageStatus: 'none' as const,
    }));
    onPostsChange(mockParsed);
    toast.success(`Parsed ${mockParsed.length} posts from ${file.name}`);
    e.target.value = '';
  };

  const handleAddManual = () => {
    const newPost: BulkPost = {
      id: generateId(),
      header: '',
      content: '',
      hashtags: '',
      scheduledDate: '2026-09-25',
      scheduledTime: '09:00',
      imageStatus: 'none',
    };
    onPostsChange([...posts, newPost]);
  };

  const updatePost = (id: string, patch: Partial<BulkPost>) => {
    onPostsChange(posts.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const removePost = (id: string) => {
    onPostsChange(posts.filter(p => p.id !== id));
  };

  const generateImageForPost = async (id: string) => {
    setGeneratingId(id);
    await new Promise(r => setTimeout(r, 1500));
    const mockUrl = MOCK_IMAGE_URLS[Math.floor(Math.random() * MOCK_IMAGE_URLS.length)];
    updatePost(id, {
      imageUrl: mockUrl,
      imageAlt: 'AI generated image for LinkedIn post',
      imageStatus: 'ready',
    });
    setGeneratingId(null);
    toast.success('Image generated for post');
  };

  const generateAllImages = async () => {
    const postsWithoutImages = posts.filter(p => p.imageStatus === 'none');
    if (postsWithoutImages.length === 0) {
      toast.info('All posts already have images');
      return;
    }
    setGeneratingAll(true);
    for (const post of postsWithoutImages) {
      await new Promise(r => setTimeout(r, 600));
      const mockUrl = MOCK_IMAGE_URLS[Math.floor(Math.random() * MOCK_IMAGE_URLS.length)];
      onPostsChange(prev => prev.map(p => p.id === post.id ? {
        ...p,
        imageUrl: mockUrl,
        imageAlt: 'AI generated image for LinkedIn post',
        imageStatus: 'ready' as const,
      } : p));
    }
    setGeneratingAll(false);
    toast.success(`Generated images for ${postsWithoutImages.length} posts`);
  };

  const scheduleAll = async () => {
    setSchedulingAll(true);
    await new Promise(r => setTimeout(r, 800));
    setSchedulingAll(false);
    toast.success(`${posts.length} posts scheduled to Content Calendar!`);
  };

  const handleImageFileUpload = (postId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updatePost(postId, {
      imageUrl: url,
      imageAlt: `Uploaded image: ${file.name}`,
      imageStatus: 'provided',
    });
    toast.success('Image uploaded');
    e.target.value = '';
  };

  const downloadTemplate = () => {
    toast.info('Template download started (CSV format)');
  };

  if (posts.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileSpreadsheet size={28} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="text-base font-700 text-foreground">Bulk Post Upload</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Upload an Excel/CSV file with your post content, headers, and schedule dates. Then generate or upload images for each post.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={downloadTemplate} className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={14} />
            Download Template
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-primary flex items-center gap-2 text-sm">
            <Upload size={14} />
            Upload Excel / CSV
          </button>
          <button onClick={handleAddManual} className="btn-secondary flex items-center gap-2 text-sm">
            <Plus size={14} />
            Add Manually
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelUpload} />
      </div>
    );
  }

  const withImages = posts.filter(p => p.imageStatus !== 'none').length;
  const withoutImages = posts.filter(p => p.imageStatus === 'none').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary flex items-center gap-1.5 text-sm">
            <Upload size={14} />
            Re-upload File
          </button>
          <button onClick={handleAddManual} className="btn-secondary flex items-center gap-1.5 text-sm">
            <Plus size={14} />
            Add Row
          </button>
          <span className="text-xs text-muted-foreground">{posts.length} posts · {withImages} with images · {withoutImages} without</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateAllImages}
            disabled={generatingAll || withoutImages === 0}
            className="btn-secondary flex items-center gap-1.5 text-sm disabled:opacity-50"
          >
            {generatingAll ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {generatingAll ? 'Generating...' : `Generate All Images (${withoutImages})`}
          </button>
          <button
            onClick={scheduleAll}
            disabled={schedulingAll}
            className="btn-primary flex items-center gap-1.5 text-sm"
          >
            {schedulingAll ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={14} />}
            Schedule All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide w-8">#</th>
              <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide min-w-[160px]">Header</th>
              <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide min-w-[260px]">Post Content</th>
              <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide min-w-[140px]">Hashtags</th>
              <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide w-[120px]">Date</th>
              <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide w-[90px]">Time</th>
              <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide w-[180px]">Image</th>
              <th className="px-3 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post, idx) => (
              <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{idx + 1}</td>
                <td className="px-3 py-3">
                  <input
                    type="text"
                    value={post.header}
                    onChange={e => updatePost(post.id, { header: e.target.value })}
                    placeholder="Post header..."
                    className="w-full bg-transparent text-sm text-foreground outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors py-0.5"
                  />
                </td>
                <td className="px-3 py-3">
                  <textarea
                    value={post.content}
                    onChange={e => updatePost(post.id, { content: e.target.value })}
                    placeholder="Post content..."
                    rows={2}
                    className="w-full bg-transparent text-sm text-foreground outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors py-0.5 resize-none"
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="text"
                    value={post.hashtags}
                    onChange={e => updatePost(post.id, { hashtags: e.target.value })}
                    placeholder="#hashtag..."
                    className="w-full bg-transparent text-xs text-primary outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors py-0.5"
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="date"
                    value={post.scheduledDate}
                    onChange={e => updatePost(post.id, { scheduledDate: e.target.value })}
                    className="bg-transparent text-xs text-foreground outline-none w-full"
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="time"
                    value={post.scheduledTime}
                    onChange={e => updatePost(post.id, { scheduledTime: e.target.value })}
                    className="bg-transparent text-xs text-foreground outline-none w-full"
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    {post.imageStatus === 'none' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => generateImageForPost(post.id)}
                          disabled={generatingId === post.id}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-600 disabled:opacity-50"
                        >
                          {generatingId === post.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          AI Image
                        </button>
                        <label className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-600 cursor-pointer">
                          <ImageIcon size={10} />
                          Upload
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileUpload(post.id, e)} />
                        </label>
                      </div>
                    )}
                    {post.imageStatus === 'generating' && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 size={12} className="animate-spin" />
                        Generating...
                      </div>
                    )}
                    {(post.imageStatus === 'ready' || post.imageStatus === 'provided') && post.imageUrl && (
                      <div className="flex items-center gap-2">
                        <img src={post.imageUrl} alt={post.imageAlt || 'Post image'} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-xs text-success font-600">
                            <CheckCircle2 size={10} />
                            {post.imageStatus === 'provided' ? 'Uploaded' : 'AI Generated'}
                          </span>
                          <button
                            onClick={() => updatePost(post.id, { imageUrl: undefined, imageAlt: undefined, imageStatus: 'none' })}
                            className="text-xs text-muted-foreground hover:text-danger transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <button
                    onClick={() => removePost(post.id)}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-danger transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelUpload} />
    </div>
  );
}
