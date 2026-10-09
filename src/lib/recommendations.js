import {
  summaryVariants,
  dateIdeaCatalog,
  smallGestures,
  growthTips,
  default7DayChallenge
} from '../data/recommendationText';
import { getMissedConversationStarters } from './knowScore';

/**
 * Deterministic helper to pick text variant based on names or salt.
 */
function pickVariant(array, seed = 0) {
  if (!array || !array.length) return '';
  const idx = Math.abs(seed) % array.length;
  return array[idx];
}

/**
 * Generate complete personalized Happiness Plan for Module 3.
 */
export function generateRecommendations({
  nameA = 'Person A',
  nameB = 'Person B',
  loveScore = 75,
  knowScore = 70,
  traitsA = { unconditional: 70, caring: 70, trueness: 70, caringZone: 'Balanced' },
  traitsB = { unconditional: 70, caring: 70, trueness: 70, caringZone: 'Balanced' },
  missedQuestions = [],
}) {
  const seed = (loveScore * 31 + knowScore * 17 + (nameA.length + nameB.length)) % 1000;

  // 1. Summary: 2-3 warm sentences
  let summaryTier = 'growingBoth';
  if (loveScore >= 68 && knowScore >= 65) {
    summaryTier = 'highLoveHighKnow';
  } else if (loveScore >= 60) {
    summaryTier = 'highLoveModerateKnow';
  } else if (knowScore >= 60) {
    summaryTier = 'moderateLoveHighKnow';
  }
  const summary = pickVariant(summaryVariants[summaryTier], seed);

  // 2. 3 Date ideas matched to results
  const dateIdeas = [];
  const lowKnowGroup = dateIdeaCatalog.find(g => g.condition === 'lowKnow')?.ideas || [];
  const highCareGroup = dateIdeaCatalog.find(g => g.condition === 'highCare')?.ideas || [];
  const highBothGroup = dateIdeaCatalog.find(g => g.condition === 'highBoth')?.ideas || [];
  const defaultGroup = dateIdeaCatalog.find(g => g.condition === 'default')?.ideas || [];

  if (knowScore < 55 && lowKnowGroup.length) {
    dateIdeas.push(pickVariant(lowKnowGroup, seed));
  }

  if ((traitsA.caringZone === 'Cares too much' || traitsB.caringZone === 'Cares too much') && highCareGroup.length) {
    dateIdeas.push(pickVariant(highCareGroup, seed + 1));
  }

  if (loveScore >= 65 && knowScore >= 60 && highBothGroup.length) {
    dateIdeas.push(pickVariant(highBothGroup, seed + 2));
  }

  // Fill up to 3 date ideas using unique default ideas
  for (const idea of defaultGroup) {
    if (dateIdeas.length >= 3) break;
    if (!dateIdeas.some(d => d.title === idea.title)) {
      dateIdeas.push(idea);
    }
  }

  // 3. Conversation starters (prioritize missed quiz questions)
  const conversationStarters = getMissedConversationStarters(missedQuestions, nameA, nameB);

  // 4. Small gesture for each person
  const getGesture = (traits, personSeed) => {
    if (traits.caringZone === 'Cares too much') return pickVariant(smallGestures.caringOver, personSeed);
    if (traits.caringZone === 'Gives space') return pickVariant(smallGestures.caringSpace, personSeed);
    if (traits.unconditional >= 75) return pickVariant(smallGestures.unconditionalHigh, personSeed);
    if (traits.trueness >= 75) return pickVariant(smallGestures.truenessHigh, personSeed);
    return pickVariant(smallGestures.balanced, personSeed);
  };

  const gestureA = getGesture(traitsA, seed);
  const gestureB = getGesture(traitsB, seed + 5);

  // 5. Growth tip for each person
  const getGrowthTip = (traits, personSeed) => {
    if (traits.caringZone === 'Cares too much') return pickVariant(growthTips.overCaring, personSeed);
    if (traits.caringZone === 'Gives space') return pickVariant(growthTips.givesSpace, personSeed);
    if (traits.trueness < 60) return pickVariant(growthTips.lowerTrueness, personSeed);
    return pickVariant(growthTips.default, personSeed);
  };

  const tipA = getGrowthTip(traitsA, seed);
  const tipB = getGrowthTip(traitsB, seed + 7);

  // 6. Headline recommendation for summary card
  const headlines = [
    'Cherish the tender small moments and celebrate each other with heartfelt curiosity!',
    'Your natural warmth creates a safe haven — continue laughing, listening, and growing.',
    'A rare blend of loyalty and tenderness; keep fueling the magic with cozy shared adventures.',
    'Anchor each day in gratitude, gentle honesty, and unconditional affection.'
  ];
  const headlineRecommendation = pickVariant(headlines, seed);

  return {
    summary,
    dateIdeas: dateIdeas.slice(0, 3),
    conversationStarters: conversationStarters.slice(0, 3),
    gestureA,
    gestureB,
    tipA,
    tipB,
    headlineRecommendation,
    challenges: default7DayChallenge,
  };
}

export default generateRecommendations;
