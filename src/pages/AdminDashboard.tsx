import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderStatistics, getOrders } from '../services/adminService';
import { OrderStatistics, AdminOrder } from '../types/order';
import { useToast } from '../hooks/useToast';
import { useCachedData } from '../hooks/useCachedData';
import { CACHE_KEYS, CACHE_DURATION } from '../utils/cacheManager';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import StaleDataIndicator from '../components/ui/StaleDataIndicator';
import { formatDate, formatCurrency, formatStatus } from '../utils/formatters';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();

  // Use cached data for statistics
  const {
    data: statistics,
    loading: statsLoading,
    error: statsError,
    cacheStatus: statsCacheStatus,
    refresh: refreshStats,
  } = useCachedData<OrderStatistics>(
    CACHE_KEYS.DASHBOARD_STATS,
    getOrderStatistics,
    CACHE_DURATION.DASHBOARD
  );

  // Use cached data for orders
  const {
    data: allOrders,
    loading: ordersLoading,
    error: ordersError,
    cacheStatus: ordersCacheStatus,
    refresh: refreshOrders,
  } = useCachedData<AdminOrder[]>(
    CACHE_KEYS.ORDERS,
    getOrders,
    CACHE_DURATION.ORDERS
  );

  const loading = statsLoading || ordersLoading;
  const recentOrders = allOrders?.slice(0, 5) || [];

  // Show errors if any
  useEffect(() => {
    if (statsError) {
      showError(statsError);
    }
    if (ordersError) {
      showError(ordersError);
    }
  }, [statsError, ordersError, showError]);

  const fetchDashboardData = async () => {
    await Promise.all([refreshStats(), refreshOrders()]);
  };

  const getStatusBadgeVariant = (status: string) => {
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
        title="Dashboard"
        subtitle={`Welcome back, ${user?.username || 'Admin'}`}
        actions={
          <div className="flex items-center gap-3">
            {(statsCacheStatus || ordersCacheStatus) && (
              <StaleDataIndicator cacheStatus={statsCacheStatus || ordersCacheStatus} />
            )}
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
          </div>
        }
      />

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            label="Total Orders"
            value={statistics.total}
            color="primary"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            onClick={() => navigate('/orders')}
          />

          <StatCard
            label="Pending"
            value={statistics.pending}
            color="warning"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onClick={() => navigate('/orders?status=pending')}
          />

          <StatCard
            label="Assigned"
            value={statistics.assigned}
            color="info"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            onClick={() => navigate('/orders?status=assigned')}
          />

          <StatCard
            label="In Progress"
            value={statistics.in_progress}
            color="info"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            onClick={() => navigate('/orders?status=in_progress')}
          />

          <StatCard
            label="Completed"
            value={statistics.completed}
            color="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onClick={() => navigate('/orders?status=completed')}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card hoverable glowOnHover onClick={() => navigate('/orders')}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Manage Orders</h3>
              <p className="text-sm text-text-muted">View and manage all orders</p>
            </div>
          </div>
        </Card>

        {user?.role === 'admin' && (
          <>
            <Card hoverable glowOnHover onClick={() => navigate('/analytics')}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10 text-success">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Analytics</h3>
                  <p className="text-sm text-text-muted">View metrics and insights</p>
                </div>
              </div>
            </Card>

            <Card hoverable glowOnHover onClick={() => navigate('/staff')}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Manage Staff</h3>
                  <p className="text-sm text-text-muted">View and manage staff</p>
                </div>
              </div>
            </Card>

            <Card hoverable glowOnHover onClick={() => navigate('/users')}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-info/10 text-info">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Manage Users</h3>
                  <p className="text-sm text-text-muted">View and manage users</p>
                </div>
              </div>
            </Card>

            <Card hoverable glowOnHover onClick={() => navigate('/products')}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10 text-warning">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Manage Products</h3>
                  <p className="text-sm text-text-muted">Packages and campaigns</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Recent Orders */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text">Recent Orders</h2>
          <Link to="/orders" className="text-primary hover:text-primary-hover text-sm font-medium transition-colors">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            message="Orders will appear here once customers start placing them"
            actionLabel="Refresh"
            onAction={fetchDashboardData}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
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
                      <Badge variant={getStatusBadgeVariant(order.status) as any}>
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
        )}
      </Card>
    </AppLayout>
  );
};

export default AdminDashboard;
