# 🌍 Triplance — Where Travel Meets Community

> A full-stack platform that unifies travel discovery, social storytelling, and package booking into one seamless experience.

---

## 🚩 Problem Statement

Planning travel is fragmented. Travelers jump between social media for inspiration, separate websites to find packages, and third-party tools to make payments. There's no single place to discover agencies, follow their content, book a trip, and leave a verified review — all within a trusted, moderated environment.

---

## 💡 Solution Overview

Triplance brings it all together. It combines a **social feed**, a **travel marketplace**, and a **secure booking + payment system** into one unified platform.

- Travelers discover and book trips, follow agencies, and share stories
- Agencies list packages, track bookings and revenue, and grow their audience
- Admins keep the platform safe, approved, and well-moderated

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

## ✨ Key Features

### 👤 User Roles
- **Traveler** — Browse packages, book trips, post stories, follow agencies
- **Agency** — List and manage travel packages, track bookings and revenue, post content
- **Admin** — Approve agencies, manage users, moderate content, view platform stats

### 🔐 Authentication
- JWT-based auth with access & refresh tokens stored in HTTP-only cookies
- Role-based access control across all routes
- Agency accounts require admin approval before going live

### 📸 Social Feed
- Post travel stories with images, captions, and tags
- Like, comment, and follow to personalize your feed
- Paginated feed sorted by recency

### 📦 Package Management
- Agencies can create, update, and delete travel packages
- Rich package details: title, description, price, capacity, itinerary, amenities, images, destination, and available dates
- Travelers can filter packages by destination, price range, and date

### 📅 Booking System
- Select a package, pick a date/slot, and book instantly
- Real-time capacity check — rejected automatically if no slots remain
- Slot count auto-adjusts on booking and cancellation
- Status flow: `pending` → `confirmed` → `completed` / `cancelled`

### 💳 Payment Integration
- **Stripe** for secure checkout
- Payment statuses: `unpaid` / `paid` / `refunded`
- Webhook support for real-time payment confirmation
- Travelers view receipts; agencies track per-package revenue; admin handles refunds

### ⭐ Review System
- Only available after a booking is `completed` — no fake reviews
- One review per booking, 1–5 stars with written feedback
- Agency average rating auto-recalculates on every new review

### 🛡️ Admin Dashboard
- Platform-wide stats: bookings, active users, revenue, new agencies
- Approve or reject agency registrations
- Ban/suspend users for policy violations
- Remove inappropriate posts or fraudulent reviews
- Handle refund requests and disputes

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL database
- Stripe account
- Cloudinary or AWS S3 account

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
See the [Environment Variables](#-environment-variables) section below, then create a `.env` file in the root directory.

### 4. Set Up the Database
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the Development Server
```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 6. Deployment
```bash
# Build and start for production
npm run build
npm start
```

Additional deployment steps:
1. Set `NODE_ENV=production`
2. Configure your PostgreSQL instance (Neon, Supabase, or self-hosted)
3. Run `npx prisma generate && npx prisma migrate deploy`
4. Set all environment variables on your hosting platform
5. Register your Stripe webhook endpoint
6. Ensure CORS is restricted to your frontend domain

---

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following:

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

---

## 📡 API & Architecture

### API Endpoints

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

### Standard Response Format
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "meta": { "page": 1, "limit": 10, "total": 100 },
  "data": {}
}
```

### Project Structure
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

## 🌐 Live Demo & Credentials

**Live URL:** [triplanceworld.vercel.app](https://triplanceworld.vercel.app/)

| Role   | Email              | Password   |
| ------ | ------------------ | ---------- |
| Admin  | admin@gmail.com    | admin123   |
| Agency | agency@gmail.com   | agency123  |

> **Note:** Agency accounts must be approved by an admin before they can publish packages. If you register a new agency account, log in as admin first to approve it.
