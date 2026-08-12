# Sprint 2A: Supabase Foundation + Admin Auth + Projects CRUD

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fully working Supabase-backed admin dashboard at `/admin` with email/password auth, a complete Projects CRUD interface with image uploads, and middleware-protected routes — while leaving the existing public homepage completely untouched.

**Architecture:** The existing root layout wraps every route with Navigation/SmoothScrollProvider/Logo — admin must not inherit these, so Task 2 restructures public routes into a `(public)` route group with their own sub-layout, leaving the root layout minimal. Admin lives at `/admin/*` with its own layout, sidebar, and design language. Server Actions handle all mutations; middleware handles auth redirects.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase (`@supabase/ssr`), Zod, React Hook Form + `@hookform/resolvers`, TypeScript

---

## Pre-flight checks

Before starting, verify:
- `pnpm dev` (or `npm run dev`) runs without errors
- Homepage reel plays at `http://localhost:3000`
- Git status is clean (`git status`)

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm install)

**Step 1: Install packages**

```bash
npm install @supabase/ssr @supabase/supabase-js zod react-hook-form @hookform/resolvers
```

**Step 2: Verify install**

```bash
npm ls @supabase/ssr zod react-hook-form
```
Expected: all three listed with version numbers, no errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add supabase/ssr, zod, react-hook-form"
```

---

## Task 2: Restructure public routes into (public) route group

The root `layout.tsx` currently wraps everything with `<Navigation>`, `<Logo>`, `<SmoothScrollProvider>`, `<ConditionalFooter>`. Admin must not inherit these. Solution: move all public pages into a `(public)` route group with its own sub-layout; strip root layout to bare html/body/fonts.

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/(public)/layout.tsx`
- Move: `src/app/page.tsx` → `src/app/(public)/page.tsx`
- Move: `src/app/work/` → `src/app/(public)/work/`
- Move: `src/app/studio/` → `src/app/(public)/studio/`
- Move: `src/app/capabilities/` → `src/app/(public)/capabilities/`
- Move: `src/app/contact/` → `src/app/(public)/contact/`
- Move: `src/app/journal/` → `src/app/(public)/journal/`

**Step 1: Create the (public) route group directory**

```bash
mkdir -p "src/app/(public)"
```

**Step 2: Move all public route directories into (public)**

```bash
mv src/app/page.tsx "src/app/(public)/page.tsx"
mv src/app/work "src/app/(public)/work"
mv src/app/studio "src/app/(public)/studio"
mv src/app/capabilities "src/app/(public)/capabilities"
mv src/app/contact "src/app/(public)/contact"
mv src/app/journal "src/app/(public)/journal"
```

**Step 3: Create `src/app/(public)/layout.tsx`**

Extract the Navigation/SmoothScrollProvider/Logo/ConditionalFooter wrapper from the root layout:

```tsx
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Navigation from "@/components/layout/Navigation";
import Logo from "@/components/layout/Logo";
import ConditionalFooter from "@/components/layout/ConditionalFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <Logo />
      <Navigation />
      <main>{children}</main>
      <ConditionalFooter />
    </SmoothScrollProvider>
  );
}
```

**Step 4: Rewrite `src/app/layout.tsx` to be minimal — fonts, html, body, Analytics only**

```tsx
import type { Metadata } from "next";
import { Anton, Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["300","400","500","600"], display: "swap" });
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Maxmark Studio — AI-Native Production Studio",
  description: "An AI-Native Production Studio. Cinematic Craft at African Market Speed.",
  openGraph: {
    title: "Maxmark Studio",
    description: "Cinematic Craft at African Market Speed.",
    siteName: "Maxmark Studio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${fraunces.variable} ${geistSans.variable} ${geistMono.variable}`}
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <body style={{ backgroundColor: "var(--bg-base)", color: "var(--fg-primary)" }}>
        {children}
        {process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" && <Analytics />}
      </body>
    </html>
  );
}
```

**Step 5: Start dev server and verify**

```bash
npm run dev
```

- `http://localhost:3000` — homepage loads, reel plays, navigation visible ✓
- `http://localhost:3000/work` — work page loads ✓
- No console errors about missing imports

**Step 6: Commit**

```bash
git add src/app/
git commit -m "refactor: move public routes into (public) group to isolate admin layout"
```

---

