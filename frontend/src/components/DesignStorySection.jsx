import './DesignStorySection.css';

const DesignStorySection = () => {
  return (
    <section className="design-story-section">
      <div className="design-story-image">
        <img
          src="https://via.placeholder.com/600x400"
          alt="Design story"
          loading="lazy"
        />
      </div>
      <div className="design-story-text">
        <h3 className="design-story-label">DESIGN STORY</h3>
        <h2 className="design-story-title">
          A timeless design philosophy.
        </h2>
        <p className="design-story-description">
          Our design approach balances tradition with innovation. Every curve,
          every line serves a purpose. We believe in creating pieces that transcend
          trends and become cherished heirlooms, passed down through generations.
        </p>
      </div>
    </section>
  );
};

export default DesignStorySection;
