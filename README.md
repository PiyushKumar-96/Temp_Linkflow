# LinkedFlow — LinkedIn Management Frontend

A modern Next.js 15 application built with React 19, JavaScript (JSX), and Tailwind CSS for creating, scheduling, approving, and tracking LinkedIn posts from a collaborative team workspace.

## 🚀 Features

- **Next.js 15 (App Router)** - Fast server & client routing with modern page architecture
- **React 19** - Latest React version with modern hook patterns
- **JavaScript & JSX** - Clean, standard JSX components
- **Tailwind CSS & Autoprefixer** - Utility-first CSS framework with tailored tokens and component layers
- **Authentication & Role Simulation (`/login`)** - Dedicated login portal with 1-click test roles:
  - **Account Owner**: Full approval, publishing, and settings management
  - **Marketing User**: Content creation, draft authoring, and queue submission
- **Interactive Account Switcher** - Live toggle between Company Page (`Acme Corp`) and Personal Profile (`Sarah Reeves`) in the top navigation
- **AI Image Carousel Selector** - Generate and toggle between 2–3 visual candidate variations with preview indicators directly in the composer
- **Structured Review Workspace (`/approval-workflow`)** - Granular Hook, Body, and Call-to-Action inspection, AI quality audit score, attached visual carousel, and role-gated approval controls
- **Post Creation Composer** - Full post composer with live LinkedIn preview, dedicated Call-to-Action field, category/tone selectors, and hashtag recommendations
- **Analytics Dashboard** - Metrics bento grid, engagement trends, post breakdowns, and heatmaps
- **AI Post Generator** - AI-assisted topic ideation and multi-post batch generation
- **Content Calendar** - Interactive monthly and weekly content scheduling
- **Content Library & Bulk Upload** - Asset repository with support for bulk scheduling and spreadsheet parsing
- **Post Templates** - Reusable post frameworks and hook templates

---

## 🛠️ Getting Started

### 1. Prerequisites

- **Node.js**: `v20` or higher (tested with `v22.12.0`)
- **npm**: `v10` or higher

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/PROGITADMIN/linkedin_management_frontend.git
cd linkedin_management_frontend
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env` and set your API keys if needed:

```bash
cp .env.example .env
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:4028](http://localhost:4028) in your browser to view the app.

---

## 📁 Project Structure

```text
linkedflow/
├── public/                 # Static assets (images, logos, icons)
├── src/
│   ├── app/                # App Router pages and features
│   │   ├── ai-generator/           # AI Post generation module
│   │   ├── approval-workflow/      # Post approval queue & review workspace
│   │   ├── components/             # Dashboard widgets & charts
│   │   ├── content-calendar/       # Month & week calendar views
│   │   ├── content-library/        # Asset library & bulk upload table
│   │   ├── login/                  # Authentication & role selection portal
│   │   ├── post-creation-composer/ # LinkedIn composer with CTA & carousel selector
│   │   ├── post-templates/         # Post template library & editor
│   │   ├── settings/               # Workspace settings & scheduling rules
│   │   ├── layout.jsx              # Root application layout & font loader
│   │   ├── not-found.jsx           # 404 page
│   │   └── page.jsx                # Analytics dashboard home page
│   ├── components/         # Shared layouts and UI components
│   │   ├── AppLayout.jsx   # Shell with Sidebar and Topbar
│   │   ├── Sidebar.jsx     # Navigation sidebar with dynamic role badge
│   │   ├── Topbar.jsx      # Header with account switcher, role toggle & notifications
│   │   └── ui/             # Reusable UI primitives (ImageCarouselSelector, AppIcon, etc.)
│   ├── context/            # React Contexts (AuthContext for roles & active accounts)
│   └── styles/             # Global CSS and Tailwind directives
│       ├── index.css
│       └── tailwind.css
├── jsconfig.json           # Path alias configuration (@/* -> ./src/*)
├── next.config.mjs         # Next.js build configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration for Tailwind
└── tailwind.config.js      # Tailwind theme configuration
```

---

## 📦 Available Scripts

| Command            | Description                                                        |
| :----------------- | :----------------------------------------------------------------- |
| `npm run dev`      | Starts development server on port `4028` (`http://localhost:4028`) |
| `npm run build`    | Compiles and builds the production bundle                          |
| `npm run start`    | Alias for `next dev -p 4028`                                       |
| `npm run serve`    | Runs the compiled production build via `next start`                |
| `npm run lint`     | Runs ESLint to check for code quality and syntax issues            |
| `npm run lint:fix` | Runs ESLint and automatically fixes fixable problems               |
| `npm run format`   | Formats all JavaScript, JSX, CSS, and Markdown files with Prettier |

---

## 🎨 Styling

This project utilizes **Tailwind CSS** with:

- Custom theme design tokens (primary `#0A66C2`, accents, cards, status backgrounds)
- Reusable component classes (`.btn-primary`, `.status-published`, `.status-scheduled`, etc.)
- Responsive grid and flex layouts
- PostCSS & Autoprefixer integration

---

## 📱 Production Build

To create an optimized production build:

```bash
npm run build
```
