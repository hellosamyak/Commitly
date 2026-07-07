const DEFAULT_CONFIG = {
  version: "v1",
  baseMinutesUnit: 20,
  minSessionMinutes: 10,
  dailyMinutesCap: 360,
  qualityMultipliers: { 1: 0.7, 2: 0.85, 3: 1.0, 4: 1.15, 5: 1.3 },
  difficultyMultipliers: { easy: 0.95, medium: 1.0, hard: 1.1 },
  plannedBonus: 0.5
};

export const SESSION_ENUMS = {
  categories: ["study", "focus", "reading", "work", "custom"],
  difficulties: ["easy", "medium", "hard"]
};

export function validateSessionInput(payload) {
  const errors = [];

  if (!SESSION_ENUMS.categories.includes(payload.category)) {
    errors.push("category must be one of study/focus/reading/work/custom");
  }

  if (!Number.isInteger(payload.durationMinutes) || payload.durationMinutes <= 0) {
    errors.push("durationMinutes must be a positive integer");
  }

  if (!Number.isInteger(payload.qualityRating) || payload.qualityRating < 1 || payload.qualityRating > 5) {
    errors.push("qualityRating must be an integer from 1 to 5");
  }

  if (!SESSION_ENUMS.difficulties.includes(payload.difficulty)) {
    errors.push("difficulty must be easy, medium, or hard");
  }

  if (typeof payload.isPlanned !== "boolean") {
    errors.push("isPlanned must be boolean");
  }

  if (payload.notes && payload.notes.length > 400) {
    errors.push("notes cannot exceed 400 characters");
  }

  return errors;
}

function getContributionLevel(totalScore) {
  if (totalScore <= 0) return 0;
  if (totalScore <= 2) return 1;
  if (totalScore <= 5) return 2;
  if (totalScore <= 8) return 3;
  return 4;
}

export function computeSessionScore(session, config = DEFAULT_CONFIG, sessionIndexForDay = 0) {
  if (session.durationMinutes < config.minSessionMinutes && !session.isMicroSession) {
    return 0;
  }

  const basePoints = Math.floor(session.durationMinutes / config.baseMinutesUnit);
  const qualityMultiplier = config.qualityMultipliers[session.qualityRating] ?? 1;
  const difficultyMultiplier = config.difficultyMultipliers[session.difficulty] ?? 1;
  const plannedBonus = session.isPlanned ? config.plannedBonus : 0;

  // Diminishing returns after 3rd session in a day.
  const diminishingMultiplier = sessionIndexForDay >= 3 ? 0.9 : 1;

  return Math.max(
    1,
    Math.round((basePoints * qualityMultiplier * difficultyMultiplier + plannedBonus) * diminishingMultiplier)
  );
}

export function computeDailyScore(sessions, config = DEFAULT_CONFIG) {
  let totalMinutes = 0;
  let totalScore = 0;

  sessions.forEach((session, index) => {
    if (totalMinutes >= config.dailyMinutesCap) return;

    const remaining = config.dailyMinutesCap - totalMinutes;
    const countedMinutes = Math.min(session.durationMinutes, remaining);
    const score = computeSessionScore({ ...session, durationMinutes: countedMinutes }, config, index);

    totalMinutes += countedMinutes;
    totalScore += score;
  });

  return {
    totalMinutes,
    totalScore,
    contributionLevel: getContributionLevel(totalScore),
    scoringVersion: config.version
  };
}

export { DEFAULT_CONFIG };
