import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { NewsPage } from './pages/public/NewsPage';
import { NewsDetailPage } from './pages/public/NewsDetailPage';
import { EventsPage } from './pages/public/EventsPage';
import { EventDetailPage } from './pages/public/EventDetailPage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { OpportunitiesPage } from './pages/public/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/public/OpportunityDetailPage';
import { DocumentsPage } from './pages/public/DocumentsPage';
import { ContactPage } from './pages/public/ContactPage';
import { DynamicSectionPage } from './pages/public/DynamicSectionPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPostsPage } from './pages/admin/AdminPostsPage';
import { AdminPostEditorPage } from './pages/admin/AdminPostEditorPage';
import { AdminDocumentsPage } from './pages/admin/AdminDocumentsPage';
import { AdminSectionsPage } from './pages/admin/AdminSectionsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminNavigationPage } from './pages/admin/AdminNavigationPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/opportunities/:slug" element={<OpportunityDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/membership" element={<Navigate to="/documents" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/section/:slug" element={<DynamicSectionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="posts/new" element={<AdminPostEditorPage />} />
            <Route path="posts/edit/:id" element={<AdminPostEditorPage />} />
            <Route path="documents" element={<AdminDocumentsPage />} />
            <Route path="sections" element={<AdminSectionsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="media" element={<AdminMediaPage />} />
            <Route path="navigation" element={<AdminNavigationPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
