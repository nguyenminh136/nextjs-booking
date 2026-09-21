---
name: feature-implementation
description: Guide the implementation of features from requirement analysis through implementation, testing, and validation.
---

# Feature Implementation

## Goal

Implement features that are correct, maintainable, testable, and consistent with the existing codebase.

## Workflow

Follow this order:

1. Understand the requirement.
2. Inspect the existing codebase.
3. Identify affected modules and dependencies.
4. Reuse existing code when appropriate.
5. Define the simplest suitable implementation.
6. Implement incrementally.
7. Handle loading, empty, success, and error states where applicable.
8. Add or update tests.
9. Run relevant validation.
10. Review the implementation before completing the task.

## Codebase First

Before creating or modifying code:

- Check existing patterns.
- Search for reusable components, functions, services, and types.
- Follow existing architecture and conventions.
- Avoid introducing duplicate implementations.

## Implementation

Prefer:

- Small, focused changes.
- Existing abstractions when appropriate.
- Strong typing.
- Clear separation of concerns.
- Minimal dependencies.

Avoid:

- Unnecessary refactoring.
- Premature abstraction.
- Unrelated changes.
- Over-engineering.

## Validation

Verify:

- TypeScript compilation.
- Linting.
- Relevant tests.
- Expected behavior.
- Error handling.
- Edge cases.

## Completion Criteria

A feature is complete only when:

- The requirement is satisfied.
- Existing functionality is not unintentionally broken.
- Relevant tests pass.
- Code follows project conventions.
- No unnecessary code or dependencies are introduced.