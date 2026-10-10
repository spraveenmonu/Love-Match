/**
 * Quiz scoring — pure functions.
 */

/**
 * Score a single answer.
 * @param {'multiple'|'scale'} type
 * @param {string} correctAnswer
 * @param {string} guessedAnswer
 * @param {string[]} options - ordered list (used for scale distance)
 * @returns {number} 0, 0.5, or 1
 */
export function scoreAnswer(type, correctAnswer, guessedAnswer, options) {
  if (correctAnswer === guessedAnswer) return 1;

  if (type === 'scale') {
    const correctIdx = options.indexOf(correctAnswer);
    const guessIdx = options.indexOf(guessedAnswer);
    if (correctIdx !== -1 && guessIdx !== -1 && Math.abs(correctIdx - guessIdx) === 1) {
      return 0.5;
    }
  }

  return 0;
}

/**
 * Calculate round score as a percentage.
 * @param {{ points: number }[]} answers
 * @returns {number} 0–100
 */
export function calculateRoundScore(answers) {
  if (answers.length === 0) return 0;
  const total = answers.reduce((sum, a) => sum + a.points, 0);
  return Math.round((total / answers.length) * 100);
}

/**
 * Calculate overall "know each other" score.
 * @param {number} aKnowsB - A's score knowing B (0–100)
 * @param {number} bKnowsA - B's score knowing A (0–100)
 * @returns {number} 0–100
 */
export function calculateOverallKnowScore(aKnowsB, bKnowsA) {
  return Math.round((aKnowsB + bKnowsA) / 2);
}

/**
 * Interpretation matrix combining love score and know score.
 * @param {number} loveScore - 0–100
 * @param {number} knowScore - 0–100
 * @returns {{ title: string, description: string, emoji: string }}
 */
export function getCombinedInterpretation(loveScore, knowScore) {
  const loveTier = loveScore <= 40 ? 'low' : loveScore <= 70 ? 'med' : 'high';
  const knowTier = knowScore <= 40 ? 'low' : knowScore <= 70 ? 'med' : 'high';

  const matrix = {
    'low-low': {
      title: 'The Mystery Duo',
      description: "You're still discovering each other — and that's exciting! There's a whole universe to explore together.",
      emoji: '🔮',
    },
    'low-med': {
      title: 'Hidden Depths',
      description: 'You know more than the score suggests. Keep digging deeper — the best is yet to come.',
      emoji: '🌊',
    },
    'low-high': {
      title: 'The Odd Experts',
      description: 'You know each other surprisingly well! Your bond is deeper than surface-level chemistry.',
      emoji: '🧩',
    },
    'med-low': {
      title: 'Spark Without Map',
      description: "There's a connection, but you haven't fully explored the map yet. Time for deeper conversations!",
      emoji: '✨',
    },
    'med-med': {
      title: 'The Balanced Bond',
      description: "A solid mix of chemistry and understanding. You're building something real.",
      emoji: '⚖️',
    },
    'med-high': {
      title: 'The Power Pair',
      description: 'Great chemistry AND you know each other well. This is the stuff great relationships are made of.',
      emoji: '🚀',
    },
    'high-low': {
      title: 'All Vibes, No Trivia',
      description: "Your connection is electric! Now it's time to learn the little details that make it even stronger.",
      emoji: '⚡',
    },
    'high-med': {
      title: 'Almost Legendary',
      description: "Strong connection with good understanding. A few more heart-to-hearts and you'll be unstoppable.",
      emoji: '🌟',
    },
    'high-high': {
      title: 'Legendary Bond',
      description: 'You two are in sync on every level. This is the kind of bond people write songs about.',
      emoji: '👑',
    },
  };

  return matrix[`${loveTier}-${knowTier}`];
}

/**
 * Get relationship tips based on know score.
 * @param {number} knowScore - 0–100
 * @param {string} relationshipType
 * @returns {string[]}
 */
export function getTips(knowScore, relationshipType) {
  const isCouple = relationshipType === 'couple';
  const isFriend = relationshipType === 'friends';

  if (knowScore <= 40) {
    return [
      isCouple
        ? 'Try a "36 questions to fall in love" session together'
        : 'Play a "20 questions" game next time you hang out',
      'Share one thing about your day every evening — small details add up',
      isFriend
        ? 'Plan a road trip — nothing reveals more than hours in a car together'
        : 'Cook a new recipe together and talk while you prep',
    ];
  }

  if (knowScore <= 70) {
    return [
      'You\'re on the right track! Try asking each other "What if…?" questions',
      isCouple
        ? 'Schedule a device-free date night once a week'
        : 'Start a shared playlist and add songs that remind you of each other',
      'Write each other a short letter about what you appreciate most',
    ];
  }

  return [
    'You truly know each other! Keep that curiosity alive 💛',
    isCouple
      ? 'Try something completely new together — take a class, visit a new city'
      : 'Create a tradition just for you two — monthly dinners, annual trips',
    'Challenge yourselves: surprise each other with something unexpected this week',
  ];
}

/**
 * Find the best-known and most-surprising categories.
 * @param {{ questionId: string, isCorrect: boolean, correctAnswer: string, guessedAnswer: string }[]} allGuessAnswers
 * @param {import('../data/questions').Question[]} questionBank
 * @returns {{ bestTopics: string[], surprisingMisses: { question: string, expected: string, actual: string }[] }}
 */
export function analyzeResults(allGuessAnswers, questionBank) {
  const categoryScores = {};
  const misses = [];

  allGuessAnswers.forEach((ans) => {
    const q = questionBank.find((qu) => qu.id === ans.questionId);
    if (!q) return;

    if (!categoryScores[q.category]) {
      categoryScores[q.category] = { correct: 0, total: 0 };
    }
    categoryScores[q.category].total += 1;
    if (ans.isCorrect) {
      categoryScores[q.category].correct += 1;
    } else {
      misses.push({
        question: q.text,
        expected: ans.correctAnswer,
        actual: ans.guessedAnswer,
      });
    }
  });

  const categoryLabels = {
    basics: 'Basics',
    relationship: 'Relationship',
    personality: 'Personality & Habits',
    deep: 'Deep & Values',
  };

  // Sort categories by accuracy
  const sorted = Object.entries(categoryScores)
    .map(([cat, { correct, total }]) => ({
      category: categoryLabels[cat] || cat,
      accuracy: total > 0 ? correct / total : 0,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const bestTopics = sorted.filter((s) => s.accuracy >= 0.5).map((s) => s.category);
  if (bestTopics.length === 0 && sorted.length > 0) bestTopics.push(sorted[0].category);

  // Pick top 3 surprising misses
  const surprisingMisses = misses.slice(0, 3);

  return { bestTopics, surprisingMisses };
}
