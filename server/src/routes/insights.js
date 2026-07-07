import { Router } from "express";
import { pool } from "../db/pool.js";
import {
  buildCategoryBreakdown,
  buildContributionForecast,
  buildWeeklyInsights
} from "../services/insightsService.js";
import { computeSessionScore } from "../services/scoringService.js";

const router = Router();

router.get("/weekly", async (req, res, next) => {
  try {
    const daily = await pool.query(
      `SELECT score_date, total_score
       FROM daily_scores
       WHERE user_id = $1 AND score_date >= CURRENT_DATE - INTERVAL '6 days'
       ORDER BY score_date ASC`,
      [req.user.id]
    );

    const sessions = await pool.query(
      `SELECT category
       FROM sessions
       WHERE user_id = $1 AND started_at >= CURRENT_DATE - INTERVAL '6 days'`,
      [req.user.id]
    );

    return res.json(buildWeeklyInsights(daily.rows, sessions.rows));
  } catch (err) {
    return next(err);
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    const days = Math.max(1, Number(req.query.days || 7));
    const sessions = await pool.query(
      `SELECT category, duration_minutes
       FROM sessions
       WHERE user_id = $1 AND started_at >= CURRENT_DATE - ($2::int - 1) * INTERVAL '1 day'`,
      [req.user.id, days]
    );
    return res.json(buildCategoryBreakdown(sessions.rows));
  } catch (err) {
    return next(err);
  }
});

router.post("/forecast", async (req, res, next) => {
  try {
    const today = await pool.query(
      `SELECT total_score FROM daily_scores WHERE user_id = $1 AND score_date = CURRENT_DATE`,
      [req.user.id]
    );
    const currentScore = today.rows[0]?.total_score || 0;

    const projectedSessionScore = computeSessionScore(req.body);
    return res.json(buildContributionForecast(currentScore, projectedSessionScore));
  } catch (err) {
    return next(err);
  }
});

export default router;
