import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderDetail } from '../services/adminService';
import { getAssignedOrderDetail } from '../services/staffService';
import { OrderDetail as OrderDetailType } from '../types/order';
import OrderDetail from '../components/OrderDetail';
import { Modal, StaffAssignment, ChecklistView } from '../components';
import invoiceService from '../services/invoiceService';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetail(parseInt(id));
    }
  }, [id]);

  const fetchOrderDetail = async (orderId: number) => {
    try {
      setLoading(true);
      setError(null);

      // Use staff service if user is staff, otherwise use admin service
      const orderData = user?.role === 'staff' 
        ? await getAssignedOrderDetail(orderId)
        : await getOrderDetail(orderId);
      setOrder(orderData);
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      setError(err.response?.data?.error?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSuccess = () => {
    setShowAssignmentModal(false);
    // Refresh order details to show updated assignment
    if (id) {
      fetchOrderDetail(parseInt(id));
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    
    try {
      setDownloadingInvoice(true);
      await invoiceService.downloadInvoice(order.id);
    } catch (err: any) {
      alert(err.message || 'Failed to download invoice');
      console.error('Error downloading invoice:', err);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const canDownloadInvoice = () => {
    if (!order) return false;
    
    // Show invoice for orders that have been paid (not pending_payment)
    const isPaid = order.status !== 'pending_payment' && order.status !== 'pending_resources';
    const hasSuccessfulPayment = order.payment_history && order.payment_history.status === 'success';
    
    // Show button if payment was successful OR order is past payment stage
    return hasSuccessfulPayment || isPaid;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4">
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order {order.order_number}
                </h1>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Created on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex gap-4">
              {canDownloadInvoice() && (
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloadingInvoice}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {downloadingInvoice ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      📄 Download Invoice
                    </>
                  )}
                </button>
              )}
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'staff' && order.checklist ? (
          // Staff view with interactive checklist
          <ChecklistView 
            order={order}
            onUpdate={() => {
              if (id) {
                fetchOrderDetail(parseInt(id));
              }
            }}
          />
        ) : (
          // Admin view with order details
          <OrderDetail 
            order={order} 
            showActions={true}
            userRole={user?.role}
            onAssignClick={() => setShowAssignmentModal(true)}
          />
        )}
      </main>

      {/* Staff Assignment Modal */}
      <Modal isOpen={showAssignmentModal} onClose={() => setShowAssignmentModal(false)}>
        <StaffAssignment
          orderId={order.id}
          orderNumber={order.order_number}
          currentAssignedStaff={order.assigned_to}
          onSuccess={handleAssignmentSuccess}
          onCancel={() => setShowAssignmentModal(false)}
          isModal={true}
        />
      </Modal>
    </div>
  );
};

export default OrderDetailPage;
