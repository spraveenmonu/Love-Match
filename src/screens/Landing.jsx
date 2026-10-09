import { Link } from 'react-router-dom';
import FloatingHearts from '../components/FloatingHearts';
import '../styles/Landing.css';

export default function Landing() {
  return (
    <div className="landing-screen">
      <FloatingHearts />

      <main className="landing-card cute-card">
        <div className="landing-hero-heart-wrap">
          <div className="landing-aura-pulse" aria-hidden="true" />
          <div className="landing-aura-pulse-outer" aria-hidden="true" />
          <span className="landing-hero-heart" aria-hidden="true">💖</span>
          <span className="landing-hero-sparkle s1" aria-hidden="true">✨</span>
          <span className="landing-hero-sparkle s2" aria-hidden="true">💕</span>
        </div>

        <h1 className="landing-title">LoveMatch</h1>

        <p className="landing-pitch">
          A sweet, playful connection game for two. Celebrate your bond, test your trivia, and discover how beautifully you complement each other.
        </p>

        <div className="landing-disclaimer-pill" role="note">
          <span className="disclaimer-sparkle">✨</span>
          <span>Just for fun, not scientific — 100% warm vibes!</span>
        </div>

        {/* 3 Modules Preview */}
        <div className="landing-modules-preview" aria-label="App Modules">
          <div className="landing-module-chip">
            <span className="module-chip-icon">💘</span>
            <div className="module-chip-text">
              <strong>Module 1</strong>
              <span>Love & Know</span>
            </div>
          </div>

          <div className="landing-module-chip">
            <span className="module-chip-icon">🌿</span>
            <div className="module-chip-text">
              <strong>Module 2</strong>
              <span>Heart Traits</span>
            </div>
          </div>

          <div className="landing-module-chip">
            <span className="module-chip-icon">💌</span>
            <div className="module-chip-text">
              <strong>Module 3</strong>
              <span>Happiness Plan</span>
            </div>
          </div>
        </div>

        <div className="landing-action-wrap">
          <Link to="/setup" className="btn btn-primary btn-block" id="start-btn">
            <span>Start LoveMatch</span>
            <span className="heart-icon">💕</span>
          </Link>
        </div>

        <p className="landing-footer-note">
          Perfect for couples, best friends, and family! 🌸
        </p>
      </main>
    </div>
  );
}
