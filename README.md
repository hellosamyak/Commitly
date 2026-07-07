# Commitly - Productivity Contributions Web App

React + JavaScript frontend with a Node.js + Express backend, PostgreSQL storage, OAuth login, and a GitHub-style productivity contribution heatmap.

## Project Structure

- `client/` - React (Vite) web app
- `server/` - Express API + scoring engine + PostgreSQL access

## Quick Start

1. Install dependencies:
   - `cd server && npm install`
   - `cd ../client && npm install`
2. Configure environment variables:
   - copy `server/.env.example` to `server/.env`
   - copy `client/.env.example` to `client/.env`
3. Run database schema from `server/src/db/migrations/001_init.sql`.
4. Start backend:
   - `cd server && npm run dev`
5. Start frontend:
   - `cd client && npm run dev`

## OAuth Notes

The backend currently supports Google OAuth 2.0 through Passport. Set callback URL in your provider console to:

`http://localhost:4000/auth/google/callback`
