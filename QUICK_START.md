# Supremo Barbershop - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Supabase Setup (2 min)
1. Go to https://supabase.com → Create new project
2. Wait for project to initialize
3. Go to **Settings > API** and copy:
   - **Project URL** 
   - **Anon public key**

### Step 2: Database Schema (1 min)
1. In Supabase, go to **SQL Editor** → **New Query**
2. Paste entire content from `scripts/01_create_schema.sql`
3. Click **Run**

### Step 3: Environment Variables (1 min)
Create `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
JWT_SECRET=supremo-demo-2024
```

### Step 4: Run App (1 min)
```bash
npm install
npm run dev
```

Visit http://localhost:3000

---

## 🎯 Test the App

### Guest Booking
1. Click "Book as Guest"
2. Enter: email, haircut style, date, time, barber
3. Complete checkout
4. Download receipt

### Customer Login
1. Click "Login" → Switch to "Register"
2. Create account (email + password)
3. Auto-redirects to dashboard

### Employee Login (Optional)
Run this in Supabase SQL Editor after seed data:
```sql
-- Already included in 02_seed_data.sql if you ran it
-- Login: manager@supremo.com / password123
```

---

## 📍 Key Pages

| Page | URL | Access |
|------|-----|--------|
| Home | `/` | Everyone |
| Guest Book | `/guest/book` | Everyone |
| Login | `/login` | Everyone |
| Receipt | `/receipt` | After checkout |
| Customer Dashboard | `/customer/dashboard` | Customers |
| Barber Dashboard | `/barber/dashboard` | Barbers |
| Cashier Dashboard | `/cashier/dashboard` | Cashiers |
| Manager Dashboard | `/manager/dashboard` | Managers |

---

## 🔧 Quick Customizations

### Change Haircut Options
📄 File: `lib/constants.ts`
```typescript
export const HAIRCUT_OPTIONS = [
  {
    id: 'my-cut',
    name: 'My Custom Haircut',
    description: 'Description here',
  },
  // ... add more
];
```

### Change Prices
📄 File: `lib/constants.ts`
```typescript
export const DEFAULT_PRICES = {
  haircut: 300,      // ← Change
  hairdyeing: 600,   // ← Change
  shaving: 200,      // ← Change
};
```

### Change Business Hours
📄 File: `lib/constants.ts`
```typescript
export const BUSINESS_HOURS = {
  open: '10:00',
  close: '19:00',
};
```

### Change Colors/Design
📄 Components files - Update Tailwind classes
```tsx
// Example: Change button color
<Button className="bg-blue-500">
  ↓
<Button className="bg-purple-500">
```

---

## 🧪 Optional: Add Test Data

Run in Supabase SQL Editor:
```sql
-- Copy entire content from scripts/02_seed_data.sql
-- This adds sample barbers, services, customers
```

Then use these test credentials:
- **Barber**: barber@supremo.com / password123
- **Cashier**: cashier@supremo.com / password123
- **Manager**: manager@supremo.com / password123
- **Customer**: customer1@supremo.com / password123

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `SETUP.md` | Detailed setup guide |
| `FILE_STRUCTURE.md` | Code organization |
| `BUILD_SUMMARY.md` | What was built |
| `.env.example` | Environment template |

---

## 🆘 Troubleshooting

### "Supabase credentials not configured"
- Check `.env.local` exists
- Verify `NEXT_PUBLIC_SUPABASE_URL` and key are correct
- They should start with `https://` and not be empty

### "Service not found"
- Run seed data SQL: `scripts/02_seed_data.sql`
- Or manually insert a service in Supabase

### "Invalid credentials"
- Make sure auth_user table has your email
- Password must be bcrypt hashed (use seed data for testing)

### "Time slots not showing"
- Check `TIME_SLOTS` in `lib/constants.ts`
- Verify date is today or future

### Port already in use
```bash
npm run dev -- -p 3001  # Use different port
```

---

## 🎨 Project Structure

```
app/
├── page.tsx                    # Home
├── login/page.tsx              # Login/Register
├── guest/book/page.tsx         # Guest booking
├── receipt/page.tsx            # Receipt
├── customer/dashboard/page.tsx # Customer dashboard
├── barber/dashboard/page.tsx   # Barber dashboard
├── cashier/dashboard/page.tsx  # Cashier dashboard
├── manager/dashboard/page.tsx  # Manager dashboard
└── api/                        # API routes

lib/
├── types.ts                    # Types
├── constants.ts                # Config
├── supabase.ts                 # Database
├── auth.ts                     # Authentication
└── receipt.ts                  # PDF generation

components/
├── layout/                     # Header & layout
└── booking/                    # Haircut, date, barber selectors

scripts/
├── 01_create_schema.sql        # Database schema
└── 02_seed_data.sql            # Test data
```

---

## 💡 Pro Tips

1. **Save credentials**: Keep your Supabase URL & key safe
2. **Test locally first**: Before deploying, test all flows
3. **Check logs**: Use browser console (F12) for errors
4. **Read setup guide**: `SETUP.md` has detailed troubleshooting
5. **Database backup**: Supabase auto-backs up your data
6. **Learn Tailwind**: All styling uses Tailwind CSS

---

## 🚀 Next Steps

After initial setup:

1. **Customize**: Change colors, prices, haircut options
2. **Add data**: Create employees, services, barbers
3. **Test flows**: Try guest booking, customer login
4. **Deploy**: Push to GitHub, deploy to Vercel
5. **Enhance**: Add features like email, SMS, reports

---

## 📞 Need Help?

1. Check `SETUP.md` for detailed troubleshooting
2. Review `FILE_STRUCTURE.md` to understand code
3. Check browser console for error messages
4. Look at Supabase logs for database errors
5. Verify database schema created successfully

---

## ✅ Checklist

Before using in production:

- [ ] Set real `JWT_SECRET` (not "demo-2024")
- [ ] Setup email notifications
- [ ] Configure Supabase security policies
- [ ] Test all user roles
- [ ] Backup database regularly
- [ ] Setup error monitoring
- [ ] Test on mobile devices
- [ ] Setup custom domain
- [ ] Enable HTTPS
- [ ] Add rate limiting

---

You're all set! 🎉

Start building by visiting http://localhost:3000
