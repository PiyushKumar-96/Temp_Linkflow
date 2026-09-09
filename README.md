# LinkedFlow — LinkedIn Management Frontend

A modern, high-performance Single Page Application (SPA) built with **Vite**, **React 19**, **React Router v7**, **JavaScript (JSX)**, and **Tailwind CSS** for creating, scheduling, approving, and tracking LinkedIn posts from a collaborative team workspace.

## 🚀 Features

- **Vite & React 19** - Lightning-fast Hot Module Replacement (HMR) and optimized rollup bundling
- **React Router** - Fast client-side routing with clean nested layout architecture
- **JavaScript & JSX** - Standard JSX components with `@/*` path alias resolution
- **Tailwind CSS & Autoprefixer** - Utility-first styling with tailored tokens and component layers
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

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📁 Project Structure

```text
linkedflow/
├── public/                 # Static assets (images, logos, icons, favicon)
├── src/
│   ├── app/                # Feature screens & pages
│   │   ├── ai-generator/           # AI Post generation module
│   │   ├── approval-workflow/      # Post approval queue & review workspace
│   │   ├── components/             # Dashboard widgets & charts
│   │   ├── content-calendar/       # Month & week calendar views
│   │   ├── content-library/        # Asset library & bulk upload table
│   │   ├── login/                  # Authentication & role selection portal
│   │   ├── post-creation-composer/ # LinkedIn composer with CTA & carousel selector
│   │   ├── post-templates/         # Post template library & editor
│   │   ├── settings/               # Workspace settings & scheduling rules
│   │   ├── not-found.jsx           # 404 page
│   │   └── page.jsx                # Analytics dashboard home page
│   ├── components/         # Shared layouts and UI components
│   │   ├── AppLayout.jsx   # Shell with Sidebar, Topbar, and React Router Outlet
│   │   ├── Sidebar.jsx     # Navigation sidebar with dynamic role badge
│   │   ├── Topbar.jsx      # Header with account switcher, role toggle & notifications
│   │   └── ui/             # Reusable UI primitives (ImageCarouselSelector, AppIcon, etc.)
│   ├── context/            # React Contexts (AuthContext for roles & active accounts)
│   ├── styles/             # Global CSS and Tailwind directives
│   │   ├── index.css
│   │   └── tailwind.css
│   ├── App.jsx             # React Router client routes configuration
│   └── main.jsx            # React root application entry point
├── index.html              # Vite SPA entry HTML document
├── jsconfig.json           # Path alias configuration (@/* -> ./src/*)
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration for Tailwind
├── tailwind.config.js      # Tailwind theme configuration
└── vite.config.mjs         # Vite configuration with React plugin and alias
```

---

## 📦 Available Scripts

| Command            | Description                                                        |
| :----------------- | :----------------------------------------------------------------- |
| `npm run dev`      | Starts Vite dev server on port `3000` (`http://localhost:3000`)    |
| `npm run build`    | Compiles and builds the production bundle in `dist/`               |
| `npm run preview`  | Locally previews the production build on port `3000`               |
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

The compiled output will be generated inside the `dist/` directory.
