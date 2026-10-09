/**
 * localStorage persistence for LoveMatch sessions and 7-day challenges.
 */

const STORAGE_KEY = 'lovematch_sessions';
const CHALLENGE_KEY = 'lovematch_7day_challenges';

export function getSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session) {
  try {
    const sessions = getSessions();
    sessions.unshift(session);
    if (sessions.length > 50) sessions.length = 50;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save session to localStorage:', err);
  }
}

export function deleteSession(id) {
  try {
    const sessions = getSessions().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to delete session:', err);
  }
}

export function getSessionsForPair(nameA = '', nameB = '') {
  const a = nameA.toLowerCase().trim();
  const b = nameB.toLowerCase().trim();

  return getSessions().filter((s) => {
    const sa = (s.personA || '').toLowerCase().trim();
    const sb = (s.personB || '').toLowerCase().trim();
    return (sa === a && sb === b) || (sa === b && sb === a);
  });
}

/**
 * 7-Day Challenge progress persistence
 */
export function getChallengeProgress(pairKey = 'default') {
  try {
    const raw = localStorage.getItem(`${CHALLENGE_KEY}_${pairKey}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveChallengeProgress(pairKey = 'default', progress = {}) {
  try {
    localStorage.setItem(`${CHALLENGE_KEY}_${pairKey}`, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save challenge progress:', err);
  }
}

export function generateId() {
  return `lm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
