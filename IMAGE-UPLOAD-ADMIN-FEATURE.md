# Image Upload Feature in Admin Panel ✅

## Summary (خلاصہ)

Ab admin panel mein **direct image upload** functionality hai! URL paste karne ki zaroorat nahi.

### What's New
- ✅ Upload button har image field pe
- ✅ Real-time image preview
- ✅ Automatic Cloudinary upload
- ✅ Manual URL input bhi available (optional)
- ✅ Works for Testimonials, Team, Blog featured images

---

## Features

### 1. **Upload Button**
- Click "Upload Image" button
- Select image from computer
- Automatic upload to Cloudinary
- URL automatically fills in

### 2. **Image Preview**
- See uploaded image immediately
- 128x128px preview box
- Rounded corners, clean design

### 3. **Manual URL Option**
- Still can paste URL manually
- Useful for images already uploaded
- Type or paste URL in text field

### 4. **Upload Status**
- "Uploading..." message during upload
- "Uploaded!" on success
- Error messages if upload fails

---

## How It Works (کیسے کام کرتا ہے)

### For Admin Users

#### Step 1: Open Form
Go to admin panel and open any item with images:
- **Testimonials** → Photo Image URL
- **Team** → Portrait Image URL
- **Blog** → Featured Image URL

#### Step 2: Upload Image
1. Click **"Upload Image"** button (green with upload icon)
2. Choose image file from computer
3. Wait for "Uploading..." message
4. See "Uploaded!" when done
5. Image preview appears above button
6. URL field automatically filled

#### Step 3: Save
- Click Save button
- Image saved with item
- Frontend displays image

### Alternative: Manual URL
- Type or paste URL directly in text field
- No upload needed if image already exists
- URL updates preview

---

## Collections with Image Upload

### ✅ Testimonials
**Field:** Photo Image URL
- Upload customer/pet photos
- Preview shows before save
- Used on testimonials page

### ✅ Team Members
**Field:** Portrait Image URL
- Upload team member portraits
- Professional photos recommended
- Shows on team page

### ✅ Blog Posts
**Field:** Featured Image URL
- Upload blog post featured image
- Banner image for post
- Shows in post header and cards

### Future (Can Add)
- Services images
- Products images
- Page hero images
- Gallery images

---

## Technical Implementation

### New Field Type
```typescript
type FieldKind = "text" | "textarea" | "select" | "checkbox" | "number" | "date" | "list" | "image";
```

### ImageUploadField Component
```typescript
function ImageUploadField({ field, value }: { field: FieldConfig; value: string }) {
  // State management
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(value);
  const [status, setStatus] = useState("");

  // Upload handler
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create FormData and upload to /api/media
    // Updates currentUrl on success
  }

  // Renders:
  // - Hidden input with URL value (for form submission)
  // - Image preview (if URL exists)
  // - Upload button
  // - Manual URL input field
}
```

### Field Configuration
```typescript
{ 
  path: "image.url", 
  label: "Photo Image URL", 
  type: "image",  // ← Image upload field
  wide: true 
}
```

---

## API Integration

### Upload Endpoint
**URL:** `/api/media`
**Method:** POST
**Body:** FormData with:
- `file` - Image file
- `title` - Image title
- `alt` - Alt text

**Response:**
```json
{
  "message": "Uploaded",
  "storage": "cloudinary",
  "asset": {
    "id": "...",
    "url": "https://res.cloudinary.com/...",
    "title": "...",
    "alt": "..."
  }
}
```

### Process Flow
```
User clicks Upload
  ↓
Select file from computer
  ↓
ImageUploadField.handleUpload()
  ↓
POST /api/media (with FormData)
  ↓
Upload to Cloudinary
  ↓
Save to MongoDB media collection
  ↓
Return asset URL
  ↓
Update currentUrl state
  ↓
Show preview & fill hidden input
  ↓
User clicks Save button
  ↓
Form submits with image URL
```

---

## UI Components

### Upload Button
```tsx
<label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-bold text-white transition hover:bg-burgundy">
  <Upload className="h-4 w-4" />
  {uploading ? "Uploading..." : "Upload Image"}
  <input 
    type="file" 
    accept="image/*" 
    onChange={handleUpload} 
    disabled={uploading}
    className="hidden" 
  />
</label>
```

### Image Preview
```tsx
{currentUrl && (
  <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-forest/15">
    <Image src={currentUrl} alt="Preview" fill className="object-cover" />
  </div>
)}
```

### Manual URL Input
```tsx
<input 
  type="text" 
  value={currentUrl}
  onChange={(e) => setCurrentUrl(e.target.value)}
  placeholder="Or paste image URL"
  className="w-full rounded-2xl border border-forest/15 bg-cream px-4 py-2 text-sm"
/>
```

### Hidden Form Input
```tsx
<input type="hidden" name={field.path} value={currentUrl} />
```

---

## Files Modified

### `src/components/admin.tsx`
**Changes:**
1. Added `"image"` to `FieldKind` type
2. Created `ImageUploadField` component
3. Updated `AdminFormField` to handle image type
4. Updated field configs:
   - `testimonials` → `image.url` field
   - `team` → `image.url` field
   - `blog` → `featuredImage.url` field

---

## Usage Examples

