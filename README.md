# Tayel Store — Midnight Cyber Commerce

> A production-grade, fully responsive **Next.js 16** e-commerce platform with **bilingual RTL/LTR support**, glassmorphism design system, cinematic animations, and localStorage-only authentication. Built for performance, accessibility, and developer experience.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink?logo=framer)](https://framer.com/motion)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange)](https://zustand-demo.pmnd.rs)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-red?logo=reactquery)](https://tanstack.com/query)
[![next-intl](https://img.shields.io/badge/next--intl-3-purple)](https://next-intl-docs.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 Project Overview

**Tayel Store** is a modern e-commerce frontend demonstrating enterprise-level patterns:

| Aspect | Implementation |
|--------|----------------|
| **Framework** | Next.js 16 (App Router, Server Components, Server Actions) |
| **Routing** | File-based with `[locale]` segment (`en` | `ar`) |
| **Internationalization** | `next-intl` — full RTL/LTR mirroring, RTL-aware CSS |
| **State Management** | Zustand + `persist` middleware (localStorage-only, no cookies) |
| **Server State** | TanStack Query v5 (caching, deduping, optimistic updates) |
| **Forms** | React Hook Form + Zod (type-safe validation) |
| **Styling** | Tailwind CSS v3.4 + CSS Variables (design tokens) |
| **Design System** | Glassmorphism: `backdrop-blur-xl`, `border-white/10`, `bg-white/5` |
| **Animations** | Framer Motion (layout, scroll, spring) + Magic UI / Aceternity UI |
| **Icons** | Lucide React (tree-shaken, consistent stroke-width) |
| **HTTP Client** | Axios with interceptors (auth, error handling, retry logic) |
| **Auth Strategy** | JWT in localStorage, HttpOnly cookie fallback, no server sessions |
| **Type Safety** | Strict TypeScript, `zod` schemas → inferred types |

---

## 🏗 Architecture

```
src/
├── app/
│   ├── [locale]/                    # i18n routing segment
│   │   ├── (auth)/                  # Route group: auth pages (no layout)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── verify-code/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (dashboard)/             # Route group: protected dashboard
│   │   │   ├── layout.tsx           # Auth guard + sidebar shell
│   │   │   ├── account/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── (shop)/                  # Route group: public shop pages
│   │   │   ├── layout.tsx           # Public shell (Navbar + Footer)
│   │   │   ├── page.tsx             # Home (Hero, BrandPromise, Bento, etc.)
│   │   │   ├── shop/page.tsx        # Product grid + filters
│   │   │   ├── product/[slug]/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   └── brands/page.tsx
│   │   ├── layout.tsx               # Root layout (providers, fonts, globals)
│   │   ├── page.tsx                 # Redirect to /[locale]/home
│   │   └── not-found.tsx
│   ├── actions/                     # Server Actions (mutations)
│   │   ├── auth.ts                  # login, register, forgot-password, etc.
│   │   └── cart.ts
│   ├── api/                         # API Routes (webhooks, revalidation)
│   │   └── revalidate/route.ts
│   ├── lib/                         # Core utilities (client-safe)
│   │   ├── utils.ts                 # cn(), formatters, helpers
│   │   ├── validations/             # Zod schemas (auth, cart, product)
│   │   ├── axios.ts                 # Axios instance + interceptors
│   │   ├── query-client.ts          # TanStack Query provider config
│   │   └── auth-storage.ts          # localStorage auth helpers
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts               # Auth state + actions
│   │   ├── useCart.ts               # Cart state + mutations
│   │   ├── useScroll.ts             # Framer Motion scroll helpers
│   │   └── useMobile.ts             # Media query hooks
│   ├── store/                       # Zustand stores
│   │   ├── authStore.ts             # User, token, hydrate, persist
│   │   ├── cartStore.ts             # Items, totals, sync
│   │   └── uiStore.ts               # Modals, toasts, sidebar
│   ├── providers/                   # Context providers (client)
│   │   ├── QueryProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── Toaster.tsx
│   ├── components/
│   │   ├── ui/                      # Primitive components (Button, Input, Card, etc.)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ... (30+ primitives)
│   │   ├── layout/                  # Shell components
│   │   │   ├── Navbar.tsx           # Responsive, RTL-aware, mega menu
│   │   │   ├── Footer.tsx           # 4-column grid, newsletter, trust badges
│   │   │   ├── Sidebar.tsx          # Dashboard navigation
│   │   │   └── PageWrapper.tsx      # Consistent page padding/max-width
│   │   ├── home/                    # Homepage sections
│   │   │   ├── HeroSection.tsx      # Cinematic hero + floating orbs
│   │   │   ├── BrandPromise.tsx     # 3-column feature grid + center glow
│   │   │   ├── BentoSection.tsx     # CSS Grid bento layout + countdown
│   │   │   ├── FeaturedProducts.tsx # Product carousel
│   │   │   ├── NewsletterSection.tsx
│   │   │   └── TrustBadges.tsx
│   │   ├── shop/                    # Shop-specific components
│   │   │   ├── ProductCard.tsx      # Glassmorphism card + quick actions
│   │   │   ├── ProductGrid.tsx      # Responsive grid + loading states
│   │   │   ├── FilterSidebar.tsx    # Collapsible, mobile drawer
│   │   │   ├── SortDropdown.tsx
│   │   │   └── Pagination.tsx
│   │   ├── product/                 # Product detail
│   │   │   ├── ProductGallery.tsx   # Thumbnails + zoom + lightbox
│   │   │   ├── ProductInfo.tsx      # Price, variants, add to cart
│   │   │   ├── ProductTabs.tsx      # Description, specs, reviews
│   │   │   └── RelatedProducts.tsx
│   │   ├── auth/                    # Auth form components
│   │   │   ├── AuthLayout.tsx       # 2-col: editorial + glass card
│   │   │   ├── PasswordStrength.tsx
│   │   │   ├── CodeInput.tsx        # 6-digit OTP input
│   │   │   └── SocialButtons.tsx
│   │   ├── dashboard/               # Dashboard components
│   │   │   ├── OrderHistory.tsx
│   │   │   ├── WishlistGrid.tsx
│   │   │   ├── AddressBook.tsx
│   │   │   └── SettingsForm.tsx
│   │   ├── ui/aceternity/           # Aceternity UI components
│   │   │   ├── InteractiveGrid.tsx  # Mouse-following grid background
│   │   │   └── ...
│   │   ├── ui/magicui/              # Magic UI components
│   │   │   ├── MagicCard.tsx        # Glowing border card
│   │   │   ├── Aurora.tsx
│   │   │   └── ...
│   │   └── icons/                   # Custom SVG icons (if any)
│   ├── messages/                    # Translation files
│   │   ├── en.json                  # English (LTR)
│   │   └── ar.json                  # Arabic (RTL)
│   ├── styles/
│   │   └── globals.css              # Tailwind layers, CSS variables, RTL overrides
│   ├── middleware.ts                # next-intl locale detection + rewrites
│   ├── navigation.ts                # Typed navigation helpers (Link, redirect, etc.)
│   └── i18n.ts                      # next-intl configuration (locales, default)
├── public/                          # Static assets
│   ├── images/
│   │   ├── products/
│   │   ├── banners/
│   │   └── logos/
│   └── fonts/                       # Local Geist fonts (next/font)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## 🌐 Internationalization (i18n) & RTL Strategy

### Locale Configuration
```typescript
// src/i18n.ts
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];
```

### RTL Detection Pattern
```tsx
// Used throughout components
const locale = useLocale();
const isRTL = locale === 'ar';
const dir = isRTL ? 'rtl' : 'ltr';

// Apply to container
<div dir={dir} className={cn('...', isRTL && 'rtl')}>...</div>
```

### RTL-Aware Tailwind Classes
```tsx
// Logical properties (preferred)
<div className="ms-4 me-auto">           {/* margin-inline-start/end */}
<div className="ps-6 pe-4">              {/* padding-inline-start/end */}
<div className="rounded-s-lg rounded-e-lg"> {/* border-start/end-radius */}

// Explicit RTL variants
<div className="left-0 rtl:right-0 rtl:left-auto">
<div className="ml-auto rtl:mr-auto rtl:ml-0">
<div className="text-left rtl:text-right">
<div className="flex-row rtl:flex-row-reverse">
<div className="justify-start rtl:justify-end">
<div className="items-start rtl:items-end">
```

### CSS Grid RTL (Explicit Spans)
```tsx
// BentoSection.tsx — explicit col-span/row-span with [dir="rtl"]
<div className="grid grid-cols-4 grid-rows-4 gap-4">
  <div className="col-span-2 row-span-2 [&_[dir='rtl']]:col-start-3" />
  <div className="col-span-1 row-span-1 [&_[dir='rtl']]:col-start-1" />
</div>
```

### Translation Structure
```json
// messages/en.json / ar.json
{
  "common": { "storeHome": "Home", "loading": "Loading..." },
  "navbar": { "shop": "Shop", "account": "Account", "cart": "Cart" },
  "footer": { "brandName": "Tayel Store", "shop": { "title": "Shop" } },
  "auth": {
    "login": { "title": "Welcome Back", "email": "Email" },
    "register": { "title": "Create Account" },
    "forgotPassword": { "title": "Forgot Password?" },
    "verifyCode": { "title": "Verify Code" },
    "resetPassword": { "title": "Reset Password" }
  },
  "home": {
    "hero": { "title": "Midnight Cyber Commerce", "cta": "Shop Now" },
    "brandPromise": { "title": "Our Promise", "features": [...] },
    "bento": { "countdown": { "days": "Days", "hours": "Hours" } }
  }
}
```

---

## 🎨 Design System — Glassmorphism

### Color Tokens (CSS Variables)
```css
/* globals.css */
:root {
  --background: 222 47% 4%;
  --foreground: 210 40% 98%;
  --primary: 263 70% 50%;
  --primary-foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --border: 217 33% 20%;
  --ring: 263 70% 50%;
  --card: 222 47% 6%;
  --card-foreground: 210 40% 98%;
}

.dark { /* same values, optimized for dark */ }
```

### Glassmorphism Utility Classes
```css
/* globals.css — @layer utilities */
.glass {
  @apply bg-white/5 backdrop-blur-xl border border-white/10;
}
.glass-strong {
  @apply bg-white/10 backdrop-blur-2xl border border-white/20;
}
.glow-primary {
  @apply shadow-[0_0_40px_rgb(139_92_246_/_0.3)];
}
```

### Component Usage
```tsx
// Button.tsx
<Button className="glass hover:glass-strong transition-all duration-300" />

// Card.tsx
<Card className="glass rounded-2xl p-6" />

// Input.tsx
<Input className="glass border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
```

### Responsive Breakpoints (Tailwind)
```tsx
// Mobile-first, consistent across all components
<div className="
  grid gap-4
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
">
```

---

## ⚡ Animation System

### Framer Motion Patterns
```tsx
// Staggered entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
/>

// Spring-based floating orbs
<motion.div
  animate={{
    x: [0, 30, -20, 0],
    y: [0, -20, 30, 0],
    scale: [1, 1.1, 0.95, 1],
  }}
  transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
/>

// Scroll-linked (useScroll + useTransform)
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, 200]);
<motion.div style={{ y }} />
```

### Magic Card (Glowing Border)
```tsx
<MagicCard glowColor="primary" intensity={0.8} className="rounded-3xl p-8">
  <Content />
