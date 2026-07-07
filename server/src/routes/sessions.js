import { Router } from "express";
import { pool } from "../db/pool.js";
import { recalculateDailyScore, scoreDateFromStartedAt } from "../services/dailyScoreService.js";
import { computeSessionScore, validateSessionInput } from "../services/scoringService.js";

const router = Router();

router.post("/preview", (req, res) => {
  const errors = validateSessionInput(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });
  const sessionScore = computeSessionScore(req.body);
  return res.json({ sessionScore });
});

router.post("/", async (req, res, next) => {
  try {
    const errors = validateSessionInput(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const {
      category,
      durationMinutes,
      qualityRating,
      difficulty,
      isPlanned,
      isMicroSession = false,
      notes = "",
      startedAt
    } = req.body;

    const userId = req.user.id;
    const startDate = startedAt || new Date().toISOString();

    const inserted = await pool.query(
      `INSERT INTO sessions
       (user_id, category, duration_minutes, quality_rating, difficulty, is_planned, is_micro_session, notes, started_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [userId, category, durationMinutes, qualityRating, difficulty, isPlanned, isMicroSession, notes, startDate]
    );

    const scoreDate = scoreDateFromStartedAt(startDate);
    await recalculateDailyScore(userId, scoreDate);

    return res.status(201).json(inserted.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { date } = req.query;
    if (date) {
      const result = await pool.query(
        `SELECT * FROM sessions
         WHERE user_id = $1 AND DATE(started_at) = $2::date
         ORDER BY started_at ASC`,
        [req.user.id, date]
      );
      return res.json(result.rows);
    }

    const result = await pool.query(
      `SELECT * FROM sessions WHERE user_id = $1 ORDER BY started_at DESC LIMIT 100`,
      [req.user.id]
    );
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const errors = validateSessionInput(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const existing = await pool.query(`SELECT * FROM sessions WHERE id = $1 AND user_id = $2`, [
      req.params.id,
      req.user.id
    ]);
    if (!existing.rows[0]) return res.status(404).json({ error: "Session not found" });

    const oldDate = scoreDateFromStartedAt(existing.rows[0].started_at);
    const {
      category,
      durationMinutes,
      qualityRating,
      difficulty,
      isPlanned,
      isMicroSession = false,
      notes = "",
      startedAt
    } = req.body;
    const startDate = startedAt || existing.rows[0].started_at;

    const updated = await pool.query(
      `UPDATE sessions SET
         category = $1, duration_minutes = $2, quality_rating = $3, difficulty = $4,
         is_planned = $5, is_micro_session = $6, notes = $7, started_at = $8
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [
        category,
        durationMinutes,
        qualityRating,
        difficulty,
        isPlanned,
        isMicroSession,
        notes,
        startDate,
        req.params.id,
        req.user.id
      ]
    );

    const newDate = scoreDateFromStartedAt(startDate);
    await recalculateDailyScore(req.user.id, oldDate);
    if (newDate !== oldDate) await recalculateDailyScore(req.user.id, newDate);

    return res.json(updated.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await pool.query(`SELECT * FROM sessions WHERE id = $1 AND user_id = $2`, [
      req.params.id,
      req.user.id
    ]);
    if (!existing.rows[0]) return res.status(404).json({ error: "Session not found" });

    const scoreDate = scoreDateFromStartedAt(existing.rows[0].started_at);
    await pool.query(`DELETE FROM sessions WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id]);
    await recalculateDailyScore(req.user.id, scoreDate);

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

export default router;
