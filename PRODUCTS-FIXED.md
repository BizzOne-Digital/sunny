# Products Display Fixed ✅

## Issue
Products (Dog Dad & Dog Mom Merch) were not displaying on home page.

## Root Cause
Products had empty `images` array in database, and code was hiding products without images.

## Solution Applied

### 1. Added Placeholder Images to Display Logic
Updated `ShopPreview` component to show placeholder images for products without database images:

```javascript
const displayImage = primaryImage || {
  id: `placeholder-${product.slug}`,
  url: product.slug.includes('dad') ? '/images/shop/shop-dad.webp' : '/images/shop/shop-mom.webp',
  alt: product.title,
  title: product.title,
};
```

### 2. Added Images to Database
Created and ran `add-product-images.js` script to add images:

```bash
node add-product-images.js
```

**Results:**
- ✅ Dog Dad Merch: 1 image added (`/images/shop/shop-dad.webp`)
- ✅ Dog Mom Merch: 1 image added (`/images/shop/shop-mom.webp`)
- ✅ Gift Card: Already had image

## Current Database Status

```
Product: Dog Dad Merch
- Slug: dog-dad-merch
- Status: coming-soon
- Price: Coming Soon
- Images: 1 (/images/shop/shop-dad.webp)

Product: Dog Mom Merch
- Slug: dog-mom-merch
- Status: coming-soon
- Price: Coming Soon
- Images: 1 (/images/shop/shop-mom.webp)

Product: DTdogs Gift Card
- Slug: gift-card-150
- Status: published
- Price: $150
- Images: 1 (/images/shop/gift100.png)
```

## How to View

1. **Refresh browser** (Ctrl+Shift+R for hard refresh)
2. **Scroll down** to "Booking preview" section
3. You'll see:
   - **Heading**: "Dog Dad and Dog Mom merch — coming soon in 2026."
   - **Dog Dad Merch** card with image
   - **Dog Mom Merch** card with image

## Updating Product Images via API

When you want to add custom Cloudinary images:

```bash
PUT /api/products/dog-dad-merch
Content-Type: application/json
Cookie: admin_token=...

{
  "status": "published",
  "priceLabel": "$33",
  "images": [
    {
      "id": "dog-dad-front",
      "url": "https://res.cloudinary.com/dpp3nig3n/image/upload/v1/...",
      "alt": "Dog Dad long-sleeve shirt front view",
      "title": "Dog Dad Merch - Front",
      "order": 1
    },
    {
      "id": "dog-dad-back",
      "url": "https://res.cloudinary.com/dpp3nig3n/image/upload/v1/...",
      "alt": "Dog Dad long-sleeve shirt back view",
      "title": "Dog Dad Merch - Back",
      "order": 2
    }
  ]
}
```

## Testing Scripts Created

1. **`add-product-images.js`** - Adds default images to products
2. **`test-products.js`** - Lists all products with their image status

Run anytime to check status:
```bash
node test-products.js
```

---

**Products are now displaying with images!** ✅

If still not visible after hard refresh:
1. Check dev server is running (`npm run dev`)
2. Check console for any JavaScript errors
3. Try opening in incognito/private window
4. Check browser network tab to see if images are loading
