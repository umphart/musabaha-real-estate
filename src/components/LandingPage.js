import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to MUSABAHA HOMES LTD.</h1>
          <p>Making land and property ownership accessible, secure, and profitable</p>
          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">Learn More</a>
            <a href="login" className="btn btn-primary">Get Started</a>
            <a href="#contact" className="btn btn-secondary">Contact Us</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Verifiable</h3>
              <p>All transactions are properly documented and backed by verifiable titles for long-term peace of mind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Income-Producing Assets</h3>
              <p>Own income-producing assets in real estate through outright purchase or flexible installment plans.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏗️</div>
              <h3>Diverse Portfolio</h3>
              <p>Invest safely in residential, commercial, and strategic estate developments across Nigeria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2>About MUSABAHA HOMES LTD.</h2>
          <p>We are a registered leading real estate company in Nigeria (RC: 8176032) with a vision to make land and property ownership accessible, secure, and profitable for individuals and organizations across the country.</p>
          <p>Our mission is to help people own income-producing assets in the real estate sector—whether through outright purchase or flexible installment plans. We are the trusted partner for hundreds of thousand clients looking to invest safely in residential, commercial, and strategic estate developments.</p>
          <p>We pride ourselves on transparency, innovation, and legal compliance. Through our modern systems, including digital client record management, inspection support, and marketing tools, we are redefining the real estate experience in Northern Nigeria.</p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Integrity & Trust</h3>
              <p>Building lasting relationships through honest and reliable services</p>
            </div>
            <div className="value-item">
              <h3>Client-Centered Service</h3>
              <p>Putting our clients' needs and satisfaction at the forefront</p>
            </div>
            <div className="value-item">
              <h3>Innovation & Growth</h3>
              <p>Embracing modern technology and continuous improvement</p>
            </div>
            <div className="value-item">
              <h3>Community Development</h3>
              <p>Contributing to sustainable development and community growth</p>
            </div>
            <div className="value-item">
              <h3>Transparency in Every Deal</h3>
              <p>Ensuring clear and open communication in all transactions</p>
            </div>
          </div>
        </div>
      </section>

{/* Contact Section */}
<section id="contact" className="contact-section">
  <div className="container">
    <h2>Contact Us Today</h2>
    <div className="contact-info">
      <p><strong>Headquarters:</strong> No.15 City Plaza, Along Ring Road Eastern Bypass, Hotoron Arewa, hannun tafiya yankaba daga hotoro round, Kano State</p>
      <p><strong>Phone:</strong> 09064220705, 09039108853, 08037023070</p>
      <p>
        <strong>Email:</strong> 
        <a href="mailto:musabahahomesltd@gmail.com" style={{color: 'white', textDecoration: 'none'}}>
          musabahahomesltd@gmail.com
        </a>
      </p>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} MUSABAHA HOMES LTD. (RC: 8176032) All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;