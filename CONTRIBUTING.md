# Contributing to BusBeacon

Thanks for improving BusBeacon.

## Local Setup

1. Fork and clone the repository.
2. Run `npm install`.
3. Copy `backend/.env.example` to `backend/.env`.
4. Copy `frontend/.env.example` to `frontend/.env`.
5. Run `npm run dev`.

## Development Guidelines

- Keep backend code inside `backend/src` and frontend code inside `frontend/src`.
- Enforce role permissions on the backend, not only in the UI.
- Do not introduce paid APIs. Use OpenStreetMap, Leaflet, MongoDB Atlas free tier, Render free tier, Vercel free tier, and Firebase Cloud Messaging free tier.
- Include focused validation and error messages for attendance, trips, and live GPS flows.

## Pull Requests

- Use clear titles and describe the user-facing behavior.
- Include screenshots for UI changes.
- Note any environment variable or deployment changes.
- Verify `npm run build` before opening a PR.
