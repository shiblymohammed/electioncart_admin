import { useNavigate } from 'react-router-dom';

interface Notification {
  id: number;
  type: 'order' | 'user' | 'system';
  message: string;
  is_read: boolean;
  created_at: string;
  related_url?: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  loading: boolean;
}

const NotificationDropdown = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  loading
}: NotificationDropdownProps) => {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.related_url) {
      navigate(notification.related_url);
      onClose();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'user':
        return (
          <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-dark-surface border border-dark-border rounded-xl shadow-2xl z-50 animate-fade-in-up">
        {/* Header */}
        <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
          <h3 className="font-semibold text-text">Notifications</h3>
          {notifications.some(n => !n.is_read) && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-text-muted">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-text-muted">No notifications</p>
              <p className="text-xs text-text-muted mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 border-b border-dark-border last:border-b-0 cursor-pointer transition-colors ${
                  notification.is_read 
                    ? 'hover:bg-dark-hover' 
                    : 'bg-primary/5 hover:bg-primary/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      notification.is_read ? 'text-text-muted' : 'text-text font-medium'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                  
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 10 && (
          <div className="px-4 py-3 border-t border-dark-border text-center">
            <button 
              onClick={() => {
                navigate('/notifications');
                onClose();
              }}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;
