import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactForm from '../components/ContactForm';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const ideationSectionRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const section = ideationSectionRef.current;
    const background = backgroundRef.current;

    if (section && background) {
      const isMobile = window.innerWidth <= 768;

      // Pin the background image when section reaches top
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: isMobile ? '+=300%' : '+=400%', // Adjust pin duration for mobile
        pin: background,
        pinSpacing: false,
        markers: false,
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

        {/* Contact Form Section */}
        <ContactForm />
      </section>
    </div>
  );
};

export default About;
