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

  const imgRef = useRef(null);
  const imagesRef = useRef(new Map());
  const stateRef = useRef({
    currentFrame: 0,
    targetFrame: 0,
    isReady: false,
    animationFrameId: null,
    isScrollMode: false, // Track if we're in scroll-controlled mode
    scrollStartFrame: 163, // Starting frame for scroll after button click
    scrollBaseline: 0, // Scroll Y position when scroll mode starts
    isAnimatingToEnd: false, // Track if button animation is running
    buttonAnimationTimeout: null, // Store animation timeout ID
    lastLogTime: 0, // For debug logging throttle
  });

  const CONFIG = {
    imageBaseURL: '/Rotoris_world_experience_',
    imageFormat: 'avif.jpeg',
    totalFrames: 164,
    maxFrames: 401, // Total available frames (0-400)
    startFrame: 0,
    paddingZeros: 5,
    scrollMultiplier: 1.5,
    smoothing: 0.1,
    autoPlayOnLoad: true,
    autoPlayFPS: 24,
    autoPlayDelay: 500,
    scrollEndFrame: 400, // End frame for scroll mode after button click
    pixelsPerFrame: 0.00625, // Extreme sensitivity - 1 pixel = 160 frames (0.00625 pixels per frame)
  };

  // Get frame path
  const getFramePath = (frameNumber) => {
    const paddedNumber = String(frameNumber).padStart(CONFIG.paddingZeros, '0');
    return `${CONFIG.imageBaseURL}${paddedNumber}.${CONFIG.imageFormat}`;
  };

  // Display frame
  const displayFrame = (frameIndex) => {
    // Allow frames up to maxFrames (400) for button animation
    frameIndex = Math.max(0, Math.min(CONFIG.maxFrames - 1, Math.floor(frameIndex)));

    const img = imagesRef.current.get(frameIndex);

    if (img && img.complete && imgRef.current) {
      imgRef.current.src = img.src;
      stateRef.current.currentFrame = frameIndex;

      // Show current frame number on screen for debugging
      if (stateRef.current.isScrollMode) {
        const debugDiv = document.getElementById('frame-debug');
        if (debugDiv) {
          debugDiv.textContent = `Frame: ${Math.round(frameIndex)}`;
        }
      }

      // Staggered text appearance based on frame progress (only for first 164 frames)
      if (frameIndex < CONFIG.totalFrames) {
        const progress = frameIndex / CONFIG.totalFrames;

        // Show tagline around 50% (middle frames)
        if (progress >= 0.5 && !showTagline) {
          setShowTagline(true);
        }

        // Show title right after at 52% (very close to tagline)
        if (progress >= 0.52 && !showTitle) {
          setShowTitle(true);
        }

        // Show button at 98% (almost at the very end)
        if (progress >= 0.98 && !showButton) {
          setShowButton(true);
        }
      }
    }
  };

  // Handle scroll
  const handleScroll = () => {
    if (!stateRef.current.isReady) return;

    const section = document.getElementById('frameSection');
    if (!section) return;

    // If animating after button click, user scroll interrupts it
    if (stateRef.current.isAnimatingToEnd) {
      // Stop the animation
      if (stateRef.current.buttonAnimationTimeout) {
        clearTimeout(stateRef.current.buttonAnimationTimeout);
        stateRef.current.buttonAnimationTimeout = null;
      }
      stateRef.current.isAnimatingToEnd = false;

      // Get current scroll position and frame
      const currentScrollY = window.scrollY;
      const currentDisplayFrame = stateRef.current.currentFrame;

      // Enable scroll mode immediately from current frame
      stateRef.current.isScrollMode = true;
      stateRef.current.scrollStartFrame = currentDisplayFrame;
      stateRef.current.scrollBaseline = currentScrollY;
      stateRef.current.targetFrame = currentDisplayFrame;
      setIsScrollMode(true);

      // Re-enable scroll
      if (section) {
        section.style.pointerEvents = 'auto';
      }

      console.log('⚡ Animation interrupted by scroll at frame:', currentDisplayFrame);
      console.log('📍 Scroll mode enabled from frame:', currentDisplayFrame);
    }

    // If in scroll mode (after button click or after interruption)
    if (stateRef.current.isScrollMode) {
      const scrollY = window.scrollY;

      // Calculate scroll delta from baseline
      const scrollDelta = scrollY - stateRef.current.scrollBaseline;

      // Map scroll delta to frame delta
      const frameDelta = scrollDelta / CONFIG.pixelsPerFrame;

      // Calculate target frame: baseline frame + delta
      const targetFrame = stateRef.current.scrollStartFrame + frameDelta;

      // Clamp to valid range (0-400) - can scroll all the way back to first frame
      const clampedFrame = Math.max(0, Math.min(CONFIG.scrollEndFrame, targetFrame));
      stateRef.current.targetFrame = clampedFrame;

      // Debug logging - log every 100ms max
      if (!stateRef.current.lastLogTime || Date.now() - stateRef.current.lastLogTime > 100) {
        console.log('🔄 Scroll:', {
          scrollY: Math.round(scrollY),
          baseline: Math.round(stateRef.current.scrollBaseline),
          scrollDelta: Math.round(scrollDelta),
          frameDelta: Math.round(frameDelta * 10) / 10,
          targetFrame: Math.round(clampedFrame),
          startFrame: stateRef.current.scrollStartFrame
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

  // Handle button click - animate to frame 400 then enable scroll mode
  const handleButtonClick = () => {
    console.log('Button clicked, starting animation from frame:', stateRef.current.currentFrame);

    // Hide all text immediately
    setHideText(true);

    // Enable section height expansion immediately for smooth transition
    setIsScrollMode(true);

    // Mark that we're animating
    stateRef.current.isAnimatingToEnd = true;

    // Animate from current frame to frame 400
    const startFrame = stateRef.current.currentFrame;
    const endFrame = CONFIG.scrollEndFrame; // 400
    const frameDuration = 1000 / CONFIG.autoPlayFPS; // milliseconds per frame
    let currentAnimFrame = startFrame;

    const animateToEnd = () => {
      // Check if animation was interrupted
      if (!stateRef.current.isAnimatingToEnd) {
        console.log('Animation was interrupted');
        return;
      }

      if (currentAnimFrame < endFrame) {
        currentAnimFrame++;
        displayFrame(currentAnimFrame);
        stateRef.current.targetFrame = currentAnimFrame;

        // Log progress every 50 frames
        if (currentAnimFrame % 50 === 0) {
          console.log('Animation progress:', currentAnimFrame, '/', endFrame);
        }

        stateRef.current.buttonAnimationTimeout = setTimeout(animateToEnd, frameDuration);
      } else {
        // Animation complete naturally, switch to scroll mode
        console.log('✅ Animation complete at frame:', currentAnimFrame);
        console.log('📸 Last frame displayed:', getFramePath(currentAnimFrame));
        console.log('🖱️ Switching to scroll mode (frames 0-400)...');

        stateRef.current.isAnimatingToEnd = false;
        const currentDisplayFrame = stateRef.current.currentFrame;

        // Enable scroll mode
        stateRef.current.isScrollMode = true;
        stateRef.current.scrollStartFrame = currentDisplayFrame;
        stateRef.current.targetFrame = currentDisplayFrame;

        // Wait for section height to update, then scroll to position with more space above
        setTimeout(() => {
          // Scroll higher to give more room to scroll backwards (upwards)
          const middleScroll = window.innerHeight * 95; // 95vh from the 100vh total (maximum space above for reaching frame 0)
          window.scrollTo({ top: middleScroll, behavior: 'instant' });

          // Set baseline after scrolling
          stateRef.current.scrollBaseline = middleScroll;

          console.log('📍 Scroll baseline set at Y:', middleScroll, '- Frame:', currentDisplayFrame);
          console.log('📊 With pixelsPerFrame=0.00625, you can reach frame 0 by scrolling up', Math.round(middleScroll / 0.00625), 'frames');
          console.log('💡 This means 1 pixel of scroll = 160 frames');
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
          return; // Stop
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

  // Preload images
  useEffect(() => {
    let loadedCount = 0;

    const loadImages = async () => {
      // Load all frames from 0 to 395
      for (let i = 0; i < CONFIG.maxFrames; i++) {
        const frameNumber = CONFIG.startFrame + i;
        const img = new Image();

        img.onload = () => {
          loadedCount++;
          // Show loading progress for first 164 frames only
          if (loadedCount <= CONFIG.totalFrames) {
            const percent = Math.round((loadedCount / CONFIG.totalFrames) * 100);
            setLoadingPercent(percent);
          }

          // First image - show immediately
          if (loadedCount === 1 && imgRef.current) {
            imgRef.current.src = img.src;
          }

          // First set loaded (for initial animation)
          if (loadedCount === CONFIG.totalFrames) {
            setTimeout(() => {
              setIsLoading(false);
              stateRef.current.isReady = true;

              // Auto-play after load
              if (CONFIG.autoPlayOnLoad) {
                setTimeout(() => {
                  autoPlay();
                }, CONFIG.autoPlayDelay);
              }
            }, 300);
          }
        };

        img.onerror = () => {
          console.warn(`Failed to load: ${getFramePath(frameNumber)}`);
          loadedCount++;

          // Allow animation to start after first set of frames
          if (loadedCount === CONFIG.totalFrames) {
            setIsLoading(false);
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
    };
  }, []);

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="frame-loading-overlay">
          <div className="frame-loading-text">
            Loading frames... <span>{loadingPercent}</span>%
          </div>
          <div className="frame-loading-progress">
            <div
              className="frame-loading-bar"
              style={{ width: `${loadingPercent}%` }}
            />
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
          {/* Debug frame counter */}
          {isScrollMode && (
            <div id="frame-debug" style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              background: 'rgba(0,0,0,0.7)',
              padding: '10px 20px',
              borderRadius: '8px',
              zIndex: 9999
            }}>
              Frame: 400
            </div>
          )}
        </div>

        {/* Center Text Overlay - Stays Fixed */}
        {!hideText && (
          <div className="hero-content">
            <h2 className={`hero-tagline ${showTagline ? 'visible' : ''}`}>FOR THOSE WHO</h2>
            <h1 className={`hero-title ${showTitle ? 'visible' : ''}`}>BECOME MORE</h1>
            <button className={`hero-button ${showButton ? 'visible' : ''}`} onClick={handleButtonClick}>Enter Experience</button>
          </div>
        )}

      </section>
    </>
  );
};

export default FrameSequence;
