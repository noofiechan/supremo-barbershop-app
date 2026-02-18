// Haircut Options (5 presets)
export const HAIRCUT_OPTIONS = [
  {
    id: 'high-fade-buzz',
    name: 'High Fade Buzz Cut',
    description: 'Clean, short buzz cut with high fade sides',
  },
  {
    id: 'combover-taper',
    name: 'Combover with Taper Fade',
    description: 'Classic combover with taper fade on sides',
  },
  {
    id: 'mid-fade',
    name: 'Mid Fade',
    description: 'Balanced fade with medium length on top',
  },
  {
    id: 'crop-top',
    name: 'Crop Top',
    description: 'Textured crop with faded sides',
  },
  {
    id: 'side-part',
    name: 'Side Part',
    description: 'Professional side part with clean lines',
  },
];

export const CUSTOM_HAIRCUT = {
  id: 'custom',
  name: 'Custom',
  description: 'Upload your own design or specify custom details',
};

// Service Categories
export const SERVICE_TYPES = ['Haircut', 'Hairdyeing', 'Shaving'] as const;

// Default Prices (in pesos)
export const DEFAULT_PRICES = {
  haircut: 250,
  hairdyeing: 500,
  shaving: 150,
  custom: 300,
};

// Appointment Status
export const APPOINTMENT_STATUSES = [
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
] as const;

// Payment Methods
export const PAYMENT_METHODS = ['Cash'] as const; // Cash only as per requirements

// Date/Time Constants
export const BUSINESS_HOURS = {
  open: '09:00',
  close: '18:00',
};

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

// Session Keys
export const SESSION_KEY = 'supremo_session';
export const AUTH_TOKEN_KEY = 'supremo_auth_token';

// Routes
export const ROUTES = {
  home: '/',
  login: '/login',
  guestBook: '/guest/book',
  customerDashboard: '/customer/dashboard',
  barberDashboard: '/barber/dashboard',
  cashierDashboard: '/cashier/dashboard',
  managerDashboard: '/manager/dashboard',
  checkout: '/checkout',
  receipt: '/receipt',
};

// Error Messages
export const ERROR_MESSAGES = {
  invalidCredentials: 'Invalid email or password',
  userNotFound: 'User not found',
  emailAlreadyExists: 'Email already registered',
  reservationNotFound: 'Reservation not found',
  paymentFailed: 'Payment processing failed',
  serverError: 'An error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  loginSuccess: 'Login successful',
  bookingSuccess: 'Booking confirmed successfully',
  paymentSuccess: 'Payment processed successfully',
  guestCheckoutSuccess: 'Guest checkout completed',
};
