import './JoinWishlistButton.css';

const JoinWishlistButton = () => {
  const handleClick = () => {
    // Scroll to contact form or open wishlist modal
    const contactForm = document.querySelector('.contact-form-section') || document.querySelector('[class*="contact"]');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button className="join-wishlist-button" onClick={handleClick}>
      Join Wishlist
    </button>
  );
};

export default JoinWishlistButton;
