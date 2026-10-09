import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getSessions, deleteSession, getSessionsForPair } from '../lib/storage';
import '../styles/History.css';

export default function History() {
  const [sessions, setSessions] = useState(getSessions());
  const [selectedPair, setSelectedPair] = useState(null);

  const handleDelete = (id) => {
    deleteSession(id);
    setSessions(getSessions());
  };

  // Get unique pairs for comparison
  const pairs = useMemo(() => {
    const pairMap = {};
    sessions.forEach((s) => {
      const key = [s.personA, s.personB].sort().join('|');
      if (!pairMap[key]) {
        pairMap[key] = { personA: s.personA, personB: s.personB, count: 0 };
      }
      pairMap[key].count += 1;
    });
    return Object.values(pairMap).filter((p) => p.count > 1);
  }, [sessions]);

  const comparisonSessions = selectedPair
    ? getSessionsForPair(selectedPair.personA, selectedPair.personB)
    : [];

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const typeEmoji = {
    couple: '💑',
    friends: '👯',
    family: '👨‍👩‍👧',
    other: '🤝',
  };

  return (
    <main className="screen-container history-screen">
      <div className="screen-header fade-in">
        <h1>📜 History</h1>
        <p className="text-muted mt-2">Your past sessions</p>
      </div>

      {sessions.length === 0 ? (
        <div className="history-empty">
          <span className="history-empty-emoji">📭</span>
          <h3>No sessions yet</h3>
          <p className="text-muted">Complete a quiz to see your history here!</p>
          <Link to="/" className="btn btn-primary mt-4">
            💕 Start a New Session
          </Link>
        </div>
      ) : (
        <>
          <div className="history-list slide-up">
            {sessions.map((s) => (
              <article key={s.id} className="history-card">
                <div className="history-card-header">
                  <span className="history-card-names">
                    {s.personA} <span className="history-card-heart">💗</span> {s.personB}
                  </span>
                  <span className="history-card-date">{formatDate(s.createdAt)}</span>
                </div>

                <span className="history-card-type">
                  {typeEmoji[s.relationshipType] || '🤝'} {s.relationshipType}
                </span>

                <div className="history-card-scores">
                  <div className="history-card-score">
                    <span className="history-card-score-label">Love Score</span>
                    <span className="history-card-score-value">{s.loveScore}%</span>
                  </div>
                  <div className="history-card-score">
                    <span className="history-card-score-label">Know Score</span>
                    <span className="history-card-score-value">{s.overallKnowScore}%</span>
                  </div>
                  {s.knowScoreAB !== undefined && (
                    <>
                      <div className="history-card-score">
                        <span className="history-card-score-label">{s.personA}→{s.personB}</span>
                        <span className="history-card-score-value">{s.knowScoreAB}%</span>
                      </div>
                      <div className="history-card-score">
                        <span className="history-card-score-label">{s.personB}→{s.personA}</span>
                        <span className="history-card-score-value">{s.knowScoreBA}%</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="history-card-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => handleDelete(s.id)}
                    aria-label={`Delete session for ${s.personA} and ${s.personB}`}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Comparison View */}
          {pairs.length > 0 && (
            <section className="history-comparison" aria-label="Score comparison">
              <h3 className="history-comparison-title">
                <span>📊</span> Compare Over Time
              </h3>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                {pairs.map((pair) => {
                  const key = `${pair.personA}|${pair.personB}`;
                  const isSelected = selectedPair &&
                    selectedPair.personA === pair.personA &&
                    selectedPair.personB === pair.personB;

                  return (
                    <button
                      key={key}
                      className={`setup-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedPair(isSelected ? null : pair)}
                    >
                      {pair.personA} & {pair.personB} ({pair.count})
                    </button>
                  );
                })}
              </div>

              {comparisonSessions.length > 0 && (
                <div className="history-comparison-chart">
                  {comparisonSessions.map((s, i) => (
                    <div key={s.id}>
                      <p style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 700,
                        color: 'var(--gray-500)',
                        marginBottom: 'var(--space-1)',
                      }}>
                        {formatDate(s.createdAt)}
                      </p>
                      <div className="history-bar-row">
                        <span className="history-bar-label">Know</span>
                        <div className="history-bar-track">
                          <div
                            className="history-bar-fill"
                            style={{ width: `${s.overallKnowScore}%` }}
                          >
                            <span className="history-bar-value">{s.overallKnowScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}

      <nav className="history-nav">
        <Link to="/" className="btn btn-secondary">
          ← Back to Home
        </Link>
      </nav>
    </main>
  );
}
