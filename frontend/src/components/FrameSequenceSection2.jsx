import { useEffect, useRef, useState } from 'react';
import './FrameSequence.css';

const FrameSequenceSection2 = () => {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);

  const imgRef = useRef(null);
  const imagesRef = useRef(new Map());
  const stateRef = useRef({
    currentFrame: 0,
    targetFrame: 0,
    isReady: false,
    animationFrameId: null,
    scrollStartFrame: 0, // Starting frame for scroll animation
    lastScrollY: 0, // Track scroll position baseline
  });

  const CONFIG = {
    imageBaseURL: '/Rotoris_world_experience_',
    imageFormat: 'avif.jpeg',
    totalFrames: 238,  // 400 - 163 + 1 = 238 frames (from 163 to 400 inclusive)
    startFrame: 163,  // Start from frame 163 (last frame of Section 1)
    endFrame: 400,     // End at frame 400
    paddingZeros: 5,
    smoothing: 0.1,
  };

  // Get frame path
  const getFramePath = (frameNumber) => {
    const paddedNumber = String(frameNumber).padStart(CONFIG.paddingZeros, '0');
    return `${CONFIG.imageBaseURL}${paddedNumber}.${CONFIG.imageFormat}`;
  };

  // Display frame
  const displayFrame = (frameIndex) => {
    frameIndex = Math.max(0, Math.min(CONFIG.totalFrames - 1, Math.floor(frameIndex)));

    const img = imagesRef.current.get(frameIndex);
    const actualFrameNumber = CONFIG.startFrame + frameIndex; // Convert index to actual frame number

    if (img && img.complete && imgRef.current) {
      imgRef.current.src = img.src;
      stateRef.current.currentFrame = frameIndex;
      setCurrentFrameNum(frameIndex + 1);

      // Log only the frame number that's displayed
      console.log('Frame:', actualFrameNumber);

      // Log when we reach the last frame
      if (actualFrameNumber === CONFIG.endFrame) {
        console.log('🎯 Section 2 reached last frame:', actualFrameNumber);
        console.log('📸 Frame path:', getFramePath(actualFrameNumber));
      }
    }
  };

  // Handle scroll - Scroll-jacking approach
  const handleScroll = () => {
    if (!stateRef.current.isReady) return;

    // Initialize scroll baseline on first scroll (start from frame 163)
    if (stateRef.current.lastScrollY === 0) {
      stateRef.current.scrollStartFrame = 0; // Start from first frame (163)
      stateRef.current.lastScrollY = window.scrollY;
      stateRef.current.targetFrame = 0;
      console.log('📍 Scroll baseline initialized at frame:', CONFIG.startFrame);
    }

    const section = document.getElementById('frameSection2');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if section is in view
    if (rect.top <= 0 && rect.bottom > windowHeight) {
      // Current scroll position
      const currentScrollY = window.scrollY;

      // Calculate scroll delta from where auto-play stopped
      const scrollDelta = currentScrollY - stateRef.current.lastScrollY;

      // Map scroll delta to frame delta
      // Sensitivity: how many pixels of scroll = 1 frame
      const pixelsPerFrame = 20; // Lower = more sensitive
      const frameDelta = scrollDelta / pixelsPerFrame;

      // Calculate new target frame: scroll DOWN = go forward, scroll UP = go backward
      const newTargetFrame = stateRef.current.scrollStartFrame + frameDelta;

      // Clamp to valid frame range
      const clampedFrame = Math.max(0, Math.min(CONFIG.totalFrames - 1, newTargetFrame));

      stateRef.current.targetFrame = clampedFrame;

      // Debug logging
      console.log('📊 Scroll debug:', {
        scrollDelta: scrollDelta.toFixed(2),
        frameDelta: frameDelta.toFixed(2),
        startFrame: stateRef.current.scrollStartFrame,
        newTarget: clampedFrame.toFixed(2),
        actualFrame: CONFIG.startFrame + Math.floor(clampedFrame)
      });
    }
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


  // Preload images
  useEffect(() => {
    let loadedCount = 0;

    const loadImages = async () => {
      for (let i = 0; i < CONFIG.totalFrames; i++) {
        const frameNumber = CONFIG.startFrame + i;
        const img = new Image();

        img.onload = () => {
          loadedCount++;
          const percent = Math.round((loadedCount / CONFIG.totalFrames) * 100);
          setLoadingPercent(percent);

          // First image - show immediately
          if (loadedCount === 1 && imgRef.current) {
            imgRef.current.src = img.src;
          }

          // All loaded
          if (loadedCount === CONFIG.totalFrames) {
            setTimeout(() => {
              setIsLoading(false);
              stateRef.current.isReady = true;
            }, 300);
          }
        };

        img.onerror = () => {
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

    // Setup scroll listener - only scroll control, no auto-play
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Frame Sequence Section 2 - Scroll-jacked animation */}
      <section className="frame-sequence-section-2" id="frameSection2">
        {/* Sticky Visual Container - Fixed in viewport */}
        <div className="sticky-visual-area">
          <img
            ref={imgRef}
            id="currentFrame2"
            alt="Section 2 experience"
            className="frame-image-sticky"
            src={getFramePath(163)}
          />
        </div>

        {/* Scroll Spacer - Creates scroll distance for timeline */}
        <div className="scroll-spacer"></div>
      </section>
    </>
  );
};

export default FrameSequenceSection2;
