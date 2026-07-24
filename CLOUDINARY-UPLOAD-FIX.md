# Cloudinary Upload Fix - 403 Error

## Problem (مسئلہ)
Image upload failing with error:
```
Failed to upload to Cloudinary. Server returned unexpected status code - 403 (403)
```

## Root Cause
Cloudinary API Key doesn't have proper permissions:
- Missing **upload** permissions
- Missing **read** permissions for Admin API

## Solution 1: Fix Cloudinary Permissions (Recommended)

### Step 1: Login to Cloudinary
Go to: https://console.cloudinary.com

### Step 2: Navigate to API Keys
- Click **Settings** (gear icon)
- Click **API Keys**
- Find your current API key: `275369625591224`

### Step 3: Check/Enable Permissions
Make sure these are enabled:
- ✅ **Upload API** - Required for uploading images
- ✅ **Admin API** - Required for reading account info
- ✅ **Enable unsigned uploading** (optional, for simpler uploads)

### Step 4: Regenerate Secret (if needed)
If permissions can't be changed:
1. Delete current API key
2. Create new API key with full permissions
3. Update `.env.local` with new key and secret

### Step 5: Update .env.local
```env
CLOUDINARY_CLOUD_NAME=dpp3nig3n
CLOUDINARY_API_KEY=your_new_key
CLOUDINARY_API_SECRET=your_new_secret
```

### Step 6: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Solution 2: Use Unsigned Upload (Temporary Workaround)

If you can't fix permissions right now, we can enable unsigned upload:

### Step 1: Enable in Cloudinary
1. Go to https://console.cloudinary.com/settings/upload
2. Find **Upload presets**
3. Create new preset:
   - Preset name: `dtdogs_unsigned`
   - Signing mode: **Unsigned**
   - Folder: `dtdogs`
   - Save

### Step 2: Get Preset Name
Copy the preset name (e.g., `dtdogs_unsigned`)

### Step 3: Update Code
Would need to modify `src/lib/cloudinary.ts` to use unsigned upload with preset.

---

## Solution 3: Alternative - ImgBB (Free Image Hosting)

If Cloudinary continues to have issues, can switch to ImgBB:

### ImgBB Setup
1. Sign up: https://imgbb.com/signup
2. Get API key: https://api.imgbb.com/
3. Update `.env.local`:
   ```env
   IMGBB_API_KEY=your_imgbb_key
   ```
4. Update upload code to use ImgBB API

---

## Quick Check: Is Cloudinary Configured?

Run test script:
```bash
node test-cloudinary.js
```

**Expected:**
```
✅ Cloudinary API is accessible!
✅ All tests passed!
```

**If you see 403:**
- API permissions issue
- Follow Solution 1

---

## Current Status

**Your Cloudinary Account:**
- Cloud Name: `dpp3nig3n` ✅
- API Key: `275369625591224` ✅
- API Secret: Configured ✅
- **Issue:** Missing permissions ❌

**Error Details:**
```
Request forbidden due to missing permissions (actions=["read"])
```

This means the API key can ping (connect) but cannot read account info or upload.

---

## Recommended Action

**Best fix:** Enable permissions in Cloudinary console

1. Login: https://console.cloudinary.com
2. Settings → API Keys
3. Find key ending in `...1224`
4. Enable ALL permissions:
   - Upload API
   - Admin API  
   - Transformation API
   - Search API
5. Save
6. Restart dev server
7. Try upload again

---

## Alternative: New Cloudinary Account

If current account has restrictions:

1. Create new FREE Cloudinary account
2. Get new credentials (will have full permissions by default)
3. Update `.env.local`
4. Restart server

Free tier includes:
- 25 GB storage
- 25 GB bandwidth/month  
- More than enough for this project

---

## Files for Reference

- **Upload API:** `src/app/api/media/route.ts`
- **Cloudinary helper:** `src/lib/cloudinary.ts`
- **Test script:** `test-cloudinary.js`
- **Environment:** `.env.local`

---

## Error Codes Explained

| Code | Meaning | Solution |
|------|---------|----------|
| 403 | Forbidden - No permission | Enable API permissions |
| 401 | Unauthorized - Wrong credentials | Check API key/secret |
| 400 | Bad request - Invalid data | Check upload format |
| 500 | Server error | Cloudinary service issue |

---

## Next Steps

1. ✅ Login to Cloudinary dashboard
2. ✅ Enable API permissions
3. ✅ Restart dev server
4. ✅ Try upload again
5. ✅ If still fails, create new Cloudinary account

---

**Contact Support:**
If you can't enable permissions, contact Cloudinary support with this message:

> "My API key (ending in ...1224) is getting 403 errors with message 'missing permissions (actions=[\"read\"])'. Please enable Upload API and Admin API permissions for my account."

---

**Status:** ⏳ Waiting for Cloudinary permissions fix
**Quick Fix:** Use unsigned upload preset OR create new account
