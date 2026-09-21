---
description: This file describes the naming conventions for the project.
applyTo: **/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.md, **/*.json, **/*.yml, **/*.yaml
---

# Naming Conventions

## Goal

Use clear, descriptive, and consistent names.

Names should describe intent, not implementation.

Avoid abbreviations unless they are widely accepted.

Examples

Good

- customer
- orderItem
- calculateTotal
- hasPermission

Bad

- obj
- data
- temp
- item1
- val

---

# General Rules

Names should:

- Be descriptive.
- Be concise.
- Use consistent terminology.
- Reflect business meaning.

Avoid:

- Ambiguous names
- Unnecessary abbreviations
- Hungarian notation
- Type prefixes

Bad

userObj

strName

btnSubmit

arrUsers

Good

user

name

submitButton

users

---

# Files

Use kebab-case.

Good

product-card.tsx

order-summary.ts

user-service.ts

date-utils.ts

Bad

ProductCard.tsx

productCard.tsx

Product_Card.tsx

---

# Folders

Use kebab-case.

Good

product-list

shopping-cart

auth

shared

---

# Components

Use PascalCase.

Good

ProductCard

CheckoutForm

ShoppingCart

OrderSummary

Component filenames should match the component name.

Example

ProductCard.tsx

---

# Hooks

Always start with "use".

Use camelCase.

Good

useCart

useAuth

useProducts

useDebounce

Bad

cartHook

getCart

cart

---

# Functions

Use camelCase.

Function names should describe an action.

Prefer verbs.

Good

calculateTotal

formatPrice

findCustomer

createOrder

validateInput

Bad

total

price

customer

orderFunction

---

# Boolean Variables

Prefix with:

- is
- has
- can
- should
- will

Good

isLoading

hasPermission

canEdit

shouldRetry

willRedirect

Bad

loading

permission

retry

redirect

---

# Collections

Use plural names.

Good

products

customers

orderItems

Bad

productList

customerArray

itemsCollection

---

# Single Objects

Use singular names.

Good

product

customer

order

address

---

# Constants

Use UPPER_SNAKE_CASE.

Good

DEFAULT_PAGE_SIZE

MAX_RETRY

API_TIMEOUT

SUPPORTED_LOCALES

Bad

defaultPageSize

ApiTimeout

maxRetry

---

# Enums

Use PascalCase.

Members should describe values.

Good

OrderStatus

PaymentStatus

UserRole

---

# Enum Values

Use PascalCase or UPPER_SNAKE_CASE consistently.

Good

Pending

Completed

Cancelled

or

PENDING

COMPLETED

CANCELLED

Choose one convention and use it consistently.

---

# Types

Use PascalCase.

Good

User

Order

Product

CartItem

ApiResponse

---

# Interfaces

If interfaces are used,
do not prefix with "I".

Bad

IUser

IOrder

Good

User

Order

Repository

---

# Generic Types

Use meaningful names.

Prefer

TItem

TResult

TData

TError

Avoid

T

U

X

Unless the generic is extremely simple.

---

# Variables

Use camelCase.

Choose descriptive names.

Good

totalPrice

discountAmount

selectedProduct

currentUser

Bad

tp

sp

obj

value

data

---

# Temporary Variables

Avoid unnecessary temporary variables.

If needed, choose descriptive names.

Bad

tmp

temp

value2

foo

bar

---

# Callback Parameters

Use meaningful names.

Good

products.map(product => ...)

orders.filter(order => ...)

Bad

products.map(x => ...)

orders.filter(a => ...)

---

# Event Handlers

Prefix with "handle".

Good

handleSubmit

handleClick

handleDelete

handleLogin

---

# Event Callback Props

Prefix with "on".

Good

onClick

onSubmit

onDelete

onClose

---

# Async Functions

Prefer action verbs.

Good

fetchProducts

loadUser

createOrder

updateProfile

deleteCustomer

Avoid

getData

callApi

request

---

# Validation Functions

Prefix with:

is

has

validate

can

Examples

isEmail

validatePassword

canCheckout

hasPermission

---

# Utility Functions

Use descriptive names.

Good

formatCurrency

formatDate

calculateTax

groupByCategory

sortByPrice

Avoid

helper

utils

common

misc

---

# API Endpoints

Use plural nouns.

Good

/products

/orders

/customers

/categories

Avoid

/getProducts

/createOrder

/deleteCustomer

---

# Database

Use snake_case.

Tables

products

orders

customers

order_items

Columns

created_at

updated_at

deleted_at

product_name

customer_id

---

# Environment Variables

Use UPPER_SNAKE_CASE.

Good

DATABASE_URL

JWT_SECRET

API_BASE_URL

SUPABASE_URL

---

# CSS Classes

Use semantic names.

Avoid implementation details.

Good

product-card

checkout-form

navigation-menu

Avoid

red-box

left-panel

big-button

---

# Test Files

Match the source filename.

Examples

product.service.test.ts

cart.test.ts

checkout.spec.ts

---

# Avoid

Avoid names like

data

response

result

object

value

temp

item

list

manager

helper

common

utils

unless the context is extremely obvious.

---

# Consistency

If a concept has a name,

use it everywhere.

Example

Always use

customer

Do not mix

customer

user

client

buyer

for the same concept.

Maintain a single ubiquitous language across the project.

---

# Naming Checklist

Before completing a task, verify:

- Names describe intent.
- No unnecessary abbreviations.
- Booleans use is/has/can/should.
- Collections are plural.
- Objects are singular.
- Functions use verbs.
- Components use PascalCase.
- Files use kebab-case.
- Constants use UPPER_SNAKE_CASE.
- Database uses snake_case.
- Terminology is consistent across the project.