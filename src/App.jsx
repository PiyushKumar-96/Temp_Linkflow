import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

// Page Imports
import LoginPage from './app/login/page';
import DashboardPage from './app/page';
import ApprovalWorkflowPage from './app/approval-workflow/page';
import ComposerPage from './app/post-creation-composer/page';
import SettingsPage from './app/settings/page';
import AIGeneratorPage from './app/ai-generator/page';
import ContentCalendarPage from './app/content-calendar/page';
import ContentLibraryPage from './app/content-library/page';
import PostTemplatesPage from './app/post-templates/page';
import NotFoundPage from './app/not-found';

export default function App() {
  return (
    <Routes>
      {/* Login Screen (outside AppLayout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Main App Screens wrapped in AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/approval-workflow" element={<ApprovalWorkflowPage />} />
        <Route path="/post-creation-composer" element={<ComposerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/ai-generator" element={<AIGeneratorPage />} />
        <Route path="/content-calendar" element={<ContentCalendarPage />} />
        <Route path="/content-library" element={<ContentLibraryPage />} />
        <Route path="/post-templates" element={<PostTemplatesPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
