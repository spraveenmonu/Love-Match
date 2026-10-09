import { createContext, useContext, useReducer, useEffect } from 'react';

const SessionContext = createContext(null);

const initialState = {
  // Setup
  personA: '',
  personB: '',
  relationshipType: 'couple', // 'couple' | 'friends' | 'family'
  birthMonthA: null,
  birthMonthB: null,
  favoriteColorA: '',
  favoriteColorB: '',

  // Module 1: Love & Know
  loveScore: null,
  answersA: {},   // A's self answers (q1..10)
  guessesB: {},   // B's guesses for A
  answersB: {},   // B's self answers (q1..10)
  guessesA: {},   // A's guesses for B
  knowScores: {
    pctBKnowsA: 0,
    pctAKnowsB: 0,
    overallKnowScore: 0,
    combinedMissed: [],
  },

  // Module 2: Traits
  traitAnswersA: {}, // A's answers to 12 scenario questions
  traitAnswersB: {}, // B's answers to 12 scenario questions
  traitScoresA: {
    unconditional: 0,
    caring: 0,
    trueness: 0,
    caringZone: 'Balanced',
    badges: ['Unconditional Heart', 'Caring Soul'],
  },
  traitScoresB: {
    unconditional: 0,
    caring: 0,
    trueness: 0,
    caringZone: 'Balanced',
    badges: ['True Blue', 'Balanced Care'],
  },
  traitComparison: {
    leaders: {},
    comparisonLine: '',
    balanceReason: '',
  },

  // Module 3: Recommendations
  recommendations: null,

  // UI state
  activeModule: 1, // 1 | 2 | 3
};

function sessionReducer(state, action) {
  switch (action.type) {
    case 'SET_SETUP':
      return {
        ...state,
        ...action.payload,
      };

    case 'SET_LOVE_SCORE':
      return {
        ...state,
        loveScore: action.payload,
      };

    case 'SET_MODULE1_RESULTS':
      return {
        ...state,
        answersA: action.payload.answersA ?? state.answersA,
        guessesB: action.payload.guessesB ?? state.guessesB,
        answersB: action.payload.answersB ?? state.answersB,
        guessesA: action.payload.guessesA ?? state.guessesA,
        knowScores: action.payload.knowScores ?? state.knowScores,
      };

    case 'SET_MODULE2_RESULTS':
      return {
        ...state,
        traitAnswersA: action.payload.traitAnswersA ?? state.traitAnswersA,
        traitAnswersB: action.payload.traitAnswersB ?? state.traitAnswersB,
        traitScoresA: action.payload.traitScoresA ?? state.traitScoresA,
        traitScoresB: action.payload.traitScoresB ?? state.traitScoresB,
        traitComparison: action.payload.traitComparison ?? state.traitComparison,
      };

    case 'SET_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: action.payload,
      };

    case 'SET_ACTIVE_MODULE':
      return {
        ...state,
        activeModule: action.payload,
      };

    case 'LOAD_SAVED_SESSION':
      return {
        ...state,
        ...action.payload,
      };

    case 'RESET_SESSION':
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