### Example 1: Upload Testimonial Photo
```
Admin → Testimonials → Select testimonial
→ Scroll to "Photo Image URL"
→ Click "Upload Image"
→ Choose photo (happy-dog.jpg)
→ Wait for upload
→ See preview
→ Click Save
→ Done!
```

### Example 2: Upload Team Portrait
```
Admin → Team → Select team member
→ Find "Portrait Image URL"
→ Click "Upload Image"
→ Select portrait photo
→ Preview shows
→ Save
```

### Example 3: Manual URL (Already Uploaded)
```
Admin → Blog → Select post
→ "Featured Image URL" field
→ Paste URL: /images/blog/my-post.jpg
→ Preview shows
→ Save
```

---

## Image Guidelines

### Recommended Sizes
- **Testimonial photos:** 800x800px (square)
- **Team portraits:** 600x800px (portrait)
- **Blog featured:** 1200x800px (landscape)
- **Max file size:** 10MB

### Formats Supported
- ✅ JPG / JPEG
- ✅ PNG
- ✅ WebP (recommended for web)
- ✅ GIF
- ❌ SVG (not supported by Cloudinary API)

### Best Practices
1. **Compress images** before upload (smaller file size)
2. **Use descriptive alt text** (accessibility)
3. **WebP format** preferred (better compression)
4. **Landscape for banners**, portrait for profiles
5. **Test on frontend** after upload

---

## Error Handling

### Upload Fails
**Possible Causes:**
- File too large (>10MB)
- Invalid file type
- Cloudinary not configured
- Network error
- MongoDB connection issue

**Error Messages:**
- "Upload failed" - Generic error
- "Upload error" - Network/fetch error
- Check browser console for details

### Solutions
1. Check file size and type
2. Verify Cloudinary env variables in `.env.local`
3. Check MongoDB connection
4. Try smaller image
5. Check browser console

---

## Environment Setup

### Required Env Variables
```env
# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MongoDB (for saving metadata)
MONGODB_URI=mongodb://127.0.0.1:27017/dtdogs
```

### Cloudinary Setup
1. Sign up at cloudinary.com
2. Get Cloud Name, API Key, API Secret
3. Add to `.env.local`
4. Restart dev server

---

## Future Enhancements

### Potential Additions
1. **Multiple image upload** - Drag & drop multiple files
2. **Image cropping** - Crop before upload
3. **Media library picker** - Select from existing images
4. **Image compression** - Auto-compress on upload
5. **Alt text generator** - AI-generated alt text
6. **Image gallery view** - Grid of uploaded images
7. **Bulk operations** - Delete, edit multiple images

### Services & Products
Currently services and products don't have image upload UI:
- Can add same feature
- Would need array handling (multiple images)
- `type: "imageGallery"` for multiple images

---

## Comparison: Before vs After

### Before (Manual URL)
```
1. Upload image to Cloudinary separately
2. Copy URL from Cloudinary
3. Paste URL in admin panel
4. Fill title and alt text
5. Save
```
**Steps:** 5
**Time:** ~2-3 minutes
**User-friendly:** ❌ Not easy

### After (Upload Button)
```
1. Click "Upload Image"
2. Select file
3. Wait for upload (automatic)
4. Save
```
**Steps:** 3
**Time:** ~30 seconds
**User-friendly:** ✅ Much better!

---

## Admin Panel Screenshots Flow

### Step 1: Find Image Field
```
┌─────────────────────────────────┐
│ Photo Image URL                 │
│ ┌─────────────────────────────┐ │
│ │ [Upload Image] button       │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Or paste image URL          │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Step 2: After Upload
```
┌─────────────────────────────────┐
│ Photo Image URL                 │
│ ┌───────────┐                   │
│ │   [IMG]   │ ← Preview         │
│ │           │                   │
│ └───────────┘                   │
│ ┌─────────────────────────────┐ │
│ │ [Upload Image] Uploaded! ✓  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ https://cloudinary.com/...  │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## Troubleshooting

### Image Not Showing Preview
1. Check URL is valid
2. Try pasting URL manually
3. Check browser console errors
4. Verify Cloudinary CORS settings

### Upload Button Not Working
1. Check file type (must be image)
2. File size under 10MB
3. Cloudinary configured?
4. Network connection OK?

### Preview Shows But Save Fails
1. MongoDB connection issue
2. Check browser console
3. Form validation error?
4. Try refreshing page

---

## Developer Notes

### Adding Image Upload to Other Fields
1. Change field type to `"image"`:
   ```typescript
   { path: "myImage.url", label: "My Image", type: "image", wide: true }
   ```

2. Ensure nested structure has URL:
   ```typescript
   myImage: {
     title: "...",
     url: "",  // ← This is what image upload fills
     alt: "..."
   }
   ```

3. That's it! ImageUploadField handles the rest

### State Management
Component uses React `useState`:
- `uploading` - Boolean for upload in progress
- `currentUrl` - String for image URL
- `status` - String for status messages

### Form Integration
- Hidden `<input type="hidden" name={field.path} value={currentUrl} />`
- Form submission includes updated URL
- No special handling needed in formToRecord()

---

**Status:** ✅ COMPLETE
**Date:** 2026-07-24
**Feature:** Image upload in admin panel
**Collections:** Testimonials, Team, Blog
**User Impact:** Much easier image management!
