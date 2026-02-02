const Features = () => {
  const features = [
    {
      title: 'Frame-by-Frame Animation',
      description: 'Experience smooth, cinematic animations powered by individual frames.'
    },
    {
      title: 'Scroll-Controlled Timeline',
      description: 'Control the animation flow with intuitive scroll interactions.'
    },
    {
      title: 'Immersive Audio',
      description: 'Synchronized audio that enhances the visual experience.'
    },
    {
      title: 'Responsive Design',
      description: 'Optimized for all devices and screen sizes.'
    },
    {
      title: 'Smart Preloading',
      description: 'Intelligent asset loading for smooth performance.'
    },
    {
      title: 'Cinematic Pacing',
      description: 'Carefully crafted timing and transitions for maximum impact.'
    }
  ];

  return (
    <div className="features-page" style={{ minHeight: '100vh', padding: '100px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>Features</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', opacity: 0.8 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
