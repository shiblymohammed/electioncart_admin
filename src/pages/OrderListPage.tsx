import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders, getStaffMembers } from '../services/adminService';
import { getAssignedOrders } from '../services/staffService';
import { AdminOrder, StaffMember } from '../types/order';
import { useToast } from '../hooks/useToast';
import { useCachedData } from '../hooks/useCachedData';
import { CACHE_KEYS, CACHE_DURATION } from '../utils/cacheManager';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import StaleDataIndicator from '../components/ui/StaleDataIndicator';
import OrderCard from '../components/features/orders/OrderCard';
import OrderFilters, { FilterValues } from '../components/features/orders/OrderFilters';
import BulkActionBar from '../components/features/orders/BulkActionBar';
import OrderKanban from '../components/features/orders/OrderKanban';
import OrderListActions from '../components/features/orders/OrderListActions';
import PaymentStatusDropdown from '../components/PaymentStatusDropdown';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import { PaymentStatus } from '../types/manualOrder';
import { formatDate, formatCurrency, formatStatus } from '../utils/formatters';

const OrderListPage = () => {
  const { user } = useAuth();
  const { showError } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'kanban'>('table');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<number>>(new Set());
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    statuses: [],
    dateFrom: '',
    dateTo: '',
    assignedTo: '',
    minAmount: 0,
    maxAmount: 0,
  });

  // Determine cache key based on user role
  const ordersCacheKey = user?.role === 'staff' ? CACHE_KEYS.ASSIGNED_ORDERS : CACHE_KEYS.ORDERS;

  // Memoize the fetch function to prevent infinite loops
  const fetchOrders = useCallback(async () => {
    if (user?.role === 'staff') {
      const params: any = {};
      const status = searchParams.get('status');
      if (status) params.status = status;
      return await getAssignedOrders(params);
    } else {
      const params: any = {};
      const status = searchParams.get('status');
      const staff = searchParams.get('staff');
      const search = searchParams.get('search');
      if (status) params.status = status;
      if (staff) params.assigned_to = staff;
      if (search) params.search = search;
      return await getOrders(params);
    }
  }, [user?.role, searchParams]);

  // Use cached data for orders
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    cacheStatus: ordersCacheStatus,
    refresh: refreshOrders,
  } = useCachedData<AdminOrder[]>(
    ordersCacheKey,
    fetchOrders,
    CACHE_DURATION.ORDERS
  );

  // Use cached data for staff (admin only)
  const {
    data: staffMembers,
    loading: staffLoading,
  } = useCachedData<StaffMember[]>(
    CACHE_KEYS.STAFF_LIST,
    getStaffMembers,
    CACHE_DURATION.STAFF
  );

  const loading = ordersLoading || (user?.role !== 'staff' && staffLoading);

  // Update filtered orders when orders change
  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  // Show errors if any
  useEffect(() => {
    if (ordersError) {
      showError(ordersError);
    }
  }, [ordersError, showError]);

  const fetchData = async () => {
    await refreshOrders();
  };

  const applyFilters = (filters: FilterValues) => {
    if (!orders) return;
    
    let filtered = [...orders];

    // Filter by status
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(order => filters.statuses.includes(order.status));
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(order => new Date(order.created_at) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(order => new Date(order.created_at) <= new Date(filters.dateTo));
    }

    // Filter by amount range
    if (filters.minAmount > 0) {
      filtered = filtered.filter(order => order.total_amount >= filters.minAmount);
    }
    if (filters.maxAmount > 0) {
      filtered = filtered.filter(order => order.total_amount <= filters.maxAmount);
    }

    // Filter by assignment
    if (filters.assignedTo === 'unassigned') {
      filtered = filtered.filter(order => !order.assigned_to);
    } else if (filters.assignedTo === 'assigned') {
      filtered = filtered.filter(order => order.assigned_to);
    }

    setFilteredOrders(filtered);
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    if (orders) {
      setFilteredOrders(orders);
    }
    setActiveFilters({
      statuses: [],
      dateFrom: '',
      dateTo: '',
      assignedTo: '',
      minAmount: 0,
      maxAmount: 0,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.statuses.length > 0) count++;
    if (activeFilters.dateFrom || activeFilters.dateTo) count++;
    if (activeFilters.minAmount > 0 || activeFilters.maxAmount > 0) count++;
    if (activeFilters.assignedTo) count++;
    return count;
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrderIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const handleBulkAssign = async (staffId: string) => {
    const selectedIds = Array.from(selectedOrderIds);
    // TODO: Implement bulk assign API call
    console.log('Assigning orders', selectedIds, 'to staff', staffId);
    setSelectedOrderIds(new Set());
    setIsBulkMode(false);
    await fetchData();
  };

  const handleBulkExport = () => {
    const selectedOrders = filteredOrders.filter(o => selectedOrderIds.has(o.id));
    
    // Create CSV content
    const headers = ['Order Number', 'Customer', 'Amount', 'Status', 'Date'];
    const rows = selectedOrders.map(order => [
      order.order_number,
      order.user.name || order.user.phone,
      order.total_amount.toString(),
      order.status,
      new Date(order.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    setSelectedOrderIds(new Set());
    setIsBulkMode(false);
  };

  const handleBulkCancel = () => {
    if (confirm(`Are you sure you want to cancel ${selectedOrderIds.size} selected orders?`)) {
      // TODO: Implement bulk cancel API call
      console.log('Cancelling orders', Array.from(selectedOrderIds));
      setSelectedOrderIds(new Set());
      setIsBulkMode(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    // TODO: Implement status change API call
    console.log('Changing order', orderId, 'to status', newStatus);
    await fetchData();
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
        subtitle={`${filteredOrders.length} of ${orders?.length || 0} orders`}
        mobileLayout="stack"
        actions={
          <OrderListActions
            isBulkMode={isBulkMode}
            onBulkModeToggle={() => {
              setIsBulkMode(!isBulkMode);
              setSelectedOrderIds(new Set());
            }}
            onFilterClick={() => setIsFilterOpen(true)}
            onCreateOrder={() => navigate('/orders/create')}
            onRefresh={fetchData}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            activeFilterCount={getActiveFilterCount()}
            showStaleIndicator={!!ordersCacheStatus}
            staleIndicator={ordersCacheStatus && <StaleDataIndicator cacheStatus={ordersCacheStatus} />}
          />
        }
      />

      {/* Order Filters Sidebar */}
      <OrderFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={applyFilters}
        onClear={clearFilters}
        activeFilters={activeFilters}
      />

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          message={getActiveFilterCount() > 0 ? "No orders match your filters" : "Orders will appear here once customers start placing them"}
          actionLabel={getActiveFilterCount() > 0 ? "Clear Filters" : "Refresh"}
          onAction={getActiveFilterCount() > 0 ? clearFilters : fetchData}
        />
      ) : viewMode === 'kanban' ? (
        <div className="animate-fade-in">
          <OrderKanban orders={filteredOrders} onStatusChange={handleStatusChange} />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  {isBulkMode && (
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-dark-border bg-dark-hover text-primary focus:ring-2 focus:ring-primary/50"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="animate-fade-in">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-dark-border hover:bg-dark-hover transition-colors">
                    {isBulkMode && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.has(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-4 h-4 rounded border-dark-border bg-dark-hover text-primary focus:ring-2 focus:ring-primary/50"
                        />
                      </td>
                    )}
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
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center justify-start min-w-[120px]">
                        {user?.role === 'admin' ? (
                          <PaymentStatusDropdown
                            orderId={order.id}
                            currentStatus={(order.payment_status || 'unpaid') as PaymentStatus}
                            onStatusChange={refreshOrders}
                          />
                        ) : (
                          <PaymentStatusBadge 
                            status={(order.payment_status || 'unpaid') as PaymentStatus}
                            size="sm"
                          />
                        )}
                      </div>
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

      {/* Bulk Action Bar */}
      {isBulkMode && (
        <BulkActionBar
          selectedCount={selectedOrderIds.size}
          onAssign={handleBulkAssign}
          onExport={handleBulkExport}
          onCancel={handleBulkCancel}
          onClearSelection={() => setSelectedOrderIds(new Set())}
          staffMembers={staffMembers || []}
        />
      )}
    </AppLayout>
  );
};

export default OrderListPage;
