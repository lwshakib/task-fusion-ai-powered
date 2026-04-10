# Contributing to Task Fusion AI

Thank you for your interest in contributing.

## Code of Conduct

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Contribution Flow (5 Steps)

1. **Fork and clone**
   - Fork this repository on GitHub.
   - Clone your fork:
     - `git clone https://github.com/<your-username>/task-fusion-ai-powered.git`
     - `cd task-fusion-ai-powered`

2. **Install and configure**
   - Install packages: `bun install`
   - Create env file: `cp .env.example .env`
   - Fill required environment variables in `.env`.
   - Run setup migration: `bun run db:migrate`

3. **Create a branch**
   - Create a feature branch from `main`:
     - `git checkout -b feat/your-change-name`

4. **Develop and verify**
   - Start dev server: `bun run dev`
   - Run lint: `bun run lint`
   - Run formatting: `bun run format`
   - Update docs when behavior, APIs, or setup steps change.

5. **Push and open a pull request**
   - Commit your changes with a clear message.
   - Push your branch:
     - `git push origin feat/your-change-name`
   - Open a Pull Request against `main` with:
     - What changed
     - Why it changed
     - How to verify manually

## Pull Request Checklist

- Changes are focused and scoped to one concern.
- Lint/format pass locally.
- New env/config requirements are documented.
- README/CONTRIBUTING updates are included when needed.

## Reporting Bugs or Requesting Features

- Search existing issues first.
- Open an issue with clear reproduction steps or proposal details:
  - [Issues](https://github.com/lwshakib/task-fusion-ai-powered/issues)
