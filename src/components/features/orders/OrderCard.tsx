import { Link } from 'react-router-dom';
import { AdminOrder } from '../../../types/order';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import { formatDate, formatCurrency, formatStatus } from '../../../utils/formatters';

interface OrderCardProps {
  order: AdminOrder;
  onViewDetails?: (id: number) => void;
  onAssign?: (id: number) => void;
  showActions?: boolean;
}

const OrderCard = ({ order, onViewDetails, onAssign, showActions = true }: OrderCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending_payment':
      case 'pending_resources':
        return 'warning';
      case 'ready_for_processing':
      case 'assigned':
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card hoverable className="animate-fade-in-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-text">{order.order_number}</h3>
            <Badge variant={getStatusVariant(order.status) as any}>
              {formatStatus(order.status)}
            </Badge>
          </div>
          <p className="text-sm text-text-muted">
            {order.user.name || order.user.phone}
          </p>
        </div>
        
        {order.assigned_to && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
              {order.assigned_to.username?.charAt(0).toUpperCase() || 'S'}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-text-muted mb-1">Amount</p>
          <p className="text-lg font-semibold text-text">{formatCurrency(order.total_amount)}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-1">Date</p>
          <p className="text-sm text-text">{formatDate(order.created_at)}</p>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-dark-border">
          <Link
            to={`/orders/${order.id}`}
            className="flex-1 px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary-hover transition-colors text-center text-sm font-medium"
          >
            View Details
          </Link>
          {onAssign && !order.assigned_to && (
            <button
              onClick={() => onAssign(order.id)}
              className="px-4 py-2 bg-secondary text-secondary-content rounded-lg hover:bg-secondary-hover transition-colors text-sm font-medium"
            >
              Assign
            </button>
          )}
        </div>
      )}
    </Card>
  );
};

export default OrderCard;
