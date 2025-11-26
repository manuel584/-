import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, AlertTriangle, FileText, Clock } from 'lucide-react';
import { GlassCard, Button } from '../components/UI';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    title: 'GOSI Payment Overdue',
    description: 'Payment for Main Restaurant LLC is 5 days overdue.',
    time: '2 hours ago',
    read: false,
    entity: 'Main Restaurant LLC'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Insurance Expiring Soon',
    description: 'Medical insurance policy for Property Holdings expires in 30 days.',
    time: '1 day ago',
    read: false,
    entity: 'Property Holdings Ltd'
  },
  {
    id: 3,
    type: 'success',
    title: 'Document Uploaded',
    description: 'Trade License renewal was successfully uploaded.',
    time: '2 days ago',
    read: true,
    entity: 'Main Restaurant LLC'
  }
];

export const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f4ff] pb-24">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/50 px-4 py-4 safe-top flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
          Mark all as read
        </button>
      </header>

      <div className="p-4 space-y-6">
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Today</h3>
          <div className="space-y-3">
            {NOTIFICATIONS.filter(n => n.time.includes('hour')).map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Earlier</h3>
          <div className="space-y-3">
            {NOTIFICATIONS.filter(n => !n.time.includes('hour')).map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </section>

        <div className="text-center py-8">
           <p className="text-gray-400 text-sm">That's all caught up!</p>
           <div className="mt-4 inline-flex p-3 rounded-full bg-gray-100 text-gray-400">
             <CheckCircle2 size={24} />
           </div>
        </div>
      </div>
    </div>
  );
};

const NotificationCard: React.FC<{ notification: typeof NOTIFICATIONS[0] }> = ({ notification }) => {
  const icons: Record<string, React.ReactNode> = {
    alert: <AlertTriangle className="text-red-500" size={20} />,
    warning: <Clock className="text-orange-500" size={20} />,
    success: <FileText className="text-green-500" size={20} />
  };

  const bgColors: Record<string, string> = {
    alert: 'bg-red-50',
    warning: 'bg-orange-50',
    success: 'bg-green-50'
  };

  return (
    <GlassCard className={`relative overflow-hidden ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-full ${bgColors[notification.type] || 'bg-gray-50'} flex items-center justify-center shrink-0`}>
          {icons[notification.type] || <Bell size={20} className="text-gray-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className={`text-sm font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notification.time}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.description}</p>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">{notification.entity}</p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
        )}
      </div>
    </GlassCard>
  );
};