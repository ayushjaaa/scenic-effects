import { useEffect, useRef, useState } from 'react';
import './Loader.css';

/**
 * Loader Component
 * - Centered video + progress bar
 * - Animates from 0% to 100%
 * - Color transitions from transparent to white
 */
const Loader = ({ duration = 4000, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Play video
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.warn('Video autoplay blocked:', err);
      });
    }

    // Start progress animation
    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const currentProgress = Math.min(elapsed / duration, 1);

      setProgress(currentProgress);

      if (currentProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        // Wait a bit before calling onComplete
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration, onComplete]);

  return (
    <div className={`loader-container ${isComplete ? 'fade-out' : ''}`}>
      {/* Navbar - Part of Loader */}
      <nav className="loader-navbar">
        <div className="loader-navbar-container">
          {/* Left: Menu Icon */}
          <button className="loader-menu-button" aria-label="Open menu">
            <svg
              className="loader-menu-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Center: Logo */}
          <div className="loader-navbar-logo">
            <img
              src="/web-loader.mp4"
              alt="Logo"
              className="loader-logo-image"
            />
          </div>

          {/* Right: Spacer */}
          <div className="loader-navbar-spacer"></div>
        </div>
      </nav>

      {/* Loader Content (centered) */}
      <div className="loader-content">
        {/* Video */}
        <video
          ref={videoRef}
          className="loader-video"
          src="/web-loader.mp4"
          muted
          playsInline
          loop
          preload="auto"
        />

        {/* Progress Bar */}
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar"
            style={{
              width: `${progress * 100}%`,
              // No opacity - bar is solid white from the start
            }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="progress-percentage">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
};

export default Loader;
