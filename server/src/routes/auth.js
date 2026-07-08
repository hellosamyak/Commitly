import { Router } from "express";
import passport from "passport";
import { env } from "../config/env.js";

const router = Router();

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

router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ authenticated: false });
  return res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.display_name,
      avatarUrl: req.user.avatar_url
    }
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


