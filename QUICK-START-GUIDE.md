# DTdogs.ca - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start MongoDB
Make sure MongoDB is running on your machine at `mongodb://127.0.0.1:27017`

**Check if MongoDB is running:**
```bash
mongosh mongodb://127.0.0.1:27017/dtdogs
```

If not running, start MongoDB service based on your installation.

---

### Step 2: Start Development Server
```bash
npm run dev
```

The server will start on: **http://localhost:3001**

---

### Step 3: Access the Site
- **Frontend**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin/login

**Admin Credentials:**
- Email: `admin@dtdogs.ca`
- Password: `Admin@12345`

---

## 📋 Common Tasks

### Re-seed the Database
If you need to reset all data:
```bash
node seed-database.js
```

### Add Product Images
```bash
node add-product-images.js
```

### Seed Gallery Images
```bash
node seed-gallery.js
```

### Check Database Content
```bash
node test-products.js
node check-services.js
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: Make sure MongoDB is running on port 27017

### Issue: "Port 3001 already in use"
**Solution**: Kill the existing process or use a different port:
```bash
# Kill process on port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F

# Or change port in package.json
"dev": "next dev -p 3002"
```

### Issue: Page not updating after database changes
**Solution**: Hard refresh the browser
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Issue: Code changes not reflecting
**Solution**: Restart the development server
```bash
# Stop: Ctrl + C
# Start: npm run dev
```

---

## 📊 Current Database Content

| Collection | Count | What's Inside |
|-----------|-------|---------------|
| admins | 1 | Admin user for login |
| services | 7 | Dog Walking, Grooming, Daycare, etc. |
| bundles | 10 | Pricing packages |
| products | 3 | Gift Card, Dog Dad/Mom Merch |
| teams | 8 | Team member profiles |
| faqs | 34 | FAQ questions |
| galleries | 18 | Gallery images |
| blogs | 0 | Empty (ready for content) |
| testimonials | 0 | Empty (ready for reviews) |

---

## 🌐 Available Pages

### Working Pages:
- `/` - Home page
- `/services` - Services list
- `/pricing` - Pricing packages
- `/gallery` - Image gallery with 18 photos
- `/shop` - Products (3 items)
- `/team` - Team members (8 people)
- `/faq` - FAQs (34 questions)
- `/our-vision` - About page
- `/testimonials` - Testimonials page
- `/blog` - Blog page
- `/contact` - Contact page
- `/treats` - Treats page

### Admin Pages:
- `/admin/login` - Admin login
- `/admin` - Admin dashboard (if built)

---

## 📁 Important Files

### Configuration:
- `.env.local` - Environment variables (MongoDB, Cloudinary, Admin credentials)
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration

### Core Application:
- `src/app/page.tsx` - Home page
- `src/app/[slug]/page.tsx` - Dynamic pages (gallery, services, etc.)
- `src/components/site.tsx` - All UI components
- `src/lib/site.ts` - Data fetching functions

### Backend:
- `src/lib/db.ts` - MongoDB connection
- `src/lib/auth.ts` - JWT authentication
- `src/models/*.ts` - Database models (10 files)
- `src/app/api/**/*.ts` - API routes

### Database Scripts:
- `seed-database.js` - Main seeding script
- `add-product-images.js` - Add images to products
- `seed-gallery.js` - Seed gallery images
- `sync-admin-data.js` - Sync data to admin

---

## 🎯 What's Working

✅ **All Errors Fixed**
- No undefined image errors
- Gallery displays properly (18 images)
- Products show with images
- Team bios updated
- Service descriptions updated
- "Coming Soon" text removed
- MongoDB serialization fixed

✅ **Backend Complete**
- Database models created
- API routes working
- Authentication system ready
- Data seeded properly

✅ **Frontend Complete**
- All pages load without errors
- Responsive design working
- Navigation functional
- Image optimization working
- Animations smooth

---

## 🔐 API Endpoints

### Public Endpoints:
```
GET  /api/services          # Get all services
GET  /api/bundles           # Get pricing packages
GET  /api/products          # Get shop products
GET  /api/team              # Get team members
GET  /api/faqs              # Get FAQs
GET  /api/gallery           # Get gallery images
GET  /api/testimonials      # Get testimonials
GET  /api/blog              # Get blog posts
```

### Protected Endpoints (require JWT):
```
POST   /api/services        # Create service
PUT    /api/services/[id]   # Update service
DELETE /api/services/[id]   # Delete service

POST   /api/gallery         # Upload gallery image
PUT    /api/gallery/[id]    # Update gallery image
DELETE /api/gallery/[id]    # Delete gallery image

# Same pattern for other collections
```

### Authentication:
```
POST /api/auth/login        # Login (returns JWT cookie)
POST /api/auth/logout       # Logout (clears cookie)
```

---

## 📝 Next Steps (Optional)

### Content to Add:
1. **Blog Posts** - 10 blog posts (client to provide)
2. **Testimonials** - Customer reviews
3. **More Gallery Images** - Additional photos

### Features to Build:
1. **Admin Panel UI** - Full CMS interface
2. **Email Notifications** - Booking confirmations
3. **Payment Integration** - For gift cards
4. **Booking System** - Customer bookings

---

## 💡 Tips

### Development Tips:
1. Use `Ctrl + Shift + R` to hard refresh after DB changes
2. Restart dev server only for code changes
3. Check console for errors (F12 in browser)
4. MongoDB must run before starting dev server

### Database Tips:
1. Re-seed database to reset all data
2. Use scripts to add specific content
3. Check database with MongoDB Compass GUI
4. Use `mongosh` CLI for quick queries

### Cloudinary Tips:
1. Credentials already configured in `.env.local`
2. Use manual URL paste method for images
3. Upload button may need additional setup
4. Test image upload in admin panel

---

## 📞 Need Help?

### Documentation Files:
- `PROJECT-STATUS.md` - Complete project overview
- `FINAL-FIXES-SUMMARY.md` - Recent fixes
- `BACKEND-COMPLETE-SUMMARY.md` - Backend details
- `ADMIN-FIXES-SUMMARY.md` - Admin panel info

### Error Messages:
- Check browser console (F12)
- Check terminal output
- Check MongoDB connection
- Check `.env.local` configuration

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] Update `.env.local` for production
- [ ] Change `JWT_SECRET` to secure value
- [ ] Change `AUTH_SECRET` to secure value
- [ ] Set up production MongoDB
- [ ] Verify Cloudinary credentials
- [ ] Test all pages
- [ ] Test admin login
- [ ] Add SSL certificate
- [ ] Set up domain DNS
- [ ] Test image uploads
- [ ] Add Google Analytics (if needed)

---

**Quick Command Reference:**

```bash
# Start development
npm run dev

# Re-seed database
node seed-database.js

# Check MongoDB connection
mongosh mongodb://127.0.0.1:27017/dtdogs

# Build for production
npm run build

# Start production server
npm start
```

---

🐾 **Happy Coding!** 🐾

**Development URL**: http://localhost:3001
**Admin Login**: admin@dtdogs.ca / Admin@12345
