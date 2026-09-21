---
description: This file describes the design principles for the project.
---

# Design Principles

## Goal

Write software that is:

- Simple
- Maintainable
- Predictable
- Testable
- Easy to extend

Prefer simplicity over cleverness.

---

# SOLID

Always apply SOLID when appropriate.

## Single Responsibility Principle (SRP)

Every module, class, function or component should have one clear responsibility.

Split code when it changes for unrelated reasons.

Avoid:

- God classes
- God services
- Large components

---

## Open / Closed Principle (OCP)

Software should be open for extension but closed for modification.

Prefer extending behavior instead of modifying existing implementations.

Use composition instead of conditional branching when possible.

---

## Liskov Substitution Principle (LSP)

Derived implementations must behave consistently with their base contracts.

Never surprise callers.

---

## Interface Segregation Principle (ISP)

Prefer multiple focused interfaces over one large interface.

Avoid interfaces with unused members.

---

## Dependency Inversion Principle (DIP)

Depend on abstractions instead of concrete implementations.

High-level modules should not depend directly on infrastructure.

---

# DRY

Don't Repeat Yourself.

Avoid duplicated:

- Business logic
- Validation
- Constants
- Configuration

Extract shared code only after duplication becomes meaningful.

Do not over-abstract.

---

# KISS

Keep It Simple.

Choose the simplest solution that correctly solves the problem.

Avoid:

- Clever code
- Deep abstraction
- Unnecessary patterns

Readable code is preferred.

---

# YAGNI

You Aren't Gonna Need It.

Implement only current requirements.

Avoid building for hypothetical future features.

---

# Composition Over Inheritance

Prefer:

- Composition
- Delegation
- Small reusable modules

Avoid deep inheritance trees.

---

# Separation of Concerns

Each module should have one responsibility.

Separate:

- Presentation
- Business Logic
- Data Access
- Infrastructure

Do not mix responsibilities.

---

# Encapsulation

Hide implementation details.

Expose only what consumers need.

Keep internal APIs private.

---

# Single Source of Truth

Every piece of data should have one authoritative source.

Avoid duplicated state.

Avoid synchronizing multiple copies of the same data.

---

# Fail Fast

Detect problems as early as possible.

Validate inputs immediately.

Throw meaningful errors.

Do not continue with invalid state.

---

# Tell, Don't Ask

Prefer telling an object to perform an action instead of retrieving data and making decisions externally.

Avoid leaking internal state.

---

# Law of Demeter

A module should communicate only with its direct collaborators.

Avoid long dependency chains.

Avoid code like:

a.b.c.d.e()

Prefer exposing meaningful methods.

---

# Command Query Separation

A function should either:

- Return data

OR

- Change state

Avoid doing both unless necessary.

---

# Immutability

Prefer immutable data.

Avoid mutating shared objects.

Return new values when practical.

---

# Pure Functions

Prefer pure functions whenever possible.

Pure functions should:

- Produce the same output for the same input.
- Have no side effects.
- Be easy to test.

Keep side effects isolated.

---

# Low Coupling

Minimize dependencies between modules.

A change in one module should not force unrelated modules to change.

---

# High Cohesion

Keep related functionality together.

Each module should solve one problem well.

---

# Readability

Code is read more often than written.

Optimize for readability.

Use meaningful names.

Avoid unnecessary comments.

---

# Explicit Over Implicit

Prefer explicit behavior.

Avoid hidden side effects.

Avoid magic behavior.

Code should clearly communicate intent.

---

# Refactoring

Continuously improve code quality.

Refactor when:

- Duplication appears.
- Complexity grows.
- Responsibilities become unclear.
- Readability decreases.

Refactor incrementally.

Avoid unnecessary rewrites.

---

# Anti-patterns

Avoid:

- God Objects
- God Services
- Large Utility Classes
- Circular Dependencies
- Tight Coupling
- Deep Nesting
- Long Functions
- Long Parameter Lists
- Hidden Side Effects
- Primitive Obsession
- Shotgun Surgery
- Copy & Paste Programming

---

# Decision Rules

When designing a solution:

1. Start simple.
2. Keep responsibilities focused.
3. Reuse existing code.
4. Prefer composition.
5. Avoid unnecessary abstraction.
6. Design for current requirements.
7. Refactor only when complexity justifies it.

---

# Design Checklist

Before completing a task, verify:

- One responsibility per module.
- No unnecessary duplication.
- Low coupling.
- High cohesion.
- Business logic is isolated.
- Side effects are isolated.
- Abstractions are justified.
- Code is easy to understand.
- Code is easy to extend.
- Code is easy to test.