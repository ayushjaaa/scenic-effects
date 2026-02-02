import './SpecsSection.css';

const SpecsSection = () => {
  const specs = [
    { label: 'BASE CALIBRE', value: 'ST2153' },
    { label: 'TYPE', value: 'Automatic' },
    { label: 'POWER RESERVE', value: '~42 hours' },
    { label: 'JEWELS', value: '32' },
    { label: 'FREQUENCY', value: '28,800 vph' },
    { label: 'FUNCTIONS', value: 'Moon phase, calender, energy display' },
  ];

  return (
    <section className="specs-section">
      <div className="specs-content">
        <div className="specs-grid">
          {specs.map((spec, index) => (
            <div key={index} className="spec-item">
              <div className="spec-label">{spec.label}</div>
              <div className="spec-value">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
