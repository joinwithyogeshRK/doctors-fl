# Meridian Health — healthcare platform demo

A production-quality frontend for a complete healthcare product: a public marketing
site, doctor discovery and booking, telemedicine, an online pharmacy with checkout and
delivery tracking, and three dashboards (patient, doctor, admin).

Everything runs on mock data in the browser. There is no backend, no payment provider,
no real clinic and no real patient record.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components) + React 19 + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Motion (Framer Motion) for the orchestrated hero and interaction feedback
- Lucide icons; charts are hand-built SVG with a CVD-validated palette
- State persists to `localStorage` through a small external store (`src/lib/store.ts`)

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint
```

## What's in it

**Public site** — home, doctor discovery with live filtering and sorting, full doctor
profiles with a sticky booking panel, 12 specialty pages, an eight-step appointment
booking flow with simulated payment, a telemedicine room (lobby → call → summary), a
38-product pharmacy, a wellness store, cart with coupons, six-step checkout, order
tracking, health blog, about, services, contact, FAQ, a doctor-onboarding landing page,
global search, notifications, and auth screens.

**Patient portal** (`/patient/*`) — overview, appointments with reschedule and cancel,
saved doctors, medical records, prescriptions, medicine orders, payments, health
profile, settings.

**Doctor portal** (`/doctor/*`) — clinic overview, appointment management, patient
records, a weekly schedule editor, consultations, a prescription builder with a
printable preview, reviews with replies, analytics.

**Admin console** (`/admin/*`) — platform analytics and management tables for doctors,
patients, appointments, pharmacy, reviews and content.

## Exploring it

No registration. Use the **Demo** menu in the header, or the demo panel on
`/auth/login`, to enter as a patient, a doctor or an administrator.

Demo coupons in the pharmacy: `HEALTH10`, `WELCOME15`.
Reset all demo state from any portal's Settings page.

## Project layout

```
src/
├── app/
│   ├── (site)/      public marketing site
│   ├── (auth)/      sign in, sign up, password reset
│   └── (portal)/    patient, doctor and admin dashboards
├── components/      ui, layout, home, doctors, pharmacy, dashboard, charts, …
├── data/            the mock-data layer
├── store/           cart, wishlist, session, orders, appointments, notifications
├── hooks/  lib/  types/
```

## Notes on the data and the imagery

Every doctor, patient, hospital, review, product, price and statistic is fictional.
Doctor portraits and pharmacy packshots are generated (tinted monograms and
category-tinted tiles) rather than stock photography, so a roster with no supplied
photos still looks deliberate. The 3D objects in the hero and elsewhere were supplied
as flattened screenshots and were keyed back to true transparency during the build.

## This is a demonstration

Nothing here is medical advice. No appointment is made with a real clinic, no payment
is processed and no medicine is dispensed. If you are experiencing a medical emergency,
contact your local emergency service immediately.
