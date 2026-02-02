import './HeroSection.css';

/**
 * Reusable Hero Section Component with Video Background
 *
 * @param {Object} props - Component props
 * @param {string} props.videoUrl - URL of the background video (required)
 * @param {string} props.title - Main heading text (required)
 * @param {string} [props.subtitle] - Optional subtitle text
 * @param {boolean} [props.showGradient=true] - Show/hide gradient overlay
 * @param {string} [props.gradientColor='#4A3621'] - Base color for gradient (hex or rgba)
 * @param {string} [props.className=''] - Additional CSS class names
 *
 * @example
 * <HeroSection
 *   videoUrl="https://example.com/video.mp4"
 *   title="About Rotoris"
 *   subtitle="Become More"
 *   gradientColor="#4A3621"
 * />
 */
const HeroSection = ({
  videoUrl,
  title,
  subtitle,
  showGradient = true,
  gradientColor = '#4A3621',
  className = ''
}) => {
  return (
    <header className={`hero-section ${className}`}>
      <video
        className="hero-video"
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
      />
      {showGradient && (
        <div
          className="hero-gradient"
          style={{
            background: `linear-gradient(
              to top,
              ${gradientColor} 0%,
              ${gradientColor} 20%,
              ${gradientColor}d9 35%,
              ${gradientColor}b3 50%,
              ${gradientColor}80 65%,
              ${gradientColor}4d 80%,
              ${gradientColor}1a 90%,
              transparent 100%
            )`
          }}
        />
      )}
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
};

export default HeroSection;
