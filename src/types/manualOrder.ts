// Manual Order Creation Types

export interface ManualOrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface ManualOrderItem {
  product_type: 'campaign' | 'package';
  product_id: number;
  product_name?: string;
  quantity: number;
  price: number;
}

export type OrderSource = 'phone_call' | 'whatsapp' | 'walk_in' | 'email' | 'referral' | 'other';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded' | 'cod';
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'card' | 'cheque' | 'other';
export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';
export type OrderStatus = 
  | 'pending_payment'
  | 'pending_resources'
  | 'ready_for_processing'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export interface CreateManualOrderRequest {
  customer: ManualOrderCustomer;
  items: ManualOrderItem[];
  order_source: OrderSource;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  payment_reference?: string;
  payment_amount?: number;
  assigned_to?: number;
  priority?: OrderPriority;
  notes?: string;
}

export interface ProductForOrder {
  id: number;
  name: string;
  description: string;
  price: number;
  type: 'campaign' | 'package';
  is_active: boolean;
}

export interface CustomerSearchResult {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: string;
}

export interface PaymentRecord {
  id: number;
  order: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_reference: string;
  payment_proof?: string;
  recorded_by: {
    id: number;
    name: string;
  };
  recorded_at: string;
  notes: string;
}

export interface RecordPaymentRequest {
  amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  payment_proof?: File;
  notes?: string;
}

export interface OrderStatusHistory {
  id: number;
  order: number;
  old_status: OrderStatus;
  new_status: OrderStatus;
  old_status_display: string;
  new_status_display: string;
  changed_by: {
    id: number;
    name: string;
  };
  changed_at: string;
  reason: string;
  is_manual_change: boolean;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string;
}

export interface UpdatePaymentStatusRequest {
  payment_status: PaymentStatus;
}

export interface OrderCart {
  items: ManualOrderItem[];
  total: number;
}
