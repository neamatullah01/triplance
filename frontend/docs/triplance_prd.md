# Triplance - Product Requirements Document (PRD)

## Project Overview

**Name:** Triplance Backend & Frontend  
**Type:** Full-Stack Travel Social & Booking Platform  
**Tech Stack:** Next.js, Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL

---

## Visual Documentation

### JWT Authentication Flow
![JWT Auth DFD](./dfd-jwt-auth.svg)

### Business Logic Flow
![Business Logic DFD](./dfd-business-logic.svg)

---

## 1. Core Functionality

### 1.1 User Management
- **Registration**: Travelers register with email/password; Agencies go through an approval flow
- **Authentication**: JWT-based auth with access & refresh tokens
- **Roles**: `admin`, `traveler`, `agency`
- **Profile**: Name, email, profile image, rating, bio, travel history

### 1.2 Social Feed System
- **Feed**: Dynamic feed of travel stories, promotional posts, and package highlights
- **Posts**: Travelers and agencies can create posts with images, captions, and tags
- **Interactions**: Like and comment on posts from other users and agencies
- **Follow System**: Travelers can follow other travelers or agencies to curate their feed

### 1.3 Package Management
- **CRUD Operations**: Agencies create, read, update, and delete travel packages
- **Properties**: title, description, price, maxCapacity, availableDates, amenities, itinerary, images, destination
- **Discovery**: Travelers can browse and filter packages

### 1.4 Booking System
- **Create Booking**: Traveler selects a package, picks an available date/slot, and books
- **Booking Status**: `pending` / `confirmed` / `cancelled` / `completed`
- **Capacity Check**: Booking is rejected if the package has no available slots

### 1.5 Payment Integration
- **Gateway**: Stripe or SSLCommerz for secure checkout
- **Payment Status**: `unpaid` / `paid` / `refunded`
- **Receipts**: Travelers can view payment receipts in their profile
- **Revenue Tracking**: Agencies can track total payments received per package

### 1.6 Review System
- **Post-Trip Review**: Travelers can rate and review an agency and a specific package after a trip is `completed`
- **Rating Properties**: numeric rating (1–5), written review text
- **Agency Rating**: Average rating is computed and displayed on the agency public profile

### 1.7 Admin Controls
- **Dashboard**: High-level metrics — total bookings, active users, revenue, new agencies
- **Agency Approval**: Admin must approve new agency registrations before they go live
- **User Management**: Ban or suspend travelers or agencies for policy violations
- **Content Moderation**: Remove inappropriate posts or fraudulent reviews
- **Dispute Resolution**: Handle refund requests and traveler–agency conflicts

---

## 2. 📘 Product Data Model (PRD Style)

### 1️⃣ User

**Description**  
A user represents any person using the Triplance platform. A user can be an **Admin**, **Traveler**, or **Agency**.

**Attributes**
- ID (unique identifier)
- Name
- Email (unique)
- Password (hashed; optional for social login)
- Role (`admin` / `traveler` / `agency`)
- Profile image (optional)
- Bio (optional)
- Rating (average rating, default 0)
- isVerified (boolean — relevant for agency approval)
- isBanned (boolean)
- Created date
- Last updated date

**Relationships**
- A user (traveler) can create **multiple bookings**
- A user (traveler/agency) can create **multiple posts**
- A user (traveler) can write **multiple reviews**
- A user (agency) can manage **multiple packages**
- A user can **follow** many other users
- A user can be **followed by** many other users

---

### 2️⃣ Package

**Description**  
A package represents a travel product offered by an agency.

**Attributes**
- ID (unique identifier)
- Title
- Description
- Price (per person)
- Max capacity (total slots)
- Available dates (array of date ranges or specific dates)
- Amenities (list of included services)
- Itinerary (day-by-day plan)
- Images (array of image URLs)
- Destination
- Rating (average rating, default 0)
- isActive (boolean — soft delete / deactivate)
- Created date
- Last updated date

**Relationships**
- A package belongs to **one agency (user)**
- A package can have **multiple bookings**
- A package can have **multiple reviews**

---

### 3️⃣ Post

**Description**  
A post is a social content piece shared by a traveler or agency on the main feed.

**Attributes**
- ID (unique identifier)
- Content / Caption
- Images (array of image URLs)
- Tags (optional)
- Created date
- Last updated date

