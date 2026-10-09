import '../styles/ProgressHearts.css';

/**
 * 3-step progress indicator with hearts for Module 1, 2, and 3.
 * @param {{ currentModule: 1 | 2 | 3 }} props
 */
export default function ProgressHearts({ currentModule = 1 }) {
  const steps = [
    { num: 1, label: 'Love & Know' },
    { num: 2, label: 'Heart Traits' },
    { num: 3, label: 'Happiness Plan' },
  ];

  return (
    <nav className="progress-hearts" aria-label="Module Progress">
      <div className="progress-hearts-track">
        {steps.map((step, idx) => {
          const isCompleted = step.num < currentModule;
          const isCurrent = step.num === currentModule;
          const statusClass = isCompleted ? 'completed' : isCurrent ? 'active' : 'upcoming';

          return (
            <div key={step.num} className={`progress-heart-step ${statusClass}`}>
              <div className="progress-heart-icon-wrap" aria-current={isCurrent ? 'step' : undefined}>
                <span className="progress-heart-symbol">
                  {isCompleted ? '💖' : isCurrent ? '💗' : '🤍'}
                </span>
                <span className="progress-step-badge">{step.num}</span>
              </div>
              <span className="progress-heart-title">{step.label}</span>
              {idx < steps.length - 1 && (
                <div
                  className={`progress-hearts-connector ${step.num < currentModule ? 'filled' : ''}`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
