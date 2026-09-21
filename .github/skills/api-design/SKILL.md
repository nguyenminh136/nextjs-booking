---
name: api-design
description: Design consistent, secure, maintainable, and predictable APIs.
---

# API Design

## Goal

Design APIs that are:

- Consistent
- Predictable
- Secure
- Maintainable
- Easy to consume

## Resource Design

Use resource-oriented endpoints.

Prefer:

```text
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

Avoid action-based endpoints when a resource operation is sufficient.

## Request and Response

Keep request and response structures consistent.

Always define:

- Required fields
- Optional fields
- Data types
- Validation rules
- Error responses

Return only the data required by the client.

## HTTP Methods

Use HTTP methods according to their intended semantics:

- GET: Read
- POST: Create
- PUT: Replace
- PATCH: Partial update
- DELETE: Delete

## Status Codes

Use appropriate HTTP status codes.

Common examples:

- `200` — Successful request
- `201` — Resource created
- `204` — Successful request without response body
- `400` — Invalid request
- `401` — Unauthenticated
- `403` — Unauthorized
- `404` — Resource not found
- `409` — Conflict
- `422` — Validation failure
- `500` — Unexpected server error

## Validation

Validate all external input.

Validate:

- Path parameters
- Query parameters
- Request body
- Headers

Never trust client input.

## Error Handling

Use a consistent error structure.

Errors should:

- Be meaningful.
- Be safe to expose.
- Avoid internal implementation details.
- Provide enough information for clients to handle them.

## Pagination

Use pagination for potentially large collections.

Support consistent:

- Page size
- Cursor or page
- Ordering

Avoid returning unbounded datasets.

## Filtering and Sorting

Use query parameters for filtering and sorting.

Example:

```text
/products?category=bread&sort=price
```

Keep query parameter naming consistent.

## Authentication

Protect sensitive endpoints with authentication.

Do not assume that authentication means authorization.

Verify permissions for protected operations.

## Idempotency

Design retryable operations to be idempotent where appropriate.

Especially consider:

- Payments
- Orders
- External integrations
- Resource creation

## Versioning

Avoid breaking existing API contracts.

Use versioning when breaking changes are unavoidable.

## Security

Always consider:

- Authentication
- Authorization
- Input validation
- Rate limiting
- Sensitive data exposure
- Injection attacks

Never expose secrets or internal implementation details.

## Documentation

Document public APIs clearly.

Include:

- Endpoint
- Method
- Parameters
- Request body
- Response
- Errors
- Authentication requirements

## Rules

- Follow existing API conventions.
- Reuse existing response and error patterns.
- Avoid unnecessary endpoints.
- Avoid breaking changes.
- Keep APIs simple and predictable.