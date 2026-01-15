# 🎬 Loader Animation Documentation

## 📁 Files Created
- `loader.html` - Main loader page
- `loader.css` - Styles with responsive design
- `loader.js` - Animation logic (vanilla JS, no dependencies)

## 🎯 What It Does

### Visual Structure
```
┌─────────────────────────────┐
│                             │
│    [Video: web-loader.mp4]  │
│         (fades in)          │
│                             │
│    ━━━━━━━━━━━━━━━         │ ← Progress bar
│    (grows 0% → 100%)        │
│                             │
└─────────────────────────────┘
```

### Animation Sequence
1. **Video fades in** (800ms)
2. **Video plays** automatically
3. **Progress bar grows** from 0% to 100% (4 seconds)
4. **Color transitions** from transparent → white
5. **Loader fades out** (600ms)
6. **Main content appears** (ready for your implementation)

## 🎨 Customization

### Timing Adjustments
Edit `loader.js` at the top:
```javascript
const CONFIG = {
  loadDuration: 4000,      // Change total load time
  videoFadeDuration: 800,  // Change video fade speed
  barEasing: 'ease-out',   // Change animation curve
};
```

### Color Scheme
Edit `loader.css`:
```css
/* Background color */
body {
  background: #000; /* Change from black */
}

/* Progress bar color */
.progress-bar {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,    /* Start: transparent */
    rgba(255, 255, 255, 0.5) 50%, /* Middle: semi-white */
    rgba(255, 255, 255, 1) 100%   /* End: full white */
  );
}
```

### Bar Size
```css
.progress-bar-wrapper {
  height: 2px; /* Change bar thickness */
}
```

## 🚀 Usage

### As Standalone Page
```bash
# Open directly in browser
open loader/loader.html
```

### Integrate into Existing Site
```html
<!-- In your main index.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="loader/loader.css">
  <link rel="stylesheet" href="your-main-styles.css">
</head>
<body>

  <!-- Loader (shows first) -->
  <div class="loader-container">
    <video class="loader-video" src="web-loader.mp4" muted playsinline></video>
    <div class="progress-bar-wrapper">
      <div class="progress-bar" id="progressBar"></div>
    </div>
  </div>

  <!-- Your main content (hidden initially) -->
  <main id="mainContent" style="display: none;">
    <!-- Your website here -->
  </main>

  <script src="loader/loader.js"></script>
  <script src="your-main-script.js"></script>
</body>
</html>
```

Then modify `loader.js` → `showMainContent()`:
```javascript
function showMainContent() {
  const mainContent = document.getElementById('mainContent');
  mainContent.style.display = 'block';
  mainContent.style.opacity = '0';
  mainContent.style.transition = 'opacity 800ms ease-out';

  setTimeout(() => {
    mainContent.style.opacity = '1';
  }, 100);
}
```

## 📱 Responsive Design
- **Desktop:** Max width 600px, video 400px
- **Tablet:** Video 300px
- **Mobile:** Video 250px, thinner bar

## ♿ Accessibility
- ✅ Respects `prefers-reduced-motion`
- ✅ Video has `muted` and `playsinline` attributes
- ✅ Handles autoplay blocks gracefully
- ✅ Pauses video when tab is hidden

## 🎯 Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Performance Notes
- Uses `requestAnimationFrame` (60fps)
- No heavy libraries (vanilla JS)
- Video preloads automatically
- CSS transforms for smooth animations
- Total page weight: ~270KB (mostly video)

## 🐛 Troubleshooting

### Video not playing?
1. Check file path: `../web-loader.mp4` (relative to loader.html)
2. Ensure video format is compatible (H.264 MP4)
3. Check browser console for autoplay errors

### Bar not animating?
1. Check JavaScript console for errors
2. Ensure `progressBar` ID matches HTML
3. Test in different browser

### Animation too fast/slow?
Change `loadDuration` in `loader.js`:
```javascript
loadDuration: 3000,  // 3 seconds
loadDuration: 5000,  // 5 seconds
loadDuration: 6000,  // 6 seconds
```

## 🎬 Next Steps
After you test this layout, I can:
1. Add GSAP for more advanced animations
2. Implement percentage counter (0% → 100%)
3. Add sound effects (optional)
4. Sync bar exactly with video duration
5. Add custom easing curves
