import { useEffect, useRef, useState } from 'react';
import './FrameSequence.css';

const FrameSequence = () => {
  // ============================================================
  // STATE - What the UI needs to know
  // ============================================================
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('loading'); // 'loading', 'autoplay', 'paused', 'scroll-exploration'
  const [showButton, setShowButton] = useState(false);
  const [showAudioIcon, setShowAudioIcon] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(0);

  // ============================================================
  // REFS - Persistent data that doesn't trigger re-renders
  // ============================================================
  const imgRef = useRef(null);
  const imagesRef = useRef(new Map());
  const audioRef = useRef(null);
  const progressAnimationRef = useRef(null);
  const progressStartTimeRef = useRef(null);

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
  });

  // ============================================================
  // CONFIG - The rules of the experience
  // ============================================================
  const CONFIG = {
    // Frame assets
    imageBaseURL: '/Rotoris_world_experience_',
    imageFormat: 'avif.jpeg',
    paddingZeros: 5,

    // Frame ranges - THE TIMELINE
    totalFrames: 401, // 0-400 (401 frames total)
    autoplayEndFrame: 164, // Phase A: frames 0-164 (autoplay)
    pauseFrame: 164, // Phase B: pause at 164, button appears
    scrollStartFrame: 0, // Phase C: scroll starts at 0 (can go back to beginning)
    scrollEndFrame: 400, // Phase C: scroll ends at 400

    // Timing
    autoPlayFPS: 24,
    autoPlayDelay: 500, // Delay before autoplay starts
    smoothing: 0.15, // Frame interpolation smoothing

    // Scroll mapping
    pixelsPerFrame: 15, // How many pixels of scroll = 1 frame (slower = more pixels)
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
  const displayFrame = (frameIndex) => {
    // Clamp frame to valid range
    frameIndex = Math.max(0, Math.min(CONFIG.totalFrames - 1, Math.floor(frameIndex)));

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
        displayFrame(currentAutoFrame);
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
  // BOUNDARY ANIMATION - Snap to nearest boundary when scroll stops
  // ============================================================
  const animateToBoundary = (direction) => {
    const currentFrame = Math.round(stateRef.current.currentFrame);

    // Only animate to boundary if we're in the "experience zone" (frames 165-400)
    // Frames 0-164 can be freely scrolled without auto-animation
    if (currentFrame <= CONFIG.autoplayEndFrame) {
      console.log('📍 In free scroll zone (0-164), no boundary animation');
      return;
    }

    // We're in frames 165-400, determine target boundary
    let targetBoundary;
    if (direction < 0) {
      // Scrolling backward (up) → go to frame 165
      targetBoundary = CONFIG.autoplayEndFrame + 1; // Frame 165
    } else {
      // Scrolling forward (down) → go to frame 400
      targetBoundary = CONFIG.scrollEndFrame; // Frame 400
    }

    // If already at boundary, don't animate
    if (currentFrame === targetBoundary) {
      console.log('📍 Already at boundary:', targetBoundary);
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
      if (direction < 0) {
        animFrame = Math.max(animFrame - 1, targetBoundary);
      } else {
        animFrame = Math.min(animFrame + 1, targetBoundary);
      }

      displayFrame(animFrame);
      stateRef.current.targetFrame = animFrame;

      // Continue until we reach boundary
      if (animFrame !== targetBoundary) {
        stateRef.current.boundaryAnimationTimeout = setTimeout(animate, frameDuration);
      } else {
        console.log(`✅ Reached boundary at frame ${targetBoundary}`);
      }
    };

    animate();
  };

  // ============================================================
  // PHASE C - SCROLL-CONTROLLED EXPERIENCE (frames 164 → 400)
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

    // Calculate fake scroll space for FULL range (0-400)
    const scrollRange = CONFIG.scrollEndFrame - CONFIG.scrollStartFrame; // 400 - 0 = 400 frames
    const totalScrollSpace = scrollRange * CONFIG.pixelsPerFrame; // 400 * 15 = 6000px
    const viewportHeight = window.innerHeight;
    const bufferSpace = viewportHeight * 2; // 2 viewports of buffer space at top
    const requiredHeight = bufferSpace + totalScrollSpace + viewportHeight; // Buffer + scroll space + viewport

    // Create/update the scroll container
    const section = document.getElementById('frameSection');
    if (section) {
      section.style.height = `${requiredHeight}px`;
      section.classList.add('scroll-mode');

      // Force reflow
      section.offsetHeight;
    }

    // Calculate where current frame should be in scroll space
    // Frame 0 starts at bufferSpace position
    const currentFrame = stateRef.current.currentFrame;
    const frameOffsetFromStart = currentFrame - CONFIG.scrollStartFrame; // How many frames from start (0)
    const scrollPosition = bufferSpace + (frameOffsetFromStart * CONFIG.pixelsPerFrame);

    // Set baseline: this is where frame 0 begins
    stateRef.current.scrollBaseline = bufferSpace;

    console.log('📍 Scroll setup:', {
      requiredHeight,
      bufferSpace,
      scrollRange,
      totalScrollSpace,
      currentFrame,
      scrollPosition,
      baseline: stateRef.current.scrollBaseline
    });

    // Scroll to position instantly
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });

    console.log('🎯 Phase C active: Scroll now controls frames 0 → 400 (full bidirectional range)');
  };

  // ============================================================
  // SCROLL HANDLER - Maps scroll distance to frame number
  // ============================================================
  const handleScroll = () => {
    if (!stateRef.current.isReady) return;
    if (stateRef.current.currentPhase !== 'scroll-exploration') return;

    const scrollY = window.scrollY;

    // Calculate scroll distance from baseline (where frame 164 starts)
    const scrollDelta = scrollY - stateRef.current.scrollBaseline;

    // Convert scroll distance to frame offset
    const frameOffset = scrollDelta / CONFIG.pixelsPerFrame;

    // Target frame = start frame + offset
    const targetFrame = CONFIG.scrollStartFrame + frameOffset;

    // Clamp to valid range
    const clampedFrame = Math.max(
      CONFIG.scrollStartFrame,
      Math.min(CONFIG.scrollEndFrame, targetFrame)
    );

    // Track scroll direction
    const direction = clampedFrame - stateRef.current.targetFrame;
    if (Math.abs(direction) > 0.1) {
      stateRef.current.lastScrollDirection = direction > 0 ? 1 : -1;
    }

    // Update target - smooth render loop will handle the actual display
    stateRef.current.targetFrame = clampedFrame;
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
  // SMOOTH RENDER LOOP - Interpolates between current and target
  // ============================================================
  useEffect(() => {
    const render = () => {
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
        className={`frame-sequence-section ${currentPhase === 'scroll-exploration' ? 'scroll-mode' : ''}`}
        id="frameSection"
      >
        {/* The canvas - either normal or sticky */}
        <div className={currentPhase === 'scroll-exploration' ? 'sticky-frame-container' : 'frame-container'}>
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
            {/* Dot 2: Phase C (Frames 165-400) */}
            <div
              className="nav-dot"
              style={{
                height: currentFrameNumber >= 165 && currentFrameNumber <= 400
                  ? `${8 + ((currentFrameNumber - 165) / 235) * 32}px`
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
