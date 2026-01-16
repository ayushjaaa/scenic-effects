import Navbar from './components/Navbar';
import FrameSequence from './components/FrameSequence';
import './App.css';

function App() {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Frame Sequence Animation - handles both autoplay and scroll modes */}
      <FrameSequence />
    </>
  );
}

export default App;
