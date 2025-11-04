export interface OrderStatistics {
  pending: number;
  assigned: number;
  in_progress: number;
  completed: number;
  total: number;
}

export interface PaymentHistory {
  id: number;
  status: 'pending' | 'success' | 'failed';
  payment_method: string;
  transaction_id: string;
  amount: number;
  currency: string;
  payment_date: string;
  invoice_number: string;
  invoice_generated_at?: string;
}

export interface AdminOrder {
  id: number;
  order_number: string;
  user: {
    id: number;
    phone: string;
    name?: string;
  };
  total_amount: number;
  status: string;
  payment_status?: 'unpaid' | 'partial' | 'paid' | 'refunded' | 'cod';
  total_paid?: number;
  payment_balance?: number;
  assigned_to?: {
    id: number;
    name?: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payment_history?: PaymentHistory;
}

export interface OrderItem {
  id: number;
  item_type: 'package' | 'campaign';
  item_details: any;
  quantity: number;
  price: number;
  resources_uploaded: boolean;
}

export interface ChecklistItem {
  id: number;
  description: string;
  completed: boolean;
  completed_at: string | null;
  completed_by: {
    id: number;
    name?: string;
    phone: string;
  } | null;
  order_index: number;
}

export interface OrderChecklist {
  id: number;
  total_items: number;
  completed_items: number;
  progress_percentage: number;
  items: ChecklistItem[];
}

export interface OrderDetail extends AdminOrder {
  resources: OrderResource[];
  checklist?: OrderChecklist;
}

export interface DynamicResourceField {
  id: number;
  field_name: string;
  field_type: 'text' | 'image' | 'document' | 'date' | 'phone';
  value: string;
  file_name?: string;
  uploaded_at: string;
}

export interface StaticResource {
  campaign_slogan?: string;
  whatsapp_number?: string;
  uploaded_at: string;
}

export interface OrderResource {
  order_item_id: number;
  item_name: string;
  item_type: string;
  dynamic?: DynamicResourceField[];
  static?: StaticResource;
}

export interface StaffMember {
  id: number;
  name?: string;
  phone: string;
  assigned_orders_count: number;
}
