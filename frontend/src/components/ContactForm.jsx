import { useState } from 'react';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    postalCode: '',
    instagram: '',
    consent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="contact-form-section">
      <div className="contact-form-container">
        {/* Form Column */}
        <div className="contact-form-column">
          <h2 className="contact-form-title">Join the waitlist for Arvion</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-input-wrapper">
                <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="rgba(255, 255, 255, 0.5)"/>
                  <path d="M10 12.5C5.16667 12.5 1.25 14.4167 1.25 16.6667V20H18.75V16.6667C18.75 14.4167 14.8333 12.5 10 12.5Z" fill="rgba(255, 255, 255, 0.5)"/>
                </svg>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name*"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-input-wrapper">
                <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 4H2C0.9 4 0.00999999 4.9 0.00999999 6L0 18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4ZM18 8L10 13L2 8V6L10 11L18 6V8Z" fill="rgba(255, 255, 255, 0.5)"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email id*"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group-half">
                <div className="form-input-wrapper">
                  <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 20C15.567 20 13.6169 19.4758 11.7498 18.4276C9.88278 17.3793 8.22435 16.0141 6.77437 14.3317C5.32436 12.6493 4.21829 10.8426 3.45614 8.91136C2.69398 6.98015 2.31291 5.05392 2.31291 3.13268C2.31291 2.76423 2.43491 2.45762 2.67891 2.21283C2.92292 1.96803 3.22857 1.84564 3.59588 1.84564H6.6969C7.00252 1.84564 7.26749 1.94697 7.49183 2.14964C7.71614 2.35231 7.85063 2.59711 7.89528 2.88403L8.49485 6.08092C8.5395 6.4047 8.53453 6.69159 8.46991 6.94158C8.4053 7.19161 8.28329 7.40397 8.10391 7.57866L6.04206 9.66159C6.72354 10.8123 7.53332 11.9019 8.47139 12.9304C9.4095 13.9589 10.4653 14.9088 11.639 15.7802L13.6238 13.7753C13.8035 13.5916 14.0384 13.4496 14.3288 13.3494C14.6192 13.2492 14.9096 13.2179 15.2 13.2557L18.3264 13.875C18.6087 13.9306 18.8481 14.0754 19.0447 14.3093C19.2414 14.5433 19.3397 14.8134 19.3397 15.1196V18.1544C19.3397 18.5228 19.2177 18.8294 18.9737 19.0742C18.7297 19.3191 18.4241 19.4414 18.0567 19.4414L17.5 20Z" fill="rgba(255, 255, 255, 0.5)"/>
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone*"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group form-group-half">
                <div className="form-input-wrapper">
                  <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C6.13401 0 3 3.13401 3 7C3 11.5 10 20 10 20C10 20 17 11.5 17 7C17 3.13401 13.866 0 10 0ZM10 9.5C8.61929 9.5 7.5 8.38071 7.5 7C7.5 5.61929 8.61929 4.5 10 4.5C11.3807 4.5 12.5 5.61929 12.5 7C12.5 8.38071 11.3807 9.5 10 9.5Z" fill="rgba(255, 255, 255, 0.5)"/>
                  </svg>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal/Zip code*"
                    className="form-input"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-input-wrapper">
                <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" fill="rgba(255, 255, 255, 0.5)"/>
                </svg>
                <input
                  type="text"
                  name="instagram"
                  placeholder="Instagram username (optional)"
                  className="form-input"
                  value={formData.instagram}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-button">Submit</button>

            <div className="form-consent">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                className="consent-checkbox"
                checked={formData.consent}
                onChange={handleChange}
                required
              />
              <label htmlFor="consent" className="consent-label">
                By submitting, I agree to receive early-access updates from Rotoris and consent to the use of my data for this purpose. I've read and agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
              </label>
            </div>
          </form>
        </div>

        {/* Footer Content Column */}
        <div className="contact-footer-column">
          <button className="back-to-top" onClick={scrollToTop}>↑ Back to top</button>

          <div className="social-links">
            <a href="mailto:contact@rotoris.com" className="social-icon" aria-label="Email">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://instagram.com/rotoris" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 3.67C13.17 3.67 14.17 4.67 14.17 5.83C14.17 7 13.17 8 12 8C10.83 8 9.83 7 9.83 5.83C9.83 4.67 10.83 3.67 12 3.67ZM12 20.17C9.5 20.17 7.29 18.92 6 17.04C6.03 15.04 10 13.92 12 13.92C13.99 13.92 17.97 15.04 18 17.04C16.71 18.92 14.5 20.17 12 20.17Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/rotoris" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H6.5V10H9V17ZM7.75 8.7C6.92 8.7 6.25 8.03 6.25 7.2C6.25 6.37 6.92 5.7 7.75 5.7C8.58 5.7 9.25 6.37 9.25 7.2C9.25 8.03 8.58 8.7 7.75 8.7ZM18 17H15.5V13.5C15.5 12.67 15.5 11.58 14.33 11.58C13.16 11.58 13 12.5 13 13.46V17H10.5V10H12.9V11H12.93C13.26 10.4 14.06 9.77 15.26 9.77C17.79 9.77 18 11.43 18 13.57V17Z" fill="currentColor"/>
              </svg>
            </a>
          </div>

          <p className="copyright">© 2026, Unikon Innovations Private Limited. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
