# Troubleshooting: Can't See Frame Animation

## Problem: Only Seeing "Welcome" or Placeholder Text

If you're only seeing static text and not the frame animation, here's what's happening and how to fix it:

### Why This Happens

The frame animation **requires actual image files** to work. The system needs 100+ individual images (like `frame_00001.avif`, `frame_00002.avif`, etc.) in a `frames/` folder.

Without these images:
- The animation can't load anything
- You'll see placeholder text or "Welcome" message
- Browser console will show 404 errors for missing images

## 🚀 Quick Solutions

### Option 1: Test with Auto-Generated Frames (FASTEST)

**No image files needed!** This generates frames on-the-fly so you can see it working immediately.

1. **Open this file in your browser:**
   ```
   frame-sequence/instant-demo.html
   ```

2. **That's it!** You'll see:
   - Loading progress (0-100%)
   - Then a smooth 120-frame animation
   - Scroll down to control the frames

**What you'll see:**
- Animated colored backgrounds
- Moving circles and particles
- Frame numbers changing as you scroll

---

### Option 2: Color-Based Test (NO IMAGES)

Even simpler - just shows frame numbers with color changes:

1. **Open this file:**
   ```
   frame-sequence/test-with-colors.html
   ```

2. **Scroll down** and watch frames 1-100 change with different colors

---

### Option 3: Use Real Images (Production-Ready)

For the actual animation with real images:

#### Step 1: Get Your Images

**Method A: Extract from a video**
```bash
cd frame-sequence
./extract-frames.sh -i your-video.mp4 -f 30 -q 85
```

**Method B: Create test images (requires ImageMagick)**
```bash
cd frame-sequence
mkdir -p frames

# Generate 120 test frames
for i in {1..120}; do
  num=$(printf "%05d" $i)
  convert -size 1920x1080 \
    -background "rgb($((i*2)),$((i*2)),$((255-i*2)))" \
    -gravity center \
    -pointsize 120 \
    -fill white \
    label:"Frame $i" \
    "frames/frame_${num}.jpg"
done
```

**Method C: Download from a URL pattern**
```bash
./download-frames.sh \
  -u 'https://example.com/frame_{NUM}.avif' \
  -s 1 \
  -e 120
```

#### Step 2: Verify Files

Check that you have:
```
frame-sequence/
└── frames/
    ├── frame_00001.jpg  (or .avif, .png, .webp)
    ├── frame_00002.jpg
    ├── frame_00003.jpg
    └── ... (100+ images)
```

#### Step 3: Update Configuration

Open `avif-sequence.js` and set:

```javascript
const CONFIG = {
  imageBaseURL: './frames/frame_',
  imageFormat: 'jpg',        // Match your file format
  totalFrames: 120,          // Match number of files
  paddingZeros: 5,           // For 00001 format
  // ...
};
```

#### Step 4: Run Local Server

**Important:** You MUST use a web server, not just open the file directly!

```bash
# In the project root directory
python3 -m http.server 8000

# Then visit:
# http://localhost:8000/frame-sequence/avif-sequence.html
```

---

## Common Errors and Fixes

### Error: "Failed to load frame: ./frames/frame_00001.avif"

**Cause:** Image files don't exist or path is wrong

**Fix:**
1. Check that `frames/` folder exists
2. Check that files are named exactly right
3. Update `imageBaseURL` in config if needed

---

### Error: CORS policy / Access denied

**Cause:** Opening HTML file directly with `file://` protocol

**Fix:** Use a local web server instead:
```bash
python3 -m http.server 8000
```

---

### Error: Loading stuck at 0%

**Cause:** JavaScript can't find the image files

**Fix:**
1. Open browser console (F12)
2. Look for red 404 errors
3. Check the file path in the error
4. Adjust `imageBaseURL` to match

---

### Animation is choppy/stuttering

**Causes:**
- Image files too large (> 500KB each)
- Too high resolution (> 1920x1080)
- Not preloaded properly

**Fixes:**
1. Compress images more (< 200KB each)
2. Reduce resolution
3. Convert to AVIF or WebP format
4. Reduce total number of frames for testing

---

## Testing Checklist

Use this to diagnose issues:

- [ ] Using a web server (not `file://`)?
- [ ] `frames/` folder exists?
- [ ] Image files are in `frames/` folder?
- [ ] File names match the pattern exactly?
- [ ] CONFIG settings match your files?
- [ ] Browser console shows no 404 errors?
- [ ] Loading percentage reaches 100%?

---

## File Structure Should Look Like This

```
new webb/
├── frame-sequence/
│   ├── frames/                    ← Your images go here!
│   │   ├── frame_00001.jpg
│   │   ├── frame_00002.jpg
│   │   └── ...
│   ├── avif-sequence.html         ← Main file (needs images)
│   ├── avif-sequence.js
│   ├── instant-demo.html          ← Test file (no images needed)
│   ├── test-with-colors.html      ← Simple test (no images needed)
│   └── ...
```

---

## Which File Should I Open?

| File | Images Needed? | Best For |
|------|---------------|----------|
| `instant-demo.html` | ❌ No | Testing immediately, see it working |
| `test-with-colors.html` | ❌ No | Quick scroll test, understand concept |
| `avif-sequence.html` | ✅ Yes | Production use with real images |
| `frame-sequence.html` | ✅ Yes | Alternative canvas version |
| `complete-demo.html` | ✅ Yes | Full loader + frame sequence |

---

## Step-by-Step: First Time Setup

1. **See it working first (no images):**
   ```bash
   # Just open in browser:
   frame-sequence/instant-demo.html
   ```

2. **Understand how it works:**
   ```bash
   # Open in browser:
   frame-sequence/test-with-colors.html
   ```

3. **Prepare your images:**
   ```bash
   cd frame-sequence
   mkdir frames
   # Add your images or generate test ones
   ```

4. **Configure settings:**
   - Edit `avif-sequence.js`
   - Match CONFIG to your files

5. **Start web server:**
   ```bash
   python3 -m http.server 8000
   ```

6. **Test with real images:**
   ```
   http://localhost:8000/frame-sequence/avif-sequence.html
   ```

---

## Still Not Working?

**Check browser console (F12):**
- Press F12 to open Developer Tools
- Click "Console" tab
- Look for red error messages
- They'll tell you exactly what's wrong!

**Common console errors:**

| Error Message | What It Means | How to Fix |
|---------------|---------------|------------|
| `404 (Not Found)` | Can't find image files | Check file paths and names |
| `CORS policy` | Using `file://` protocol | Use web server instead |
| `Unexpected end of input` | JavaScript error | Check CONFIG syntax |
| Nothing loads | Wrong file path | Verify `imageBaseURL` |

---

## Need Help Right Now?

1. **Start here:** Open `instant-demo.html` to see it working
2. **Then:** Follow Option 3 above to use real images
3. **Check:** Browser console for specific errors

The instant demo proves the code works - you just need to add your images!
