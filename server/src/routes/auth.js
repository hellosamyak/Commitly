import { Router } from "express";
import passport from "passport";
import { env } from "../config/env.js";
import { pool } from "../db/pool.js";
import { hashPassword, verifyPassword } from "../services/passwordService.js";

const router = Router();

function toAuthUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    avatarUrl: user.avatar_url
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validateCredentials({ email, password, displayName }, { requireName = false } = {}) {
  const errors = [];
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.push("Enter a valid email address.");
  }

  if (!password || String(password).length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  if (requireName && !String(displayName || "").trim()) {
    errors.push("Enter your name.");
  }

  return { errors, email: normalizedEmail };
}

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err || !user) {
      if (err) console.error("Google OAuth callback failed:", err.message);
      return res.redirect(`${env.clientOrigin}?authError=google`);
    }

    return req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.redirect(env.clientOrigin);
    });
  })(req, res, next);
});

router.post("/signup", async (req, res, next) => {
  try {
    const { displayName, password } = req.body;
    const { errors, email } = validateCredentials(req.body, { requireName: true });
    if (errors.length > 0) return res.status(400).json({ errors });

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows[0]) return res.status(409).json({ error: "An account with this email already exists." });

    const created = await pool.query(
      `INSERT INTO users (oauth_provider, oauth_provider_user_id, email, display_name, password_hash)
       VALUES ('local', $1, $1, $2, $3)
       RETURNING *`,
      [email, String(displayName).trim(), hashPassword(password)]
    );

    return req.logIn(created.rows[0], (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.status(201).json({ authenticated: true, user: toAuthUser(created.rows[0]) });
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { password } = req.body;
    const { errors, email } = validateCredentials(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json({ authenticated: true, user: toAuthUser(user) });
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ authenticated: false });
  return res.json({
    authenticated: true,
    user: toAuthUser(req.user)
  });
});

router.get("/failure", (_req, res) => {
  res.status(401).json({ error: "OAuth authentication failed" });
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.json({ ok: true }));
  });
});

export default router;
