import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, useSessionDispatch } from '../context/SessionContext';
import { calculateLoveScore, interpretLoveScore, daysTogether } from '../lib/loveScore';
import ScoreRing from '../components/ScoreRing';
import FloatingHearts from '../components/FloatingHearts';
import confetti from 'canvas-confetti';
import '../styles/LoveScore.css';

export default function LoveScoreScreen() {
  const session = useSession();
  const dispatch = useSessionDispatch();
  const navigate = useNavigate();
  const [calculating, setCalculating] = useState(true);
  const [score, setScore] = useState(null);

  useEffect(() => {
    // Redirect if no setup data
    if (!session.personA || !session.personB) {
      navigate('/setup');
      return;
    }

    // Calculate after animation delay
    const timer = setTimeout(() => {
      const s = calculateLoveScore(session.personA, session.personB, {
        birthMonthA: session.birthMonthA,
        birthMonthB: session.birthMonthB,
        favoriteColorA: session.favoriteColorA,
        favoriteColorB: session.favoriteColorB,
        relationshipType: session.relationshipType,
      });

      setScore(s);
      dispatch({ type: 'SET_LOVE_SCORE', payload: s });
      setCalculating(false);

      // Confetti for high scores
      if (s >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f093fb', '#f5576c', '#ff6b9d', '#a18cd1', '#fbc2eb'],
        });
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [session.personA, session.personB, session.birthMonthA, session.birthMonthB, session.favoriteColorA, session.favoriteColorB, session.relationshipType, dispatch, navigate]);

  const interpretation = score !== null ? interpretLoveScore(score) : null;
  const days = session.startDate ? daysTogether(session.startDate) : null;

  return (
    <main className="screen-container lovescore-screen">
      <FloatingHearts />

      <div className="lovescore-content">
        {calculating ? (
          <div className="calculating-container fade-in">
            <div className="calculating-hearts" aria-hidden="true">
              <span className="calculating-heart">💗</span>
              <span className="calculating-heart">💕</span>
              <span className="calculating-heart">💖</span>
              <span className="calculating-heart">💗</span>
              <span className="calculating-heart">💕</span>
            </div>
            <p className="calculating-text">Calculating your love score...</p>
            <p className="calculating-names">
              {session.personA} & {session.personB}
            </p>
          </div>
        ) : (
          <div className="lovescore-result">
            <div className="lovescore-names">
              <span>{session.personA}</span>
              <span className="lovescore-heart">💗</span>
              <span>{session.personB}</span>
            </div>

            <ScoreRing score={score} label={interpretation?.label} />

            {days !== null && (
              <div className="lovescore-days">
                <span>📅</span>
                <span className="lovescore-days-number">{days.toLocaleString()}</span>
                <span>days together</span>
              </div>
            )}

            <p className="lovescore-fun-note">✨ Just for fun!</p>

            <div className="lovescore-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/quiz-setup')}
                id="start-quiz-btn"
              >
                🧠 Now see how well you know each other
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate('/')}
              >
                ← Back to home
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
