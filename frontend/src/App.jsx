import Navbar from './components/Navbar';
import FrameSequence from './components/FrameSequence';
import SectionNavigation from './components/SectionNavigation';
import './App.css';

function App() {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Section Navigation Dots */}
      <SectionNavigation />

      {/* Frame Sequence Animation - handles both autoplay and scroll modes */}
      <FrameSequence />
    </>
  );
}

export default App;
