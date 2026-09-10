/**
 * Temp Backend: Media & Image Assets
 * Single source of truth for all image URLs, stock photography, avatars, and visual assets.
 * All URLs are verified against image-hosts.config.mjs.
 */

export const AVATARS = {
  sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  marcus: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  jordan: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  lisa: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  alex: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
};

export const STOCK_IMAGES = {
  teamBrainstorm: {
    id: 'img-stock-01',
    label: 'Team Strategy Session',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    category: 'Workplace & Culture',
  },
  modernWorkspace: {
    id: 'img-stock-02',
    label: 'Modern Minimalist Workspace',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    category: 'Technology',
  },
  growthDashboard: {
    id: 'img-stock-03',
    label: 'Analytics & Growth Metrics',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    category: 'SaaS & Metrics',
  },
  collaborationDesk: {
    id: 'img-stock-04',
    label: 'Creative Collaboration',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    category: 'Collaboration',
  },
  strategicPlanning: {
    id: 'img-stock-05',
    label: 'Leadership Planning',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    category: 'Leadership',
  },
  executivePortrait: {
    id: 'img-stock-06',
    label: 'Executive Focus',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    category: 'Professional',
  },
};

export const STOCK_IMAGES_LIST = Object.values(STOCK_IMAGES);

export const VISUAL_TEMPLATES = [
  {
    id: 'tmpl-vis-01',
    name: 'Minimal Corporate Quote',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&auto=format&fit=crop&q=80',
    format: 'image',
  },
  {
    id: 'tmpl-vis-02',
    name: 'SaaS Metric Stat Card',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80',
    format: 'infographic',
  },
  {
    id: 'tmpl-vis-03',
    name: '5-Slide Playbook Carousel',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&auto=format&fit=crop&q=80',
    format: 'carousel',
  },
];

export const BRANDING = {
  companyName: 'Acme Corp',
  companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
  brandColor: '#0A66C2',
};
