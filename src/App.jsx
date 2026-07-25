import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { PlatformProvider } from './context/PlatformContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CitizenDashboard from './pages/CitizenDashboard';
import MyComplaints from './pages/MyComplaints';
import CitizenComplaintDetails from './pages/CitizenComplaintDetails';
import AdminControlCenter from './pages/AdminControlCenter';
import AdminComplaints from './pages/AdminComplaints';
import AdminComplaintDetails from './pages/AdminComplaintDetails';
import AdminLogs from './pages/AdminLogs';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PortalSelection from './pages/PortalSelection';
import NotificationHistory from './pages/NotificationHistory';
import MapUI from './components/MapUI';

import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PlatformProvider>
          <LanguageProvider>
            <Router>
            <ToastContainer />
            <Routes>
              {/* Public Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Portal Selection */}
              <Route path="/portal" element={<PortalSelection />} />

              {/* Notification History Route (Common) */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/notifications" element={<NotificationHistory />} />
              </Route>

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/login/:role" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Citizen Dashboard Routes */}
              <Route element={<ProtectedRoute role="citizen"><DashboardLayout role="citizen" /></ProtectedRoute>}>
                <Route path="/dashboard" element={<CitizenDashboard />} />
                <Route path="/dashboard/map" element={<MapUI />} />
                <Route path="/dashboard/reports" element={<MyComplaints />} />
                <Route path="/dashboard/reports/:id" element={<CitizenComplaintDetails />} />
                <Route path="/dashboard/settings" element={<AboutPage />} />
              </Route>

              {/* Admin Dashboard Routes */}
              <Route element={<ProtectedRoute role="admin"><DashboardLayout role="admin" /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminControlCenter />} />
                <Route path="/admin/complaints" element={<AdminComplaints />} />
                <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} />
                <Route path="/admin/map" element={<MapUI />} />
                <Route path="/admin/logs" element={<AdminLogs />} />
                <Route path="/admin/settings" element={<AboutPage />} />
              </Route>

              {/* Catch-all Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </PlatformProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
