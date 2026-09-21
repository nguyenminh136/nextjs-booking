---
name: debugging
description: Provide a systematic workflow for investigating, reproducing, diagnosing, and fixing software defects.
---

# Debugging

## Goal

Find and fix the root cause of a problem without introducing regressions.

Do not guess when evidence can be collected.

## Workflow

Follow this order:

1. Understand the reported problem.
2. Reproduce the issue.
3. Collect relevant evidence.
4. Identify the affected code path.
5. Form hypotheses.
6. Verify each hypothesis.
7. Identify the root cause.
8. Implement the smallest appropriate fix.
9. Test the fix.
10. Check for regressions.

## Reproduction

Before changing code, determine:

- What triggers the problem?
- What are the expected and actual results?
- Is the problem deterministic?
- Does it happen in specific environments?
- Can it be reproduced with minimal steps?

Create a minimal reproduction when practical.

## Evidence

Use available evidence such as:

- Error messages
- Stack traces
- Logs
- Network requests
- Application state
- Database state
- Configuration
- Recent code changes

Prefer evidence over assumptions.

## Root Cause

Distinguish between:

```text
Symptom
↓
Immediate cause
↓
Root cause
```

Fix the root cause rather than hiding the symptom.

## Hypothesis

For each hypothesis:

1. State what might be causing the issue.
2. Identify evidence supporting it.
3. Identify evidence against it.
4. Perform a test to confirm or reject it.

Do not modify multiple unrelated areas at once.

## Existing Code

Before creating a fix:

- Search for similar logic.
- Understand existing patterns.
- Check whether the issue is caused by shared code.
- Identify other consumers that may be affected.

## Fix

Prefer:

- Small changes
- Root-cause fixes
- Existing abstractions
- Minimal side effects

Avoid:

- Unnecessary rewrites
- Workarounds without understanding the cause
- Disabling validation or error handling
- Unrelated refactoring

## Regression

After fixing:

- Reproduce the original scenario.
- Run relevant tests.
- Test important edge cases.
- Check affected related functionality.

Add a regression test for important bugs.

## Async and Timing Issues

For asynchronous problems, investigate:

- Race conditions
- Event ordering
- Missing `await`
- Stale state
- Cleanup
- Timeouts
- Retries
- Concurrent requests

Avoid arbitrary delays as a fix.

## Network Issues

Check:

- Request URL
- HTTP method
- Headers
- Authentication
- Request payload
- Response status
- CORS
- Timeout
- Retry behavior

Determine whether the failure originates from the client, server, network, or external service.

## Database Issues

Check:

- Query
- Parameters
- Schema
- Constraints
- Indexes
- Transactions
- Connection state
- Actual database data

Do not assume the database is correct.

## Production Issues

When debugging production problems:

- Assess impact first.
- Collect evidence safely.
- Avoid risky changes.
- Prefer reversible fixes.
- Preserve relevant logs and metrics.

Do not expose sensitive production data.

## Communication

When reporting a debugging result, provide:

- Problem
- Root cause
- Evidence
- Fix
- Validation
- Potential regression risks

Keep the explanation concise and evidence-based.

## Rules

- Reproduce before fixing when possible.
- Use evidence instead of guessing.
- Find the root cause.
- Make the smallest appropriate change.
- Avoid unrelated refactoring.
- Verify the fix.
- Check for regressions.