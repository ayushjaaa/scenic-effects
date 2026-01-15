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
    isScrollMode: false,
    scrollStartFrame: 163,
    scrollBaseline: 0,
    isAnimatingToEnd: false,
    buttonAnimationTimeout: null,
    lastLogTime: 0,
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

      const currentScrollY = window.scrollY;
      const currentDisplayFrame = stateRef.current.currentFrame;

      stateRef.current.isScrollMode = true;
      stateRef.current.scrollStartFrame = currentDisplayFrame;
      stateRef.current.scrollBaseline = currentScrollY;
      stateRef.current.targetFrame = currentDisplayFrame;
      setIsScrollMode(true);

      if (section) {
        section.style.pointerEvents = 'auto';
      }

      console.log('⚡ Animation interrupted by scroll at frame:', currentDisplayFrame);
    }

    // If in scroll mode (after button click)
    if (stateRef.current.isScrollMode) {
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - stateRef.current.scrollBaseline;
      const frameDelta = scrollDelta / CONFIG.pixelsPerFrame;
      const targetFrame = stateRef.current.scrollStartFrame + frameDelta;
      const clampedFrame = Math.max(0, Math.min(CONFIG.scrollEndFrame, targetFrame));

      stateRef.current.targetFrame = clampedFrame;

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

  // Handle button click
  const handleButtonClick = () => {
    console.log('🎬 Button clicked, starting animation from frame:', stateRef.current.currentFrame);

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

  // Preload images
  useEffect(() => {
    let loadedCount = 0;

    const loadImages = async () => {
      for (let i = 0; i < CONFIG.maxFrames; i++) {
        const frameNumber = CONFIG.startFrame + i;
        const img = new Image();

        img.onload = () => {
          loadedCount++;
          if (loadedCount <= CONFIG.totalFrames) {
            const percent = Math.round((loadedCount / CONFIG.totalFrames) * 100);
            setLoadingPercent(percent);
          }

          if (loadedCount === 1 && imgRef.current) {
            imgRef.current.src = img.src;
          }

          if (loadedCount === CONFIG.totalFrames) {
            setTimeout(() => {
              setIsLoading(false);
              stateRef.current.isReady = true;

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