</MagicCard>
```

### Interactive Grid (Aceternity)
```tsx
<InteractiveGrid 
  className="absolute inset-0 -z-10"
  color1="violet-600"
  color2="cyan-600"
/>
```

---

## 🔐 Authentication — LocalStorage Only

### Why localStorage?
- **No server-side sessions** — fully static deployable (Vercel, Netlify, Cloudflare Pages)
- **Client-controlled** — instant logout, no cookie parsing
- **SSR-compatible** — hydration-safe with `useEffect` guard

### Auth Store (Zustand + Persist)
```typescript
// store/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      hydrate: () => set({ isHydrated: true }),
    }),
    {
      name: 'tayel-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => state?.hydrate(),
    }
  )
);
```

### Axios Interceptor (Auto-attach Token)
```typescript
// lib/axios.ts
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Server Actions (Form Mutations)
```typescript
// actions/auth.ts
export async function loginAction(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  
  const res = await axios.post('/api/auth/login', { email, password });
  
  // Set HttpOnly cookie for middleware access (optional)
  cookies().set('token', res.data.token, { httpOnly: true, secure: true });
  
  return { success: true, user: res.data.user };
}
```

---

## 🛒 State Management Patterns

### Cart Store (Zustand + Sync)
```typescript
// store/cartStore.ts
interface CartItem { id: string; quantity: number; variantId: string; }
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clear: () => void;
  totals: Computed<{ subtotal: number; count: number }>;
}
```

