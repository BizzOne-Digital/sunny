# Admin Panel Se Content Kaise Edit Karein 📝

## Quick Start (فوری شروعات)

### Login Karna
1. Browser mein jao: `http://localhost:3000/admin`
2. Email: `admin@dtdogs.ca`
3. Password: `Admin@12345`
4. "Sign In" click karo

---

## Page Hero Edit Karna (صفحہ ہیرو)

### Step 1: Pages Section Kholo
Admin sidebar mein **"Pages"** click karo

### Step 2: Page Select Karo
List mein se page dhundo aur click karo:
- Home
- Our Vision
- Services
- Pricing (Bundle page)
- Gallery
- Testimonials
- FAQ
- Blog (The Paw Journal)
- Team

### Step 3: Hero Content Edit Karo

**Hero Eyebrow** - Chota label upar
- Example: "Trusted by pet parents across GTA"

**Hero Heading** - Bara title
- Example: "Real reviews belong here, carefully managed and approved"

**Hero Text** - Description body text
- Example: "Honesty is the Best Policy, feel free to share..."

**Button Text & Links**
- Primary Button: Label aur link (/booking, /contact, etc.)
- Secondary Button: Optional second button

### Step 4: Save Karo
1. Scroll down
2. **"Save"** button click karo
3. Wait for "Saved." message

### Step 5: Frontend Check Karo
1. Browser mein site kholo
2. **Hard refresh** karo: `Ctrl + Shift + R`
3. Changes dekho

---

## Individual Items Add/Edit Karna

### Services Edit Karna 🎯
**Admin → Services**

1. List mein se service select karo (Dog Walking, Grooming, etc.)
2. Edit karo:
   - Service Name
   - Small Label (eyebrow)
   - Card Summary (short)
   - Full Description (detailed)
   - Who It Is For
   - Price Label
   - Duration
   - Featured checkbox
   - Benefits (ek line per benefit)
   - What Is Included (ek line)
   - Service Process (steps)
   - Related Service Slugs
3. Save karo
4. Frontend refresh karo

**New Service Add Karna:**
- "Add item" button click karo
- Form fill karo
- Save karo

---

### Pricing Packages Edit Karna 💰
**Admin → Pricing**

1. Package select karo (30min Walk, 1hr Walk, etc.)
2. Edit karo:
   - Service name
   - Package Name
   - Price Label ("CAD $45", "Request Pricing", etc.)
   - Duration
   - Featured checkbox
   - Features list (ek line per feature)
3. Save karo
4. Frontend refresh karo

---

### Testimonials Edit Karna ⭐
**Admin → Testimonials**

1. Testimonial select karo ya "Add item" click karo
2. Fill karo:
   - **Reviewer Name** - Customer ka naam
   - **Pet Name** - Pet ka naam
   - **Service** - Konsi service use ki
   - **Rating** - 1-5 (stars)
   - **Quote** - Review text (kya kehna chahte hain)
   - **Location** - City, area
   - **Sample checkbox** - Agar sample testimonial hai
   - **Photo** - Reviewer/pet ki photo
     - Photo Title
     - Photo URL
     - Alt Text
3. Save karo
4. Frontend refresh karo

**Status:**
- "published" - Site pe dikhega
- "draft" - Abhi show nahi hoga

---

### FAQs Edit Karna ❓
**Admin → FAQs**

1. FAQ select karo ya "Add item" click karo
2. Fill karo:
   - **Question** - Sawaal
   - **Answer** - Jawab (detail mein)
   - **Category** - Type (General, Booking, Services, etc.)
   - **Related Service Slug** - Agar kisi service se related hai
   - **Display Order** - Number (sorting ke liye)
3. Save karo
4. Frontend refresh karo

---

### Blog Posts Edit Karna 📝
**Admin → Blog**

1. Post select karo ya "Add item" click karo
2. Fill karo:
   - **Post Title** - Blog post ka title
   - **Excerpt** - Short preview text
   - **Category** - Topic category
   - **Author** - Writer naam (default: DTdogs.ca)
   - **Publish Date** - Date select karo
   - **Post Body** - Main article content
   - **Featured Image**
     - Title
     - Image URL
     - Alt Text
3. Save karo
4. Frontend refresh karo

---

### Team Members Edit Karna 👥
**Admin → Team**

1. Team member select karo ya "Add item" click karo
2. Fill karo:
   - **Name** - Team member ka naam
   - **Role** - Position/job title
   - **Bio** - About them (experience, background)
   - **Credentials** - Qualifications, certifications (ek line per credential)
   - **Portrait Photo**
     - Title
     - Image URL
     - Alt Text
3. Save karo
4. Frontend refresh karo

---

### Products Edit Karna 🛍️
**Admin → Products**

1. Product select karo
2. Edit karo:
   - Title
   - Description
   - Price Label
   - Inventory count
   - Sizes (ek line: S, M, L, XL)
   - Colors (ek line: Black, White, etc.)
3. Save karo

---

## Media Library Use Karna 🖼️

### Image Upload Karna
**Admin → Media Library**

1. **Upload form fill karo:**
   - File select karo (image choose karo)
   - Image title
   - Alt text (accessibility ke liye zaroori)
   - Caption (optional)
   - Assigned page (home, about, services, etc.)
   - Tags (comma separated: dog-walking, portrait, hero)
   - Focal X/Y (optional, default 50)
2. **Upload** button click karo
3. Wait for success message
4. Image list mein dikhega

