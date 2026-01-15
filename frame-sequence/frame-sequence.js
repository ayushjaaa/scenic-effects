/* ============================================
   FRAME SEQUENCE ANIMATION SCRIPT
   - Loads 100+ images sequentially
   - Canvas-based rendering for smooth performance
   - Scroll-based or auto-play animation
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Image sequence settings
  imageFolder: './frames/',        // Folder containing frame images
  imagePrefix: 'frame_',            // Prefix for image files (e.g., frame_0001.jpg)
  imageFormat: 'jpg',               // Image format (jpg, png, webp)
  totalFrames: 120,                 // Total number of frames
  startFrame: 1,                    // Starting frame number
  paddingZeros: 4,                  // Number of zeros in filename (0001 = 4 zeros)

  // Animation settings
  animationMode: 'scroll',          // 'scroll' or 'auto'
  autoPlayFPS: 30,                  // Frames per second for auto-play mode
  scrollMultiplier: 2,              // How many pixels to scroll per frame

  // Performance settings
  preloadCount: 10,                 // Number of frames to preload ahead
  canvas: {
    fitMode: 'cover'                // 'cover' or 'contain'
  }
};

// ============================================
// STATE
// ============================================

const state = {
  canvas: null,
  ctx: null,
  images: [],
  imagesLoaded: 0,
  currentFrame: 0,
  isReady: false,
  scrollTrigger: 0,
  canvasRect: null,
  animationFrameId: null
};

// ============================================
// INITIALIZATION
// ============================================

function init() {
  // Get canvas and context
  state.canvas = document.getElementById('frameCanvas');
  state.ctx = state.canvas.getContext('2d');

  // Set canvas size
  resizeCanvas();

  // Preload images
  preloadImages();

  // Setup event listeners
  setupEventListeners();

  console.log('Frame sequence initialized');
}

// ============================================
// IMAGE LOADING
// ============================================

function getFramePath(frameNumber) {
  const paddedNumber = String(frameNumber).padStart(CONFIG.paddingZeros, '0');
  return `${CONFIG.imageFolder}${CONFIG.imagePrefix}${paddedNumber}.${CONFIG.imageFormat}`;
}

function preloadImages() {
  console.log(`Preloading ${CONFIG.totalFrames} frames...`);

  // Create array to hold all images
  state.images = new Array(CONFIG.totalFrames);

  // Load images sequentially
  for (let i = 0; i < CONFIG.totalFrames; i++) {
    const frameNumber = CONFIG.startFrame + i;
    const img = new Image();

    img.onload = () => {
      state.imagesLoaded++;

      // Update loading progress
      const progress = (state.imagesLoaded / CONFIG.totalFrames) * 100;
      console.log(`Loading: ${Math.round(progress)}%`);

      // When all images loaded
      if (state.imagesLoaded === CONFIG.totalFrames) {
        onImagesLoaded();
      }
    };

    img.onerror = () => {
      console.error(`Failed to load frame: ${getFramePath(frameNumber)}`);
      state.imagesLoaded++;
    };

    img.src = getFramePath(frameNumber);
    state.images[i] = img;
  }
}

function onImagesLoaded() {
  console.log('All frames loaded successfully!');
  state.isReady = true;

  // Draw first frame
  drawFrame(0);

  // Start animation based on mode
  if (CONFIG.animationMode === 'auto') {
    startAutoPlay();
  }
}

// ============================================
// CANVAS RENDERING
// ============================================

function resizeCanvas() {
  state.canvas.width = window.innerWidth;
  state.canvas.height = window.innerHeight;
  state.canvasRect = state.canvas.getBoundingClientRect();

  // Redraw current frame after resize
  if (state.isReady) {
    drawFrame(state.currentFrame);
  }
}

function drawFrame(frameIndex) {
  // Clamp frame index
  frameIndex = Math.max(0, Math.min(CONFIG.totalFrames - 1, frameIndex));

  const img = state.images[frameIndex];

  if (!img || !img.complete) return;

  // Clear canvas
  state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

  // Calculate dimensions for cover/contain
  const canvasAspect = state.canvas.width / state.canvas.height;
  const imgAspect = img.width / img.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (CONFIG.canvas.fitMode === 'cover') {
    // Cover mode - fill entire canvas
    if (canvasAspect > imgAspect) {
      drawWidth = state.canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (state.canvas.height - drawHeight) / 2;
    } else {
      drawHeight = state.canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (state.canvas.width - drawWidth) / 2;
      offsetY = 0;
    }
  } else {
    // Contain mode - fit within canvas
    if (canvasAspect > imgAspect) {
      drawHeight = state.canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (state.canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = state.canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (state.canvas.height - drawHeight) / 2;
    }
  }

  // Draw image
  state.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  state.currentFrame = frameIndex;
}

// ============================================
// SCROLL-BASED ANIMATION
// ============================================

function handleScroll() {
  if (!state.isReady) return;

  const section = document.querySelector('.frame-sequence-section');
  const rect = section.getBoundingClientRect();

  // Calculate scroll progress within the section
  const scrollStart = -rect.top;
  const scrollHeight = rect.height;
  const scrollProgress = Math.max(0, Math.min(1, scrollStart / (scrollHeight * CONFIG.scrollMultiplier)));

  // Calculate target frame based on scroll
  const targetFrame = Math.floor(scrollProgress * (CONFIG.totalFrames - 1));

  // Draw frame
  drawFrame(targetFrame);
}

// ============================================
// AUTO-PLAY ANIMATION
// ============================================

function startAutoPlay() {
  const frameDelay = 1000 / CONFIG.autoPlayFPS;
  let lastFrameTime = 0;

  function animate(currentTime) {
    // Calculate delta time
    if (currentTime - lastFrameTime >= frameDelay) {
      // Increment frame
      let nextFrame = state.currentFrame + 1;

      // Loop back to start
      if (nextFrame >= CONFIG.totalFrames) {
        nextFrame = 0;
      }

      drawFrame(nextFrame);
      lastFrameTime = currentTime;
    }

    // Continue animation
    state.animationFrameId = requestAnimationFrame(animate);
  }

  state.animationFrameId = requestAnimationFrame(animate);
}

function stopAutoPlay() {
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
    state.animationFrameId = null;
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Window resize
  window.addEventListener('resize', resizeCanvas);

  // Scroll listener (only in scroll mode)
  if (CONFIG.animationMode === 'scroll') {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
  }

  // Visibility change (pause/resume auto-play)
  document.addEventListener('visibilitychange', () => {
    if (CONFIG.animationMode === 'auto') {
      if (document.hidden) {
        stopAutoPlay();
      } else if (state.isReady) {
        startAutoPlay();
      }
    }
  });
}

// ============================================
// CLEANUP
// ============================================

function cleanup() {
  stopAutoPlay();
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('scroll', handleScroll);
}

// ============================================
// START ON PAGE LOAD
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// ============================================
// UTILITY: Generate frame names for testing
// ============================================

// Uncomment to see what frame names will be generated
/*
console.log('Frame paths:');
for (let i = 0; i < Math.min(5, CONFIG.totalFrames); i++) {
  const frameNumber = CONFIG.startFrame + i;
  console.log(getFramePath(frameNumber));
}
*/
