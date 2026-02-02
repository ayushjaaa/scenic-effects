const Contact = () => {
  return (
    <div className="contact-page" style={{ minHeight: '100vh', padding: '100px 20px', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>Get In Touch</h1>

        <form style={{ marginTop: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
              Name
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px',
                color: 'white'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
              Email
            </label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px',
                color: 'white'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
              Message
            </label>
            <textarea
              rows="6"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '5px',
                color: 'white',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '1rem 3rem',
              fontSize: '1.1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
