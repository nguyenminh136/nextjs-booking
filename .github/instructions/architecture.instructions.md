---
description: This file describes the architecture guidelines for the project.
---

# Architecture Guidelines

## Goal

Build software that is:

- Modular
- Maintainable
- Scalable
- Testable
- Easy to understand

Architecture should prioritize long-term maintainability over short-term convenience.

---

# Separation of Concerns

Separate responsibilities into distinct layers.

Each layer should have one responsibility.

Do not mix:

- Presentation
- Business Logic
- Data Access
- Infrastructure

Business logic must never depend on UI implementation.

---

# Module Boundaries

Organize code by feature or module.

Each module should own:

- Business logic
- Types
- Validation
- Services
- Tests

A module should expose only its public API.

Internal implementation details must remain private.

---

# Dependency Direction

Dependencies should always point inward.

Allowed:

Presentation
↓
Application
↓
Domain
↓
Infrastructure

Not allowed:

Presentation → Database

Presentation → External API

UI → SQL

UI → File System

---

# Single Responsibility

Every module, class, function and component should have one clear responsibility.

If something changes for multiple unrelated reasons, split it.

Avoid "God" objects.

---

# Composition

Prefer composition over inheritance.

Prefer:

- Small reusable modules
- Small reusable services
- Small reusable utilities

Avoid deep inheritance hierarchies.

---

# Business Logic

Business rules should:

- Be framework independent.
- Be reusable.
- Be testable.
- Not depend on UI.

Business logic should never live inside:

- UI components
- Controllers
- Routes
- API handlers

Move business rules into dedicated services or domain functions.

---

# Shared Code

Move code into shared/common only when:

- Used by multiple modules.
- Stable enough to be reused.

Avoid creating shared utilities too early.

Duplicate once.

Abstract later.

---

# File Organization

Keep related files together.

Prefer feature-based organization over layer-based organization.

Good

orders/
    service
    types
    validation
    tests

Bad

controllers/
services/
models/
utils/

---

# Public API

Each module should expose only what other modules need.

Hide implementation details.

Avoid importing internal files directly.

Import from the module entry whenever possible.

---

# Data Flow

Data should flow in one direction.

Input
↓
Validation
↓
Business Logic
↓
Persistence
↓
Output

Do not bypass validation.

---

# Validation

Validate data at application boundaries.

Examples:

- User input
- API requests
- External services
- Environment variables

Do not assume external data is valid.

---

# Side Effects

Keep side effects isolated.

Examples of side effects:

- HTTP requests
- Database access
- File system
- Email
- Logging

Business logic should remain as pure as possible.

---

# State Management

Keep state as local as possible.

Do not introduce global state unless necessary.

Single source of truth.

Avoid duplicated state.

---

# Error Boundaries

Errors should propagate to the appropriate layer.

Handle expected errors.

Log unexpected errors.

Do not silently ignore failures.

---

# Configuration

Configuration should come from:

- Environment variables
- Configuration files

Never hardcode environment-specific values.

---

# Extensibility

Design for extension.

Do not design for hypothetical requirements.

Avoid over-engineering.

---

# Consistency

When adding new code:

- Follow existing architecture.
- Follow existing folder structure.
- Follow existing naming conventions.

Consistency is more important than personal preference.

---

# Refactoring

Improve existing code when:

- Complexity increases.
- Duplication appears.
- Responsibilities become unclear.

Avoid unnecessary rewrites.

Refactor incrementally.

---

# Anti-patterns

Avoid:

- God classes
- God services
- Circular dependencies
- Hidden dependencies
- Shared mutable state
- Tight coupling
- Deep nesting
- Business logic in presentation layer
- Business logic in infrastructure layer
- Duplicate validation
- Large utility files

---

# Architecture Checklist

Before completing a task, verify:

- Responsibilities are clearly separated.
- Dependencies point in the correct direction.
- Business logic is isolated.
- Side effects are isolated.
- Module boundaries are respected.
- Shared code is justified.
- Validation happens at boundaries.
- No unnecessary coupling exists.
- Code is easy to extend.
- Code is easy to test.