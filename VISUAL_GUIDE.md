# Supremo Barbershop - Visual Guide & Flows

## 🏠 Application Structure

```
┌─────────────────────────────────────────────────────────┐
│                   SUPREMO BARBERSHOP                    │
│              Minimalist Barbershop System                │
└─────────────────────────────────────────────────────────┘

                    MAIN ENTRY POINT
                         │
            ┌────────────┼────────────┐
            │            │            │
        LOGIN         GUEST          HOME
        PAGE          BOOKING        PAGE
            │            │            │
    ┌───────┴──────┐     │     ┌──────┴─────────┐
    │              │     │     │                │
REGISTER      LOGIN      │  BOOK          VIEW
CUSTOMER   CUSTOMER      │  SERVICE       INFO
    │              │     │     │                │
    │              └─────┼─────┴────────┐      │
    │                    │              │      │
    └─────────────┬──────┴──────────────┴──────┘
                  │
         ┌────────┴────────┐
         │                 │
      CHECKOUT         PAYMENT
      (Guest/Customer)  PROCESS
         │                 │
         └────────┬────────┘
                  │
            RECEIPT PAGE
            (PDF Download)
```

---

## 👥 User Role Structure

```
┌──────────────────────────────────────────────────────────┐
│                      USER TYPES                          │
└──────────────────────────────────────────────────────────┘

  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐
  │   GUEST     │  │  CUSTOMER    │  │   EMPLOYEE     │
  └─────────────┘  └──────────────┘  └────────────────┘
         │               │                    │
    BOOK & PAY      LOGIN/REGISTER       LOGIN
         │               │                    │
         │          VIEW DASHBOARD       ROLE CHECK
         │               │                    │
         │               │            ┌───────┼───────┐
         │               │            │       │       │
         │               │         BARBER CASHIER MANAGER
         │               │            │       │       │
         └───────┬───────┴────────────┼───────┼───────┘
                 │                    │       │       │
            RECEIPT              SCHEDULE  TRANS   OVERVIEW
```

---

## 🔄 Guest Booking Flow

```
┌─────────────────────────────────────────────────────────┐
│              GUEST BOOKING FLOW (4 STEPS)               │
└─────────────────────────────────────────────────────────┘

STEP 1: Enter Info & Select Haircut
  ┌────────────────────────────────┐
  │ Email Input                    │
  │ [email@example.com]            │
  │                                │
  │ Haircut Selection:             │
  │ ○ High Fade Buzz Cut           │
  │ ○ Combover with Taper Fade     │
  │ ○ Mid Fade                     │
  │ ○ Crop Top                     │
  │ ○ Side Part                    │
  │ ○ Custom (Image Upload)        │
  │                                │
  │ [CONTINUE]                     │
  └────────────────────────────────┘

                    ↓

STEP 2: Select Service, Date & Time
  ┌────────────────────────────────┐
  │ Services:                      │
  │ ○ Standard Haircut (₱250)      │
  │ ○ Hair Dyeing (₱500)           │
  │ ○ Beard Trim (₱150)            │
  │                                │
  │ Date: [▼ Date Picker]          │
  │ Time: [09:00] [09:30] [10:00]  │
  │       [10:30] [11:00] [11:30]  │
  │       ... more time slots ...  │
  │                                │
  │ [BACK] [CONTINUE]              │
  └────────────────────────────────┘

                    ↓

STEP 3: Select Barber
  ┌────────────────────────────────┐
  │ Available Barbers:             │
  │ ○ John Doe                     │
  │ ○ Carlos Santos                │
  │ ○ Antonio Rivera               │
  │                                │
  │ [BACK] [CONTINUE]              │
  └────────────────────────────────┘

                    ↓

STEP 4: Confirm & Checkout
  ┌────────────────────────────────┐
  │ BOOKING SUMMARY                │
  │                                │
  │ Email: john@email.com          │
  │ Haircut: Mid Fade              │
  │ Service: Haircut               │
  │ Date & Time: 2024-01-20 14:30  │
  │ Barber: Carlos Santos          │
  │ ─────────────────────          │
  │ Total: ₱250 (Cash)             │
  │                                │
  │ [BACK] [COMPLETE BOOKING]      │
  └────────────────────────────────┘

                    ↓

RECEIPT PAGE
  ┌────────────────────────────────┐
  │ ✓ BOOKING CONFIRMED            │
  │                                │
  │ Receipt #: RCP-20240120-123456 │
  │ Email: john@email.com          │
  │ Service: Haircut (₱250)        │
  │ Barber: Carlos Santos          │
  │ Date: 2024-01-20               │
  │ Time: 14:30                    │
  │ Payment: Cash                  │
  │                                │
  │ [DOWNLOAD PDF] [HOME]          │
  └────────────────────────────────┘
```

---

## 👤 Customer Account Flow

