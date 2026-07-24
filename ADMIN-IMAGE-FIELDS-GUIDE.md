# Admin Panel - Image Fields Complete Guide

## All Image Fields in Admin Panel ✅

### Where to Add Cloudinary Image URLs

---

## 1. **Blog Posts** 📝

**Admin → Blog → Select Post**

### Featured Image
- **Featured Image Title** - Descriptive title
- **Featured Image URL (paste Cloudinary link)** ← Paste URL here
- **Featured Image Alt Text** - For accessibility

**Example:**
```
Title: "Boarding preparation guide cover"
URL: https://res.cloudinary.com/dpp3nig3n/image/upload/v1234567890/blog/boarding-guide.jpg
Alt: "Dog resting comfortably with pet care checklist nearby"
```

---

## 2. **Team Members** 👥

**Admin → Team → Select Member**

### Portrait Image
- **Portrait Title** - Member name or description
- **Portrait Image URL (paste Cloudinary link)** ← Paste URL here
- **Portrait Alt Text** - Professional description

**Example:**
```
Title: "Sarah Johnson portrait"
URL: https://res.cloudinary.com/dpp3nig3n/image/upload/v1234567890/team/sarah-johnson.jpg
Alt: "Sarah Johnson, Senior Pet Caregiver with 10 years experience"
```

---

## 3. **Products** 🛍️

**Admin → Products → Select Product**

### Product Images
Products have images added directly in database (currently Dog Mom/Dad merch have images).

To add/update product images, you need to:
1. Upload to Cloudinary
2. Use MongoDB Compass or script to update `images` array
3. Or edit via code

**Current Products with Images:**
- Dog Mom Merch - `/images/shop/shop-mom.webp`
- Dog Dad Merch - `/images/shop/shop-dad.webp`
- Gift Card - Uses hardcoded image

**Note:** Product images are more complex (array of ImageAsset objects). For now, managed via scripts or MongoDB directly.

---

## 4. **Media Library** 🖼️

**Admin → Media Library**

This is for bulk image management. You can:
- Upload images via Cloudinary directly
- Then use URLs in other collections

**Form Fields:**
- **File** - Upload button (may have errors, use Cloudinary instead)
- **Image title** - Descriptive title
- **Alt text** - Accessibility description
- **Caption** - Optional caption
- **Assigned page** - Which page it's for
- **Tags** - Comma separated (e.g., "dog-walking, portrait, hero")

**Workflow:**
1. Upload to Cloudinary first
2. Add metadata here for organization
3. Use URL in Blog/Team/etc.

---

## 5. **Pages** (Hero Images)

**Admin → Pages → Select Page**

Pages don't have image URL fields in admin panel currently. Hero images are:
- Managed via seed data in code
- Hardcoded in `site.tsx`
- Not editable from admin (by design)

**To change page hero images:**
1. Update files in `/public/images/`
2. Or update seed data in `src/lib/site.ts`

---

## Summary Table

| Collection | Image Field | Location | URL Format |
|------------|-------------|----------|------------|
| **Blog** | Featured Image URL | Admin → Blog | Cloudinary full URL |
| **Team** | Portrait Image URL | Admin → Team | Cloudinary full URL |
| **Products** | Images array | Via script/MongoDB | ImageAsset objects |
| **Media** | Upload/URL | Admin → Media Library | Any public URL |
| **Pages** | Hero images | Code only | Local /images/ path |

---

## Standard Workflow 🔄

### Every Time You Add an Image:

#### Step 1: Upload to Cloudinary
```
1. Go to https://console.cloudinary.com/media_library
2. Click "Upload"
3. Select image file
4. Wait for upload
5. Click uploaded image
6. Copy URL (looks like: https://res.cloudinary.com/dpp3nig3n/image/upload/v.../filename.jpg)
```

#### Step 2: Paste in Admin Panel
```
1. Go to Admin Panel
2. Navigate to: Blog / Team / etc.
3. Select item
4. Find "Image URL" field
5. Paste Cloudinary URL
6. Fill Alt Text (important for accessibility!)
7. Click Save
```

#### Step 3: Verify Frontend
```
1. Go to frontend page
2. Hard refresh: Ctrl + Shift + R
3. Check image displays
4. If not showing:
   - Restart dev server
   - Check browser console for errors
   - Verify URL is correct
```

---

## Image URL Format Requirements

### ✅ Valid URLs
```
https://res.cloudinary.com/dpp3nig3n/image/upload/v1784898184/folder/image.jpg
https://res.cloudinary.com/dpp3nig3n/image/upload/v1234567890/image.png
/images/local/image.webp
```

