import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders, getStaffMembers } from '../services/adminService';
import { getAssignedOrders } from '../services/staffService';
import { AdminOrder, StaffMember } from '../types/order';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import OrderCard from '../components/features/orders/OrderCard';
import { formatDate, formatCurrency, formatStatus } from '../utils/formatters';

const OrderListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (user?.role === 'staff') {
        const params: any = {};
        const status = searchParams.get('status');
        if (status) params.status = status;

        const ordersData = await getAssignedOrders(params);
        setOrders(ordersData);
        setStaffMembers([]);
      } else {
        const params: any = {};
        const status = searchParams.get('status');
        const staff = searchParams.get('staff');
        const search = searchParams.get('search');

        if (status) params.status = status;
        if (staff) params.assigned_to = staff;
        if (search) params.search = search;

        const [ordersData, staffData] = await Promise.all([
          getOrders(params),
          getStaffMembers(),
        ]);

        setOrders(ordersData);
        setStaffMembers(staffData);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      showError(err.response?.data?.error?.message || 'Failed to load orders');
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
            <p className="mt-4 text-text-muted">Loading orders...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Orders' }]}>
      <PageHeader
        title={user?.role === 'staff' ? 'My Assigned Orders' : 'Orders'}
        subtitle={`${orders.length} total orders`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              leftIcon={
                viewMode === 'table' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                )
              }
            >
              {viewMode === 'table' ? 'Grid' : 'Table'}
            </Button>
            <Button variant="ghost" onClick={fetchData}>
              Refresh
            </Button>
          </div>
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          message="Orders will appear here once customers start placing them"
          actionLabel="Refresh"
          onAction={fetchData}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-dark-border hover:bg-dark-hover transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text">
                      {order.order_number}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-muted">
                      {order.user.name || order.user.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(order.status) as any}>
                        {formatStatus(order.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-muted">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-primary hover:text-primary-hover font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppLayout>
  );
};

export default OrderListPage;
