# 🚀 Supremo Barbershop - START HERE

## Welcome! Your barbershop system is ready to go.

This document will get you up and running in minutes.

---

## 📋 Quick Checklist (5 Minutes)

### Step 1: Get Supabase Credentials (2 min)
- [ ] Go to https://supabase.com
- [ ] Create new project (free tier is fine)
- [ ] Wait for project to initialize (~1-2 minutes)
- [ ] Go to **Settings → API**
- [ ] Copy **Project URL** 
- [ ] Copy **Anon public key**
- [ ] Save these somewhere safe

### Step 2: Setup Database (1 min)
- [ ] In your Supabase project, open **SQL Editor**
- [ ] Click **New Query**
- [ ] Open file: `scripts/01_create_schema.sql`
- [ ] Copy entire contents
- [ ] Paste into SQL editor
- [ ] Click **Run**
- [ ] Wait for success messages (should see 15+ tables created)

### Step 3: Environment Variables (1 min)
- [ ] Create file `.env.local` in project root
- [ ] Add these 3 lines:
```
NEXT_PUBLIC_SUPABASE_URL=<paste your project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste your anon key>
JWT_SECRET=supremo-demo-2024
```
- [ ] Save file

### Step 4: Run Application (1 min)
- [ ] Run: `npm install`
- [ ] Run: `npm run dev`
- [ ] Open: http://localhost:3000
- [ ] You should see the Supremo Barbershop homepage

---

## ✅ First Test - Guest Booking

After the app loads:

1. Click **"Book as Guest"** button
2. Fill out the form:
   - Email: `test@email.com`
   - Select any haircut style
3. Click **Continue**
4. Select any service, date, and time
5. Click **Continue**
6. Select a barber
7. Click **Continue**
8. Review and click **Complete Booking**
9. 🎉 You should see the receipt page
10. Click **Download Receipt (PDF)** - it should download

**If this works, your system is fully functional!**

---

## 📚 Documentation Files

Read these in order:

| Priority | File | Read Time | Purpose |
|----------|------|-----------|---------|
| ⭐⭐⭐ | `QUICK_START.md` | 5 min | Fast setup checklist |
| ⭐⭐⭐ | `SETUP.md` | 10 min | Detailed setup + help |
| ⭐⭐ | `VISUAL_GUIDE.md` | 5 min | See how app looks |
| ⭐⭐ | `FILE_STRUCTURE.md` | 10 min | Understand code layout |
| ⭐ | `README.md` | 15 min | Complete documentation |
| ⭐ | `BUILD_SUMMARY.md` | 10 min | What was built |

**Start with:** `QUICK_START.md` if you're in a hurry!

---

## 🧪 Optional: Add Test Data

After basic setup works, you can add test data:

1. In Supabase, go to **SQL Editor → New Query**
2. Open file: `scripts/02_seed_data.sql`
3. Copy entire contents
4. Paste into SQL editor
5. Click **Run**

Now you have test accounts:
- **Barber**: barber@supremo.com / password123
- **Cashier**: cashier@supremo.com / password123
- **Manager**: manager@supremo.com / password123
- **Customer**: customer1@supremo.com / password123

Try logging in with any of these!

---

## 🛠️ First Customization

### Change Haircut Options
1. Open: `lib/constants.ts`
2. Find: `HAIRCUT_OPTIONS` (around line 2)
3. Edit the array to add/remove haircuts
4. Save file (app auto-reloads)

### Change Prices
1. Open: `lib/constants.ts`
2. Find: `DEFAULT_PRICES` (around line 20)
3. Change numbers:
   ```typescript
   export const DEFAULT_PRICES = {
     haircut: 250,      // ← Change this number
     hairdyeing: 500,   // ← Change this number
     shaving: 150,      // ← Change this number
   };
   ```
4. Save file

### Change Business Hours
1. Open: `lib/constants.ts`
2. Find: `BUSINESS_HOURS` (around line 30)
3. Change times:
   ```typescript
   export const BUSINESS_HOURS = {
     open: '09:00',     // ← Change open time
     close: '18:00',    // ← Change close time
   };
   ```
4. Save file

---

## 🎯 Test All Features

### Guest Booking ✓
- [ ] Go to `/guest/book`
- [ ] Complete 4-step booking
- [ ] Download receipt

### Customer Account ✓
- [ ] Go to `/login`
- [ ] Click "Register"
- [ ] Create new account
- [ ] See customer dashboard

### Employee Login (if you ran seed data) ✓
- [ ] Go to `/login`
- [ ] Use: barber@supremo.com / password123
- [ ] See barber dashboard
- [ ] Logout and try cashier@supremo.com
- [ ] See cashier dashboard

### Mobile Responsiveness ✓
- [ ] Resize browser to mobile size
- [ ] All layouts should be responsive

---

## 🚨 If Something Doesn't Work

