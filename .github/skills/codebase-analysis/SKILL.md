---
name: codebase-analysis
description: Analyze an existing codebase before making changes to understand its architecture, patterns, dependencies, and reusable code.
---

# Codebase Analysis

## Goal

Understand the existing code before modifying it.

## Workflow

Follow this order:

1. Inspect the project structure.
2. Identify the application entry points.
3. Identify major modules and responsibilities.
4. Trace relevant data and control flows.
5. Find existing implementations related to the task.
6. Identify reusable components, functions, services, and types.
7. Identify dependencies and potential side effects.
8. Determine the smallest set of files that need to change.

## Search Strategy

Search for:

- Related features.
- Similar implementations.
- Shared utilities.
- Types and interfaces.
- API calls.
- State management.
- Validation.
- Tests.
- Configuration.

Prefer existing patterns over introducing new ones.

## Architecture

Determine:

- Module boundaries.
- Dependency direction.
- Separation of concerns.
- Shared vs feature-specific code.
- Existing architectural patterns.

Do not assume an architecture without inspecting the codebase.

## Impact Analysis

Before changing code, consider:

- Direct dependencies.
- Consumers of the changed code.
- API contracts.
- State changes.
- Side effects.
- Regression risks.

## Output

Summarize:

- Relevant files.
- Existing patterns.
- Reusable code.
- Dependencies.
- Potential risks.
- Recommended implementation approach.

Keep the analysis concise and focused on the requested task.

## Rules

- Do not modify code during analysis unless explicitly requested.
- Do not create new abstractions before checking existing ones.
- Do not refactor unrelated code.
- Do not assume missing information.
- Prefer evidence from the codebase over assumptions.