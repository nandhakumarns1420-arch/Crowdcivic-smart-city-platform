import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, LogOut, Menu, Bell, User, ShieldAlert, MapPin, Activity, X, Globe
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/NotificationDropdown';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { complaints } = usePlatform();
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/portal');
  };

  const citizenLinks = [
    { name: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { name: t('liveMap'), icon: MapPin, path: '/dashboard/map' },
    { name: t('myReports'), icon: FileText, path: '/dashboard/reports' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: t('settings'), icon: Settings, path: '/dashboard/settings' },
  ];

  const adminLinks = [
    { name: t('controlCenter'), icon: LayoutDashboard, path: '/admin' },
    { name: t('allComplaints'), icon: FileText, path: '/admin/complaints' },
    { name: t('liveMap'), icon: MapPin, path: '/admin/map' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: t('activityLogs'), icon: Activity, path: '/admin/logs' },
    { name: t('settings'), icon: Settings, path: '/admin/settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : citizenLinks;

  const pendingCount = Array.isArray(complaints) ? complaints.filter(c => c.status === 'Pending').length : 0;

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#050D1A] text-slate-200">
      {/* Background gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Sidebar - Desktop */}
      <aside className={`glass border-r border-white/5 z-40 hidden md:flex flex-col relative transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 shadow-2xl`}>
        <div className="h-20 flex items-center px-6 border-b border-white/5 overflow-hidden">
          <Link to="/" className="flex items-center gap-3 group min-w-[200px]">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500/20 transition-all">
              <ShieldAlert className="w-6 h-6 text-blue-400" />
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-bold text-white tracking-wide">CrowdCivic</div>
                <div className="text-xs text-cyan-400 font-medium tracking-widest uppercase">{t('dindigul')}</div>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== '/dashboard' && link.path !== '/admin' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group"
                style={{
                  color: isActive ? '#fff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(90deg, rgba(37,99,235,0.15) 0%, transparent 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent'
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'group-hover:text-white transition-colors'}`} />
                  {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">{link.name}</span>}
                </div>
                {sidebarOpen && link.path.includes('complaints') && pendingCount > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium text-sm">{t('Login')} (Logout)</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-[#050D1A]/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 bottom-0 w-64 glass border-r border-white/10 flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-blue-500" />
                <span className="font-bold text-white">CrowdCivic</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/20 text-white border-l-2 border-blue-500' : 'text-slate-400'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-auto border-t border-white/5 pt-6">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('Login')} (Logout)</span>
            </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Header */}
        <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-6 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 hidden md:block transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 md:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:block">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                {user?.role === 'admin' ? t('controlCenter') : t('citizenPortal')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dashboard Language Switcher */}
            <button onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 text-cyan-400"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className={language === 'en' ? 'text-white' : 'text-slate-500'}>EN</span>
              <div className="w-px h-3 bg-white/20" />
              <span className={language === 'ta' ? 'text-white' : 'text-slate-500'}>தமிழ்</span>
            </button>

            <NotificationDropdown />

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-cyan-400">
                  {user?.role === 'admin' ? `${t('dindigul')} Municipality` : `${user?.area || t('name')}`}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