```
┌─────────────────────────────────────────────────────────┐
│           CUSTOMER REGISTRATION & LOGIN                 │
└─────────────────────────────────────────────────────────┘

LOGIN PAGE (TOGGLE: Login/Register)

  LOGIN TAB:
  ┌────────────────────────────────┐
  │ Email:    [______________]     │
  │ Password: [______________]     │
  │                                │
  │ [SIGN IN]                      │
  │                                │
  │ Don't have an account?         │
  │ [Register]                     │
  │                                │
  │ [CONTINUE AS GUEST]            │
  └────────────────────────────────┘

  REGISTER TAB:
  ┌────────────────────────────────┐
  │ First Name: [______________]   │
  │ Last Name:  [______________]   │
  │ Phone:      [______________]   │
  │ Email:      [______________]   │
  │ Password:   [______________]   │
  │                                │
  │ [CREATE ACCOUNT]               │
  │                                │
  │ Already have an account?       │
  │ [Sign In]                      │
  │                                │
  │ [CONTINUE AS GUEST]            │
  └────────────────────────────────┘

                    ↓

        AUTO-REDIRECT TO:
        CUSTOMER DASHBOARD
```

---

## 📊 Customer Dashboard

```
┌──────────────────────────────────────────────────────┐
│           CUSTOMER DASHBOARD                         │
│  Welcome, john.delacruz@email.com                   │
│  Manage your appointments and bookings              │
├──────────────────────────────────────────────────────┤
│ [NEW BOOKING] [VIEW PROFILE] [PAYMENT HISTORY]      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  MY APPOINTMENTS                    5 total         │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 2024-01-20  14:30                            │   │
│  │ Standard Haircut                             │   │
│  │ Status: CONFIRMED     Payment: PAID          │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 2024-01-21  10:00                            │   │
│  │ Hair Dyeing                                  │   │
│  │ Status: PENDING       Payment: UNPAID        │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [More appointments...]                             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 💼 Barber Dashboard

```
┌──────────────────────────────────────────────────────┐
│           BARBER DASHBOARD                           │
│  Daily Schedule View                                │
├──────────────────────────────────────────────────────┤
│  Select Date: [2024-01-20 ▼]                        │
│                                                      │
│  Schedule for 2024-01-20          3 appointments    │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 09:00 AM - HIGH FADE                         │   │
│  │ Customer: Juan Dela Cruz                     │   │
│  │ Status: CONFIRMED                            │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 10:30 AM - STANDARD HAIRCUT                  │   │
│  │ Customer: Maria Lopez                        │   │
│  │ Status: COMPLETED                            │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 14:00 PM - BEARD TRIM                        │   │
│  │ Customer: Guest                              │   │
│  │ Status: CONFIRMED                            │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 💰 Cashier Dashboard

```
┌──────────────────────────────────────────────────────┐
│           CASHIER DASHBOARD                          │
│  Transaction Management                             │
├──────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│ │Today's   │ │ Total    │ │Overall   │              │
│ │Total     │ │Trans.    │ │ Total    │              │
│ │₱1,250    │ │5         │ │₱5,600    │              │
│ └──────────┘ └──────────┘ └──────────┘              │
│                                                      │
│  RECENT TRANSACTIONS                    25 total    │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ RCP-20240120-1234567890  │ 2024-01-20 14:30    │ │
│  │ john@email.com            │ ₱250     COMPLETED  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ RCP-20240119-1234567891  │ 2024-01-19 10:00    │ │
│  │ maria@email.com           │ ₱500     COMPLETED  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [More transactions...]                             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 👨‍💼 Manager Dashboard

```
┌──────────────────────────────────────────────────────┐
│           MANAGER DASHBOARD                          │
│  Overview & System Management                       │
├──────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐   │
│ │Today's  │ │Total    │ │Total     │ │Active    │   │
│ │Revenue  │ │Revenue  │ │Reserv.  │ │Barbers   │   │
│ │₱1,250   │ │₱25,300  │ │47       │ │3        │   │
│ └─────────┘ └─────────┘ └──────────┘ └──────────┘   │
│                                                      │
│ [OVERVIEW] [APPOINTMENTS] [BARBERS] [TRANSACTIONS] │
│                                                      │
│  OVERVIEW TAB:                                       │
│  ┌────────────────────────────────┐                │
│  │ System Status                  │                │
│  │ Reservations Today: 12         │                │
│  │ Available Barbers: 3           │                │
│  │ Pending Payments: 2            │                │
│  └────────────────────────────────┘                │
│                                                      │
│  BARBERS TAB:                                        │
│  ┌────────────────────────────────┐                │
│  │ John Doe (ID: 1)               │                │
│  │ Carlos Santos (ID: 2)          │                │
│  │ Antonio Rivera (ID: 3)         │                │
│  └────────────────────────────────┘                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Design

```
Desktop (1024px+)
┌─────────────────────────────────────┐
│ HEADER                              │
├─────────────────────────────────────┤
│ SIDEBAR  │       MAIN CONTENT       │
│          │                         │
│          │                         │
└─────────────────────────────────────┘

Tablet (768px - 1023px)
┌─────────────────────────────────┐
│ HEADER                          │
├─────────────────────────────────┤
│    MAIN CONTENT                 │
│    (Stacked Layout)             │
└─────────────────────────────────┘

Mobile (320px - 767px)
┌─────────────────┐
│ HEADER/MENU     │
├─────────────────┤
│ MAIN CONTENT    │
│ (Full Width)    │
│                 │
│ (Scrollable)    │
├─────────────────┤
│ FOOTER          │
└─────────────────┘
```

