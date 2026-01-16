import { useEffect, useRef, useState } from 'react';
import './FrameSequence.css';

const FrameSequence = () => {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTagline, setShowTagline] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [hideText, setHideText] = useState(false);
  const [isScrollMode, setIsScrollMode] = useState(false);
  const [showAudioIcon, setShowAudioIcon] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(0);

  const imgRef = useRef(null);
  const imagesRef = useRef(new Map());
  const progressAnimationRef = useRef(null);
  const progressStartTimeRef = useRef(null);
  const audioRef = useRef(null);
  const stateRef = useRef({
    currentFrame: 0,
    targetFrame: 0,
    isReady: false,
    animationFrameId: null,
    isScrollMode: false,
    scrollStartFrame: 163,
    scrollBaseline: 0,
    isAnimatingToEnd: false,
    buttonAnimationTimeout: null,
    lastLogTime: 0,
    framesLoaded: false,
    isScrolling: false,
    scrollTimeout: null,
    lastScrollDirection: 0, // 1 for forward, -1 for backward
  });

  const CONFIG = {
    imageBaseURL: '/Rotoris_world_experience_',
    imageFormat: 'avif.jpeg',
    totalFrames: 164,
    maxFrames: 401,
    startFrame: 0,
    paddingZeros: 5,
    scrollMultiplier: 1.5,
    smoothing: 0.1,
    autoPlayOnLoad: true,
    autoPlayFPS: 24,
    autoPlayDelay: 500,
    scrollEndFrame: 400,
    pixelsPerFrame: 15, // 15 pixels per frame = ultra slow, cinematic scrolling
    phase2StartFrame: 164, // Phase 2 starts at frame 165 (index 164)
    scrollStopDelay: 150, // ms to wait after scroll stops before continuing animation
  };

  // Get frame path
  const getFramePath = (frameNumber) => {
    const paddedNumber = String(frameNumber).padStart(CONFIG.paddingZeros, '0');
    return `${CONFIG.imageBaseURL}${paddedNumber}.${CONFIG.imageFormat}`;
  };

  // Display frame
  const displayFrame = (frameIndex) => {
    frameIndex = Math.max(0, Math.min(CONFIG.maxFrames - 1, Math.floor(frameIndex)));

    const img = imagesRef.current.get(frameIndex);

    if (img && img.complete && imgRef.current) {
      imgRef.current.src = img.src;
      stateRef.current.currentFrame = frameIndex;

      // Store current frame number for dots
      setCurrentFrameNumber(frameIndex);

      // Staggered text appearance based on frame progress (only for first 164 frames)
      if (frameIndex < CONFIG.totalFrames) {
        const progress = frameIndex / CONFIG.totalFrames;

        if (progress >= 0.5 && !showTagline) {
          setShowTagline(true);
        }

        if (progress >= 0.52 && !showTitle) {
          setShowTitle(true);
        }

        if (progress >= 0.98 && !showButton) {
          setShowButton(true);
        }
      }
    }
  };

  // Animate to phase boundary when user stops scrolling
  const animateToPhaseEnd = (direction) => {
    if (!stateRef.current.isScrollMode) return;

    const currentFrame = Math.round(stateRef.current.currentFrame);
    let targetBoundary;

    // Determine which boundary to animate to based on direction
    if (direction > 0) {
      // Scrolling forward (frames increasing) - go to end of phase (frame 400)
      targetBoundary = CONFIG.scrollEndFrame;
    } else {
      // Scrolling backward (frames decreasing) - go to start of phase 2 (frame 165)
      targetBoundary = CONFIG.phase2StartFrame + 1; // Frame 165
    }

    // If already at the boundary, don't animate
    if (currentFrame === targetBoundary) return;

    console.log(`🎯 Animating from frame ${currentFrame} to phase boundary ${targetBoundary} (direction: ${direction > 0 ? 'forward' : 'backward'})`);

    // Start animation
    stateRef.current.isAnimatingToEnd = true;
    const frameDuration = 1000 / CONFIG.autoPlayFPS;
    let animFrame = currentFrame;

    const animate = () => {
      if (!stateRef.current.isAnimatingToEnd) {
        console.log('Phase boundary animation interrupted');
        return;
      }

      // Move one frame in the direction
      if (direction > 0) {
        animFrame = Math.min(animFrame + 1, targetBoundary);
      } else {
        animFrame = Math.max(animFrame - 1, targetBoundary);
      }

      displayFrame(animFrame);
      stateRef.current.targetFrame = animFrame;

      // Continue until we reach the boundary
      if (animFrame !== targetBoundary) {
        stateRef.current.buttonAnimationTimeout = setTimeout(animate, frameDuration);
      } else {
        console.log(`✅ Reached phase boundary at frame ${targetBoundary}`);
        stateRef.current.isAnimatingToEnd = false;
      }
    };

    animate();
  };

  // Handle scroll
  const handleScroll = () => {
    if (!stateRef.current.isReady) return;

    const section = document.getElementById('frameSection');
    if (!section) return;

    // If animating after button click, user scroll interrupts it
    if (stateRef.current.isAnimatingToEnd) {
      if (stateRef.current.buttonAnimationTimeout) {
        clearTimeout(stateRef.current.buttonAnimationTimeout);
        stateRef.current.buttonAnimationTimeout = null;
      }
      stateRef.current.isAnimatingToEnd = false;

      const currentDisplayFrame = stateRef.current.currentFrame;
      const middleScroll = 20000;

      // Calculate scroll position for current frame
      // Frame 400 = 20000px, Frame 0 = 14000px (20000 - 400*15)
      // For frame 250: 20000 - (400-250)*15 = 20000 - 2250 = 17750px
      const scrollPosition = middleScroll - (CONFIG.scrollEndFrame - currentDisplayFrame) * CONFIG.pixelsPerFrame;

      // Scroll to calculated position instantly (with space above for backward scrolling)
      window.scrollTo({ top: scrollPosition, behavior: 'instant' });

      // Set proper baseline and scroll mode (same as when reaching frame 400)
      stateRef.current.isScrollMode = true;
      stateRef.current.scrollStartFrame = CONFIG.scrollEndFrame; // Always 400 for consistency
      stateRef.current.scrollBaseline = middleScroll; // 20000px
      stateRef.current.targetFrame = currentDisplayFrame;
      setIsScrollMode(true);

      if (section) {
        section.style.pointerEvents = 'auto';
      }

      console.log('⚡ Animation interrupted at frame:', currentDisplayFrame);
      console.log('📍 Scroll positioned at:', scrollPosition, 'px (baseline: ' + middleScroll + 'px)');
      console.log('🎯 Can now scroll backward to reach frame 0');
    }

    // If in scroll mode (after button click)
    if (stateRef.current.isScrollMode) {
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - stateRef.current.scrollBaseline;
      const frameDelta = scrollDelta / CONFIG.pixelsPerFrame;
      const targetFrame = stateRef.current.scrollStartFrame + frameDelta;
      const clampedFrame = Math.max(0, Math.min(CONFIG.scrollEndFrame, targetFrame));

      // Detect scroll direction
      const direction = clampedFrame - stateRef.current.targetFrame;
      if (Math.abs(direction) > 0.1) {
        stateRef.current.lastScrollDirection = direction > 0 ? 1 : -1;
      }

      stateRef.current.targetFrame = clampedFrame;
      stateRef.current.isScrolling = true;

      // Clear existing timeout
      if (stateRef.current.scrollTimeout) {
        clearTimeout(stateRef.current.scrollTimeout);
      }

      // Set new timeout to detect when scrolling stops
      stateRef.current.scrollTimeout = setTimeout(() => {
        stateRef.current.isScrolling = false;

        // Only animate to phase boundary if we're in phase 2 and not at the boundaries
        const currentFrame = Math.round(stateRef.current.currentFrame);
        if (currentFrame > CONFIG.phase2StartFrame && currentFrame < CONFIG.scrollEndFrame) {
          console.log('📍 Scroll stopped at frame:', currentFrame);
          animateToPhaseEnd(stateRef.current.lastScrollDirection);
        }
      }, CONFIG.scrollStopDelay);

      // Debug logging - throttled
      if (!stateRef.current.lastLogTime || Date.now() - stateRef.current.lastLogTime > 100) {
        console.log('🔄 Scroll:', {
          scrollY: Math.round(scrollY),
          baseline: Math.round(stateRef.current.scrollBaseline),
          scrollDelta: Math.round(scrollDelta),
          frameDelta: Math.round(frameDelta * 10) / 10,
          targetFrame: Math.round(clampedFrame),
        });
        stateRef.current.lastLogTime = Date.now();
      }

      return;
    }

    // Original scroll behavior (before button click)
    const rect = section.getBoundingClientRect();
    const scrollStart = -rect.top;
    const scrollEnd = rect.height - window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(1, scrollStart / scrollEnd));

    stateRef.current.targetFrame = scrollProgress * (CONFIG.totalFrames - 1);
  };

  // Toggle audio play/pause
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

  // Handle button click
  const handleButtonClick = () => {
    console.log('🎬 Button clicked, starting animation from frame:', stateRef.current.currentFrame);

    // Play audio and show icon
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Audio autoplay blocked:', err);
      });
      setIsAudioPlaying(true);
    }
    setShowAudioIcon(true);

    setHideText(true);
    setIsScrollMode(true);
    stateRef.current.isAnimatingToEnd = true;

    const startFrame = stateRef.current.currentFrame;
    const endFrame = CONFIG.scrollEndFrame;
    const frameDuration = 1000 / CONFIG.autoPlayFPS;
    let currentAnimFrame = startFrame;

    const animateToEnd = () => {
      if (!stateRef.current.isAnimatingToEnd) {
        console.log('Animation was interrupted');
        return;
      }

      if (currentAnimFrame < endFrame) {
        currentAnimFrame++;
        displayFrame(currentAnimFrame);
        stateRef.current.targetFrame = currentAnimFrame;

        if (currentAnimFrame % 50 === 0) {
          console.log('Animation progress:', currentAnimFrame, '/', endFrame);
        }

        stateRef.current.buttonAnimationTimeout = setTimeout(animateToEnd, frameDuration);
      } else {
        console.log('✅ Animation complete at frame:', currentAnimFrame);
        console.log('🖱️ Switching to scroll mode (frames 0-400)...');

        stateRef.current.isAnimatingToEnd = false;

        // Set to exactly frame 400 to ensure proper calculation
        stateRef.current.isScrollMode = true;
        stateRef.current.scrollStartFrame = 400;
        stateRef.current.targetFrame = 400;

        setTimeout(() => {
          // Enable scroll mode
          setIsScrollMode(true);

          // Wait for section height to update, then scroll using native browser scroll
          setTimeout(() => {
            // Scroll to 20000px position using NATIVE scroll (massive scroll space above to reach frame 0)
            const middleScroll = 20000;
            const pixelsToReachZero = 400 * CONFIG.pixelsPerFrame; // 400 frames * 3 = 1200 pixels
            window.scrollTo({ top: middleScroll, behavior: 'instant' });

            stateRef.current.scrollBaseline = middleScroll;

            console.log('📍 Scroll baseline set at Y:', middleScroll, 'px - Frame: 400');
            console.log('📊 With pixelsPerFrame=' + CONFIG.pixelsPerFrame + ', you need ' + pixelsToReachZero + ' pixels to reach frame 0');
            console.log('💡 Available scroll space above:', middleScroll, 'pixels - DEFINITELY can reach frame 0');
            console.log('🎯 Scroll to Y=' + (middleScroll - pixelsToReachZero) + ' will show frame 0');
            console.log('🎯 Native scroll enabled - scroll is now 6x slower and smoother!');
          }, 100);
        }, 100);
      }
    };

    animateToEnd();
  };

  // Smooth render loop
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

  // Auto-play
  const autoPlay = () => {
    let currentAutoFrame = 0;
    const frameDelay = 1000 / CONFIG.autoPlayFPS;
    let lastFrameTime = 0;

    const animate = (currentTime) => {
      if (currentTime - lastFrameTime >= frameDelay) {
        if (currentAutoFrame >= CONFIG.totalFrames) {
          return;
        }

        displayFrame(currentAutoFrame);
        stateRef.current.targetFrame = currentAutoFrame;
        currentAutoFrame++;
        lastFrameTime = currentTime;
      }

      if (currentAutoFrame < CONFIG.totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Animate progress bar from 0 to 100% over fixed duration
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
        // Progress complete - hide loading screen
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

  // Preload images
  useEffect(() => {
    let loadedCount = 0;

    const loadImages = async () => {
      for (let i = 0; i < CONFIG.maxFrames; i++) {
        const frameNumber = CONFIG.startFrame + i;
        const img = new Image();

        img.onload = () => {
          loadedCount++;

          if (loadedCount === 1 && imgRef.current) {
            imgRef.current.src = img.src;
          }

          if (loadedCount === CONFIG.totalFrames) {
            stateRef.current.framesLoaded = true;
            stateRef.current.isReady = true;

            if (CONFIG.autoPlayOnLoad) {
              setTimeout(() => {
                autoPlay();
              }, CONFIG.autoPlayDelay);
            }
          }
        };

        img.onerror = () => {
          console.warn(`Failed to load: ${getFramePath(frameNumber)}`);
          loadedCount++;

          if (loadedCount === CONFIG.totalFrames) {
            stateRef.current.framesLoaded = true;
            stateRef.current.isReady = true;
          }
        };

        img.src = getFramePath(frameNumber);
        imagesRef.current.set(i, img);
      }
    };

    loadImages();

    // Setup scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);

      // Clean up scroll timeout
      if (stateRef.current.scrollTimeout) {
        clearTimeout(stateRef.current.scrollTimeout);
      }

      // Clean up button animation timeout
      if (stateRef.current.buttonAnimationTimeout) {
        clearTimeout(stateRef.current.buttonAnimationTimeout);
      }
    };
  }, []);


  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="/experience-sound.mp3"
        preload="auto"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="frame-loading-overlay">
          {/* Video */}
          <video
            className="frame-loading-video"
            src="/web-loader.mp4"
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
          />

          {/* Progress Bar */}
          <div className="frame-loading-progress">
            <div
              className="frame-loading-bar"
              style={{ width: `${loadingPercent}%` }}
            />
          </div>

          {/* Percentage Counter */}
          <div className="frame-loading-percentage">
            {loadingPercent}%
          </div>
        </div>
      )}

      {/* Frame Sequence Section */}
      <section
        className={`frame-sequence-section ${isScrollMode ? 'scroll-mode' : ''}`}
        id="frameSection"
        style={isScrollMode ? { height: '10000vh' } : {}}
      >
        {/* Sticky container for scroll mode */}
        <div className={isScrollMode ? 'sticky-frame-container' : 'frame-container'}>
          <img
            ref={imgRef}
            id="currentFrame"
            alt="Rotoris world experience"
            className="frame-image"
          />
        </div>

        {/* Center Text Overlay - Stays Fixed */}
        {!hideText && (
          <div className="hero-content">
            <h2 className={`hero-tagline ${showTagline ? 'visible' : ''}`}>FOR THOSE WHO</h2>
            <h1 className={`hero-title ${showTitle ? 'visible' : ''}`}>BECOME MORE</h1>
            <button className={`hero-button ${showButton ? 'visible' : ''}`} onClick={handleButtonClick}>Enter Experience</button>
          </div>
        )}

        {/* Audio Icon - Shows after button click */}
        {showAudioIcon && (
          <div className="audio-icon" onClick={toggleAudio} title={isAudioPlaying ? "Mute audio" : "Play audio"}>
            {isAudioPlaying ? (
              // Playing - speaker with sound waves
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              // Muted - speaker with X
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </div>
        )}

        {/* Navigation Dots - Right Side */}
        {!isLoading && (
          <div className="nav-dots">
            {/* Dot 1: Frames 1-165 */}
            <div
              id="phase-dot-1"
              className="nav-dot"
              style={{
                height: currentFrameNumber >= 1 && currentFrameNumber <= 165
                  ? `${8 + ((currentFrameNumber - 1) / 164) * 32}px`
                  : currentFrameNumber > 165 ? '8px' : '8px'
              }}
            />
            {/* Dot 2: Frames 165-400 */}
            <div
              id="phase-dot-2"
              className="nav-dot"
              style={{
                height: currentFrameNumber >= 165 && currentFrameNumber <= 400
                  ? `${8 + ((currentFrameNumber - 165) / 235) * 32}px`
                  : '8px'
              }}
            />
          </div>
        )}

      </section>
    </>
  );
};

export default FrameSequence;
