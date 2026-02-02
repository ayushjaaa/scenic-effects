import HeroSection from '../components/HeroSection';
import MoonPhasesSection from '../components/MoonPhasesSection';
import PantheonSection from '../components/PantheonSection';
import EngineeringSection from '../components/EngineeringSection';
import SpecsSection from '../components/SpecsSection';
import ContactForm from '../components/ContactForm';
import JoinWishlistButton from '../components/JoinWishlistButton';
import './Features.css';

const Features = () => {
  return (
    <div className="features-page">
      <HeroSection
        videoUrl="https://vod.api.video/vod/vi1kpMSCE8jxDJXijFKatb5M/mp4/source.mp4"
        title="Features"
        subtitle="Discover What Makes Us Unique"
        gradientColor="#4A3621"
      />
      <MoonPhasesSection />
      <PantheonSection />
      <EngineeringSection />
      <SpecsSection />

      {/* Key Materials Section */}
      <div className="key-materials-section">
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
      <div className="old-design-story-section">
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
      <div className="old-drive-future-section">
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

      {/* Fixed Join Wishlist Button */}
      <JoinWishlistButton />
    </div>
  );
};

export default Features;
