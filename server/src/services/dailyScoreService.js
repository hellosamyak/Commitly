import { pool } from "../db/pool.js";
import { computeDailyScore } from "./scoringService.js";

export async function recalculateDailyScore(userId, scoreDate) {
  const sessionsResult = await pool.query(
    `SELECT category, duration_minutes, quality_rating, difficulty, is_planned, is_micro_session
     FROM sessions
     WHERE user_id = $1 AND DATE(started_at) = $2::date
     ORDER BY started_at ASC`,
    [userId, scoreDate]
  );

  const normalized = sessionsResult.rows.map((row) => ({
    category: row.category,
    durationMinutes: row.duration_minutes,
    qualityRating: row.quality_rating,
    difficulty: row.difficulty,
    isPlanned: row.is_planned,
    isMicroSession: row.is_micro_session
  }));

  const daily = computeDailyScore(normalized);

  const remaining = await pool.query(
    `SELECT id FROM daily_scores WHERE user_id = $1 AND score_date = $2::date`,
    [userId, scoreDate]
  );

  if (daily.totalScore === 0 && normalized.length === 0) {
    if (remaining.rows[0]) {
      await pool.query(`DELETE FROM daily_scores WHERE user_id = $1 AND score_date = $2::date`, [userId, scoreDate]);
    }
    return daily;
  }

  await pool.query(
    `INSERT INTO daily_scores (user_id, score_date, total_minutes, total_score, contribution_level, scoring_version)
     VALUES ($1, $2::date, $3, $4, $5, $6)
     ON CONFLICT (user_id, score_date)
     DO UPDATE SET total_minutes = EXCLUDED.total_minutes,
                   total_score = EXCLUDED.total_score,
                   contribution_level = EXCLUDED.contribution_level,
                   scoring_version = EXCLUDED.scoring_version,
                   updated_at = NOW()`,
    [userId, scoreDate, daily.totalMinutes, daily.totalScore, daily.contributionLevel, daily.scoringVersion]
  );

  return daily;
}

export function scoreDateFromStartedAt(startedAt) {
  const d = new Date(startedAt);
  return d.toISOString().slice(0, 10);
}
