# 🌍 Triplance — Travel Social & Booking Platform

Triplance is a full-stack travel platform that combines **social networking** with **travel package booking**. Travelers can discover trips, follow agencies, share stories, and book packages — all in one place. Agencies can list packages, manage bookings, and grow their audience through a built-in social feed.

---

## 🚩 The Problem

Planning travel is fragmented. Travelers jump between social media for inspiration, separate websites to find packages, and third-party tools to make payments. There's no single platform where they can discover agencies, follow their content, book a trip, and leave a verified review — all in a trusted, moderated environment.

**Triplance solves this** by combining a social feed, a travel marketplace, and a secure booking + payment system into one cohesive platform.

---

## ✨ Features

### 👤 User Roles

- **Traveler** — Browse packages, book trips, post stories, follow agencies
- **Agency** — List and manage travel packages, track bookings and revenue, post content
- **Admin** — Approve agencies, manage users, moderate content, view platform stats

### 🔐 Authentication

- JWT-based auth with access & refresh tokens (HTTP-only cookies)
- Role-based access control across all routes
- Agency accounts require admin approval before going live

### 📸 Social Feed

- Post travel stories with images, captions, and tags
- Like and comment on posts
- Follow other travelers or agencies to personalize your feed
- Paginated feed sorted by recency

### 📦 Package Management

- Agencies can create, update, and delete travel packages
- Package details: title, description, price, capacity, itinerary, amenities, images, destination, available dates
- Travelers can browse and filter packages by destination, price range, and date

### 📅 Booking System

- Travelers pick a package, select a date/slot, and book
- Real-time capacity check — booking is rejected if no slots are available
- Slot count auto-decrements on booking and restores on cancellation
- Booking statuses: `pending` → `confirmed` → `completed` / `cancelled`

### 💳 Payment Integration

- **Stripe** payment gateway for secure checkout
- Payment statuses: `unpaid` / `paid` / `refunded`
- Webhook support for real-time payment confirmation
- Travelers can view receipts; agencies can track revenue per package
- Admin can process refunds

### ⭐ Review System

- Travelers can rate and review a package only after a booking is `completed`
- One review per booking (no duplicates)
- 1–5 star rating with written feedback
- Agency average rating auto-recalculates after every new review

### 🛡️ Admin Dashboard

- Platform-wide stats: total bookings, active users, revenue, new agencies
- Approve or reject agency registrations
- Ban/suspend users for policy violations
- Remove inappropriate posts or fraudulent reviews
- Handle refund requests and disputes

---

## 🛠️ Tech Stack

| Layer        | Technology                      |
| ------------ | ------------------------------- |
| Frontend     | Next.js, TypeScript             |
| Backend      | Node.js, Express.js, TypeScript |
| Database     | PostgreSQL + Prisma ORM         |
| Auth         | JWT (access + refresh tokens)   |
| Payment      | Stripe                          |
| File Storage | Cloudinary / AWS S3             |
| Validation   | Zod                             |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- Stripe account (for payments)
- Cloudinary or AWS S3 account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/triplance.git
cd triplance
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/triplance

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUND=12

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Set Up the Database

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the Development Server

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

---

## 🔑 Test Credentials

| Role   | Email            | Password  |
| ------ | ---------------- | --------- |
| Admin  | admin@gmail.com  | admin123  |
| Agency | agency@gmail.com | agency123 |

> **Note:** The agency account must be approved by the admin before it can publish packages. So if you create new account, log in as admin first to approve it.

---

## 📡 API Overview

| Module   | Base Endpoint      |
| -------- | ------------------ |
| Auth     | `/api/v1/auth`     |
| Users    | `/api/v1/users`    |
| Posts    | `/api/v1/posts`    |
| Packages | `/api/v1/packages` |
| Bookings | `/api/v1/bookings` |
| Payments | `/api/v1/payments` |
| Reviews  | `/api/v1/reviews`  |
| Admin    | `/api/v1/admin`    |

All list endpoints support `page`, `limit`, `sortBy`, and `sortOrder` query params.

### Response Format

```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "meta": { "page": 1, "limit": 10, "total": 100 },
  "data": {}
}
```

---

## 📁 Project Structure

```
src/
├── config/           # Environment config
├── lib/              # Prisma client
├── errors/           # Custom error handlers
├── middlewares/      # Auth, validation, error handling
├── modules/
│   ├── Auth/
│   ├── User/
│   ├── Post/
│   ├── Comment/
│   ├── Like/
│   ├── Follow/
│   ├── Package/
│   ├── Booking/
│   ├── Payment/
│   ├── Review/
│   └── Admin/
├── routes/           # Route aggregator
├── utils/            # Helpers (catchAsync, sendResponse, uploadToCloud)
├── app.ts
└── server.ts
```

---

## 🚢 Deployment

1. Set `NODE_ENV=production`
2. Configure your PostgreSQL instance (Neon, Supabase, or self-hosted)
3. Run migrations: `npx prisma generate && npx prisma migrate deploy`
4. Set all environment variables on your hosting platform
5. Register your Stripe webhook endpoint
6. Build and start:

```bash
npm run build
npm start
```

> Make sure CORS is configured to allow only your frontend domain in production.

---
