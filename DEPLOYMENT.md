# Deployment Guide for Vercel

## Project Structure
```
new webb/
├── frontend/          # React + Vite application
│   ├── public/       # Static assets (images, videos, audio)
│   ├── src/          # Source code
│   └── dist/         # Build output (generated)
└── vercel.json       # Vercel configuration
```

## Prerequisites
- Vercel account
- Git repository connected to Vercel

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository

2. **Configure Project**
   - Framework Preset: **Other** (don't select Vite, we have custom config)
   - Root Directory: **Leave blank** (we handle it in vercel.json)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

3. **Environment Variables** (Optional)
   - None required for this project

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project root
cd "/Users/ayushjaiswal/Desktop/AIB/new webb"

# Deploy
vercel

# For production deployment
vercel --prod
```

## Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "devCommand": "cd frontend && npm run dev",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Common Deployment Issues

### Issue: 404 Errors for Assets

**Cause**: Assets not being copied to build output or incorrect paths

**Solution**:
1. Ensure all assets are in `frontend/public/` directory
2. Reference assets with leading slash: `/image.jpg` not `./image.jpg`
3. Verify `vite.config.js` has correct publicDir: `publicDir: 'public'`

### Issue: Blank Page After Deploy

**Cause**: Incorrect base path or routing issues

**Solution**:
1. Check `vite.config.js` has `base: '/'`
2. Ensure vercel.json has rewrite rule for SPA routing
3. Check browser console for errors

### Issue: Build Fails

**Cause**: Missing dependencies or build errors

**Solution**:
```bash
# Test build locally in frontend directory
cd frontend
npm install
npm run build

# Check for errors in output
```

### Issue: Large Bundle Size

**Current Setup**:
- 401 frame images (~4-8 MB total depending on image quality)
- Audio file (~22 MB)
- Video loader (~274 KB)

**If deployment fails due to size**:
1. Compress images further
2. Use CDN for large assets
3. Enable lazy loading for images

## Asset Optimization (If Needed)

### Compress Images
```bash
# Install imagemagick or use online tools
# Example: convert to webp
for file in frontend/public/Rotoris_world_experience_*.jpeg; do
  cwebp -q 80 "$file" -o "${file%.jpeg}.webp"
done
```

### Compress Audio
```bash
# Use ffmpeg to compress audio
ffmpeg -i frontend/public/experience-sound.mp3 -b:a 128k frontend/public/experience-sound-compressed.mp3
```

## Verify Deployment

After deployment, check:
1. ✅ Loading screen appears with progress bar
2. ✅ Autoplay animation plays (frames 0-164)
3. ✅ "Enter Experience" button appears at frame 164
4. ✅ Clicking button enters scroll mode
5. ✅ Audio plays (may need user gesture for autoplay)
6. ✅ Scroll forward works (164 → 400)
7. ✅ Scroll backward works (164 → 0)
8. ✅ Navigation dots show progress
9. ✅ Smooth scrolling via Lenis works
10. ✅ Frames progress at consistent 24 FPS

## Performance Tips

1. **Enable Gzip/Brotli** (Automatic on Vercel)
2. **CDN** (Automatic on Vercel Edge Network)
3. **Caching**: Vercel automatically caches static assets
4. **Image Optimization**: Consider using Vercel's Image Optimization API

## Support

If issues persist:
1. Check Vercel build logs for errors
2. Test build locally: `cd frontend && npm run build && npm run preview`
3. Verify all assets are committed to git
4. Check Vercel dashboard for deployment status

## Project Links

- **Development**: Run `npm run dev` in frontend directory
- **Production Build**: Run `npm run build` in frontend directory
- **Preview Build**: Run `npm run preview` after building

## Technical Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.5
- **Smooth Scroll**: Lenis 1.0.42
- **Deployment**: Vercel
- **Assets**: 401 frame sequence, audio, video loader
