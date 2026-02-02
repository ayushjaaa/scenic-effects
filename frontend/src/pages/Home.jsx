import FrameSequence from '../components/FrameSequence';

const Home = () => {
  return (
    <div className="home-page">
      {/* Frame Sequence Animation - handles both autoplay and scroll modes */}
      <FrameSequence />
    </div>
  );
};

export default Home;
