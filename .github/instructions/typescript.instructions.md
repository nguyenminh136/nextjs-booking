---
description: This file describes the TypeScript code style for the project.
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

# TypeScript Guidelines

## Goal

Write type-safe, maintainable, and predictable TypeScript.

Leverage the type system to catch errors at compile time instead of runtime.

Prefer explicit types over implicit assumptions.

---

# Compiler

Always enable:

- strict
- noImplicitAny
- strictNullChecks
- noUncheckedIndexedAccess
- exactOptionalPropertyTypes

Do not disable TypeScript checks to make code compile.

---

# General Rules

Always:

- Use strict typing.
- Prefer compile-time safety.
- Let TypeScript infer obvious types.
- Add explicit types for public APIs.
- Keep types small and reusable.

Never:

- Use `// @ts-ignore` unless absolutely necessary.
- Disable strict mode.
- Use `any` without justification.
- Cast values to bypass type safety.

---

# Type vs Interface

Prefer:

- `type` for most use cases.
- `interface` only when declaration merging or class implementation is required.

Example

Good

```ts
type User = {
  id: string;
  name: string;
};
```

Acceptable

```ts
interface Repository {
  findById(id: string): Promise<User>;
}
```

---

# Any

Avoid `any`.

Prefer:

- unknown
- generic types
- union types
- discriminated unions

Bad

```ts
function parse(data: any) {}
```

Good

```ts
function parse(data: unknown) {}
```

---

# Unknown

Use `unknown` for external or untrusted data.

Validate before use.

Never assume the structure of unknown values.

---

# Type Assertions

Avoid unnecessary assertions.

Bad

```ts
const user = response as User;
```

Prefer runtime validation before casting.

Use assertions only when the type is guaranteed.

---

# Type Inference

Allow TypeScript to infer obvious local variables.

Good

```ts
const total = price * quantity;
```

Avoid redundant annotations.

Bad

```ts
const total: number = price * quantity;
```

Public APIs should use explicit types.

---

# Null and Undefined

Handle nullable values explicitly.

Prefer:

- optional chaining
- nullish coalescing
- type narrowing

Avoid non-null assertions (`!`) unless unavoidable.

Bad

```ts
user!.name
```

Good

```ts
if (!user) return;

return user.name;
```

---

# Optional Properties

Use optional properties only when values may truly be absent.

Avoid making everything optional.

Prefer required properties by default.

---

# Union Types

Prefer unions over boolean flags.

Bad

```ts
type Status = {
  loading: boolean;
};
```

Good

```ts
type Status =
  | { state: "loading" }
  | { state: "success"; data: User }
  | { state: "error"; message: string };
```

---

# Discriminated Unions

Prefer discriminated unions for state machines.

This improves type narrowing and prevents impossible states.

---

# Enums

Prefer string literal unions.

Good

```ts
type OrderStatus =
  | "pending"
  | "paid"
  | "completed";
```

Use enum only when interoperability requires it.

---

# Readonly

Prefer immutable objects.

Use readonly whenever mutation is not intended.

Example

```ts
type User = {
  readonly id: string;
  readonly name: string;
};
```

---

# Functions

Keep functions:

- Small
- Pure
- Predictable

Always type:

- Parameters
- Return values for exported functions

Example

```ts
export function calculateTotal(
  price: number,
  quantity: number,
): number {
  return price * quantity;
}
```

---

# Parameters

Avoid long parameter lists.

Prefer objects when more than three parameters exist.

Bad

```ts
createUser(name, email, phone, role)
```

Good

```ts
createUser({
  name,
  email,
  phone,
  role,
})
```

---

# Generics

Use generics when behavior is independent of a specific type.

Keep generic constraints simple.

Prefer meaningful generic names.

Good

```ts
function first<T>(items: T[]): T | undefined
```

Avoid unnecessary generics.

---

# Utility Types

Prefer built-in utility types.

Use:

- Partial
- Required
- Pick
- Omit
- Record
- Readonly
- NonNullable
- ReturnType
- Parameters

Avoid redefining existing utilities.

---

# Type Guards

Use custom type guards to narrow unknown values.

Example

```ts
function isUser(value: unknown): value is User
```

Prefer runtime validation over unsafe casting.

---

# Constants

Avoid magic values.

Extract reusable values into named constants.

Bad

```ts
if (status === 3)
```

Good

```ts
const MAX_RETRY = 3;
```

---

# Arrays

Prefer readonly arrays when mutation is unnecessary.

Good

```ts
readonly User[]
```

or

```ts
ReadonlyArray<User>
```

---

# Async

Always return Promise<T> explicitly for exported async functions.

Handle rejected promises.

Avoid floating promises.

---

# Error Types

Throw Error or subclasses of Error.

Do not throw strings.

Bad

```ts
throw "Invalid"
```

Good

```ts
throw new Error("Invalid")
```

---

# Imports

Prefer named exports.

Avoid default exports unless required by the framework.

Group imports consistently:

1. Standard library
2. Third-party
3. Internal modules
4. Relative imports

Remove unused imports.

---

# Naming

Use descriptive names.

Prefer:

isLoading

hasPermission

calculateTotal

findById

Avoid:

data

obj

item1

temp

foo

bar

---

# Comments

Avoid comments that repeat the code.

Comment:

- Complex algorithms
- Business rules
- Design decisions

Explain why, not what.

---

# Code Smells

Avoid:

- any
- excessive casting
- nested ternaries
- duplicated types
- giant interfaces
- giant union types
- mutable shared state
- implicit any
- unsafe indexing

---

# Checklist

Before completing a task, verify:

- No unnecessary any.
- Public APIs are typed.
- Unknown values are validated.
- Functions are small.
- Types are reusable.
- No duplicated types.
- Null is handled safely.
- Generic usage is justified.
- Utility types are used where appropriate.
- Code compiles without TypeScript errors.