# Supremo Barbershop - File Structure Guide

## Complete Project Layout

```
supremo-barbershop/
│
├── README.md                          # Main documentation
├── SETUP.md                           # Quick setup instructions
├── FILE_STRUCTURE.md                  # This file
├── .env.example                       # Environment variables template
├── .env.local                         # (Create this with your values)
├── package.json                       # Dependencies
├── next.config.mjs                    # Next.js config
├── tsconfig.json                      # TypeScript config
├── tailwind.config.ts                 # Tailwind CSS config
│
├── scripts/
│   └── 01_create_schema.sql           # Database schema & tables
│
├── lib/
│   ├── types.ts                       # TypeScript interfaces (Employee, Customer, Reservation, etc.)
│   ├── constants.ts                   # App constants (haircuts, prices, routes, time slots)
│   ├── supabase.ts                    # Supabase client & database helpers
│   ├── auth.ts                        # Authentication (password hash, JWT, sessions)
│   ├── receipt.ts                     # PDF receipt generation
│   └── utils.ts                       # (shadcn default utility)
│
├── components/
│   ├── ui/                            # (shadcn UI components - auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── ... (other shadcn components)
│   │
│   ├── layout/
│   │   ├── header.tsx                 # Navigation header
│   │   └── main-layout.tsx            # Wrapper layout for all pages
│   │
│   └── booking/
│       ├── haircut-selector.tsx       # 5 presets + custom haircut selector
│       ├── datetime-picker.tsx        # Date & time slot picker
│       └── barber-selector.tsx        # Barber selection component
│
├── app/
│   ├── layout.tsx                     # Root layout (Next.js auto)
│   ├── globals.css                    # Global styles (shadcn default)
│   ├── page.tsx                       # Home page (/)
│   │
│   ├── login/
│   │   └── page.tsx                   # Login/Register page (/login)
│   │
│   ├── guest/
│   │   └── book/
│   │       └── page.tsx               # 4-step guest booking (/guest/book)
│   │
│   ├── receipt/
│   │   └── page.tsx                   # Receipt display & PDF download (/receipt)
│   │
│   ├── customer/
│   │   └── dashboard/
│   │       └── page.tsx               # Customer appointments (/customer/dashboard)
│   │
│   ├── barber/
│   │   └── dashboard/
│   │       └── page.tsx               # Barber daily schedule (/barber/dashboard)
│   │
│   ├── cashier/
│   │   └── dashboard/
│   │       └── page.tsx               # Transaction management (/cashier/dashboard)
│   │
│   ├── manager/
│   │   └── dashboard/
│   │       └── page.tsx               # System overview & analytics (/manager/dashboard)
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts           # POST /api/auth/login
│       │   └── register/
│       │       └── route.ts           # POST /api/auth/register
│       │
│       ├── reservations/
│       │   └── create/
│       │       └── route.ts           # POST /api/reservations/create
│       │
│       ├── payments/
│       │   └── process/
│       │       └── route.ts           # POST /api/payments/process
│       │
│       └── guest/
│           └── checkout/
│               └── route.ts           # POST /api/guest/checkout
│
├── public/                            # Static files (images, icons, etc.)
│   └── (add images here)
│
└── .gitignore                         # Git ignore file
```

## File Purposes & Dependencies

### Core Configuration Files
| File | Purpose |
|------|---------|
| package.json | NPM dependencies & scripts |
| tsconfig.json | TypeScript configuration |
| next.config.mjs | Next.js build config |
| tailwind.config.ts | Tailwind CSS theme & plugins |

### Library Files (lib/)
| File | Purpose |
|------|---------|
| types.ts | TypeScript types for all entities |
| constants.ts | Haircuts, prices, routes, time slots |
| supabase.ts | Supabase client initialization & query helpers |
| auth.ts | Password hashing, JWT tokens, session management |
| receipt.ts | PDF generation for receipts |

### Layout Components (components/layout/)
| File | Purpose |
|------|---------|
| header.tsx | Navigation bar with logout |
| main-layout.tsx | Wraps all pages with header |

### Booking Components (components/booking/)
| File | Purpose |
|------|---------|
| haircut-selector.tsx | 5 preset + custom haircut picker with image upload |
| datetime-picker.tsx | Date & time slot selection |
| barber-selector.tsx | List of available barbers |

### Pages (app/)
| File | Purpose | Access |
|------|---------|--------|
| page.tsx | Home/landing page | Public |
| login/page.tsx | Login & registration | Public |
| guest/book/page.tsx | 4-step guest booking flow | Public |
| receipt/page.tsx | Receipt display & PDF download | After checkout |
| customer/dashboard/page.tsx | Appointments & history | Customers only |
| barber/dashboard/page.tsx | Daily schedule | Barbers only |
| cashier/dashboard/page.tsx | Transaction reports | Cashiers only |
| manager/dashboard/page.tsx | System overview | Managers only |

