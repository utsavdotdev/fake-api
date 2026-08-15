# MockNest

A lightweight, configurable fake REST API service for frontend development and API testing.

## Quick Start

```bash
npm install
npm run dev
```

The server runs at `http://localhost:3000` by default (set `PORT` to override).

## Resources

RESTful CRUD endpoints for seeded data:

- `/users`
- `/posts`
- `/comments`

Also includes a `/health` check.

## Security Notes

- CORS is configured with `origin: '*'` for permissive dev/testing access. Tighten this (e.g. an allow-list of origins) before any public deployment.
- A global rate limiter allows 100 requests per 15 minutes per IP; adjust `windowMs`/`max` in `src/app.js` as needed.
- Security headers are applied via Helmet.
- Request logging uses `morgan('dev')` in development and `morgan('combined')` in production.