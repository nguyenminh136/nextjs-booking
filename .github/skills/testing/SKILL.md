---
name: testing
description: Guide the design and implementation of reliable, maintainable, and meaningful automated tests.
---

# Testing

## Goal

Verify application behavior and prevent regressions.

Tests should be:

- Reliable
- Deterministic
- Maintainable
- Fast
- Focused on behavior

## Testing Strategy

Use the appropriate level of testing:

1. Unit tests
2. Integration tests
3. End-to-end tests

Prefer the lowest level that can reliably verify the behavior.

## Unit Tests

Use unit tests for:

- Business logic
- Utility functions
- Validation
- Calculations
- State transformations

Keep unit tests isolated and deterministic.

## Integration Tests

Use integration tests for interactions between:

- Modules
- Services
- APIs
- Databases
- Authentication
- External integrations

Verify that components work correctly together.

## End-to-End Tests

Use E2E tests for critical user workflows.

Examples:

- Authentication
- Checkout
- Payment
- Order creation
- Important business workflows

Do not use E2E tests for every small behavior.

## Test Behavior

Prefer testing observable behavior over implementation details.

Avoid tests that depend unnecessarily on:

- Internal function calls
- Private implementation details
- Specific component structure

## Test Cases

For important functionality, cover:

- Happy path
- Invalid input
- Empty input
- Boundary values
- Error conditions
- Permission failures
- Network failures
- Duplicate operations

## Test Structure

Prefer a clear structure:

```text
Arrange
Act
Assert
```

Each test should verify one meaningful behavior.

## Test Naming

Test names should describe the expected behavior.

Prefer:

```text
should reject an invalid email
```

over:

```text
testEmail
```

## Mocking

Mock external dependencies when necessary.

Prefer real implementations for simple internal logic.

Avoid excessive mocking that makes tests verify mocks instead of behavior.

## Test Data

Use isolated and predictable test data.

Tests should not depend on execution order.

Avoid sharing mutable state between tests.

## Async Tests

Always properly await asynchronous operations.

Avoid arbitrary delays or timeouts when deterministic synchronization is possible.

## Error Testing

Verify:

- Correct error type
- Expected error behavior
- User-safe error messages
- Recovery behavior where applicable

## Regression Tests

When fixing a bug:

1. Reproduce the bug.
2. Add a test that fails before the fix.
3. Implement the fix.
4. Verify the test passes.

## Flaky Tests

Investigate flaky tests instead of ignoring them.

Common causes:

- Shared state
- Timing assumptions
- Network dependencies
- Random data
- Test order dependency

## Coverage

Use coverage as a signal, not the only quality metric.

Prioritize meaningful coverage of:

- Business logic
- Critical workflows
- Error paths
- High-risk functionality

Avoid writing low-value tests only to increase coverage numbers.

## Performance

Tests should remain reasonably fast.

Avoid unnecessary:

- Network calls
- Database operations
- Large fixtures
- Complex setup

## Rules

- Test behavior, not implementation details.
- Prefer deterministic tests.
- Keep tests independent.
- Use the simplest appropriate testing level.
- Add regression tests for important bugs.
- Avoid unnecessary mocks.
- Do not optimize for coverage numbers alone.