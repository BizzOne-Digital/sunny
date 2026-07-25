# DTdogs.ca Complete Rebuild Plan

## Database Collections Structure

### 1. **pages** (Page Content)
- Home page sections
- Our Vision sections
- Gallery page content
- Contact page content
- Policy page content
- Each page has multiple editable sections with headings, text, images

### 2. **services** (7 Services)
- Dog Walking
- Pet Grooming
- Pet Daycare
- Pet Boarding
- Nail Trim
- Behaviour Training
- Pet Dental Cleaning

### 3. **bundles** (Pricing Packages)
- 10 daycare/boarding packages
- Name, price, duration, features

### 4. **products** (Shop Items)
- Dog Dad Merch (coming soon)
- Dog Mom Merch (coming soon)
- Gift Card $150 (published)

### 5. **blogs** (10 Blog Posts)
- Title, content, featured image, inline images

### 6. **testimonials**
- Reviewer name, quote, rating, service, image

### 7. **team** (8 Team Members)
- Name, role, bio, credentials, image, Instagram

### 8. **faqs** (30+ Questions)
- Question, answer, category

### 9. **gallery** (Gallery Images)
- Image URL, title, alt, tags

### 10. **admins** (Admin Users)
- Email, password (hashed), role

## Admin Panel Structure

### Routes:
- `/admin/login` - Authentication
- `/admin/dashboard` - Overview
- `/admin/pages` - Edit all page content section by section
- `/admin/services` - Manage services
- `/admin/bundles` - Manage pricing packages
- `/admin/products` - Manage shop products
- `/admin/blogs` - Manage blog posts
- `/admin/testimonials` - Manage testimonials
- `/admin/team` - Manage team members
- `/admin/faqs` - Manage FAQs
- `/admin/gallery` - Manage gallery images

## Implementation Steps

1. ✅ Create database schema/models
2. ✅ Seed initial data from current site
3. ✅ Build API routes with authentication
4. ✅ Build admin panel UI
5. ✅ Rebuild frontend pages to fetch from database
6. ✅ Test admin → database → frontend flow
7. ✅ Keep all animations and styles intact

## Current Status
Starting implementation...
