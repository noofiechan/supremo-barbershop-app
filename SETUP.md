# Supremo Barbershop - Quick Setup Guide

## Step 1: Supabase Project Setup

1. Go to https://supabase.com and create a new project
2. Wait for the project to initialize (takes ~1-2 minutes)
3. Once ready, click on your project and go to **Settings > API**
4. Copy these two values and save them:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Create Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Paste the entire content from `scripts/01_create_schema.sql`
4. Click **Run** to execute the SQL

You should see success messages for all table creations.

## Step 3: Seed Initial Data (Optional but Recommended)

Create sample barbers, services, and employees:

```sql
-- Add a sample barber
INSERT INTO employee (emp_name, emp_lname, emp_type) 
VALUES ('John', 'Doe', 'BARBER');

INSERT INTO barber (barber_fname, barber_lname, emp_id) 
VALUES ('John', 'Doe', 1);

-- Add sample services
INSERT INTO service (service_name, service_category, service_description, price)
VALUES 
  ('Standard Haircut', 'Haircut', 'Professional haircut', 250),
  ('Hair Dyeing', 'Hairdyeing', 'Professional hair coloring', 500),
  ('Beard Trim', 'Shaving', 'Beard trimming and shaping', 150);

-- Add a cashier
INSERT INTO employee (emp_name, emp_lname, emp_type) 
VALUES ('Jane', 'Smith', 'CASHIER');

INSERT INTO cashier (cashier_fname, emp_id)
VALUES ('Jane', 2);

-- Add a manager
INSERT INTO employee (emp_name, emp_lname, emp_type) 
VALUES ('Mike', 'Johnson', 'MANAGER');

INSERT INTO manager (m_fname, emp_id)
VALUES ('Mike', 3);
```

Copy and run this in SQL Editor.

## Step 4: Environment Variables

1. In your v0 project, go to **Vars** in the left sidebar
2. Add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL: (paste your Supabase URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY: (paste your Supabase anon key)
JWT_SECRET: (use any secure string, e.g., "supremo-barbershop-2024-demo")
```

## Step 5: Install Dependencies

The system will automatically detect package.json changes and install dependencies. If not, you can run:

```bash
npm install
# or
pnpm install
```

## Step 6: Run Development Server

Click the **Run** button or:

```bash
npm run dev
```

The app will start at http://localhost:3000

---

## Test the App

### Test Guest Booking:
1. Go to http://localhost:3000
2. Click "Book as Guest"
3. Enter email, select haircut, date, time, barber
4. Complete checkout to see receipt

### Test Customer Login:
1. Go to Login page
2. Click "Register" tab
3. Create a new account with email/password
4. Auto-redirects to customer dashboard

### Test Employee Access:
1. You'll need to create auth_user records for employees
2. Example SQL:
```sql
INSERT INTO auth_user (email, password_hash, user_type, related_id)
VALUES ('barber@supremo.com', '$2a$10$...', 'BARBER', 1);
```

Note: The password_hash should be a bcrypt hash. For testing, use an online bcrypt generator.

---

## Common Issues

### "Supabase credentials not configured"
- Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in environment
- Verify the values are correct (should start with `https://` and be non-empty)

### "Service not found" or "Barber not found"
- Check that you ran the seed data SQL queries
- Verify data exists in Supabase tables via SQL Editor

### "Invalid credentials" on login
- Make sure auth_user exists with correct email
- Password must be hashed with bcrypt (2a algorithm)
- For development, you can modify the login logic temporarily

### Time slots not showing
- Check that your local timezone is set correctly
- Time slots are defined in `lib/constants.ts` - TIME_SLOTS array

---

## Making Changes

### Add a new haircut style:
Edit `lib/constants.ts`:
```typescript
export const HAIRCUT_OPTIONS = [
  // ... existing options
  {
    id: 'new-style',
    name: 'New Haircut Name',
    description: 'Description here',
  },
];
```

### Change service prices:
Edit `lib/constants.ts`:
```typescript
export const DEFAULT_PRICES = {
  haircut: 300,  // Changed from 250
  // ...
};
```

### Modify business hours:
Edit `lib/constants.ts`:
```typescript
export const BUSINESS_HOURS = {
  open: '10:00',  // Change open time
  close: '19:00', // Change close time
};
```

### Add new fields to customer registration:
1. Update database schema in Supabase
2. Update `Customer` interface in `lib/types.ts`
3. Update form in `app/login/page.tsx`
4. Update API route in `app/api/auth/register/route.ts`

---

## Production Deployment

Before deploying to production:

1. **Change JWT_SECRET**: Use a strong, randomly generated string
2. **Enable HTTPS**: All connections should be encrypted
3. **Setup CORS**: Configure Supabase CORS settings
4. **Use httpOnly cookies**: Replace localStorage with secure cookies
5. **Setup email service**: For receipt emails
6. **Database backups**: Configure Supabase automatic backups
7. **Rate limiting**: Add rate limiting to API routes

---

## Support

For issues:
1. Check browser console for error messages
2. Check Supabase logs for database errors
3. Verify all environment variables are set correctly
4. Ensure database schema was created successfully
5. Check that sample data exists in tables

Happy booking! 🎉