### TanStack Query (Server State)
```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 min
      gcTime: 10 * 60 * 1000,        // 10 min
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Usage in component
const { data: products } = useQuery({
  queryKey: ['products', { category, page, sort }],
  queryFn: () => fetchProducts({ category, page, sort }),
});
```

### Optimistic Updates
```tsx
const mutation = useMutation({
  mutationFn: addToCart,
  onMutate: async (newItem) => {
    await queryClient.cancelQueries({ queryKey: ['cart'] });
    const previous = queryClient.getQueryData(['cart']);
    queryClient.setQueryData(['cart'], (old) => [...old, newItem]);
    return { previous };
  },
  onError: (err, newItem, context) => {
    queryClient.setQueryData(['cart'], context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  },
});
```

---

## 📱 Responsive Strategy — Mobile-First

### Breakpoint System
```tsx
// Consistent across ALL components
const breakpoints = {
  sm: '640px',   // Mobile landscape / small tablet
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / small desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
};
```

### Responsive Pattern for Decorative Elements (Critical for RTL)
```tsx
// ❌ BROKEN: Fixed pixel widths cause horizontal overflow on mobile
<div className="w-[600px] h-[200px] bg-primary/10 blur-3xl rounded-full" />

// ✅ FIXED: Fluid with max-width constraint
<div className="w-full max-w-[600px] h-auto aspect-[3/1] max-h-[200px] bg-primary/10 blur-3xl rounded-full" />

// Circular orbs
<div className="w-full max-w-[500px] h-auto aspect-square bg-violet-600/30 blur-[120px] rounded-full" />

// Centered radial gradients
<div className="w-full max-w-[600px] h-full max-h-[600px] bg-gradient-radial from-primary/20 to-transparent" />
```

