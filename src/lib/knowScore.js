/**
 * Know-Each-Other scoring calculation and missed question extraction.
 *
 * Exact match = 1 point.
 * A->B % and B->A % = correct / total x 100.
 * Overall know score = average of both percentages.
 */

export function calculateKnowScores({
  answersA = {},
  guessesB = {},
  answersB = {},
  guessesA = {},
  questions = []
}) {
  const total = Math.max(1, questions.length);

  let correctBKnowsA = 0;
  let correctAKnowsB = 0;

  const missedByB = []; // Questions where B guessed wrong about A
  const missedByA = []; // Questions where A guessed wrong about B

  questions.forEach((q) => {
    const realA = answersA[q.id];
    const guessB = guessesB[q.id];
    if (realA !== undefined && guessB !== undefined) {
      if (realA === guessB) {
        correctBKnowsA += 1;
      } else {
        missedByB.push({
          questionId: q.id,
          questionText: q.text,
          targetPerson: 'A',
          guessPerson: 'B',
          guess: guessB,
          realAnswer: realA,
        });
      }
    }

    const realB = answersB[q.id];
    const guessA = guessesA[q.id];
    if (realB !== undefined && guessA !== undefined) {
      if (realB === guessA) {
        correctAKnowsB += 1;
      } else {
        missedByA.push({
          questionId: q.id,
          questionText: q.text,
          targetPerson: 'B',
          guessPerson: 'A',
          guess: guessA,
          realAnswer: realB,
        });
      }
    }
  });

  const pctBKnowsA = Math.round((correctBKnowsA / total) * 100);
  const pctAKnowsB = Math.round((correctAKnowsB / total) * 100);
  const overallKnowScore = Math.round((pctBKnowsA + pctAKnowsB) / 2);

  // Combine missed questions for conversation starters (take top 2 or 3)
  const combinedMissed = [...missedByB, ...missedByA];

  return {
    correctBKnowsA,
    correctAKnowsB,
    pctBKnowsA,
    pctAKnowsB,
    overallKnowScore,
    missedByB,
    missedByA,
    combinedMissed,
  };
}

/**
 * Helper to get cute conversation starter text from missed quiz questions.
 * @param {Array} missedList
 * @param {string} nameA
 * @param {string} nameB
 * @returns {Array<string>}
 */
export function getMissedConversationStarters(missedList = [], nameA = 'Person A', nameB = 'Person B') {
  if (!missedList.length) {
    return [
      `What is something new you tried recently that surprised you?`,
      `If you could relive one fun day we spent together, which would you pick?`,
      `What is a small goal you'd love support with this month?`
    ];
  }

  return missedList.slice(0, 3).map((item) => {
    const guesserName = item.guessPerson === 'A' ? nameA : nameB;
    const targetName = item.targetPerson === 'A' ? nameA : nameB;
    return `"${item.questionText}" — ${guesserName} guessed "${item.guess}", but ${targetName}'s answer was "${item.realAnswer}". Why that choice?`;
  });
}
