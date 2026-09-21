# Hydration Boundary & Serialization Audit

## 1. React Server Components (RSC) vs Client Components Boundary

In Next.js App Router, components are React Server Components by default unless marked with `'use client'`.

- **Execution Context**:
  - RSCs execute strictly on the server (Node.js runtime).
  - Client Components render on the server during initial HTML generation (SSR) and hydrate on the client browser DOM.

- **Boundary Definition**:
  - The boundary is defined whenever an RSC imports and renders a Client Component (`'use client'`).

---

## 2. Prop Serialization Rules Across Boundary

When an RSC passes props to a Client Component, React serializes the props into a special payload stream (RSC Payload).

### Serializable Types
- Primitive values (`string`, `number`, `boolean`, `null`, `undefined`, `BigInt`)
- Plain JavaScript objects and arrays containing serializable types
- React JSX elements (as server references)
- `Promises` (passed to React `<Suspense>` or `use()`)
- Server Actions (functions marked with `'use server'`)

### Non-Serializable Types
- Standard JavaScript functions / event handlers (`onClick`, `onChange`)
- Class instances or prototype objects
- Symbols
- Un-handled DOM references or browser-only APIs (`window`, `document`)

---

## 3. Hydration Mismatch & Layout Shift Prevention

### Theme Switching (`next-themes`)
- `next-themes` modifies `class="dark"` or `class="light"` on the root `<html>` element.
- During initial SSR, the server does not know the user's browser theme preference stored in `localStorage`.
- **Solution**:
  1. Add `suppressHydrationWarning` to the `<html>` tag in `src/app/layout.tsx`.
  2. Implement a `mounted` state check (`useEffect`) inside components like `ThemeToggle` to defer theme-dependent DOM rendering until after client hydration, eliminating layout shifts and react warning flashes.

---

## 4. Decoupled State Architecture (Zustand & Layout Boundaries)

- Parent layouts (`layout.tsx`) remain pure Server Components.
- Client state (Zustand cart store with `persist` middleware) is accessed via granular selectors (e.g., `useCartCount()`, `useCartTotal()`).
- High-frequency state changes trigger re-renders only in the specific leaf client components (`CartBadge`, `CartPanel`) without triggering parent layout re-renders.
