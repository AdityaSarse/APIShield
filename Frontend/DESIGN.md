
# APIShield — Frontend Design System

> **Purpose of this document:** This is the single source of truth for visual and UX decisions across the APIShield frontend. A coding agent (or human developer) should be able to implement any new page or component correctly using only this file plus the component library it produces. When a decision isn't covered here, follow the closest existing pattern rather than inventing a new one — file a note under §22 "Open Questions" instead of guessing silently.

**Version:** 1.0.0
**Stack:** React + Vite, Tailwind CSS, Recharts, TanStack Query, Zustand, Axios, Lucide React, react-hot-toast

---

## 1. Product Overview

APIShield is an API security and gateway management platform providing:

- API authentication & key management
- Gateway management & rate limiting
- Request monitoring & traffic analytics
- Service health monitoring
- Alerts & system administration

The UI should read as a **modern API infrastructure control center**: technical enough to be trusted by engineers, clean enough to not intimidate a first-time admin.

**Design keywords:** Minimal · Technical · Secure · Professional · Structured · Approachable · Data-focused

---

## 2. Design Principles

1. **Data first.** Important information is visible within one glance. No decorative elements that don't carry information.
2. **Clear hierarchy.** Every page has: title → one-line description → primary action(s) → primary content → secondary content.
3. **Minimal visual noise.** Whitespace, typography, and soft shadows do the work of separation — not heavy borders or color blocking.
4. **Semantic color, strictly enforced.** Color always means the same thing everywhere. See §4.4 — this is a hard rule, not a guideline.
5. **Consistency over novelty.** Every page reuses the same tokens, components, and patterns. New components are added to the system, not invented per-page.
6. **Technical but approachable.** Dense data, not a dense *interface*. One card = one purpose.
7. **Every state is designed.** Loading, empty, and error states are not optional — a component isn't done until all three exist.

---

## 3. Color System

### 3.1 Brand

| Token | Hex | Usage |
|---|---|---|
| `color-primary` | `#4F46E5` (indigo) | Logo, primary buttons, active nav, links, selected states, chart primary series, focus rings |
| `color-primary-light` | `#EEF2FF` | Active nav background, selected card background, icon backgrounds, hover tint |
| `color-primary-hover` | `#4338CA` | Primary button hover/pressed |

### 3.2 Neutrals

| Token | Hex | Usage |
|---|---|---|
| `color-bg` | `#F7F8F9` | App background |
| `color-surface` | `#FFFFFF` | Cards, tables, modals, dropdowns, forms |
| `color-text-primary` | `#1C1F23` | Headings, primary content |
| `color-text-secondary` | `#6B7280` | Descriptions, metadata |
| `color-text-muted` | `#9CA3AF` | Placeholders, disabled content, low-priority labels |
| `color-border` | `#E6E9EE` | Dividers — use sparingly, prefer shadow/spacing for separation |

### 3.3 Semantic

| Token | Hex | Meaning — used ONLY for this |
|---|---|---|
| `color-success` | `#16A34A` | Healthy, connected, allowed, operational, successful |
| `color-warning` | `#F59E0B` | Warning, high utilization, approaching limits, degraded |
| `color-error` | `#DC2626` | Rejected, failed, error, critical, revoked, unavailable |
| `color-info` | `#2563EB` | Informational states, secondary chart series |

Status-pill background tints (soft, not saturated):

| State | Background | Text |
|---|---|---|
| Active/Selected | `#EEF2FF` | `#4F46E5` |
| Healthy/Success | `#DCFCE7` | `#16A34A` |
| Warning | `#FEF3C7` | `#F59E0B` |
| Error | `#FEE2E2` | `#DC2626` |

### 3.4 Color Rules (hard constraints)

> **Red is never the brand color.** Indigo is brand. This separation is deliberate and non-negotiable — it's what lets a rejected-request spike be instantly legible against an otherwise-calm UI. Any future rebrand must preserve this separation (brand hue must stay outside the 0–20° / 340–360° red band).

- **Indigo** = brand, primary action, selected, active, interactive
- **Red** = error, rejected, failed, critical, danger — nothing else
- **Green** = healthy, allowed, successful, connected — nothing else
- **Amber** = warning, attention, high utilization — nothing else
- Never communicate state through color alone — always pair with an icon, label, or text (accessibility requirement, see §16)

### 3.5 Tailwind config (drop-in)

```js
// tailwind.config.js — theme.extend.colors
colors: {
  primary: { DEFAULT: '#4F46E5', light: '#EEF2FF', hover: '#4338CA' },
  surface: '#FFFFFF',
  bg: '#F7F8F9',
  border: '#E6E9EE',
  text: { primary: '#1C1F23', secondary: '#6B7280', muted: '#9CA3AF' },
  success: { DEFAULT: '#16A34A', bg: '#DCFCE7' },
  warning: { DEFAULT: '#F59E0B', bg: '#FEF3C7' },
  error:   { DEFAULT: '#DC2626', bg: '#FEE2E2' },
  info:    { DEFAULT: '#2563EB', bg: '#EFF6FF' },
}
```