## Task 3: Create SUPABASE_SETUP.md + migration file

**Files:**
- Create: `SUPABASE_SETUP.md`
- Create: `supabase/migrations/001_initial_schema.sql`

**Step 1: Create `SUPABASE_SETUP.md`**

```markdown
# Supabase Setup — Sprint 2A

1. Sign up at https://supabase.com and create a new project named "maxmark-studio"
2. Choose region: eu-west for African-primary traffic, us-east if US-primary
3. Save the database password securely
4. From Settings → API, copy these values into `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose to client)
5. In Supabase Studio → SQL Editor → New query, paste and run the contents of
   `supabase/migrations/001_initial_schema.sql`
6. In Supabase Studio → Storage, create two buckets:
   - `project-posters` — set to **Public**
   - `project-gallery` — set to **Public**
7. In Supabase Studio → Authentication → Users → Add user:
   create your admin user with email + password
8. In Authentication → Providers → Email, **disable** "Enable new user signups"
9. Run type generation (after step 5):
   `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts`
```

**Step 2: Create `supabase/migrations/001_initial_schema.sql`**

Paste the full schema from the sprint spec (all tables, indexes, RLS policies, triggers). The full SQL is in the sprint brief — copy it verbatim into this file.

```bash
mkdir -p supabase/migrations
```

Then create the file with the full SQL from the sprint spec.

**Step 3: Create `.env.local` placeholder and `.env.example`**

Create `.env.example` (committed to git — no values):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

Create `.env.local` (gitignored — fill in real values after Supabase setup):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

**Step 4: Commit**

```bash
git add SUPABASE_SETUP.md supabase/ .env.example
git commit -m "chore: add Supabase setup guide, migration, env example"
```

---

## Task 4: Supabase clients + TypeScript types

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/types/database.ts`

**Step 1: Create `src/lib/supabase/client.ts`** (browser client)

```ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

**Step 2: Create `src/lib/supabase/server.ts`** (server components / server actions)

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server component — cookies are read-only here
          }
        },
      },
    },
  );
}
```

**Step 3: Create `src/lib/supabase/middleware.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (user && request.nextUrl.pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/projects", request.url));
  }

  return supabaseResponse;
}
```

**Step 4: Create `src/types/database.ts`** — hand-written types mirroring the schema (replace with `supabase gen types` after Supabase is set up)

```ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type ProjectCategory = "brand" | "narrative" | "music";
export type AspectRatio = "4:3" | "16:9" | "1:1" | "21:9";
export type GridSize = "large" | "medium" | "small";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string | null;
  category: ProjectCategory;
  client: string | null;
  year: number | null;
  summary: string | null;
  body_json: Json | null;
  mux_playback_id: string | null;
  youtube_id: string | null;
  poster_url: string | null;
  aspect_ratio: AspectRatio;
  grid_size: GridSize;
  featured: boolean;
  display_order: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ProjectInsert = Omit<ProjectRow, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectInsert>;

// Supabase Database type for createClient generics
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
    };
  };
};
```

**Step 5: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: zero errors (environment variables typed as `string | undefined` — the `!` assertions are intentional).

**Step 6: Commit**

```bash
git add src/lib/supabase/ src/types/database.ts
git commit -m "feat: add Supabase client utilities and database types"
```

---

## Task 5: Next.js middleware for route protection

**Files:**
- Create: `src/middleware.ts`

**Step 1: Create `src/middleware.ts`**

```ts
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

**Step 2: Verify dev server still starts**

```bash
npm run dev
```

Navigate to `http://localhost:3000/admin` — should redirect to `/admin/login` (which will 404 until the login page is built, but the redirect should occur).

**Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add middleware to protect /admin routes"
```

---

## Task 6: Admin CSS tokens and shared admin styles

The admin uses the same palette but adds a few extra tokens. Add these to `globals.css`.

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Append admin-specific tokens to `:root`**

Add inside the existing `:root` block:

```css
/* Admin-specific tokens */
--admin-sidebar-width: 240px;
--admin-bg: #0d0d0d;
--admin-sidebar-bg: #111111;
--admin-input-border: rgba(245, 245, 240, 0.12);
--admin-input-focus: var(--accent-highlight);
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "chore: add admin CSS tokens"
```

---

## Task 7: Admin login page

**Files:**
- Create: `src/app/admin/layout.tsx` (bare wrapper — no sidebar)
- Create: `src/app/admin/login/page.tsx`

**Step 1: Create `src/app/admin/layout.tsx`**

This is the outermost admin layout. It intentionally has NO sidebar — that's in the dashboard sub-group. It just provides a dark full-screen container.

```tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--admin-bg)" }}>
      {children}
    </div>
  );
}
```

**Step 2: Create `src/app/admin/login/page.tsx`**

Login is a Client Component — it handles form state, calls Supabase browser client on submit, uses `useRouter` to redirect on success.

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Logo / wordmark */}
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "var(--fg-muted)",
          marginBottom: "12px",
        }}
      >
        Maxmark Studio
      </p>

      <h1
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "32px",
          fontWeight: 400,
          color: "var(--fg-primary)",
          marginBottom: "40px",
        }}
      >
        Studio Admin
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div>
          <label style={labelStyle}>Email</label>
          <input {...register("email")} type="email" autoComplete="email" style={inputStyle} />
          {errors.email && <p style={fieldErrorStyle}>{errors.email.message}</p>}
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <input {...register("password")} type="password" autoComplete="current-password" style={inputStyle} />
          {errors.password && <p style={fieldErrorStyle}>{errors.password.message}</p>}
        </div>

        {serverError && (
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--accent)", marginTop: "-8px" }}>
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} style={submitStyle}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-geist-mono)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--fg-muted)",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid var(--admin-input-border)",
  borderRadius: 0,
  padding: "10px 0",
  color: "var(--fg-primary)",
  fontFamily: "var(--font-geist-sans)",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const fieldErrorStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono)",
  fontSize: "11px",
  color: "var(--accent)",
  marginTop: "6px",
};

const submitStyle: React.CSSProperties = {
  marginTop: "8px",
  padding: "14px 24px",
  backgroundColor: "var(--fg-primary)",
  color: "var(--bg-base)",
  border: "none",
  borderRadius: "9999px",
  fontFamily: "var(--font-geist-mono)",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  cursor: "pointer",
};
```

**Step 3: Verify login page renders**

```bash
npm run dev
```
Navigate to `http://localhost:3000/admin/login`. Should see the login form. Going to `/admin` should redirect to `/admin/login`.

**Step 4: Commit**

```bash
git add src/app/admin/
git commit -m "feat: admin login page with Supabase auth"
```

---

## Task 8: Logout route

**Files:**
- Create: `src/app/admin/logout/route.ts`

**Step 1: Create `src/app/admin/logout/route.ts`**

```ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:3000"));
}
```

Note: The redirect URL must be absolute. Use a helper:

```ts
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const url = new URL("/admin/login", request.url);
  return Response.redirect(url, 303);
}
```

**Step 2: Commit**

```bash
git add src/app/admin/logout/
git commit -m "feat: admin logout route"
```

---

## Task 9: Admin dashboard layout + sidebar

**Files:**
- Create: `src/app/admin/(dashboard)/layout.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`

**Step 1: Create `src/components/admin/AdminSidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/studio-info", label: "Studio Info" },
  { href: "/admin/contact-submissions", label: "Contacts" },
];

type Props = { userEmail: string };

export default function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "var(--admin-sidebar-width)",
        minHeight: "100vh",
        backgroundColor: "var(--admin-sidebar-bg)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid var(--border)" }}>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--fg-muted)" }}>
          Maxmark Studio
        </p>
        <p style={{ fontFamily: "var(--font-fraunces)", fontSize: "16px", color: "var(--fg-primary)", marginTop: "4px" }}>
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "10px 24px",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: isActive ? "var(--fg-primary)" : "var(--fg-muted)",
                textDecoration: "none",
                borderLeft: isActive ? "3px solid var(--accent-highlight)" : "3px solid transparent",
                transition: "color 150ms ease, border-color 150ms ease",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-subtle)", marginBottom: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {userEmail}
        </p>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--fg-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
```

**Step 2: Create `src/app/admin/(dashboard)/layout.tsx`**

