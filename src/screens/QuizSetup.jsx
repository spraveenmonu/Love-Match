import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, useSessionDispatch } from '../context/SessionContext';
import { getQuestions } from '../data/questions';
import '../styles/QuizSetup.css';

const categories = [
  { value: 'basics', label: 'Basics', emoji: '📋' },
  { value: 'relationship', label: 'Relationship', emoji: '💞' },
  { value: 'personality', label: 'Personality & Habits', emoji: '🧠' },
  { value: 'deep', label: 'Deep & Values', emoji: '💭' },
  { value: 'mix', label: '🎲 Mix (All Categories)', emoji: '🎲' },
];

export default function QuizSetup() {
  const session = useSession();
  const dispatch = useSessionDispatch();
  const navigate = useNavigate();

  const [category, setCategory] = useState('mix');
  const [count, setCount] = useState(10);
  const [firstAnswerer, setFirstAnswerer] = useState('A');

  const handleStart = () => {
    const questions = getQuestions(category, session.relationshipType, count);

    dispatch({
      type: 'SET_QUIZ_CONFIG',
      payload: {
        category,
        count,
        firstAnswerer,
        questions,
      },
    });

    navigate('/round');
  };

  if (!session.personA) {
    navigate('/setup');
    return null;
  }

  return (
    <main className="screen-container quizsetup-screen">
      <div className="screen-header fade-in">
        <h1>Quiz Setup</h1>
        <p className="text-muted mt-2">How well do you know each other? 🧠</p>
      </div>

      <div className="quizsetup-form card slide-up">
        {/* Category */}
        <div className="input-group">
          <label>Choose a Category</label>
          <div className="quizsetup-categories" role="radiogroup" aria-label="Quiz category">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`quizsetup-category ${category === cat.value ? 'active' : ''}`}
                onClick={() => setCategory(cat.value)}
                role="radio"
                aria-checked={category === cat.value}
              >
                <span className="quizsetup-category-emoji">{cat.emoji}</span>
                <span className="quizsetup-category-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div className="input-group">
          <label>Number of Questions</label>
          <div className="quizsetup-count-buttons">
            <button
              type="button"
              className={`quizsetup-count-btn ${count === 10 ? 'active' : ''}`}
              onClick={() => setCount(10)}
            >
              10 Questions
            </button>
            <button
              type="button"
              className={`quizsetup-count-btn ${count === 15 ? 'active' : ''}`}
              onClick={() => setCount(15)}
            >
              15 Questions
            </button>
          </div>
        </div>

        {/* Who goes first */}
        <div className="input-group">
          <label>Who Answers First?</label>
          <div className="quizsetup-first-chips">
            <button
              type="button"
              className={`quizsetup-first-chip ${firstAnswerer === 'A' ? 'active' : ''}`}
              onClick={() => setFirstAnswerer('A')}
            >
              {session.personA} (A)
            </button>
            <button
              type="button"
              className={`quizsetup-first-chip ${firstAnswerer === 'B' ? 'active' : ''}`}
              onClick={() => setFirstAnswerer('B')}
            >
              {session.personB} (B)
            </button>
          </div>
        </div>

        <div className="quizsetup-actions">
          <button className="btn btn-primary" onClick={handleStart} id="start-quiz-round-btn">
            🎯 Start Quiz
          </button>
        </div>
      </div>
    </main>
  );
}