### API Routes (app/api/)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/auth/login | POST | Authenticate user (customer/employee) |
| /api/auth/register | POST | Register new customer |
| /api/reservations/create | POST | Create booking |
| /api/payments/process | POST | Process payment for reservation |
| /api/guest/checkout | POST | Complete guest checkout |

## Data Flow

### Guest Booking Flow
```
guest/book/page.tsx
    ↓
HaircutSelector → DateTimePicker → BarberSelector → Confirmation
    ↓
/api/guest/checkout (POST)
    ↓
db.createGuestTransaction()
    ↓
receipt/page.tsx + PDF download
```

### Customer Registration & Login
```
login/page.tsx
    ↓
/api/auth/register or /api/auth/login (POST)
    ↓
db.createAuthUser() or db.getAuthUser()
    ↓
generateToken() + setSessionInStorage()
    ↓
Redirect to dashboard
```

### Booking & Payment Flow
```
booking/page.tsx
    ↓
/api/reservations/create (POST)
    ↓
db.createReservation()
    ↓
/api/payments/process (POST)
    ↓
db.createPayment()
    ↓
receipt/page.tsx
```

## Database Schema Overview

### Core Tables
- **employee** - Staff info (barbers, cashiers, managers)
- **customer** - Customer profiles
- **auth_user** - Login credentials

### Service Management
- **service** - Available services (haircut, dyeing, etc.)
- **service_category** - Service types
- **custom_haircut** - User-uploaded styles

### Booking & Transactions
- **reservation** - Bookings (can link to customer or guest)
- **payment** - Payment records for reservations
- **guest_transaction** - Walk-in/guest checkout records

## Easy Modification Points

### 1. Add New Haircut Style
📄 File: `lib/constants.ts`
```typescript
HAIRCUT_OPTIONS.push({
  id: 'new-id',
  name: 'New Style Name',
  description: 'Description'
});
```

### 2. Change Service Prices
📄 File: `lib/constants.ts`
```typescript
export const DEFAULT_PRICES = {
  haircut: 300,      // ← Change this
  hairdyeing: 600,   // ← Change this
  shaving: 200,      // ← Change this
};
```

### 3. Modify Business Hours
📄 File: `lib/constants.ts`
```typescript
export const BUSINESS_HOURS = {
  open: '10:00',     // ← Change open time
  close: '19:00',    // ← Change close time
};
```

### 4. Add Fields to Booking
1. Update `HAIRCUT_OPTIONS` in `lib/constants.ts`
2. Update form in `components/booking/haircut-selector.tsx`
3. Update API route in `app/api/guest/checkout/route.ts`
4. Update database schema to include new fields

### 5. Customize UI Colors
📄 Files: `app/globals.css` or component Tailwind classes
- All colors use Tailwind CSS classes
- Change `bg-blue-500` to any Tailwind color
- Modify theme in `tailwind.config.ts` for global changes

### 6. Add New Employee Role
1. Update `EmployeeType` in `lib/types.ts`
2. Create new dashboard at `app/[role]/dashboard/page.tsx`
3. Update `ROUTES` in `lib/constants.ts`
4. Update login redirect logic in `app/login/page.tsx`

## API Response Format

All API responses follow this format:
```typescript
{
  success: boolean,
  data?: T,           // Response data if successful
  error?: string,     // Error message if failed
  message?: string    // Optional success message
}
```

## Session Management

Sessions are stored in localStorage:
```typescript
// Save session
setSessionInStorage(sessionUser);
localStorage.setItem('supremo_auth_token', token);

// Get session
const session = getSessionFromStorage();

// Clear session
clearSession();
```

Note: For production, use httpOnly cookies instead!

## Image/File Uploads

Currently, custom haircut images are:
1. Captured as File objects in components
2. Passed to API routes
3. Stored reference in database

To implement S3/Blob storage:
1. Update form to upload to Vercel Blob
2. Store URL in `custom_haircut.custom_picture_url`
3. Display in receipt

## Testing Credentials

After running setup SQL:
```
Email: barber@supremo.com
Password: (use bcrypt hash of your choice)
Type: BARBER

Email: cashier@supremo.com
Password: (use bcrypt hash of your choice)
Type: CASHIER

Email: manager@supremo.com
Password: (use bcrypt hash of your choice)
Type: MANAGER
```

---

That's it! Each file is modular and independent. Happy coding! 🎉
