# DTdogs.ca - Complete Design System & Animation Guide

## 📋 Overview
This document provides a comprehensive breakdown of the DTdogs.ca website's visual design system, animations, interactions, and movement patterns. The site features a premium, modern aesthetic with sophisticated animations powered by Framer Motion.

---

## 🎨 Color Palette (Brand Colors)

### Primary Colors
```css
--color-forest: #3D634E     /* Primary brand green - used for headers, CTAs, trust elements */
--color-coral: #E89373      /* Primary accent - warm coral for highlights and CTAs */
--color-burgundy: #993333   /* Secondary accent - deep red for emphasis and gradients */
```

### Supporting Colors
```css
--color-cream: #F8F3EA      /* Background color - warm off-white */
--color-sage: #DCE7DF       /* Light green accent - subtle backgrounds */
--color-peach: #F8D5C5      /* Light coral - soft accents */
--color-beige: #EADBCB      /* Neutral warm tone */
--color-ink: #202522        /* Text color - deep charcoal/black */
--color-cloud: #FFFFFF      /* Pure white for cards and contrast */
```

### CSS Variables
```css
--background: #F8F3EA
--foreground: #202522
```

**Color Usage Philosophy:**
- Forest green = trust, nature, professionalism
- Coral/Peach = warmth, care, friendliness
- Burgundy = premium quality, emphasis
- Cream = calm, comfortable, clean backgrounds
- Ink = readable, professional text

---

## ✍️ Typography System

### Font Families
```css
--font-sans: Manrope (var(--font-manrope))
--font-serif: Fraunces (var(--font-fraunces))
```

**Typography Hierarchy:**
- **Headings**: Fraunces (serif) - elegant, warm, premium feel
- **Body text**: Manrope (sans-serif) - clean, modern, readable
- **Fallback**: Arial, Helvetica, sans-serif

**Font Usage Pattern:**
- Large hero headings: `font-serif text-4xl sm:text-5xl md:text-8xl italic`
- Section headings: `font-serif text-3xl lg:text-5xl`
- Eyebrows/labels: `text-xs sm:text-sm font-medium tracking-wide uppercase`
- Body copy: `text-base sm:text-lg` (Manrope by default)

---

## 🎬 Animation System (Framer Motion)

### 1. **Intro Sequence (IntroWrapper)**
First-time visitor experience with animated logo entrance and text reveal.

**Timeline:**
1. **Background gradient** animates (forest → burgundy → coral)
2. **Blob gradients** fade in and scale up (coral/burgundy orbs)
3. **Logo** bounces in with rotation: `scale(0) rotate(-12deg)` → `scale(1) rotate(0)`
4. **Tagline words** reveal one by one with 3D rotation effect:
   - Each word: `opacity: 0, y: 40px, rotateX: 60deg` → `opacity: 1, y: 0, rotateX: 0`
   - Staggered delay: `0.5s + (index * 0.12s)`
5. **Progress bar** sweeps across: `scaleX(0)` → `scaleX(1)` over 2.2s
6. **Subtitle** fades up: `opacity: 0, y: 12px` → `opacity: 1, y: 0`
7. **Exit curtain** swipes up after 3.4s: `y: 0` → `y: -100%` with custom easing `[0.77, 0, 0.175, 1]`

**Easing Curves:**
- Logo bounce: `[0.34, 1.56, 0.64, 1]` (elastic bounce)
- Text reveal: `[0.22, 1, 0.36, 1]` (smooth deceleration)
- Curtain exit: `[0.77, 0, 0.175, 1]` (dramatic swipe)

**Duration:** Total ~3.4 seconds
**Stored in:** `sessionStorage.dtdogs_intro_seen` (plays once per session)

---

### 2. **Page Transitions (PageTransition)**
Sliding curtain effect between page navigations.

```jsx
initial={{ scaleY: 1 }}
animate={{ scaleY: 0 }}
transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
```

- **Visual**: Forest-burgundy-coral gradient curtain slides down from top
- **Origin**: `origin-top` (scales from top edge)
- **Duration**: 0.7s
- **Easing**: Custom cubic-bezier `[0.77, 0, 0.175, 1]`
- **Trigger**: On `pathname` change via Next.js navigation

---

### 3. **Scroll-Based Animations**

#### Navigation Behavior
- **Transparent** state: Glass morphism with backdrop blur
- **Solid** state (after 18px scroll): Enhanced shadow and background opacity
- Transition: `duration-500` (0.5s smooth transition)

```jsx
const [solid, setSolid] = useState(false);
useEffect(() => {
  const onScroll = () => setSolid(window.scrollY > 18);
  window.addEventListener("scroll", onScroll);
}, []);
```