Server component — checks auth, redirects if not authenticated, renders sidebar + content shell.

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar userEmail={user.email ?? ""} />
      <main
        style={{
          flex: 1,
          marginLeft: "var(--admin-sidebar-width)",
          padding: "48px",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
```

**Step 3: Create `src/app/admin/(dashboard)/page.tsx`** — redirects to projects

```tsx
import { redirect } from "next/navigation";

export default function AdminHomePage() {
  redirect("/admin/projects");
}
```

**Step 4: Verify admin shell**

Start dev, log in at `/admin/login`, verify redirect to `/admin/projects` shows the sidebar layout (projects page 404s for now — that's fine).

**Step 5: Commit**

```bash
git add src/app/admin/(dashboard)/ src/components/admin/
git commit -m "feat: admin dashboard layout with sidebar navigation"
```

---

## Task 10: Stub pages for non-2A sections

**Files:**
- Create: `src/app/admin/(dashboard)/journal/page.tsx`
- Create: `src/app/admin/(dashboard)/team/page.tsx`
- Create: `src/app/admin/(dashboard)/studio-info/page.tsx`
- Create: `src/app/admin/(dashboard)/contact-submissions/page.tsx`

**Step 1: Create each stub page** (all four follow the same pattern — example for journal):

```tsx
// src/app/admin/(dashboard)/journal/page.tsx
export default function JournalAdminPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "32px", fontWeight: 400, color: "var(--fg-primary)", marginBottom: "12px" }}>
        Journal
      </h1>
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        In development — Sprint 2B
      </p>
    </div>
  );
}
```

Repeat for `team`, `studio-info`, `contact-submissions` (change the title string).

**Step 2: Commit**

```bash
git add src/app/admin/(dashboard)/journal/ src/app/admin/(dashboard)/team/ src/app/admin/(dashboard)/studio-info/ src/app/admin/(dashboard)/contact-submissions/
git commit -m "feat: admin stub pages for journal, team, studio-info, contacts"
```

---

## Task 11: Server actions for projects

**Files:**
- Create: `src/lib/actions/projects.ts`

**Step 1: Create `src/lib/actions/projects.ts`**

Important: `redirect()` must be called **outside** any try/catch block — it throws internally.

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  eyebrow: z.string().optional(),
  category: z.enum(["brand", "narrative", "music"]),
  client: z.string().optional(),
  year: z.coerce.number().int().optional(),
  summary: z.string().optional(),
  mux_playback_id: z.string().optional(),
  youtube_id: z.string().optional(),
  poster_url: z.string().optional(),
  aspect_ratio: z.enum(["4:3", "16:9", "1:1", "21:9"]),
  grid_size: z.enum(["large", "medium", "small"]),
  featured: z.boolean(),
  display_order: z.coerce.number().int(),
  published: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export async function createProject(formData: ProjectFormData) {
  const supabase = await createClient();
  const data = projectSchema.parse(formData);

  const { error } = await supabase.from("projects").insert({
    ...data,
    published_at: data.published ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: ProjectFormData) {
  const supabase = await createClient();
  const data = projectSchema.parse(formData);

  const { error } = await supabase
    .from("projects")
    .update({
      ...data,
      published_at: data.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
```

**Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 3: Commit**

```bash
git add src/lib/actions/
git commit -m "feat: server actions for project CRUD with Zod validation"
```

---

## Task 12: Shared admin form components

**Files:**
- Create: `src/components/admin/FormField.tsx`
- Create: `src/components/admin/FormActions.tsx`
- Create: `src/components/admin/DeleteConfirmModal.tsx`

**Step 1: Create `src/components/admin/FormField.tsx`**

Reusable field wrapper with label + optional error:

```tsx
type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
};

export default function FormField({ label, error, children, hint }: FormFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--fg-muted)",
        }}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-subtle)" }}>
          {hint}
        </p>
      )}
      {error && (
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--accent)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

**Step 2: Create `src/components/admin/FormActions.tsx`**

```tsx
"use client";

import Link from "next/link";

type FormActionsProps = {
  isSubmitting: boolean;
  cancelHref: string;
  onDelete?: () => void;
  isEdit?: boolean;
};

