import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderDetail } from '../services/adminService';
import { getAssignedOrderDetail } from '../services/staffService';
import { OrderDetail as OrderDetailType } from '../types/order';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { formatDate, formatCurrency, formatStatus } from '../utils/formatters';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderDetail(parseInt(id));
    }
  }, [id]);

  const fetchOrderDetail = async (orderId: number) => {
    try {
      setLoading(true);
      const orderData = user?.role === 'staff' 
        ? await getAssignedOrderDetail(orderId)
        : await getOrderDetail(orderId);
      setOrder(orderData);
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      showError(err.response?.data?.error?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-text-muted">Loading order details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <Card>
          <p className="text-center text-text-muted">Order not found</p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Orders', path: '/orders' }, { label: order.order_number }]}>
      <PageHeader
        title={`Order ${order.order_number}`}
        subtitle={`Placed on ${formatDate(order.created_at)}`}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
            {user?.role === 'admin' && !order.assigned_to && (
              <Button variant="primary" onClick={() => navigate(`/orders/${order.id}/assign`)}>
                Assign Staff
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Name:</span>
                <span className="text-text font-medium">{order.user.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Phone:</span>
                <span className="text-text font-medium">{order.user.phone}</span>
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b border-dark-border last:border-0">
                  <div>
                    <p className="text-text font-medium">{item.product_name || item.name}</p>
                    <p className="text-sm text-text-muted">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-text font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted">Status:</span>
                <Badge variant={getStatusVariant(order.status) as any}>
                  {formatStatus(order.status)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Amount:</span>
                <span className="text-text font-bold text-xl">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payment Status:</span>
                <Badge variant={(order as any).payment_status === 'paid' ? 'success' : 'warning'}>
                  {(order as any).payment_status || 'pending'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Assigned Staff */}
          {order.assigned_to && (
            <Card>
              <h3 className="text-lg font-semibold text-text mb-4">Assigned To</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white text-lg font-bold">
                  {order.assigned_to.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <p className="text-text font-medium">{order.assigned_to.name || order.assigned_to.phone}</p>
                  <p className="text-sm text-text-muted">Staff Member</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderDetailPage;
