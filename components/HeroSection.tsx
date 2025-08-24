"use client";

import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-heading">
          <h1 className="main-title">Enhance Your Mental Wellness</h1>
          <p className="subtitle">AI-powered therapy with secure blockchain payments</p>
        </div>
        <div className="cards-container">
          <div className="card">
            <div className="card-icon">🧠</div>
            <h3>AI Therapy Sessions</h3>
            <p>24/7 access to intelligent mental health support and guidance</p>
          </div>
          <div className="card">
            <div className="card-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>Pay with CELO cryptocurrency for privacy and transparency</p>
          </div>
          <div className="card">
            <div className="card-icon">📱</div>
            <h3>Always Available</h3>
            <p>Get support whenever you need it, from anywhere in the world</p>
          </div>
        </div>
        <div className="contact-area">
          <p className="contact-text">Ready to start your wellness journey?</p>
          <button className="cta-button">Begin Chat Session</button>
        </div>
      </div>
      <style jsx>{`
        .hero-section {
          background-color: #FFFFFF;
          padding: 4rem 2rem;
          text-align: center;
          min-height: 60vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hero-content {
          max-width: 1200px;
          width: 100%;
        }
        .hero-heading {
          margin-bottom: 3rem;
        }
        .main-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .subtitle {
          font-size: 1.2rem;
          color: #666666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }
        .cards-container {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .card {
          background: #FFFFFF;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 2rem 1.5rem;
          width: 320px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          background-color: #fafafa;
        }
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: #d0d0d0;
        }
        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .card h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.8rem;
        }
        .card p {
          font-size: 1rem;
          color: #666666;
          line-height: 1.5;
        }
        .contact-area {
          margin-top: 2rem;
        }
        .contact-text {
          font-size: 1.1rem;
          color: #666666;
          margin-bottom: 1.5rem;
        }
        .cta-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        @media (max-width: 768px) {
          .hero-section {
            padding: 2rem 1rem;
          }
          .main-title {
            font-size: 2rem;
          }
          .subtitle {
            font-size: 1rem;
          }
          .cards-container {
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          .card {
            width: 100%;
            max-width: 320px;
            padding: 1.5rem 1rem;
          }
          .contact-area {
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
