/**
 * Love Score Algorithm — deterministic, order-independent.
 *
 * (nameHash(A) + nameHash(B) + extraHash) % 101
 * where nameHash = sum of char codes of lowercase letters.
 *
 * @param {string} nameA
 * @param {string} nameB
 * @param {Object} [extras]
 * @param {number} [extras.birthMonthA]
 * @param {number} [extras.birthMonthB]
 * @param {string} [extras.favoriteColorA]
 * @param {string} [extras.favoriteColorB]
 * @param {string} [extras.relationshipType]
 * @returns {number} 0–100
 */
export function calculateLoveScore(nameA = '', nameB = '', extras = {}) {
  const hashName = (name) =>
    (name || '')
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .split('')
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

  const nameHashA = hashName(nameA);
  const nameHashB = hashName(nameB);

  let extraHash = 0;

  if (extras.birthMonthA) extraHash += Number(extras.birthMonthA);
  if (extras.birthMonthB) extraHash += Number(extras.birthMonthB);

  if (extras.favoriteColorA) {
    extraHash += String(extras.favoriteColorA)
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .split('')
      .reduce((s, c) => s + c.charCodeAt(0), 0);
  }
  if (extras.favoriteColorB) {
    extraHash += String(extras.favoriteColorB)
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .split('')
      .reduce((s, c) => s + c.charCodeAt(0), 0);
  }

  const typeOffsets = {
    couple: 7,
    friends: 13,
    family: 19,
    other: 3,
  };
  if (extras.relationshipType) {
    extraHash += typeOffsets[extras.relationshipType.toLowerCase()] || 0;
  }

  // Order-independent: sorting guarantees (A, B) === (B, A)
  const sorted = [nameHashA, nameHashB].sort((a, b) => a - b);
  const score = (sorted[0] + sorted[1] + extraHash) % 101;

  return score;
}

/**
 * Interpret the love score into label & emoji.
 *
 * @param {number} score - 0–100
 * @returns {{ label: string, emoji: string }}
 */
export function interpretLoveScore(score) {
  if (score <= 20) {
    return { label: 'Chaotic energy 🌪️', emoji: '🌪️' };
  }
  if (score <= 40) {
    return { label: 'Interesting but complicated 🤔', emoji: '🤔' };
  }
  if (score <= 60) {
    return { label: 'Decent potential 🌱', emoji: '🌱' };
  }
  if (score <= 80) {
    return { label: 'Strong connection 🔥', emoji: '🔥' };
  }
  return { label: 'Soul-friend vibe 💫', emoji: '💫' };
}