### ❌ Invalid URLs
```
cloudinary.com/image.jpg  (missing https://)
C:\Users\images\photo.jpg  (local file path)
image.jpg  (relative without /)
```

---

## Image Size Recommendations

### By Collection
- **Blog Featured:** 1200x800px (landscape, 3:2 ratio)
- **Team Portraits:** 600x800px (portrait, 3:4 ratio)
- **Products:** 1200x1200px (square, 1:1 ratio)
- **Page Heroes:** 1800x1200px (landscape, 3:2 ratio)

### File Size
- Keep under 500KB for web performance
- Cloudinary auto-optimizes
- WebP format recommended

---

## Alt Text Guidelines 📝

### Good Alt Text Examples
```
✅ "Golden retriever playing in Toronto park during autumn"
✅ "Pet caregiver Sarah Johnson with calm dog in boarding facility"
✅ "Dog Mom long-sleeve shirt in forest green color"
✅ "Boarding preparation checklist with dog resting nearby"
```

### Bad Alt Text Examples
```
❌ "Image"
❌ "Photo"
❌ "IMG_1234"
❌ "" (empty)
```

### Alt Text Rules
1. **Describe what you see** - Be specific
2. **Context matters** - Why is this image here?
3. **Keep it concise** - 1-2 sentences max
4. **No "image of" prefix** - Start with the subject
5. **Always fill it** - Never leave empty

---

## Troubleshooting Images 🔧

### Image Not Showing on Frontend

**1. Check URL is Saved**
- Go to MongoDB Compass
- Find the collection (blog, team, etc.)
- Verify URL field has correct value

**2. Check URL is Accessible**
- Copy URL
- Open in new browser tab
- Should display image directly

**3. Restart Dev Server**
```bash
Ctrl + C  (stop)
npm run dev  (restart)
```

**4. Hard Refresh Browser**
```
Ctrl + Shift + R
```

**5. Check Browser Console**
- Press F12
- Go to Console tab
- Look for image loading errors

### Common Errors

**"Failed to load image"**
- URL is wrong or broken
- Image deleted from Cloudinary
- Check URL directly in browser

**"403 Forbidden"**
- Cloudinary permissions issue
- Image is private
- Upload again with public preset

**"Mixed content"**
- Using HTTP instead of HTTPS
- Make sure URL starts with `https://`

**"CORS error"**
- Image host blocking requests
- Use Cloudinary (no CORS issues)

---

## Quick Reference Commands

### Check What's in Database
```bash
# Blog posts with images
node -e "const {MongoClient}=require('mongodb');const c=new MongoClient('mongodb://127.0.0.1:27017/dtdogs');c.connect().then(()=>c.db().collection('blogposts').find({},{title:1,featuredImage:1}).toArray()).then(r=>{console.log(JSON.stringify(r,null,2));c.close()})"

# Team members with images
node -e "const {MongoClient}=require('mongodb');const c=new MongoClient('mongodb://127.0.0.1:27017/dtdogs');c.connect().then(()=>c.db().collection('team').find({},{name:1,image:1}).toArray()).then(r=>{console.log(JSON.stringify(r,null,2));c.close()})"

# Products with images
node -e "const {MongoClient}=require('mongodb');const c=new MongoClient('mongodb://127.0.0.1:27017/dtdogs');c.connect().then(()=>c.db().collection('products').find({},{title:1,images:1}).toArray()).then(r=>{console.log(JSON.stringify(r,null,2));c.close()})"
```

### Verify Blog Image (detailed)
```bash
node check-blog-image.js
```

---

## Your Cloudinary Account

**Cloud Name:** `dpp3nig3n`
**Dashboard:** https://console.cloudinary.com
**Media Library:** https://console.cloudinary.com/media_library

---

## Image Collections Priority

### Most Used (Add Images Here First)
1. ✅ **Blog** - Featured images for blog posts
2. ✅ **Team** - Team member portraits
3. ⚠️ **Products** - Product photos (via script/MongoDB)

### Less Used (Optional)
4. **Media Library** - General organization
5. **Pages** - Currently code-managed

---

## Final Checklist ✓

Before marking image task as complete:

- [ ] Blog posts have featured images
- [ ] Team members have portraits
- [ ] Products have images (Dog Mom/Dad merch)
- [ ] All images have alt text
- [ ] Images load on frontend
- [ ] Dev server restarted
- [ ] Browser hard refreshed
- [ ] No console errors

---

**Status:** ✅ ALL IMAGE FIELDS DOCUMENTED
**Method:** Manual Cloudinary URL paste
**Collections:** Blog, Team, Products, Media Library
**Time per image:** ~30 seconds
