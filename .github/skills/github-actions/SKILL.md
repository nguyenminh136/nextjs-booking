---
name: github-actions
description: Create and maintain GitHub Actions workflows for CI/CD.
argument-hint: <workflow-task>
---

# GitHub Actions

Use GitHub Actions YAML workflows.

Workflow location:

.github/workflows/

## CI

Typical stages:

1. Checkout
2. Setup Node
3. Install dependencies
4. Lint
5. Type check
6. Test
7. Build

Use the project's existing package manager.

For pnpm:

- Enable Corepack when appropriate.
- Use the repository's pnpm version.
- Prefer dependency caching.

## Security

- Never hardcode secrets.
- Use GitHub Secrets for sensitive values.
- Use OIDC for cloud authentication when supported.
- Use least-privilege permissions.
- Avoid exposing secrets in logs.

## Pull Requests

PR workflows should normally:

- Install dependencies
- Lint
- Type check
- Test
- Build

Do not deploy production from arbitrary pull requests.

## Deployment

Before changing deployment behavior:

- Inspect existing environments.
- Inspect branch strategy.
- Inspect existing deployment scripts.
- Inspect Docker configuration.
- Inspect required secrets and environment variables.

Prefer reusable workflows when multiple environments share the same deployment logic.