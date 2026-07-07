import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure", session: true }),
  (req, res) => {
    res.redirect(process.env.CLIENT_ORIGIN || "http://localhost:5173");
  }
);

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
