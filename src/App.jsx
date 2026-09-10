import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import RouteErrorBoundary from './components/RouteErrorBoundary';

// Lazy-loaded page routes for code splitting
const LoginPage = lazy(() => import('./app/login/page'));
const AnalyticsPage = lazy(() => import('./app/page'));
const OperationsDashboardPage = lazy(() => import('./app/dashboard/page'));
const ApprovalWorkflowPage = lazy(() => import('./app/approval-workflow/page'));
const ComposerPage = lazy(() => import('./app/post-creation-composer/page'));
const SettingsPage = lazy(() => import('./app/settings/page'));
const AIGeneratorPage = lazy(() => import('./app/ai-generator/page'));
const ContentCalendarPage = lazy(() => import('./app/content-calendar/page'));
const ContentLibraryPage = lazy(() => import('./app/content-library/page'));
const PostTemplatesPage = lazy(() => import('./app/post-templates/page'));
const TeamPage = lazy(() => import('./app/team/page'));
const TopicsPage = lazy(() => import('./app/topics/page'));
const NotFoundPage = lazy(() => import('./app/not-found'));

import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/query-client';

function RouteLoading() {
  return (
    <div className="flex items-center justify-center p-12 min-h-[40vh]">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function withBoundary(Component) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteLoading />}>
        <Component />
      </Suspense>
    </RouteErrorBoundary>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
      {/* Login Screen (outside AppLayout) */}
      <Route path="/login" element={withBoundary(LoginPage)} />

      {/* Main App Screens wrapped in AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={withBoundary(OperationsDashboardPage)} />
        <Route path="/dashboard" element={withBoundary(OperationsDashboardPage)} />
        <Route path="/analytics" element={withBoundary(AnalyticsPage)} />
        <Route path="/approval-workflow" element={withBoundary(ApprovalWorkflowPage)} />
        <Route path="/post-creation-composer" element={withBoundary(ComposerPage)} />
        <Route path="/settings" element={withBoundary(SettingsPage)} />
        <Route path="/ai-generator" element={withBoundary(AIGeneratorPage)} />
        <Route path="/content-calendar" element={withBoundary(ContentCalendarPage)} />
        <Route path="/content-library" element={withBoundary(ContentLibraryPage)} />
        <Route path="/post-templates" element={withBoundary(PostTemplatesPage)} />
        <Route path="/team" element={withBoundary(TeamPage)} />
        <Route path="/topics" element={withBoundary(TopicsPage)} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={withBoundary(NotFoundPage)} />
    </Routes>
  </QueryClientProvider>
  );
}
