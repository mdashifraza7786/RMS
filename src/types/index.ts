// User Related
export interface User {
  userid: string;
  name: string;
  role: 'admin' | 'chef' | 'waiter' | 'washer';
  mobile: string;
  email?: string | null;
  password?: string;
  photo?: string | null;
  aadhaar?: string | null;
  pancard?: string | null;
  ratings?: string | null;
}

export interface UserAddress {
  userid: string;
  street_or_house_no?: string | null;
  landmark?: string | null;
  address_one?: string | null;
  address_two?: string | null;
  city?: string | null;
  state?: string | null;
  pin?: string | null;
  country?: string | null;
}

// Order Related
export interface OrderItem {
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  status?: 'pending' | 'preparing' | 'ready' | 'delivered';
}

export interface Order {
  id: number;
  table_id: number;
  waiter_id: string;
  waiter_name?: string;
  chef_id?: string | null;
  chef_name?: string | null;
  order_items: OrderItem[] | string;
  start_time: string;
  end_time?: string | null;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

export interface Invoice {
  id: number;
  orderid: number;
  table_id: number;
  subtotal: number;
  gst: number;
  total_amount: number;
  discount: number;
  payment_method?: string | null;
  payment_status: 'pending' | 'paid' | 'failed';
  generated_at: string;
}

// Inventory Related
export interface InventoryItem {
  item_id: string;
  item_name: string;
  current_stock: number;
  low_limit: number;
  unit: string;
}

// Expense Related
export interface Expense {
  id: string;
  expenses_for: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once';
  cost: number;
  date: string;
}

// Payout Related
export interface Payout {
  id: number;
  userid: string;
  account_number: string;
  upi_id?: string | null;
  amount: number;
  status: 'pending' | 'paid' | 'rejected';
  date: string;
}

export interface PayoutDetails {
  userid: string;
  account_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  upiid?: string | null;
  salary: number;
  balance: number;
}

// Common Database Response
export interface DbResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// DTOs (Data Transfer Objects)
export interface CreateOrderDTO {
  table_id: number;
  waiter_id: string;
  order_items: OrderItem[];
}

export interface CreateExpenseDTO {
  expenses_for: string;
  frequency: Expense['frequency'];
  cost: number;
  date: string;
}

export interface LoginDTO {
  userid: string;
  password: string;
}