---

## 4. Typography

**Primary font:** Inter (fallback: Geist, system-ui)
**Technical/numeric font:** JetBrains Mono — used ONLY for: request counts, response times, API key prefixes, IP addresses, HTTP status codes, uptime, rate-limit values, service URLs. Never for full-interface text.

| Style | Size | Weight | Font | Use |
|---|---|---|---|---|
| Page Heading (H1) | 32–36px | 700 | Inter | Page title (e.g. "Dashboard") |
| Section Heading (H2) | 20px | 600 | Inter | Card/section group titles |
| Card Heading (H3) | 14–16px | 600 | Inter | Individual card titles |
| Large Metric | 32–36px | 700 | JetBrains Mono | KPI numbers |
| Body | 14–16px | 400 | Inter | Descriptions, labels |
| Metadata / Caption | 12–13px | 400–500 | Inter | Timestamps, secondary labels — `text-secondary` or `text-muted` |
| Table numeric cell | 13–14px | 400 | JetBrains Mono | Counts, latencies, IPs |

Line-height: 1.5 for body text, 1.2 for headings and large metrics.

---

## 5. Spacing, Radius & Elevation

**Spacing grid (8px base):** `4 · 8 · 16 · 24 · 32 · 40 · 48 · 64`

| Context | Value |
|---|---|
| Card padding | 20–24px |
| Grid gap | 20–24px |
| Section spacing | 32px |
| Sidebar padding | 16–20px |
| Button padding | 16–20px horizontal, 10–12px vertical |

Avoid arbitrary spacing values outside this scale.

**Border radius**

| Element | Radius |
|---|---|
| Small controls (icon buttons, checkboxes) | 8px |
| Inputs | 10px |
| Buttons | 10–12px |
| Cards | 16–20px |
| Large containers / modals | 20–24px |
| Pills / badges | 9999px (full) |

**Shadows**

```css
--shadow-default: 0 2px 12px rgba(15, 23, 42, 0.05);
--shadow-hover:   0 6px 20px rgba(15, 23, 42, 0.08);
--shadow-modal:   0 12px 40px rgba(15, 23, 42, 0.12);
```

Avoid: heavy shadows, glow effects, excessive elevation stacking.

**Z-index scale**

| Layer | z-index |
|---|---|
| Sidebar / header | 10 |
| Dropdowns / popovers | 20 |
| Toasts | 30 |
| Modals / drawers | 40 |
| Tooltips | 50 |

---

## 6. Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │                    Top Header                      │
│ 220–    ├─────────────────────────────────────────────────────┤
│ 240px   │                                                     │
│         │                    Page Content                    │
│         │             (max-width: 1600px, centered)           │
└─────────┴─────────────────────────────────────────────────────┘
```

### 6.1 Sidebar (persistent, all authenticated pages)

```
[Shield Icon] APIShield
API Protection & Rate Limiting
─────────────
MENU
  Dashboard
  Analytics
  API Keys
  Services
  Rate Limiting
  Algorithms
  Traffic
  Alerts
─────────────
GENERAL
  System Health
  Settings
  Documentation
  Support
─────────────
[Gateway Status card — pinned to bottom]
  ● All Systems Operational
  Uptime · Version
```

**Active nav state:** indigo left-edge indicator (3px) + `color-primary-light` background + indigo icon + indigo text (600 weight). Never a large solid color block — the indicator + tint is the entire treatment.

### 6.2 Top header

Sidebar toggle · global search (with ⌘K hint, placeholder `Search API keys, services, requests...`) · notifications · messages · user avatar + name + email · profile menu.

### 6.3 Page header (every page)

```
Page Title
One-line description of what this page shows.
                                    [Secondary Action] [Primary Action]
```

### 6.4 Dashboard bento grid

```
┌────────┬────────┬────────┬────────┐
│  KPI   │  KPI   │  KPI   │  KPI   │
├─────────────────────┬────────┬────┤
│  Traffic Analytics   │ Algo   │Top │
│  (wide)               │ Grid  │Keys│
├───────────┬───────────┴────────┼────┤
│ Status    │ Service Analytics  │Mon-│
│ Codes     │                    │itor│
├───────────┴────────────────────┴────┤
│           Recent Rejected Requests   │
└───────────────────────────────────────┘
```

One card = one purpose. Don't merge unrelated metrics into a single card even if space allows it.

---

## 7. Components

### 7.1 Buttons

| Variant | Style | Use |
|---|---|---|
| Primary | Indigo fill, white text | The one primary action per view (Create API Key, Save) |
| Secondary | White surface, `color-border` outline | View Logs, Cancel, Export |
| Destructive | Red fill (`color-error`), white text | Revoke, Delete — genuinely destructive actions only |
| Ghost/Icon | Transparent, soft gray hover fill | Toolbar/utility actions |

States required for every button: `default · hover · active/pressed · focus-visible (ring) · disabled · loading (spinner replaces label)`.

### 7.2 Icon buttons

32–40px, circular or rounded-square, soft gray background (`#F3F4F6`), Lucide icon 16–20px, subtle hover darken. Used for: notifications, search, settings, more, refresh, filter.

