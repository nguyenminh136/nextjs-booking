---
description: Core Engineering Principles to follow when generating code.
---

# Core Engineering Principles

## Mission

Generate production-ready code that is:

- Correct
- Readable
- Maintainable
- Reusable
- Testable
- Secure
- Performant

Prefer long-term maintainability over short-term convenience.

---

# Decision Making

When multiple solutions exist, choose the one that:

1. Is easiest to understand.
2. Has the lowest maintenance cost.
3. Minimizes technical debt.
4. Follows existing project conventions.
5. Can scale without major refactoring.

Do not optimize prematurely.

---

# General Rules

Always:

- Write production-ready code.
- Keep implementations simple.
- Prefer explicit code over implicit behavior.
- Reuse existing code before creating new code.
- Follow existing project conventions.
- Generate complete implementations unless instructed otherwise.

Never:

- Generate demo code.
- Leave TODO or FIXME comments.
- Ignore compiler or linter errors.
- Duplicate existing logic.
- Add unnecessary abstractions.
- Introduce breaking changes without reason.

---

# Engineering Principles

Always follow:

- SOLID
- DRY
- KISS
- YAGNI
- Separation of Concerns
- Composition over Inheritance

Business logic must remain independent from UI and infrastructure.

---

# Code Quality

Code should be:

- Small
- Focused
- Predictable
- Strongly typed
- Easy to review

Prefer:

- Early return
- Small functions
- Pure functions
- Immutable data when practical
- Explicit names

Avoid:

- Deep nesting
- Long methods
- Large classes
- Hidden side effects
- Magic numbers
- Boolean flags controlling unrelated behavior

---

# Reusability

Before creating new code:

1. Search for an existing implementation.
2. Extend existing functionality when appropriate.
3. Extract shared logic only after it is reused.

Avoid creating generic abstractions too early.

---

# Error Handling

Always:

- Validate inputs.
- Handle expected failures.
- Return meaningful error messages.
- Fail fast on invalid state.

Never:

- Swallow exceptions.
- Return ambiguous errors.
- Hide implementation problems.

---

# Security

Treat every external input as untrusted.

Always:

- Validate input.
- Sanitize user content when required.
- Escape output where appropriate.
- Protect sensitive data.
- Use least privilege.

Never:

- Hardcode secrets.
- Log credentials or tokens.
- Trust client-side validation.

---

# Performance

Prefer:

- Efficient algorithms.
- Lazy loading.
- Caching where appropriate.
- Pagination for large datasets.
- Memoization only when measurable.

Avoid optimization without evidence.

Measure before optimizing.

---

# Maintainability

Write code for future developers.

Every implementation should be:

- Easy to understand.
- Easy to modify.
- Easy to test.
- Easy to remove.

Prioritize clarity over cleverness.

---

# Documentation

Document:

- Public APIs
- Complex business rules
- Non-obvious decisions

Do not document obvious code.

Comments should explain **why**, not **what**.

---

# Output Expectations

Unless instructed otherwise, generated code should:

- Compile successfully.
- Follow project conventions.
- Include proper typing.
- Handle edge cases.
- Include basic validation.
- Be ready for production.

Avoid placeholder implementations.

---

# Final Checklist

Before completing any task, verify:

- Code is correct.
- No duplicated logic exists.
- Naming is clear.
- Types are explicit.
- Error handling is complete.
- Security has been considered.
- Performance is reasonable.
- Code is maintainable.