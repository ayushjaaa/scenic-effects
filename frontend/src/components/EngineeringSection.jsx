import { useEffect, useRef, useState } from 'react';
import './EngineeringSection.css';

const EngineeringSection = () => {
  const sectionRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        // Calculate scroll progress when section is in viewport
        if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
          const scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
          setScrollY(scrollProgress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="engineering-section" ref={sectionRef}>
      <div className="engineering-content">
        {/* Left Side - Text Content */}
        <div className="engineering-text">
          <h3 className="engineering-label">ENGINEERING</h3>
          <h2 className="engineering-title">
            The perfect balance<br />of art and engineering.
          </h2>
          <p className="engineering-description">
            The <strong>RSGB02</strong> is a Rotoris-specified calibre developed in partnership with Seagull. Built on their proven ST2153 platform and configured it for our <strong>moon phase</strong> complication, integrating three displays into one refined movement built for endurance.
          </p>
        </div>

        {/* Right Side - Images */}
        <div className="engineering-images">
          <div className="engineering-image-grid">
            {/* Top left - Watch mechanism sketch */}
            <img
              src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/MON_sketch_03.webp"
              alt="Watch mechanism sketch"
              className="engineering-img engineering-img-1"
              loading="lazy"
              style={{ transform: `translateY(${(scrollY - 0.5) * -80}px)` }}
            />
            {/* Top right - Watch close-up */}
            <img
              src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/MON1.webp"
              alt="Watch close-up"
              className="engineering-img engineering-img-2"
              loading="lazy"
              style={{ transform: `translateY(${(scrollY - 0.5) * 60}px)` }}
            />
            {/* Bottom left - Technical diagram */}
            <img
              src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/Frame+105.svg"
              alt="Technical diagram"
              className="engineering-img engineering-img-3"
              loading="lazy"
              style={{ transform: `translateY(${(scrollY - 0.5) * 100}px)` }}
            />
            {/* Bottom right - Technical diagram */}
            <img
              src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/Group+109.svg"
              alt="Power reserve indicator"
              className="engineering-img engineering-img-4"
              loading="lazy"
              style={{ transform: `translateY(${(scrollY - 0.5) * -120}px)` }}
            />
          </div>
          <div className="engineering-labels">
            <span className="label-top-left">automatic calibre</span>
            <span className="label-bottom-right">power reserve indicator</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineeringSection;
