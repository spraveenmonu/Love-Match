import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, useSessionDispatch } from '../context/SessionContext';
import { scoreAnswer, calculateRoundScore } from '../lib/scoring';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import confetti from 'canvas-confetti';
import '../styles/Round.css';

/**
 * Round flow:
 *   Round 0: firstAnswerer answers about themselves
 *   Round 1: other person guesses firstAnswerer's answers
 *   Round 2: other person answers about themselves
 *   Round 3: firstAnswerer guesses other person's answers
 */

export default function Round() {
  const session = useSession();
  const dispatch = useSessionDispatch();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('handoff'); // 'handoff' | 'playing' | 'reveal' | 'roundComplete'
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [roundIndex, setRoundIndex] = useState(0);
  const [revealData, setRevealData] = useState(null);
  const [roundResults, setRoundResults] = useState([]);

  const isFirstA = session.firstAnswerer === 'A';
  const personA = session.personA;
  const personB = session.personB;
  const questions = session.questions;

  // Determine who acts in each round
  const getRoundInfo = useCallback((ri) => {
    // Round order:
    // 0: first person answers about themselves
    // 1: second person guesses first person's answers
    // 2: second person answers about themselves
    // 3: first person guesses second person's answers
    const first = isFirstA ? personA : personB;
    const second = isFirstA ? personB : personA;

    switch (ri) {
      case 0: return { subject: first, actor: first, isGuessing: false, roundLabel: 'Round 1: Answer' };
      case 1: return { subject: first, actor: second, isGuessing: true, roundLabel: 'Round 2: Guess' };
      case 2: return { subject: second, actor: second, isGuessing: false, roundLabel: 'Round 3: Answer' };
      case 3: return { subject: second, actor: first, isGuessing: true, roundLabel: 'Round 4: Guess' };
      default: return {};
    }
  }, [isFirstA, personA, personB]);

  const currentRound = getRoundInfo(roundIndex);

  useEffect(() => {
    if (!session.personA || !session.questions?.length) {
      navigate('/quiz-setup');
    }
  }, [session.personA, session.questions, navigate]);

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    const q = questions[qIndex];

    if (currentRound.isGuessing) {
      // Find the correct answer from the previous round
      const prevRound = session.rounds[roundIndex - 1] || roundResults[roundIndex - 1];
      const correctAnswer = prevRound?.answers?.[questionId] || 'Unknown';
      const points = scoreAnswer(q.type, correctAnswer, answer, q.options);
      const isCorrect = points === 1;

      setRevealData({
        isCorrect,
        points,
        correctAnswer,
        guessedAnswer: answer,
        question: q.text,
      });

      if (isCorrect) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#52c41a', '#f093fb', '#fbc2eb'],
        });
      }

      setPhase('reveal');
    } else {
      // Self-answering: auto advance
      if (qIndex + 1 < questions.length) {
        setTimeout(() => setQIndex(qIndex + 1), 300);
      } else {
        completeRound(newAnswers);
      }
    }
  };

  const handleRevealContinue = () => {
    setRevealData(null);
    setPhase('playing');

    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1);
    } else {
      completeRound(answers);
    }
  };

  const completeRound = (finalAnswers) => {
    const round = {
      subject: currentRound.subject,
      actor: currentRound.actor,
      isGuessing: currentRound.isGuessing,
      answers: finalAnswers,
    };

    // If guessing round, calculate score
    if (currentRound.isGuessing) {
      const prevRound = roundResults[roundIndex - 1];
      const scoredAnswers = questions.map((q) => {
        const correctAnswer = prevRound?.answers?.[q.id] || '';
        const guessedAnswer = finalAnswers[q.id] || '';
        const points = scoreAnswer(q.type, correctAnswer, guessedAnswer, q.options);
        return {
          questionId: q.id,
          correctAnswer,
          guessedAnswer,
          isCorrect: points === 1,
          points,
        };
      });

      round.scoredAnswers = scoredAnswers;
      round.roundScore = calculateRoundScore(scoredAnswers);
    }

    const newResults = [...roundResults];
    newResults[roundIndex] = round;
    setRoundResults(newResults);

    // Also dispatch to global state
    dispatch({ type: 'COMPLETE_ROUND', payload: round });

    if (roundIndex < 3) {
      setPhase('roundComplete');
    } else {
      // All rounds done — navigate to results
      // We need to stash the results in session
      navigate('/results', {
        state: { roundResults: newResults },
      });
    }
  };

  const startNextRound = () => {
    setRoundIndex(roundIndex + 1);
    setQIndex(0);
    setAnswers({});
    setPhase('handoff');
  };

  const startPlaying = () => {
    setPhase('playing');
  };

  if (!questions?.length) return null;

  // ── Handoff / Privacy Screen ──────────────────
  if (phase === 'handoff') {
    const nextRound = getRoundInfo(roundIndex);
    return (
      <main className="screen-container round-screen">
        <div className="handoff-screen">
          <span className="handoff-emoji" aria-hidden="true">
            {nextRound.isGuessing ? '🔮' : '📝'}
          </span>
          <h2 className="handoff-title">
            Hand the device to{' '}
            <span className="handoff-name">{nextRound.actor}</span>
          </h2>
          <p className="handoff-subtitle">
            {nextRound.isGuessing
              ? `${nextRound.actor}, guess ${nextRound.subject}'s answers!`
              : `${nextRound.actor}, answer these questions about yourself`}
          </p>
          <p className="handoff-round-info">{nextRound.roundLabel}</p>
          <button className="btn btn-primary" onClick={startPlaying}>
            👋 I'm {nextRound.actor}, let's go!
          </button>
        </div>
      </main>
    );
  }

  // ── Round Complete ────────────────────────────
  if (phase === 'roundComplete') {
    const completedRound = roundResults[roundIndex];
    return (
      <main className="screen-container round-screen">
        <div className="round-complete">
          <span className="round-complete-emoji" aria-hidden="true">✅</span>
          <h2>{currentRound.roundLabel} Complete!</h2>
          {completedRound?.roundScore !== undefined && (
            <p className="round-complete-score">
              Score: {completedRound.roundScore}%
            </p>
          )}
          <button className="btn btn-primary" onClick={startNextRound}>
            {roundIndex < 3 ? '➡️ Next Round' : '📊 See Results'}
          </button>
        </div>
      </main>
    );
  }

  // ── Reveal Overlay ────────────────────────────
  const revealOverlay = phase === 'reveal' && revealData && (
    <div className="reveal-overlay" onClick={handleRevealContinue} role="dialog" aria-modal="true">
      <div className="reveal-card" onClick={(e) => e.stopPropagation()}>
        <span className="reveal-emoji" aria-hidden="true">
          {revealData.isCorrect ? '🎉' : '😅'}
        </span>
        <h3 className={`reveal-title ${revealData.isCorrect ? 'correct' : 'incorrect'}`}>
          {revealData.isCorrect ? 'Perfect match!' : 'Oops, not quite!'}
        </h3>
        {revealData.points === 0.5 && (
          <p className="reveal-detail" style={{ color: 'var(--warm-500)' }}>
            Close enough! Half point awarded 🌟
          </p>
        )}
        <div className="reveal-answers">
          <div className="reveal-answer-row correct-answer">
            <span>✅</span>
            <span>Correct: {revealData.correctAnswer}</span>
          </div>
          {!revealData.isCorrect && (
            <div className="reveal-answer-row wrong-answer">
              <span>❌</span>
              <span>Your guess: {revealData.guessedAnswer}</span>
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={handleRevealContinue}>
          {qIndex + 1 < questions.length ? 'Next Question →' : 'See Round Results'}
        </button>
      </div>
    </div>
  );

  // ── Playing ───────────────────────────────────
  const q = questions[qIndex];

  return (
    <main className="screen-container round-screen">
      <div className="round-header fade-in">
        <div className="round-info">
          <span className="round-badge">{currentRound.roundLabel}</span>
          <span className="round-person">
            {currentRound.isGuessing ? '🔮' : '📝'} {currentRound.actor}
          </span>
        </div>

        <ProgressBar
          current={qIndex + 1}
          total={questions.length}
          label={currentRound.isGuessing ? `Guessing ${currentRound.subject}'s answers` : 'Your answers'}
        />

        <p className="round-instruction">
          {currentRound.isGuessing
            ? `What do you think ${currentRound.subject} answered?`
            : 'Answer honestly about yourself!'}
        </p>
      </div>

      {q && (
        <QuestionCard
          key={`${roundIndex}-${q.id}`}
          question={q}
          questionNumber={qIndex + 1}
          onAnswer={(answer) => handleAnswer(q.id, answer)}
          selectedAnswer={answers[q.id]}
          disabled={phase === 'reveal'}
        />
      )}

      {revealOverlay}
    </main>
  );
}
