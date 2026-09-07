# MockNest

[![CI](https://github.com/utsavdotdev/fake-api/actions/workflows/ci.yml/badge.svg)](https://github.com/utsavdotdev/fake-api/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/utsavdotdev/fake-api/graph/badge.svg)](https://codecov.io/gh/utsavdotdev/fake-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A lightweight, configurable fake REST API for frontend development, QA, and integration testing. MockNest ships seeded `users`, `posts`, and `comments` data behind a familiar REST surface, supports full CRUD, and exposes utility endpoints for resetting state and inspecting resources — so test suites can isolate runs without external services.

Use MockNest to:

- Spin up a deterministic API in seconds with `npm` or Docker.
- Exercise loading, error, and pagination states via query-string knobs.
- Reset the in-memory store between test runs to keep fixtures reproducible.
- Build and test client apps without standing up a real backend.

## Quick Start

Requires Node.js 20+ and npm.

```bash
git clone https://github.com/utsavdotdev/fake-api.git
cd fake-api
npm install
npm run dev
```

The server is now running at <http://localhost:3000>.

```bash
curl http://localhost:3000/health
# {"status":"ok"}

curl http://localhost:3000/api/users?_limit=2
```

Open <http://localhost:3000/swagger-docs> for the interactive Swagger UI, or <http://localhost:3000/docs> for the rendered Fumadocs reference (available after `npm start`, which builds the docs). The published docs site lives at <https://utsavdotdev.github.io/fake-api>.

### Docker

Start the API with `docker compose` (live-reload via nodemon, `src/` mounted as a volume):

```bash
docker compose up
```

Force a fresh image build after Dockerfile or dependency changes:

```bash
docker compose up --build
```

Build and run the production-style image directly:

```bash
docker build -t mocknest .
docker run -p 3000:3000 mocknest
```

The prebuilt image is published to GitHub Container Registry on every merge to `main`:

- `ghcr.io/utsavdotdev/mocknest:latest`
- `ghcr.io/utsavdotdev/mocknest:<short-sha>` (e.g. `ghcr.io/utsavdotdev/mocknest:1a2b3c4`)

```bash
docker pull ghcr.io/utsavdotdev/mocknest:latest
docker run -p 3000:3000 ghcr.io/utsavdotdev/mocknest
```

## Features

### Simulation & pagination query parameters

Every list endpoint accepts the same set of query-string knobs. Prefix with `_` so they don't collide with real resource fields.

| Parameter   | Type    | Applies to    | Description                                                                                  |
| ------------ | ------- | ------------- | -------------------------------------------------------------------------------------------- |
| `_page`     | integer | list endpoints | 1-indexed page number. Defaults to `1`.                                                      |
| `_limit`    | integer | list endpoints | Items per page. Defaults to `10`, max `100` (override with `DEFAULT_PAGE_LIMIT`).             |
| `_sort`     | string  | list endpoints | Field name to sort by (e.g. `id`, `name`, `title`).                                          |
| `_order`    | string  | list endpoints | Sort direction: `asc` (default) or `desc`.                                                   |
| `_delay`    | integer | all endpoints  | Simulate server latency in ms, clamped to `MAX_DELAY_MS` (default `5000`).                   |
| `_status`   | integer | all endpoints  | Force an error response. Accepts `400`–`599`; values outside that range are ignored.         |

### Utility endpoints

| Method | Path          | Description                                                                                          |
| ------ | ------------- | ---------------------------------------------------------------------------------------------------- |
| GET    | `/health`     | Liveness probe. Always returns `{"status":"ok"}`.                                                    |
| GET    | `/api/_meta`  | Lists every supported resource alongside its current in-memory record count.                         |
| POST   | `/api/_reset` | Reloads every resource from its original seed JSON, undoing any create/update/delete done at runtime.|

Example:

```bash
curl http://localhost:3000/api/_meta
# {"resources":[{"resource":"users","count":10},{"resource":"posts","count":10},{"resource":"comments","count":10}]}

curl -X POST http://localhost:3000/api/_reset
# {"reset":true,"resources":[{"resource":"users","count":10}, ... ]}
```

### Resource endpoints

All resources support standard CRUD:

| Method | Path                  | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/{resource}`     | List records (paginated, sortable).  |
| GET    | `/api/{resource}/{id}`| Fetch a single record by id.         |
| POST   | `/api/{resource}`     | Create a record.                     |
| PUT    | `/api/{resource}/{id}`| Replace a record.                    |
| PATCH  | `/api/{resource}/{id}`| Partially update a record.           |
| DELETE | `/api/{resource}/{id}`| Remove a record.                     |

`{resource}` is one of `users`, `posts`, `comments`. Each ships with 10 seeded records.

### Error simulation

Force a 500 response (or any status in `400`–`599`) to test error handling on the client:

```bash
curl -i "http://localhost:3000/api/users?_status=500"
# HTTP/1.1 500 Internal Server Error
# {"error":true,"status":500,"message":"Simulated 500 error"}
```

### Latency simulation

Add artificial delay (in ms) before any response — useful for testing spinners and timeouts:

```bash
curl "http://localhost:3000/api/posts?_delay=1200"
```

## API documentation

- Published docs site: <https://utsavdotdev.github.io/fake-api>
- Interactive Swagger UI: <http://localhost:3000/swagger-docs>
- Rendered Fumadocs reference (built by `npm run docs:build`): <http://localhost:3000/docs>
- Raw OpenAPI 3.0 spec: `npm run docs:export` writes to `docs/openapi.json`

The Swagger UI covers every endpoint, request schema, validation rule, and response shape. Use it as the source of truth for field names and accepted values.

To advertise a public API server in the generated OpenAPI spec (for example, on the hosted docs site), set the `DOCS_PUBLIC_SERVER_URL` environment variable before running `npm run docs:export` or `npm run docs:build`. The published Pages deploy reads it from the repo variable of the same name.

## Configuration

All settings come from environment variables (loaded from `.env` if present). Defaults shown:

| Variable             | Default     | Description                                              |
| -------------------- | ----------- | -------------------------------------------------------- |
| `PORT`               | `3000`      | HTTP port the server binds to.                           |
| `NODE_ENV`           | `development` | Switches logging format and hides stack traces in prod. |
| `DEFAULT_PAGE_LIMIT` | `10`        | Items per page when `_limit` is omitted.                 |
| `MAX_DELAY_MS`       | `5000`      | Upper clamp for `_delay`.                                |

Copy `.env.example` to `.env` to customise locally.

## Development

### Scripts

| Script                 | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm run dev`          | Start the server with nodemon live-reload.                             |
| `npm start`            | Build the Fumadocs site and run the production server.                |
| `npm run lint`         | Run ESLint over `src/` and `tests/`.                                   |
| `npm test`             | Run the full Jest suite (unit + integration).                          |
| `npm run test:unit`    | Unit tests only (`tests/unit`).                                        |
| `npm run test:integration` | Integration tests only (`tests/integration`).                      |
| `npm run test:coverage` | Run tests and emit `coverage/lcov.info` for Codecov.                 |
| `npm run format`       | Format the repo with Prettier.                                         |
| `npm run docs:build`   | Export the OpenAPI spec, generate Fumadocs content, and build the site.|

### Folder structure

```text
fake-api/
├── .github/workflows/    # CI/CD pipeline (ci.yml)
├── docs/                 # Fumadocs site + exported OpenAPI spec
├── scripts/              # Build/export scripts (e.g. export-openapi.mjs)
├── src/
│   ├── app.js            # Express app wiring, middleware, static docs
│   ├── server.js         # process entry point
│   ├── config/           # env.js — runtime configuration
│   ├── controllers/      # resourceController.js — HTTP handlers
│   ├── data/             # in-memory db + seed JSON files
│   ├── docs/             # swagger spec + JSDoc route annotations
│   ├── middlewares/      # validate, paginate, simulateDelay, simulateError
│   ├── routes/           # index, resourceRouter, utilRouter
│   ├── services/         # business logic (resourceService)
│   ├── utils/            # shared error classes
│   └── validators/       # express-validator rule sets
├── tests/
│   ├── unit/             # pure-logic tests (db, services, middlewares)
│   └── integration/      # supertest end-to-end tests
├── coverage/             # Jest coverage output (gitignored)
├── Dockerfile            # multi-stage build
└── package.json
```

### Running tests

```bash
npm run lint           # ESLint
npm test               # full suite
npm run test:coverage  # + coverage report
```

The Jest suite uses the experimental VM modules flag (`--experimental-vm-modules`) to support ESM; the `npm` scripts wire it up automatically. Coverage thresholds are enforced globally at 80% statements / branches / functions / lines.

## CI/CD

- **CI** (`.github/workflows/ci.yml`): on every push to `main` / `develop` and on every PR, runs install → lint → test (with coverage) → upload to Codecov → Docker build smoke test.
- **CD**: on push to `main`, after the CI job succeeds, builds the Docker image, tags it as `latest` and the short commit SHA, and pushes both to `ghcr.io/utsavdotdev/mocknest`. The job uses the built-in `GITHUB_TOKEN` and grants `packages: write` so no extra secrets are required.
- **Docs site**: on push to `main`, a `pages` job (after CI succeeds) builds the Fumadocs site with `npm run docs:build` and deploys `docs/out/` to GitHub Pages via `actions/deploy-pages`. The site is served under `/fake-api/` (matching `basePath` in `docs/next.config.mjs`) and is published at <https://utsavdotdev.github.io/fake-api>. Enable Pages in repo Settings → Pages with Source = "GitHub Actions" the first time.

## Security notes

- CORS is configured with `origin: '*'` for permissive dev/testing access. Tighten this (e.g. an allow-list of origins) before any public deployment.
- A global rate limiter allows 100 requests per 15 minutes per IP; adjust `windowMs` / `max` in `src/app.js` as needed.
- Security headers are applied via Helmet.
- Request logging uses `morgan('dev')` in development and `morgan('combined')` in production.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for branch naming, commit conventions, and the PR review checklist.

## License

[MIT](./LICENSE) © Utsav Bhattarai.