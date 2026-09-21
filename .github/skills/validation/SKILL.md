---
name: validation
description: Design and implement consistent input validation and runtime data validation across application boundaries.
---

# Validation

## Goal

Ensure all external data is validated before being trusted or processed.

Validation should be:

- Explicit
- Consistent
- Predictable
- Type-safe
- Easy to maintain

## Trust Boundaries

Always validate data coming from:

- User input
- API requests
- URL parameters
- Query parameters
- Forms
- Cookies
- External APIs
- Files
- Environment variables
- Database results when necessary

Never assume external data is valid.

## TypeScript

TypeScript types provide compile-time safety but do not validate runtime data.

Do not rely on TypeScript types alone for external input.

Prefer runtime schemas when data crosses a trust boundary.

## Validation Rules

Validate:

- Required fields
- Data types
- String length
- Numeric ranges
- Formats
- Allowed values
- Relationships between fields

Reject invalid data early.

## Client-Side Validation

Use client-side validation to improve user experience.

Provide:

- Immediate feedback where appropriate
- Clear error messages
- Field-level errors
- Form-level errors when necessary

Client-side validation must not replace server-side validation.

## Server-Side Validation

Always validate requests on the server.

The server must independently verify:

- Input structure
- Data types
- Business constraints
- Authorization-related constraints

Never trust validation performed by the client.

## Schema Validation

Prefer schema-based validation for complex input.

A validation schema should define:

- Expected structure
- Required fields
- Optional fields
- Allowed values
- Transformation rules when necessary

Keep schemas close to the boundary where they are used.

## Error Messages

Validation errors should:

- Clearly identify the problem.
- Be understandable to users.
- Avoid exposing internal implementation details.

Do not expose sensitive information.

## Business Validation

Separate structural validation from business rules.

Example:

```text
Schema validation
→ Is the value valid?

Business validation
→ Is the operation allowed?
```

Keep business rules in the appropriate service or domain layer.

## Data Transformation

Only transform input when necessary.

Avoid silently changing user data in unexpected ways.

Document meaningful transformations.

## Security

Validation should help prevent:

- Injection attacks
- Unexpected data
- Invalid state
- Oversized payloads
- Malicious file uploads

Never treat validation as the only security layer.

## Database Validation

Application validation should complement database constraints.

Use database constraints for critical invariants such as:

- `NOT NULL`
- `UNIQUE`
- `FOREIGN KEY`
- `CHECK`

## Testing

Test:

- Valid input
- Invalid input
- Missing fields
- Boundary values
- Empty values
- Unexpected values
- Malformed input

Include regression tests for important validation bugs.

## Rules

- Validate at system boundaries.
- Never trust client input.
- Do not rely on TypeScript types for runtime validation.
- Keep validation separate from business logic.
- Use consistent validation schemas.
- Return clear and safe validation errors.
- Validate on both client and server when appropriate.