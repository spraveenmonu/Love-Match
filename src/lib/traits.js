/**
 * Module 2: Traits calculation, normalization (0-100), and insight generation.
 *
 * Traits:
 * 1. Unconditional Love: Love that stays through mistakes, bad days, and change.
 * 2. Caring Level: Attention, effort, and support (Gives space / Balanced / Cares too much).
 * 3. Trueness: Honesty, loyalty, reliability.
 */

export function normalizeTraitScores(answers = {}, questions = []) {
  let rawUnconditional = 0;
  let rawCaring = 0;
  let rawTrueness = 0;

  let totalQuestions = 0;

  questions.forEach((q) => {
    const selectedIdx = answers[q.id];
    if (selectedIdx !== undefined && q.options[selectedIdx]) {
      const opt = q.options[selectedIdx];
      rawUnconditional += opt.points?.unconditional || 3;
      rawCaring += opt.points?.caring || 3;
      rawTrueness += opt.points?.trueness || 3;
      totalQuestions += 1;
    }
  });

  const count = Math.max(1, totalQuestions);
  // Max points possible per question is 5, min is 1
  const maxPossible = count * 5;
  const minPossible = count * 1;

  const toPercent = (raw) => {
    const normalized = Math.round(((raw - minPossible) / (maxPossible - minPossible)) * 100);
    return Math.max(10, Math.min(100, normalized));
  };

  const unconditional = toPercent(rawUnconditional);
  const caring = toPercent(rawCaring);
  const trueness = toPercent(rawTrueness);

  // Caring scale zone
  let caringZone = 'Balanced';
  if (caring < 45) {
    caringZone = 'Gives space';
  } else if (caring > 75) {
    caringZone = 'Cares too much';
  }

  // Soft badges
  const badges = [];
  if (unconditional >= 65) badges.push('Unconditional Heart');
  if (caringZone === 'Balanced') badges.push('Caring Soul');
  else if (caringZone === 'Cares too much') badges.push('Devoted Heart');
  else badges.push('Peaceful Anchor');

  if (trueness >= 65) badges.push('True Blue');
  else badges.push('Honest Spirit');

  return {
    unconditional,
    caring,
    trueness,
    caringZone,
    badges: badges.slice(0, 2),
  };
}

/**
 * Determine leaders and frame comparative strengths kindly.
 */
export function compareTraits(scoresA, scoresB, nameA = 'Person A', nameB = 'Person B') {
  const leaders = {
    unconditional: scoresA.unconditional >= scoresB.unconditional ? nameA : nameB,
    caring: scoresA.caring >= scoresB.caring ? nameA : nameB,
    trueness: scoresA.trueness >= scoresB.trueness ? nameA : nameB,
  };

  const statements = [];
  if (scoresA.unconditional !== scoresB.unconditional) {
    statements.push(`${leaders.unconditional} shines with high unconditional love`);
  } else {
    statements.push(`both match equally in unconditional warmth`);
  }

  if (scoresA.trueness !== scoresB.trueness) {
    statements.push(`${leaders.trueness} leads in steadfast trueness`);
  } else {
    statements.push(`both share deep mutual loyalty`);
  }

  const comparisonLine = statements.join(', and ') + '.';

  // Generate shared balance line
  let balanceReason = '';
  if (scoresA.caringZone === 'Cares too much' || scoresB.caringZone === 'Cares too much') {
    const overCarer = scoresA.caringZone === 'Cares too much' ? nameA : nameB;
    const anchor = overCarer === nameA ? nameB : nameA;
    balanceReason = `Together you balance each other because ${anchor} provides grounding calm and safe space, while ${overCarer} brings tender attentiveness and endless heartfelt devotion.`;
  } else if (scoresA.unconditional > 80 || scoresB.unconditional > 80) {
    balanceReason = `Together you balance each other because forgiveness and acceptance come naturally, turning any difficult moment into an opportunity for closer intimacy.`;
  } else {
    balanceReason = `Together you balance each other through honest communication and mutual respect, giving one another room to be authentic while staying wonderfully connected.`;
  }

  return {
    leaders,
    comparisonLine,
    balanceReason,
  };
}
