import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/heatmap", async (req, res, next) => {
  try {
    const months = Math.max(1, Number(req.query.months || 12));
    const result = await pool.query(
      `SELECT score_date, total_score, contribution_level
       FROM daily_scores
       WHERE user_id = $1
         AND score_date >= CURRENT_DATE - ($2::int * INTERVAL '30 days')
       ORDER BY score_date ASC`,
      [req.user.id, months]
    );
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/today", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT score_date, total_minutes, total_score, contribution_level
       FROM daily_scores
       WHERE user_id = $1 AND score_date = CURRENT_DATE`,
      [req.user.id]
    );
    return res.json(result.rows[0] || null);
  } catch (err) {
    return next(err);
  }
});

export default router;
