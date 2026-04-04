# 🌍 Triplance — Frontend PRD
> **Stack:** Next.js 14 · TypeScript · Tailwind CSS · React Query · Zustand  
> **Last Updated:** 2025  
> **Status:** 🟡 In Progress

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Routing Architecture](#3-routing-architecture)
4. [Pages & Features by Role](#4-pages--features-by-role)
5. [Component Map](#5-component-map)
6. [Services Layer](#6-services-layer)
7. [State Management](#7-state-management)
8. [API Integration](#8-api-integration)
9. [Design System](#9-design-system)
10. [Environment Variables](#10-environment-variables)
11. [Build Checklist](#11-build-checklist)

---

## 1. Project Overview

| Property | Value |
|---|---|
| **Project Name** | Triplance |
| **Type** | Travel Social + Booking Platform |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Auth** | JWT (Access Token in-memory + Refresh Token httpOnly cookie) |
| **Payment** | Stripe / SSLCommerz |
| **Media** | Cloudinary |
| **Backend Base URL** | `http://localhost:5000/api/v1` |

### Roles

| Role | Description | Dashboard |
|---|---|---|
| 🧳 **Traveler** | Books packages, posts stories, follows others | `/traveler/dashboard` |
| 🏢 **Agency** | Creates packages, manages bookings, posts promos | `/agency/dashboard` |
| 🛡️ **Admin** | Governs the platform, approves agencies, moderates content | `/admin/dashboard` |

---

## 2. Folder Structure

```
src/
├── app/
│   ├── (commonLayout)/               # Public pages + Traveler pages
│   │   ├── layout.tsx                # Navbar + Footer
│   │   ├── loading.tsx
│   │   ├── page.tsx                  # 🏠 Landing Page
│   │   ├── packages/
│   │   │   ├── page.tsx              # 🔍 Browse Packages
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 📦 Package Detail
│   │   ├── agencies/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 🏢 Public Agency Profile
│   │   ├── users/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 👤 Public Traveler Profile
│   │   ├── feed/
│   │   │   └── page.tsx              # 📰 Social Feed
│   │   ├── bookings/
│   │   │   ├── page.tsx              # 📋 My Bookings
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 🎫 Booking Detail
│   │   ├── payments/
│   │   │   └── page.tsx              # 💳 My Payment Receipts
│   │   ├── reviews/
│   │   │   └── new/
│   │   │       └── page.tsx          # ⭐ Submit Review
│   │   ├── checkout/
│   │   │   └── [packageId]/
│   │   │       ├── select-date/
│   │   │       │   └── page.tsx      # 📅 Step 1: Pick Date & Seats
│   │   │       ├── review/
│   │   │       │   └── page.tsx      # 👁️ Step 2: Review Booking
│   │   │       └── payment/
│   │   │           └── page.tsx      # 💰 Step 3: Pay
│   │   └── profile/
│   │       └── page.tsx              # ✏️ Edit My Profile
│   │
│   ├── (DashboardLayout)/            # Protected dashboard shell
│   │   ├── layout.tsx                # Sidebar + top bar
│   │   ├── loading.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx        # Parallel routes host
│   │   │   │   ├── page.tsx
│   │   │   │   ├── @userStats/
│   │   │   │   │   └── page.tsx      # 👥 Users stat card
│   │   │   │   ├── @bookingStats/
│   │   │   │   │   └── page.tsx      # 🎫 Bookings stat card
│   │   │   │   ├── @revenueStats/
│   │   │   │   │   └── page.tsx      # 💰 Revenue stat card
│   │   │   │   └── @pendingAgencies/
│   │   │   │       └── page.tsx      # 🏢 Pending approvals feed
│   │   │   ├── users/
│   │   │   │   ├── page.tsx          # All users table
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # User detail + ban action
│   │   │   ├── agencies/
│   │   │   │   ├── page.tsx          # Pending + all agencies
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Approve / Ban agency
│   │   │   ├── packages/
│   │   │   │   └── page.tsx          # All packages moderation
│   │   │   ├── bookings/
│   │   │   │   └── page.tsx          # All bookings oversight
│   │   │   ├── payments/
│   │   │   │   └── page.tsx          # All payments + refunds
│   │   │   ├── posts/
│   │   │   │   └── page.tsx          # Content moderation — posts
│   │   │   └── reviews/
│   │   │       └── page.tsx          # Content moderation — reviews
│   │   │
│   │   └── agency/
│   │       ├── dashboard/
│   │       │   ├── layout.tsx        # Parallel routes host
│   │       │   ├── page.tsx
│   │       │   ├── @bookings/
│   │       │   │   └── page.tsx      # Recent bookings panel
│   │       │   ├── @revenue/
│   │       │   │   └── page.tsx      # Revenue panel
│   │       │   └── @packages/
│   │       │       └── page.tsx      # Active packages panel
│   │       ├── packages/
│   │       │   ├── page.tsx          # My packages list
│   │       │   ├── new/
│   │       │   │   └── page.tsx      # Create package
│   │       │   └── [id]/
│   │       │       ├── page.tsx      # Edit package
│   │       │       └── bookings/
│   │       │           └── page.tsx  # Bookings for this package
│   │       └── bookings/
│   │           └── page.tsx          # All incoming bookings
│   │
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   ├── page.tsx                  # Traveler registration
│   │   └── agency/
│   │       └── page.tsx              # Agency registration
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                    # Root layout (fonts, global providers)
│   ├── loading.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                           # shadcn/ui primitives
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── feed/
│   │   ├── PostCard.tsx
│   │   ├── PostComposer.tsx
│   │   ├── CommentSection.tsx
│   │   └── FeedSkeleton.tsx
│   ├── packages/
│   │   ├── PackageCard.tsx
│   │   ├── PackageFilters.tsx
│   │   ├── PackageForm.tsx
│   │   ├── PackageGallery.tsx
│   │   └── ItineraryBuilder.tsx
│   ├── booking/
│   │   ├── DateSlotPicker.tsx
│   │   ├── SeatSelector.tsx
│   │   ├── BookingSummary.tsx
│   │   └── BookingStatusBadge.tsx
│   ├── payment/
│   │   ├── StripeCheckoutForm.tsx
│   │   └── PaymentReceiptCard.tsx
│   ├── review/
│   │   ├── StarRating.tsx
│   │   ├── ReviewCard.tsx
│   │   └── ReviewForm.tsx
│   ├── user/
│   │   ├── UserAvatar.tsx
│   │   ├── FollowButton.tsx
│   │   └── ProfileEditForm.tsx
│   └── shared/
│       ├── DataTable.tsx
│       ├── ImageUploader.tsx
│       ├── ConfirmDialog.tsx
│       ├── EmptyState.tsx
│       ├── Pagination.tsx
│       └── SearchBar.tsx
│
├── constants/
│   ├── roles.ts
│   ├── routes.ts
│   └── queryKeys.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useCurrentUser.ts
│   ├── usePosts.ts
│   ├── usePackages.ts
│   ├── useBookings.ts
│   └── useFollowToggle.ts
│
├── lib/
│   ├── api.ts                        # Axios instance + interceptors
│   ├── queryClient.ts
│   ├── auth.ts
│   └── stripe.ts
│
├── providers/
│   ├── QueryProvider.tsx
│   ├── AuthProvider.tsx
│   └── ThemeProvider.tsx
│
├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── package.service.ts
│   ├── booking.service.ts
│   ├── payment.service.ts
│   ├── post.service.ts
│   ├── comment.service.ts
│   ├── review.service.ts
│   ├── follow.service.ts
│   └── admin.service.ts
│
├── store/
│   ├── authStore.ts
│   └── bookingStore.ts
│
├── types/
│   ├── user.ts
│   ├── package.ts
│   ├── booking.ts
│   ├── payment.ts
│   ├── post.ts
│   └── review.ts
│
└── middleware.ts
```

---

## 3. Routing Architecture

### Route Groups

| Group | Layout | Who Can Access |
|---|---|---|
| `(commonLayout)` | Navbar + Footer | Public + Logged-in Traveler |
| `(DashboardLayout)` | Sidebar + Topbar | Agency & Admin only |
| `login/` `register/` | Centered card | Unauthenticated only |

### Middleware Logic (`middleware.ts`)

```
Request comes in
│
├── Is route public? (/packages, /agencies, /) → ✅ Allow
│
├── Is route (auth)? (login, register)
│   └── Has valid token? → redirect to role dashboard
│
├── Is route /admin/* ?
│   └── Role !== admin → redirect to /login
│
├── Is route /agency/* ?
│   └── Role !== agency → redirect to /login
│   └── isVerified === false → redirect to /pending-approval
│
└── Is route traveler-only? (feed, bookings, checkout)
    └── Not authenticated → redirect to /login?redirect=<path>
```

### Parallel Routes — Admin Dashboard

> Loads all 4 panels simultaneously. No waterfall. Each fetches its own data independently.

```
admin/dashboard/
├── layout.tsx          ← receives @userStats, @bookingStats, @revenueStats, @pendingAgencies as props
├── page.tsx            ← default slot (page title, welcome message)
├── @userStats/page.tsx
├── @bookingStats/page.tsx
├── @revenueStats/page.tsx
└── @pendingAgencies/page.tsx
```

### Parallel Routes — Agency Dashboard

```
agency/dashboard/
├── layout.tsx          ← receives @bookings, @revenue, @packages as props
├── page.tsx
├── @bookings/page.tsx
├── @revenue/page.tsx
└── @packages/page.tsx
```

### Checkout Wizard — Sequential Steps

> URL changes per step → browser Back button works naturally → state persisted in Zustand `bookingStore`

```
/checkout/[packageId]/select-date   → Step 1
/checkout/[packageId]/review        → Step 2
/checkout/[packageId]/payment       → Step 3 (Stripe)
```

---

## 4. Pages & Features by Role

---

### 🌐 Public Pages (No Auth Required)

---

#### 🏠 Landing Page — `/`

**Goal:** Convert visitors into registered users or package bookers.

| Section | Details |
|---|---|
| Hero | Full-bleed image/video, destination search bar, CTA buttons |
| Featured Packages | SSR horizontal scroll of `PackageCard` — `revalidate: 3600` |
| How It Works | 3-step explainer for Travelers + Agencies |
| Top Agencies | Grid of agency cards with star ratings |
| Recent Feed Posts | Masonry photo grid |
| Footer CTA | Register as Traveler / Register as Agency |

**Rendering:** Server Component · ISR (`revalidate: 3600`)

---

#### 🔍 Browse Packages — `/packages`

**Goal:** Help travelers discover and filter travel packages.

| Feature | Implementation |
|---|---|
| Filter sidebar | Destination, price range slider, date picker, amenities checkboxes |
| Sort options | Price · Rating · Newest |
| Package grid | Paginated `PackageCard` grid |
| URL-synced filters | `useSearchParams` → shareable filter URLs |
| Empty state | `EmptyState` component with illustration |

**Rendering:** Client Component · `useQuery` refetch on filter change

**Query Key:** `['packages', { destination, priceMin, priceMax, date, amenities, page }]`

---

#### 📦 Package Detail — `/packages/[id]`

**Sections:**

| Section | Details |
|---|---|
| Image gallery | Lightbox on click · `PackageGallery` |
| Header info | Title, destination, price/person, slots badge |
| Tabs | Overview · Itinerary · Amenities · Reviews |
| Sticky sidebar | Date picker, seat count, total price, Book Now CTA |
| Agency card | Avatar, rating, follow button |
| Reviews | Star distribution chart + `ReviewCard` list |

**Rendering:** Server Component initial render · Client hydration for sidebar

---

#### 🏢 Public Agency Profile — `/agencies/[id]`

| Section | Details |
|---|---|
| Hero | Banner + avatar + avg rating + review count |
| Active packages | Grid of `PackageCard` |
| Recent posts | Grid of post images |
| Follow button | Traveler only |

---

### 🧳 Traveler Pages (Auth Required · Role: traveler)

---

#### 📰 Social Feed — `/feed`

**Goal:** Keep travelers engaged with travel stories and package promotions.

| Feature | Implementation |
|---|---|
| Infinite scroll | `useInfiniteQuery` |
| Filter tabs | All · Following |
| Post composer | Image upload + caption + tags → `PostComposer` |
| Post card | Avatar · images · caption · like · comment toggle |
| Like | Optimistic update via `useMutation` |
| Comments | Inline `CommentSection` per post |

**Query Key:** `['feed', { filter: 'all' | 'following', page }]`

---

#### 📅 Checkout Wizard — `/checkout/[packageId]/*`

**Step 1 — `/select-date`**
- Calendar showing available dates (greyed = full)
- Seat count stepper (min: 1, max: package.maxCapacity)
- Real-time price calculation
- Save to `bookingStore` on Next

**Step 2 — `/review`**
- Booking summary: package thumbnail, date, seats, total price
- Edit link back to Step 1
- Confirm & Proceed button

**Step 3 — `/payment`**
- Stripe `<PaymentElement>` embedded form
- Order summary sidebar
- On success → redirect to `/bookings/[id]` + success toast
- On failure → show error inline, stay on page

**State:** Zustand `bookingStore` persists across steps

---

#### 📋 My Bookings — `/bookings`

| Feature | Details |
|---|---|
| Booking list | Cards with status badge, package image, date, price |
| Status filter | All · Pending · Confirmed · Completed · Cancelled |
| Cancel action | `ConfirmDialog` → DELETE `/bookings/:id` |
| Leave review | Button appears only when status = `completed` |

---

#### 🎫 Booking Detail — `/bookings/[id]`

- Full booking info card
- Payment status badge
- Package info summary
- Download receipt button (links to `payment.receiptUrl`)
- Leave Review CTA (if completed + no review yet)

---

#### 💳 My Payments — `/payments`

- List of all payment receipts
- Each card: booking ref, amount, date, status badge, receipt link
- Filter by status: unpaid · paid · refunded

---

#### ⭐ Submit Review — `/reviews/new`

- Accessed via `/reviews/new?bookingId=xxx`
- Guard: booking must be `completed` + no existing review
- Star rating selector (1–5) · Written review textarea
- Submit → POST `/api/v1/reviews`
- On success → redirect to `/bookings/[id]` + toast

---

#### ✏️ Profile — `/profile`

- Edit name, bio, profile image (Cloudinary upload)
- View my posts grid
- View followers / following count with list modal

---

### 🏢 Agency Pages (Auth Required · Role: agency · isVerified: true)

---

#### 📊 Agency Dashboard — `/agency/dashboard`

> 3 parallel panels load simultaneously

| Panel | Data |
|---|---|
| `@revenue` | Total revenue this month vs last month bar chart |
| `@bookings` | Upcoming bookings count + recent bookings list |
| `@packages` | Active packages count + quick list |

---

#### 📦 My Packages — `/agency/packages`

| Feature | Details |
|---|---|
| Package list | Cards with status toggle (active/inactive), edit, delete |
| Create button | → `/agency/packages/new` |
| Delete | `ConfirmDialog` → soft delete |
| Filter | Active · Inactive |

---

#### ➕ Create / Edit Package — `/agency/packages/new` & `/agency/packages/[id]`

**Form sections (multi-step form or tabbed):**

| Section | Fields |
|---|---|
| Basic Info | Title, destination, description |
| Pricing & Capacity | Price per person, max capacity |
| Dates | Multi-date picker for available dates |
| Itinerary | Day-by-day drag-reorder builder (`ItineraryBuilder`) |
| Amenities | Checkbox selector (`AmenitySelector`) |
| Images | Multi-image uploader → Cloudinary (`ImageUploader`) |

**Validation:** `react-hook-form` + `zod` schema

---

#### 📋 Incoming Bookings — `/agency/bookings`

| Feature | Details |
|---|---|
| Bookings table | `DataTable` with package name, traveler, date, status, seats |
| Filter | By package, status, date range |
| Actions | Confirm · Cancel · Mark Completed |
| Status update | PATCH `/bookings/:id/status` |

---

#### 📋 Bookings per Package — `/agency/packages/[id]/bookings`

Same as above but pre-filtered for one package.

---

### 🛡️ Admin Pages (Auth Required · Role: admin)

---

#### 📊 Admin Dashboard — `/admin/dashboard`

> 4 parallel panels load simultaneously — zero waterfall

| Panel | Metric |
|---|---|
| `@userStats` | Total users · New this week |
| `@bookingStats` | Total bookings · Active bookings |
| `@revenueStats` | Total revenue · Revenue this month |
| `@pendingAgencies` | Agencies awaiting approval — quick approve/reject |

**Endpoint:** GET `/api/v1/admin/stats`

---

#### 👥 User Management — `/admin/users`

| Feature | Details |
|---|---|
| Users table | `DataTable` — name, email, role, status, joined date |
| Search | By name or email |
| Filter | By role (traveler/agency) · By status (active/banned) |
| Actions | View profile · Ban · Unban |

---

#### 🏢 Agency Management — `/admin/agencies`

| Tab | Content |
|---|---|
| Pending | Agencies with `isVerified = false` — Approve / Reject |
| All Agencies | Full list with ban/unban actions |

- Approve → PATCH `/users/:id/approve`
- Ban → PATCH `/users/:id/ban`

---

#### 📰 Posts Moderation — `/admin/posts`

- Table of all posts with author, preview, date
- Delete button → `ConfirmDialog` → DELETE `/posts/:id`
- Filter by reported / recent

---

#### ⭐ Reviews Moderation — `/admin/reviews`

- Table of all reviews with reviewer, package, rating, text
- Delete button → `ConfirmDialog` → DELETE `/reviews/:id`

---

#### 💳 Payments — `/admin/payments`

- Full payment ledger table
- Filter by status: unpaid · paid · refunded
- Refund action → POST `/payments/:id/refund`

---

#### 📦 Packages — `/admin/packages`

- All packages table
- Deactivate / Delete action per package

---

## 5. Component Map

### Server vs Client Decision

| Component | Type | Reason |
|---|---|---|
| `app/(commonLayout)/page.tsx` | ⚙️ Server | SEO-critical, no interactivity |
| `PackageCard` (browse grid) | ⚙️ Server | Static display data |
| `PackageFilters` | 🖥️ Client | URL filter state |
| `PostCard` | 🖥️ Client | Like / comment interactions |
| `PostComposer` | 🖥️ Client | Image upload + form submit |
| `DateSlotPicker` | 🖥️ Client | Controlled calendar state |
| `StripeCheckoutForm` | 🖥️ Client | Stripe SDK requires browser |
| `DataTable` | 🖥️ Client | Sort, filter, pagination |
| `FollowButton` | 🖥️ Client | Optimistic toggle |
| `StarRating` | 🖥️ Client | Interactive rating input |
| `ImageUploader` | 🖥️ Client | react-dropzone + Cloudinary |

---

### `DataTable` Props (Reusable across Admin + Agency)

```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading: boolean
  pagination: { page: number; limit: number; total: number }
  onPageChange: (page: number) => void
  searchPlaceholder?: string
}
```

Used in: admin users, admin bookings, admin payments, agency bookings

---

## 6. Services Layer

Each service file is a collection of functions that call the Axios instance. React Query hooks consume these functions.

### Pattern

```typescript
// services/package.service.ts
import api from '@/lib/api'
import { Package, PackageFilters } from '@/types/package'

export const packageService = {
  getAll: (filters: PackageFilters) =>
    api.get('/packages', { params: filters }).then(r => r.data),

  getById: (id: string) =>
    api.get(`/packages/${id}`).then(r => r.data),

  create: (data: CreatePackageDTO) =>
    api.post('/packages', data).then(r => r.data),

  update: (id: string, data: UpdatePackageDTO) =>
    api.patch(`/packages/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/packages/${id}`).then(r => r.data),
}
```

### Service Files

| File | Endpoints Covered |
|---|---|
| `auth.service.ts` | register, login, refresh-token |
| `user.service.ts` | getAll, getById, update, ban, approve, follow, unfollow |
| `package.service.ts` | CRUD, getReviews |
| `booking.service.ts` | create, getMyBookings, getById, updateStatus, cancel |
| `payment.service.ts` | initiate, getMyPayments, getAll, refund |
| `post.service.ts` | create, getFeed, getById, update, delete, like, unlike |
| `comment.service.ts` | addComment, getComments, deleteComment |
| `review.service.ts` | submit, getByPackage, delete |
| `follow.service.ts` | follow, unfollow, getFollowers, getFollowing |
| `admin.service.ts` | getStats, getAllBookings, getAllPayments, getAllPosts, getAllReviews |

---

## 7. State Management

### Zustand — Client-Only State

#### `authStore.ts`

```typescript
interface AuthState {
  user: User | null
  accessToken: string | null          // in-memory only — never localStorage
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
  role: 'admin' | 'traveler' | 'agency' | null
}
```

#### `bookingStore.ts`

```typescript
interface BookingState {
  packageId: string | null
  selectedDate: Date | null
  seats: number
  totalPrice: number
  setDraft: (draft: Partial<BookingState>) => void
  clearDraft: () => void
}
```

---

### React Query — Server State

#### Config (`lib/queryClient.ts`)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,       // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

#### Query Keys (`constants/queryKeys.ts`)

```typescript
export const QUERY_KEYS = {
  packages: (filters) => ['packages', filters],
  package: (id) => ['package', id],
  feed: (filter) => ['feed', filter],
  myBookings: ['bookings', 'my'],
  booking: (id) => ['booking', id],
  myPayments: ['payments', 'my'],
  reviews: (packageId) => ['reviews', packageId],
  agency: (id) => ['agency', id],
  adminStats: ['admin', 'stats'],
  users: (filters) => ['users', filters],
}
```

---

## 8. API Integration

### Axios Instance (`lib/api.ts`)

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,             // sends httpOnly refresh token cookie
})

// REQUEST: attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// RESPONSE: handle 401 → refresh → retry
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      try {
        const { data } = await axios.post('/auth/refresh-token', {}, { withCredentials: true })
        useAuthStore.getState().setToken(data.data.accessToken)
        error.config.headers.Authorization = `Bearer ${data.data.accessToken}`
        return api(error.config)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
```

### API Response Shape

```typescript
// Success
{
  success: true,
  message: "...",
  meta: { page: 1, limit: 10, total: 100 },   // on list endpoints
  data: { ... }
}

// Error
{
  success: false,
  message: "...",
  errorSources: [{ path: "field", message: "..." }]
}
```

---

## 9. Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `brand` | `#E07B39` | Primary buttons, active states, links |
| `brand-light` | `#F5A673` | Hover states |
| `surface` | `#FAFAF8` | Page backgrounds |
| `card` | `#FFFFFF` | Card backgrounds |
| `text-primary` | `#1A1A1A` | Headings, body text |
| `text-muted` | `#6B6B6B` | Secondary text, placeholders |
| `border` | `#E8E4DF` | Dividers, input borders |
| `success` | `#2D7F5E` | Confirmed, paid statuses |
| `warning` | `#D97706` | Pending status |
| `error` | `#DC2626` | Cancelled, error states |

### Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | `Playfair Display` | 700 | Hero headings, page titles |
| UI | `DM Sans` | 400/500/600 | Body, buttons, labels |
| Data | `JetBrains Mono` | 400 | Prices, IDs, codes |

### Booking Status Badges

| Status | Color |
|---|---|
| `pending` | Amber background · amber text |
| `confirmed` | Green background · green text |
| `cancelled` | Red background · red text |
| `completed` | Slate background · slate text |

### Payment Status Badges

| Status | Color |
|---|---|
| `unpaid` | Amber |
| `paid` | Green |
| `refunded` | Purple |

### Loading Patterns

| Scenario | Pattern |
|---|---|
| List pages (feed, packages, bookings) | Skeleton cards |
| Form submissions | Button spinner + disabled state |
| Like / follow toggle | Optimistic update (instant) |
| Page transitions | `loading.tsx` skeleton |
| Dashboard parallel panels | Each panel has its own skeleton |

---

## 10. Environment Variables

```env
# Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Stripe (public key only — never secret key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx

# Cloudinary (unsigned upload preset)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=triplance_unsigned

# Google Maps (optional — for destination map on package detail)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

> ⚠️ Never prefix secret keys with `NEXT_PUBLIC_`. Stripe secret key, Cloudinary API secret → backend only.

---

## 11. Build Checklist

### Phase 1 — Foundation
- [ ] Initialize Next.js 14 with TypeScript + Tailwind
- [ ] Install and configure shadcn/ui
- [ ] Set up folder structure as per Section 2
- [ ] Configure `next/font` with Playfair Display + DM Sans
- [ ] Create `globals.css` with CSS custom properties
- [ ] Set up Axios instance with interceptors (`lib/api.ts`)
- [ ] Set up React Query provider + QueryClient
- [ ] Create Zustand `authStore` and `bookingStore`
- [ ] Write `middleware.ts` for role-based route protection
- [ ] Create all TypeScript types in `/types`
- [ ] Create all service files in `/services`
- [ ] Define all query keys in `constants/queryKeys.ts`

### Phase 2 — Auth & Layouts
- [ ] Login page + form with validation
- [ ] Traveler registration page
- [ ] Agency registration page (extra fields)
- [ ] `(commonLayout)` layout with Navbar + Footer
- [ ] `(DashboardLayout)` layout with Sidebar
- [ ] `Sidebar.tsx` — role-aware nav links
- [ ] `AuthProvider.tsx` — hydrate user on app load
- [ ] Redirect logic after login (role-based)

### Phase 3 — Public Pages
- [ ] Landing page (Hero, Featured Packages, How It Works, Top Agencies)
- [ ] Browse Packages page with filters + URL sync
- [ ] Package Detail page (gallery, tabs, sticky sidebar)
- [ ] Public Agency Profile page
- [ ] Public Traveler Profile page

### Phase 4 — Traveler Features
- [ ] Social Feed with infinite scroll
- [ ] Post Composer (image upload + caption + tags)
- [ ] Like + Comment (optimistic updates)
- [ ] Checkout Wizard Step 1 — Date & Seats
- [ ] Checkout Wizard Step 2 — Review Booking
- [ ] Checkout Wizard Step 3 — Stripe Payment
- [ ] My Bookings list + detail
- [ ] My Payments receipts
- [ ] Submit Review form
- [ ] Profile edit page
- [ ] Follow / Unfollow functionality

### Phase 5 — Agency Features
- [ ] Agency Dashboard (parallel route panels)
- [ ] My Packages list (CRUD)
- [ ] Create / Edit Package form (multi-section)
- [ ] Itinerary Builder (drag-reorder)
- [ ] Image Uploader → Cloudinary
- [ ] Incoming Bookings table + status actions
- [ ] Post composer (same as traveler feed)

### Phase 6 — Admin Features
- [ ] Admin Dashboard (parallel route panels)
- [ ] User Management table (search, filter, ban)
- [ ] Agency Management (pending tab + all agencies)
- [ ] Content Moderation — Posts
- [ ] Content Moderation — Reviews
- [ ] Payments table + refund action
- [ ] Packages moderation table

### Phase 7 — Polish
- [ ] All skeleton loaders
- [ ] All empty states
- [ ] `not-found.tsx` 404 page
- [ ] Error boundary pages
- [ ] `react-hot-toast` notification setup
- [ ] Mobile responsive audit (all pages)
- [ ] Framer Motion page transitions
- [ ] Lighthouse audit → target >90 score
- [ ] `next build` — fix all TypeScript errors

---

## Appendix — Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Router | App Router | Layouts, parallel routes, server components |
| Client state | Zustand | Lightweight, no boilerplate |
| Server state | React Query | Caching, optimistic updates, infinite query |
| Token storage | In-memory (Zustand) + httpOnly cookie | No XSS via localStorage |
| Form handling | react-hook-form + zod | Mirrors backend zod schemas |
| Payment UI | Stripe `<PaymentElement>` | PCI compliant |
| Image hosting | Cloudinary unsigned preset | Direct browser → Cloudinary upload |
| CSS | Tailwind + shadcn/ui | Fast, accessible, utility-first |
| Parallel routes | Dashboard panels only | Correct use — simultaneous independent panels |
| Regular folders | Role routing (admin/, agency/) | Correct — roles are not simultaneous screens |
