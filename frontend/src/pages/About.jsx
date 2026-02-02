import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const ideationSectionRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const section = ideationSectionRef.current;
    const background = backgroundRef.current;

    // Only apply pinning on desktop (width > 768px)
    const isMobile = window.innerWidth <= 768;

    if (section && background && !isMobile) {
      // Pin the background image when section reaches top
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=400%', // Pin for 4x viewport height to allow more content to scroll
        pin: background,
        pinSpacing: false,
        markers: false, // Set to true for debugging
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="about-page">
      {/* Hero Header Section with Background Video and Gradient */}
      <header className="about-header">
        <video
          className="about-header-video"
          src="https://vod.api.video/vod/vi43oLt7gV47CNleHg4eUxrA/mp4/source.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="about-header-content">
          <h1 className="about-title">About Rotoris</h1>
          <p className="about-subtitle">Become More</p>
        </div>
      </header>

      {/* Second Section - IDEATION */}
      <section ref={ideationSectionRef} className="ideation-section">
        {/* Background Layer - This will be pinned */}
        <div ref={backgroundRef} className="ideation-background"></div>

        {/* Content Wrapper - Flex Column */}
        <div className="ideation-content-wrapper">
          {/* First Content Block - Text Left, Image Right */}
          <div className="ideation-container">
            {/* Left Text Block */}
            <div className="ideation-text">
              <span className="ideation-label">IDEATION</span>
              <h2 className="ideation-heading">
                Where speed meets<br />
                simplicity and<br />
                design meets instinct.
              </h2>
              <p className="ideation-description">
                Inspired by classic performance dashboards built around one hand, <strong>Arvion</strong> features a single hand that reads time as instinctively as velocity. <strong>Timeless, focused design.</strong>
              </p>
            </div>

            {/* Right Visual Block */}
            <div className="ideation-visual">
              <div className="image-container">
                <img
                  src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/Arvion/Astonia-speedometer.webp"
                  alt="Arvion Speedometer"
                  className="speedometer-image"
                />
                <img
                  src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/Arvion/ARV_sketch_01.webp"
                  alt="Technical Sketch"
                  className="sketch-overlay"
                />
              </div>
            </div>
          </div>

          {/* Second Content Block - Image Left, Text Right */}
          <div className="ideation-container ideation-container-reverse">
            {/* Left Visual Block */}
            <div className="ideation-visual">
              <div className="image-container image-container-reverse">
                <img
                  src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/Arvion/ARV4.webp"
                  alt="Arvion Watch"
                  className="speedometer-image"
                />
                <img
                  src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/Arvion/ARV_sketch_03.webp"
                  alt="Technical Sketch"
                  className="sketch-overlay sketch-overlay-top"
                />
                <img
                  src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/Arvion/ARV_sketch_04.webp"
                  alt="Technical Sketch Bottom"
                  className="sketch-overlay sketch-overlay-bottom"
                />
              </div>
            </div>

            {/* Right Text Block */}
            <div className="ideation-text">
              <span className="ideation-label">CRAFTSMANSHIP</span>
              <h2 className="ideation-heading">
                Built for those<br />
                who appreciate<br />
                precision.
              </h2>
              <p className="ideation-description">
                Every detail crafted with <strong>meticulous attention</strong> to deliver not just a timepiece, but an <strong>experience of excellence.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="specs-container">
          <div className="spec-item">
            <h3 className="spec-title">Base calibre</h3>
            <p className="spec-value">TMI VJ34</p>
          </div>
          <div className="spec-item">
            <h3 className="spec-title">Type</h3>
            <p className="spec-value">Quartz</p>
          </div>
          <div className="spec-item">
            <h3 className="spec-title">Power reserve</h3>
            <p className="spec-value">Battery</p>
            <p className="spec-subvalue">(~3-5 years)</p>
          </div>
          <div className="spec-item">
            <h3 className="spec-title">Frequency</h3>
            <p className="spec-value">32,768 Hz</p>
          </div>
        </div>

        {/* Key Materials Section */}
        <div className="materials-section">
          <div className="materials-header">
            <h2 className="materials-title">Key Materials</h2>
            <p className="materials-subtitle">Built from elements that blend simplicity with strength</p>
          </div>
          <div className="materials-grid">
            <div className="material-item">
              <img
                src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/stainless-steel.webp"
                alt="Stainless Steel 316L"
                className="material-image"
              />
              <h3 className="material-name">Stainless Steel 316L</h3>
              <button className="material-add-icon">+</button>
            </div>
            <div className="material-item">
              <img
                src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/Sapphirecrystal.webp"
                alt="Sapphire Crystal"
                className="material-image"
              />
              <h3 className="material-name">Sapphire Crystal</h3>
              <button className="material-add-icon">+</button>
            </div>
            <div className="material-item">
              <img
                src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/Suede.png"
                alt="Suede Leather"
                className="material-image"
              />
              <h3 className="material-name">Suede Leather</h3>
              <button className="material-add-icon">+</button>
            </div>
          </div>
        </div>

        {/* Design Story Section */}
        <div className="design-story-section">
          <div className="design-story-text-container">
            <p className="design-story-text">
              Shaped one clean stroke at a time, Arvion grew from automotive design principles into a watch made for speed and forward momentum.
            </p>
          </div>
          <div className="design-story-image-container">
            <video
              className="design-story-video"
              src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/auriqua/Arvion+H+compressed.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>

        {/* Drive of the Future Section */}
        <div className="drive-future-section">
          <div className="drive-future-icons">
            <svg className="drive-future-icon" width="22" height="34" viewBox="0 0 22 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.7852 34H0.0604343V20.8357C0.0604343 20.8357 -2.25264 2.42224 21.7852 0V4.52299C21.7852 4.52299 8.15618 4.92762 7.41161 15.4258H21.7852V34Z" fill="white"/>
            </svg>
            <svg className="drive-future-icon" width="22" height="34" viewBox="0 0 22 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.7852 34H0.0604343V20.8357C0.0604343 20.8357 -2.25264 2.42224 21.7852 0V4.52299C21.7852 4.52299 8.15618 4.92762 7.41161 15.4258H21.7852V34Z" fill="white"/>
            </svg>
          </div>
          <h2 className="drive-future-text">
            What you wear on your wrist is your drive of the future
          </h2>
        </div>

        {/* Waitlist Form Section - Inside ideation-section, below drive-future-section */}
        <div className="waitlist-section">
        <div className="waitlist-container">
          {/* Form Column */}
          <div className="waitlist-form-column">
            <h2 className="waitlist-title">Join the waitlist for Arvion</h2>

            <form className="waitlist-form">
              <div className="form-group">
                <div className="form-input-wrapper">
                  <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="rgba(255, 255, 255, 0.5)"/>
                    <path d="M10 12.5C5.16667 12.5 1.25 14.4167 1.25 16.6667V20H18.75V16.6667C18.75 14.4167 14.8333 12.5 10 12.5Z" fill="rgba(255, 255, 255, 0.5)"/>
                  </svg>
                  <input type="text" placeholder="Full name*" className="form-input" required />
                </div>
              </div>

              <div className="form-group">
                <div className="form-input-wrapper">
                  <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4H2C0.9 4 0.00999999 4.9 0.00999999 6L0 18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4ZM18 8L10 13L2 8V6L10 11L18 6V8Z" fill="rgba(255, 255, 255, 0.5)"/>
                  </svg>
                  <input type="email" placeholder="Email id*" className="form-input" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group form-group-half">
                  <div className="form-input-wrapper">
                    <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5 20C15.567 20 13.6169 19.4758 11.7498 18.4276C9.88278 17.3793 8.22435 16.0141 6.77437 14.3317C5.32436 12.6493 4.21829 10.8426 3.45614 8.91136C2.69398 6.98015 2.31291 5.05392 2.31291 3.13268C2.31291 2.76423 2.43491 2.45762 2.67891 2.21283C2.92292 1.96803 3.22857 1.84564 3.59588 1.84564H6.6969C7.00252 1.84564 7.26749 1.94697 7.49183 2.14964C7.71614 2.35231 7.85063 2.59711 7.89528 2.88403L8.49485 6.08092C8.5395 6.4047 8.53453 6.69159 8.46991 6.94158C8.4053 7.19161 8.28329 7.40397 8.10391 7.57866L6.04206 9.66159C6.72354 10.8123 7.53332 11.9019 8.47139 12.9304C9.4095 13.9589 10.4653 14.9088 11.639 15.7802L13.6238 13.7753C13.8035 13.5916 14.0384 13.4496 14.3288 13.3494C14.6192 13.2492 14.9096 13.2179 15.2 13.2557L18.3264 13.875C18.6087 13.9306 18.8481 14.0754 19.0447 14.3093C19.2414 14.5433 19.3397 14.8134 19.3397 15.1196V18.1544C19.3397 18.5228 19.2177 18.8294 18.9737 19.0742C18.7297 19.3191 18.4241 19.4414 18.0567 19.4414L17.5 20Z" fill="rgba(255, 255, 255, 0.5)"/>
                    </svg>
                    <input type="tel" placeholder="Phone*" className="form-input" required />
                  </div>
                </div>
                <div className="form-group form-group-half">
                  <div className="form-input-wrapper">
                    <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0C6.13401 0 3 3.13401 3 7C3 11.5 10 20 10 20C10 20 17 11.5 17 7C17 3.13401 13.866 0 10 0ZM10 9.5C8.61929 9.5 7.5 8.38071 7.5 7C7.5 5.61929 8.61929 4.5 10 4.5C11.3807 4.5 12.5 5.61929 12.5 7C12.5 8.38071 11.3807 9.5 10 9.5Z" fill="rgba(255, 255, 255, 0.5)"/>
                    </svg>
                    <input type="text" placeholder="Postal/Zip code*" className="form-input" required />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="form-input-wrapper">
                  <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" fill="rgba(255, 255, 255, 0.5)"/>
                  </svg>
                  <input type="text" placeholder="Instagram username (optional)" className="form-input" />
                </div>
              </div>

              <button type="submit" className="submit-button">Submit</button>

              <div className="form-consent">
                <input type="checkbox" id="consent" className="consent-checkbox" required />
                <label htmlFor="consent" className="consent-label">
                  By submitting, I agree to receive early-access updates from Rotoris and consent to the use of my data for this purpose. I've read and agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
                </label>
              </div>
            </form>
          </div>

          {/* Footer Content Column */}
          <div className="waitlist-footer-column">
            <button className="back-to-top">↑ Back to top</button>

            <div className="social-links">
              <a href="#" className="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 3.67C13.17 3.67 14.17 4.67 14.17 5.83C14.17 7 13.17 8 12 8C10.83 8 9.83 7 9.83 5.83C9.83 4.67 10.83 3.67 12 3.67ZM12 20.17C9.5 20.17 7.29 18.92 6 17.04C6.03 15.04 10 13.92 12 13.92C13.99 13.92 17.97 15.04 18 17.04C16.71 18.92 14.5 20.17 12 20.17Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H6.5V10H9V17ZM7.75 8.7C6.92 8.7 6.25 8.03 6.25 7.2C6.25 6.37 6.92 5.7 7.75 5.7C8.58 5.7 9.25 6.37 9.25 7.2C9.25 8.03 8.58 8.7 7.75 8.7ZM18 17H15.5V13.5C15.5 12.67 15.5 11.58 14.33 11.58C13.16 11.58 13 12.5 13 13.46V17H10.5V10H12.9V11H12.93C13.26 10.4 14.06 9.77 15.26 9.77C17.79 9.77 18 11.43 18 13.57V17Z" fill="currentColor"/>
                </svg>
              </a>
            </div>

            <p className="copyright">© 2026, Unikon Innovations Private Limited. All Rights Reserved.</p>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};

export default About;
