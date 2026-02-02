import './MoonPhasesSection.css';

const MoonPhasesSection = () => {
  return (
    <section className="moon-phases-section">
      {/* Cloud Images */}
      <img
        src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/Cloud-m-1.png"
        alt="Cloud"
        className="cloud-image cloud-1"
        loading="lazy"
        decoding="async"
        style={{ color: 'transparent' }}
      />
      <img
        src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/Cloud-2.webp"
        alt="Cloud"
        className="cloud-image cloud-2"
        loading="lazy"
        decoding="async"
        style={{ color: 'transparent' }}
      />
      <img
        src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/cloud-m-2.png"
        alt="Cloud"
        className="cloud-image cloud-3"
        loading="lazy"
        decoding="async"
        style={{ color: 'transparent' }}
      />
      <img
        src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/Cloud-m-5.png"
        alt="Cloud"
        className="cloud-image cloud-4"
        loading="lazy"
        decoding="async"
        style={{ color: 'transparent' }}
      />

      <div className="moon-phases-content">
        {/* Moon Phases Image */}
        <div className="moon-phases-image-container">
          <img
            src="https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/products/monarch/moonphases.webp"
            alt="Moon Phases"
            className="moon-phases-image"
          />
        </div>

        {/* Text Content */}
        <div className="moon-phases-text">
          <p className="moon-phases-description">
            A reminder that everything, even time, <strong>moves in phases just like the moon</strong>. Yet only the ones who endure are remembered.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MoonPhasesSection;
