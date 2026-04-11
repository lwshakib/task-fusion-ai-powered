# Contributing to Task Fusion AI

Thank you for your interest in contributing to Task Fusion AI!

## Code of Conduct

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Contribution Flow

1. **Fork and clone**
   - Fork this repository on GitHub.
   - Clone your fork:
     ```bash
     git clone https://github.com/<your-username>/task-fusion-ai-powered.git
     cd task-fusion-ai-powered
     ```

2. **Install and configure**
   - Install packages: `bun install`
   - Create env file: `cp .env.example .env`
   - Fill required environment variables in `.env` (Database, Better Auth, Cloudflare R2/S3).
   - Run database migrations: `bun run db:migrate`
   - **Initialize Storage**: Run `bun run bucket:setup` to configure your R2/S3 bucket and CORS rules.

3. **Create a branch**
   - Create a feature branch from `main`:
     ```bash
     git checkout -b feat/your-change-name
     ```

4. **Develop and verify**
   - Start dev server: `bun run dev`
   - Run lint: `bun run lint`
   - Run build check: `bun run build`
   - Update documentation (`README.md`, etc.) if your changes introduce new setup steps or features.

5. **Push and open a pull request**
   - Commit your changes with a clear message.
   - Push your branch: `git push origin feat/your-change-name`
   - Open a Pull Request against `main`.

## Pull Request Checklist

- Changes are focused and scoped to one concern.
- No lint errors (`bun run lint` passes).
- Build succeeds (`bun run build` passes).
- Documentation is updated if necessary.

## Reporting Issues

- Search existing issues first.
- Open an issue with clear reproduction steps for bugs or detailed requirements for features.
