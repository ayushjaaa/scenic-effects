# Frame Sequence Animation Guide

## What This Does

This creates a smooth, video-like animation by loading and displaying 100+ individual images sequentially, exactly like the Rotoris website example you provided. When users scroll, the images change frame-by-frame, creating the illusion of a video playing.

## How It Works (Technical Explanation)

### The Rotoris Approach

The Rotoris website uses individual AVIF images named like:
- `Rotoris_world_experience_00001.avif`
- `Rotoris_world_experience_00002.avif`
- `Rotoris_world_experience_00037.avif`
- etc.

When you scroll or click navigation dots, JavaScript:
1. **Changes the image `src`** attribute to the next frame
2. **Browser makes a network request** for that specific image
3. **Image displays** (instantly if cached, or loads if new)
4. **Repeat** for each frame as you scroll

### Key Technical Points

**Not a video:**
- Each frame is a separate image file
- No video codec or streaming
- Just rapid image swapping

**Why individual images?**
- Better caching control
- Can be optimized per-frame
- More control over playback
- Works without video support
- Better for interactive scrolling

**Performance tricks:**
- Preloading: All images load in background first
- Caching: Browser caches each image (see `Cache-Control: max-age=31557600`)
- Smooth scrolling: JavaScript interpolates between frames
- Canvas option: Can render to canvas for even better performance

## Setup Instructions

### Step 1: Prepare Your Frames

You need a sequence of images. Here are different ways to get them:

#### Option A: Extract from Video (Using FFmpeg)

```bash
# Make the script executable
chmod +x extract-frames.sh

# Extract frames
./extract-frames.sh -i your-video.mp4 -f 30 -q 85 -w 1920 -h 1080
```

This creates:
```
frames/
├── frame_00001.avif
├── frame_00002.avif
├── frame_00003.avif
└── ...
```

#### Option B: Create Images Manually

Name your images following this pattern:
- `frame_00001.avif`
- `frame_00002.avif`
- `frame_00003.avif`
- etc.

Place them in the `frames/` folder.

#### Option C: Use Existing Images from a Website

If you have a URL pattern like Rotoris:
```
https://cdn.shopify.com/s/files/.../Rotoris_world_experience_00001.avif
https://cdn.shopify.com/s/files/.../Rotoris_world_experience_00002.avif
```

You can download them using a script:

```bash
# Download script
for i in {1..120}; do
  num=$(printf "%05d" $i)
  curl -O "https://your-cdn.com/path/frame_${num}.avif"
done
```

### Step 2: Configure Settings

Open `avif-sequence.js` and update the CONFIG object:

```javascript
const CONFIG = {
  // IMPORTANT: Match these to your image files
  imageBaseURL: './frames/frame_',     // Path + prefix
  imageFormat: 'avif',                 // File extension
  totalFrames: 120,                    // How many frames you have
  startFrame: 1,                       // Starting number
  paddingZeros: 5,                     // Digits: 00001 = 5

  // Scroll behavior
  scrollMultiplier: 1.5,               // Lower = more scroll per frame
  smoothing: 0.1,                      // Smoothness (0.05-0.2)

  // Performance
  preloadBatchSize: 10,
  preloadAhead: 3,

  // Auto-play (optional)
  autoPlayOnLoad: false,               // Auto-play once
  autoPlayFPS: 30,
};
```

**File naming examples:**

| Your Files | imageBaseURL | paddingZeros |
|------------|--------------|--------------|
| `frame_00001.jpg` | `'./frames/frame_'` | `5` |
| `img-001.png` | `'./images/img-'` | `3` |
| `seq0001.webp` | `'./seq'` | `4` |

### Step 3: Test Locally

Open `avif-sequence.html` in your browser:

```bash
# If you have Python installed
python3 -m http.server 8000

# Then visit: http://localhost:8000/frame-sequence/avif-sequence.html
```

Or use VS Code Live Server extension.

### Step 4: Integration with Loader

To connect with your loader animation, update [loader.js](../loader/loader.js):

```javascript
function showMainContent() {
  // Redirect to frame sequence
  window.location.href = '../frame-sequence/avif-sequence.html';
}
```

## Understanding Network Requests

When you look at browser DevTools Network tab:

### First Load
```
Request: frame_00001.avif
Status: 200 OK
Size: 150 KB
Time: 200ms
Cache: MISS
```

### Subsequent Frames (Cached)
```
Request: frame_00002.avif
Status: 200 OK (from disk cache)
Size: 150 KB
Time: 0.06ms ← Super fast!
Cache: HIT
```

The `age: 765415` header you saw means that image was cached **8.8 days ago** and served instantly from cache. That's why timing was only 60 µs (0.00006 seconds)!

## Optimization Tips

### Image Format Comparison

| Format | Quality | Size | Browser Support |
|--------|---------|------|-----------------|
| **AVIF** | Excellent | Smallest | Chrome 85+, Safari 16+ |
| **WebP** | Excellent | Small | Chrome, Firefox, Safari 14+ |
| **JPEG** | Good | Medium | All browsers |
| **PNG** | Lossless | Large | All browsers |

