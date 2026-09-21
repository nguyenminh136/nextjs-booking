---
name: security-review
description: Guide security reviews to identify vulnerabilities, insecure configurations, data exposure, and weaknesses in application security controls.
---

# Security Review

## Goal

Identify and reduce security risks before code is deployed.

Focus on realistic attack scenarios and practical mitigations.

## Review Order

Review in this order:

1. Authentication
2. Authorization
3. Input validation
4. Data protection
5. Injection risks
6. Session and token security
7. Configuration and secrets
8. Dependencies
9. Logging and error handling

Prioritize issues based on impact and likelihood.

## Authentication

Verify:

- Authentication is required where appropriate.
- Identity is properly verified.
- Sessions are handled securely.
- Logout invalidates access appropriately.
- Token expiration is handled.

Do not rely only on client-side authentication state.

## Authorization

Verify permissions for every protected operation.

Check for:

- Missing authorization
- Privilege escalation
- Insecure direct object references
- Resource ownership violations

Never assume that an authenticated user is authorized.

## Input Validation

Verify all external input is validated.

Check:

- Request body
- Query parameters
- Route parameters
- Headers
- Cookies
- File uploads
- External API responses

Do not trust client-side validation.

## Injection

Look for:

- SQL injection
- NoSQL injection
- Command injection
- XSS
- Template injection
- Path traversal

Prefer parameterized queries and safe APIs.

## Data Protection

Check for:

- Sensitive data exposure
- Unencrypted sensitive data
- Sensitive information in URLs
- Sensitive information in logs
- Excessive API responses

Only expose data that is required.

## Session and Tokens

Verify:

- Tokens are stored securely.
- Tokens are not logged.
- Sessions expire appropriately.
- Cookies use appropriate security attributes.
- Logout clears or invalidates relevant credentials.

Never place sensitive tokens in URLs.

## CSRF

For cookie-based authentication, verify appropriate CSRF protection is in place.

Consider:

- SameSite cookies
- CSRF tokens
- Origin checks

## CORS

Verify that CORS configuration:

- Allows only required origins.
- Does not use overly permissive settings.
- Handles credentials correctly.

Avoid unrestricted origins for authenticated applications.

## Secrets

Search for accidentally exposed:

- API keys
- Passwords
- Tokens
- Private keys
- Connection strings

Secrets must not be committed to source control.

## File Uploads

Check:

- File size limits
- Allowed file types
- File name handling
- Storage location
- Executable file risks

Never trust client-provided file metadata.

## Dependencies

Check for:

- Known vulnerabilities
- Unmaintained packages
- Unnecessary dependencies

Prefer maintained and trusted dependencies.

## Error Handling

Verify errors do not expose:

- Stack traces
- Database details
- Internal paths
- Credentials
- Tokens
- Sensitive business data

Return safe errors to clients.

## Logging

Security-related events should be logged when appropriate.

Never log:

- Passwords
- Access tokens
- Refresh tokens
- API keys
- Secrets

Avoid unnecessary personal data in logs.

## Security Headers

For web applications, consider appropriate headers such as:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Frame protection

Use settings appropriate to the application.

## Severity

Classify findings as:

```text
Critical
High
Medium
Low
Informational
```

Prioritize issues based on realistic impact.

## Findings

Each finding should include:

```text
Severity:
Location:
Vulnerability:
Impact:
Recommendation:
```

Explain how the vulnerability could realistically be exploited when relevant.

## Avoid

Do not:

- Report purely theoretical issues without meaningful risk.
- Recommend unnecessary security mechanisms.
- Expose sensitive information in the review.
- Modify code without understanding the vulnerability.
- Treat security tooling output as proof without verification.

## Review Output

Use this structure:

```text
## Summary

Brief security assessment.

## Findings

### [Severity] Vulnerability

Location:
Problem:
Impact:
Recommendation:

## Positive Findings

List important security controls already implemented.

## Recommendation

Approve
Approve with minor changes
Request changes
```

## Rules

- Assume external input is untrusted.
- Verify authentication and authorization independently.
- Protect sensitive data.
- Never expose secrets.
- Prioritize realistic security risks.
- Recommend practical mitigations.
- Follow secure-by-default principles.