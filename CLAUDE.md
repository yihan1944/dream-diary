# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

梦境日记分析器 (Dream Diary Analyzer) — React + Node.js full-stack app. Users record dreams, AI analyzes emotion/themes/symbols via DeepSeek API, results visualized as keyword clouds and mood trend charts.

## Commands

```bash
# Backend (port 3001)
cd backend && npm install
npm run dev      # node --watch server.js
npm start        # node server.js

# Frontend (port 5173)
cd frontend && npm install
npm run dev      # vite dev server
npm run build    # vite build
npm run lint     # eslint .
```

## Architecture

**Backend** — Express ES Modules + Mongoose. Two route files:
- `routes/dreams.js` — CRUD for dreams via MongoDB
- `routes/analyze.js` — POST triggers DeepSeek API call, GET aggregates keywords/mood-trend
- `models/Dream.js` — Mongoose schema with toJSON transform (maps `_id` → `id`)

**Frontend** — React 19 + Vite + React Router. No TypeScript, no global state (all `useState`/`useEffect` per page). Pages use `/api` relative URLs, Vite proxies to backend in dev.

**Data model** — Dreams in MongoDB. Each dream has `id`, `title`, `content`, `date`, `tags`, `analysis` (nullable), `createdAt`. Analysis contains `emotion`, `emotionScore`, `themes`, `symbols`, `summary`, `keywords`.

## Key Details

- AI provider is DeepSeek (`deepseek-v4-pro`), configured via `DEEPSEEK_API_KEY` in `backend/.env`
- Analysis prompt requests direct JSON output (no markdown code blocks)
- All source is `.jsx` — no TypeScript despite `@types/react` in devDependencies
- No tests exist in either package
- Chinese (zh-CN) throughout: UI, prompts, README
