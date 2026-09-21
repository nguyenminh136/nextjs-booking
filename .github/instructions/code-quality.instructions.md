---
description: This file describes the code quality guidelines for the project.
applyTo: **
---

# Code Quality Guidelines

## Goal

Write code that is:

- Correct
- Readable
- Maintainable
- Reusable
- Predictable
- Easy to test

Code is read more often than it is written.

Prioritize clarity over cleverness.

---

# General Rules

Always:

- Write self-explanatory code.
- Keep implementations simple.
- Prefer explicit behavior.
- Keep related logic together.
- Follow existing project conventions.

Never:

- Write code that is difficult to understand.
- Duplicate business logic.
- Introduce unnecessary abstractions.
- Leave dead or commented-out code.
- Disable linting or type checking without justification.

---

# Readability

Code should explain itself.

Prefer descriptive names over comments.

Good

```ts
const hasPermission = user.roles.includes("admin");
```

Bad

```ts
const x = user.roles.includes("admin");
```

---

# Simplicity

Choose the simplest solution that satisfies the requirements.

Avoid:

- Clever tricks
- Over-engineering
- Deep abstractions
- Unnecessary design patterns

---

# Single Responsibility

Every:

- Function
- Class
- Component
- Module

should have one clear responsibility.

Split code when responsibilities become mixed.

---

# Function Design

Functions should:

- Perform one task.
- Have descriptive names.
- Be easy to understand.
- Be easy to test.

Prefer:

- Early return
- Small functions
- Pure functions

Avoid:

- Long functions
- Hidden side effects
- Multiple unrelated responsibilities

---

# Parameters

Keep parameter lists short.

Prefer an object parameter when there are more than three arguments.

Good

```ts
createUser({
  name,
  email,
  role,
});
```

Bad

```ts
createUser(name, email, role, phone, address);
```

---

# Nesting

Keep nesting shallow.

Prefer early return instead of nested conditions.

Good

```ts
if (!user) {
  return;
}

processUser(user);
```

Bad

```ts
if (user) {
  if (user.active) {
    if (user.emailVerified) {
      processUser(user);
    }
  }
}
```

---

# Conditional Logic

Keep conditions easy to read.

Extract complex conditions into named functions.

Good

```ts
if (canCheckout(order)) {
```

Bad

```ts
if (
  order.total > 0 &&
  order.items.length > 0 &&
  user.active &&
  !user.blocked
) {
```

---

# Boolean Flags

Avoid boolean parameters that change unrelated behavior.

Bad

```ts
save(user, true);
```

Prefer separate functions.

Good

```ts
save(user);

saveAndPublish(user);
```

---

# Duplication

Avoid duplicated:

- Logic
- Validation
- Constants
- Calculations

Extract shared code only after meaningful duplication appears.

---

# Magic Values

Replace unexplained literals with named constants.

Bad

```ts
if (retry > 3)
```

Good

```ts
if (retry > MAX_RETRY)
```

---

# Side Effects

Keep side effects isolated.

Examples:

- Database
- HTTP
- Logging
- File system
- Storage

Business logic should remain as pure as possible.

---

# State

Keep state minimal.

Avoid duplicated state.

Derive values whenever possible.

Single source of truth.

---

# Error Handling

Handle expected failures.

Return meaningful errors.

Do not ignore exceptions.

Avoid empty catch blocks.

Bad

```ts
try {
    ...
} catch {}
```

---

# Comments

Prefer readable code over comments.

Write comments only when explaining:

- Business rules
- Non-obvious decisions
- Complex algorithms

Do not explain obvious code.

Bad

```ts
// Increment counter
counter++;
```

---

# Code Reuse

Before writing new code:

1. Search for an existing implementation.
2. Extend existing functionality if appropriate.
3. Create new code only when necessary.

---

# Dead Code

Remove:

- Unused variables
- Unused imports
- Commented-out code
- Obsolete functions
- Unreachable code

Do not keep code "just in case".

---

# Logging

Log meaningful information.

Avoid excessive logging.

Never log:

- Passwords
- Tokens
- Secrets
- Personal information unless required

---

# Defensive Programming

Validate assumptions.

Handle invalid input.

Fail fast.

Do not continue with invalid state.

---

# Consistency

Follow existing project conventions.

Prefer consistency over personal preference.

Do not introduce a different coding style within the same project.

---

# Refactoring

Refactor when:

- Complexity increases.
- Duplication appears.
- Responsibilities become unclear.
- Readability decreases.

Refactor incrementally.

Avoid unnecessary rewrites.

---

# Anti-patterns

Avoid:

- Long functions
- Deep nesting
- Duplicate code
- God objects
- God services
- Hidden side effects
- Mutable shared state
- Large switch statements
- Excessive conditional branching
- Large utility files
- Overly generic abstractions
- Premature optimization

---

# Code Review Checklist

Before completing a task, verify:

- The code is easy to read.
- Function names describe intent.
- Responsibilities are well separated.
- Logic is not duplicated.
- Functions are small and focused.
- Nesting is minimal.
- Side effects are isolated.
- Errors are handled correctly.
- Magic values are removed.
- Dead code has been removed.
- The implementation follows project conventions.
- The code is maintainable.
```