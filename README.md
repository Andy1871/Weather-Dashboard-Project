# Weather Dashboard

A **full-stack weather dashboard** built with Next.js 14 App Router. Search and save locations, pin a favourite for quick access, and compare live weather across capital cities in every continent — all behind secure Google OAuth authentication.

**Live Demo:** https://weather-dashboard-chi-gules.vercel.app/ — free, secure login via Google. Screenshots below if preferred.

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-18181B?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## Features

- **Favourite Location Banner** — pin any location to the homepage for at-a-glance current conditions, today's forecast, and a 7-day outlook
- **Saved Locations** — search, save and filter an unlimited personal list of locations, each showing live weather data
- **Continents Explorer** — browse live weather for 44+ capital cities grouped by continent, with per-capital local time (timezone-aware) and a real-time search filter
- **Location Search** — debounced geocoding search with abort-controller cancellation and `Intl.DisplayNames` country name normalisation
- **User Authentication** — Google OAuth via Supabase; protected routes enforced at the layout level (server-side)
- **Intelligent API Fallback** — attempts OpenWeatherMap One Call 3.0, falls back to the 2.5 endpoint automatically with data normalisation across both formats
- **ISR Caching** — weather API routes revalidate every 10 minutes, reducing external API calls and improving response times
- **Optimistic UI Updates** — saved locations list updates immediately on add/remove with automatic rollback on error
- **Responsive Design** — adaptive grid layouts from mobile through wide desktop

---

## Tech Stack

