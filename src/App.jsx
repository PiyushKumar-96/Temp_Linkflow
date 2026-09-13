import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import NotFoundPage from './NotFoundPage';
import LoadingScreen from './LoadingScreen';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/query-client';

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

/**
 * Deferred loading screen:
 * Suppresses loading splash during normal, fast tab transitions (< 350ms).
 * Only mounts the full LoadingScreen when there is a genuine network/load delay (> 350ms).
 */
function DeferredRouteLoading({ delay = 350, label = 'Content Operations' }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return <LoadingScreen label={label} />;
}

function withBoundary(Component, label) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<DeferredRouteLoading delay={350} label={label} />}>
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
        <Route path="/login" element={withBoundary(LoginPage, 'Authentication')} />

        {/* Main App Screens wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={withBoundary(OperationsDashboardPage, 'Dashboard')} />
          <Route path="/dashboard" element={withBoundary(OperationsDashboardPage, 'Dashboard')} />
          <Route path="/analytics" element={withBoundary(AnalyticsPage, 'Analytics')} />
          <Route
            path="/approval-workflow"
            element={withBoundary(ApprovalWorkflowPage, 'Approval Workflow')}
          />
          <Route
            path="/post-creation-composer"
            element={withBoundary(ComposerPage, 'Post Composer')}
          />
          <Route path="/composer" element={<Navigate to="/post-creation-composer" replace />} />
          <Route path="/settings" element={withBoundary(SettingsPage, 'Settings')} />
          <Route path="/ai-generator" element={withBoundary(AIGeneratorPage, 'AI Generator')} />
          <Route
            path="/content-calendar"
            element={withBoundary(ContentCalendarPage, 'Content Calendar')}
          />
          <Route
            path="/content-library"
            element={withBoundary(ContentLibraryPage, 'Content Library')}
          />
          <Route
            path="/post-templates"
            element={withBoundary(PostTemplatesPage, 'Post Templates')}
          />
          <Route path="/team" element={withBoundary(TeamPage, 'Team')} />
          <Route path="/topics" element={withBoundary(TopicsPage, 'Topics')} />
        </Route>

        {/* 404 & Unreachable Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
