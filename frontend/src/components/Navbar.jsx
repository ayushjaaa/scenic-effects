import './Navbar.css';

/**
 * Navbar Component
 * - Fixed at top
 * - Menu icon on left
 * - Logo centered
 */
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Menu Icon */}
        <button className="menu-button" aria-label="Open menu">
          <svg
            className="menu-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Center: Logo */}
        <div className="navbar-logo">
          <img
            src="/web-loader.mp4"
            alt="Logo"
            className="logo-image"
          />
        </div>

        {/* Right: Empty space for balance */}
        <div className="navbar-spacer"></div>
      </div>
    </nav>
  );
};

export default Navbar;
