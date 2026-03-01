# CivicSync AI — Digital Civic Services Kiosk

A full-stack production-ready civic digital kiosk web platform built with Next.js, TypeScript, TailwindCSS, Prisma ORM, and Neon PostgreSQL.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **ORM**: Prisma v7 with PostgreSQL adapter
- **Database**: Neon PostgreSQL (serverless)
- **Auth**: JWT (HttpOnly cookies)
- **Validation**: Zod
- **Deployment**: Vercel

## Features

### Citizen Features
- OTP-based login (simulated with code `123456`)
- View & pay utility bills (mock Stripe-ready flow)
- File civic complaints to government departments
- Track complaint status in real-time
- Multi-language support (English, Hindi, Telugu)

### Admin Features
- Admin dashboard with analytics
- View all complaints and update statuses
- View payment transaction logs
- Role-based access control (RBAC)

### Accessibility
- WCAG-friendly UI
- High contrast mode toggle
- Large font mode toggle
- i18n support (English, Hindi, Telugu)
- Proper ARIA labels throughout
- Screen reader friendly structure
- Skip-to-content link

### Security
- JWT auth stored in HttpOnly cookies
- Role-based route protection via middleware
- Zod validation on all inputs
- Rate limiting middleware
- Secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- Auto-logout after 15 minutes of inactivity
- Audit logging on all critical actions

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
cd civicsync-ai
npm install
```

### Environment Setup

Create `.env.local`:
```env
DATABASE_URL="your-neon-postgresql-connection-string"
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OTP_CODE="123456"
SESSION_TIMEOUT_MINUTES=15
```

Also set `DATABASE_URL` in `.env` (used by Prisma CLI).

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

### Login Flow
1. Go to `/login`
2. Enter any phone number (10+ digits)
3. Enter OTP: `123456`
4. Name is optional (for new users)

### Making a User ADMIN
Run this SQL in the Neon dashboard:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE phone = 'YOUR_PHONE_NUMBER';
```

### Seeding Sample Bills
After becoming admin, call `POST /api/admin/seed` to create sample bills.

## Project Structure

```
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Auth endpoints (send-otp, verify-otp, logout, me)
│   │   │   ├── billing/       # Billing endpoints (list, pay)
│   │   │   ├── complaint/     # Complaint endpoints (list, create)
│   │   │   └── admin/         # Admin endpoints (dashboard, complaints, payments)
│   │   ├── admin/             # Admin pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── login/             # Login page
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── layout/            # Header, Footer, AccessibilityBar
│   │   ├── providers/         # AppProvider (context)
│   │   └── ui/                # Reusable UI components
│   └── lib/
│       ├── auth/              # JWT & cookie utilities
│       ├── db/                # Prisma client
│       ├── i18n/              # Translations (en, hi, te)
│       ├── middleware/        # Auth, rate limit, security, audit
│       └── validators/        # Zod schemas
├── middleware.ts               # Next.js middleware (auth, RBAC, security)
└── vercel.json                # Vercel deployment config
```

## Deploying to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OTP_CODE`
   - `SESSION_TIMEOUT_MINUTES`
4. Deploy — Vercel auto-detects Next.js

The `vercel.json` config includes `npx prisma generate` in the build command.

## Payment Integration (Stripe-ready)

The payment flow at `/api/billing/pay` is structured for easy Stripe integration:
1. Replace mock logic with `stripe.paymentIntents.create()`
2. Add webhook handler at `/api/billing/webhook`
3. Update bill status on webhook confirmation

## License

MIT
