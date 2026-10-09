import { useState, useEffect } from 'react';
import '../styles/TraitBar.css';

/**
 * Animated Trait Bar for Module 2 results.
 * @param {{
 *   label: string,
 *   badge: string,
 *   score: number,
 *   traitType: 'unconditional' | 'caring' | 'trueness',
 *   personName: string,
 *   caringZone?: string,
 *   isLeader?: boolean
 * }} props
 */
export default function TraitBar({
  label,
  badge,
  score,
  traitType,
  personName,
  caringZone,
  isLeader = false,
}) {
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFillWidth(Math.max(0, Math.min(100, score)));
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className={`trait-bar-item trait-type-${traitType}`}>
      <div className="trait-bar-header">
        <div className="trait-bar-title-wrap">
          <span className="trait-bar-label">{label}</span>
          {badge && <span className={`badge badge-${traitType}`}>{badge}</span>}
          {isLeader && <span className="trait-leader-star" title="Leads in this strength">✨ Leading</span>}
        </div>
        <div className="trait-score-val">
          <span className="trait-number">{score}</span>
          <span className="trait-unit">/ 100</span>
        </div>
      </div>

      <div className="trait-track" role="progressbar" aria-valuenow={score} aria-valuemin="0" aria-valuemax="100">
        <div
          className={`trait-fill fill-${traitType}`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>

      {traitType === 'caring' && caringZone && (
        <div className="caring-zone-indicator">
          <span className="caring-zone-tag">Scale: <strong>{caringZone}</strong></span>
          {caringZone === 'Cares too much' && (
            <p className="caring-too-much-note">
              💛 <em>Your big heart is beautiful. Remember to care for yourself too.</em>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
