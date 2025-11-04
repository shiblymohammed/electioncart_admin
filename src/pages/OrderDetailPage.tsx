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
import { downloadInvoice } from '../services/invoiceService';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

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

  const handleDownloadInvoice = async () => {
    if (!order) return;
    
    try {
      setDownloadingInvoice(true);
      await downloadInvoice(order.id);
      showSuccess('Invoice downloaded successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to download invoice');
    } finally {
      setDownloadingInvoice(false);
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
            <Button 
              variant="secondary" 
              onClick={handleDownloadInvoice}
              isLoading={downloadingInvoice}
            >
              {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
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

          {/* Checklist Progress */}
          {order.checklist && order.checklist.items && order.checklist.items.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-text mb-4">Checklist Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text-muted">Completion Progress</span>
                  <span className={`text-sm font-semibold ${
                    order.checklist.progress_percentage === 100 ? 'text-success' : 'text-primary'
                  }`}>
                    {order.checklist.completed_items} / {order.checklist.total_items} items ({order.checklist.progress_percentage}%)
                  </span>
                </div>
                <div className="w-full bg-dark-border rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      order.checklist.progress_percentage === 100 
                        ? 'bg-success' 
                        : 'bg-primary'
                    }`}
                    style={{ width: `${order.checklist.progress_percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-3">
                {order.checklist.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 transition-all ${
                      item.completed
                        ? 'bg-success/10 border-success/30'
                        : 'bg-dark-card border-dark-border'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 mt-0.5 mr-3 w-6 h-6 rounded border-2 flex items-center justify-center ${
                        item.completed
                          ? 'border-success bg-success'
                          : 'border-dark-border bg-dark-bg'
                      }`}>
                        {item.completed && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          item.completed ? 'text-text-muted line-through' : 'text-text'
                        }`}>
                          {index + 1}. {item.description}
                        </p>
                        {item.completed && item.completed_at && (
                          <div className="mt-2 flex items-center text-xs text-text-muted">
                            <span>Completed on {formatDate(item.completed_at)}</span>
                            {item.completed_by && (
                              <span className="ml-2">
                                by {item.completed_by.name || item.completed_by.phone}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {item.completed && (
                        <div className="flex-shrink-0 ml-2">
                          <Badge variant="success">Done</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Campaign Resources */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text">Campaign Resources</h3>
                <p className="text-sm text-text-muted">Uploaded materials and campaign details</p>
              </div>
            </div>
            {order.resources && order.resources.length > 0 ? (
              <div className="space-y-6">
                {order.resources.map((resourceGroup: any) => (
                  <div key={resourceGroup.order_item_id} className="border border-dark-border rounded-xl p-5 bg-gradient-to-br from-dark-card/50 to-dark-bg/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="px-3 py-1 bg-primary/10 rounded-full">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          {resourceGroup.item_type}
                        </span>
                      </div>
                      <h4 className="font-semibold text-text">
                        {resourceGroup.item_name}
                      </h4>
                    </div>
                    
                    {/* Dynamic Resources */}
                    {resourceGroup.dynamic && resourceGroup.dynamic.length > 0 && (
                      <div className="space-y-6">
                        {/* Images Section */}
                        {resourceGroup.dynamic.filter((f: any) => f.field_type === 'image' && f.value).length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              <h5 className="text-sm font-semibold text-text">Images</h5>
                              <span className="text-xs text-text-muted">
                                ({resourceGroup.dynamic.filter((f: any) => f.field_type === 'image' && f.value).length})
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {resourceGroup.dynamic
                                .filter((f: any) => f.field_type === 'image' && f.value)
                                .map((field: any) => (
                                  <div key={field.id} className="group border border-dark-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 border-b border-dark-border">
                                      <p className="text-xs font-semibold text-text flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                        {field.field_name}
                                      </p>
                                    </div>
                                    <div className="relative aspect-video bg-dark-bg">
                                      <img 
                                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${field.value}?token=${localStorage.getItem('admin_token')}`}
                                        alt={field.field_name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23374151" width="200" height="200"/%3E%3Ctext fill="%239CA3AF" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                        <a
                                          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${field.value}?token=${localStorage.getItem('admin_token')}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 inline-flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                          View Full Size
                                        </a>
                                      </div>
                                    </div>
                                    <div className="p-3 bg-dark-card/50 backdrop-blur-sm">
                                      <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatDate(field.uploaded_at)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Documents Section */}
                        {resourceGroup.dynamic.filter((f: any) => f.field_type === 'document' && f.value).length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                              <h5 className="text-sm font-semibold text-text">Documents</h5>
                              <span className="text-xs text-text-muted">
                                ({resourceGroup.dynamic.filter((f: any) => f.field_type === 'document' && f.value).length})
                              </span>
                            </div>
                            <div className="space-y-3">
                              {resourceGroup.dynamic
                                .filter((f: any) => f.field_type === 'document' && f.value)
                                .map((field: any) => (
                                  <div key={field.id} className="group border border-dark-border rounded-xl p-4 hover:bg-dark-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                                    <div className="flex items-center gap-4">
                                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text mb-1">{field.field_name}</p>
                                        <div className="flex items-center gap-2 text-xs text-text-muted">
                                          <span className="truncate">{field.file_name || 'Document'}</span>
                                          <span>•</span>
                                          <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formatDate(field.uploaded_at)}
                                          </span>
                                        </div>
                                      </div>
                                      <a 
                                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${field.value}?token=${localStorage.getItem('admin_token')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:shadow-lg"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download
                                      </a>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Text and Other Fields Section */}
                        {resourceGroup.dynamic.filter((f: any) => f.field_type !== 'image' && f.field_type !== 'document').length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <h5 className="text-sm font-semibold text-text">Additional Information</h5>
                              <span className="text-xs text-text-muted">
                                ({resourceGroup.dynamic.filter((f: any) => f.field_type !== 'image' && f.field_type !== 'document').length})
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {resourceGroup.dynamic
                                .filter((f: any) => f.field_type !== 'image' && f.field_type !== 'document')
                                .map((field: any) => (
                                  <div key={field.id} className="group border border-dark-border rounded-xl p-4 bg-gradient-to-br from-dark-card/30 to-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                                    <div className="flex items-start gap-3">
                                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                          {field.field_name}
                                        </p>
                                        <p className="text-sm text-text font-semibold mb-2 break-words">
                                          {field.value || 'N/A'}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-text-muted">
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          {formatDate(field.uploaded_at)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Static Resources (Old Format) */}
                    {resourceGroup.static && (
                      <div className="mt-6 pt-6 border-t border-dark-border/50">
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <h5 className="text-sm font-semibold text-text">Legacy Campaign Details</h5>
                          <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full font-medium">Old Format</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resourceGroup.static.campaign_slogan && (
                            <div className="border border-dark-border rounded-xl p-4 bg-gradient-to-br from-warning/5 to-transparent">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Campaign Slogan</p>
                                  <p className="text-sm text-text font-semibold italic leading-relaxed">"{resourceGroup.static.campaign_slogan}"</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {resourceGroup.static.whatsapp_number && (
                            <div className="border border-dark-border rounded-xl p-4 bg-gradient-to-br from-success/5 to-transparent">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">WhatsApp Number</p>
                                  <a href={`https://wa.me/${resourceGroup.static.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-success font-semibold hover:underline">
                                    {resourceGroup.static.whatsapp_number}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Uploaded on {formatDate(resourceGroup.static.uploaded_at)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-card rounded-full mb-4">
                  <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-text font-semibold mb-2">No Resources Yet</h4>
                <p className="text-text-muted text-sm max-w-sm mx-auto">
                  Campaign resources will appear here once the customer uploads them
                </p>
              </div>
            )}
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
