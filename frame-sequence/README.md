# Frame Sequence Animation

A smooth, high-performance frame-by-frame image sequence animation that creates a video-like effect using 100+ images.

## Features

- **Canvas-based rendering** for optimal performance
- **Two animation modes**: Scroll-based or auto-play
- **Responsive design** that works on all screen sizes
- **Lazy loading** with progress tracking
- **Smooth frame transitions** at 30+ FPS
- **Cover/contain fit modes** for different aspect ratios

## Setup Instructions

### 1. Prepare Your Frame Images

Create a folder called `frames` in the `frame-sequence` directory and add your image sequence:

```
frame-sequence/
├── frames/
│   ├── frame_0001.jpg
│   ├── frame_0002.jpg
│   ├── frame_0003.jpg
│   ├── ...
│   └── frame_0120.jpg
├── frame-sequence.html
├── frame-sequence.css
└── frame-sequence.js
```

**Image naming convention:**
- Prefix: `frame_`
- Padded numbers: `0001`, `0002`, etc.
- Format: `.jpg`, `.png`, or `.webp`

### 2. Configure Settings

Open `frame-sequence.js` and adjust the `CONFIG` object:

```javascript
const CONFIG = {
  // Image sequence settings
  imageFolder: './frames/',        // Folder path
  imagePrefix: 'frame_',           // Filename prefix
  imageFormat: 'jpg',              // Image format
  totalFrames: 120,                // Total number of frames
  startFrame: 1,                   // Starting frame number
  paddingZeros: 4,                 // Zeros in filename (0001 = 4)

  // Animation settings
  animationMode: 'scroll',         // 'scroll' or 'auto'
  autoPlayFPS: 30,                 // FPS for auto-play
  scrollMultiplier: 2,             // Scroll sensitivity

  // Performance
  preloadCount: 10,                // Preload ahead count
  canvas: {
    fitMode: 'cover'               // 'cover' or 'contain'
  }
};
```

### 3. Integration with Loader

To make the frame sequence appear after the loader animation, update [loader.js](../loader/loader.js):

```javascript
function showMainContent() {
  // Redirect to frame sequence page
  window.location.href = '/frame-sequence/frame-sequence.html';

  // OR embed it in the same page:
  // const frameSection = document.getElementById('frame-sequence-section');
  // frameSection.style.display = 'block';
}
```

## Animation Modes

### Scroll Mode (Default)
Images change based on scroll position - perfect for storytelling.

```javascript
animationMode: 'scroll'
```

### Auto-Play Mode
Images play automatically like a video.

```javascript
animationMode: 'auto'
autoPlayFPS: 30  // Adjust playback speed
```

## Image Optimization Tips

For best performance:

1. **Resolution**: Use 1920x1080 or lower
2. **Format**:
   - JPG (80-85% quality) for photos
   - PNG for graphics with transparency
   - WebP for best compression
3. **File size**: Keep each frame under 200KB
4. **Total size**: 120 frames × 150KB = ~18MB total

### Compression Tools
- **ImageMagick**: `convert input.jpg -quality 85 -resize 1920x1080 output.jpg`
- **FFmpeg**: Extract frames from video
  ```bash
  ffmpeg -i video.mp4 -vf fps=30 frames/frame_%04d.jpg
  ```
- **Online**: TinyPNG, Squoosh.app

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Optimized for touch devices

## Performance Considerations

- **Preloading**: Images load in background before animation starts
- **Canvas**: Hardware-accelerated rendering
- **Memory**: ~100-200MB RAM for 120 frames
- **CPU**: Minimal impact with requestAnimationFrame

## Troubleshooting

### Images not loading?
1. Check `imageFolder` path is correct
2. Verify image naming matches `imagePrefix` and `paddingZeros`
3. Open browser console for error messages
4. Check network tab to see which files fail

### Animation stuttering?
1. Reduce `totalFrames` for testing
2. Compress images further
3. Lower resolution
4. Check browser performance tab

### Wrong aspect ratio?
Change `fitMode` in config:
- `cover`: Fills screen (may crop)
- `contain`: Fits within screen (may show bars)

## Examples

### Example 1: Product Showcase
- 60 frames showing product rotation
- Auto-play mode at 24 FPS
- 800x800 PNG images

### Example 2: Story Scroll
- 200 frames telling a story
- Scroll mode with 3x multiplier
- 1920x1080 JPG images

### Example 3: Loading Animation
- 40 frames as alternative loader
- Auto-play looping at 30 FPS
- 500x500 WebP images

## License

Free to use for any project.