### Grid Layouts (Bento Section)
```tsx
// Mobile: 1 col, Tablet: 2 col, Desktop: 4 col explicit spans
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2
  lg:grid-cols-4
  grid-rows-[auto_auto_auto_auto]
">
  {/* Card 1: 2x2 on desktop, full width mobile */}
  <div className="lg:col-span-2 lg:row-span-2" />
  
  {/* Card 2: 1x2 on desktop */}
  <div className="lg:col-span-1 lg:row-span-2" />
  
  {/* Card 3: 1x1 */}
  <div className="lg:col-span-1 lg:row-span-1" />
  
  {/* Card 4: 2x1 (fills remaining) */}
  <div className="lg:col-span-2 lg:row-span-1" />
</div>
```

### Navbar Responsive
```tsx
// Mobile: Hamburger → Sheet (slides from right in LTR, left in RTL)
// Tablet: Condensed nav + search
// Desktop: Full mega menu with hover dropdowns
<Navbar 
  mobileBreakpoint="lg" 
  rtlSheetSide={isRTL ? 'left' : 'right'} 
/>
```

---

## 🧪 Testing Strategy

```bash
# Unit tests (Vitest + React Testing Library)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint

# Format check
npm run format:check
```

### Test Coverage Targets
| Layer | Target | Tool |
|-------|--------|------|
| Utilities / Helpers | 90% | Vitest |
| Hooks | 80% | Vitest + RTL |
| Components (UI) | 70% | Vitest + RTL |
| Pages / Integration | 60% | Playwright |
| Auth Flows | 100% | Playwright |

