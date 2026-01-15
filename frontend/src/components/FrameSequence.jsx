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
    pixelsPerFrame: 20, // Scroll sensitivity (lower = more sensitive)
  };

  // Get frame path
  const getFramePath = (frameNumber) => {
    const paddedNumber = String(frameNumber).padStart(CONFIG.paddingZeros, '0');
    return `${CONFIG.imageBaseURL}${paddedNumber}.${CONFIG.imageFormat}`;
  };

  // Display frame
  const displayFrame = (frameIndex) => {
    // Allow frames up to maxFrames (395) for button animation
    frameIndex = Math.max(0, Math.min(CONFIG.maxFrames - 1, Math.floor(frameIndex)));

    const img = imagesRef.current.get(frameIndex);

    if (img && img.complete && imgRef.current) {
      imgRef.current.src = img.src;
      stateRef.current.currentFrame = frameIndex;

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

    // If in scroll mode (after button click)
    if (stateRef.current.isScrollMode) {
      const scrollY = window.scrollY;

      // Calculate scroll delta from baseline
      const scrollDelta = scrollY - stateRef.current.scrollBaseline;

      // Map scroll delta to frame delta
      const frameDelta = scrollDelta / CONFIG.pixelsPerFrame;

      // Calculate target frame: baseline frame + delta
      const targetFrame = stateRef.current.scrollStartFrame + frameDelta;

      // Clamp to valid range (163-400)
      const clampedFrame = Math.max(163, Math.min(CONFIG.scrollEndFrame, targetFrame));
      stateRef.current.targetFrame = clampedFrame;

      return;
    }

    // Original scroll behavior (before button click)
    const rect = section.getBoundingClientRect();
    const scrollStart = -rect.top;
    const scrollEnd = rect.height - window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(1, scrollStart / scrollEnd));

    stateRef.current.targetFrame = scrollProgress * (CONFIG.totalFrames - 1);
  };

  // Handle button click - animate to frame 395 then enable scroll mode
  const handleButtonClick = () => {
    console.log('Button clicked, starting animation from frame:', stateRef.current.currentFrame);

    // Hide all text immediately
    setHideText(true);

    // Disable scroll during animation
    const section = document.getElementById('frameSection');
    if (section) {
      section.style.pointerEvents = 'none';
    }

    // Animate from current frame to frame 395
    const startFrame = stateRef.current.currentFrame;
    const endFrame = CONFIG.maxFrames - 1; // 395
    const frameDuration = 1000 / CONFIG.autoPlayFPS; // milliseconds per frame
    let currentAnimFrame = startFrame;

    const animateToEnd = () => {
      if (currentAnimFrame < endFrame) {
        currentAnimFrame++;
        displayFrame(currentAnimFrame);
        stateRef.current.targetFrame = currentAnimFrame;

        // Log progress every 50 frames
        if (currentAnimFrame % 50 === 0) {
          console.log('Animation progress:', currentAnimFrame, '/', endFrame);
        }

        setTimeout(animateToEnd, frameDuration);
      } else {
        // Animation complete, switch to scroll mode
        console.log('✅ Animation complete at frame:', currentAnimFrame);
        console.log('📸 Last frame displayed:', getFramePath(currentAnimFrame));
        console.log('🖱️ Switching to scroll mode (frames 163-400)...');

        const currentDisplayFrame = stateRef.current.currentFrame;

        // Enable scroll mode first
        stateRef.current.isScrollMode = true;
        stateRef.current.scrollStartFrame = currentDisplayFrame; // Start from current frame
        stateRef.current.targetFrame = currentDisplayFrame; // Keep displaying current frame
        setIsScrollMode(true);

        // Re-enable scroll
        if (section) {
          section.style.pointerEvents = 'auto';
        }

        // Wait for section height to update, then scroll to middle position
        setTimeout(() => {
          // Scroll to middle of the section so user can scroll up or down
          const middleScroll = window.innerHeight * 2; // 2vh from the 5vh total
          window.scrollTo({ top: middleScroll, behavior: 'instant' });

          // Set baseline after scrolling to middle
          stateRef.current.scrollBaseline = middleScroll;

          console.log('📍 Scroll baseline set at Y:', middleScroll, '- Frame:', currentDisplayFrame);
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
        style={isScrollMode ? { height: '500vh' } : {}}
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

      </section>
    </>
  );
};

export default FrameSequence;