**Relationships**
- A post belongs to **one user** (traveler or agency)
- A post can have **multiple likes**
- A post can have **multiple comments**

---

### 4️⃣ Comment

**Description**  
A comment is a text response left by a user under a post.

**Attributes**
- ID (unique identifier)
- Text content
- Created date
- Last updated date

**Relationships**
- A comment belongs to **one post**
- A comment is written by **one user**

---

### 5️⃣ Like

**Description**  
A like represents a user's appreciation for a post.

**Attributes**
- ID (unique identifier)
- Created date

**Relationships**
- A like belongs to **one post**
- A like is given by **one user**
- A user can only like a post **once** (unique constraint on userId + postId)

---

### 6️⃣ Follow

**Description**  
A follow represents a directional connection between two users.

**Attributes**
- ID (unique identifier)
- Created date

**Relationships**
- A follow has a **follower** (the user who follows)
- A follow has a **following** (the user being followed)

---

### 7️⃣ Booking

**Description**  
A booking represents a traveler's reservation for a specific travel package.

**Attributes**
- ID (unique identifier)
- Booking status (`pending` / `confirmed` / `cancelled` / `completed`)
- Selected date / slot
- Number of travelers (seats booked)
- Total price (calculated at time of booking)
- Created date
- Last updated date

**Relationships**
- A booking belongs to **one traveler (user)**
- A booking is for **one package**
- A booking has **one payment record**

---

### 8️⃣ Payment

**Description**  
A payment record tracks the financial transaction for a booking.

**Attributes**
- ID (unique identifier)
- Amount
- Currency
- Payment status (`unpaid` / `paid` / `refunded`)
- Payment gateway (`stripe` / `sslcommerz`)
- Transaction ID (from gateway)
- Receipt URL (optional)
- Created date
- Last updated date

**Relationships**
- A payment belongs to **one booking**
- A payment is associated with **one traveler (user)**

---

### 9️⃣ Review

**Description**  
A review is a rating and written feedback left by a traveler after completing a trip.

**Attributes**
- ID (unique identifier)
- Rating (1–5)
- Comment / Review text
- Created date
- Last updated date

**Relationships**
- A review belongs to **one package**
- A review belongs to **one agency (user)**
- A review is written by **one traveler (user)**
- A review is linked to **one booking** (to prevent duplicate reviews)

---

## 🔗 Relationship Summary

- One **User (Traveler)** → can create many **Bookings**
- One **User (Traveler)** → can create many **Posts**
- One **User (Traveler)** → can write many **Reviews**
- One **User (Agency)** → can manage many **Packages**
- One **User (Agency)** → can create many **Posts**
- One **User** → can follow many **Users**
- One **Package** → can have many **Bookings**
- One **Package** → can have many **Reviews**
- One **Booking** → belongs to one **Traveler** and one **Package**
- One **Booking** → has one **Payment**
- One **Post** → can have many **Likes** and many **Comments**
- One **Review** → belongs to one **Booking** (one review per trip)

---

## 🧠 Business Rules

- Only **approved agencies** can create and list packages
- Only **travelers** can book packages and write reviews
- A traveler can only review a package after their booking status is **Completed**
- A traveler can only review a package **once per booking**
- Booking is rejected if the package has **no remaining slots** on the selected date
- When a booking is created, slot count is **decremented** from the package
- When a booking is cancelled, slot count is **restored**
- Payment must be **paid** before a booking status moves to **confirmed**
- Agency ratings are recalculated as **average of all reviews** upon each new review
- Admin can **ban** any user — banned users cannot log in or perform actions
- Admin must **approve** a new agency before their profile and packages go live

---

## 3. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new traveler or agency |
| POST | `/api/v1/auth/login` | Login with email/password |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/:id` | Get user profile by ID | Public |
| PATCH | `/api/v1/users/:id` | Update user profile | Owner / Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |
| PATCH | `/api/v1/users/:id/ban` | Ban or unban a user | Admin |
| PATCH | `/api/v1/users/:id/approve` | Approve agency registration | Admin |

### Posts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/posts` | Create a new post | Traveler / Agency |
| GET | `/api/v1/posts` | Get all posts (feed) | Public |
| GET | `/api/v1/posts/:id` | Get post by ID | Public |
| PATCH | `/api/v1/posts/:id` | Update post | Owner |
| DELETE | `/api/v1/posts/:id` | Delete post | Owner / Admin |

