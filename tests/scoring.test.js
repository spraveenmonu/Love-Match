import { describe, it, expect } from 'vitest';
import { calculateLoveScore, interpretLoveScore } from '../src/lib/loveScore';
import { calculateKnowScores } from '../src/lib/knowScore';
import { normalizeTraitScores, compareTraits } from '../src/lib/traits';
import { generateRecommendations } from '../src/lib/recommendations';

describe('Love Score Algorithm', () => {
  it('is deterministic for the same names', () => {
    const score1 = calculateLoveScore('Alex', 'Sam');
    const score2 = calculateLoveScore('Alex', 'Sam');
    expect(score1).toBe(score2);
  });

  it('is order-independent (A, B) === (B, A)', () => {
    const scoreAB = calculateLoveScore('Emma', 'Liam');
    const scoreBA = calculateLoveScore('Liam', 'Emma');
    expect(scoreAB).toBe(scoreBA);
  });

  it('is always bounded within 0 and 100 inclusive', () => {
    const testPairs = [
      ['A', 'B'],
      ['Zoey', 'Alexander'],
      ['Christopher', 'Elizabeth'],
      ['Maya', 'Oliver', { birthMonthA: 5, birthMonthB: 11, favoriteColorA: 'Pink', favoriteColorB: 'Blue' }],
    ];

    testPairs.forEach(([a, b, extras]) => {
      const score = calculateLoveScore(a, b, extras);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it('correctly interprets score ranges into labels and emojis', () => {
    expect(interpretLoveScore(15).emoji).toBe('🌪️');
    expect(interpretLoveScore(35).emoji).toBe('🤔');
    expect(interpretLoveScore(55).emoji).toBe('🌱');
    expect(interpretLoveScore(75).emoji).toBe('🔥');
    expect(interpretLoveScore(95).emoji).toBe('💫');
  });
});

describe('Know Score Math & Missed Question Extraction', () => {
  const mockQuestions = [
    { id: 'q1', text: 'Question 1' },
    { id: 'q2', text: 'Question 2' },
    { id: 'q3', text: 'Question 3' },
    { id: 'q4', text: 'Question 4' },
  ];

  it('calculates 100% when all guesses match exactly', () => {
    const answersA = { q1: 'A', q2: 'B', q3: 'C', q4: 'D' };
    const guessesB = { q1: 'A', q2: 'B', q3: 'C', q4: 'D' };
    const answersB = { q1: 'B', q2: 'C', q3: 'D', q4: 'A' };
    const guessesA = { q1: 'B', q2: 'C', q3: 'D', q4: 'A' };

    const result = calculateKnowScores({
      answersA,
      guessesB,
      answersB,
      guessesA,
      questions: mockQuestions,
    });

    expect(result.pctBKnowsA).toBe(100);
    expect(result.pctAKnowsB).toBe(100);
    expect(result.overallKnowScore).toBe(100);
    expect(result.combinedMissed.length).toBe(0);
  });

  it('calculates 50% when half match and extracts missed questions', () => {
    const answersA = { q1: 'A', q2: 'B', q3: 'C', q4: 'D' };
    const guessesB = { q1: 'A', q2: 'Wrong', q3: 'C', q4: 'Wrong' }; // 2 of 4 = 50%
    const answersB = { q1: 'B', q2: 'C', q3: 'D', q4: 'A' };
    const guessesA = { q1: 'B', q2: 'C', q3: 'Wrong', q4: 'Wrong' }; // 2 of 4 = 50%

    const result = calculateKnowScores({
      answersA,
      guessesB,
      answersB,
      guessesA,
      questions: mockQuestions,
    });

    expect(result.pctBKnowsA).toBe(50);
    expect(result.pctAKnowsB).toBe(50);
    expect(result.overallKnowScore).toBe(50);
    expect(result.combinedMissed.length).toBe(4);
  });
});

describe('Trait Normalization & Compassionate Framing', () => {
  const mockTraitQuestions = [
    {
      id: 't1',
      options: [
        { text: 'A', points: { unconditional: 5, caring: 5, trueness: 5 } },
        { text: 'B', points: { unconditional: 3, caring: 3, trueness: 3 } },
        { text: 'C', points: { unconditional: 1, caring: 1, trueness: 1 } },
      ],
    },
    {
      id: 't2',
      options: [
        { text: 'A', points: { unconditional: 5, caring: 5, trueness: 5 } },
        { text: 'B', points: { unconditional: 3, caring: 3, trueness: 3 } },
        { text: 'C', points: { unconditional: 1, caring: 1, trueness: 1 } },
      ],
    },
  ];

  it('normalizes trait scores cleanly between 0 and 100', () => {
    const answersMax = { t1: 0, t2: 0 };
    const scoresMax = normalizeTraitScores(answersMax, mockTraitQuestions);
    expect(scoresMax.unconditional).toBe(100);
    expect(scoresMax.caring).toBe(100);
    expect(scoresMax.caringZone).toBe('Cares too much');

    const answersMin = { t1: 2, t2: 2 };
    const scoresMin = normalizeTraitScores(answersMin, mockTraitQuestions);
    expect(scoresMin.caringZone).toBe('Gives space');
  });

  it('frames comparative traits kindly without negative shaming', () => {
    const scoresA = {
      unconditional: 90,
      caring: 70,
      trueness: 60,
      caringZone: 'Balanced',
      badges: ['Unconditional Heart'],
    };
    const scoresB = {
      unconditional: 70,
      caring: 80,
      trueness: 95,
      caringZone: 'Cares too much',
      badges: ['True Blue'],
    };

    const comparison = compareTraits(scoresA, scoresB, 'Anu', 'Raj');
    expect(comparison.comparisonLine).toContain('Anu shines with high unconditional love');
    expect(comparison.comparisonLine).toContain('Raj leads in steadfast trueness');
    expect(comparison.balanceReason).toContain('Together you balance each other');
  });
});

describe('Recommendations Engine', () => {
  it('generates a complete Happiness Plan with 3 date ideas, starters, gestures, tips, and challenges', () => {
    const plan = generateRecommendations({
      nameA: 'Sam',
      nameB: 'Jordan',
      loveScore: 82,
      knowScore: 78,
    });

    expect(plan.summary).toBeTruthy();
    expect(plan.dateIdeas.length).toBe(3);
    expect(plan.conversationStarters.length).toBe(3);
    expect(plan.gestureA).toBeTruthy();
    expect(plan.gestureB).toBeTruthy();
    expect(plan.tipA).toBeTruthy();
    expect(plan.tipB).toBeTruthy();
    expect(plan.challenges.length).toBe(7);
    expect(plan.headlineRecommendation).toBeTruthy();
  });
});
