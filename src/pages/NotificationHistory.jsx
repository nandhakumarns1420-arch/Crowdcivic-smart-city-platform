import { motion } from 'framer-motion';
import { Bell, Clock, CheckCircle, AlertTriangle, Info, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const NotificationHistory = () => {
  const { notifications, markAsRead, markAllRead, loading } = useNotifications();
  const { t } = useLanguage();

  const getIcon = (type) => {
    switch (type) {
      case 'Complaint Update': return <CheckCircle className="w-6 h-6 text-blue-400" />;
      case 'System Alert': return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      default: return <Info className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Notification History</h1>
          <p className="text-slate-400 text-sm tracking-wide uppercase">Track all updates and alerts</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all font-bold text-sm"
          >
            <Check className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        {loading && notifications.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
            <p className="text-slate-500">Loading your history...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-white/5">
            {notifications.map((n, i) => (
              <motion.div 
                key={n._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-8 hover:bg-white/[0.02] transition-colors relative ${!n.isRead ? 'bg-blue-500/5' : ''}`}
              >
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                )}
                <div className="flex gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${!n.isRead ? 'bg-blue-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-white/5 border-white/10'}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-lg font-bold ${n.isRead ? 'text-slate-300' : 'text-white'}`}>{n.title}</h3>
                      <p className="text-xs text-slate-600 font-mono flex items-center gap-1.5 whitespace-nowrap ml-4">
                        <Clock className="w-3.5 h-3.5" /> {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-slate-500 leading-relaxed max-w-2xl">{n.message}</p>
                    
                    {!n.isRead && (
                      <button 
                        onClick={() => markAsRead(n._id)}
                        className="mt-6 flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest bg-blue-400/5 px-3 py-1.5 rounded-lg border border-blue-400/10"
                      >
                        <Check className="w-3 h-3" /> Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
              <Bell className="w-10 h-10 text-slate-800" />
            </div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">Silence is golden</h3>
            <p className="text-slate-600 max-w-[280px] mx-auto">You have no notifications yet. We'll alert you here when your complaints move through the grid.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationHistory;
