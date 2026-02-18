// Auth Types
export type UserType = 'CUSTOMER' | 'BARBER' | 'CASHIER' | 'MANAGER' | 'GUEST';
export type EmployeeType = 'BARBER' | 'CASHIER' | 'MANAGER';
export type AppointmentType = 'BOOK' | 'WALK_IN';
export type PaymentMethod = 'Cash' | 'Online';
export type ReservationStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type ServiceType = 'Haircut' | 'Hairdyeing' | 'Shaving';

// Database Models
export interface Employee {
  emp_id: number;
  emp_name: string;
  emp_lname: string;
  emp_age: string;
  emp_contact_info: string;
  emp_hire_date: string;
  emp_basic_sal: string;
  emp_type: EmployeeType;
  created_at: string;
  updated_at: string;
}

export interface Manager {
  manager_id: number;
  m_fname: string;
  m_experience: string;
  emp_id: number;
}

export interface Barber {
  barber_id: number;
  barber_fname: string;
  barber_lname: string;
  barber_age: number;
  barber_join_date: string;
  manager_id: number;
  emp_id: number;
}

export interface Cashier {
  cashier_id: number;
  cashier_fname: string;
  cashier_contact_info: string;
  cashier_transaction_total: string;
  cashier_register_no: string;
  emp_id: number;
}

export interface Customer {
  customer_id: number;
  fname: string;
  lname: string;
  phone_no: string;
  email: string;
  address_line1: string;
  address_line2: string;
  barber_pref: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  service_id: number;
  service_name: string;
  service_category: ServiceType;
  service_description: string;
  price: number;
  availability_status: string;
  custom_haircut_id?: number;
}

export interface CustomHaircut {
  custom_id: number;
  custom_name: string;
  custom_picture_url: string;
  custom_description: string;
  created_at: string;
}

export interface Reservation {
  reservation_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_type: AppointmentType;
  status: ReservationStatus;
  payment_status: string;
  customer_id?: number;
  barber_id: number;
  service_id: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  payment_id: number;
  payment_method: PaymentMethod;
  amount_paid: number;
  discount_applied: number;
  payment_date: string;
  receipt_number: string;
  transaction_id?: string;
  cashier_id?: number;
  reservation_id: number;
}

export interface GuestTransaction {
  guest_transaction_id: number;
  guest_email: string;
  guest_phone: string;
  appointment_date: string;
  appointment_time: string;
  service_id: number;
  barber_id: number;
  amount_paid: number;
  payment_method: PaymentMethod;
  receipt_number: string;
  receipt_url: string;
  status: string;
  created_at: string;
}

export interface AuthUser {
  user_id: number;
  email: string;
  password_hash: string;
  user_type: UserType;
  related_id: number;
  created_at: string;
  updated_at: string;
}

// Session/Auth
export interface SessionUser {
  user_id: number;
  email: string;
  user_type: UserType;
  related_id: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
