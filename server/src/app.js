import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { authRequired } from "./middleware/authRequired.js";
import authRoutes from "./routes/auth.js";
import insightsRoutes from "./routes/insights.js";
import scoresRoutes from "./routes/scores.js";
import sessionsRoutes from "./routes/sessions.js";

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err);
  }
});

if (env.googleClientId && env.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const displayName = profile.displayName || "";
          const avatarUrl = profile.photos?.[0]?.value || "";

          const upsert = await pool.query(
            `INSERT INTO users (oauth_provider, oauth_provider_user_id, email, display_name, avatar_url)
             VALUES ('google', $1, $2, $3, $4)
             ON CONFLICT (oauth_provider, oauth_provider_user_id)
             DO UPDATE SET email = EXCLUDED.email,
                           display_name = EXCLUDED.display_name,
                           avatar_url = EXCLUDED.avatar_url,
                           updated_at = NOW()
             RETURNING *`,
            [profile.id, email, displayName, avatarUrl]
          );
          done(null, upsert.rows[0]);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "commitly-api",
    health: "/health"
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/sessions", authRequired, sessionsRoutes);
app.use("/scores", authRequired, scoresRoutes);
app.use("/insights", authRequired, insightsRoutes);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
