# 🧪 Home Page Editing Test Guide

## Quick Test - 5 Minutes

Ye simple test karke verify karo ke home page fully editable hai.

### Test 1: Hero Title (1 min)
1. Admin panel kholo: `http://localhost:3000/admin`
2. Pages → Home
3. **Hero Title** field mein likho: `"Welcome to TEST"`
4. Save Changes click karo
5. Home page pe jao: `http://localhost:3000`
6. Hard refresh karo (Ctrl+Shift+R)
7. ✅ **Expected:** Hero mein "Welcome to TEST" dikhe (DTdogs.ca nahi)

### Test 2: Stats Card (1 min)
1. Admin → Pages → Home
2. Blocks array mein dhundo: `type: "stats"`
3. First item ka **title** change karo: `"Happy TEST Pets"`
4. Save Changes
5. Home page refresh karo
6. ✅ **Expected:** First stat card mein "Happy TEST Pets" dikhe

### Test 3: Our Vision Title (1 min)
1. Admin → Pages → Home
2. Blocks array mein dhundo: `type: "story"`
3. **Title** field change karo: `"TEST Vision Title"`
4. Save Changes
5. Home page refresh karo
6. ✅ **Expected:** Our Vision section mein "TEST Vision Title" dikhe

### Test 4: Services Section (1 min)
1. Admin → Pages → Home
2. Blocks array mein dhundo: `type: "cards"`
3. **Eyebrow** change karo: `"TEST Services"`
4. Save Changes
5. Home page refresh karo
6. ✅ **Expected:** Services section ke upar "TEST Services" dikhe

### Test 5: Process Step (1 min)
1. Admin → Pages → Home
2. Blocks array mein dhundo: `type: "process"`
3. First item ka **title** change karo: `"TEST Step 1"`
4. Save Changes
5. Home page refresh karo
6. ✅ **Expected:** First booking step mein "TEST Step 1" dikhe

---

## Complete Test - All Sections

### ✅ 1. Hero Section
**Fields to test:**
- [ ] eyebrow: Change to "TEST Eyebrow"
- [ ] title: Change to "Welcome to HELLO TEST"
- [ ] subtitle: Change to "TEST Subtitle"
- [ ] body: Change paragraph text

**How to verify:**
1. Save changes in admin
2. Refresh home page
3. Check hero section shows all changes

---

### ✅ 2. Stats Cards (4 cards)
**Fields to test:**
- [ ] Card 1 title: Change to "TEST Happy Pets"
- [ ] Card 1 body: Change description
- [ ] Card 2 title: Change to "TEST Pet Parents"
- [ ] Card 3 title: Change to "TEST Experience"
- [ ] Card 4 title: Change to "TEST Care"

**How to verify:**
1. Find block with `type: "stats"`
2. Edit items array
3. Save and refresh
4. All 4 cards should show TEST prefixes

---

### ✅ 3. Our Vision Section
**Fields to test:**
- [ ] eyebrow: Change to "TEST Vision"
- [ ] title: Change to "TEST Vision Title Here"
- [ ] body: Change paragraph

**How to verify:**
1. Find block with `type: "story"`
2. Edit eyebrow, title, body
3. Save and refresh
4. Vision section shows all changes

---

### ✅ 4. Services Preview
**Fields to test:**
- [ ] eyebrow: Change to "TEST Services"
- [ ] title: Change to "TEST Service Heading"
- [ ] body: Add description text (optional)

**How to verify:**
1. Find block with `type: "cards"`
2. Edit fields
3. Save and refresh
4. Services section shows changes

---

### ✅ 5. Why Choose Us (6 features)
**Fields to test:**
- [ ] eyebrow: Change to "TEST Why"
- [ ] title: Change to "TEST Why Choose Title"
- [ ] Feature 1: Change to "TEST Food safety"
- [ ] Feature 2: Change to "TEST Temperature"
- [ ] Feature 3: Change to "TEST First-aid"

**How to verify:**
1. Find block with `type: "features"`
2. Edit eyebrow, title, items
3. Save and refresh
4. All features show changes

---

### ✅ 6. How Booking Works (4 steps)
**Fields to test:**
- [ ] eyebrow: Change to "TEST Booking"
- [ ] title: Change to "TEST Booking Steps"
- [ ] Step 1 title: Change to "TEST Choose"
- [ ] Step 1 body: Change description
- [ ] Step 2 title: Change to "TEST Pick Date"