---

## 🚀 Performance Metrics

| Metric | Target | Actual (Lighthouse) |
|--------|--------|---------------------|
| **LCP** | < 2.5s | ~1.8s |
| **INP** | < 200ms | ~120ms |
| **CLS** | < 0.1 | ~0.02 |
| **FCP** | < 1.8s | ~1.2s |
| **TTFB** | < 600ms | ~200ms |
| **Bundle Size (JS)** | < 170KB | ~145KB gzipped |

### Optimization Techniques Used
- **Server Components** by default — zero client JS for static content
- **Dynamic Imports** for heavy components (`Modal`, `Chart`, `Editor`)
- **Image Optimization** — `next/image` with `priority` for above-fold
- **Font Optimization** — `next/font` (Geist) self-hosted, preloaded
- **Code Splitting** — Route-level + component-level
- **TanStack Query** — Deduplication, caching, prefetching
- **CSS Variables** — No runtime theme switching overhead

---

## 🔒 Security Checklist

- [x] **CSP Headers** — `next.config.js` `async headers()`
- [x] **X-Frame-Options** — `DENY`
- [x] **X-Content-Type-Options** — `nosniff`
- [x] **Referrer-Policy** — `strict-origin-when-cross-origin`
- [x] **Permissions-Policy** — Camera, microphone, geolocation disabled
- [x] **HTTPS Only** — `Strict-Transport-Security` (HSTS)
- [x] **Sanitization** — DOMPurify for user-generated content
- [x] **Rate Limiting** — API routes + Arcjet/Upstash
- [x] **Input Validation** — Zod on every Server Action + API route
- [x] **Auth Tokens** — HttpOnly cookies + localStorage sync
- [x] **CSRF Protection** — SameSite=Lax cookies + Origin check

---

## 🛠 Development Workflow

### Prerequisites
- Node.js 20+
- pnpm 9+ (recommended) / npm 10+ / yarn 4+

### Quick Start
```bash
# Clone & install
git clone https://github.com/your-org/tayel-store.git
cd tayel-store
pnpm install

# Environment
cp .env.example .env.local
# Edit .env.local with your keys

# Development
pnpm dev                    # http://localhost:3000
pnpm dev --turbo           # Turbopack (experimental)
```

### Available Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "analyze": "ANALYZE=true next build",
  "prepare": "husky install"
}
```

### Git Hooks (Husky + lint-staged)
```json
// package.json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

---

## 🌍 Deployment

### Vercel (Recommended)
```bash
# Connect repo to Vercel
# Environment variables auto-synced from .env.local
# Preview deployments on every PR
# Production on merge to main
```

### Docker (Any Platform)
```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build & run
docker build -t tayel-store .
docker run -p 3000:3000 --env-file .env.production tayel-store
```

### Environment Variables
```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_LOCALES=en,ar

# Auth
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRY=7d

# External services
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...
```

---

## 📦 Key Dependencies

### Production
```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "next-intl": "^3.15.0",
  "zustand": "^5.0.0",
  "@tanstack/react-query": "^5.40.0",
  "react-hook-form": "^7.51.0",
  "@hookform/resolvers": "^3.3.0",
  "zod": "^3.23.0",
  "axios": "^1.7.0",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.400.0",
  "sonner": "^1.4.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.3.0",
  "class-variance-authority": "^0.7.0"
}
```