### Comments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/posts/:postId/comments` | Add comment to a post | Traveler / Agency |
| GET | `/api/v1/posts/:postId/comments` | Get all comments for a post | Public |
| DELETE | `/api/v1/comments/:id` | Delete comment | Owner / Admin |

### Likes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/posts/:postId/likes` | Like a post | Traveler / Agency |
| DELETE | `/api/v1/posts/:postId/likes` | Unlike a post | Traveler / Agency |

### Follows
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/users/:id/follow` | Follow a user or agency | Traveler |
| DELETE | `/api/v1/users/:id/follow` | Unfollow a user or agency | Traveler |
| GET | `/api/v1/users/:id/followers` | Get followers list | Public |
| GET | `/api/v1/users/:id/following` | Get following list | Public |

### Packages
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/packages` | Create a new package | Agency |
| GET | `/api/v1/packages` | Get all packages (with filters) | Public |
| GET | `/api/v1/packages/:id` | Get package by ID | Public |
| PATCH | `/api/v1/packages/:id` | Update package | Agency (owner) |
| DELETE | `/api/v1/packages/:id` | Delete package | Agency (owner) / Admin |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/bookings` | Create a booking | Traveler |
| GET | `/api/v1/bookings` | Get all bookings | Admin |
| GET | `/api/v1/bookings/my` | Get my bookings | Traveler |
| GET | `/api/v1/bookings/:id` | Get booking by ID | Owner / Agency / Admin |
| PATCH | `/api/v1/bookings/:id/status` | Update booking status | Agency / Admin |
| DELETE | `/api/v1/bookings/:id` | Cancel booking | Traveler / Admin |

### Payments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/payments/initiate` | Initiate payment for a booking | Traveler |
| POST | `/api/v1/payments/webhook` | Handle gateway webhook | System |
| GET | `/api/v1/payments/my` | Get my payment receipts | Traveler |
| GET | `/api/v1/payments` | Get all payments | Admin |
| POST | `/api/v1/payments/:id/refund` | Request or process refund | Admin |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/reviews` | Submit a review | Traveler |
| GET | `/api/v1/reviews` | Get all reviews | Admin |
| GET | `/api/v1/packages/:id/reviews` | Get reviews for a package | Public |
| DELETE | `/api/v1/reviews/:id` | Delete review | Owner / Admin |

### Admin Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/admin/stats` | Get platform overview metrics | Admin |

---

## 4. Project Structure

```
src/
├── config/index.ts                    # Environment config
├── lib/prisma.ts                      # Prisma client instance
├── errors/
│   ├── AppError.ts                    # Custom error class
│   ├── handlePrismaError.ts           # Prisma error handler
│   ├── handlePrismaValidationError.ts
│   └── handleZodError.ts              # Zod validation errors
├── interface/
│   └── error.ts                       # Error type definitions
├── middlewares/
│   ├── auth.ts                        # JWT auth middleware
│   ├── globalErrorHandler.ts          # Global error handler
│   ├── notFound.ts                    # 404 handler
│   └── validateRequest.ts             # Zod validation middleware
├── modules/
│   ├── Auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   ├── auth.service.ts
│   │   ├── auth.utils.ts              # JWT helpers
│   │   └── auth.validation.ts
│   ├── User/
│   │   ├── user.constant.ts
│   │   ├── user.controller.ts
│   │   ├── user.route.ts
│   │   ├── user.service.ts
│   │   ├── user.utils.ts
│   │   └── user.validation.ts
│   ├── Post/
│   │   ├── post.controller.ts
│   │   ├── post.route.ts
│   │   ├── post.service.ts
│   │   └── post.validation.ts
│   ├── Comment/
│   │   ├── comment.controller.ts
│   │   ├── comment.route.ts
│   │   ├── comment.service.ts
│   │   └── comment.validation.ts
│   ├── Like/
│   │   ├── like.controller.ts
│   │   ├── like.route.ts
│   │   └── like.service.ts
│   ├── Follow/
│   │   ├── follow.controller.ts
│   │   ├── follow.route.ts
│   │   └── follow.service.ts
│   ├── Package/
│   │   ├── package.constant.ts
│   │   ├── package.controller.ts
│   │   ├── package.interface.ts
│   │   ├── package.route.ts
│   │   ├── package.service.ts
│   │   └── package.validation.ts
│   ├── Booking/
│   │   ├── booking.controller.ts
│   │   ├── booking.route.ts
│   │   ├── booking.service.ts
│   │   └── booking.validation.ts
│   ├── Payment/
│   │   ├── payment.controller.ts
│   │   ├── payment.route.ts
│   │   ├── payment.service.ts
│   │   ├── payment.utils.ts           # Gateway helpers (Stripe / SSLCommerz)
│   │   └── payment.validation.ts
│   ├── Review/
│   │   ├── review.controller.ts
│   │   ├── review.route.ts
│   │   ├── review.service.ts
│   │   └── review.validation.ts
│   └── Admin/
│       ├── admin.controller.ts
│       ├── admin.route.ts
│       └── admin.service.ts
├── routes/index.ts                    # Route aggregator
├── utils/
│   ├── catchAsync.ts                  # Async error wrapper
│   ├── sendResponse.ts                # Response formatter
│   └── uploadToCloud.ts              # Cloudinary / S3 helper
├── app.ts                             # Express app setup
└── server.ts                          # Server entry point
```

