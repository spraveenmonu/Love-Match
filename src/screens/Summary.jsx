import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useSession } from '../context/SessionContext';
import { saveSession, generateId } from '../lib/storage';
import SummaryCard from '../components/SummaryCard';
import FloatingHearts from '../components/FloatingHearts';
import '../styles/Summary.css';

export default function Summary() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  const nameA = state.personA || 'Person 1';
  const nameB = state.personB || 'Person 2';
  const loveScore = state.loveScore ?? 80;
  const knowScore = state.knowScores?.overallKnowScore ?? 75;
  const traitsA = state.traitScoresA;
  const traitsB = state.traitScoresB;
  const recs = state.recommendations;
  const headline = recs?.headlineRecommendation || 'Cherish each other with curious warmth and joy!';

  // Automatically save session to localStorage on reaching Summary
  useEffect(() => {
    if (state.personA && state.personB) {
      saveSession({
        id: generateId(),
        personA: nameA,
        personB: nameB,
        relationshipType: state.relationshipType,
        loveScore,
        knowScoreAB: state.knowScores?.pctAKnowsB ?? 0,
        knowScoreBA: state.knowScores?.pctBKnowsA ?? 0,
        overallKnowScore: knowScore,
        traitsA,
        traitsB,
        headlineRecommendation: headline,
        createdAt: new Date().toISOString(),
      });
    }

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FF8FAB', '#E75480', '#FFE4EC', '#FFD1DF', '#FF6584']
      });
    } catch {}
  }, []);

  const sharePayload = {
    personA: nameA,
    personB: nameB,
    relationshipType: state.relationshipType,
    loveScore,
    knowScore,
    traitsA: {
      unconditional: traitsA.unconditional,
      caring: traitsA.caring,
      trueness: traitsA.trueness,
      badges: traitsA.badges,
    },
    traitsB: {
      unconditional: traitsB.unconditional,
      caring: traitsB.caring,
      trueness: traitsB.trueness,
      badges: traitsB.badges,
    },
    headlineRecommendation: headline,
  };

  const handleRetake = () => {
    dispatch({ type: 'RESET_SESSION' });
    navigate('/setup');
  };

  return (
    <div className="summary-screen">
      <FloatingHearts />

      <main className="summary-screen-content">
        <header className="summary-screen-header">
          <span className="summary-screen-pill">All 3 Modules Completed! 🎉</span>
          <h1 className="summary-screen-title">Your LoveMatch Keepsake</h1>
          <p className="summary-screen-subtitle">
            Download your high-resolution keepsake card or share your private link with friends!
          </p>
        </header>

        <SummaryCard
          personA={nameA}
          personB={nameB}
          loveScore={loveScore}
          knowScore={knowScore}
          traitsA={traitsA}
          traitsB={traitsB}
          headlineRecommendation={headline}
          shareData={sharePayload}
          onRetake={handleRetake}
          isReadOnly={false}
        />
      </main>
    </div>
  );
}
