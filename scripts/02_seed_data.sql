-- ===========================================
-- 1. CLEANUP (Optional: Uncomment to start fresh)
-- ===========================================
-- TRUNCATE TABLE payment, reservation, guest_transaction, auth_user, customer, barber, cashier, manager, employee RESTART IDENTITY CASCADE;

-- ===========================================
-- 2. EMPLOYEE DATA
-- ===========================================

-- Add Manager
INSERT INTO employee (emp_name, emp_lname, emp_age, emp_contact_info, emp_hire_date, emp_basic_sal, emp_type)
VALUES ('Michael', 'Johnson', 35, '09051234567', '2022-01-15', 50000, 'MANAGER');

INSERT INTO manager (m_fname, m_experience, emp_id)
VALUES ('Michael', '10 years', (SELECT emp_id FROM employee WHERE emp_name = 'Michael' AND emp_type = 'MANAGER' LIMIT 1));

-- Add Barbers
INSERT INTO employee (emp_name, emp_lname, emp_age, emp_contact_info, emp_hire_date, emp_basic_sal, emp_type)
VALUES 
('John', 'Doe', 28, '09091234567', '2023-03-20', 20000, 'BARBER'),
('Carlos', 'Santos', 32, '09101234567', '2022-06-10', 22000, 'BARBER'),
('Antonio', 'Rivera', 29, '09111234567', '2023-01-05', 21000, 'BARBER');

-- Link Barbers to the Manager and Employee records
INSERT INTO barber (barber_fname, barber_lname, barber_age, barber_join_date, manager_id, emp_id)
SELECT 'John', 'Doe', 28, '2023-03-20', m.manager_id, e.emp_id 
FROM manager m, employee e WHERE e.emp_name = 'John' AND m.m_fname = 'Michael';

INSERT INTO barber (barber_fname, barber_lname, barber_age, barber_join_date, manager_id, emp_id)
SELECT 'Carlos', 'Santos', 32, '2022-06-10', m.manager_id, e.emp_id 
FROM manager m, employee e WHERE e.emp_name = 'Carlos' AND m.m_fname = 'Michael';

INSERT INTO barber (barber_fname, barber_lname, barber_age, barber_join_date, manager_id, emp_id)
SELECT 'Antonio', 'Rivera', 29, '2023-01-05', m.manager_id, e.emp_id 
FROM manager m, employee e WHERE e.emp_name = 'Antonio' AND m.m_fname = 'Michael';

-- Add Cashiers
INSERT INTO employee (emp_name, emp_lname, emp_age, emp_contact_info, emp_hire_date, emp_basic_sal, emp_type)
VALUES 
('Jane', 'Smith', 26, '09121234567', '2023-04-01', 18000, 'CASHIER'),
('Maria', 'Garcia', 27, '09131234567', '2023-05-15', 18000, 'CASHIER');

INSERT INTO cashier (cashier_fname, cashier_contact_info, emp_id)
SELECT 'Jane', '09121234567', emp_id FROM employee WHERE emp_name = 'Jane';

INSERT INTO cashier (cashier_fname, cashier_contact_info, emp_id)
SELECT 'Maria', '09131234567', emp_id FROM employee WHERE emp_name = 'Maria';

-- ===========================================
-- 3. SERVICE DATA
-- ===========================================

INSERT INTO service (service_name, service_category, service_description, price, availability_status)
VALUES 
('Standard Haircut', 'Haircut', 'Professional haircut with classic styling', 250, 'Available'),
('High Fade Buzz Cut', 'Haircut', 'Clean, short buzz cut with high fade sides', 250, 'Available'),
('Fade Haircut', 'Haircut', 'Modern fade with length on top', 250, 'Available'),
('Premium Haircut', 'Haircut', 'Premium cut with design details', 300, 'Available'),
('Hair Dyeing', 'Hairdyeing', 'Professional hair coloring service', 500, 'Available'),
('Premium Hair Color', 'Hairdyeing', 'Premium coloring with treatments', 700, 'Available'),
('Beard Trim', 'Shaving', 'Professional beard trimming and shaping', 150, 'Available'),
('Clean Shave', 'Shaving', 'Complete beard shaving service', 150, 'Available'),
('Facial Treatment', 'Shaving', 'Complete face grooming and treatment', 200, 'Available');

