import { useState, useEffect } from 'react';
import './FrameSequence.css';

const SectionNavigation = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section1 = document.getElementById('frameSection');
      const section2 = document.getElementById('frameSection2');

      if (section1 && section2) {
        const rect1 = section1.getBoundingClientRect();
        const rect2 = section2.getBoundingClientRect();

        // Check which section is in viewport
        if (rect1.top <= window.innerHeight / 2 && rect1.bottom >= window.innerHeight / 2) {
          setActiveSection(0);
        } else if (rect2.top <= window.innerHeight / 2 && rect2.bottom >= window.innerHeight / 2) {
          setActiveSection(1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (index) => {
    const sectionIds = ['frameSection', 'frameSection2'];
    const section = document.getElementById(sectionIds[index]);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="nav-dots">
      {/* Section 1 */}
      <div
        className={`nav-dot ${activeSection === 0 ? 'active' : ''}`}
        onClick={() => scrollToSection(0)}
      />

      {/* Section 2 */}
      <div
        className={`nav-dot ${activeSection === 1 ? 'active' : ''}`}
        onClick={() => scrollToSection(1)}
      />

      {/* Future sections (Inactive) */}
      <div className="nav-dot" />
      <div className="nav-dot" />
      <div className="nav-dot" />
      <div className="nav-dot" />
    </div>
  );
};

export default SectionNavigation;
