import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import UserList from './pages/admin/UserList';
import UserForm from './pages/admin/UserForm';
import NewsList from './pages/news/NewsList';
import NewsDetail from './pages/news/NewsDetail';
import NewsForm from './pages/admin/NewsForm';
import EventList from './pages/events/EventList';
import EventDetail from './pages/events/EventDetail';
import EventForm from './pages/admin/EventForm';
import AnnouncementList from './pages/announcements/AnnouncementList';
import AnnouncementForm from './pages/admin/AnnouncementForm';
import LinkList from './pages/links/LinkList';
import LinkForm from './pages/admin/LinkForm';
import CalendarForm from './pages/admin/CalendarForm';
import AdminLogs from './pages/admin/AdminLogs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/announcements" element={<AnnouncementList />} />
            <Route path="/admin/users" element={<UserList />} />
                <Route path="/users/new" element={<UserForm />} />
                <Route path="/users/edit/:id" element={<UserForm />} />
                <Route path="/news/new" element={<NewsForm />} />
                <Route path="/news/edit/:id" element={<NewsForm />} />
                <Route path="/events/new" element={<EventForm />} />
                <Route path="/events/edit/:id" element={<EventForm />} />
                <Route path="/announcements/new" element={<AnnouncementForm />} />
                <Route path="/announcements/edit/:id" element={<AnnouncementForm />} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
            
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;