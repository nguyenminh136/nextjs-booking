---
name: code-review
description: Guide systematic code reviews focused on correctness, maintainability, security, performance, testing, and project consistency.
---

# Code Review

## Goal

Identify real problems and provide actionable feedback before code is merged.

Review code objectively and focus on impact rather than personal preferences.

## Review Order

Review in this order:

1. Correctness
2. Security
3. Architecture
4. Maintainability
5. Performance
6. Testing
7. Consistency

Fix high-impact issues before minor improvements.

## Correctness

Check:

- Requirements are satisfied.
- Business logic is correct.
- Edge cases are handled.
- Error handling is appropriate.
- State remains consistent.
- Existing functionality is not unintentionally broken.

## Architecture

Review:

- Separation of concerns
- Module boundaries
- Dependency direction
- Coupling
- Cohesion
- Reusability

Avoid recommending architectural changes without a clear benefit.

## Maintainability

Look for:

- Duplicate logic
- Large functions
- Large components
- Mixed responsibilities
- Hidden side effects
- Unclear abstractions
- Dead code

Prefer simple and explicit solutions.

## Security

Check for:

- Missing input validation
- Missing authorization
- Authentication issues
- Injection vulnerabilities
- Sensitive data exposure
- Secret leakage
- Unsafe configuration

Prioritize security issues based on actual risk.

## Performance

Check for:

- Unnecessary computation
- Duplicate requests
- Inefficient queries
- Excessive rendering
- Memory leaks
- Unnecessary data processing

Do not recommend optimization without a reasonable performance concern.

## Testing

Check whether important behavior is covered.

Consider:

- Happy paths
- Error paths
- Edge cases
- Regression risks

Recommend tests based on risk rather than coverage numbers alone.

## Consistency

Verify consistency with:

- Existing architecture
- Coding conventions
- Naming conventions
- Folder structure
- Existing patterns

Prefer established project patterns unless there is a clear reason to change them.

## Findings

Each finding should include:

- Severity
- Location
- Problem
- Impact
- Recommendation

Use these severity levels:

```text
Critical
High
Medium
Low
Suggestion
```

Only report actionable findings.

## Avoid

Do not:

- Nitpick without meaningful value.
- Rewrite code based on personal preference.
- Suggest unnecessary abstractions.
- Review unrelated code.
- Report hypothetical issues without reasonable evidence.

## Review Output

Use this structure:

```text
## Summary

Brief overall assessment.

## Findings

### [Severity] Issue

Location:
Problem:
Impact:
Recommendation:

## Strengths

List important things done well.

## Recommendation

Approve
Approve with minor changes
Request changes
```

## Rules

- Focus on real problems.
- Prioritize high-impact issues.
- Be specific and actionable.
- Explain why an issue matters.
- Respect existing project conventions.
- Do not over-engineer recommendations.