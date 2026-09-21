---
name: database-design
description: Design reliable, consistent, maintainable, and performant relational database schemas.
---

# Database Design

## Goal

Design databases that are:

- Correct
- Consistent
- Maintainable
- Performant
- Scalable

Prefer simple designs over unnecessary complexity.

## Schema Design

Identify:

- Entities
- Attributes
- Relationships
- Constraints
- Access patterns

Each table should represent one clear concept.

## Normalization

Normalize data by default.

Avoid unnecessary duplication.

Denormalize only when there is a clear performance or business requirement.

## Primary Keys

Every table should have a primary key.

Prefer stable identifiers that do not contain business meaning.

Avoid mutable values as primary keys.

## Relationships

Use foreign keys to represent relationships.

Define appropriate cardinality:

- One-to-one
- One-to-many
- Many-to-many

Use join tables for many-to-many relationships.

## Constraints

Use database constraints to protect data integrity.

Consider:

- `NOT NULL`
- `UNIQUE`
- `CHECK`
- `FOREIGN KEY`

Do not rely exclusively on application-level validation.

## Naming

Use consistent naming conventions.

Prefer:

```text
users
orders
order_items

user_id
created_at
updated_at
```

Avoid inconsistent abbreviations.

## Indexes

Create indexes based on actual query patterns.

Consider indexes for:

- Foreign keys
- Frequently filtered columns
- Frequently sorted columns
- Frequently joined columns
- Unique constraints

Avoid unnecessary indexes because they increase storage and write costs.

## Queries

Design schemas around expected access patterns.

Avoid:

- N+1 queries
- Unbounded queries
- Unnecessary joins
- Retrieving unused columns

Use pagination for large datasets.

## Transactions

Use transactions when multiple operations must succeed or fail together.

Keep transactions short and focused.

## Data Integrity

Protect consistency using:

- Constraints
- Foreign keys
- Transactions
- Appropriate data types

Prefer enforcing critical invariants at the database level.

## Migrations

Every schema change must use a migration.

Migrations should be:

- Small
- Predictable
- Versioned
- Safe to deploy

Never modify an already-applied migration.

## Deletes

Define delete behavior explicitly.

Consider whether relationships require:

- Restrict
- Cascade
- Set null
- Soft delete

Do not use cascade deletion without understanding its impact.

## Audit Fields

Use audit fields where appropriate:

```text
created_at
updated_at
created_by
updated_by
deleted_at
```

Keep their behavior consistent.

## Security

Protect sensitive data.

Never store:

- Plain-text passwords
- Secrets
- Access tokens

Use appropriate database permissions and least privilege.

## Performance

Optimize based on actual usage.

Consider:

- Query plans
- Index usage
- Table size
- Connection usage
- Pagination

Avoid premature optimization.

## Rules

- Prefer normalized relational models.
- Use constraints to protect data integrity.
- Design indexes from query patterns.
- Keep migrations safe and versioned.
- Avoid unnecessary denormalization.
- Avoid unnecessary tables and relationships.
- Follow existing project conventions.