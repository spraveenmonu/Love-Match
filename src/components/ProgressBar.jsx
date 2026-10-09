import '../styles/ProgressBar.css';

/**
 * Quiz progress bar.
 * @param {{ current: number, total: number, label?: string }} props
 */
export default function ProgressBar({ current, total, label }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="progress-bar-container" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className="progress-bar-info">
        <span className="progress-bar-label">{label || 'Progress'}</span>
        <span className="progress-bar-count">{current} / {total}</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