### Existing Image Edit Karna
1. Image pe click karo "pencil" icon
2. Details edit karo
3. Save karo

### Image Delete Karna
1. Image select karo
2. Delete button click karo
3. Confirm karo

**Note:** Media library images ko pages/services/products mein use kar sakte ho using URL

---

## Important Tips (اہم تجاویز)

### ✅ Do's
- **Always save** after editing
- **Hard refresh** frontend after changes (Ctrl+Shift+R)
- **Use descriptive slugs** for SEO (lowercase, hyphens)
- **Fill alt text** for ALL images (accessibility)
- **Set status** correctly (published/draft)
- **Test on frontend** after every change
- **Keep hero text concise** - Short aur clear

### ❌ Don'ts
- Don't change slug of existing pages (URLs break ho sakte hain)
- Don't delete items without backup
- Don't leave alt text empty
- Don't use special characters in slugs
- Don't forget to save
- Don't skip frontend testing

---

## Common Workflows (عام کام)

### 1. New Service Add Karna
```
Admin → Services → Add item
→ Fill all fields
→ Add benefits, includes, process
→ Save
→ Refresh frontend
→ Check /services page
```

### 2. Testimonial Approve Karna
```
Admin → Testimonials → Select testimonial
→ Review content
→ Set status: "published"
→ Save
→ Refresh /testimonials page
```

### 3. Blog Post Publish Karna
```
Admin → Blog → Select post
→ Write content
→ Add featured image
→ Set publish date
→ Status: "published"
→ Save
→ Refresh /blog page
```

### 4. Page Hero Update Karna
```
Admin → Pages → Select page
→ Edit hero heading/body
→ Update button labels
→ Save
→ Hard refresh page
```

---

## Troubleshooting (مسائل حل کرنا)

### Changes Nahi Dikh Rahe Frontend Pe
1. **Save kiya?** - Admin panel mein Save button click karo
2. **Hard refresh kiya?** - Ctrl+Shift+R press karo
3. **Status check karo** - "published" hona chahiye, "draft" nahi
4. **MongoDB running hai?** - Check `mongod` process
5. **Dev server restart** - Terminal mein stop karke `npm run dev` phir se

### Image Upload Nahi Ho Raha
1. File size check karo (too large?)
2. Format check karo (JPG, PNG, WebP)
3. Cloudinary configured hai? (Environment variables)
4. MongoDB connected hai?

### Admin Login Nahi Ho Raha
1. Credentials check karo: admin@dtdogs.ca / Admin@12345
2. MongoDB running hai?
3. Environment variables set hain? (.env.local)

### Delete Button Kaam Nahi Kar Raha
1. Confirm dialog dikha? ("OK" click karo)
2. Item used somewhere else? (safe to delete check karo)
3. Browser console errors check karo

---

## Status Options

### Page/Item Status
- **published** ✅ - Live site pe visible
- **draft** 📝 - Hidden, work in progress
- **hidden** 🙈 - Not shown but saved (optional for some)

### When to Use What
- New content bana rahe ho → **draft**
- Content ready hai → **published**
- Temporarily hide karna → **draft** or **hidden**

---

## Content Best Practices

### Hero Sections
- **Title:** 6-12 words max
- **Body:** 2-3 sentences
- **Buttons:** Clear action words (Book Now, Learn More, Contact Us)

### Service Descriptions
- **Summary:** 1 sentence for card
- **Description:** 2-3 paragraphs detailed
- **Benefits:** 4-6 bullet points
- **Process:** 3-5 steps

### Testimonials
- **Quote:** 2-4 sentences
- **Include:** Reviewer name, pet name, service
- **Photo:** Professional or natural happy photo
- **Rating:** Honest 1-5 stars

### FAQs
- **Question:** Clear, specific
- **Answer:** Complete but concise
- **Category:** Proper grouping

### Blog Posts
- **Title:** Catchy, SEO-friendly
- **Excerpt:** 1-2 sentences
- **Body:** Well-structured with paragraphs
- **Featured Image:** High quality, relevant

---

## Quick Reference

### Admin Panel URL
`http://localhost:3000/admin`

### Frontend URL
`http://localhost:3000`

### MongoDB Database
`mongodb://127.0.0.1:27017/dtdogs`

### Collections
- Pages → Hero sections
- Services → Individual services
- Pricing → Packages
- Testimonials → Reviews
- FAQs → Questions/Answers
- Blog → Blog posts
- Products → Shop items
- Team → Team members
- Media → Images

### Refresh Shortcut
`Ctrl + Shift + R` (hard refresh, clear cache)

---

## Need Help?

### Common Questions
1. **Kya main colors/fonts change kar sakta hun?** - Nahi, wo code level changes hain
2. **Images kahan store hote hain?** - Cloudinary pe (cloud storage)
3. **Kya backup hota hai?** - MongoDB mein save hai, but manual backup recommended
4. **New page add kar sakte hain?** - Haan, Pages mein "Add item" use karo
5. **Service order change kar sakte hain?** - Abhi nahi, code level hai

### Next Steps
- More training on specific features?
- Custom fields needed?
- Additional functionality?
- Design changes?

---

**Happy Editing! 🎉**

Agar koi question ho ya help chahiye to documentation files dekho:
- `COMPLETE-CMS-GUIDE.md`
- `ALL-PAGES-EDITABLE-SUMMARY.md`
- `TESTIMONIALS-FAQ-BLOG-TEAM-EDITABLE.md`
