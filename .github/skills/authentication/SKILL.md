---
name: authentication
description: Design and implement secure authentication flows including login, logout, sessions, tokens, OAuth, and identity providers.
---

# Authentication

## Goal

Implement authentication that is:

- Secure
- Reliable
- Predictable
- Easy to maintain

Prefer established authentication standards and providers over custom implementations.

## Authentication vs Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> What is the user allowed to do?

Keep these concerns separate.

## Identity Providers

Prefer established providers and standards such as:

- OAuth 2.0
- OpenID Connect
- Auth0
- Supabase Auth
- NextAuth/Auth.js

Do not implement custom authentication when a suitable provider already exists.

## Login

A login flow should:

1. Authenticate the user.
2. Establish a secure session.
3. Store credentials or tokens securely.
4. Handle authentication failures safely.
5. Redirect or return the user to the intended destination when appropriate.

## Logout

Logout should:

- Invalidate the local session.
- Clear relevant client state.
- Revoke or invalidate tokens when required.
- Prevent continued access to protected resources.

## Sessions

Sessions should:

- Have an appropriate lifetime.
- Expire safely.
- Be invalidated on logout.
- Protect against session fixation.
- Avoid unnecessary client-side exposure.

## Tokens

Treat access tokens and refresh tokens as sensitive credentials.

Never:

- Log tokens.
- Expose tokens unnecessarily.
- Store tokens in insecure locations.
- Include tokens in URLs.

Use the storage mechanism recommended by the authentication provider.

## Token Expiration

Always handle expired tokens.

When appropriate:

1. Detect expiration.
2. Refresh or re-authenticate.
3. Retry the request safely.
4. Log the user out when recovery fails.

Avoid infinite retry loops.

## Protected Resources

Authentication must be verified before accessing protected resources.

Never rely only on frontend route protection.

Backend resources must independently validate authentication.

## Authentication State

Keep authentication state consistent.

Handle:

- Initial loading
- Authenticated state
- Unauthenticated state
- Authentication failure
- Session expiration

Avoid duplicated authentication state.

## Multi-Tab / Multi-Window

When authentication state can change across browser contexts, consider synchronization between tabs or windows.

Avoid assuming that one tab's authentication state represents the entire session.

## Redirects

Validate redirect destinations.

Do not allow user-controlled redirects to arbitrary external URLs.

## Error Handling

Authentication errors should:

- Fail securely.
- Provide useful user feedback.
- Avoid revealing sensitive information.

Do not expose whether a specific credential or account exists unless required.

## Security

Always consider:

- Session fixation
- Token leakage
- CSRF
- XSS
- Open redirects
- Credential exposure
- Incorrect authorization assumptions

Apply least privilege.

## Rules

- Prefer standard authentication protocols.
- Follow the identity provider's recommended flow.
- Never implement custom cryptography.
- Never log credentials or tokens.
- Never trust client-side authentication state alone.
- Keep authentication and authorization separate.
- Handle expiration and logout correctly.