-- ===========================================
-- 4. SAMPLE CUSTOMERS
-- ===========================================

INSERT INTO customer (fname, lname, email, phone_no, address_line1, address_line2, barber_pref)
VALUES 
('Juan', 'Dela Cruz', 'juan.delacruz@email.com', '09201234567', '123 Main St', 'Apt 4', 'John Doe'),
('Maria', 'Lopez', 'maria.lopez@email.com', '09211234567', '456 Oak Ave', 'Unit 2', 'Carlos Santos'),
('Pedro', 'Garcia', 'pedro.garcia@email.com', '09221234567', '789 Pine Rd', NULL, 'Any'),
('Ana', 'Martinez', 'ana.martinez@email.com', '09231234567', '321 Elm St', 'Suite 5', 'Antonio Rivera');

-- ===========================================
-- 5. SAMPLE AUTH USERS
-- ===========================================

INSERT INTO auth_user (email, password_hash, user_type, related_id)
VALUES 
('customer1@supremo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CH.P/i', 'CUSTOMER', (SELECT customer_id FROM customer WHERE email = 'juan.delacruz@email.com')),
('barber@supremo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CH.P/i', 'BARBER', (SELECT barber_id FROM barber WHERE barber_fname = 'John')),
('cashier@supremo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CH.P/i', 'CASHIER', (SELECT cashier_id FROM cashier WHERE cashier_fname = 'Jane')),
('manager@supremo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CH.P/i', 'MANAGER', (SELECT manager_id FROM manager WHERE m_fname = 'Michael'));

-- ===========================================
-- 6. SAMPLE RESERVATIONS
-- ===========================================

INSERT INTO reservation (appointment_date, appointment_time, appointment_type, status, payment_status, customer_id, barber_id, service_id)
VALUES 
(CURRENT_DATE + INTERVAL '1 day', '10:00', 'BOOK', 'Confirmed', 'Unpaid', 
 (SELECT customer_id FROM customer WHERE fname = 'Juan'), 
 (SELECT barber_id FROM barber WHERE barber_fname = 'John'), 
 (SELECT service_id FROM service WHERE service_name = 'Standard Haircut')),
(CURRENT_DATE + INTERVAL '2 days', '14:30', 'BOOK', 'Confirmed', 'Unpaid', 
 (SELECT customer_id FROM customer WHERE fname = 'Maria'), 
 (SELECT barber_id FROM barber WHERE barber_fname = 'Carlos'), 
 (SELECT service_id FROM service WHERE service_name = 'High Fade Buzz Cut'));

-- ===========================================
-- 7. GUEST TRANSACTIONS & PAYMENTS
-- ===========================================

INSERT INTO guest_transaction (guest_email, guest_phone, appointment_date, appointment_time, service_id, barber_id, amount_paid, payment_method, receipt_number, status)
VALUES 
('guest1@email.com', '09901234567', CURRENT_DATE - INTERVAL '1 day', '09:30', 
 (SELECT service_id FROM service WHERE service_name = 'Standard Haircut'), 
 (SELECT barber_id FROM barber WHERE barber_fname = 'John'), 250, 'Cash', 'RCP-GUEST-001', 'Completed');

INSERT INTO payment (payment_method, amount_paid, discount_applied, payment_date, receipt_number, cashier_id, reservation_id)
VALUES 
('Cash', 250, 0, CURRENT_DATE - INTERVAL '1 day', 'RCP-RES-001', 
 (SELECT cashier_id FROM cashier WHERE cashier_fname = 'Jane'), 
 (SELECT reservation_id FROM reservation LIMIT 1));
-- ===========================================
-- Test Data Summary
-- ===========================================
-- Login Credentials (Password: "password123")
-- 
-- Manager:
-- Email: manager@supremo.com
-- Password: password123
-- 
-- Barber:
-- Email: barber@supremo.com
-- Password: password123
-- 
-- Cashier:
-- Email: cashier@supremo.com
-- Password: password123
-- 
-- Customer:
-- Email: customer1@supremo.com
-- Password: password123
-- 
-- Guest:
-- No login needed - use guest booking form
-- 
-- ===========================================
