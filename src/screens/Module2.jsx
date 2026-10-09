import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useSession } from '../context/SessionContext';
import { traitQuestions } from '../data/traitQuestions';
import { normalizeTraitScores, compareTraits } from '../lib/traits';
import TraitBar from '../components/TraitBar';
import ProgressHearts from '../components/ProgressHearts';
import PrivacyScreen from '../components/PrivacyScreen';
import FloatingHearts from '../components/FloatingHearts';
import '../styles/Module2.css';

export default function Module2() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  const nameA = state.personA || 'Person 1';
  const nameB = state.personB || 'Person 2';

  // Phases: 'intro' -> 'a_scenarios' -> 'pass_to_b' -> 'b_scenarios' -> 'results'
  const [phase, setPhase] = useState('intro');
  const [currentIdx, setCurrentIdx] = useState(0);

  const [answersA, setAnswersA] = useState(state.traitAnswersA || {});
  const [answersB, setAnswersB] = useState(state.traitAnswersB || {});

  // Handle option select (optIdx: 0, 1, or 2)
  const handleSelectOption = (optIdx) => {
    const q = traitQuestions[currentIdx];

    if (phase === 'a_scenarios') {
      const nextAnswers = { ...answersA, [q.id]: optIdx };
      setAnswersA(nextAnswers);

      if (currentIdx + 1 < traitQuestions.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        // A finished 12 scenarios. Pass to B!
        setCurrentIdx(0);
        setPhase('pass_to_b');
      }
    } else if (phase === 'b_scenarios') {
      const nextAnswers = { ...answersB, [q.id]: optIdx };
      setAnswersB(nextAnswers);

      if (currentIdx + 1 < traitQuestions.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        // B finished! Calculate traits and show results
        const scoresA = normalizeTraitScores(answersA, traitQuestions);
        const scoresB = normalizeTraitScores(nextAnswers, traitQuestions);
        const comparison = compareTraits(scoresA, scoresB, nameA, nameB);

        dispatch({
          type: 'SET_MODULE2_RESULTS',
          payload: {
            traitAnswersA: answersA,
            traitAnswersB: nextAnswers,
            traitScoresA: scoresA,
            traitScoresB: scoresB,
            traitComparison: comparison,
          },
        });

        setPhase('results');
        try {
          confetti({
            particleCount: 75,
            spread: 65,
            origin: { y: 0.5 },
            colors: ['#FF6584', '#FF8FAB', '#E75480', '#FFAAA6']
          });
        } catch {}
      }
    }
  };

  const currentQ = traitQuestions[currentIdx];

  // Compute live scores for display
  const scoresA = state.traitScoresA.unconditional > 0
    ? state.traitScoresA
    : normalizeTraitScores(answersA, traitQuestions);
  const scoresB = state.traitScoresB.unconditional > 0
    ? state.traitScoresB
    : normalizeTraitScores(answersB, traitQuestions);
  const comparison = state.traitComparison.comparisonLine
    ? state.traitComparison
    : compareTraits(scoresA, scoresB, nameA, nameB);

  return (
    <div className="module-screen">
      <FloatingHearts />
      <ProgressHearts currentModule={2} />

      <main className="module-container">
        {/* ── PHASE 1: Intro ── */}
        {phase === 'intro' && (
          <div className="cute-card module-card text-center">
            <span className="module-section-badge">Module 2</span>
            <h1 className="module-title">Heart Traits & Devotion 🌿</h1>
            <p className="module-subtitle">
              Who loves unconditionally, cares deeply, and is true?
            </p>

            <div className="module2-intro-box">
              <p className="intro-text">
                Each of you will privately respond to <strong>12 gentle real-life scenarios</strong>. No judgment, no right or wrong answers — just an affectionate look into your heart styles.
              </p>

              <div className="intro-traits-grid">
                <div className="intro-trait-card">
                  <span className="trait-icon">🌸</span>
                  <strong>Unconditional Love</strong>
                  <span>Staying warm through mistakes & bad days</span>
                </div>
                <div className="intro-trait-card">
                  <span className="trait-icon">💗</span>
                  <strong>Caring Level</strong>
                  <span>From space-giving to tender devotion</span>
                </div>
                <div className="intro-trait-card">
                  <span className="trait-icon">💎</span>
                  <strong>Trueness</strong>
                  <span>Steadfast loyalty, truth & dependability</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                setCurrentIdx(0);
                setPhase('a_scenarios');
              }}
            >
              <span>{nameA}: Start 12 Scenarios</span>
              <span className="heart-icon">➔</span>
            </button>
          </div>
        )}

        {/* ── PHASE 2: Person A Answers Scenarios ── */}
        {phase === 'a_scenarios' && (
          <div className="scenario-turn-wrapper">
            <div className="quiz-player-banner">
              <span>👤 <strong>{nameA}</strong>'s Heart Scenario</span>
              <span className="quiz-q-counter">Scenario {currentIdx + 1}/12</span>
            </div>

            <div key={`a_scenarios-${currentIdx}`} className="cute-card scenario-card">
              <h2 className="scenario-prompt">&ldquo;{currentQ.scenario}&rdquo;</h2>
              <p className="scenario-instruction">How would you naturally respond?</p>

              <div className="scenario-options-list">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="scenario-option-btn"
                    onClick={() => handleSelectOption(idx)}
                  >
                    <span className="scenario-marker">✦</span>
                    <span className="scenario-option-text">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HANDOFF: Pass to Person B ── */}
        {phase === 'pass_to_b' && (
          <PrivacyScreen
            nextPerson={nameB}
            subtitle={`${nameA} finished their scenarios. Now it's ${nameB}'s turn to take the private 12-question heart quiz!`}
            onReady={() => setPhase('b_scenarios')}
          />
        )}

        {/* ── PHASE 3: Person B Answers Scenarios ── */}
        {phase === 'b_scenarios' && (
          <div className="scenario-turn-wrapper">
            <div className="quiz-player-banner">
              <span>👤 <strong>{nameB}</strong>'s Heart Scenario</span>
              <span className="quiz-q-counter">Scenario {currentIdx + 1}/12</span>
            </div>

            <div key={`b_scenarios-${currentIdx}`} className="cute-card scenario-card">
              <h2 className="scenario-prompt">&ldquo;{currentQ.scenario}&rdquo;</h2>
              <p className="scenario-instruction">How would you naturally respond?</p>

              <div className="scenario-options-list">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="scenario-option-btn"
                    onClick={() => handleSelectOption(idx)}
                  >
                    <span className="scenario-marker">✦</span>
                    <span className="scenario-option-text">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PHASE 4: Module 2 Results ── */}
        {phase === 'results' && (
          <div className="cute-card module-card">
            <div className="text-center">
              <span className="module-section-badge">Module 2 Complete! 🌷</span>
              <h2 className="module-title">Your Heart Traits</h2>
              <p className="module-subtitle">A kind reflection of how you care and connect</p>
            </div>

            {/* Kind comparative callout */}
            <div className="module2-kind-banner">
              <span className="banner-sparkle">✨</span>
              <p className="banner-text">
                {comparison.comparisonLine}
              </p>
            </div>

            {/* Side-by-side or stacked Person A & Person B Trait Cards */}
            <div className="traits-people-grid">
              {/* Person A */}
              <div className="person-trait-group">
                <div className="person-trait-header">
                  <h3 className="person-name-title">{nameA}</h3>
                  <div className="badges-row">
                    {scoresA.badges.map((b, i) => (
                      <span key={i} className="badge badge-unconditional">{b}</span>
                    ))}
                  </div>
                </div>

                <TraitBar
                  label="Unconditional Love"
                  badge="Warm Grace"
                  score={scoresA.unconditional}
                  traitType="unconditional"
                  personName={nameA}
                  isLeader={comparison.leaders.unconditional === nameA}
                />
                <TraitBar
                  label="Caring Style"
                  badge="Attentiveness"
                  score={scoresA.caring}
                  traitType="caring"
                  personName={nameA}
                  caringZone={scoresA.caringZone}
                  isLeader={comparison.leaders.caring === nameA}
                />
                <TraitBar
                  label="Trueness & Loyalty"
                  badge="Anchor"
                  score={scoresA.trueness}
                  traitType="trueness"
                  personName={nameA}
                  isLeader={comparison.leaders.trueness === nameA}
                />
              </div>

              {/* Person B */}
              <div className="person-trait-group">
                <div className="person-trait-header">
                  <h3 className="person-name-title">{nameB}</h3>
                  <div className="badges-row">
                    {scoresB.badges.map((b, i) => (
                      <span key={i} className="badge badge-trueness">{b}</span>
                    ))}
                  </div>
                </div>

                <TraitBar
                  label="Unconditional Love"
                  badge="Warm Grace"
                  score={scoresB.unconditional}
                  traitType="unconditional"
                  personName={nameB}
                  isLeader={comparison.leaders.unconditional === nameB}
                />
                <TraitBar
                  label="Caring Style"
                  badge="Attentiveness"
                  score={scoresB.caring}
                  traitType="caring"
                  personName={nameB}
                  caringZone={scoresB.caringZone}
                  isLeader={comparison.leaders.caring === nameB}
                />
                <TraitBar
                  label="Trueness & Loyalty"
                  badge="Anchor"
                  score={scoresB.trueness}
                  traitType="trueness"
                  personName={nameB}
                  isLeader={comparison.leaders.trueness === nameB}
                />
              </div>
            </div>

            {/* Shared Balance Explanation */}
            <div className="balance-insight-card">
              <div className="balance-icon">🤝💖</div>
              <div className="balance-content">
                <h4 className="balance-title">How You Balance Each Other</h4>
                <p className="balance-description">{comparison.balanceReason}</p>
              </div>
            </div>

            <div className="module-next-action">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => {
                  dispatch({ type: 'SET_ACTIVE_MODULE', payload: 3 });
                  navigate('/module3');
                }}
              >
                <span>Continue to Module 3: Happiness Plan</span>
                <span className="heart-icon">➔</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
