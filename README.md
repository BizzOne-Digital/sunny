# DTdogs.ca / Hand & Paw

Premium pet-care website for DTdogs.ca / Hand & Paw, built with Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, MongoDB/Mongoose, Cloudinary media uploads and Resend booking emails.

## Getting Started

1. Copy `.env.example` to `.env.local`.
2. Add your MongoDB Compass connection string, for example `mongodb://127.0.0.1:27017/dtdogs`.
3. Add `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` and `SEED_TOKEN`.
4. Add Cloudinary credentials for admin media uploads.
5. Add Resend credentials if booking emails should send during testing.

Run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin

Admin login is available at `/admin/login`.

The first admin user is created automatically from:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

The admin includes:

- Dashboard
- Booking queue with status tracking
- Media library with Cloudinary uploads
- Generic CMS editors for pages, services, pricing, testimonials, FAQs, blog, products and team

## Database Seed

The site renders with safe fallback content before MongoDB is seeded. To copy the starter content into MongoDB, call:

```sh
curl -X POST http://localhost:3000/api/seed -H "x-seed-token: YOUR_SEED_TOKEN"
```

On Windows PowerShell:

```powershell
Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/seed" -Headers @{ "x-seed-token" = "YOUR_SEED_TOKEN" }
```

## Verification

```sh
npm run lint
npm run build
```

Both commands should pass before deployment.