### Recommended Settings

**For smooth animation:**
- Target: 200KB or less per frame
- Format: AVIF (best) or WebP (good fallback)
- Resolution: 1920x1080 or lower
- Quality: 80-85%

**Compression commands:**

```bash
# Convert to AVIF (best compression)
ffmpeg -i input.jpg -c:v libaom-av1 -crf 30 output.avif

# Convert to WebP (good fallback)
ffmpeg -i input.jpg -c:v libwebp -quality 85 output.webp

# Optimize JPEG
ffmpeg -i input.jpg -quality 85 -resize 1920x1080 output.jpg
```

**Total bandwidth calculation:**
- 120 frames × 150 KB = 18 MB total
- With caching: Only downloads once
- Without caching: Heavy bandwidth usage

## Scroll Behavior Configuration

### Slow Scroll (More frames visible per scroll)
```javascript
scrollMultiplier: 0.5,  // Need to scroll 2x more
smoothing: 0.15,        // Smoother transitions
```

### Fast Scroll (Quick frame changes)
```javascript
scrollMultiplier: 3.0,  // Frames change quickly
smoothing: 0.05,        // Snappier response
```

### Perfect Balance (Recommended)
```javascript
scrollMultiplier: 1.5,
smoothing: 0.1,
```

## Advanced Features

### Auto-Play on Load

Make it play through once when page loads:

```javascript
autoPlayOnLoad: true,
autoPlayFPS: 30,        // 30 frames per second
autoPlayDelay: 500,     // Wait 0.5s before starting
```

### Keyboard Controls

Built-in keyboard navigation:
- `Arrow Right/Down` → Next frame
- `Arrow Left/Up` → Previous frame

### External Control (JavaScript API)

Control the animation from your own code:

```javascript
// Go to specific frame
window.FrameSequence.goToFrame(50);

// Play animation
window.FrameSequence.play();

// Pause animation
window.FrameSequence.pause();

// Get current frame
console.log(window.FrameSequence.getCurrentFrame()); // 50

// Check if ready
if (window.FrameSequence.isReady()) {
  console.log('Ready to animate!');
}
```

## Common Issues & Solutions

### Images not loading?

**Check:**
1. File paths are correct in CONFIG
2. Image naming matches exactly (case-sensitive!)
3. Browser console for 404 errors
4. CORS issues if loading from different domain

**Debug:**
```javascript
// In avif-sequence.js, set to true:
if (true) { // Changed from false
  console.log('📋 Frame paths:');
  for (let i = 0; i < Math.min(5, CONFIG.totalFrames); i++) {
    console.log(`  Frame ${i + 1}:`, getFramePath(CONFIG.startFrame + i));
  }
}
```

### Animation stuttering?

**Solutions:**
1. Compress images more
2. Reduce resolution
3. Lower `totalFrames`
4. Increase `smoothing` value
5. Check browser performance tab

### Wrong number of digits?

If your files are `frame_001.jpg` but code expects `frame_00001.jpg`:

```javascript
paddingZeros: 3,  // Change from 5 to 3
```

### First frame blank?

The first image's `src` is set immediately when it loads. If you see a blank frame, check that `imageBaseURL` and first frame path are correct.

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 85+ | ✅ Full | Best performance |
| Firefox 93+ | ✅ Full | Good performance |
| Safari 16+ | ✅ Full | Requires AVIF support |
| Safari 14-15 | ⚠️ Partial | Use WebP instead of AVIF |
| Edge 85+ | ✅ Full | Same as Chrome |
| Mobile (iOS) | ✅ Full | Works great with touch |
| Mobile (Android) | ✅ Full | Smooth performance |

## Performance Metrics

**Expected loading times:**
- First frame: 50-200ms
- All frames (18MB): 2-5 seconds on good connection
- Cached playback: Instant (< 1ms per frame)

**Memory usage:**
- ~150-300 MB RAM for 120 frames in browser cache
- Varies by image resolution and format

**CPU usage:**
- Minimal during scroll (< 5% on modern hardware)
- Efficient requestAnimationFrame rendering

## Examples in the Wild

1. **Rotoris Website** (your example)
   - AVIF images
   - Scroll-based
   - Product showcase

2. **Apple AirPods Pro**
   - Scroll-based
   - Product rotation
   - 60-100 frames

3. **Tesla Model 3**
   - Auto-play + scroll
   - 360° view
   - High-res frames

## Next Steps

1. ✅ Extract or prepare your frames
2. ✅ Place them in `frames/` folder
3. ✅ Configure `CONFIG` in `avif-sequence.js`
4. ✅ Test locally
5. ✅ Integrate with your loader
6. ✅ Deploy and enjoy!

## Questions?

Check the code comments in `avif-sequence.js` for detailed explanations of each function.