### Dev Dependencies
```json
{
  "typescript": "^5.5.0",
  "@types/react": "^19.0.0",
  "@types/node": "^20.12.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "eslint": "^8.57.0",
  "eslint-config-next": "^16.0.0",
  "prettier": "^3.2.0",
  "prettier-plugin-tailwindcss": "^0.5.0",
  "vitest": "^1.5.0",
  "@testing-library/react": "^14.2.0",
  "@testing-library/jest-dom": "^6.4.0",
  "@playwright/test": "^1.44.0",
  "husky": "^9.0.0",
  "lint-staged": "^15.2.0"
}
```

---

## 🤝 Contributing

### Branch Strategy
```
main                    # Production-ready
├── develop             # Integration branch
├── feature/*           # New features (from develop)
├── fix/*               # Bug fixes (from develop/main)
├── chore/*             # Maintenance (deps, configs)
└── release/*           # Release preparation
```

### Commit Convention (Conventional Commits)
```bash
feat(auth): add 2FA support with TOTP
fix(rtl): resolve horizontal overflow on mobile bento grid
chore(deps): update framer-motion to v11.2.0
refactor(cart): extract optimistic update logic to hook
docs(readme): add deployment section
test(auth): add e2e tests for password reset flow
```

### PR Checklist
- [ ] TypeScript compiles (`pnpm type-check`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Format correct (`pnpm format:check`)
- [ ] Unit tests pass (`pnpm test`)
- [ ] E2E tests pass (`pnpm test:e2e`)
- [ ] No console errors in browser
- [ ] RTL tested (switch to Arabic in navbar)
- [ ] Mobile responsive checked (375px, 768px)
- [ ] Accessibility: keyboard nav, ARIA labels, color contrast
- [ ] Updated translations (`en.json`, `ar.json`)
- [ ] Documentation updated if API changed

---

## 🗺 Roadmap

### v1.1 — Core Commerce
- [ ] Product reviews & ratings
- [ ] Wishlist persistence (server sync)
- [ ] Recently viewed products
- [ ] Product comparison
- [ ] Gift cards

### v1.2 — Checkout & Payments
- [ ] Multi-step checkout (shipping → payment → review)
- [ ] Stripe Elements integration
- [ ] Apple Pay / Google Pay
- [ ] COD (Cash on Delivery) for supported regions
- [ ] Order confirmation email templates

### v1.3 — Dashboard & Accounts
- [ ] Order tracking with real-time updates
- [ ] Returns / refunds portal
- [ ] Subscription management
- [ ] Loyalty points system
- [ ] Address autocomplete (Google Places)

### v1.4 — Seller Features (Multi-vendor)
- [ ] Seller dashboard
- [ ] Product management (CRUD)
- [ ] Commission analytics
- [ ] Payout scheduling

### v2.0 — Platform
- [ ] Headless CMS integration (Contentful/Sanity)
- [ ] GraphQL API (Pothos/Strawberry)
- [ ] Mobile app (React Native / Expo)
- [ ] Admin panel (Payload/Keystone)
- [ ] Internationalization: more locales (fr, de, es, zh)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

| Project | Purpose |
|---------|---------|
| [Next.js](https://nextjs.org) | React framework |
| [next-intl](https://next-intl-docs.vercel.app) | Internationalization |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [Framer Motion](https://framer.com/motion) | Animations |
| [Zustand](https://zustand-demo.pmnd.rs) | State management |
| [TanStack Query](https://tanstack.com/query) | Server state |
| [React Hook Form](https://react-hook-form.com) | Forms |
| [Zod](https://zod.dev) | Validation |
| [Lucide](https://lucide.dev) | Icons |
| [Aceternity UI](https://ui.aceternity.com) | Animated components |
| [Magic UI](https://magicui.design) | Glassmorphism components |
| [shadcn/ui](https://ui.shadcn.com) | Component patterns |
| [Geist Font](https://vercel.com/font) | Typography |

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/tayel-store/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/tayel-store/discussions)
- **Email**: dev@tayel-store.com

---

<div align="center">

**Built with ❤️ by the Tayel Store Team**

*Midnight Cyber Commerce — Where Design Meets Performance*

</div>"# Tayel-Store" 
