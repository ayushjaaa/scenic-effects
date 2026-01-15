import { useState } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import FrameSequence from './components/FrameSequence';
import SectionNavigation from './components/SectionNavigation';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    // Wait for fade-out animation to finish
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <>
      {/* Loader - Shows first (includes navbar) */}
      {isLoading && (
        <Loader duration={4000} onComplete={handleLoadComplete} />
      )}

      {/* Main Content - Shows after loader */}
      {!isLoading && (
        <>
          {/* Navigation Bar */}
          <Navbar />

          {/* Section Navigation Dots */}
          <SectionNavigation />

          {/* Frame Sequence Animation - handles both autoplay and scroll modes */}
          <FrameSequence />
        </>
      )}
    </>
  );
}

export default App;
