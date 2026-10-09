import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useSession } from '../context/SessionContext';
import { generateRecommendations } from '../lib/recommendations';
import { getChallengeProgress, saveChallengeProgress } from '../lib/storage';
import ProgressHearts from '../components/ProgressHearts';
import FloatingHearts from '../components/FloatingHearts';
import '../styles/Module3.css';

export default function Module3() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  const nameA = state.personA || 'Person 1';
  const nameB = state.personB || 'Person 2';
  const pairKey = `${nameA}_${nameB}`.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const loveScore = state.loveScore ?? 75;
  const knowScore = state.knowScores?.overallKnowScore ?? 70;
  const traitsA = state.traitScoresA;
  const traitsB = state.traitScoresB;
  const missedQuestions = state.knowScores?.combinedMissed || [];

  // Generate or read recommendations
  const [recData, setRecData] = useState(() => {
    return generateRecommendations({
      nameA,
      nameB,
      loveScore,
      knowScore,
      traitsA,
      traitsB,
      missedQuestions,
    });
  });

  // 7-day challenge checkboxes saved in localStorage
  const [challengeChecks, setChallengeChecks] = useState(() => {
    return getChallengeProgress(pairKey);
  });

  useEffect(() => {
    dispatch({ type: 'SET_RECOMMENDATIONS', payload: recData });
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF8FAB', '#E75480', '#FFD1DF']
      });
    } catch {}
  }, []);

  const toggleChallengeDay = (dayNum) => {
    const updated = {
      ...challengeChecks,
      [dayNum]: !challengeChecks[dayNum],
    };
    setChallengeChecks(updated);
    saveChallengeProgress(pairKey, updated);

    // If day is checked, tiny celebratory burst!
    if (!challengeChecks[dayNum]) {
      try {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.7 },
          colors: ['#FF8FAB', '#E75480']
        });
      } catch {}
    }
  };

  const completedCount = Object.values(challengeChecks).filter(Boolean).length;

  return (
    <div className="module-screen">
      <FloatingHearts />
      <ProgressHearts currentModule={3} />

      <main className="module-container">
        <div className="cute-card module-card">
          <header className="text-center">
            <span className="module-section-badge">Module 3 💌</span>
            <h1 className="module-title">Your Happiness Plan</h1>
            <p className="module-subtitle">
              Customized insights, date adventures, and daily connection rituals for {nameA} & {nameB}
            </p>
          </header>

          {/* 1. Warm Summary */}
          <section className="m3-section-card m3-summary-box">
            <div className="m3-section-tag">🌟 Bond Strengths</div>
            <p className="m3-summary-text">&ldquo;{recData.summary}&rdquo;</p>
          </section>

          {/* 2. 3 Matched Date Ideas */}
          <section className="m3-section-card">
            <div className="m3-section-tag">🎟️ 3 Tailored Date Ideas</div>
            <p className="m3-section-hint">Curated specifically to match your love & know dynamics:</p>
            <div className="m3-dates-grid">
              {recData.dateIdeas.map((idea, idx) => (
                <div key={idx} className="m3-date-card">
                  <span className="m3-date-icon" aria-hidden="true">{idea.icon}</span>
                  <div className="m3-date-content">
                    <h3 className="m3-date-title">{idea.title}</h3>
                    <p className="m3-date-desc">{idea.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. 3 Conversation Starters */}
          <section className="m3-section-card">
            <div className="m3-section-tag">💬 3 Meaningful Starters</div>
            <p className="m3-section-hint">Dive into the sweetest topics to spark deeper intimacy:</p>
            <div className="m3-starters-list">
              {recData.conversationStarters.map((starter, idx) => (
                <div key={idx} className="m3-starter-item">
                  <span className="m3-starter-bullet">💌</span>
                  <span className="m3-starter-text">{starter}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Small Gestures */}
          <section className="m3-section-card">
            <div className="m3-section-tag">🌷 Personalized Small Gestures</div>
            <div className="m3-two-column-card">
              <div className="m3-col-person">
                <h4>For {nameA} to do:</h4>
                <p>{recData.gestureA}</p>
              </div>
              <div className="m3-col-person">
                <h4>For {nameB} to do:</h4>
                <p>{recData.gestureB}</p>
              </div>
            </div>
          </section>

          {/* 5. Growth Tips */}
          <section className="m3-section-card">
            <div className="m3-section-tag">🌱 Gentle Growth Tips</div>
            <div className="m3-two-column-card">
              <div className="m3-col-person">
                <h4>Tip for {nameA}:</h4>
                <p>{recData.tipA}</p>
              </div>
              <div className="m3-col-person">
                <h4>Tip for {nameB}:</h4>
                <p>{recData.tipB}</p>
              </div>
            </div>
          </section>

          {/* 6. 7-Day Happy Together Challenge */}
          <section className="m3-section-card m3-challenge-box">
            <div className="m3-challenge-header">
              <div>
                <div className="m3-section-tag">🗓️ 7-Day Happy Together Challenge</div>
                <p className="m3-section-hint">One tiny loving micro-action per day:</p>
              </div>
              <span className="m3-challenge-count-pill">{completedCount} / 7 Done</span>
            </div>

            <div className="m3-challenge-list">
              {recData.challenges.map((item) => {
                const isChecked = !!challengeChecks[item.day];
                return (
                  <label key={item.day} className={`m3-challenge-item ${isChecked ? 'completed' : ''}`}>
                    <input
                      type="checkbox"
                      className="m3-checkbox"
                      checked={isChecked}
                      onChange={() => toggleChallengeDay(item.day)}
                    />
                    <div className="m3-challenge-text-wrap">
                      <strong className="m3-challenge-title">Day {item.day}: {item.title}</strong>
                      <span className="m3-challenge-desc">{item.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Continue to Final Summary Card */}
          <div className="module-next-action text-center">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => navigate('/summary')}
            >
              <span>View Final Summary Card & Share</span>
              <span className="heart-icon">📸</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
