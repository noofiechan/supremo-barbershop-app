-- Supremo Barbershop Database Schema

-- Employee table
CREATE TABLE IF NOT EXISTS employee (
  emp_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  emp_name VARCHAR(45) NOT NULL,
  emp_lname VARCHAR(45) NOT NULL,
  emp_age VARCHAR(45),
  emp_contact_info VARCHAR(45),
  emp_hire_date VARCHAR(45),
  emp_basic_sal VARCHAR(45),
  emp_type VARCHAR(45) NOT NULL CHECK (emp_type IN ('BARBER', 'CASHIER', 'MANAGER')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Manager table
CREATE TABLE IF NOT EXISTS manager (
  manager_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  m_fname VARCHAR(45) NOT NULL,
  m_experience VARCHAR(45),
  emp_id INT NOT NULL UNIQUE,
  FOREIGN KEY (emp_id) REFERENCES employee(emp_id) ON DELETE CASCADE
);

-- Barber table
CREATE TABLE IF NOT EXISTS barber (
  barber_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  barber_fname VARCHAR(45) NOT NULL,
  barber_lname VARCHAR(45) NOT NULL,
  barber_age INT,
  barber_join_date VARCHAR(45),
  manager_id INT,
  emp_id INT NOT NULL UNIQUE,
  FOREIGN KEY (manager_id) REFERENCES manager(manager_id) ON DELETE SET NULL,
  FOREIGN KEY (emp_id) REFERENCES employee(emp_id) ON DELETE CASCADE
);

-- Cashier table
CREATE TABLE IF NOT EXISTS cashier (
  cashier_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cashier_fname VARCHAR(45) NOT NULL,
  cashier_contact_info VARCHAR(45),
  cashier_transaction_total VARCHAR(45),
  cashier_register_no VARCHAR(45),
  emp_id INT NOT NULL UNIQUE,
  FOREIGN KEY (emp_id) REFERENCES employee(emp_id) ON DELETE CASCADE
);

-- Customer table
CREATE TABLE IF NOT EXISTS customer (
  customer_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fname VARCHAR(45) NOT NULL,
  lname VARCHAR(45) NOT NULL,
  phone_no VARCHAR(45),
  email VARCHAR(45) NOT NULL UNIQUE,
  address_line1 VARCHAR(45),
  address_line2 VARCHAR(45),
  barber_pref VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Category table
CREATE TABLE IF NOT EXISTS service_category (
  service_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  service_name VARCHAR(45) NOT NULL,
  service_type VARCHAR(45) NOT NULL CHECK (service_type IN ('Haircut', 'Hairdyeing', 'Shaving'))
);

-- Cut Style Type table
CREATE TABLE IF NOT EXISTS cut_style_type (
  haircut_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  haircut_name VARCHAR(45) NOT NULL,
  trim_style VARCHAR(45),
  fade_amount VARCHAR(45),
  undercut_length VARCHAR(45)
);

-- Shave Type table
CREATE TABLE IF NOT EXISTS shave_type (
  shave_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  shave_name VARCHAR(45) NOT NULL,
  beard_trim_style VARCHAR(45),
  facial_treatment VARCHAR(45)
);

-- Haircut service variants
CREATE TABLE IF NOT EXISTS haircut_service (
  service_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  haircut_id INT NOT NULL,
  dye_id INT,
  cut_style_type VARCHAR(45) NOT NULL,
  cut_duration VARCHAR(45),
  FOREIGN KEY (haircut_id) REFERENCES cut_style_type(haircut_id),
  UNIQUE(haircut_id)
);

-- Hairdyeing service variants
CREATE TABLE IF NOT EXISTS hairdyeing_service (
  service_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  dye_id INT NOT NULL,
  dye_color VARCHAR(45),
  dye_brand VARCHAR(45),
  dye_duration VARCHAR(45),
  UNIQUE(dye_id)
);

-- Shaving service variants
CREATE TABLE IF NOT EXISTS shaving_service (
  service_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  shave_id INT NOT NULL,
  shave_type_name VARCHAR(45),
  FOREIGN KEY (shave_id) REFERENCES shave_type(shave_id),
  UNIQUE(shave_id)
);

-- Custom Haircut table
CREATE TABLE IF NOT EXISTS custom_haircut (
  custom_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  custom_name VARCHAR(45),
  custom_picture_url VARCHAR(255),
  custom_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service table
CREATE TABLE IF NOT EXISTS service (
  service_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  service_name VARCHAR(45) NOT NULL,
  service_category VARCHAR(45) NOT NULL,
  service_description VARCHAR(255),
  price INT NOT NULL,
  availability_status VARCHAR(45) DEFAULT 'Available',
  custom_haircut_id INT,
  FOREIGN KEY (custom_haircut_id) REFERENCES custom_haircut(custom_id) ON DELETE SET NULL
);

-- Reservation table
CREATE TABLE IF NOT EXISTS reservation (
  reservation_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type VARCHAR(45) NOT NULL CHECK (appointment_type IN ('BOOK', 'WALK_IN')),
  status VARCHAR(45) DEFAULT 'Pending',
  payment_status VARCHAR(45) DEFAULT 'Unpaid',
  customer_id INT,
  barber_id INT,
  service_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE SET NULL,
  FOREIGN KEY (barber_id) REFERENCES barber(barber_id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES service(service_id) ON DELETE CASCADE
);

-- Payment table
CREATE TABLE IF NOT EXISTS payment (
  payment_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  payment_method VARCHAR(45) NOT NULL CHECK (payment_method IN ('Cash', 'Online')),
  amount_paid INT NOT NULL,
  discount_applied INT DEFAULT 0,
  payment_date DATE NOT NULL,
  receipt_number VARCHAR(45) NOT NULL UNIQUE,
  transaction_id VARCHAR(45),
  cashier_id INT,
  reservation_id INT NOT NULL,
  FOREIGN KEY (cashier_id) REFERENCES cashier(cashier_id) ON DELETE SET NULL,
  FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id) ON DELETE CASCADE
);

-- Guest Transaction table (for walk-ins/guests)
CREATE TABLE IF NOT EXISTS guest_transaction (
  guest_transaction_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  guest_email VARCHAR(45) NOT NULL,
  guest_phone VARCHAR(45),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_id INT NOT NULL,
  barber_id INT,
  amount_paid INT NOT NULL,
  payment_method VARCHAR(45) DEFAULT 'Cash',
  receipt_number VARCHAR(45) NOT NULL UNIQUE,
  receipt_url VARCHAR(255),
  status VARCHAR(45) DEFAULT 'Completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES service(service_id) ON DELETE CASCADE,
  FOREIGN KEY (barber_id) REFERENCES barber(barber_id) ON DELETE SET NULL
);

-- Authentication table for users
CREATE TABLE IF NOT EXISTS auth_user (
  user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(45) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(45) NOT NULL CHECK (user_type IN ('CUSTOMER', 'BARBER', 'CASHIER', 'MANAGER')),
  related_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_customer_email ON customer(email);
CREATE INDEX idx_reservation_customer ON reservation(customer_id);
CREATE INDEX idx_reservation_barber ON reservation(barber_id);
CREATE INDEX idx_payment_reservation ON payment(reservation_id);
CREATE INDEX idx_guest_transaction_email ON guest_transaction(guest_email);
CREATE INDEX idx_auth_user_email ON auth_user(email);
