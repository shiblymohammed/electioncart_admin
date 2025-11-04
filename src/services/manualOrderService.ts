import api from './api';
import {
  CreateManualOrderRequest,
  ProductForOrder,
  CustomerSearchResult,
  RecordPaymentRequest,
  UpdateOrderStatusRequest,
  PaymentRecord,
  OrderStatusHistory,
} from '../types/manualOrder';

/**
 * Create a manual order for offline leads
 */
export const createManualOrder = async (data: CreateManualOrderRequest) => {
  const response = await api.post('/admin/orders/manual/', data);
  return response.data;
};

/**
 * Search for existing customers by phone or name
 */
export const searchCustomers = async (query: string): Promise<CustomerSearchResult[]> => {
  const response = await api.get(`/admin/customers/search/?q=${encodeURIComponent(query)}`);
  return response.data.customers;
};

/**
 * Get all active products for order creation
 */
export const getProductsForOrder = async (): Promise<{
  campaigns: ProductForOrder[];
  packages: ProductForOrder[];
}> => {
  const response = await api.get('/admin/products/for-order/');
  return response.data;
};

/**
 * Record a payment for an order
 */
export const recordPayment = async (
  orderId: number,
  paymentData: RecordPaymentRequest
): Promise<{
  success: boolean;
  message: string;
  payment: PaymentRecord;
  total_paid: number;
  balance: number;
  fully_paid: boolean;
}> => {
  const formData = new FormData();
  formData.append('amount', paymentData.amount.toString());
  formData.append('payment_method', paymentData.payment_method);
  
  if (paymentData.payment_reference) {
    formData.append('payment_reference', paymentData.payment_reference);
  }
  
  if (paymentData.payment_proof) {
    formData.append('payment_proof', paymentData.payment_proof);
  }
  
  if (paymentData.notes) {
    formData.append('notes', paymentData.notes);
  }
  
  const response = await api.post(`/admin/orders/${orderId}/record-payment/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Update order status manually
 */
export const updateOrderStatus = async (
  orderId: number,
  statusData: UpdateOrderStatusRequest
): Promise<{
  success: boolean;
  message: string;
  order: any;
}> => {
  const response = await api.post(`/admin/orders/${orderId}/update-status/`, statusData);
  return response.data;
};

/**
 * Get payment records for an order
 */
export const getPaymentRecords = async (orderId: number): Promise<PaymentRecord[]> => {
  const response = await api.get(`/admin/orders/${orderId}/payment-records/`);
  return response.data;
};

/**
 * Get status history for an order
 */
export const getStatusHistory = async (orderId: number): Promise<OrderStatusHistory[]> => {
  const response = await api.get(`/admin/orders/${orderId}/status-history/`);
  return response.data;
};

/**
 * Update payment status manually
 */
export const updatePaymentStatus = async (
  orderId: number,
  paymentStatus: string
): Promise<{
  success: boolean;
  message: string;
  order: any;
}> => {
  const response = await api.post(`/admin/orders/${orderId}/update-payment-status/`, {
    payment_status: paymentStatus,
  });
  return response.data;
};
