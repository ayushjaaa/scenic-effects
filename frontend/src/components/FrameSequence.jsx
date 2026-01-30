import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import './FrameSequence.css';

const FrameSequence = () => {
  // ============================================================
  // STATE - What the UI needs to know
  // ============================================================
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('loading'); // 'loading', 'autoplay', 'paused', 'scroll-exploration', 'paused-at-436', 'auto-progressing-2', 'paused-at-742', 'auto-progressing-3', 'paused-at-1024', 'auto-progressing-4', 'paused-at-1301', 'auto-progressing-5', 'paused-at-1577', 'auto-progressing-6'
  const [showButton, setShowButton] = useState(false);
  const [showAudioIcon, setShowAudioIcon] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(0);
  const [showScrollMoreText, setShowScrollMoreText] = useState(false);
  const [showScrollMoreText742, setShowScrollMoreText742] = useState(false);
  const [showScrollMoreText1024, setShowScrollMoreText1024] = useState(false);
  const [showScrollMoreText1301, setShowScrollMoreText1301] = useState(false);
  const [showScrollMoreText1577, setShowScrollMoreText1577] = useState(false);

  // ============================================================
  // REFS - Persistent data that doesn't trigger re-renders
  // ============================================================
  const imgRef = useRef(null);
  const imagesRef = useRef(new Map());
  const audioRef = useRef(null);
  const progressAnimationRef = useRef(null);
  const progressStartTimeRef = useRef(null);
  const lenisRef = useRef(null);

  // Core state machine
  const stateRef = useRef({
    currentFrame: 0,
    targetFrame: 0,
    isReady: false,
    animationFrameId: null,
    autoPlayTimeoutId: null,
    scrollBaseline: 0, // The scroll position where frame 0 starts
    lastScrollDirection: 1, // 1 for forward, -1 for backward
    currentPhase: 'loading', // Track phase in ref to avoid closure issues
    isScrolling: false,
    scrollTimeout: null,
    boundaryAnimationTimeout: null,
    lastFrameChangeTime: 0, // Track when last frame changed for rate limiting
    cinematicAnimationId: null, // For automatic cinematic progression
    autoProgressionId: null, // For automatic frame progression after frame 165
  });

  // ============================================================
  // CONFIG - The rules of the experience
  // ============================================================
  const CONFIG = {
    // Frame assets
    imageBaseURL: 'https://cdn.shopify.com/s/files/1/0745/9943/2344/files/Rotoris_world_experience_',
    imageFormat: 'avif',
    paddingZeros: 5,

    // Frame ranges - THE TIMELINE
    totalFrames: 1587, // 0-1586 (1587 frames total)
    autoplayEndFrame: 164, // Phase A: frames 0-164 (autoplay)
    pauseFrame: 164, // Phase B: pause at 164, button appears
    secondPauseFrame: 436, // Phase D: pause at 436, "Scroll More" text appears
    thirdPauseFrame: 742, // Phase E: pause at 742, "Scroll More" text appears
    fourthPauseFrame: 1024, // Phase F: pause at 1024, "Scroll More" text appears
    fifthPauseFrame: 1301, // Phase G: pause at 1301, "Scroll More" text appears
    sixthPauseFrame: 1577, // Phase H: pause at 1577, "Scroll More" text appears
    scrollStartFrame: 0, // Phase C: scroll starts at 0 (can go back to beginning)
    scrollEndFrame: 1586, // Phase C: scroll ends at 1586

    // Timing
    autoPlayFPS: 24,
    autoPlayDelay: 500, // Delay before autoplay starts
    smoothing: 0.08, // Frame interpolation smoothing (lower = smoother, more easing)
    cinematicFPS: 24, // Cinematic frame rate limit during scroll (higher = faster, more responsive)

    // Scroll mapping
    pixelsPerFrame: 40, // How many pixels of scroll = 1 frame (higher = slower, more cinematic)
  };

  // ============================================================
  // HELPERS - Pure functions
  // ============================================================
  const getFramePath = (frameNumber) => {
    const paddedNumber = String(frameNumber).padStart(CONFIG.paddingZeros, '0');
    return `${CONFIG.imageBaseURL}${paddedNumber}.${CONFIG.imageFormat}`;
  };

  // ============================================================
  // FRAME RENDERING - The only thing that changes the visual
  // ============================================================
  const displayFrame = (frameIndex, skipRateLimiting = false) => {
    // Clamp frame to valid range
    frameIndex = Math.max(0, Math.min(CONFIG.totalFrames - 1, Math.floor(frameIndex)));

    // Rate limiting for cinematic effect (except during autoplay or boundary animations)
    if (!skipRateLimiting && stateRef.current.currentPhase === 'scroll-exploration') {
      const now = Date.now();
      const timeSinceLastChange = now - stateRef.current.lastFrameChangeTime;
      const minFrameTime = 1000 / CONFIG.cinematicFPS; // e.g., 24 FPS = ~42ms per frame

      // Only update frame if enough time has passed
      if (timeSinceLastChange < minFrameTime) {
        return; // Skip this frame update to maintain cinematic pace
      }

      stateRef.current.lastFrameChangeTime = now;
    }

    const img = imagesRef.current.get(frameIndex);

    if (img && img.complete && imgRef.current) {
      imgRef.current.src = img.src;
      stateRef.current.currentFrame = frameIndex;
      setCurrentFrameNumber(frameIndex);

      // Show button when we reach the pause frame during autoplay
      if (frameIndex >= CONFIG.pauseFrame && stateRef.current.currentPhase === 'autoplay' && !showButton) {
        setShowButton(true);
      }
    }
  };

  // ============================================================
  // PHASE A - AUTOPLAY (frames 0 → 164)
  // Time controls frames
  // ============================================================
  const startAutoplay = () => {
    console.log('🎬 Phase A: Starting autoplay (frames 0 → 164)');
    setCurrentPhase('autoplay');
    stateRef.current.currentPhase = 'autoplay';

    let currentAutoFrame = 0;
    const frameDelay = 1000 / CONFIG.autoPlayFPS;
    let lastFrameTime = 0;

    const animate = (currentTime) => {
      // Stop if phase changed or reached end
      if (stateRef.current.currentPhase !== 'autoplay' && stateRef.current.currentPhase !== 'loading') return;
      if (currentAutoFrame > CONFIG.autoplayEndFrame) {
        console.log('✅ Phase A complete: Autoplay finished at frame', CONFIG.autoplayEndFrame);
        setCurrentPhase('paused'); // Move to Phase B
        stateRef.current.currentPhase = 'paused';
        return;
      }

      if (currentTime - lastFrameTime >= frameDelay) {
        displayFrame(currentAutoFrame, true); // Skip rate limiting for autoplay
        stateRef.current.targetFrame = currentAutoFrame;
        currentAutoFrame++;
        lastFrameTime = currentTime;
      }

      stateRef.current.autoPlayTimeoutId = requestAnimationFrame(animate);
    };

    stateRef.current.autoPlayTimeoutId = requestAnimationFrame(animate);
  };

  // ============================================================
  // PHASE B - PAUSE + CTA (frame ~164)
  // Frame frozen, button visible, waiting for user action
  // ============================================================
  // This phase is passive - it just waits for button click
  // The button is shown by the autoplay logic when it reaches frame 164

  // ============================================================
  // AUTOMATIC FRAME PROGRESSION - Auto-advance after frame 165 to 436
  // ============================================================
  const startAutoProgression = () => {
    // Stop any existing auto progression
    if (stateRef.current.autoProgressionId) {
      clearInterval(stateRef.current.autoProgressionId);
    }

    const frameDuration = 1000 / CONFIG.autoPlayFPS; // 24 FPS
    console.log('🎬 Starting automatic frame progression from frame 165 to 436');

    stateRef.current.autoProgressionId = setInterval(() => {
      // Stop if user starts scrolling
      if (stateRef.current.isScrolling) {
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⚠️ Auto progression interrupted by scroll');
        return;
      }

      const currentFrame = Math.round(stateRef.current.currentFrame);

      // Continue progressing until we reach frame 436
      if (currentFrame < CONFIG.secondPauseFrame) {
        const nextFrame = currentFrame + 1;
        displayFrame(nextFrame, true);
        stateRef.current.currentFrame = nextFrame;
        stateRef.current.targetFrame = nextFrame;
      } else {
        // Reached frame 436, stop progression and show "Scroll More" text
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⏸️ Auto progression paused at frame 436 - waiting for user scroll');
        setCurrentPhase('paused-at-436');
        stateRef.current.currentPhase = 'paused-at-436';
        setShowScrollMoreText(true);
      }
    }, frameDuration);
  };

  // ============================================================
  // AUTOMATIC FRAME PROGRESSION 2 - Auto-advance after frame 436 to 742
  // ============================================================
  const startAutoProgression2 = () => {
    // Stop any existing auto progression
    if (stateRef.current.autoProgressionId) {
      clearInterval(stateRef.current.autoProgressionId);
    }

    const frameDuration = 1000 / CONFIG.autoPlayFPS; // 24 FPS
    console.log('🎬 Starting automatic frame progression from frame 436 to 742');

    stateRef.current.autoProgressionId = setInterval(() => {
      // Stop if user starts scrolling
      if (stateRef.current.isScrolling) {
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⚠️ Auto progression interrupted by scroll');
        return;
      }

      const currentFrame = Math.round(stateRef.current.currentFrame);

      // Continue progressing until we reach frame 742
      if (currentFrame < CONFIG.thirdPauseFrame) {
        const nextFrame = currentFrame + 1;
        displayFrame(nextFrame, true);
        stateRef.current.currentFrame = nextFrame;
        stateRef.current.targetFrame = nextFrame;
      } else {
        // Reached frame 742, stop progression and show "Scroll More" text
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⏸️ Auto progression paused at frame 742 - waiting for user scroll');
        setCurrentPhase('paused-at-742');
        stateRef.current.currentPhase = 'paused-at-742';
        setShowScrollMoreText742(true);
      }
    }, frameDuration);
  };

  // ============================================================
  // AUTOMATIC FRAME PROGRESSION 3 - Auto-advance after frame 742 to 1024
  // ============================================================
  const startAutoProgression3 = () => {
    // Stop any existing auto progression
    if (stateRef.current.autoProgressionId) {
      clearInterval(stateRef.current.autoProgressionId);
    }

    const frameDuration = 1000 / CONFIG.autoPlayFPS; // 24 FPS
    console.log('🎬 Starting automatic frame progression from frame 742 to 1024');

    stateRef.current.autoProgressionId = setInterval(() => {
      // Stop if user starts scrolling
      if (stateRef.current.isScrolling) {
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⚠️ Auto progression interrupted by scroll');
        return;
      }

      const currentFrame = Math.round(stateRef.current.currentFrame);

      // Continue progressing until we reach frame 1024
      if (currentFrame < CONFIG.fourthPauseFrame) {
        const nextFrame = currentFrame + 1;
        displayFrame(nextFrame, true);
        stateRef.current.currentFrame = nextFrame;
        stateRef.current.targetFrame = nextFrame;
      } else {
        // Reached frame 1024, stop progression and show "Scroll More" text
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⏸️ Auto progression paused at frame 1024 - waiting for user scroll');
        setCurrentPhase('paused-at-1024');
        stateRef.current.currentPhase = 'paused-at-1024';
        setShowScrollMoreText1024(true);
      }
    }, frameDuration);
  };

  // ============================================================
  // AUTOMATIC FRAME PROGRESSION 4 - Auto-advance after frame 1024 to 1301
  // ============================================================
  const startAutoProgression4 = () => {
    // Stop any existing auto progression
    if (stateRef.current.autoProgressionId) {
      clearInterval(stateRef.current.autoProgressionId);
    }

    const frameDuration = 1000 / CONFIG.autoPlayFPS; // 24 FPS
    console.log('🎬 Starting automatic frame progression from frame 1024 to 1301');

    stateRef.current.autoProgressionId = setInterval(() => {
      // Stop if user starts scrolling
      if (stateRef.current.isScrolling) {
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⚠️ Auto progression interrupted by scroll');
        return;
      }

      const currentFrame = Math.round(stateRef.current.currentFrame);

      // Continue progressing until we reach frame 1301
      if (currentFrame < CONFIG.fifthPauseFrame) {
        const nextFrame = currentFrame + 1;
        displayFrame(nextFrame, true);
        stateRef.current.currentFrame = nextFrame;
        stateRef.current.targetFrame = nextFrame;
      } else {
        // Reached frame 1301, stop progression and show "Scroll More" text
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⏸️ Auto progression paused at frame 1301 - waiting for user scroll');
        setCurrentPhase('paused-at-1301');
        stateRef.current.currentPhase = 'paused-at-1301';
        setShowScrollMoreText1301(true);
      }
    }, frameDuration);
  };

  // ============================================================
  // AUTOMATIC FRAME PROGRESSION 5 - Auto-advance after frame 1301 to 1577
  // ============================================================
  const startAutoProgression5 = () => {
    // Stop any existing auto progression
    if (stateRef.current.autoProgressionId) {
      clearInterval(stateRef.current.autoProgressionId);
    }

    const frameDuration = 1000 / CONFIG.autoPlayFPS; // 24 FPS
    console.log('🎬 Starting automatic frame progression from frame 1301 to 1577');

    stateRef.current.autoProgressionId = setInterval(() => {
      // Stop if user starts scrolling
      if (stateRef.current.isScrolling) {
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⚠️ Auto progression interrupted by scroll');
        return;
      }

      const currentFrame = Math.round(stateRef.current.currentFrame);

      // Continue progressing until we reach frame 1577
      if (currentFrame < CONFIG.sixthPauseFrame) {
        const nextFrame = currentFrame + 1;
        displayFrame(nextFrame, true);
        stateRef.current.currentFrame = nextFrame;
        stateRef.current.targetFrame = nextFrame;
      } else {
        // Reached frame 1577, stop progression and show "Scroll More" text
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⏸️ Auto progression paused at frame 1577 - waiting for user scroll');
        setCurrentPhase('paused-at-1577');
        stateRef.current.currentPhase = 'paused-at-1577';
        setShowScrollMoreText1577(true);
      }
    }, frameDuration);
  };

  // ============================================================
  // AUTOMATIC FRAME PROGRESSION 6 - Auto-advance after frame 1577 to end (1586)
  // ============================================================
  const startAutoProgression6 = () => {
    // Stop any existing auto progression
    if (stateRef.current.autoProgressionId) {
      clearInterval(stateRef.current.autoProgressionId);
    }

    const frameDuration = 1000 / CONFIG.autoPlayFPS; // 24 FPS
    console.log('🎬 Starting automatic frame progression from frame 1577 to 1586');

    stateRef.current.autoProgressionId = setInterval(() => {
      // Stop if user starts scrolling
      if (stateRef.current.isScrolling) {
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('⚠️ Auto progression interrupted by scroll');
        return;
      }

      const currentFrame = Math.round(stateRef.current.currentFrame);

      // Continue progressing until we reach frame 1586 (end)
      if (currentFrame < CONFIG.scrollEndFrame) {
        const nextFrame = currentFrame + 1;
        displayFrame(nextFrame, true);
        stateRef.current.currentFrame = nextFrame;
        stateRef.current.targetFrame = nextFrame;
      } else {
        // Reached end frame 1586, stop progression
        clearInterval(stateRef.current.autoProgressionId);
        stateRef.current.autoProgressionId = null;
        console.log('✅ Auto progression complete at frame 1586 - End of sequence');
      }
    }, frameDuration);
  };

  // ============================================================
  // BOUNDARY ANIMATION - Snap to nearest boundary when scroll stops
  // ============================================================
  const animateToBoundary = (direction) => {
    const currentFrame = Math.round(stateRef.current.currentFrame);

    // Determine which zone we're in and target boundary
    let targetBoundary = null;

    if (currentFrame >= 1 && currentFrame <= CONFIG.autoplayEndFrame) {
      // Zone 1: Frames 1-164
      if (direction < 0) {
        targetBoundary = 0; // Snap to frame 0 when scrolling backward
      } else {
        targetBoundary = CONFIG.autoplayEndFrame + 1; // Snap to frame 165 when scrolling forward
      }
    } else if (currentFrame >= CONFIG.autoplayEndFrame + 1 && currentFrame <= CONFIG.scrollEndFrame) {
      // Zone 2: Frames 165-1586
      if (direction < 0) {
        // Scrolling backward from 165-1586 → allow free movement, no snapping
        console.log('📍 Scrolling backward from frames 165-1586 - no boundary animation');
        return;
      } else {
        // Scrolling forward from 165-1586 → snap to 1586
        targetBoundary = CONFIG.scrollEndFrame;
      }
    } else if (currentFrame === 0) {
      // Already at frame 0, no animation needed
      console.log('📍 Already at frame 0');
      return;
    }

    // If no target boundary determined, exit
    if (targetBoundary === null) {
      console.log('📍 No boundary animation needed');
      return;
    }

    // If already at target boundary, don't animate
    if (currentFrame === targetBoundary) {
      console.log('📍 Already at boundary:', targetBoundary);

      // If we're at frame 165, start automatic progression
      if (currentFrame === CONFIG.autoplayEndFrame + 1) {
        console.log('🎯 At frame 165, starting automatic progression');
        startAutoProgression();
      }
      return;
    }

    console.log(`🎯 Animating from frame ${currentFrame} to boundary ${targetBoundary} (direction: ${direction < 0 ? 'backward' : 'forward'})`);

    const frameDuration = 1000 / CONFIG.autoPlayFPS;
    let animFrame = currentFrame;

    const animate = () => {
      // Stop if user starts scrolling again
      if (stateRef.current.isScrolling) {
        console.log('⚠️ Boundary animation interrupted by scroll');
        return;
      }

      // Move one frame toward boundary
      if (targetBoundary < animFrame) {
        animFrame = Math.max(animFrame - 1, targetBoundary);
      } else {
        animFrame = Math.min(animFrame + 1, targetBoundary);
      }

      displayFrame(animFrame, true); // Skip rate limiting for boundary animation
      stateRef.current.targetFrame = animFrame;

      // Continue until we reach boundary
      if (animFrame !== targetBoundary) {
        stateRef.current.boundaryAnimationTimeout = setTimeout(animate, frameDuration);
      } else {
        console.log(`✅ Reached boundary at frame ${targetBoundary}`);

        // If we reached frame 165, start automatic progression
        if (targetBoundary === CONFIG.autoplayEndFrame + 1) {
          console.log('🎯 Reached frame 165, starting automatic progression');
          startAutoProgression();
        }
      }
    };

    animate();
  };

  // ============================================================
  // PHASE C - SCROLL-CONTROLLED EXPERIENCE (frames 164 → 1586)
  // Scroll controls frames
  // ============================================================
  const enterScrollMode = () => {
    console.log('🎬 Phase C: Entering scroll-controlled timeline');

    // Stop any autoplay
    if (stateRef.current.autoPlayTimeoutId) {
      cancelAnimationFrame(stateRef.current.autoPlayTimeoutId);
      stateRef.current.autoPlayTimeoutId = null;
    }

    setCurrentPhase('scroll-exploration');
    stateRef.current.currentPhase = 'scroll-exploration';

    // Calculate fake scroll space for FULL range (0-1586)
    const viewportHeight = window.innerHeight;

    // IMPORTANT: We enter at frame 164, so we need enough space ABOVE to scroll back to frame 0
    // We need EXTRA buffer space to ensure we can keep scrolling even near the top
    const currentFrame = stateRef.current.currentFrame; // Should be 164
    const scrollSpaceForFrames = currentFrame * CONFIG.pixelsPerFrame; // Space needed to scroll back 164 frames
    const scrollSpaceBelow = (CONFIG.scrollEndFrame - currentFrame) * CONFIG.pixelsPerFrame; // Space needed to scroll to 1586

    // Add extra buffer at top to allow comfortable scrolling all the way to frame 0
    // Need LOTS of buffer space to ensure scroll doesn't hit the top before reaching frame 0
    const topBuffer = viewportHeight * 5; // 5 viewports of buffer at top
    const bufferSpace = topBuffer + scrollSpaceForFrames; // Total space above entry point
    const requiredHeight = bufferSpace + scrollSpaceBelow + viewportHeight; // Total height

    // Create/update the scroll container
    const section = document.getElementById('frameSection');
    if (section) {
      section.style.height = `${requiredHeight}px`;
      section.classList.add('scroll-mode');

      // Force reflow
      section.offsetHeight;
    }

    // Calculate where current frame should be in scroll space
    // We're at frame 164, position ourselves so we can scroll up to 0 or down to 1586
    const scrollPosition = bufferSpace; // Start at the position that allows backward scroll

    // Set baseline: we don't use baseline for cinematic mode, frames are controlled directly by scroll events
    stateRef.current.scrollBaseline = topBuffer;

    console.log('📍 Scroll setup:', {
      requiredHeight,
      bufferSpace,
      topBuffer,
      scrollSpaceForFrames,
      scrollSpaceBelow,
      currentFrame,
      scrollPosition,
      baseline: stateRef.current.scrollBaseline,
      pixelsPerFrame: CONFIG.pixelsPerFrame
    });

    // Scroll to position instantly (this is where frame 164 is)
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });

    console.log('🎯 Phase C active: Scroll now controls frames 0 → 1586 (full bidirectional range)');
  };

  // ============================================================
  // CINEMATIC AUTO-PROGRESSION - Frame changes at fixed rate (VIDEO-LIKE)
  // ============================================================
  const startCinematicProgression = (direction) => {
    // Stop any existing cinematic animation
    if (stateRef.current.cinematicAnimationId) {
      clearInterval(stateRef.current.cinematicAnimationId);
    }

    const frameDuration = 1000 / CONFIG.cinematicFPS; // 24 FPS = ~42ms per frame
    console.log(`🎬 Starting cinematic progression: ${direction > 0 ? 'forward' : 'backward'} at ${CONFIG.cinematicFPS} FPS (current frame: ${Math.round(stateRef.current.currentFrame)})`);

    // Use setInterval for precise, consistent frame progression
    stateRef.current.cinematicAnimationId = setInterval(() => {
      if (!stateRef.current.isScrolling) {
        // Stop the video playback
        clearInterval(stateRef.current.cinematicAnimationId);
        stateRef.current.cinematicAnimationId = null;
        return;
      }

      const currentFrame = Math.round(stateRef.current.currentFrame);
      let nextFrame = currentFrame;

      // Move one frame in the scroll direction
      if (direction > 0) {
        nextFrame = Math.min(currentFrame + 1, CONFIG.scrollEndFrame);
      } else if (direction < 0) {
        nextFrame = Math.max(currentFrame - 1, CONFIG.scrollStartFrame);
      }

      // Update frame (like advancing video playback)
      if (nextFrame !== currentFrame) {
        displayFrame(nextFrame, true); // Skip rate limiting, we're controlling the rate here
        stateRef.current.currentFrame = nextFrame;
        stateRef.current.targetFrame = nextFrame;

        // Log progress towards frame 0 when scrolling backward
        if (direction < 0 && nextFrame <= 10) {
          console.log(`📽️ Approaching frame 0: currently at frame ${nextFrame}`);
        }
      } else {
        // Reached boundary, stop playback
        stateRef.current.isScrolling = false;
        clearInterval(stateRef.current.cinematicAnimationId);
        stateRef.current.cinematicAnimationId = null;
        console.log(`🎬 Video reached ${direction > 0 ? 'end' : 'start'} boundary at frame ${nextFrame}`);
      }
    }, frameDuration);
  };

  // ============================================================
  // SCROLL HANDLER - Triggers video-like playback
  // ============================================================
  const handleScroll = () => {
    if (!stateRef.current.isReady) return;

    // Ignore scroll events during auto progression (when autoProgressionId is active)
    if (stateRef.current.autoProgressionId) {
      // Exception: Only handle scroll if we're at a pause point
      const pausePhases = ['paused-at-436', 'paused-at-742', 'paused-at-1024', 'paused-at-1301', 'paused-at-1577'];
      if (!pausePhases.includes(stateRef.current.currentPhase)) {
        return; // Ignore scroll during active auto progression
      }
    }

    // If we're paused at frame 436, start auto progression to 742
    if (stateRef.current.currentPhase === 'paused-at-436') {
      console.log('🎯 User scrolled at frame 436, starting auto progression to frame 742');
      setShowScrollMoreText(false);
      setCurrentPhase('auto-progressing-2');
      stateRef.current.currentPhase = 'auto-progressing-2';
      startAutoProgression2(); // Start automatic progression from 436 to 742
      return; // Exit early, don't handle scroll yet
    }

    // If we're paused at frame 742, start auto progression to 1024
    if (stateRef.current.currentPhase === 'paused-at-742') {
      console.log('🎯 User scrolled at frame 742, starting auto progression to frame 1024');
      setShowScrollMoreText742(false);
      setCurrentPhase('auto-progressing-3');
      stateRef.current.currentPhase = 'auto-progressing-3';
      startAutoProgression3(); // Start automatic progression from 742 to 1024
      return; // Exit early, don't handle scroll yet
    }

    // If we're paused at frame 1024, start auto progression to 1301
    if (stateRef.current.currentPhase === 'paused-at-1024') {
      console.log('🎯 User scrolled at frame 1024, starting auto progression to frame 1301');
      setShowScrollMoreText1024(false);
      setCurrentPhase('auto-progressing-4');
      stateRef.current.currentPhase = 'auto-progressing-4';
      startAutoProgression4(); // Start automatic progression from 1024 to 1301
      return; // Exit early, don't handle scroll yet
    }

    // If we're paused at frame 1301, start auto progression to 1577
    if (stateRef.current.currentPhase === 'paused-at-1301') {
      console.log('🎯 User scrolled at frame 1301, starting auto progression to frame 1577');
      setShowScrollMoreText1301(false);
      setCurrentPhase('auto-progressing-5');
      stateRef.current.currentPhase = 'auto-progressing-5';
      startAutoProgression5(); // Start automatic progression from 1301 to 1577
      return; // Exit early, don't handle scroll yet
    }

    // If we're paused at frame 1577, start auto progression to end
    if (stateRef.current.currentPhase === 'paused-at-1577') {
      console.log('🎯 User scrolled at frame 1577, starting auto progression to frame 1586');
      setShowScrollMoreText1577(false);
      setCurrentPhase('auto-progressing-6');
      stateRef.current.currentPhase = 'auto-progressing-6';
      startAutoProgression6(); // Start automatic progression from 1577 to 1586
      return; // Exit early, don't handle scroll yet
    }

    // Only allow scroll handling in scroll-exploration phase
    if (stateRef.current.currentPhase !== 'scroll-exploration') return;

    const scrollY = window.scrollY;
    const lastScrollY = stateRef.current.lastScrollY || scrollY;
    stateRef.current.lastScrollY = scrollY;

    // Determine scroll direction
    const scrollDirection = scrollY > lastScrollY ? 1 : scrollY < lastScrollY ? -1 : 0;

    // Log when we're getting close to the top (potentially reaching frame 0)
    const currentFrame = Math.round(stateRef.current.currentFrame);
    if (scrollDirection < 0 && currentFrame <= 20 && scrollY < 1000) {
      console.log(`🔍 Near top: frame ${currentFrame}, scrollY: ${scrollY}px`);
    }

    // IMPORTANT: If we hit the top scroll boundary (scrollY <= 10) while scrolling backward,
    // continue the cinematic progression automatically to reach frame 0
    if (scrollY <= 10 && currentFrame > 0 && stateRef.current.lastScrollDirection < 0) {
      console.log(`🎯 Hit top boundary at frame ${currentFrame}, continuing to frame 0...`);

      // Clear any scroll stop timeout to prevent pausing
      if (stateRef.current.scrollTimeout) {
        clearTimeout(stateRef.current.scrollTimeout);
      }

      if (!stateRef.current.isScrolling) {
        stateRef.current.isScrolling = true;
        startCinematicProgression(-1); // Continue backward
      }

      // Keep the progression alive - don't set a pause timeout when at boundary
      return; // Don't process normal scroll logic
    }

    if (scrollDirection !== 0) {
      // Direction changed, restart with new direction
      if (scrollDirection !== stateRef.current.lastScrollDirection && stateRef.current.isScrolling) {
        console.log('↔️ Direction changed, restarting cinematic progression');
        stateRef.current.isScrolling = false;
        if (stateRef.current.cinematicAnimationId) {
          clearInterval(stateRef.current.cinematicAnimationId);
          stateRef.current.cinematicAnimationId = null;
        }
      }

      stateRef.current.lastScrollDirection = scrollDirection;

      // Mark as scrolling and start video playback
      if (!stateRef.current.isScrolling) {
        stateRef.current.isScrolling = true;
        startCinematicProgression(scrollDirection);
      }
    }

    // Clear any existing boundary animation
    if (stateRef.current.boundaryAnimationTimeout) {
      clearTimeout(stateRef.current.boundaryAnimationTimeout);
      stateRef.current.boundaryAnimationTimeout = null;
    }

    // Clear existing scroll stop timeout
    if (stateRef.current.scrollTimeout) {
      clearTimeout(stateRef.current.scrollTimeout);
    }

    // Set timeout to detect when scrolling stops (pause video)
    stateRef.current.scrollTimeout = setTimeout(() => {
      stateRef.current.isScrolling = false;

      // Stop cinematic animation (pause video)
      if (stateRef.current.cinematicAnimationId) {
        clearInterval(stateRef.current.cinematicAnimationId);
        stateRef.current.cinematicAnimationId = null;
      }

      const pausedFrame = Math.round(stateRef.current.currentFrame);
      console.log('⏸️ Video paused at frame:', pausedFrame, '| scrollY:', window.scrollY);

      // Animate to nearest boundary
      animateToBoundary(stateRef.current.lastScrollDirection);
    }, 200); // 200ms after last scroll event (increased for smoother experience)
  };

  // ============================================================
  // BUTTON CLICK - Transition from Phase B to Phase C
  // ============================================================
  const handleButtonClick = () => {
    console.log('🎯 Button clicked: Entering scroll mode immediately');

    // Hide button and show audio icon
    setShowButton(false);
    setShowAudioIcon(true);

    // Play audio
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Audio autoplay blocked:', err);
      });
      setIsAudioPlaying(true);
    }

    // Enter scroll mode immediately at current frame (164)
    enterScrollMode();
  };

  // ============================================================
  // AUDIO CONTROL
  // ============================================================
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play().catch((err) => {
          console.warn('Audio play failed:', err);
        });
        setIsAudioPlaying(true);
      }
    }
  };

  // ============================================================
  // SMOOTH RENDER LOOP - Only for non-scroll phases (autoplay, boundary animation)
  // ============================================================
  useEffect(() => {
    const render = () => {
      // Skip smooth interpolation during scroll-controlled phase
      // The cinematic progression handles frame updates directly
      if (stateRef.current.currentPhase === 'scroll-exploration' && stateRef.current.isScrolling) {
        stateRef.current.animationFrameId = requestAnimationFrame(render);
        return;
      }

      const diff = stateRef.current.targetFrame - stateRef.current.currentFrame;
      const step = diff * CONFIG.smoothing;

      if (Math.abs(diff) > 0.1) {
        displayFrame(stateRef.current.currentFrame + step);
      }

      stateRef.current.animationFrameId = requestAnimationFrame(render);
    };

    if (stateRef.current.isReady) {
      stateRef.current.animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
    };
  }, [isLoading]);

  // ============================================================
  // LOADING PROGRESS ANIMATION
  // ============================================================
  useEffect(() => {
    const loadingDuration = 4000; // 4 seconds

    const animateProgress = (currentTime) => {
      if (!progressStartTimeRef.current) {
        progressStartTimeRef.current = currentTime;
      }

      const elapsed = currentTime - progressStartTimeRef.current;
      const progress = Math.min(elapsed / loadingDuration, 1);
      const percent = Math.round(progress * 100);

      setLoadingPercent(percent);

      if (progress < 1) {
        progressAnimationRef.current = requestAnimationFrame(animateProgress);
      } else {
        // Progress complete
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    progressAnimationRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
      }
    };
  }, []);

  // ============================================================
  // LENIS SMOOTH SCROLL SETUP
  // ============================================================
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2, // Scroll duration (higher = slower, smoother)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Lenis animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    console.log('✨ Lenis smooth scroll initialized');

    return () => {
      lenis.destroy();
      console.log('🗑️ Lenis destroyed');
    };
  }, []);

  // ============================================================
  // IMAGE PRELOADING & SETUP
  // ============================================================
  useEffect(() => {
    let loadedCount = 0;

    const loadImages = async () => {
      console.log(`📦 Preloading ${CONFIG.totalFrames} frames...`);

      for (let i = 0; i < CONFIG.totalFrames; i++) {
        const img = new Image();

        img.onload = () => {
          loadedCount++;

          // Display first frame immediately
          if (loadedCount === 1 && imgRef.current) {
            imgRef.current.src = img.src;
          }

          // When enough frames loaded, start experience
          if (loadedCount === CONFIG.autoplayEndFrame + 1) { // Load frames 0-164
            console.log('✅ Initial frames loaded, ready to start');
            stateRef.current.isReady = true;

            // Start autoplay after delay
            setTimeout(() => {
              startAutoplay();
            }, CONFIG.autoPlayDelay);
          }
        };

        img.onerror = () => {
          console.warn(`Failed to load: ${getFramePath(i)}`);
          loadedCount++;
        };

        img.src = getFramePath(i);
        imagesRef.current.set(i, img);
      }
    };

    loadImages();

    // Setup scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (stateRef.current.autoPlayTimeoutId) {
        cancelAnimationFrame(stateRef.current.autoPlayTimeoutId);
      }

      // Clean up scroll timeout
      if (stateRef.current.scrollTimeout) {
        clearTimeout(stateRef.current.scrollTimeout);
      }

      // Clean up boundary animation timeout
      if (stateRef.current.boundaryAnimationTimeout) {
        clearTimeout(stateRef.current.boundaryAnimationTimeout);
      }

      // Clean up cinematic animation interval
      if (stateRef.current.cinematicAnimationId) {
        clearInterval(stateRef.current.cinematicAnimationId);
      }

      // Clean up auto progression interval
      if (stateRef.current.autoProgressionId) {
        clearInterval(stateRef.current.autoProgressionId);
      }
    };
  }, []);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="/experience-sound.mp3"
        preload="auto"
        loop
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="frame-loading-overlay">
          <video
            className="frame-loading-video"
            src="/web-loader.mp4"
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
          />

          <div className="frame-loading-progress">
            <div
              className="frame-loading-bar"
              style={{ width: `${loadingPercent}%` }}
            />
          </div>

          <div className="frame-loading-percentage">
            {loadingPercent}%
          </div>
        </div>
      )}

      {/* Frame Sequence Section - The Pinned Stage */}
      <section
        className={`frame-sequence-section ${(currentPhase === 'scroll-exploration' || currentPhase === 'paused-at-436' || currentPhase === 'auto-progressing-2' || currentPhase === 'paused-at-742' || currentPhase === 'auto-progressing-3' || currentPhase === 'paused-at-1024' || currentPhase === 'auto-progressing-4' || currentPhase === 'paused-at-1301' || currentPhase === 'auto-progressing-5' || currentPhase === 'paused-at-1577' || currentPhase === 'auto-progressing-6') ? 'scroll-mode' : ''}`}
        id="frameSection"
      >
        {/* The canvas - either normal or sticky */}
        <div className={(currentPhase === 'scroll-exploration' || currentPhase === 'paused-at-436' || currentPhase === 'auto-progressing-2' || currentPhase === 'paused-at-742' || currentPhase === 'auto-progressing-3' || currentPhase === 'paused-at-1024' || currentPhase === 'auto-progressing-4' || currentPhase === 'paused-at-1301' || currentPhase === 'auto-progressing-5' || currentPhase === 'paused-at-1577' || currentPhase === 'auto-progressing-6') ? 'sticky-frame-container' : 'frame-container'}>
          <img
            ref={imgRef}
            id="currentFrame"
            alt="Rotoris world experience"
            className="frame-image"
          />
        </div>

        {/* Hero Content - Phase A & B */}
        {(currentPhase === 'autoplay' || currentPhase === 'paused') && (
          <div className="hero-content">
            <h2 className="hero-tagline visible">FOR THOSE WHO</h2>
            <h1 className="hero-title visible">BECOME MORE</h1>
            {showButton && (
              <button
                className="hero-button visible"
                onClick={handleButtonClick}
              >
                Enter Experience
              </button>
            )}
          </div>
        )}

        {/* Scroll More Text - Pause at Frame 436 */}
        {showScrollMoreText && currentPhase === 'paused-at-436' && (
          <div className="scroll-more-content">
            <p className="scroll-more-text">Scroll More</p>
          </div>
        )}

        {/* Scroll More Text - Pause at Frame 742 */}
        {showScrollMoreText742 && currentPhase === 'paused-at-742' && (
          <div className="scroll-more-content">
            <p className="scroll-more-text">Scroll More</p>
          </div>
        )}

        {/* Scroll More Text - Pause at Frame 1024 */}
        {showScrollMoreText1024 && currentPhase === 'paused-at-1024' && (
          <div className="scroll-more-content">
            <p className="scroll-more-text">Scroll More</p>
          </div>
        )}

        {/* Scroll More Text - Pause at Frame 1301 */}
        {showScrollMoreText1301 && currentPhase === 'paused-at-1301' && (
          <div className="scroll-more-content">
            <p className="scroll-more-text">Scroll More</p>
          </div>
        )}

        {/* Scroll More Text - Pause at Frame 1577 */}
        {showScrollMoreText1577 && currentPhase === 'paused-at-1577' && (
          <div className="scroll-more-content">
            <p className="scroll-more-text">Scroll More</p>
          </div>
        )}

        {/* Audio Icon - Phase C */}
        {showAudioIcon && (
          <div className="audio-icon" onClick={toggleAudio} title={isAudioPlaying ? "Mute audio" : "Play audio"}>
            {isAudioPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </div>
        )}

        {/* Navigation Dots */}
        {!isLoading && (
          <div className="nav-dots">
            {/* Dot 1: Phase A+B (Frames 0-164) */}
            <div
              className="nav-dot"
              style={{
                height: currentFrameNumber >= 0 && currentFrameNumber <= 164
                  ? `${8 + (currentFrameNumber / 164) * 32}px`
                  : currentFrameNumber > 164 ? '40px' : '8px',
                background: currentFrameNumber <= 164 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)'
              }}
            />
            {/* Dot 2: Phase C (Frames 165-1586) */}
            <div
              className="nav-dot"
              style={{
                height: currentFrameNumber >= 165 && currentFrameNumber <= 1586
                  ? `${8 + ((currentFrameNumber - 165) / 1421) * 32}px`
                  : '8px',
                background: currentFrameNumber >= 165 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)'
              }}
            />
          </div>
        )}
      </section>
    </>
  );
};

export default FrameSequence;