| Category | Technology | Notes |
|---|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) | Server Components, Server Actions, dynamic routing |
| Language | TypeScript 5 | Strict mode throughout |
| UI | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Accessible, unstyled primitives with custom variants |
| Styling | Tailwind CSS 4 | Custom oklch colour variables, class-variance-authority |
| Auth & DB | [Supabase](https://supabase.com/) | Google OAuth, PostgreSQL, Row-Level Security |
| Weather API | [OpenWeatherMap](https://openweathermap.org/) | One Call 3.0 + 2.5 fallback, Geocoding API |
| Date handling | date-fns 4 | Timezone-aware formatting |
| Deployment | [Vercel](https://vercel.com/) | Auto-deploy on push, ISR caching |
| Dev tooling | Turbopack | Fast HMR in development |

---

## Architecture

The app follows a **server-first** approach using Next.js App Router conventions. Route groups separate public and authenticated surfaces; Server Actions handle all data mutations securely without exposing additional API routes.

```
src/
├── app/
│   ├── (auth)/                    # Public routes (no auth required)
│   │   ├── login/page.tsx         # Google OAuth login page
│   │   └── auth/callback/route.ts # OAuth redirect handler
│   ├── (protected)/               # Auth-guarded route group
│   │   ├── layout.tsx             # Server-side session check → redirect to /login
│   │   ├── page.tsx               # Homepage: favourite location banner + nav cards
│   │   ├── continents/
│   │   │   ├── page.tsx           # Continent selector grid
│   │   │   └── [continent]/       # Dynamic: live weather for all capitals
│   │   └── savedLocations/        # Personal saved locations with search/filter
│   ├── actions/                   # Next.js Server Actions (secure DB mutations)
│   │   ├── savedLocations.ts      # getSaved, addLocation, removeLocation
│   │   └── setFavouriteByDetails.ts # Atomic favourite upsert
│   └── api/
│       ├── weather/route.ts       # Weather fetch: One Call 3.0 → 2.5 fallback
│       ├── forecast/route.ts      # 7-day forecast endpoint
│       └── locations/search/      # Geocoding search
├── components/
│   ├── ui/                        # shadcn/ui + custom components
│   ├── FavouriteLocationBanner/   # Favourite location feature
│   ├── saved/                     # Saved locations + add-location modal
│   └── continents/                # Continent cards + capital weather cards
├── lib/
│   ├── supabase/                  # Server + browser Supabase clients
│   ├── weatherAdapter.ts          # Normalises One Call 3.0 and 2.5 responses
│   └── buildLiveWeatherByCapital.ts # Parallel fetch for continent pages
├── types/weather.ts               # Shared TypeScript interfaces
└── data/continents/               # Static capital city coordinates (6 continents)
```

### Data Flow

```
User request
  → Next.js Server Component (auth check via Supabase session)
    → Server Action / API Route
      → OpenWeatherMap API (One Call 3.0, fallback to 2.5)
        → weatherAdapter.ts (normalises response into shared type)
          → Component renders with typed data
            → Supabase (saves user preference to PostgreSQL)
```

---

## Technical Highlights

### Intelligent API Fallback
The weather API route first attempts the OpenWeatherMap One Call 3.0 endpoint (which provides IANA timezone strings for accurate DST handling). If unavailable, it transparently falls back to the 2.5 current + 3-hour forecast endpoints, aggregating 3-hour intervals into daily min/max figures and mapping the shared `WeatherData` type — the UI sees a single consistent interface regardless of which API responded.

### Server-First State Management (No Redux/Zustand)
All data fetching and mutations flow through Server Components and Server Actions. Client-side state is limited to UI concerns (search terms, loading flags, modal open state). This removes the need for a global store entirely and keeps sensitive operations (DB writes, session reads) on the server.

### Atomic Favourite Location Updates
Setting a favourite location is handled atomically in a single Server Action: it unsets any existing favourite, then either inserts a new row or updates the `is_favorite` flag on an existing saved location — preventing any state where a user could have two favourites.

### Optimistic UI with Rollback
The saved locations list updates instantly on add/remove before the Server Action resolves. If the action fails, the previous state is restored, so the UI is always consistent with the database.

### Parallel Capital City Weather Fetching
The continents explorer fetches live weather for up to 44 capitals simultaneously using `Promise.all()`. Each request is individually error-handled so a single failed capital does not block the entire page from rendering.

### Debounced Search with Abort Controller
Location search fires a geocoding request after a 300 ms debounce. Each new keystroke cancels the in-flight request via `AbortController`, preventing race conditions and unnecessary API calls.

### Timezone-Aware Time Display
Local times for capital cities attempt (in order): IANA timezone string from One Call 3.0, UTC offset seconds from the 2.5 response, then the browser's local time as a last resort — ensuring correct display even across DST boundaries.

### Protected Routes at the Layout Level
Authentication is enforced in the `(protected)/layout.tsx` Server Component. Any unauthenticated request to a protected route is redirected to `/login` before any child component renders, making it impossible to access protected UI.

---

## Key Skills Demonstrated

- **Next.js App Router** — route groups, dynamic segments, nested layouts, Server Components, Server Actions, ISR
- **TypeScript** — strict types, shared interfaces, type guards across server/client boundary
- **Full-stack architecture** — database design, secure API routes, OAuth flow, Row-Level Security
- **Performance** — ISR caching, parallel data fetching, debouncing, abort controllers
- **UX patterns** — optimistic updates with rollback, graceful error handling, responsive grid layouts
- **Third-party API integration** — multi-endpoint fallback strategy, data normalisation, geocoding
- **Accessible UI** — Radix UI primitives, semantic HTML, keyboard-navigable modals

---

## Screenshots

**Homepage with Favourite Location Banner**

<img width="1035" height="876" alt="Homepage" src="https://github.com/user-attachments/assets/b02804ea-361e-4676-acc9-acb366d9c216" />

**Change Favourite Location Modal with Search**

<img width="486" height="550" alt="New favourite location - weather app" src="https://github.com/user-attachments/assets/cb15dffb-f579-4c25-acfd-1889113430ba" />

**Saved Locations Page with Search Filter**

<img width="1237" height="721" alt="Saved locations" src="https://github.com/user-attachments/assets/e5fa31d5-9c99-426e-880d-9b6c036e9987" />

**Europe Continent Page — all continents available**

<img width="1127" height="501" alt="Europe" src="https://github.com/user-attachments/assets/aa13b911-a4e5-448a-9ab1-c2583ba1a3e5" />

---

## Local Development

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) project with Google OAuth configured
- An [OpenWeatherMap](https://openweathermap.org/api) API key (One Call 3.0 or free 2.5)

### Setup

```bash
git clone <repo-url>
cd weather-app
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENWEATHER_API_KEY=your_openweathermap_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
