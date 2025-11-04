import { OrderStatusHistory as StatusHistoryType } from '../types/manualOrder';
import { formatDate } from '../utils/formatters';

interface OrderStatusHistoryProps {
  history: StatusHistoryType[];
}

const OrderStatusHistory = ({ history }: OrderStatusHistoryProps) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_payment: 'text-yellow-600',
      pending_resources: 'text-orange-600',
      ready_for_processing: 'text-blue-600',
      assigned: 'text-purple-600',
      in_progress: 'text-indigo-600',
      completed: 'text-green-600',
      cancelled: 'text-red-600',
      on_hold: 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
        <h3 className="text-lg font-semibold text-text mb-4">Status History</h3>
        <p className="text-text-muted text-sm">No status changes yet</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-text mb-6">Status History</h3>
      
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-gradient-primary' : 'bg-dark-border'
              }`} />
              {index < history.length - 1 && (
                <div className="w-0.5 h-full bg-dark-border mt-1" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold ${getStatusColor(item.new_status)}`}>
                  {item.new_status_display}
                </span>
                {item.is_manual_change && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Manual
                  </span>
                )}
              </div>
              
              <div className="text-sm text-text-muted mb-1">
                Changed by: <span className="font-medium text-text">{item.changed_by.name}</span>
              </div>
              
              <div className="text-xs text-text-muted flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(item.changed_at)}
              </div>
              
              {item.reason && (
                <div className="mt-2 text-sm text-text bg-dark-bg p-3 rounded-lg border border-dark-border">
                  {item.reason}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusHistory;
