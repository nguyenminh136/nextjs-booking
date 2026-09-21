---
description: This file describes the folder structure guidelines for the project.
applyTo: **/*
---

# Folder Structure Guidelines

## Goal

Organize code to be:

- Easy to navigate
- Easy to maintain
- Easy to scale
- Easy to test

Group code by feature instead of technical layer whenever practical.

---

# General Principles

Organize related code together.

Prefer:

- High cohesion
- Low coupling

Avoid creating folders with unrelated responsibilities.

---

# Feature First

Prefer feature-based organization.

Good

```
src/
    features/
        authentication/
        products/
        orders/
        checkout/
```

Avoid

```
src/
    components/
    hooks/
    services/
    utils/
```

where files from different features are mixed together.

---

# Feature Ownership

A feature should contain everything required for that feature.

Typical contents:

- UI
- Business logic
- Validation
- Types
- Constants
- Tests

A feature should be understandable without reading unrelated features.

---

# Shared Code

Move code into shared only when it is used by multiple features.

Examples:

- Button
- Modal
- Table
- Date utilities
- API client

Do not move code into shared simply because it "might be reused".

---

# Common Folder

The common folder should contain cross-cutting concerns.

Examples:

- Error handling
- Logging
- Configuration
- Authentication
- Middleware

Do not place business logic in common.

---

# Utilities

Utility functions should:

- Be framework independent.
- Be stateless.
- Be reusable.

Avoid creating a large miscellaneous utils folder.

Group utilities by purpose.

Good

```
utils/
    date/
    number/
    string/
```

Avoid

```
utils/
    helper.ts
    common.ts
    misc.ts
```

---

# Components

Keep components close to where they are used.

If a component is used by only one feature,
keep it inside that feature.

Move components into shared only after they are reused.

---

# Hooks

Keep hooks close to the feature that owns them.

Move hooks into shared only when they are truly generic.

---

# Types

Keep types close to where they are used.

Shared types should represent common contracts,
not feature-specific models.

Avoid creating one global types folder for everything.

---

# Constants

Keep constants near the feature that owns them.

Shared constants should be stable and reusable.

Avoid large constants files.

---

# Validation

Validation logic belongs with the feature.

Keep schemas close to:

- DTOs
- Forms
- API contracts

Do not scatter validation across the project.

---

# Services

A service should have one responsibility.

Avoid service files containing unrelated operations.

Split large services into smaller modules.

---

# Configuration

Centralize configuration.

Separate configuration from implementation.

Never hardcode environment-specific values.

---

# Assets

Organize assets by type.

Examples

```
assets/
    icons/
    images/
    fonts/
```

Avoid placing assets randomly throughout the project unless they belong to a specific feature.

---

# Tests

Keep tests close to the code they test whenever possible.

Examples

```
product/

    product.service.ts

    product.service.test.ts
```

Avoid one large global test folder.

---

# File Size

Prefer:

- Small files
- Focused files

Split files when they become difficult to understand.

Avoid files with multiple unrelated responsibilities.

---

# Module Boundaries

Each module should expose only its public API.

Do not import internal implementation directly from another module.

Consume modules through their public entry point.

---

# Dependencies

A feature may depend on:

- Shared
- Common

A feature should not depend on another feature's internal files.

Avoid circular dependencies.

---

# Public vs Private

Keep implementation details private.

Only export what other modules need.

Avoid unnecessary exports.

---

# Co-location

Keep related files together.

Example

```
product/

    product.ts

    product.types.ts

    product.constants.ts

    product.validation.ts

    product.service.ts

    product.test.ts
```

Avoid scattering related files across distant folders.

---

# Folder Naming

Use:

- kebab-case
- singular or plural consistently
- descriptive names

Avoid:

- misc
- temp
- new
- old
- helper
- common2

---

# Refactoring

Refactor folder structures when:

- Navigation becomes difficult.
- Responsibilities become mixed.
- Duplication appears.
- Features become tightly coupled.

Refactor incrementally.

---

# Checklist

Before creating a new folder or file, verify:

- Does it belong to an existing feature?
- Can existing code be reused?
- Is the responsibility clear?
- Is shared code truly shared?
- Are related files co-located?
- Is the folder name descriptive?
- Does the structure minimize coupling?
- Is the module easy to understand?