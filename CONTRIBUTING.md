# Contributing

Thanks for considering a contribution to AI2Design. This guide covers the basics for proposing changes.

## Ways to contribute

- Report bugs or request enhancements via issues.
- Improve documentation or examples.
- Propose JSON schema improvements and validation rules.
- Submit code changes via pull requests.

## Development setup

- Install Node.js v22 or later.
- Use the Figma desktop app for local plugin testing.

## Build and watch

```
$ npm install
$ npm run build
```

To rebuild on changes:

```
$ npm run watch
```

## Submitting changes

- Create an issue first for bug reports or new features. If a similar issue already exists, add context there and take that issue instead of opening a duplicate.
- Keep changes focused and incremental.
- Add or update examples when introducing new schema capabilities.
- Validate JSON examples for correctness before submitting.
- Use clear, descriptive commit messages.
- Use a clear PR title and a complete description of the change (what, why, and how to test).

## Code quality

Run these checks before opening a PR:

- Format: `npm run format:check` (or `npm run format` to auto-fix).
- Lint: `npm run lint`.
- Typecheck: `npm run typecheck`.
- Build: `npm run build`.

Pre-commit hooks run these checks automatically in this order: format check, format if needed, lint, typecheck, and build. `npm install` sets up the hooks via the `prepare` script.
If any step fails, the commit will be blocked until the issues are fixed.

To install hooks manually (if they are missing):

```
$ npm run prepare
```

## Reporting issues

Include:

- Steps to reproduce.
- Sample JSON that triggers the issue.
- Expected vs actual behavior.
- Figma desktop app version.
