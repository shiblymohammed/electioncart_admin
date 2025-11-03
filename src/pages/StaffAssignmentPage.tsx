import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderDetail, getStaffMembers, assignOrderToStaff } from '../services/adminService';
import { OrderDetail, StaffMember } from '../types/order';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCurrency, formatStatus } from '../utils/formatters';

const StaffAssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      fetchData(parseInt(id));
    }
  }, [id, user, navigate]);

  const fetchData = async (orderId: number) => {
    try {
      setLoading(true);

      const [orderData, staffData] = await Promise.all([
        getOrderDetail(orderId),
        getStaffMembers(),
      ]);

      setOrder(orderData);
      setStaffMembers(staffData);

      // Pre-select currently assigned staff if any
      if (orderData.assigned_to) {
        setSelectedStaffId(orderData.assigned_to.id.toString());
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      showError(err.response?.data?.error?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStaffId || !order) {
      showError('Please select a staff member');
      return;
    }

    try {
      setSubmitting(true);

      const result = await assignOrderToStaff(order.id, parseInt(selectedStaffId));
      
      showSuccess(result.message || 'Order assigned successfully!');
      
      // Redirect to order detail page after 1.5 seconds
      setTimeout(() => {
        navigate(`/orders/${order.id}`);
      }, 1500);
    } catch (err: any) {
      console.error('Error assigning order:', err);
      showError(err.response?.data?.error?.message || 'Failed to assign order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-text-muted">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text mb-2">Order Not Found</h1>
            <Button variant="ghost" onClick={() => navigate('/orders')}>
              ← Back to Orders
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Orders', path: '/orders' },
        { label: order.order_number, path: `/orders/${order.id}` },
        { label: 'Assign Staff' },
      ]}
    >
      <PageHeader
        title={`Assign Order ${order.order_number}`}
        subtitle="Select a staff member to handle this order"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-lg font-semibold text-text mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-muted">Order Number</p>
                <p className="font-medium text-text">{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Customer</p>
                <p className="font-medium text-text">{order.user.name || order.user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Amount</p>
                <p className="font-medium text-text text-lg">{formatCurrency(order.total_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Current Status</p>
                <Badge variant="info" className="mt-1">
                  {formatStatus(order.status)}
                </Badge>
              </div>
              {order.assigned_to && (
                <div className="pt-4 border-t border-dark-border">
                  <p className="text-sm text-text-muted">Currently Assigned To</p>
                  <p className="font-medium text-text">
                    {order.assigned_to.name || order.assigned_to.phone}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Assignment Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-semibold text-text mb-4">
              {order.assigned_to ? 'Reassign to Staff Member' : 'Assign to Staff Member'}
            </h2>

            <form onSubmit={handleAssign}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Select Staff Member
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
                  disabled={submitting}
                >
                  <option value="">-- Select Staff --</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name || staff.phone} ({staff.assigned_orders_count} orders assigned)
                    </option>
                  ))}
                </select>
              </div>

              {/* Staff List */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-text-muted mb-3">Available Staff</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {staffMembers.map(staff => (
                    <div
                      key={staff.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedStaffId === staff.id.toString()
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-dark-border hover:border-primary/50 hover:bg-dark-hover'
                      }`}
                      onClick={() => setSelectedStaffId(staff.id.toString())}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-text">{staff.name || 'N/A'}</p>
                          <p className="text-sm text-text-muted">{staff.phone}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={staff.assigned_orders_count > 5 ? 'warning' : 'success'}>
                            {staff.assigned_orders_count} {staff.assigned_orders_count === 1 ? 'order' : 'orders'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || !selectedStaffId}
                  isLoading={submitting}
                  className="flex-1"
                >
                  {order.assigned_to ? 'Reassign Order' : 'Assign Order'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/orders/${order.id}`)}
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default StaffAssignmentPage;
