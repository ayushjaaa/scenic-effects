import './PantheonSection.css';

const PantheonSection = () => {
  return (
    <section className="pantheon-section">
      {/* First Div - Text Content */}
      <div className="pantheon-text-container">
        <div className="pantheon-header">
          <h2 className="pantheon-header-title">IDEATION</h2>
          <p className="pantheon-header-subtitle">
            Where ancient architecture<br />meets celestial mechanics.
          </p>
        </div>
      </div>

      {/* Second Div - Background Image with Text */}
      <div className="pantheon-image-container">
        <div className="pantheon-bottom-text">
          <p className="pantheon-description">
            With indices inspired by the Pantheon's pillars, Monarch is built on the same ideals of power, order, and timeless design.
          </p>
          <p className="pantheon-title">Pantheon</p>
        </div>
      </div>
    </section>
  );
};

export default PantheonSection;
