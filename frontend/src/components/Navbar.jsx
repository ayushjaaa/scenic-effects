import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar Component
 * - Fixed at top
 * - Menu icon on left
 * - Logo centered
 * - Left drawer menu
 */
const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const menuItems = [
    {
      id: 1,
      title: 'Home',
      path: '/',
      image: 'https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/auriqua_h.webp'
    },
    {
      id: 2,
      title: 'About',
      path: '/about',
      image: 'https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/arvion_h.webp'
    },
    {
      id: 3,
      title: 'Features',
      path: '/about',
      image: 'https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/monarch_h.webp'
    },
    {
      id: 4,
      title: 'Contact',
      path: '/contact',
      image: 'https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/astonia_h.webp'
    },
    {
      id: 5,
      title: 'Products',
      path: '/about',
      image: 'https://prelaunch-rotoris.s3.ap-south-1.amazonaws.com/public/assets/manifesta_h.webp'
    }
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left: Menu Icon */}
          <button className="menu-button" aria-label="Open menu" onClick={toggleDrawer}>
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

          {/* Center: Logo Text - Link to Home */}
          <Link to="/" className="navbar-logo">
            <span className="logo-text">ROTORIS</span>
          </Link>

          {/* Right: Empty space for balance */}
          <div className="navbar-spacer"></div>
        </div>
      </nav>

      {/* Overlay */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={closeDrawer}></div>
      )}

      {/* Left Drawer */}
      <div className={`drawer ${isDrawerOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-content">
          {/* Top Icon */}
          <div className="drawer-top-icon">
            <div className="menu-icon-drawer">
              <div className="menu-icon-line menu-icon-line-long"></div>
              <div className="menu-icon-line menu-icon-line-short"></div>
            </div>
          </div>

          {/* Header Section */}
          <div className="drawer-header">
            <h2 className="drawer-title">Navigation</h2>
            <button className="close-button" aria-label="Close menu" onClick={closeDrawer}>
              <svg
                className="close-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="drawer-menu">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="drawer-menu-item"
                onClick={closeDrawer}
              >
                <div
                  className="menu-item-background"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <span className="menu-item-text">
                    {item.title}
                    <span className="arrow-icon">&gt;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
