import './DriveFutureSection.css';

const DriveFutureSection = () => {
  return (
    <section className="drive-future-section">
      <div className="drive-future-content">
        <div className="drive-future-text">
          <h3 className="drive-future-label">OUR VISION</h3>
          <h2 className="drive-future-title">
            Driving the future of craftsmanship.
          </h2>
          <p className="drive-future-description">
            We are committed to pushing the boundaries of what's possible in
            watchmaking while honoring centuries-old traditions. Our vision is
            to create timepieces that inspire and endure, merging art with precision
            engineering for the modern era.
          </p>
        </div>
        <div className="drive-future-image">
          <img
            src="https://via.placeholder.com/600x400"
            alt="Future vision"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default DriveFutureSection;
