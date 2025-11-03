import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import NotificationDropdown from './NotificationDropdown';
import api from '../../services/api';

interface Notification {
  id: number;
  type: 'order' | 'user' | 'system';
  message: string;
  is_read: boolean;
  created_at: string;
  related_url?: string;
}

const NotificationBell = () => {
  const { showError } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/notifications/');
      const notifs = response.data.results || response.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: Notification) => !n.is_read).length);
    } catch (err: any) {
      // Silently fail for notifications - not critical
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await api.patch(`/admin/notifications/${notificationId}/mark-read/`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      showError('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/admin/notifications/mark-all-read/');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err: any) {
      showError('Failed to mark all notifications as read');
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-muted hover:text-text transition-colors rounded-lg hover:bg-dark-hover"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-glow-danger animate-pulse-status">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          loading={loading}
        />
      )}
    </div>
  );
};

export default NotificationBell;
