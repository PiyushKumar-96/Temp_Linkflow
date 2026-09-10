/**
 * Helper utilities and mock data for Bulk Upload in Content Library.
 */

export const MOCK_IMAGE_URLS = [
  'https://img.rocket.new/generatedImages/rocket_gen_img_1b4fc0b68-1773435165826.png',
  'https://img.rocket.new/generatedImages/rocket_gen_img_11c4a0e7e-1767621207129.png',
];

export function generateId() {
  return `bulk-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function generateMockCarousel(topicTitle) {
  const title = topicTitle || 'Strategic Playbook';
  return [
    {
      id: 'slide-1',
      headline: title,
      body: 'Key frameworks, strategic metrics, and real-world execution lessons for high-performing teams.',
      tag: 'SLIDE 01 / 05',
      accentColor: '#0a66c2',
    },
    {
      id: 'slide-2',
      headline: 'Phase 1: Foundation & Baseline',
      body: 'Audit current workflows and benchmark key conversion funnels before making systemic changes.',
      tag: 'SLIDE 02 / 05',
      accentColor: '#6366f1',
    },
    {
      id: 'slide-3',
      headline: 'Phase 2: Structured Execution',
      body: 'Eliminate friction points with automated pipelines and dedicated response SLAs.',
      tag: 'SLIDE 03 / 05',
      accentColor: '#8b5cf6',
    },
    {
      id: 'slide-4',
      headline: 'Phase 3: Optimization & Scale',
      body: 'Double down on high-performing pillars and scale distribution predictably.',
      tag: 'SLIDE 04 / 05',
      accentColor: '#0ea5e9',
    },
    {
      id: 'slide-5',
      headline: 'Key Takeaways & Action Item',
      body: 'Save this guide and share it with your leadership team to accelerate results this quarter.',
      tag: 'SLIDE 05 / 05',
      accentColor: '#10b981',
    },
  ];
}

export function generateMockInfographic(topicTitle) {
  const title = topicTitle || 'Growth Framework';
  return {
    title,
    subtitle: 'Operational velocity & performance benchmark overview',
    dataPoints: [
      { label: 'Pipeline Velocity', value: '+310%', description: 'Quarter-over-quarter expansion' },
      { label: 'Team Efficiency', value: '4.8x', description: 'Faster content turnaround' },
      { label: 'Inbound Qualified', value: '72%', description: 'Direct attribution conversion' },
    ],
  };
}

export const SAMPLE_POSTS = [
  {
    header: 'Milestone: 10K Customers',
    content:
      "We just crossed 10,000 customers — here's what we learned about building trust at scale...",
    hashtags: '#milestone #growth #saas',
    scheduledDate: '2026-09-15',
    scheduledTime: '09:00',
    visualFormat: 'image',
    imageUrl: MOCK_IMAGE_URLS[0],
    imageStatus: 'ready',
  },
  {
    header: 'Remote Work Insights',
    content:
      'After 3 years of async-first culture, here are the 5 habits that changed everything for our team...',
    hashtags: '#remotework #culture #productivity',
    scheduledDate: '2026-09-17',
    scheduledTime: '10:00',
    visualFormat: 'pdf',
    pdfName: 'Remote-Work-Culture-Guide-2026.pdf',
    pdfPages: 5,
    carouselSlides: generateMockCarousel('Remote Work Insights'),
    imageStatus: 'ready',
  },
  {
    header: 'Product Launch Announcement',
    content:
      'Excited to announce our new AI-powered analytics dashboard — built for teams who move fast...',
    hashtags: '#productlaunch #ai #saas',
    scheduledDate: '2026-09-19',
    scheduledTime: '11:00',
    visualFormat: 'image',
    imageUrl: MOCK_IMAGE_URLS[1],
    imageStatus: 'ready',
  },
  {
    header: 'LinkedIn Growth Strategy',
    content:
      'The 5 LinkedIn habits that helped us grow from 800 to 22,000 followers in 18 months...',
    hashtags: '#linkedin #growth #contentmarketing',
    scheduledDate: '2026-09-22',
    scheduledTime: '09:00',
    visualFormat: 'pdf',
    pdfName: 'LinkedIn-Growth-Playbook.pdf',
    pdfPages: 6,
    carouselSlides: generateMockCarousel('LinkedIn Growth Strategy'),
    imageStatus: 'ready',
  },
  {
    header: 'Customer Success Story',
    content: 'How one of our customers reduced onboarding time by 62% using our platform...',
    hashtags: '#customersuccess #casestudy #saas',
    scheduledDate: '2026-09-24',
    scheduledTime: '10:00',
    visualFormat: 'image',
    imageStatus: 'none',
  },
];