export default function FormActions({ isSubmitting, cancelHref, onDelete, isEdit }: FormActionsProps) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingTop: "32px", borderTop: "1px solid var(--border)", marginTop: "32px" }}>
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "12px 28px",
          backgroundColor: "var(--fg-primary)",
          color: "var(--bg-base)",
          border: "none",
          borderRadius: "9999px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.6 : 1,
        }}
      >
        {isSubmitting ? "Saving…" : "Save"}
      </button>

      <Link
        href={cancelHref}
        style={{
          padding: "12px 28px",
          backgroundColor: "transparent",
          color: "var(--fg-muted)",
          border: "1px solid var(--border)",
          borderRadius: "9999px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        Cancel
      </Link>

      {isEdit && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          style={{
            marginLeft: "auto",
            padding: "12px 28px",
            backgroundColor: "transparent",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            borderRadius: "9999px",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
```

**Step 3: Create `src/components/admin/DeleteConfirmModal.tsx`**

```tsx
"use client";

type Props = {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
};

export default function DeleteConfirmModal({ title, onConfirm, onCancel, isDeleting }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "22px",
            fontWeight: 400,
            color: "var(--fg-primary)",
            marginBottom: "12px",
          }}
        >
          Delete {title}?
        </h2>
        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "14px",
            color: "var(--fg-muted)",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          This project will be hidden from the site immediately. The record will remain in the database and can be restored.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: "12px 28px",
              backgroundColor: "transparent",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              borderRadius: "9999px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              cursor: isDeleting ? "not-allowed" : "pointer",
              opacity: isDeleting ? 0.6 : 1,
            }}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "12px 28px",
              backgroundColor: "transparent",
              color: "var(--fg-muted)",
              border: "1px solid var(--border)",
              borderRadius: "9999px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/admin/
git commit -m "feat: shared admin form components (FormField, FormActions, DeleteConfirmModal)"
```

---

## Task 13: ImageUpload component

**Files:**
- Create: `src/components/admin/ImageUpload.tsx`

**Step 1: Create `src/components/admin/ImageUpload.tsx`**

Client component — drag-and-drop or click to upload. Uploads to Supabase Storage `project-posters` bucket. Notifies parent with the resulting public URL.

```tsx
"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export default function ImageUpload({ value, onChange, label = "Poster Image" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const filename = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("project-posters")
        .upload(filename, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("project-posters").getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = async () => {
    if (!value) return;
    const filename = value.split("/").pop();
    if (!filename) return;
    const supabase = createClient();
    await supabase.storage.from("project-posters").remove([filename]);
    onChange("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)" }}>
        {label}
      </p>

      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={value} alt="Poster preview" style={{ width: "200px", height: "133px", objectFit: "cover", borderRadius: "6px", display: "block" }} />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "var(--fg-primary)",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "10px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{
            height: "120px",
            border: "1px dashed var(--admin-input-border)",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            gap: "8px",
            opacity: uploading ? 0.5 : 1,
          }}
        >
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {uploading ? "Uploading…" : "Click or drag to upload"}
          </p>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--fg-subtle)" }}>
            Max 5MB · JPG, PNG, WEBP
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--accent)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/admin/ImageUpload.tsx
git commit -m "feat: ImageUpload component with Supabase Storage integration"
```

---

## Task 14: ProjectForm component

**Files:**
- Create: `src/components/admin/ProjectForm.tsx`

This is the most complex component in the sprint. It's a client component using React Hook Form + Zod, with an ImageUpload sub-component. Used for both create and edit flows.

**Step 1: Create `src/components/admin/ProjectForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/admin/FormField";
import FormActions from "@/components/admin/FormActions";
import ImageUpload from "@/components/admin/ImageUpload";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { createProject, updateProject, deleteProject } from "@/lib/actions/projects";
import type { ProjectRow } from "@/types/database";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  eyebrow: z.string().optional(),
  category: z.enum(["brand", "narrative", "music"]),
  client: z.string().optional(),
  year: z.coerce.number().int().optional(),
  summary: z.string().optional(),
  mux_playback_id: z.string().optional(),
  youtube_id: z.string().optional(),
  poster_url: z.string().optional(),
  aspect_ratio: z.enum(["4:3", "16:9", "1:1", "21:9"]),
  grid_size: z.enum(["large", "medium", "small"]),
  featured: z.boolean(),
  display_order: z.coerce.number().int(),
  published: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initialData?: ProjectRow;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ProjectForm({ initialData }: Props) {
  const isEdit = !!initialData;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          eyebrow: initialData.eyebrow ?? "",
          category: initialData.category,
          client: initialData.client ?? "",
          year: initialData.year ?? undefined,
          summary: initialData.summary ?? "",
          mux_playback_id: initialData.mux_playback_id ?? "",
          youtube_id: initialData.youtube_id ?? "",
          poster_url: initialData.poster_url ?? "",
          aspect_ratio: initialData.aspect_ratio,
          grid_size: initialData.grid_size,
          featured: initialData.featured,
          display_order: initialData.display_order,
          published: initialData.published,
        }
      : {
          category: "brand",
          aspect_ratio: "16:9",
          grid_size: "medium",
          featured: false,
          display_order: 0,
          published: false,
        },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      if (isEdit && initialData) {
        await updateProject(initialData.id, data);
      } else {
        await createProject(data);
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    setIsDeleting(true);
    try {
      await deleteProject(initialData.id);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Delete failed");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Core ─────────────────────────────────────────── */}
        <SectionHeader>Core</SectionHeader>
        <FieldGrid>
          <FormField label="Title *" error={errors.title?.message}>
            <input
              {...register("title")}
              style={inputStyle}
              onChange={(e) => {
                register("title").onChange(e);
                if (!isEdit) setValue("slug", slugify(e.target.value));
              }}
            />
          </FormField>

          <FormField label="Slug *" error={errors.slug?.message} hint="URL-safe: lowercase letters, numbers, hyphens">
            <input {...register("slug")} style={inputStyle} />
          </FormField>

          <FormField label="Eyebrow" error={errors.eyebrow?.message}>
            <input {...register("eyebrow")} style={inputStyle} placeholder="e.g. Maxmark Studio Originals" />
          </FormField>

          <FormField label="Category *" error={errors.category?.message}>
            <select {...register("category")} style={selectStyle}>
              <option value="brand">Brand</option>
              <option value="narrative">Narrative</option>
              <option value="music">Music</option>
            </select>
          </FormField>

          <FormField label="Client" error={errors.client?.message}>
            <input {...register("client")} style={inputStyle} />
          </FormField>

          <FormField label="Year" error={errors.year?.message}>
            <input {...register("year")} type="number" style={inputStyle} placeholder={String(new Date().getFullYear())} />
          </FormField>
        </FieldGrid>

        {/* ── Summary ──────────────────────────────────────── */}
        <SectionHeader>Summary</SectionHeader>
        <FormField label="Summary" error={errors.summary?.message}>
          <textarea {...register("summary")} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        </FormField>

        {/* ── Media ────────────────────────────────────────── */}
        <SectionHeader>Media</SectionHeader>
        <FieldGrid>
          <div style={{ gridColumn: "1 / -1" }}>
            <Controller
              name="poster_url"
              control={control}
              render={({ field }) => (
                <ImageUpload value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          </div>

          <FormField label="Mux Playback ID" error={errors.mux_playback_id?.message} hint="From Mux dashboard → Asset details">
            <input {...register("mux_playback_id")} style={inputStyle} />
          </FormField>

          <FormField label="YouTube Video ID" error={errors.youtube_id?.message} hint="The part after ?v= in the YouTube URL">
            <input {...register("youtube_id")} style={inputStyle} />
          </FormField>
        </FieldGrid>

        {/* ── Display ──────────────────────────────────────── */}
        <SectionHeader>Display</SectionHeader>
        <FieldGrid>
          <FormField label="Aspect Ratio" error={errors.aspect_ratio?.message}>
            <select {...register("aspect_ratio")} style={selectStyle}>
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1</option>
              <option value="21:9">21:9</option>
            </select>
          </FormField>

          <FormField label="Grid Size" error={errors.grid_size?.message}>
            <select {...register("grid_size")} style={selectStyle}>
              <option value="large">Large</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
          </FormField>

          <FormField label="Display Order" error={errors.display_order?.message}>
            <input {...register("display_order")} type="number" style={inputStyle} />
          </FormField>
        </FieldGrid>

        <div style={{ display: "flex", gap: "32px", marginTop: "16px" }}>
          <label style={checkboxLabelStyle}>
            <input {...register("featured")} type="checkbox" style={{ marginRight: "8px" }} />
            Featured — show on home reel
          </label>
        </div>

        {/* ── Publishing ───────────────────────────────────── */}
        <SectionHeader>Publishing</SectionHeader>
        <label style={checkboxLabelStyle}>
          <input {...register("published")} type="checkbox" style={{ marginRight: "8px" }} />
          Published — visible on public site
        </label>

        {serverError && (
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--accent)", marginTop: "16px" }}>
            {serverError}
          </p>
        )}

        <FormActions
          isSubmitting={isSubmitting}
          cancelHref="/admin/projects"
          onDelete={isEdit ? () => setShowDeleteModal(true) : undefined}
          isEdit={isEdit}
        />
      </form>

      {showDeleteModal && initialData && (
        <DeleteConfirmModal
          title={initialData.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-fraunces)",
        fontSize: "18px",
        fontWeight: 400,
        color: "var(--fg-primary)",
        marginTop: "40px",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </h2>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid var(--admin-input-border)",
  borderRadius: 0,
  padding: "10px 0",
  color: "var(--fg-primary)",
  fontFamily: "var(--font-geist-sans)",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
};

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontFamily: "var(--font-geist-mono)",
  fontSize: "12px",
  color: "var(--fg-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  cursor: "pointer",
};
```

**Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/admin/ProjectForm.tsx
git commit -m "feat: ProjectForm component with React Hook Form and Zod"
```

---

## Task 15: Projects list page

**Files:**
- Create: `src/app/admin/(dashboard)/projects/page.tsx`
- Create: `src/components/admin/ProjectsTable.tsx` (client component for filtering)

**Step 1: Create `src/components/admin/ProjectsTable.tsx`**

Client component for client-side filtering/search:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProjectRow } from "@/types/database";

type Props = { projects: ProjectRow[] };

export default function ProjectsTable({ projects }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    const matchStatus =
      status === "all" ||
      (status === "published" && p.published) ||
      (status === "draft" && !p.published);
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div>
      {/* Filter row */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "8px 14px",
            color: "var(--fg-primary)",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "12px",
            outline: "none",
            minWidth: "200px",
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 14px", color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "12px", cursor: "pointer" }}
        >
          <option value="all">All Categories</option>
          <option value="brand">Brand</option>
          <option value="narrative">Narrative</option>
          <option value="music">Music</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 14px", color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "12px", cursor: "pointer" }}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <p style={{ fontFamily: "var(--font-fraunces)", fontSize: "22px", color: "var(--fg-muted)", marginBottom: "16px" }}>
            {projects.length === 0 ? "No projects yet." : "No results."}
          </p>
          {projects.length === 0 && (
            <Link
              href="/admin/projects/new"
              style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-highlight)", textDecoration: "none" }}
            >
              Create your first project →
            </Link>
          )}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["", "Title", "Category", "Featured", "Status", "Updated", ""].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: "left",
                    padding: "0 16px 12px 0",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--fg-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <tr key={project.id} style={{ borderBottom: "1px solid var(--border)" }}>
                {/* Thumbnail */}
                <td style={{ padding: "14px 16px 14px 0", width: "64px" }}>
                  {project.poster_url ? (
                    <img src={project.poster_url} alt="" style={{ width: "48px", height: "32px", objectFit: "cover", borderRadius: "3px" }} />
                  ) : project.mux_playback_id ? (
                    <img
                      src={`https://image.mux.com/${project.mux_playback_id}/thumbnail.jpg?width=96&height=64&fit_mode=crop`}
                      alt=""
                      style={{ width: "48px", height: "32px", objectFit: "cover", borderRadius: "3px" }}
                    />
                  ) : (
                    <div style={{ width: "48px", height: "32px", backgroundColor: "var(--bg-elevated)", borderRadius: "3px" }} />
                  )}
                </td>
                {/* Title */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "14px", color: "var(--fg-primary)", margin: 0 }}>{project.title}</p>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-muted)", margin: 0, marginTop: "2px" }}>{project.slug}</p>
                </td>
                {/* Category */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  <span style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    border: "1px solid var(--border)",
                    color: "var(--fg-muted)",
                  }}>
                    {project.category}
                  </span>
                </td>
                {/* Featured */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  {project.featured && <span style={{ color: "var(--accent-highlight)", fontSize: "16px" }}>✓</span>}
                </td>
                {/* Status */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: project.published ? "var(--accent-highlight)" : "var(--fg-muted)" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: project.published ? "var(--accent-highlight)" : "var(--fg-subtle)", flexShrink: 0 }} />
                    {project.published ? "Published" : "Draft"}
                  </span>
                </td>
                {/* Updated */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-muted)" }}>
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </td>
                {/* Actions */}
                <td style={{ padding: "14px 0" }}>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", textDecoration: "none" }}
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

