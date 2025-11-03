import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAssignedOrders } from '../services/staffService';
import { AdminOrder } from '../types/order';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { formatDate, formatCurrency, formatStatus } from '../utils/formatters';

interface OrderStatusBreakdown {
  assigned: number;
  in_progress: number;
  completed: number;
  total: number;
}

const StaffDashboard = () => {
  const { user } = useAuth();
  const { showError } = useToast();
  const [statusBreakdown, setStatusBreakdown] = useState<OrderStatusBreakdown>({
    assigned: 0,
    in_progress: 0,
    completed: 0,
    total: 0,
  });
  const [ordersRequiringAttention, setOrdersRequiringAttention] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all assigned orders
      const assignedOrders = await getAssignedOrders();

      // Calculate status breakdown
      const breakdown = assignedOrders.reduce(
        (acc, order) => {
          acc.total++;
          if (order.status === 'assigned') {
            acc.assigned++;
          } else if (order.status === 'in_progress') {
            acc.in_progress++;
          } else if (order.status === 'completed') {
            acc.completed++;
          }
          return acc;
        },
        { assigned: 0, in_progress: 0, completed: 0, total: 0 }
      );
      setStatusBreakdown(breakdown);

      // Filter orders requiring attention (assigned or in_progress, sorted by date)
      const attentionOrders = assignedOrders
        .filter((order) => order.status === 'assigned' || order.status === 'in_progress')
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .slice(0, 5);
      setOrdersRequiringAttention(attentionOrders);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      showError(err.response?.data?.error?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'warning' as const;
      case 'in_progress':
        return 'info' as const;
      case 'completed':
        return 'success' as const;
      default:
        return 'default' as const;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-text-muted">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      {/* Page Header */}
      <PageHeader
        title="Staff Dashboard"
        subtitle={`Welcome back, ${user?.name || user?.username}`}
        actions={
          <Button
            variant="ghost"
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
            onClick={fetchDashboardData}
          >
            Refresh
          </Button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Assigned"
          value={statusBreakdown.total}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="primary"
        />

        <StatCard
          label="Assigned"
          value={statusBreakdown.assigned}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="warning"
        />

        <StatCard
          label="In Progress"
          value={statusBreakdown.in_progress}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          color="info"
        />

        <StatCard
          label="Completed"
          value={statusBreakdown.completed}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/orders">
          <Card hoverable className="h-full">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text">View All Orders</h3>
                <p className="text-sm text-text-muted">See all your assigned orders</p>
              </div>
            </div>
          </Card>
        </Link>

        <Card hoverable className="h-full cursor-pointer" onClick={fetchDashboardData}>
          <div className="flex items-center">
            <div className="bg-success/10 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Refresh Data</h3>
              <p className="text-sm text-text-muted">Update dashboard statistics</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders Requiring Attention */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text">Orders Requiring Attention</h2>
            <p className="text-sm text-text-muted mt-1">Orders that need your immediate action</p>
          </div>
          <Link to="/orders">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        {ordersRequiringAttention.length === 0 ? (
          <EmptyState
            title="All caught up!"
            message="No orders requiring immediate attention"
            illustration={
              <svg className="mx-auto h-12 w-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ordersRequiringAttention.map((order) => (
                  <tr key={order.id} className="hover:bg-dark-hover transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      {order.user.name || order.user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text font-medium">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {formatStatus(order.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppLayout>
  );
};

export default StaffDashboard;
