/* ============================================
   LOADER ANIMATION SCRIPT
   - Video fade-in + play
   - Progress bar 0→100% with color transition
   ============================================ */

// Configuration
const CONFIG = {
  loadDuration: 4000,      // Total load time in ms (4 seconds)
  videoFadeDuration: 800,  // Video fade-in duration
  barEasing: 'ease-out',   // CSS easing for bar animation
};

// Elements
const video = document.querySelector('.loader-video');
const progressBar = document.getElementById('progressBar');

// State
let animationFrameId;
let startTime;

/* ============================================
   INITIALIZATION
   ============================================ */

function init() {
  // Wait for video to be ready
  if (video.readyState >= 2) {
    startLoader();
  } else {
    video.addEventListener('loadeddata', startLoader, { once: true });
  }
}

/* ============================================
   START LOADER SEQUENCE
   ============================================ */

function startLoader() {
  // 1. Play video (already visible via CSS)
  playVideo();

  // 2. Animate progress bar
  animateProgressBar();
}

/* ============================================
   VIDEO ANIMATIONS
   ============================================ */

function fadeInVideo() {
  video.style.transition = `opacity ${CONFIG.videoFadeDuration}ms ease-out`;
  video.style.opacity = '1';
}

function playVideo() {
  video.play().catch(err => {
    console.log('Video autoplay prevented:', err);
    // Fallback: Just show video without playing
    video.style.opacity = '1';
  });
}

/* ============================================
   PROGRESS BAR ANIMATION
   - Grows from 0% to 100%
   - Color transitions from transparent to white
   ============================================ */

function animateProgressBar() {
  startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / CONFIG.loadDuration, 1);

    // Update bar width (0% → 100%)
    progressBar.style.width = `${progress * 100}%`;

    // Update color opacity (transparent → white)
    // Using CSS filter for smooth color transition
    progressBar.style.opacity = progress;

    // Shift gradient for shimmer effect
    progressBar.style.backgroundPosition = `${progress * 100}% 0%`;

    // Continue animation until complete
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      onLoadComplete();
    }
  }

  // Start animation loop
  animationFrameId = requestAnimationFrame(animate);
}

/* ============================================
   LOAD COMPLETE HANDLER
   ============================================ */

function onLoadComplete() {
  console.log('Loader animation complete');

  // Optional: Fade out loader after completion
  setTimeout(() => {
    hideLoader();
  }, 500);
}

function hideLoader() {
  const loaderContainer = document.querySelector('.loader-container');

  loaderContainer.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
  loaderContainer.style.opacity = '0';
  loaderContainer.style.transform = 'scale(0.9)';

  // After fade out, redirect or show main content
  setTimeout(() => {
    // Option 1: Redirect to main page
    // window.location.href = '/index.html';

    // Option 2: Remove loader and show content
    loaderContainer.style.display = 'none';
    showMainContent();
  }, 600);
}

function showMainContent() {
  // Option 1: Redirect to frame sequence page
  window.location.href = '../frame-sequence/frame-sequence.html';

  // Option 2: If frame sequence is on the same page, uncomment below:
  /*
  const frameSection = document.getElementById('frame-sequence-section');
  if (frameSection) {
    frameSection.style.display = 'block';
    frameSection.style.opacity = '0';
    frameSection.style.transition = 'opacity 800ms ease-out';

    setTimeout(() => {
      frameSection.style.opacity = '1';
    }, 100);
  }
  */
}

/* ============================================
   CLEANUP
   ============================================ */

function cleanup() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

// Handle page visibility (pause if tab not visible)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    video.pause();
  } else {
    video.play().catch(() => {});
  }
});

/* ============================================
   START ON PAGE LOAD
   ============================================ */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
