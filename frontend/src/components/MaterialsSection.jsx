import './MaterialsSection.css';

const MaterialsSection = () => {
  return (
    <section className="materials-section">
      <div className="materials-content">
        <div className="materials-text">
          <h3 className="materials-label">MATERIALS</h3>
          <h2 className="materials-title">
            Crafted from the finest materials.
          </h2>
          <p className="materials-description">
            Every component is carefully selected for durability and aesthetic appeal.
            From premium-grade stainless steel to scratch-resistant sapphire crystal,
            we ensure that every detail meets our exacting standards.
          </p>
        </div>
        <div className="materials-image">
          <img
            src="https://via.placeholder.com/600x400"
            alt="Premium materials"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;
