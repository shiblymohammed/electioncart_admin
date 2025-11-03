import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, DragEndEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminOrder } from '../../../types/order';
import Badge from '../../ui/Badge';
import { formatDate, formatCurrency, formatStatus } from '../../../utils/formatters';
import { useToast } from '../../../hooks/useToast';

interface OrderKanbanProps {
  orders: AdminOrder[];
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>;
}

const statusColumns = [
  { id: 'pending_payment', label: 'Pending Payment', color: 'warning' },
  { id: 'pending_resources', label: 'Pending Resources', color: 'warning' },
  { id: 'ready_for_processing', label: 'Ready', color: 'info' },
  { id: 'assigned', label: 'Assigned', color: 'info' },
  { id: 'in_progress', label: 'In Progress', color: 'info' },
  { id: 'completed', label: 'Completed', color: 'success' },
];

interface SortableOrderCardProps {
  order: AdminOrder;
}

function SortableOrderCard({ order }: SortableOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-dark-surface border border-dark-border rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <Link
            to={`/orders/${order.id}`}
            className="font-medium text-text hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {order.order_number}
          </Link>
          <p className="text-sm text-text-muted mt-1">
            {order.user.name || order.user.phone}
          </p>
        </div>
        <Badge variant={getStatusVariant(order.status) as any} size="sm">
          {formatStatus(order.status)}
        </Badge>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">Amount:</span>
          <span className="text-text font-medium">{formatCurrency(order.total_amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Date:</span>
          <span className="text-text-muted">{formatDate(order.created_at)}</span>
        </div>
        {order.assigned_to && (
          <div className="flex justify-between">
            <span className="text-text-muted">Staff:</span>
            <span className="text-text">{order.assigned_to.name || 'Staff'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const OrderKanban = ({ orders, onStatusChange }: OrderKanbanProps) => {
  const { showSuccess, showError } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (!over) return;

    const orderId = parseInt(active.id.toString());
    const newStatus = over.id.toString();

    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === newStatus) return;

    try {
      await onStatusChange(orderId, newStatus);
      showSuccess(`Order ${order.order_number} moved to ${formatStatus(newStatus)}`);
    } catch (err: any) {
      showError(err.message || 'Failed to update order status');
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statusColumns.map(column => {
          const columnOrders = getOrdersByStatus(column.id);
          
          return (
            <SortableContext
              key={column.id}
              id={column.id}
              items={columnOrders.map(o => o.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div
                className={`bg-dark-hover rounded-xl p-4 min-h-[500px] ${
                  isDragging ? 'ring-2 ring-primary/30' : ''
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-border">
                  <h3 className="font-semibold text-text">{column.label}</h3>
                  <span className="px-2 py-1 bg-dark-surface rounded-full text-xs text-text-muted">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Column Content */}
                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                  {columnOrders.length === 0 ? (
                    <div className="text-center py-8 text-text-muted text-sm">
                      No orders
                    </div>
                  ) : (
                    columnOrders.map(order => (
                      <SortableOrderCard key={order.id} order={order} />
                    ))
                  )}
                </div>
              </div>
            </SortableContext>
          );
        })}
      </div>
    </DndContext>
  );
};

export default OrderKanban;
