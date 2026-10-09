import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useSession } from '../context/SessionContext';
import { calculateLoveScore, interpretLoveScore } from '../lib/loveScore';
import { calculateKnowScores, getMissedConversationStarters } from '../lib/knowScore';
import { knowQuestions } from '../data/knowQuestions';
import ScoreRing from '../components/ScoreRing';
import QuestionCard from '../components/QuestionCard';
import ProgressHearts from '../components/ProgressHearts';
import PrivacyScreen from '../components/PrivacyScreen';
import FloatingHearts from '../components/FloatingHearts';
import '../styles/Module1.css';

export default function Module1() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  const nameA = state.personA || 'Person 1';
  const nameB = state.personB || 'Person 2';

  // Phases within Module 1:
  // 'calc_love' -> 'reveal_love' -> 'intro_know' ->
  // 'a_answers' -> 'pass_to_b' -> 'b_guesses' ->
  // 'pass_to_b_self' -> 'b_answers' -> 'pass_to_a_guess' -> 'a_guesses' ->
  // 'results'
  const [phase, setPhase] = useState('calc_love');
  const [loveScoreVal, setLoveScoreVal] = useState(state.loveScore ?? null);
  const [calcStepText, setCalcStepText] = useState('Reading cosmic vibes...');

  // Questions state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answersA, setAnswersA] = useState(state.answersA || {});
  const [guessesB, setGuessesB] = useState(state.guessesB || {});
  const [answersB, setAnswersB] = useState(state.answersB || {});
  const [guessesA, setGuessesA] = useState(state.guessesA || {});

  // Guess reveal modal state
  const [revealModal, setRevealModal] = useState(null); // { isMatch, realAnswer, guess }

  // 1. Calculate Love Score with ~2s animation
  useEffect(() => {
    if (phase !== 'calc_love') return;

    const messages = [
      'Aligning your name vibrations... ✨',
      'Synthesizing emotional harmony... 💗',
      'Checking celestial chemistry... 🌸',
      'Almost ready... 💫'
    ];

    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setCalcStepText(messages[msgIdx]);
    }, 450);

    const timer = setTimeout(() => {
      clearInterval(msgInterval);
      const score = calculateLoveScore(nameA, nameB, {
        birthMonthA: state.birthMonthA,
        birthMonthB: state.birthMonthB,
        favoriteColorA: state.favoriteColorA,
        favoriteColorB: state.favoriteColorB,
        relationshipType: state.relationshipType,
      });

      setLoveScoreVal(score);
      dispatch({ type: 'SET_LOVE_SCORE', payload: score });
      setPhase('reveal_love');

      if (score >= 60) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FF8FAB', '#E75480', '#FFD1DC', '#FFAAA6']
          });
        } catch {
          // ignore in tests
        }
      }
    }, 2000);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(timer);
    };
  }, [phase, nameA, nameB, state, dispatch]);

  // Handler for Question choices
  const handleOptionSelect = (option) => {
    const q = knowQuestions[currentQIndex];

    if (phase === 'a_answers') {
      const nextAnswers = { ...answersA, [q.id]: option };
      setAnswersA(nextAnswers);

      if (currentQIndex + 1 < knowQuestions.length) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        // Person A finished answering. Pass device to B!
        setCurrentQIndex(0);
        setPhase('pass_to_b');
      }
    } else if (phase === 'b_guesses') {
      const realAnswer = answersA[q.id];
      const isMatch = option === realAnswer;
      const nextGuesses = { ...guessesB, [q.id]: option };
      setGuessesB(nextGuesses);

      if (isMatch) {
        try {
          confetti({
            particleCount: 25,
            spread: 40,
            origin: { y: 0.65 },
            colors: ['#FF8FAB', '#E75480']
          });
        } catch {}
      }

      setRevealModal({
        isMatch,
        guess: option,
        realAnswer,
        questionText: q.text,
      });
    } else if (phase === 'b_answers') {
      const nextAnswers = { ...answersB, [q.id]: option };
      setAnswersB(nextAnswers);

      if (currentQIndex + 1 < knowQuestions.length) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        // Person B finished answering. Pass device back to A!
        setCurrentQIndex(0);
        setPhase('pass_to_a_guess');
      }
    } else if (phase === 'a_guesses') {
      const realAnswer = answersB[q.id];
      const isMatch = option === realAnswer;
      const nextGuesses = { ...guessesA, [q.id]: option };
      setGuessesA(nextGuesses);

      if (isMatch) {
        try {
          confetti({
            particleCount: 25,
            spread: 40,
            origin: { y: 0.65 },
            colors: ['#FF8FAB', '#E75480']
          });
        } catch {}
      }

      setRevealModal({
        isMatch,
        guess: option,
        realAnswer,
        questionText: q.text,
      });
    }
  };

  const handleCloseRevealModal = () => {
    setRevealModal(null);
    if (phase === 'b_guesses') {
      if (currentQIndex + 1 < knowQuestions.length) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        // B finished guessing A. Now B answers about themselves!
        setCurrentQIndex(0);
        setPhase('pass_to_b_self');
      }
    } else if (phase === 'a_guesses') {
      if (currentQIndex + 1 < knowQuestions.length) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        // Both done! Calculate know scores and show Module 1 results
        const finalResults = calculateKnowScores({
          answersA,
          guessesB,
          answersB,
          guessesA,
          questions: knowQuestions,
        });

        dispatch({
          type: 'SET_MODULE1_RESULTS',
          payload: {
            answersA,
            guessesB,
            answersB,
            guessesA,
            knowScores: finalResults,
          },
        });

        setPhase('results');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.55 },
            colors: ['#FF8FAB', '#E75480', '#FFE4EC', '#FFD1DF']
          });
        } catch {}
      }
    }
  };

  const currentQ = knowQuestions[currentQIndex];
  const loveInterpretation = interpretLoveScore(loveScoreVal ?? 50);

  // Compute live know scores if in results phase
  const computedScores = calculateKnowScores({
    answersA,
    guessesB,
    answersB,
    guessesA,
    questions: knowQuestions,
  });

  const conversationStarters = getMissedConversationStarters(
    computedScores.combinedMissed,
    nameA,
    nameB
  );

  return (
    <div className="module-screen">
      <FloatingHearts />
      <ProgressHearts currentModule={1} />

      <main className="module-container">
        {/* ── PHASE 1: Calculating Love Score ── */}
        {phase === 'calc_love' && (
          <div className="cute-card module-card text-center calc-love-card">
            <div className="calculating-heart-pulse-wrap" aria-hidden="true">
              <div className="calc-aura-ring c1" />
              <div className="calc-aura-ring c2" />
              <span className="calculating-heart-pulse">💖</span>
            </div>
            <h2 className="module-title">Calculating Love Score...</h2>
            <p className="module-subtitle">{nameA} & {nameB}</p>
            <div className="calc-loader-bar">
              <div className="calc-loader-fill" />
            </div>
            <p className="calc-status-text">{calcStepText}</p>
          </div>
        )}

        {/* ── PHASE 2: Love Score Reveal ── */}
        {phase === 'reveal_love' && (
          <div className="cute-card module-card text-center">
            <span className="module-section-badge">Part A: Love Score</span>
            <h2 className="module-title">{nameA} + {nameB}</h2>

            <div className="module-ring-wrap">
              <ScoreRing
                score={loveScoreVal ?? 0}
                label={loveInterpretation.label}
              />
            </div>

            <p className="love-score-description">
              Based on your names and unique harmonies, here is your foundational energetic spark!
            </p>

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setPhase('intro_know')}
            >
              <span>Continue to Part B: Know-Each-Other Quiz</span>
              <span className="heart-icon">➔</span>
            </button>
          </div>
        )}

        {/* ── PHASE 3: Know Quiz Intro ── */}
        {phase === 'intro_know' && (
          <div className="cute-card module-card text-center">
            <div className="know-intro-icon">🎯</div>
            <span className="module-section-badge">Part B: Know Each Other</span>
            <h2 className="module-title">How well do you know {nameB}?</h2>
            <p className="know-intro-lead">
              A 10-question pass-and-play trivia round!
            </p>

            <div className="know-rules-card">
              <div className="know-rule-item">
                <span className="know-rule-num">1</span>
                <span><strong>{nameA}</strong> answers 10 questions about their own habits & tastes.</span>
              </div>
              <div className="know-rule-item">
                <span className="know-rule-num">2</span>
                <span>Hand device to <strong>{nameB}</strong> to guess what {nameA} said.</span>
              </div>
              <div className="know-rule-item">
                <span className="know-rule-num">3</span>
                <span>Swap roles so {nameB} answers and {nameA} guesses!</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                setCurrentQIndex(0);
                setPhase('a_answers');
              }}
            >
              <span>{nameA}: Answer About Yourself</span>
              <span className="heart-icon">✨</span>
            </button>
          </div>
        )}

        {/* ── PHASE 4: Person A Answers ── */}
        {phase === 'a_answers' && (
          <div className="quiz-turn-wrapper">
            <div className="quiz-player-banner">
              <span>👤 <strong>{nameA}</strong> answering about themselves</span>
              <span className="quiz-q-counter">Q{currentQIndex + 1}/10</span>
            </div>
            <QuestionCard
              key={`a_answers-${currentQIndex}`}
              question={currentQ}
              questionNumber={currentQIndex + 1}
              onAnswer={handleOptionSelect}
              selectedAnswer={answersA[currentQ.id]}
            />
          </div>
        )}

        {/* ── HANDOFF 1: Pass to B to guess A ── */}
        {phase === 'pass_to_b' && (
          <PrivacyScreen
            nextPerson={nameB}
            subtitle={`It is your turn to guess ${nameA}'s answers! Let's see how tuned in you are.`}
            onReady={() => setPhase('b_guesses')}
          />
        )}

        {/* ── PHASE 5: Person B Guesses A ── */}
        {phase === 'b_guesses' && (
          <div className="quiz-turn-wrapper">
            <div className="quiz-player-banner">
              <span>🔮 <strong>{nameB}</strong>: Guess what {nameA} picked!</span>
              <span className="quiz-q-counter">Q{currentQIndex + 1}/10</span>
            </div>
            <QuestionCard
              key={`b_guesses-${currentQIndex}`}
              question={currentQ}
              questionNumber={currentQIndex + 1}
              onAnswer={handleOptionSelect}
              selectedAnswer={guessesB[currentQ.id]}
            />
          </div>
        )}

        {/* ── HANDOFF 2: B Answers About Themselves ── */}
        {phase === 'pass_to_b_self' && (
          <PrivacyScreen
            nextPerson={nameB}
            subtitle={`Great guessing! Now, ${nameB}, please answer the 10 questions about yourself.`}
            onReady={() => setPhase('b_answers')}
          />
        )}

        {/* ── PHASE 6: Person B Answers ── */}
        {phase === 'b_answers' && (
          <div className="quiz-turn-wrapper">
            <div className="quiz-player-banner">
              <span>👤 <strong>{nameB}</strong> answering about themselves</span>
              <span className="quiz-q-counter">Q{currentQIndex + 1}/10</span>
            </div>
            <QuestionCard
              key={`b_answers-${currentQIndex}`}
              question={currentQ}
              questionNumber={currentQIndex + 1}
              onAnswer={handleOptionSelect}
              selectedAnswer={answersB[currentQ.id]}
            />
          </div>
        )}

        {/* ── HANDOFF 3: Pass back to A to guess B ── */}
        {phase === 'pass_to_a_guess' && (
          <PrivacyScreen
            nextPerson={nameA}
            subtitle={`Ready to guess ${nameB}'s choices? Hand the phone back to ${nameA}!`}
            onReady={() => setPhase('a_guesses')}
          />
        )}

        {/* ── PHASE 7: Person A Guesses B ── */}
        {phase === 'a_guesses' && (
          <div className="quiz-turn-wrapper">
            <div className="quiz-player-banner">
              <span>🔮 <strong>{nameA}</strong>: Guess what {nameB} picked!</span>
              <span className="quiz-q-counter">Q{currentQIndex + 1}/10</span>
            </div>
            <QuestionCard
              key={`a_guesses-${currentQIndex}`}
              question={currentQ}
              questionNumber={currentQIndex + 1}
              onAnswer={handleOptionSelect}
              selectedAnswer={guessesA[currentQ.id]}
            />
          </div>
        )}

        {/* ── PHASE 8: Module 1 Results ── */}
        {phase === 'results' && (
          <div className="cute-card module-card">
            <div className="text-center">
              <span className="module-section-badge">Module 1 Complete! 🏆</span>
              <h2 className="module-title">Love & Trivia Summary</h2>
              <p className="module-subtitle">{nameA} & {nameB}</p>
            </div>

            {/* Scores Overview Grid */}
            <div className="module1-scores-summary">
              <div className="m1-score-card">
                <span className="m1-score-title">Love Score</span>
                <span className="m1-score-big">{loveScoreVal}%</span>
                <span className="m1-score-tag">{loveInterpretation.label}</span>
              </div>

              <div className="m1-score-card">
                <span className="m1-score-title">Overall Know Score</span>
                <span className="m1-score-big">{computedScores.overallKnowScore}%</span>
                <span className="m1-score-tag">
                  {computedScores.overallKnowScore >= 70 ? 'Super In Sync! 💫' : 'Fun Insights! 🌱'}
                </span>
              </div>
            </div>

            {/* Individual Know Comparison */}
            <div className="m1-breakdown-card">
              <h3 className="m1-breakdown-heading">Insight Breakdown</h3>
              <div className="m1-breakdown-row">
                <span>{nameA} knows {nameB}</span>
                <strong>{computedScores.pctAKnowsB}% ({computedScores.correctAKnowsB}/10 match)</strong>
              </div>
              <div className="m1-breakdown-row">
                <span>{nameB} knows {nameA}</span>
                <strong>{computedScores.pctBKnowsA}% ({computedScores.correctBKnowsA}/10 match)</strong>
              </div>
            </div>

            {/* Conversation Starters from Missed Questions */}
            <div className="m1-starters-section">
              <h3 className="m1-starters-heading">
                <span>💬 Top Conversation Starters</span>
              </h3>
              <p className="m1-starters-sub">
                The sweetest moments come from learning the answers you didn't expect:
              </p>
              <div className="m1-starters-list">
                {conversationStarters.map((starter, i) => (
                  <div key={i} className="m1-starter-pill">
                    <span className="m1-starter-bullet">✦</span>
                    <span>{starter}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="module-next-action">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => {
                  dispatch({ type: 'SET_ACTIVE_MODULE', payload: 2 });
                  navigate('/module2');
                }}
              >
                <span>Continue to Module 2: Heart Traits</span>
                <span className="heart-icon">➔</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Instant Guess Reveal Modal ── */}
        {revealModal && (
          <div className="reveal-overlay" role="dialog" aria-modal="true">
            <div className="reveal-card">
              <span className="reveal-emoji" aria-hidden="true">
                {revealModal.isMatch ? '💖' : '💭'}
              </span>
              <h3 className={`reveal-title ${revealModal.isMatch ? 'correct' : 'incorrect'}`}>
                {revealModal.isMatch ? 'Perfect match!' : 'Oops, not quite!'}
              </h3>
              <p className="reveal-detail">
                {revealModal.questionText}
              </p>

              <div className="reveal-answers">
                <div className={`reveal-answer-row ${revealModal.isMatch ? 'correct-answer' : 'wrong-answer'}`}>
                  <span className="reveal-label">Your guess</span>
                  <span>{revealModal.guess}</span>
                </div>
                {!revealModal.isMatch && (
                  <div className="reveal-answer-row correct-answer">
                    <span className="reveal-label">Real answer</span>
                    <span>{revealModal.realAnswer}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleCloseRevealModal}
                autoFocus
              >
                <span>Next</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