### 7.3 Status pills

Soft background + saturated text per §3.3 table. Always pair with a leading dot or icon — never rely on color alone.

### 7.4 Cards

White surface, 16–20px radius, 20–24px padding, `--shadow-default` (→ `--shadow-hover` on hover if interactive). One clear purpose per card; card heading (H3) + optional trailing action/menu.

### 7.5 KPI card anatomy

```
[icon]  LABEL (uppercase, 11px, secondary)      [··· menu]
128,429                                    ← Large Metric, mono
↑ 12.5% vs last hour                       ← delta, semantic color
▁▂▃▅▃▇▅█▆                                   ← optional sparkline
```

### 7.6 Algorithm card anatomy (Rate Limiting feature)

```
Token Bucket                              ● Active
8,429 req/s
██████████████░░░░░░ 68%           ← utilization bar, semantic color
Allowed   8,102        Rejected   327
```

### 7.7 Tables

12–14px text, monospace for technical/numeric columns, status pills for state columns, right-aligned numeric values, light row separation (no heavy grid borders), sticky header on scroll for long tables.

### 7.8 Forms

10px input radius, white background, `color-border` outline, indigo focus ring (`0 0 0 3px rgba(79,70,229,0.15)`), label above input, helper/validation text below in `color-error` or `color-text-muted`.

### 7.9 Modals

White surface, 20px radius, `--shadow-modal`, title + one-line supporting description, primary + secondary action right-aligned. Destructive confirmations always restate the consequence:

```
Revoke this API key?
This action cannot be undone.
                        [Cancel]  [Revoke API Key]
```

### 7.10 Toasts (react-hot-toast)

Success/error/info variants matching semantic colors. Concise, single-line where possible. Used for: create/rotate/revoke confirmations, settings saved, network/API errors.

---

## 8. Charts (Recharts)

- Responsive, minimal, light gridlines, limited color palette per chart (2–4 series max)
- Primary series: `color-primary` (`#4F46E5`)
- Allowed / success series: `color-success`
- Rejected / error series: `color-error`
- Never introduce a chart color outside the defined semantic/brand set
- Axis labels use `color-text-secondary`, 12px

---

## 9. Iconography

Lucide React exclusively. 16–20px, stroke-based, consistent stroke width. Do not mix icon libraries.

---

## 10. States Every Data Component Must Support

1. **Loading** — skeleton cards/tables/charts (not full-page spinners for partial updates)
2. **Empty** — explain what's missing, why, and the next action:
   > *No API keys yet — Create your first API key to start sending authenticated requests. [Create API Key]*
3. **Error** — clear message, retry action, no raw stack traces:
   > *Unable to load analytics — The analytics service could not be reached. [Retry]*
4. **Populated** — the designed default state

A component is not considered complete until all four exist.

---

## 11. Security UI Rules

Never render in full, anywhere in the UI: complete API keys, passwords, refresh tokens, internal secrets, DB credentials, private env vars.

Mask format: `aps_live_12••••••••`. Full key is shown exactly once, at creation time, with an explicit copy action and a warning that it won't be shown again.

---

## 12. Responsive Behavior

| Breakpoint | Sidebar | Grid | Tables |
|---|---|---|---|
| Desktop (≥1280px) | Visible, full | Multi-column bento | Full |
| Tablet (768–1279px) | Collapsed to icon rail | Reduced columns (2-col bento) | Full width, may scroll |
| Mobile (<768px) | Drawer (overlay) | Single column, stacked cards | Horizontally scrollable |

Charts must resize fluidly; actions stack vertically on mobile page headers.

---

## 13. Accessibility

- Full keyboard navigation, visible `focus-visible` rings on all interactive elements
- Semantic HTML (`<button>`, `<nav>`, `<table>`, landmark roles)
- Sufficient contrast (WCAG AA minimum — verify all text/background pairs above, especially `text-muted` on `surface`)
- ARIA labels on icon-only buttons
- Color is never the sole indicator of state (§3.4)
- Screen-reader-friendly status announcements for toasts/live regions (gateway status, alerts)

---

## 14. Animation

Subtle and state-communicating only.

**Allowed:** button/card hover, sidebar collapse transition, modal enter/exit, chart data transitions, status-indicator pulse (for "Live" badges), skeleton shimmer.
**Avoid:** bounce effects, large/slow transitions, constant idle movement, glow/neon effects, decorative animation.

