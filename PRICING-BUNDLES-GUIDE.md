# ✅ Pricing/Bundle Page - Complete Guide

## Overview

Pricing page ab fully editable hai with **2 admin sections**:

1. **Pages → Pricing** - Hero section aur pricing section heading edit karo
2. **Pricing** - Individual pricing packages manage karo (add, edit, delete)

---

## Setup Instructions

### Step 1: Sync Pricing Page Data
```bash
node sync-pricing-page.js
```

Ye command:
- ✅ Pricing page hero section setup karega
- ✅ Pricing section heading setup karega
- ✅ Database mein data save karega

### Step 2: Verify Setup

#### Check Pages Section:
1. Admin: `http://localhost:3000/admin`
2. Click: **Pages** → **Pricing**
3. Dekho:
   - Hero section (eyebrow, title, body, CTAs)
   - Blocks → type "cards" (pricing section heading)

#### Check Pricing Section:
1. Admin panel mein
2. Click: **Pricing** (left menu)
3. Dekho: List of all pricing packages
4. Har package clickable hai for editing

---

## What's Editable

### 1. ✅ Hero Section (Pages → Pricing)

**Editable fields:**
- **Eyebrow:** "Dog Daycare, Boarding & Dog Walks"
- **Title:** "Clear packages for structured play, enrichment and overnight care."
- **Body:** "Choose pay-as-you-go daycare, overnight boarding..."
- **Primary CTA:** Button label & link
- **Secondary CTA:** Button label & link

**Example:**
- Change title to: "TEST Bundle Packages"
- Save Changes
- Refresh `/pricing` page
- ✅ Should show "TEST Bundle Packages"

---

### 2. ✅ Pricing Section Heading (Pages → Pricing → Blocks)

**Editable fields:**
- **Eyebrow:** "Dog daycare, boarding & dog walks"
- **Title:** "Choose your package"
- **Body:** Optional description text

**Example:**
- Blocks → Find type: "cards"
- Change title to: "TEST Choose Package"
- Save Changes
- Refresh `/pricing` page
- ✅ Should show "TEST Choose Package" above packages

---

### 3. ✅ Individual Pricing Packages (Pricing Section)

**Admin → Pricing section mein har package ko edit kar sakte ho:**

**Fields available:**
- **Name:** Package name (e.g., "5 Day Pass")
- **Service:** Related service slug
- **Price Label:** Price display (e.g., "$350")
- **Duration:** Optional duration text
- **Features:** Array of features (bullet points)
- **Featured:** Mark as "Popular" (checkbox)
- **Status:** published or hidden

**Example packages:**
1. **5 Day Pass** - $350
2. **10 Day Pass** - $650
3. **20 Day Pass** - $1,200

---

## How to Edit

### Edit Hero Section:
1. Admin → **Pages** → **Pricing**
2. Hero section mein:
   - **Eyebrow** edit karo
   - **Title** edit karo
   - **Body** paragraph edit karo
   - **Primary CTA** label/link edit karo
3. **Save Changes**
4. Refresh `/pricing` page
5. ✅ Changes visible

### Edit Pricing Section Heading:
1. Admin → **Pages** → **Pricing**
2. **Blocks** array mein:
   - Find block with `type: "cards"`
   - **Eyebrow** edit karo
   - **Title** edit karo
   - **Body** add karo (optional)
3. **Save Changes**
4. Refresh `/pricing` page
5. ✅ Changes visible

### Add New Pricing Package:
1. Admin → **Pricing**
2. Click: **Create New** (top button)
3. Fill fields:
   - Slug: `30-day-pass`
   - Name: `30 Day Pass`
   - Service: `daycare`
   - Price Label: `$2,000`
   - Features: `["30 days of daycare", "Structured play", "Progress updates"]`
   - Featured: Check if popular
   - Status: `published`
4. **Save Changes**
5. Refresh `/pricing` page
6. ✅ New package visible

### Edit Existing Package:
1. Admin → **Pricing**
2. Click on any package (e.g., "5 Day Pass")
3. Edit any field:
   - Change name
   - Change price
   - Add/remove features
   - Toggle featured status
4. **Save Changes**
5. Refresh `/pricing` page
6. ✅ Changes visible

### Hide a Package:
1. Admin → **Pricing**
2. Click on package
3. **Status:** Change to `hidden`
4. **Save Changes**
5. Refresh `/pricing` page
6. ✅ Package no longer visible (but still in database)

### Delete a Package:
1. Admin → **Pricing**
2. Click on package
3. Click: **Delete** button (bottom)
4. Confirm deletion
5. Refresh `/pricing` page
6. ✅ Package removed completely

---

## Testing Guide

### Test 1: Hero Title
1. Admin → Pages → Pricing
2. Title: "TEST Pricing Title"
3. Save
4. Refresh `/pricing`
5. ✅ Should see "TEST Pricing Title"

### Test 2: Pricing Heading
1. Admin → Pages → Pricing → Blocks
2. Find type: "cards"
3. Title: "TEST Choose Your Bundle"
4. Save
5. Refresh `/pricing`
6. ✅ Should see "TEST Choose Your Bundle" above packages

