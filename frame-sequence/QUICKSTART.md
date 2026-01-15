# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Test with Placeholders (Immediate)

To test the animation immediately without preparing frames:

1. **Create test frames folder:**
   ```bash
   cd frame-sequence
   mkdir -p frames
   ```

2. **Generate placeholder images (requires ImageMagick):**
   ```bash
   # Install ImageMagick first if needed:
   # macOS: brew install imagemagick
   # Ubuntu: sudo apt-get install imagemagick

   # Generate 120 numbered placeholder frames
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

3. **Update config** in `avif-sequence.js`:
   ```javascript
   const CONFIG = {
     imageBaseURL: './frames/frame_',
     imageFormat: 'jpg',  // Changed from 'avif'
     totalFrames: 120,
     paddingZeros: 5,
     // ... rest stays the same
   };
   ```

4. **Run local server:**
   ```bash
   python3 -m http.server 8000
   ```

5. **Open in browser:**
   ```
   http://localhost:8000/avif-sequence.html
   ```

---

### Option 2: Extract from Your Video

If you have a video file:

1. **Place your video** in the `frame-sequence` folder

2. **Run extraction script:**
   ```bash
   ./extract-frames.sh -i your-video.mp4 -f 30 -q 85
   ```

3. **Update config** (script will tell you what to change)

4. **Test it:**
   ```bash
   python3 -m http.server 8000
   ```

---

### Option 3: Download from a URL Pattern

If frames are hosted online (like Rotoris example):

1. **Use download script:**
   ```bash
   ./download-frames.sh \
     -u 'https://example.com/frames/frame_{NUM}.avif' \
     -s 1 \
     -e 120 \
     -d 5
   ```

2. **Frames download to** `./frames/`

3. **Update config** and test

---

## 📁 Expected Folder Structure

After setup, you should have:

```
frame-sequence/
├── frames/                    ← Your image sequence
│   ├── frame_00001.avif      (or .jpg, .png, .webp)
│   ├── frame_00002.avif
│   ├── frame_00003.avif
│   └── ...
├── avif-sequence.html        ← Open this in browser
├── avif-sequence.js
├── frame-sequence.html       ← Canvas version
├── frame-sequence.js
├── frame-sequence.css
├── extract-frames.sh         ← For video extraction
├── download-frames.sh        ← For URL downloads
├── README.md
├── GUIDE.md                  ← Detailed guide
└── QUICKSTART.md            ← This file
```

---

## ⚙️ Configuration Cheat Sheet

### For files named: `frame_00001.jpg`
```javascript
imageBaseURL: './frames/frame_',
imageFormat: 'jpg',
paddingZeros: 5,
```

### For files named: `img-001.png`
```javascript
imageBaseURL: './frames/img-',
imageFormat: 'png',
paddingZeros: 3,
```

### For files named: `sequence0001.webp`
```javascript
imageBaseURL: './frames/sequence',
imageFormat: 'webp',
paddingZeros: 4,
```

---

## 🎯 Testing Checklist

- [ ] Frames are in `frames/` folder
- [ ] File naming matches CONFIG settings
- [ ] Running local server (not `file://` protocol)
- [ ] Browser console shows no 404 errors
- [ ] Loading percentage reaches 100%
- [ ] Scrolling changes frames smoothly

---

## 🐛 Common First-Time Issues

### "All images failed to load"
- ✅ Check file paths in CONFIG
- ✅ Make sure you're using `http://localhost`, not `file://`
- ✅ Verify frames folder exists and has images

### "Loading stuck at 0%"
- ✅ Open browser console (F12) and check for errors
- ✅ Verify image format matches CONFIG.imageFormat
- ✅ Check image file names match the pattern

### "Animation is choppy"
- ✅ Reduce image file sizes (< 200KB each)
- ✅ Lower resolution (1920x1080 or less)
- ✅ Increase CONFIG.smoothing value to 0.15

### "First frame is blank"
- ✅ Check that first frame file exists
- ✅ Verify imageBaseURL path is correct
- ✅ Make sure START_FRAME matches your first file number

---

## 🎨 Quick Customization

### Make it auto-play once on load:
```javascript
autoPlayOnLoad: true,
autoPlayFPS: 30,
```

### Make scrolling slower (more scroll needed):
```javascript
scrollMultiplier: 0.5,  // Default is 1.5
```

### Make scrolling faster:
```javascript
scrollMultiplier: 3.0,
```

### Make transitions smoother:
```javascript
smoothing: 0.15,  // Default is 0.1
```

---

## 📱 Mobile Testing

Test on mobile by:

1. **Find your local IP:**
   ```bash
   ipconfig getifaddr en0  # macOS
   # or
   hostname -I  # Linux
   ```

2. **Make sure phone is on same WiFi**

3. **Visit:**
   ```
   http://YOUR-IP:8000/frame-sequence/avif-sequence.html
   ```

---

## 🚢 Deployment

Before deploying to production:

1. **Optimize images:**
   - Compress to < 200KB each
   - Use AVIF or WebP format
   - Consistent resolution

2. **Enable caching** on your server:
   ```
   Cache-Control: public, max-age=31536000
   ```

3. **Use CDN** for better global performance

4. **Test loading time** on slow connection

---

## 💡 Pro Tips

1. **Start with fewer frames** (30-50) to test, then add more

2. **Generate frames at 24-30 FPS** from video for smooth motion

3. **Use AVIF format** for 50% smaller file sizes vs JPEG

4. **Preload all frames** before showing animation (already done!)

5. **Add loading progress bar** (already included!)

---

## 🎬 Ready to Go!

Once you see:
- ✅ Loading progress reaches 100%
- ✅ First frame displays
- ✅ Scrolling changes frames
- ✅ No console errors

You're all set! 🎉

---

## 📚 Next Steps

- Read [GUIDE.md](./GUIDE.md) for advanced features
- Integrate with your [loader animation](../loader/loader.html)
- Customize styling in the HTML/CSS
- Add your own branding and content

## 🆘 Need Help?

Check the browser console (F12) for error messages - they'll tell you exactly what's wrong!
