/* ============================================
   AVIF FRAME SEQUENCE ANIMATION
   - Similar to Rotoris website approach
   - Loads individual AVIF images
   - Scroll-based frame progression
   - Smooth performance with preloading
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Image settings - CUSTOMIZE THIS for your images
  imageBaseURL: './frames/frame_',     // Base path to your images
  imageFormat: 'avif',                 // Image format: avif, jpg, png, webp
  totalFrames: 120,                    // Total number of frames
  startFrame: 1,                       // Starting frame number
  paddingZeros: 5,                     // Number of digits (00001 = 5 digits)

  // Scroll behavior
  scrollMultiplier: 1.5,               // Sensitivity: lower = more scroll needed per frame
  smoothing: 0.1,                      // Frame transition smoothing (0-1)

  // Performance
  preloadBatchSize: 10,                // How many frames to preload at once
  preloadAhead: 3,                     // How many frames ahead to keep loaded

  // Animation
  autoPlayOnLoad: false,               // Auto-play through frames once
  autoPlayFPS: 30,                     // FPS for auto-play mode
  autoPlayDelay: 500,                  // Delay before auto-play starts (ms)
};

// ============================================
// STATE
// ============================================

const state = {
  images: new Map(),                   // Map of frameIndex -> Image object
  imagesLoaded: 0,                     // Count of loaded images
  currentFrame: 0,                     // Current frame being displayed
  targetFrame: 0,                      // Target frame based on scroll
  isReady: false,                      // All images loaded
  isAutoPlaying: false,                // Auto-play active
  animationFrameId: null,              // RAF id for smooth rendering
  scrollY: 0,                          // Current scroll position
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
  currentFrame: document.getElementById('currentFrame'),
  loadingOverlay: document.getElementById('loadingOverlay'),
  loadingBar: document.getElementById('loadingBar'),
  loadingPercent: document.getElementById('loadingPercent'),
  frameNumber: document.getElementById('frameNumber'),
  progressCircle: document.getElementById('progressCircle'),
  frameSection: document.getElementById('frameSection'),
};

// ============================================
// INITIALIZATION
// ============================================

function init() {
  console.log('🎬 Initializing frame sequence...');

  // Start preloading images
  preloadAllImages();

  // Setup event listeners
  setupEventListeners();
}

// ============================================
// IMAGE PRELOADING
// ============================================

function getFramePath(frameNumber) {
  const paddedNumber = String(frameNumber).padStart(CONFIG.paddingZeros, '0');
  return `${CONFIG.imageBaseURL}${paddedNumber}.${CONFIG.imageFormat}`;
}

function preloadAllImages() {
  console.log(`📥 Preloading ${CONFIG.totalFrames} frames...`);

  let loadedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < CONFIG.totalFrames; i++) {
    const frameNumber = CONFIG.startFrame + i;
    const img = new Image();

    img.onload = () => {
      loadedCount++;
      state.imagesLoaded = loadedCount;
      updateLoadingProgress(loadedCount, CONFIG.totalFrames);

      // First image loaded - show it immediately
      if (loadedCount === 1) {
        elements.currentFrame.src = img.src;
      }

      // All images loaded
      if (loadedCount + errorCount === CONFIG.totalFrames) {
        onAllImagesLoaded();
      }
    };

    img.onerror = () => {
      errorCount++;
      console.warn(`⚠️ Failed to load frame: ${getFramePath(frameNumber)}`);

      if (loadedCount + errorCount === CONFIG.totalFrames) {
        onAllImagesLoaded();
      }
    };

    img.src = getFramePath(frameNumber);
    state.images.set(i, img);
  }
}

function updateLoadingProgress(loaded, total) {
  const percent = Math.round((loaded / total) * 100);
  elements.loadingBar.style.width = `${percent}%`;
  elements.loadingPercent.textContent = percent;
}

function onAllImagesLoaded() {
  console.log('✅ All frames loaded!');
  state.isReady = true;

  // Hide loading overlay
  setTimeout(() => {
    elements.loadingOverlay.classList.add('hidden');
    setTimeout(() => {
      elements.loadingOverlay.style.display = 'none';
    }, 600);
  }, 300);

  // Start rendering loop
  startRenderLoop();

  // Auto-play if enabled
  if (CONFIG.autoPlayOnLoad) {
    setTimeout(() => {
      startAutoPlay();
    }, CONFIG.autoPlayDelay);
  }
}

// ============================================
// FRAME RENDERING
// ============================================

function displayFrame(frameIndex) {
  // Clamp frame index
  frameIndex = Math.max(0, Math.min(CONFIG.totalFrames - 1, Math.floor(frameIndex)));

  const img = state.images.get(frameIndex);

  if (img && img.complete) {
    elements.currentFrame.src = img.src;
    state.currentFrame = frameIndex;

    // Update UI
    updateFrameNumber(frameIndex + 1);
    updateProgressRing((frameIndex / (CONFIG.totalFrames - 1)) * 100);
  }
}

function updateFrameNumber(num) {
  elements.frameNumber.textContent = num;
}

function updateProgressRing(percent) {
  const circumference = 2 * Math.PI * 27; // radius = 27
  const offset = circumference - (percent / 100) * circumference;
  elements.progressCircle.style.strokeDashoffset = offset;
}

// ============================================
// SCROLL HANDLING
// ============================================

function handleScroll() {
  if (!state.isReady) return;

  const section = elements.frameSection;
  const rect = section.getBoundingClientRect();

  // Calculate scroll progress within the section
  const scrollStart = -rect.top;
  const scrollEnd = rect.height - window.innerHeight;
  const scrollProgress = Math.max(0, Math.min(1, scrollStart / scrollEnd));

  // Calculate target frame
  state.targetFrame = scrollProgress * (CONFIG.totalFrames - 1);
}

// ============================================
// SMOOTH RENDERING LOOP
// ============================================

function startRenderLoop() {
  function render() {
    // Smooth interpolation towards target frame
    const diff = state.targetFrame - state.currentFrame;
    const step = diff * CONFIG.smoothing;

    if (Math.abs(diff) > 0.1) {
      displayFrame(state.currentFrame + step);
    }

    state.animationFrameId = requestAnimationFrame(render);
  }

  state.animationFrameId = requestAnimationFrame(render);
}

function stopRenderLoop() {
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
    state.animationFrameId = null;
  }
}

// ============================================
// AUTO-PLAY MODE
// ============================================

function startAutoPlay() {
  if (state.isAutoPlaying) return;

  console.log('▶️ Starting auto-play...');
  state.isAutoPlaying = true;

  const frameDelay = 1000 / CONFIG.autoPlayFPS;
  let lastFrameTime = 0;

  function animate(currentTime) {
    if (!state.isAutoPlaying) return;

    if (currentTime - lastFrameTime >= frameDelay) {
      // Increment frame
      let nextFrame = state.currentFrame + 1;

      // Stop at end (or loop back to start)
      if (nextFrame >= CONFIG.totalFrames) {
        // nextFrame = 0; // Uncomment to loop
        state.isAutoPlaying = false;
        console.log('⏹️ Auto-play complete');
        return;
      }

      displayFrame(nextFrame);
      state.targetFrame = nextFrame; // Keep in sync
      lastFrameTime = currentTime;
    }

    if (state.isAutoPlaying) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function stopAutoPlay() {
  state.isAutoPlaying = false;
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Scroll handler
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial scroll check
  handleScroll();

  // Stop auto-play on user scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (state.isAutoPlaying) {
      stopAutoPlay();
    }

    // Resume smooth rendering after scroll
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Optional: do something after scroll stops
    }, 150);
  }, { passive: true });

  // Visibility change (pause when tab hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    }
  });

  // Keyboard navigation (optional)
  document.addEventListener('keydown', (e) => {
    if (!state.isReady) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextFrame = Math.min(state.currentFrame + 1, CONFIG.totalFrames - 1);
      state.targetFrame = nextFrame;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevFrame = Math.max(state.currentFrame - 1, 0);
      state.targetFrame = prevFrame;
    }
  });
}

// ============================================
// CLEANUP
// ============================================

function cleanup() {
  stopRenderLoop();
  stopAutoPlay();
  window.removeEventListener('scroll', handleScroll);
}

// ============================================
// START
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('beforeunload', cleanup);

// ============================================
// DEBUG: Log frame paths
// ============================================

if (false) { // Set to true to see frame paths
  console.log('📋 Frame paths:');
  for (let i = 0; i < Math.min(5, CONFIG.totalFrames); i++) {
    console.log(`  Frame ${i + 1}:`, getFramePath(CONFIG.startFrame + i));
  }
}

// ============================================
// EXPORT for external control (optional)
// ============================================

window.FrameSequence = {
  goToFrame: (frameIndex) => {
    state.targetFrame = Math.max(0, Math.min(CONFIG.totalFrames - 1, frameIndex));
  },
  play: startAutoPlay,
  pause: stopAutoPlay,
  getCurrentFrame: () => state.currentFrame,
  getTotalFrames: () => CONFIG.totalFrames,
  isReady: () => state.isReady,
};
