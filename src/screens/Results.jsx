import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSession, useSessionDispatch } from '../context/SessionContext';
import {
  calculateOverallKnowScore,
  getCombinedInterpretation,
  getTips,
  analyzeResults,
} from '../lib/scoring';
import { saveSession, generateId } from '../lib/storage';
import { encodeShareData } from '../lib/share';
import ScoreRing from '../components/ScoreRing';
import ShareCard from '../components/ShareCard';
import FloatingHearts from '../components/FloatingHearts';
import questions from '../data/questions';
import confetti from 'canvas-confetti';
import '../styles/Results.css';

export default function Results() {
  const session = useSession();
  const dispatch = useSessionDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const roundResults = location.state?.roundResults || session.rounds || [];

  // Calculate scores
  const scores = useMemo(() => {
    if (roundResults.length < 4) return null;

    const isFirstA = session.firstAnswerer === 'A';
    // Round 1 (index 1): second guesses first's answers
    // Round 3 (index 3): first guesses second's answers
    const guessRound1 = roundResults[1]; // second guesses first
    const guessRound3 = roundResults[3]; // first guesses second

    const score1 = guessRound1?.roundScore ?? 0; // second knows first
    const score3 = guessRound3?.roundScore ?? 0; // first knows second

    let aKnowsB, bKnowsA;
    if (isFirstA) {
      // first = A, second = B
      // Round 1: B guesses A → bKnowsA
      // Round 3: A guesses B → aKnowsB
      bKnowsA = score1;
      aKnowsB = score3;
    } else {
      // first = B, second = A
      // Round 1: A guesses B → aKnowsB
      // Round 3: B guesses A → bKnowsA
      aKnowsB = score1;
      bKnowsA = score3;
    }

    const overallKnow = calculateOverallKnowScore(aKnowsB, bKnowsA);

    // Analyze all guess answers
    const allGuesses = [
      ...(guessRound1?.scoredAnswers || []),
      ...(guessRound3?.scoredAnswers || []),
    ];
    const analysis = analyzeResults(allGuesses, questions);

    return { aKnowsB, bKnowsA, overallKnow, analysis };
  }, [roundResults, session.firstAnswerer]);

  // Save to localStorage on mount
  useEffect(() => {
    if (!scores || !session.loveScore) return;

    const sessionData = {
      id: generateId(),
      personA: session.personA,
      personB: session.personB,
      relationshipType: session.relationshipType,
      loveScore: session.loveScore,
      knowScoreAB: scores.aKnowsB,
      knowScoreBA: scores.bKnowsA,
      overallKnowScore: scores.overallKnow,
      createdAt: new Date().toISOString(),
      rounds: roundResults,
    };

    saveSession(sessionData);

    // Celebration confetti
    if (scores.overallKnow >= 60) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f093fb', '#f5576c', '#ff6b9d', '#52c41a', '#a18cd1'],
        });
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!scores || session.loveScore === null) {
    return (
      <main className="screen-container results-screen">
        <div className="screen-center">
          <h2>No results yet</h2>
          <p className="text-muted mt-4">Complete the quiz to see your results!</p>
          <Link to="/setup" className="btn btn-primary mt-6">Start Over</Link>
        </div>
      </main>
    );
  }

  const interpretation = getCombinedInterpretation(session.loveScore, scores.overallKnow);
  const tips = getTips(scores.overallKnow, session.relationshipType);

  const shareData = {
    personA: session.personA,
    personB: session.personB,
    loveScore: session.loveScore,
    knowScore: scores.overallKnow,
    aKnowsB: scores.aKnowsB,
    bKnowsA: scores.bKnowsA,
    interpretation: interpretation.title,
    emoji: interpretation.emoji,
  };

  const handleRetake = () => {
    dispatch({ type: 'RESET' });
    navigate('/');
  };

  return (
    <main className="screen-container results-screen">
      <FloatingHearts />

      <div className="screen-header fade-in">
        <h1>Your Results 💫</h1>
        <p className="text-muted mt-2">
          {session.personA} & {session.personB}
        </p>
      </div>

      {/* Love Score + Know Score */}
      <div className="results-scores slide-up">
        <div className="results-score-card card">
          <span className="results-score-card-label">Love Score</span>
          <ScoreRing score={session.loveScore} size="small" />
        </div>
        <div className="results-score-card card">
          <span className="results-score-card-label">Know Score</span>
          <ScoreRing score={scores.overallKnow} size="small" />
        </div>
      </div>

      {/* Individual scores */}
      <div className="results-scores" style={{ marginTop: 'var(--space-4)' }}>
        <div className="results-score-card">
          <span className="results-score-card-label">
            {session.personA} knows {session.personB}
          </span>
          <span className="score-ring-number" style={{ fontSize: 'var(--font-size-2xl)' }}>
            {scores.aKnowsB}%
          </span>
        </div>
        <div className="results-score-card">
          <span className="results-score-card-label">
            {session.personB} knows {session.personA}
          </span>
          <span className="score-ring-number" style={{ fontSize: 'var(--font-size-2xl)' }}>
            {scores.bKnowsA}%
          </span>
        </div>
      </div>

      {/* Combined Interpretation */}
      <div className="results-overall card slide-up">
        <div className="results-interpretation">
          <h2 className="results-interpretation-title">
            <span>{interpretation.emoji}</span>
            <span>{interpretation.title}</span>
          </h2>
          <p className="results-interpretation-desc">
            {interpretation.description}
          </p>
        </div>
      </div>

      {/* Best Known Topics */}
      {scores.analysis.bestTopics.length > 0 && (
        <section className="results-section slide-up" aria-label="Best known topics">
          <h3 className="results-section-title">
            <span>🏆</span> Best-Known Topics
          </h3>
          <div className="results-topics">
            {scores.analysis.bestTopics.map((topic) => (
              <span key={topic} className="results-topic-chip">{topic}</span>
            ))}
          </div>
        </section>
      )}

      {/* Surprising Misses */}
      {scores.analysis.surprisingMisses.length > 0 && (
        <section className="results-section slide-up" aria-label="Surprising misses">
          <h3 className="results-section-title">
            <span>😲</span> Most Surprising Misses
          </h3>
          <div className="results-misses">
            {scores.analysis.surprisingMisses.map((miss, i) => (
              <div key={i} className="results-miss-card">
                <p className="results-miss-question">{miss.question}</p>
                <div className="results-miss-answers">
                  <span>✅ {miss.expected}</span>
                  <span>❌ {miss.actual}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips */}
      <section className="results-section slide-up" aria-label="Relationship tips">
        <h3 className="results-section-title">
          <span>💡</span> Tips For You
        </h3>
        <div className="results-tips">
          {tips.map((tip, i) => (
            <div key={i} className="results-tip">
              <span className="results-tip-emoji">{['🌟', '💬', '🎯'][i]}</span>
              <p className="results-tip-text">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Share Card */}
      <section className="results-share-section slide-up" aria-label="Share results">
        <h3 className="results-section-title text-center" style={{ justifyContent: 'center' }}>
          <span>📤</span> Share Your Results
        </h3>
        <ShareCard
          personA={session.personA}
          personB={session.personB}
          loveScore={session.loveScore}
          knowScore={scores.overallKnow}
          interpretation={interpretation}
          shareData={shareData}
        />
      </section>

      <p className="results-fun-note">✨ Just for fun — not scientific!</p>

      {/* Actions */}
      <div className="results-actions">
        <button className="btn btn-primary" onClick={handleRetake}>
          🔄 Retake Quiz
        </button>
        <Link to="/history" className="btn btn-secondary">
          📜 View History
        </Link>
      </div>
    </main>
  );
}
