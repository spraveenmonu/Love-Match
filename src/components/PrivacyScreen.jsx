import '../styles/PrivacyScreen.css';

/**
 * Privacy screen for pass-and-play handoffs.
 * @param {{
 *   nextPerson: string,
 *   subtitle?: string,
 *   onReady: () => void
 * }} props
 */
export default function PrivacyScreen({ nextPerson, subtitle, onReady }) {
  return (
    <div className="privacy-screen-container cute-card">
      <div className="privacy-icon-box" aria-hidden="true">
        <span className="privacy-emoji">🙈</span>
        <span className="privacy-heart-float">💖</span>
      </div>

      <h2 className="privacy-title">Pass the Device!</h2>

      <p className="privacy-lead">
        Please hand the phone or screen to{' '}
        <strong className="privacy-person-name">{nextPerson}</strong>.
      </p>

      {subtitle && <p className="privacy-subtitle">{subtitle}</p>}

      <div className="privacy-no-peeking-pill">
        <span>🤫</span>
        <span>No peeking allowed until they're done!</span>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-block privacy-ready-btn"
        onClick={onReady}
      >
        <span>I am {nextPerson}, let's play!</span>
        <span className="heart-icon">✨</span>
      </button>
    </div>
  );
}