**Visual Changes:**
- Shadow: `0_12px_40px_rgba(32,37,34,0.12)` → `0_16px_48px_rgba(32,37,34,0.16)`
- Border: `border-white/70` maintains
- Background: `bg-white/95` with `backdrop-blur-xl`

---

### 4. **Reveal Animations (Scroll-Triggered)**
Content sections fade and slide in when scrolling into view.

**Pattern (assumed from common Framer Motion usage):**
```jsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
```

- **Initial state**: Hidden, translated down 40px
- **Trigger**: Element enters viewport (with -100px margin for early trigger)
- **Animation**: Fades in while sliding up
- **Duration**: ~0.6-0.8s typically
- **Once**: True (doesn't re-animate on scroll back up)

---

## 🖱️ Hover & Interaction Animations

### Button Hover Effects

#### 1. **Gradient Button (.btn-gradient)**
Primary call-to-action buttons with shine sweep on hover.

**Base State:**
```css
background: linear-gradient(135deg, #e89373 0%, #e07a55 50%, #d4735f 100%);
transition: transform 0.3s ease, box-shadow 0.3s ease;
```

**Hover State:**
```css
transform: translateY(-2px);
box-shadow: 0 10px 25px rgba(232, 147, 115, 0.4);
```

**Shine Sweep Animation:**
```css
@keyframes shine-sweep {
  from { transform: translateX(-130%) skewX(-18deg); }
  to { transform: translateX(240%) skewX(-18deg); }
}
/* Triggers on hover: animation: shine-sweep 0.9s ease */
```

- **Shine element**: 45% width white gradient overlay
- **Skew**: -18deg for dynamic diagonal sweep
- **Duration**: 0.9s
- **Visual**: Light sweeps from left to right across button

#### 2. **Link Hover**
Navigation and text links:
```css
transition: color 0.3s ease;
hover: text-coral or text-burgundy
```

---

## 🌊 Background Animations

### 1. **Hero Section Animations**

#### Ken Burns Effect (.hero-ken-burns)
Slow zoom and pan on hero background images for cinematic feel.

```css
@keyframes ken-burns {
  0% { transform: scale(1.08) translate3d(0, 0, 0); }
  50% { transform: scale(1.18) translate3d(-1.6%, -1.2%, 0); }
  100% { transform: scale(1.1) translate3d(1%, 0.6%, 0); }
}
animation: ken-burns 28s ease-in-out infinite alternate;
```

- **Duration**: 28 seconds
- **Direction**: Alternate (bounces back and forth)
- **Scale range**: 1.08× → 1.18× → 1.1×
- **Movement**: Subtle diagonal drift
- **Effect**: Professional, documentary-style slow motion

#### Light Sweep (.hero-light-sweep)
Animated light beam sweeping across hero sections.

```css
@keyframes hero-light-sweep {
  0% { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
  18% { opacity: 0.22; }
  42% { opacity: 0.08; }
  100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
}
animation: hero-light-sweep 9s ease-in-out 1.2s infinite;
```

- **Visual**: White/coral gradient light beam
- **Skew**: -18deg diagonal
- **Duration**: 9 seconds per sweep
- **Delay**: 1.2s initial delay
- **Opacity curve**: Fades in → peaks → fades out
- **Mobile**: 12s duration (slower on small screens)

#### Vignette Breathing (.hero-vignette)
Subtle pulsing dark overlay for depth and focus.

```css
@keyframes hero-vignette-breathe {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 0.78; }
}
animation: hero-vignette-breathe 8s ease-in-out infinite;
```

- **Duration**: 8 seconds
- **Effect**: Dark vignette pulses between 55% → 78% → 55% opacity
- **Purpose**: Draws eye to center, adds depth

#### Floating Orbs (.hero-orb, .hero-orb-delayed)
Decorative blurred gradient orbs that drift slowly.

```css
@keyframes hero-orb-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  33% { transform: translate3d(4%, -6%, 0) scale(1.08); }
  66% { transform: translate3d(-5%, 3%, 0) scale(0.94); }
}
/* .hero-orb: 14s duration */
/* .hero-orb-delayed: 18s duration, 2s delay, reverse direction */
```

- **Movement**: Figure-8 drift pattern with scale variation
- **Duration**: 14-18s per cycle
- **Visual**: Large blurred gradient circles (coral, burgundy, forest tones)
- **Purpose**: Abstract decorative motion background

---

### 2. **Gallery Filter Flow Animation**
Animated gradient background on gallery filter buttons.

```css
.gallery-filter-flow {
  background: linear-gradient(125deg,
    #ffc9a8 0%, #ffe3c4 18%, #fff4d8 36%,
    #d9f0e2 54%, #f7cbb8 72%, #ffe8d6 88%, #ffc9a8 100%
  );
  background-size: 280% 280%;
  animation: gradient-pan 12s ease infinite;
}
```

**Floating Orbs (::before and ::after):**
- **::before**: 18rem circle, top-left, coral tone, float 9s
- **::after**: 20rem circle, bottom-right, green tone, float 11s reverse
- **Blur**: 36px for soft glow effect

**Visual Effect:**
- Multi-color gradient constantly panning
- Floating blurred orbs drifting up and down
- Creates liquid, flowing appearance
- Elevation: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.65), 0 18px 50px rgba(232,147,115,0.18)`

---

### 3. **Gradient Pan Animation**
Used across multiple elements for dynamic color flow.

```css
@keyframes gradient-pan {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

**Applied to:**
- `.text-gradient`: Animated text color gradient (6s duration)
- `.text-gradient-forest`: Forest-burgundy-coral text gradient (7s duration)
- `.bg-gradient-animated`: Full background gradient (16s duration)
- `.gallery-filter-flow`: Filter button gradient (12s duration)

**Text Gradients:**
```css
.text-gradient {
  background-image: linear-gradient(110deg, 
    #e89373 10%, #f8d5c5 35%, #e89373 60%, #993333 90%);
  background-size: 220% auto;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-pan 6s ease-in-out infinite;
}
```

---

### 4. **Float Animations**
Gentle up-and-down floating motion for decorative elements.

```css
@keyframes float-y {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}

.animate-float { animation: float-y 6s ease-in-out infinite; }
.animate-float-delayed { animation: float-y 7.5s ease-in-out 1.4s infinite; }
```

- **Movement**: 16px vertical oscillation
- **Duration**: 6-7.5s per cycle
- **Easing**: ease-in-out (smooth acceleration/deceleration)
- **Use cases**: Floating product images, decorative paw prints, badges

---

### 5. **Glow Pulse Animation**
Pulsing shadow/glow effect for emphasis.

```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 10px 34px rgba(153, 51, 51, 0.35); }
  50% { box-shadow: 0 14px 48px rgba(232, 147, 115, 0.55); }
}
.animate-glow { animation: glow-pulse 3.2s ease-in-out infinite; }
```

- **Duration**: 3.2s
- **Effect**: Shadow pulses between burgundy and coral tones
- **Use**: Highlighting CTAs, featured cards, important elements

---

## 🧩 Component-Specific Behaviors

### Mobile Navigation Menu
**Trigger:** Hamburger menu button
**Animation Pattern:**
```jsx
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
```

- **Overlay**: Dark backdrop with blur
- **Menu panel**: Slides in with scale effect
- **Duration**: 0.2s quick response
- **Links**: Likely staggered fade-in for each item

---

### Booking Flow Multi-Step Form
**Expected behavior** (based on standard patterns):
- Step transitions with slide animations
- Progress bar that fills as steps complete
- Success checkmarks with scale bounce
- Form validation with shake/highlight on error

---

### Image Galleries
**Lightbox/Modal animations:**
- Modal backdrop fade: 0.3s
- Image scale in: `scale(0.9)` → `scale(1)`
- Close animation: Reverse scale out

---

## 🎭 Easing Curves Reference

### Standard Easings
- **ease**: Default browser cubic-bezier
- **ease-in-out**: Smooth acceleration and deceleration
- **ease-out**: Quick start, slow end (common for entrances)
- **ease-in**: Slow start, quick end (common for exits)

### Custom Cubic-Bezier Curves
```javascript
[0.77, 0, 0.175, 1]    // Dramatic swipe (page transitions, curtains)
[0.34, 1.56, 0.64, 1]  // Elastic bounce (logo entrance)
[0.22, 1, 0.36, 1]     // Smooth deceleration (text reveals)
```

**When to use:**
- **Dramatic transitions**: `[0.77, 0, 0.175, 1]`
- **Playful elements**: `[0.34, 1.56, 0.64, 1]`
- **Content reveals**: `[0.22, 1, 0.36, 1]`

---

## ⏱️ Timing Guidelines

### Duration Standards
- **Micro-interactions**: 0.15-0.3s (hover states, color changes)
- **UI transitions**: 0.3-0.6s (modals, dropdowns, reveals)
- **Page transitions**: 0.7-1.0s (route changes, major state changes)
- **Ambient animations**: 6-28s (background movements, gradients, Ken Burns)

### Performance Optimization
```css
will-change: transform; /* Only on animated elements */
```

**Properties that animate smoothly:**
- `transform: translate/scale/rotate` (GPU accelerated)
- `opacity` (GPU accelerated)

**Avoid animating:**
- `height/width` (causes reflow)
- `top/left` (use transform instead)
- `margin/padding` (causes reflow)

---

## ♿ Accessibility & Reduced Motion

### Prefers Reduced Motion
All animations respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**React Implementation:**
```jsx
const reducedMotion = useReducedMotion();
if (reducedMotion) return null; // Skip animation component
```

- Intro sequence skips entirely
- Page transitions instant
- All CSS animations effectively disabled
- Scroll behavior becomes instant

---

## 🖼️ Image Treatments

### Aspect Ratios
- **Hero images**: 16:9 or 3:2 ratio
- **Service cards**: 4:3 ratio
- **Team portraits**: 4:5 ratio (vertical)
- **Gallery**: Mix of 1:1, 4:3, 3:2

### Lazy Loading
```jsx
<Image loading="lazy" />
```
- All images except above-the-fold use lazy loading
- Hero images use `priority` flag

### Responsive Images
```jsx
sizes="(min-width: 1024px) 50vw, 100vw"
```
- Desktop: 50% viewport width
- Mobile: Full viewport width
- Next.js Image automatically generates srcset

---

## 🎨 Decorative Elements

### Tech Grid Background (.tech-grid)
```css
background-image:
  linear-gradient(rgba(61, 99, 78, 0.06) 1px, transparent 1px),
  linear-gradient(90deg, rgba(61, 99, 78, 0.06) 1px, transparent 1px);
background-size: 40px 40px;
```
- Subtle 40×40px grid pattern
- Forest green at 6% opacity
- Adds technical, structured feel

### Tech Panel (.tech-panel)
```css
border: 1px solid rgba(61, 99, 78, 0.12);
background:
  linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,243,234,0.88)),
  linear-gradient(120deg, rgba(232,147,115,0.08), transparent 40%, rgba(61,99,78,0.06));
box-shadow: 0 18px 50px rgba(32, 37, 34, 0.08);
```
- Glassmorphic cards with layered gradients
- Soft elevation shadow
- Premium modern aesthetic

---

## 📐 Layout & Spacing System

### Container Widths
```css
max-w-[1400px]  /* Main content container */
```

### Padding Scale
```css
px-2    /* 0.5rem = 8px */
px-3    /* 0.75rem = 12px */
px-4    /* 1rem = 16px */
px-5    /* 1.25rem = 20px */
px-6    /* 1.5rem = 24px */
```

### Responsive Breakpoints (Tailwind defaults)
```css
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

---

## 🔍 Focus States

### Outline Configuration
```css
button, a, input, select, textarea {
  outline-offset: 4px;
}

:focus-visible {
  outline: 2px solid #993333; /* Burgundy */
}
```

- **Offset**: 4px space between element and outline
- **Color**: Burgundy for high contrast against most backgrounds
- **Width**: 2px solid line
- **Keyboard only**: `:focus-visible` (not on mouse click)

---

## 🎯 Selection Styling

```css
::selection {
  background: #e89373; /* Coral */
  color: #202522; /* Ink */
}
```

- Text selection uses brand coral background
- Dark ink text for readability

---

## 📱 Mobile-Specific Optimizations

### Safe Area Insets
```css
@supports (padding: env(safe-area-inset-bottom)) {
  .safe-pb {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}
```
- Respects iPhone notch and home indicator
- Ensures buttons don't get hidden

### Overflow Prevention
```css
html { overflow-x: clip; }
body { overflow-x: clip; }
```
- Prevents horizontal scroll on mobile
- Clips animations that extend beyond viewport

### Text Size Adjustment
```css
body {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
```
- Prevents iOS Safari from auto-resizing text

---

## 🎪 Marquee Animation
For logos or testimonials scrolling horizontally.

```css
@keyframes marquee-x {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee { animation: marquee-x 30s linear infinite; }
```

- **Duration**: 30s for smooth slow scroll
- **Distance**: Moves 50% (duplicated content for seamless loop)
- **Linear**: Constant speed, no easing

---

## 🌈 Scrollbar Styling

```css
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f8f3ea; /* Cream */
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3d634e, #993333); /* Forest → Burgundy */
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #993333, #e89373); /* Burgundy → Coral */
}
```

- Custom branded scrollbar on Chrome/Edge/Safari
- Rounded pill shape
- Gradient colors match brand
- Hover state shifts to warmer tones

---

## 🎬 Animation Checklist

### What Gets Animated:
✅ Page transitions (curtain swipe)
✅ Intro sequence (first visit)
✅ Navigation state (transparent → solid on scroll)
✅ Content reveals (fade + slide up on scroll)
✅ Button hovers (lift + shadow + shine)
✅ Hero backgrounds (Ken Burns, light sweeps, vignette pulse)
✅ Decorative orbs (floating, drifting)
✅ Text gradients (color pan)
✅ Filter buttons (gradient flow)
✅ Mobile menu (scale + fade)
✅ Form interactions (likely validation shakes, success bounces)

### What Doesn't Get Animated:
❌ Body text (immediate readability)
❌ Static images (unless part of carousel/gallery)
❌ Footer content (stability)
❌ Long form content (reading focus)

---

## 🛠️ Technical Implementation Notes

### Framer Motion Configuration
```jsx
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
```

**Key Hooks Used:**
- `useReducedMotion()` - Respects accessibility preferences
- `useScroll()` - Tracks scroll position
- `useTransform()` - Maps scroll to animation values
- `AnimatePresence` - Handles mount/unmount animations

### Performance Considerations
```jsx
will-change: transform; // Only on actively animating elements
```

- Use `transform` over `left/top`
- Use `opacity` over `visibility`
- Minimize animating multiple properties simultaneously
- Use `AnimatePresence` for exit animations
- Lazy load images below the fold

---

## 📊 Animation Timing Overview

| Element | Duration | Easing | Infinite? |
|---------|----------|--------|-----------|
| Intro sequence | 3.4s | Custom | No |
| Page transition | 0.7s | Custom | No |
| Button hover | 0.3s | ease | No |
| Shine sweep | 0.9s | ease | No (on hover) |
| Ken Burns | 28s | ease-in-out | Yes (alternate) |
| Light sweep | 9s | ease-in-out | Yes |
| Vignette pulse | 8s | ease-in-out | Yes |
| Orb drift | 14-18s | ease-in-out | Yes |
| Text gradient | 6-7s | ease-in-out | Yes |
| Float animation | 6-7.5s | ease-in-out | Yes |
| Glow pulse | 3.2s | ease-in-out | Yes |
| Gradient pan | 6-16s | ease | Yes |
| Marquee scroll | 30s | linear | Yes |

---

## 🎨 Brand Voice Through Animation

### Personality Traits Expressed:
- **Professional**: Smooth, predictable easing curves
- **Warm**: Soft color gradients (coral, peach, sage)
- **Premium**: Subtle long-duration ambient animations (Ken Burns 28s)
- **Caring**: Gentle floating motions, breathing effects
- **Modern**: Glassmorphism, gradient flows, tech grid
- **Trustworthy**: Consistent timing, predictable interactions

### Animation Philosophy:
- **Never jarring**: All animations ease smoothly
- **Never blocking**: User can interact during animations
- **Never repetitive**: Long durations prevent annoying loops
- **Always purposeful**: Each animation serves UX or brand goals
- **Always accessible**: Reduced motion support throughout

---

## 🔗 Related Files

1. **`src/app/globals.css`** - All CSS animations and keyframes
2. **`src/components/site.tsx`** - All React animation components (Framer Motion)
3. **`tailwind.config.ts`** - Theme colors, fonts, custom utilities
4. **`src/lib/site.ts`** - Color palette constants and image data

---

## 💡 Implementation Tips for Developers

### Adding New Animations:
1. Define keyframe in `globals.css` if CSS-based
2. Use Framer Motion components if React-based
3. Always include `useReducedMotion()` check
4. Test on mobile (performance implications)
5. Consider `:focus-visible` states for keyboard users

### Maintaining Consistency:
- Stick to brand color palette
- Use existing easing curves
- Match duration ranges (micro vs ambient)
- Test with `prefers-reduced-motion` enabled

### Performance Testing:
- Check FPS in Chrome DevTools Performance tab
- Test on mid-range mobile devices
- Avoid animating layout properties (height, width, margin)
- Use `transform` and `opacity` only for best performance

---

## 🎉 Summary

DTdogs.ca features a **sophisticated, warm, and premium animation system** that balances:

✨ **Visual Interest** - Ken Burns effects, gradient flows, floating orbs
🎯 **User Experience** - Smooth page transitions, responsive hover states
♿ **Accessibility** - Full reduced motion support
⚡ **Performance** - GPU-accelerated transforms, optimized timing
🎨 **Brand Expression** - Colors, movements, and pacing reflect care, trust, and professionalism

The site creates a **calm, confident, and modern** experience that mirrors the quality of pet care services offered.

---

*Document created: 2026*
*Last updated: After analyzing complete site.tsx, globals.css, and theme configuration*
