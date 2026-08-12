# FoodFleet Admin — Dashboard Scaffold

Admin panel for the food delivery platform, built with the agreed stack.

## Stack

React (Vite) · Tailwind CSS · shadcn-style UI (CVA + Radix conventions) · React Router
TanStack Query · TanStack Table · React Hook Form + Zod · Socket.io Client · Axios · Recharts

## What's done (Step 1)

- Vite + React project, Tailwind CSS v4 configured with a brand token system (coral / navy / gold).
- App shell: collapsible **Sidebar**, **Header** (search, notifications, avatar), responsive layout with routing via React Router.
- **Dashboard** — 8 KPI cards, 30-day revenue area chart (Recharts), recent orders feed. All wired to TanStack Query hooks.
- **Orders** — full TanStack Table with status-filter pills, search, pagination, status badges, loading/empty states.
- **Riders, Restaurants, Customers** — scaffolded placeholder pages previewing what each module will contain.
- **Chat** — conversation-type list + a working `socket.io-client` connection hook (connects to `VITE_SOCKET_URL`; shows real connection status once a socket server exists).
- **Settings** — live form example using React Hook Form + Zod validation.
- API layer (`src/api/*`) returns mock data today but is already shaped like real endpoint responses — swap the body of each function for an `axiosClient` call once the backend exists, no UI changes needed.

## Run it

```bash
npm install
cp .env.example .env   # optional, defaults work with mock data
npm run dev
```

## Project structure

```
src/
  api/            mock + future-real API functions (dashboard.js, orders.js, axiosClient.js)
  components/
    layout/        Sidebar, Header, AppLayout, PlaceholderPage
    dashboard/      StatCard
    orders/         OrderStatusBadge
    ui/             button, card, badge, input, avatar, table, skeleton (shadcn-style primitives)
  hooks/          useDashboard.js, useOrders.js, useSocket.js (TanStack Query + socket.io wrappers)
  pages/          DashboardPage, OrdersPage, RidersPage, RestaurantsPage, CustomersPage, ChatPage, SettingsPage
```

## Next steps

1. Stand up the real backend and point `VITE_API_URL` at it; replace mock bodies in `src/api/*` with the commented `axiosClient` calls.
2. Build out Riders / Restaurants / Customers with the same table + form pattern used in Orders / Settings.
3. Wire a real Socket.io server for Chat and Live Tracking.
4. Add Finance, Live Tracking, Promotions, Notifications modules (Phase 2 per the roadmap).