---

## 15. Frontend Architecture

```
src/
├── api/
├── assets/
├── components/        # shared/design-system components
├── features/
│   └── dashboard/
│       ├── components/
│       │   ├── DashboardHeader.jsx
│       │   ├── StatCard.jsx
│       │   ├── TrafficOverview.jsx
│       │   ├── AlgorithmCard.jsx
│       │   ├── AlgorithmGrid.jsx
│       │   ├── GatewayMonitoring.jsx
│       │   ├── StatusCodeChart.jsx
│       │   ├── ServiceAnalytics.jsx
│       │   ├── TopApiKeys.jsx
│       │   ├── ErrorRate.jsx
│       │   └── RecentRejectedRequests.jsx
│       ├── hooks/
│       │   └── useDashboardAnalytics.js
│       └── dashboard.page.jsx
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── store/
└── utils/
```

**Data fetching:** TanStack React Query for all server state (requests, caching, refetch, loading/error). **Client state:** Zustand for UI-only state (sidebar collapsed, preferences) — never for server data. **HTTP:** Axios, centralized client with base URL, auth header injection, and 401 handling.

---

## 16. Route Structure

```
/
├── login
├── register
└── app
    ├── dashboard
    ├── analytics
    ├── api-keys
    ├── services
    ├── rate-limiting
    ├── algorithms
    ├── traffic
    ├── alerts
    ├── system-health
    └── settings
```

Admin-only routes must be protected at the router level, not just hidden in the UI.

---

## 17. Page Reference

| Page | Key content |
|---|---|
| **Dashboard** | KPI row → Traffic Overview → Algorithm grid → Top API Keys + Gateway Monitoring → Status Codes + Service Analytics + Error Rate → Recent Rejected Requests |
| **Analytics** | Request analytics, status codes, services, top keys, response times, daily requests, error rate — deeper version of dashboard widgets |
| **API Keys** | Table: Name, Prefix, Created, Expires, Last Used, Status, Actions. Create/Rotate/Revoke flows. Full key shown once only. |
| **Services** | Name, Target URL, Status, Requests, Response Time, Error Rate, Last Request + per-service detail view |
| **Rate Limiting** | Current algorithm, limit, window, burst capacity, utilization, allowed/rejected, admin-editable where backend supports it |
| **Algorithms** | Dedicated card per algorithm: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window |
| **Traffic** | Filterable request log: Time Range, Service, API Key, Status Code, Method, Endpoint → Table: Time, Method, Endpoint, Service, API Key, Status, Response Time, IP |
| **Alerts** | Rate limit exceeded, high error rate, service unavailable, Redis/Postgres disconnected, expired/revoked key usage. Severity: INFO / WARNING / CRITICAL |
| **System Health** | Gateway, PostgreSQL, Redis, Target Services status + uptime, response time, last check, availability |
| **Settings** | Profile, Security, Sessions, Notifications, Dashboard Preferences, Gateway Configuration, Rate-Limit Defaults |
| **Auth (Login/Register/Session Expired/Unauthorized)** | Same design language, simplified layout — no sidebar, form-focused, minimal distraction |

Backend endpoints already available for Analytics:
```
GET /api/v1/analytics/summary
GET /api/v1/analytics/status-codes
GET /api/v1/analytics/services
GET /api/v1/analytics/top-api-keys
GET /api/v1/analytics/response-times
GET /api/v1/analytics/daily
GET /api/v1/analytics/error-rate
GET /api/v1/analytics/monitoring
```

---

## 18. Do / Don't

**Do:** use whitespace · use the 8px spacing scale · use indigo as brand · use semantic colors strictly · use monospace for technical values · use soft shadows · keep cards single-purpose · design loading/empty/error states · keep tables scannable · respect the responsive breakpoints.

**Don't:** use red as brand · use gradients or neon colors · use heavy borders · overload a card with unrelated metrics · ever show a full API key outside creation · use more than 2–4 chart colors per chart · animate decoratively · make the dashboard denser than one clear read-through per card.

---

## 19. Product Personality

Secure · Reliable · Technical · Modern · Professional · Clear · Trustworthy.

APIShield should feel like a professional infrastructure/security control center — closer to Vercel, Stripe, or Datadog in tone than to a generic productivity or finance dashboard.

---

## 20. Change Control

Any change to §3 (Color), §4 (Typography), or §5 (Spacing/Radius/Elevation) is a design-system-level change and must be reflected here first, before implementation. Component-level additions (new card types, new page patterns) should follow the closest existing pattern in §7 and §17; if none fits, add a new subsection rather than a one-off style.

---

## 21. Open Questions

*(Agent: log anything ambiguous here instead of silently deciding, so it can be resolved by the maintainer.)*

-