**Step 2: Create `src/app/admin/(dashboard)/projects/page.tsx`**

Server component — fetches all non-deleted projects:

```tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectsTable from "@/components/admin/ProjectsTable";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "36px", fontWeight: 400, color: "var(--fg-primary)", margin: 0 }}>
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          style={{
            padding: "12px 24px",
            backgroundColor: "var(--fg-primary)",
            color: "var(--bg-base)",
            borderRadius: "9999px",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            textDecoration: "none",
          }}
        >
          New Project
        </Link>
      </div>

      <ProjectsTable projects={projects ?? []} />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/app/admin/(dashboard)/projects/page.tsx src/components/admin/ProjectsTable.tsx
git commit -m "feat: admin projects list page with filtering and table"
```

---

## Task 16: New project page

**Files:**
- Create: `src/app/admin/(dashboard)/projects/new/page.tsx`

**Step 1: Create `src/app/admin/(dashboard)/projects/new/page.tsx`**

```tsx
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div style={{ maxWidth: "760px" }}>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "36px", fontWeight: 400, color: "var(--fg-primary)", marginBottom: "40px" }}>
        New Project
      </h1>
      <ProjectForm />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/(dashboard)/projects/new/
git commit -m "feat: new project page"
```

---

## Task 17: Edit project page

