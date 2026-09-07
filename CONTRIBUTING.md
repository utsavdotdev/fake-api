# Contributing to MockNest

Thanks for your interest in MockNest. This guide covers how we work day-to-day — branching, commits, and what a PR needs to land.

## Code of conduct

Be kind, assume good faith, and keep feedback specific and actionable. Disagreements on approach are welcome; personal attacks are not.

## Getting started

1. Fork the repo and clone your fork.
2. Install Node.js 20+ and run `npm install`.
3. Start the dev server with `npm run dev` and confirm `curl http://localhost:3000/health` returns `{"status":"ok"}`.
4. Run `npm test` once to make sure the baseline is green on your machine.

## Branching

- `main` is always green and reflects the published image.
- `develop` is the integration branch — open feature PRs here.
- Feature branches are short-lived and deleted after merge.

Branch naming follows the Conventional Commits `type` and uses kebab-case:

| Pattern            | Use for                                                       |
| ------------------ | ------------------------------------------------------------- |
| `feat/<slug>`      | A new user-facing feature.                                    |
| `fix/<slug>`       | A bug fix.                                                    |
| `docs/<slug>`      | Documentation-only changes.                                   |
| `test/<slug>`      | Adding or fixing tests with no production code change.        |
| `build/<slug>`     | Build, Docker, or dependency changes.                         |
| `ci/<slug>`        | CI/CD pipeline changes.                                       |
| `chore/<slug>`     | Tooling, lint config, or housekeeping.                        |
| `refactor/<slug>`  | Internal refactor with no behaviour change.                   |

Examples: `feat/pagination-cursor`, `fix/swagger-404`, `ci/publish-ghcr`.

Keep branches focused — one PR, one concern. Split unrelated changes into separate PRs.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/). Format:

```text
<type>(<optional scope>): <description>

<optional body explaining the why>

<optional footer>
```

Common types: `feat`, `fix`, `docs`, `test`, `build`, `ci`, `chore`, `refactor`, `perf`, `revert`.

Rules:

- Use the imperative mood ("add", not "added") and keep the subject under ~72 chars.
- Reference the issue in the footer (`Refs #42`, `Closes #42`) when one exists.
- Breaking changes: append `!` after the type/scope and add a `BREAKING CHANGE:` footer explaining the migration.

A pre-commit hook runs ESLint and Prettier via `lint-staged` on staged `*.js` / `*.mjs` files — there is no need to format manually.

## Development workflow

1. Create a feature branch off `develop`.
2. Make your change. Add or update tests in `tests/unit` or `tests/integration` to match.
3. Run the local checks:

   ```bash
   npm run lint
   npm test
   npm run test:coverage
   ```

   Coverage thresholds are enforced at 80% globally; CI will fail if a change drops coverage below the gate.
4. Update `src/docs/routes.openapi.js` whenever you add or change a public endpoint, then run `npm run docs:export` if you want the rendered Fumadocs reference regenerated.
5. Push your branch and open a Pull Request targeting `develop`.

## Pull request checklist

A PR is ready for review when **every** box below is checked.

- [ ] **Target branch is `develop`** (hotfixes to `main` are an explicit exception).
- [ ] **Title follows Conventional Commits** — same format as commit messages (`feat: ...`, `fix(scope): ...`).
- [ ] **Description explains the why**, not just the what. Include screenshots or curl examples for user-facing changes.
- [ ] **Linked to an issue** (`Closes #N` or `Refs #N`), or the PR description states why no issue exists.
- [ ] **`npm run lint` passes** with no warnings introduced.
- [ ] **`npm test` passes locally** — both unit and integration suites.
- [ ] **Coverage thresholds still met** (`npm run test:coverage`).
- [ ] **Tests added or updated** for every behavioural change; pure-refactor PRs note this explicitly.
- [ ] **OpenAPI annotations updated** for any added/changed endpoint (`src/docs/routes.openapi.js`).
- [ ] **README or docs updated** if user-facing behaviour or setup changed.
- [ ] **No secrets, `.env`, `coverage/`, or `node_modules/`** committed. `.gitignore` already excludes these — confirm before pushing.
- [ ] **No unrelated changes** (formatting drift, drive-by edits) bundled into the PR.
- [ ] **Self-reviewed the diff** once before requesting reviewers.

## Review process

- At least one approval is required to merge.
- CI must be green: lint, tests, coverage gate, and the Docker build smoke test.
- Squash-merge is the default so `develop` history stays linear; use a rebase/merge commit only when preserving intermediate commits aids the story.
- After merge, delete the source branch on GitHub.

## Reporting issues

Use the GitHub issue templates. For bugs, include:

- What you expected vs. what happened.
- A minimal reproduction (`curl` commands or a code snippet).
- Node.js version, OS, and whether you're running via `npm` or Docker.

For security issues, please email the maintainer directly rather than filing a public issue.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).