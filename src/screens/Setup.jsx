import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import FloatingHearts from '../components/FloatingHearts';
import '../styles/Setup.css';

const relationshipTypes = [
  { value: 'couple', label: 'Couple', emoji: '💑' },
  { value: 'friends', label: 'Best Friends', emoji: '👯' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
];

const months = [
  { value: '', label: 'Select month...' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function Setup() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  const [personA, setPersonA] = useState(state.personA || '');
  const [personB, setPersonB] = useState(state.personB || '');
  const [relType, setRelType] = useState(state.relationshipType || 'couple');
  const [birthMonthA, setBirthMonthA] = useState(state.birthMonthA ? String(state.birthMonthA) : '');
  const [birthMonthB, setBirthMonthB] = useState(state.birthMonthB ? String(state.birthMonthB) : '');
  const [colorA, setColorA] = useState(state.favoriteColorA || '');
  const [colorB, setColorB] = useState(state.favoriteColorB || '');
  const [showOptional, setShowOptional] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimA = personA.trim();
    const trimB = personB.trim();

    if (!trimA || !trimB) {
      setError('Please enter names for both people! 💗');
      return;
    }

    if (trimA.length > 30 || trimB.length > 30) {
      setError('Names must be 30 characters or less.');
      return;
    }

    if (trimA.toLowerCase() === trimB.toLowerCase()) {
      setError('Please use distinct names or nicknames so we can tell you apart! ✨');
      return;
    }

    setError('');

    dispatch({
      type: 'SET_SETUP',
      payload: {
        personA: trimA,
        personB: trimB,
        relationshipType: relType,
        birthMonthA: birthMonthA ? parseInt(birthMonthA, 10) : null,
        birthMonthB: birthMonthB ? parseInt(birthMonthB, 10) : null,
        favoriteColorA: colorA.trim(),
        favoriteColorB: colorB.trim(),
      },
    });

    dispatch({ type: 'SET_ACTIVE_MODULE', payload: 1 });
    navigate('/module1');
  };

  return (
    <div className="setup-screen">
      <FloatingHearts />

      <main className="setup-card cute-card">
        <header className="setup-header">
          <span className="setup-badge">Step 1 of 3</span>
          <h1 className="setup-title">Who is playing? 🌸</h1>
          <p className="setup-subtitle">
            Enter your names to start Module 1: Love & Know Each Other!
          </p>
        </header>

        {error && (
          <div className="setup-error-banner" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="setup-form" noValidate>
          {/* Names */}
          <div className="setup-names-grid">
            <div className="form-group">
              <label htmlFor="name-a" className="form-label">
                <span>Person 1</span>
                <span className="heart-tint">💖</span>
              </label>
              <input
                id="name-a"
                type="text"
                className="form-input"
                placeholder="e.g. Alex"
                value={personA}
                onChange={(e) => setPersonA(e.target.value)}
                maxLength={30}
                required
                autoFocus
              />
            </div>

            <div className="setup-connector-heart" aria-hidden="true">
              <span>&</span>
            </div>

            <div className="form-group">
              <label htmlFor="name-b" className="form-label">
                <span>Person 2</span>
                <span className="heart-tint">💗</span>
              </label>
              <input
                id="name-b"
                type="text"
                className="form-input"
                placeholder="e.g. Jordan"
                value={personB}
                onChange={(e) => setPersonB(e.target.value)}
                maxLength={30}
                required
              />
            </div>
          </div>

          {/* Relationship Type */}
          <div className="form-group">
            <label className="form-label">Relationship Vibe</label>
            <div className="relationship-chips-group" role="radiogroup">
              {relationshipTypes.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={`rel-chip ${relType === item.value ? 'selected' : ''}`}
                  onClick={() => setRelType(item.value)}
                  role="radio"
                  aria-checked={relType === item.value}
                >
                  <span className="rel-chip-emoji">{item.emoji}</span>
                  <span className="rel-chip-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Details Toggle */}
          <div className="setup-optional-toggle-wrap">
            <button
              type="button"
              className="btn btn-ghost setup-toggle-btn"
              onClick={() => setShowOptional(!showOptional)}
            >
              <span>{showOptional ? '▲ Hide extra astrology & color boosts' : '▼ Add birth month & favorite colors (Optional)'}</span>
            </button>
          </div>

          {showOptional && (
            <div className="setup-optional-section">
              <div className="optional-row">
                <div className="form-group">
                  <label htmlFor="month-a" className="form-label">{personA || 'Person 1'} Birth Month</label>
                  <select
                    id="month-a"
                    className="form-select"
                    value={birthMonthA}
                    onChange={(e) => setBirthMonthA(e.target.value)}
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="month-b" className="form-label">{personB || 'Person 2'} Birth Month</label>
                  <select
                    id="month-b"
                    className="form-select"
                    value={birthMonthB}
                    onChange={(e) => setBirthMonthB(e.target.value)}
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="optional-row">
                <div className="form-group">
                  <label htmlFor="color-a" className="form-label">{personA || 'Person 1'} Favorite Color</label>
                  <input
                    id="color-a"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Pink, Lilac, Blue"
                    value={colorA}
                    onChange={(e) => setColorA(e.target.value)}
                    maxLength={20}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="color-b" className="form-label">{personB || 'Person 2'} Favorite Color</label>
                  <input
                    id="color-b"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sage green, Yellow"
                    value={colorB}
                    onChange={(e) => setColorB(e.target.value)}
                    maxLength={20}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="setup-submit-wrap">
            <button type="submit" className="btn btn-primary btn-block" id="proceed-btn">
              <span>Begin Module 1: Love & Know</span>
              <span className="heart-icon">💘</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