---

## 🗄️ Database Relationships

```
┌──────────────┐          ┌──────────────┐
│  EMPLOYEE    │──┬───────│  MANAGER     │
├──────────────┤  │       ├──────────────┤
│ emp_id (PK)  │  │       │ manager_id   │
│ emp_type     │  │       │ emp_id (FK)  │
│ emp_name     │  │       └──────────────┘
│ emp_lname    │  │
└──────────────┘  │       ┌──────────────┐
                  ├───────│  BARBER      │
                  │       ├──────────────┤
                  │       │ barber_id    │
                  │       │ emp_id (FK)  │
                  │       │ manager_id   │
                  │       └──────────────┘
                  │
                  └───────┌──────────────┐
                          │  CASHIER     │
                          ├──────────────┤
                          │ cashier_id   │
                          │ emp_id (FK)  │
                          └──────────────┘

┌──────────────┐      ┌──────────────┐
│  CUSTOMER    │      │  RESERVATION │
├──────────────┤      ├──────────────┤
│ customer_id  │──┐   │ reservation  │
│ email        │  └───┤ customer_id  │
│ fname        │      │ barber_id    │
│ lname        │      │ service_id   │
└──────────────┘      │ date/time    │
                      └──────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  SERVICE     │──┐   │  PAYMENT     │──┐   │  BARBER      │
├──────────────┤  ├───┤ (FK)         │  └───┤ (FK)         │
│ service_id   │  │   │ reservation  │      └──────────────┘
│ name         │  │   │ amount_paid  │
│ category     │  │   │ receipt_num  │
│ price        │  │   └──────────────┘
└──────────────┘  │
                  │   ┌──────────────────┐
                  └───│ GUEST_TRANS      │
                      ├──────────────────┤
                      │ guest_email      │
                      │ amount_paid      │
                      │ receipt_number   │
                      └──────────────────┘
```

---

## 📋 Haircut Selection Options

```
5 PRESET OPTIONS:
├─ High Fade Buzz Cut
│  └─ Clean, short buzz cut with high fade sides
│
├─ Combover with Taper Fade
│  └─ Classic combover with taper fade on sides
│
├─ Mid Fade
│  └─ Balanced fade with medium length on top
│
├─ Crop Top
│  └─ Textured crop with faded sides
│
└─ Side Part
   └─ Professional side part with clean lines

CUSTOM OPTION:
└─ Upload your own design
   ├─ Name input
   ├─ Description
   └─ Reference picture (optional)
```

---

## 🕐 Time Slot System

```
┌────────────────────────────────┐
│  AVAILABLE TIME SLOTS          │
├────────────────────────────────┤
│ 09:00  10:00  11:00  12:00     │
│ 09:30  10:30  11:30  12:30     │
│ 13:00  14:00  15:00  16:00     │
│ 13:30  14:30  15:30  16:30     │
│ 17:00  17:30                    │
└────────────────────────────────┘

BUSINESS HOURS:
┌─────────────────────┐
│ Open:  09:00 AM     │
│ Close: 18:00 (6 PM) │
└─────────────────────┘
```

---

## 💳 Payment Receipt

```
┌────────────────────────────────┐
│    SUPREMO BARBERSHOP          │
│  Premium Barbering Services    │
├────────────────────────────────┤
│ Receipt #: RCP-20240120-123456 │
│ Date: 2024-01-20               │
│ Time: 14:30                    │
├────────────────────────────────┤
│ CUSTOMER INFORMATION           │
│ Name: John Dela Cruz           │
│ Email: john@email.com          │
├────────────────────────────────┤
│ SERVICE DETAILS                │
│ Service: Standard Haircut      │
│ Category: Haircut              │
│ Barber: Carlos Santos          │
├────────────────────────────────┤
│ Amount:           ₱250.00      │
│ ─────────────────────────      │
│ TOTAL:            ₱250.00      │
├────────────────────────────────┤
│ Payment Method: Cash           │
│ Status: Completed              │
├────────────────────────────────┤
│                                │
│ Thank you for visiting         │
│ Supremo Barbershop!            │
│ We appreciate your business.   │
│                                │
└────────────────────────────────┘
```

---

## ✅ Status Flow

```
RESERVATION STATUSES:
┌─────────┐      ┌───────────┐      ┌──────────┐
│ PENDING │─────→│ CONFIRMED │─────→│COMPLETED │
└─────────┘      └───────────┘      └──────────┘
                                          ↑
                                          │
                                   ┌──────┴──┐
                                   │          │
                              SUCCESSFUL     
                            APPOINTMENT

ALTERNATIVE:
┌─────────────────────────────────────┐
│ CANCELLED                           │
└─────────────────────────────────────┘

PAYMENT STATUSES:
┌────────┐              ┌──────┐
│ UNPAID │─────────────→│ PAID │
└────────┘              └──────┘
```

---

This visual guide helps understand the flow and structure of the entire application!
