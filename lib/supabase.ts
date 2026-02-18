import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for common queries
export const db = {
  // CRITICAL: Adding the client here fixes the "reading 'from'" error in your dashboard
  supabase, 

  // Customer queries
  getCustomer: async (email: string) => {
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  createCustomer: async (customer: any) => {
    const { data, error } = await supabase
      .from('customer')
      .insert([customer])
      .select()
      .single();
    return { data, error };
  },

  // Service queries
  getServices: async () => {
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('availability_status', 'Available');
    return { data, error };
  },

  getServiceById: async (serviceId: number) => {
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('service_id', serviceId)
      .single();
    return { data, error };
  },

  // Barber queries
  getAvailableBarbers: async () => {
    const { data, error } = await supabase
      .from('barber')
      .select('*');
    return { data, error };
  },

  getBarberById: async (barberId: number) => {
    const { data, error } = await supabase
      .from('barber')
      .select('*')
      .eq('barber_id', barberId)
      .single();
    return { data, error };
  },

  // Reservation queries
  // ADDED: General fetch for the manager dashboard to simplify your code
  getReservations: async (limit = 50) => {
    const { data, error } = await supabase
      .from('reservation')
      .select(`
        *,
        service:service_id(*),
        barber:barber_id(*),
        customer:customer_id(*)
      `)
      .order('appointment_date', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  createReservation: async (reservation: any) => {
    const { data, error } = await supabase
      .from('reservation')
      .insert([reservation])
      .select()
      .single();
    return { data, error };
  },

  getReservationById: async (reservationId: number) => {
    const { data, error } = await supabase
      .from('reservation')
      .select(`
        *,
        service:service_id(*),
        barber:barber_id(*),
        customer:customer_id(*)
      `)
      .eq('reservation_id', reservationId)
      .single();
    return { data, error };
  },

  getReservationsByCustomer: async (customerId: number) => {
    const { data, error } = await supabase
      .from('reservation')
      .select(`
        *,
        service:service_id(*),
        barber:barber_id(*)
      `)
      .eq('customer_id', customerId)
      .order('appointment_date', { ascending: false });
    return { data, error };
  },

  getReservationsByBarber: async (barberId: number, date?: string) => {
    let query = supabase
      .from('reservation')
      .select(`
        *,
        service:service_id(*),
        customer:customer_id(*)
      `)
      .eq('barber_id', barberId);

    if (date) {
      query = query.eq('appointment_date', date);
    }

    const { data, error } = await query.order('appointment_time', {
      ascending: true,
    });
    return { data, error };
  },

  // Payment queries
  createPayment: async (payment: any) => {
    const { data, error } = await supabase
      .from('payment')
      .insert([payment])
      .select()
      .single();
    return { data, error };
  },

  getPaymentByReservation: async (reservationId: number) => {
    const { data, error } = await supabase
      .from('payment')
      .select('*')
      .eq('reservation_id', reservationId)
      .single();
    return { data, error };
  },

  // Guest Transaction queries
  createGuestTransaction: async (transaction: any) => {
    const { data, error } = await supabase
      .from('guest_transaction')
      .insert([transaction])
      .select()
      .single();
    return { data, error };
  },

  getGuestTransaction: async (transactionId: number) => {
    const { data, error } = await supabase
      .from('guest_transaction')
      .select(`
        *,
        service:service_id(*),
        barber:barber_id(*)
      `)
      .eq('guest_transaction_id', transactionId)
      .single();
    return { data, error };
  },

  updateTransactionStatus: async (id: number, status: string, amount_paid?: number) => {
    const { data, error } = await supabase
      .from('guest_transaction')
      .update({ 
        status: status,
        // Set amount to 0 if cancelled or refunded to maintain accurate revenue stats
        amount_paid: (status === 'Cancelled' || status === 'Refunded') ? 0 : amount_paid 
      })
      .eq('guest_transaction_id', id)
      .select()
      .single();
    return { data, error };
  },
  
  // Custom Haircut queries
  createCustomHaircut: async (haircut: any) => {
    const { data, error } = await supabase
      .from('custom_haircut')
      .insert([haircut])
      .select()
      .single();
    return { data, error };
  },

  // Auth queries
  getAuthUser: async (email: string) => {
    const { data, error } = await supabase
      .from('auth_user')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  createAuthUser: async (authUser: any) => {
    const { data, error } = await supabase
      .from('auth_user')
      .insert([authUser])
      .select()
      .single();
    return { data, error };
  },
};
  