**How to verify:**
1. Find block with `type: "process"`
2. Edit eyebrow, title, items
3. Save and refresh
4. All steps show changes

---

### ✅ 7. Meet Founder
**Fields to test:**
- [ ] eyebrow: Change to "TEST Founder"
- [ ] title: Change to "TEST Meet Founder Name"
- [ ] body: Change paragraph

**How to verify:**
1. Find block with `type: "founder"`
2. Edit eyebrow, title, body
3. Save and refresh
4. Founder section shows changes

---

### ✅ 8. Gallery Preview
**Fields to test:**
- [ ] eyebrow: Change to "TEST Gallery"
- [ ] title: Change to "TEST Gallery Title"
- [ ] body: Add description (optional)
- [ ] primaryCta.label: Change to "TEST View Gallery"

**How to verify:**
1. Find block with `type: "gallery"`
2. Edit fields
3. Save and refresh
4. Gallery section shows changes
5. Button text shows "TEST View Gallery"

---

### ✅ 9. Shop Preview
**Fields to test:**
- [ ] eyebrow: Change to "TEST Shop"
- [ ] title: Change to "TEST Shop Title"
- [ ] body: Add description (optional)

**How to verify:**
1. Find block with `type: "shop"`
2. Edit fields
3. Save and refresh
4. Shop section shows changes

---

## Common Issues & Solutions

### Issue: Changes not showing
**Solutions:**
1. Hard refresh browser: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
2. Clear browser cache
3. Restart dev server:
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

### Issue: "Save Changes" doesn't work
**Solutions:**
1. Check browser console for errors
2. Check MongoDB connection
3. Verify admin authentication

### Issue: Section still showing old text
**Solutions:**
1. Check MongoDB Compass:
   ```
   Database: dtdogs
   Collection: pages
   Document: { slug: "home" }
   ```
2. Verify the block type matches
3. Check field names are correct

### Issue: Stats/Features not updating
**Solutions:**
1. Make sure items is an array: `items: [...]`
2. Each item must have required fields:
   - Stats: `{ title, body }`
   - Features: `{ title }`
   - Process: `{ title, body }`

---

## MongoDB Quick Check

Agar changes dikhai nahi de rahe, MongoDB mein manually check karo:

### Using MongoDB Compass:
1. Open MongoDB Compass
2. Connect to: `mongodb://127.0.0.1:27017`
3. Database: `dtdogs`
4. Collection: `pages`
5. Find document: `{ slug: "home" }`
6. Verify your changes are saved

### Using MongoDB Shell:
```javascript
use dtdogs
db.pages.findOne({ slug: "home" })

// Check specific field
db.pages.findOne({ slug: "home" }, { "hero.title": 1 })

// Check blocks
db.pages.findOne({ slug: "home" }, { blocks: 1 })
```

---

## Success Criteria ✅

Test pass hone ke liye:

1. ✅ Hero title **fully editable** (not just first 2 words)
2. ✅ All section headings update on frontend
3. ✅ All section paragraphs update on frontend
4. ✅ Stats cards update
5. ✅ Features list updates
6. ✅ Process steps update
7. ✅ Founder section updates
8. ✅ Gallery section updates
9. ✅ Shop section updates
10. ✅ Button labels update (where applicable)

---

## Report Results

Test karne ke baad results note karo:

```
TEST RESULTS
============
Date: ___________
Time: ___________

✅ Pass / ❌ Fail

[ ] Hero Title
[ ] Hero Body
[ ] Stats Cards
[ ] Our Vision
[ ] Services Section
[ ] Why Choose Us
[ ] How Booking Works
[ ] Meet Founder
[ ] Gallery Preview
[ ] Shop Preview

Notes:
_____________________________________
_____________________________________
_____________________________________
```

---

## Next Steps

All tests pass? 🎉

**Congratulations!** Home page ab fully editable hai!

Client ko ye bata sakte ho:
- Koi bhi text change kar sakte hain
- Sabhi headings aur paragraphs editable hain
- Lists aur items edit kar sakte hain
- Code touch karne ki zarurat nahi

**Failed tests?**
- Check "Common Issues & Solutions" section
- MongoDB data verify karo
- Dev server restart karo
- Hard refresh browser karo
