# 🚀 Quick Blog Reference Card

## Status: 5/10 Blogs Complete ✅

---

## ⚡ Quick Links

### Test URLs:
```
Blog List:  http://localhost:3001/blog
Blog #1:    /blog/dog-boarding-vs-dog-sitting
Blog #2:    /blog/dog-stress-signs-15-signals
Blog #3:    /blog/dog-exercise-guide-age-breed-energy
Blog #4:    /blog/why-dogs-pull-leash-walking-techniques
Blog #5:    /blog/common-dog-behaviour-problems-decoded
```

### Add All Blogs:
```bash
node add-all-blogs.js
```

---

## 📸 Images Checklist

Save to: `public/images/blog/`

### Blog #1 (3 images):
- [ ] `blog-boarding-vs-sitting.webp` (1400x900)
- [ ] `blog-boarding-facility.webp` (1200x800)
- [ ] `blog-dog-sitting-home.webp` (1200x800)

### Blog #2 (1 image):
- [ ] `blog-dog-stress-signals.webp` (1400x900)

### Blog #3 (2 images):
- [ ] `blog-dog-exercise-guide.webp` (1400x900)
- [ ] `blog-exercise-energy-chart.webp` (1200x800)

### Blog #4 (1 image):
- [ ] `blog-leash-pulling-training.webp` (1400x900)

### Blog #5 (1 image):
- [ ] `blog-dog-behaviour-problems.webp` (1400x900)

**Total: 9 images needed**

---

## 📝 Blog Summary Table

| # | Title | Category | Date | Images |
|---|-------|----------|------|--------|
| 1 | Boarding vs Sitting | Care Tips | Jan 15 | 3 |
| 2 | Stress Signs | Behaviour | Jan 20 | 1 |
| 3 | Exercise Guide | Health | Jan 25 | 2 |
| 4 | Leash Pulling | Training | Jan 30 | 1 |
| 5 | Behaviour Problems | Behaviour | Feb 5 | 1 |
| **6-10** | **Waiting...** | **TBD** | **TBD** | **TBD** |

---

## 🔧 Scripts Available

- `add-blog-1.js` through `add-blog-5.js` - Individual blog scripts
- `add-all-blogs.js` - Run all at once
- `create-blog-placeholders.html` - Generate placeholder images

---

## ✅ Quick Verification

To verify blogs are working:

1. Visit: `http://localhost:3001/blog`
2. Should see 5 blog posts listed
3. Click each to verify content displays
4. Check featured images and inline images load
5. Verify related blogs section appears

---

## 🎯 Next Actions

**Immediate:**
- [ ] Add 9 images to `public/images/blog/`
- [ ] Test all 5 blog pages
- [ ] Hard refresh (Ctrl+Shift+R)

**Upcoming:**
- [ ] Get blogs 6-10 content
- [ ] Create scripts for remaining blogs
- [ ] Add images for blogs 6-10

---

## 🆘 Troubleshooting

**Blog not showing?**
- Check MongoDB: `db.blogposts.find()`
- Check status: should be "published"
- Hard refresh page (Ctrl+Shift+R)

**Images not loading?**
- Check file names match exactly
- Check files in `public/images/blog/`
- Check file extensions (.webp)

**Need to update a blog?**
- Edit the `add-blog-X.js` script
- Run: `node add-blog-X.js`
- Script will update existing blog

---

## 📞 Quick Reference

**MongoDB:** `mongodb://127.0.0.1:27017/dtdogs`
**Collection:** `blogposts`
**Author:** Sunny - Sunnyism.Pro
**Image Path:** `public/images/blog/`

---

**Progress: 50% Complete** 🎉