---

## 5. Technical Specifications

### Environment Variables
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/triplance

# JWT
JWT_ACCESS_SECRET=access_secret_key
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUND=12

# Payment — Stripe
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# Payment — SSLCommerz (alternative)
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false

# File Storage — Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OR File Storage — AWS S3
AWS_BUCKET_NAME=triplance-media
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_REGION=ap-southeast-1
```

### Dependencies

**Production:**
- `express`, `cors`, `cookie-parser`, `dotenv`
- `@prisma/client`, `@prisma/adapter-pg`, `pg`
- `bcryptjs`, `jsonwebtoken`
- `zod`, `http-status`
- `stripe` or `sslcommerz`
- `cloudinary` or `@aws-sdk/client-s3`
- `multer` (file upload middleware)

**Development:**
- `typescript`, `ts-node-dev`, `prisma`
- `eslint`, `prettier`, `@types/*`

---

## 6. Business Logic Rules

1. **User Registration**: Hash password with bcrypt before storing
2. **Agency Registration**: Agency accounts are created with `isVerified = false`; Admin must approve before they can publish packages
3. **Login**: Verify password, return access + refresh tokens as HTTP-only cookies
4. **Auth Middleware**: Verify JWT, check user exists, confirm `isBanned = false`, validate role permissions
5. **Create Package**: Only approved agencies can create packages
6. **Create Booking**: Traveler must be authenticated; package must be active and have available slots on the selected date; total price is calculated and locked at booking time
7. **Slot Management**: On successful booking, decrement available slots; on cancellation, restore them
8. **Initiate Payment**: Payment must be completed before booking status moves to `confirmed`
9. **Submit Review**: Traveler can only review a package tied to a **completed** booking; one review per booking
10. **Agency Rating Update**: Recalculate and update agency average rating after every new review
11. **Feed**: Return paginated posts sorted by recency; optionally filtered by followed users/agencies
12. **Like Uniqueness**: Enforce unique constraint on (`userId`, `postId`) — a user can like a post only once
13. **Follow Uniqueness**: Enforce unique constraint on (`followerId`, `followingId`)
14. **Content Moderation**: Admin can delete any post or review regardless of ownership
15. **Pagination**: All list endpoints support `page`, `limit`, `sortBy`, `sortOrder` query params
16. **Search & Filter**: Packages searchable by destination, title, price range, and date

---

## 7. Response Format

### Success Response
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "meta": { "page": 1, "limit": 10, "total": 100 },
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errorSources": [
    { "path": "field_name", "message": "Specific error detail" }
  ],
  "stack": "..." 
}
```

> `stack` is only included when `NODE_ENV=development`

---

## 8. Deployment Checklist

1. Set `NODE_ENV=production`
2. Configure PostgreSQL (Neon, Supabase, or self-hosted)
3. Run `npx prisma generate && npx prisma migrate deploy`
4. Configure Cloudinary or S3 bucket and set env vars
5. Configure Stripe or SSLCommerz keys and register webhook endpoint
6. Build: `npm run build`
7. Start: `npm start`
8. Set up CORS to allow only your frontend domain in production
9. Ensure all secrets are stored in environment variables — never hardcoded