### Test 3: Edit Package Price
1. Admin → Pricing
2. Click: "5 Day Pass"
3. Price Label: "$999"
4. Save
5. Refresh `/pricing`
6. ✅ Should show $999 on card

### Test 4: Add Feature
1. Admin → Pricing
2. Click any package
3. Features: Add new item `"TEST New Feature"`
4. Save
5. Refresh `/pricing`
6. ✅ Should show "TEST New Feature" in package card

### Test 5: Mark as Popular
1. Admin → Pricing
2. Click any package
3. Featured: Check the box
4. Save
5. Refresh `/pricing`
6. ✅ Package should have "Popular" badge

---

## Database Structure

### Pricing Page (pages collection):
```javascript
{
  slug: "pricing",
  title: "Bundle",
  
  // Hero Section
  hero: {
    eyebrow: "Dog Daycare, Boarding & Dog Walks",
    title: "Clear packages for structured play, enrichment and overnight care.",
    body: "Choose pay-as-you-go daycare...",
    primaryCta: { label: "Book Now", href: "/booking" },
    secondaryCta: { label: "Contact Us", href: "/contact" }
  },
  
  // Pricing Section Heading
  blocks: [
    {
      type: "cards",
      eyebrow: "Dog daycare, boarding & dog walks",
      title: "Choose your package",
      body: ""
    }
  ]
}
```

### Pricing Packages (pricing collection):
```javascript
{
  slug: "5-day-pass",
  service: "daycare",
  name: "5 Day Pass",
  priceLabel: "$350",
  duration: "5 Days",
  features: [
    "5 days of structured daycare",
    "Enrichment activities included",
    "Daily progress updates"
  ],
  featured: false,
  status: "published"
}
```

---

## Admin Panel Sections

### 1. Pages → Pricing
**Purpose:** Edit hero section and pricing section heading
**Fields:**
- Hero: eyebrow, title, body, CTAs
- Blocks → type "cards": eyebrow, title, body

### 2. Pricing (Separate Section)
**Purpose:** Manage individual pricing packages
**Actions:**
- ✅ Create new package
- ✅ Edit existing package
- ✅ Delete package
- ✅ Hide/show package
- ✅ Mark as featured

---

## Important Notes

1. **Two Different Sections:**
   - **Pages → Pricing**: Hero + heading only
   - **Pricing**: Individual packages

2. **Frontend Updates:**
   - Edit karne ke baad page refresh karo
   - Hard refresh: Ctrl+Shift+R

3. **Package Display:**
   - Only `status: "published"` packages show
   - `status: "hidden"` packages database mein hain but frontend pe nahi

4. **Featured Badge:**
   - `featured: true` wale packages pe "Popular" badge
   - Visual emphasis with coral ring

5. **Features Array:**
   - Har feature ek string
   - Frontend pe dot (.) se join hote hain
   - Example: `["Feature 1", "Feature 2"]` → "Feature 1. Feature 2."

---

## Files Modified

### 1. `src/components/site.tsx`
**Changes:**
- ✅ **PricingGrid:** Now accepts `page` prop
- ✅ Reads eyebrow, title, body from page blocks
- ✅ **ProductGrid:** Fixed image undefined error

### 2. `sync-pricing-page.js`
**New file** - Syncs pricing page with hero and heading

---

## Troubleshooting

### Q: Pricing page not loading?
**A:**
1. Run sync script: `node sync-pricing-page.js`
2. Restart dev server
3. Hard refresh browser

### Q: Hero changes not showing?
**A:**
1. Check Pages → Pricing saved properly
2. Hard refresh: Ctrl+Shift+R
3. Check MongoDB: `db.pages.findOne({ slug: "pricing" })`

### Q: Package changes not showing?
**A:**
1. Check Pricing section saved properly
2. Verify status is "published" not "hidden"
3. Hard refresh browser
4. Check MongoDB: `db.pricing.find()`

### Q: Admin panel not showing Pricing section?
**A:**
1. Check left menu for "Pricing"
2. Run: `node sync-full-content.js` to sync all data
3. Refresh admin panel

---

## Success Criteria ✅

All working properly:
- [x] Hero section editable (Pages → Pricing)
- [x] Pricing heading editable (Pages → Pricing → Blocks)
- [x] Individual packages manageable (Pricing section)
- [x] Can add new packages
- [x] Can edit existing packages
- [x] Can delete packages
- [x] Can hide/show packages
- [x] Can mark as featured
- [x] All changes reflect on frontend after refresh

---

## Summary

**Pricing page ab fully editable hai with 2 admin sections:**

### Pages → Pricing
- Hero section (eyebrow, title, body, CTAs)
- Pricing heading (eyebrow, title, body)

### Pricing (Separate Section)
- Add/Edit/Delete individual packages
- Each package: name, price, features, featured status
- Full CRUD operations

**Client ab complete pricing page control kar sakta hai!** 🎉