**Files:**
- Create: `src/app/admin/(dashboard)/projects/[id]/edit/page.tsx`

**Step 1: Create `src/app/admin/(dashboard)/projects/[id]/edit/page.tsx`**

Server component — fetches the project by ID, passes to ProjectForm as initialData.

```tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !project) notFound();

  return (
    <div style={{ maxWidth: "760px" }}>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "36px", fontWeight: 400, color: "var(--fg-primary)", marginBottom: "40px" }}>
        Edit: {project.title}
      </h1>
      <ProjectForm initialData={project} />
    </div>
  );
}
```

Note: `params` is typed as `Promise<{ id: string }>` in Next.js 16 App Router — always `await` it.

**Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/app/admin/(dashboard)/projects/
git commit -m "feat: edit project page with pre-populated form"
```

---

## Task 18: Verify complete flow end-to-end

At this point all code is written. Verify the full flow:

**Step 1: Ensure Supabase is provisioned**
- The user must complete `SUPABASE_SETUP.md` steps 1–8 before this task
- `.env.local` must have all three keys

**Step 2: Start dev server**

```bash
npm run dev
```

**Step 3: Run through the testing checklist**

1. `http://localhost:3000/admin` → redirects to `/admin/login` ✓
2. Login with admin credentials → redirects to `/admin/projects` ✓
3. Projects list shows "No projects yet" with CTA ✓
4. Click "New Project" → form renders, no console errors ✓
5. Fill form — type a title → slug auto-generates ✓
6. Upload an image → appears in Supabase Storage `project-posters` bucket, preview shows ✓
7. Save → redirected to projects list, project appears in table ✓
8. Click "Edit →" on the project → form pre-populated ✓
9. Toggle "Published", save → status dot changes to green ✓
10. Click "Delete" → modal appears with project title ✓
11. Confirm delete → project disappears from list, record soft-deleted in DB ✓
12. Click "Sign Out" → redirected to login, session cleared ✓
13. Navigate to `http://localhost:3000` → homepage loads, reel plays, no regression ✓
14. TypeScript: `npx tsc --noEmit` → zero errors ✓

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: Sprint 2A complete — Supabase admin with projects CRUD"
```

---

## Appendix: Common pitfalls

| Pitfall | Fix |
|---|---|
| `redirect()` inside try/catch throws uncaught | Call `redirect()` after the try/catch block, not inside it |
| Supabase cookies error in middleware | Ensure `supabaseResponse` is rebuilt after `setAll` |
| `params` not awaited in Next.js 16 | Always `const { id } = await params` in route page components |
| Admin gets public Navigation | Ensure `(public)/layout.tsx` wraps only public routes, not admin |
| Image upload 403 | Confirm Storage bucket is set to Public in Supabase dashboard |
| `deleted_at IS NULL` filter | Use `.is("deleted_at", null)` — not `.eq("deleted_at", null)` |
