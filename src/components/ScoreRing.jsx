import { useState, useEffect } from 'react';
import '../styles/ScoreRing.css';

/**
 * Animated circular score ring using SVG with stroke-dashoffset animation and celebratory pop.
 * @param {{ score: number, size?: 'normal'|'small', label?: string, animate?: boolean }} props
 */
export default function ScoreRing({ score, size = 'normal', label, animate = true }) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [isDone, setIsDone] = useState(!animate);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(animate ? circumference : circumference - (circumference * score) / 100);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setOffset(circumference - (circumference * score) / 100);
      setIsDone(true);
      return;
    }

    const duration = 1400;
    const startTime = Date.now();
    const startScore = 0;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startScore + (score - startScore) * eased);
      setDisplayScore(current);

      if (progress >= 1) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, 16);

    const frame = requestAnimationFrame(() => {
      setOffset(circumference - (circumference * score) / 100);
    });

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(frame);
    };
  }, [score, animate, circumference]);

  return (
    <div className="score-ring-wrapper">
      <div className={`score-ring-container ${size} ${isDone ? 'ring-completed' : ''}`}>
        <div className="score-ring-aura" aria-hidden="true" />
        <svg className="score-ring-svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="scorePinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6584" />
              <stop offset="50%" stopColor="#FF8FAB" />
              <stop offset="100%" stopColor="#E75480" />
            </linearGradient>
            <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#E75480" floodOpacity="0.45" />
            </filter>
          </defs>
          <circle
            className="score-ring-bg"
            cx="50"
            cy="50"
            r={radius}
          />
          <circle
            className="score-ring-progress"
            cx="50"
            cy="50"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter="url(#scoreGlow)"
          />
        </svg>
        <div className="score-ring-label">
          <span className={`score-ring-number ${isDone ? 'score-pop' : ''}`}>{displayScore}</span>
          <span className="score-ring-percent">%</span>
        </div>
      </div>
      {label && (
        <div className="score-ring-interpretation-pill">
          <span className="pill-star">✨</span>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