### "Supabase credentials not configured"
1. Check `.env.local` file exists in project root
2. Check values are NOT empty (not just `=`)
3. Check URL starts with `https://`
4. Restart dev server: `npm run dev`

### "Service not found" or "Barber not found"
1. You probably haven't run the seed data script
2. Run `scripts/02_seed_data.sql` in Supabase SQL Editor
3. Reload the page

### "Invalid credentials" on login
1. Make sure you ran `scripts/02_seed_data.sql`
2. Use email: customer1@supremo.com, password: password123
3. OR create a new account via registration

### "Database error" messages
1. Go to Supabase SQL Editor
2. Run: `SELECT * FROM service;`
3. You should see at least one service listed
4. If empty, you need to run `scripts/02_seed_data.sql`

### Port 3000 already in use
```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

### Need more help?
1. Check `SETUP.md` - has detailed troubleshooting
2. Check browser console (Press F12)
3. Check Supabase logs
4. Re-read this checklist

---

## 📁 Project Files Overview

```
Your Project Has:

Scripts (SQL):
- scripts/01_create_schema.sql    (database setup)
- scripts/02_seed_data.sql        (test data)

Code Files:
- app/page.tsx                    (home page)
- app/login/page.tsx              (login/register)
- app/guest/book/page.tsx         (guest booking)
- app/receipt/page.tsx            (receipt)
- app/customer/dashboard/page.tsx
- app/barber/dashboard/page.tsx
- app/cashier/dashboard/page.tsx
- app/manager/dashboard/page.tsx

Logic:
- lib/types.ts                    (data types)
- lib/constants.ts                (settings)
- lib/supabase.ts                 (database)
- lib/auth.ts                     (passwords/tokens)
- lib/receipt.ts                  (PDF generation)

Documentation:
- README.md                       (complete docs)
- QUICK_START.md                  (fast setup)
- SETUP.md                        (detailed help)
- FILE_STRUCTURE.md               (code explanation)
- VISUAL_GUIDE.md                 (how app looks)
- BUILD_SUMMARY.md                (what was built)
- IMPLEMENTATION_COMPLETE.md      (summary)
```

---

## 🎓 Next Steps

### Immediate (Today)
1. ✅ Complete 4-step checklist above
2. ✅ Test guest booking flow
3. ✅ Try creating a customer account

### Short Term (This Week)
1. Run seed data to add test employees
2. Test all role dashboards
3. Customize haircut options & prices
4. Take screenshots/demos

### Medium Term (This Month)
1. Add more barbers/services to database
2. Customize colors/branding
3. Deploy to GitHub
4. Deploy to Vercel for live preview

### Long Term (Future)
1. Add email notifications
2. Setup SMS reminders
3. Add customer reviews
4. Deploy to production

---

## 💡 Pro Tips

1. **Bookmark Supabase**: You'll need to access it often
2. **Keep credentials safe**: Don't commit `.env.local` to GitHub
3. **Test locally first**: Before deploying
4. **Check browser console**: F12 shows errors
5. **Read the comments**: Code has helpful comments
6. **Keep docs handy**: You'll reference them often

---

## 🔒 Security Reminder

⚠️ Before production:

- [ ] Change `JWT_SECRET` to random value
- [ ] Don't commit `.env.local` to GitHub
- [ ] Setup email service for notifications
- [ ] Setup HTTPS
- [ ] Configure database backups
- [ ] Add rate limiting to API
- [ ] Use httpOnly cookies (not localStorage)

---

## 📞 Quick Reference

**Main Pages:**
- Home: http://localhost:3000
- Guest Book: http://localhost:3000/guest/book
- Login: http://localhost:3000/login

**Files to Modify:**
- Settings: `lib/constants.ts`
- Colors: Component `.tsx` files
- Database: Supabase SQL Editor

**Key Commands:**
```bash
npm install           # Install dependencies
npm run dev           # Start development server
npm run build         # Build for production
npm start             # Start production server
```

---

## 🎉 You're Ready!

Your Supremo Barbershop system is complete and ready to use.

### What You Have:
✅ Complete booking system
✅ Multiple role dashboards
✅ Transaction management
✅ PDF receipts
✅ Responsive design
✅ Well-organized code
✅ Full documentation

### What You Can Do:
✅ Book appointments (guest & customer)
✅ Manage schedules (barber view)
✅ Track transactions (cashier view)
✅ View analytics (manager view)
✅ Customize everything

---

## 🚀 Get Started Now!

1. ✅ Follow the 4-step checklist above
2. ✅ Test guest booking
3. ✅ Read QUICK_START.md for more details
4. ✅ Customize as needed
5. ✅ Start using!

**Questions?** Check `SETUP.md` - it has detailed help!

**Happy coding!** ✨

---

Last Updated: January 2024
System: Supremo Barbershop v1.0
