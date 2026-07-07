const CONFIG = {
  baseMinutesUnit: 20,
  minSessionMinutes: 10,
  qualityMultipliers: { 1: 0.7, 2: 0.85, 3: 1.0, 4: 1.15, 5: 1.3 },
  difficultyMultipliers: { easy: 0.95, medium: 1.0, hard: 1.1 },
  plannedBonus: 0.5
};

export function computeSessionScore(session, sessionIndexForDay = 0) {
  if (session.durationMinutes < CONFIG.minSessionMinutes && !session.isMicroSession) {
    return 0;
  }

  const basePoints = Math.floor(session.durationMinutes / CONFIG.baseMinutesUnit);
  const qualityMultiplier = CONFIG.qualityMultipliers[session.qualityRating] ?? 1;
  const difficultyMultiplier = CONFIG.difficultyMultipliers[session.difficulty] ?? 1;
  const plannedBonus = session.isPlanned ? CONFIG.plannedBonus : 0;
  const diminishingMultiplier = sessionIndexForDay >= 3 ? 0.9 : 1;

  return Math.max(
    1,
    Math.round((basePoints * qualityMultiplier * difficultyMultiplier + plannedBonus) * diminishingMultiplier)
  );
}

export function contributionLevel(totalScore) {
  if (totalScore <= 0) return 0;
  if (totalScore <= 2) return 1;
  if (totalScore <= 5) return 2;
  if (totalScore <= 8) return 3;
  return 4;
}
