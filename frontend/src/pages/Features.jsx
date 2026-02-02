import HeroSection from '../components/HeroSection';
import MoonPhasesSection from '../components/MoonPhasesSection';
import PantheonSection from '../components/PantheonSection';
import EngineeringSection from '../components/EngineeringSection';
import SpecsSection from '../components/SpecsSection';
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
    </div>
  );
};

export default Features;
