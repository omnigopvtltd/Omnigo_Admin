// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   Bike,
//   Store,
//   Users,
//   MessageSquare,
//   Settings,
//   UtensilsCrossed,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const NAV_ITEMS = [
//   { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
//   { to: "/orders", label: "Orders", icon: ShoppingBag },
//   { to: "/riders", label: "Riders", icon: Bike },
//   { to: "/restaurants", label: "Restaurants", icon: Store },
//   { to: "/customers", label: "Customers", icon: Users },
//   { to: "/chat", label: "Chat", icon: MessageSquare },
//   { to: "/settings", label: "Settings", icon: Settings },
// ];

// export function Sidebar({ open, onNavigate }) {
//   return (
//     <aside
//       className={cn(
//         "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform duration-200 lg:translate-x-0",
//         open ? "translate-x-0" : "-translate-x-full"
//       )}
//     >
//       <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
//         <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
//           <UtensilsCrossed className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
//         </div>
//         <div className="leading-tight">
//           <p className="font-display text-sm font-semibold text-white">Omnigo Admin</p>
//           <p className="text-[10px] uppercase tracking-wide text-sidebar-foreground/60">Admin Panel</p>
//         </div>
//       </div>

//       <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5 scrollbar-thin">
//         <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
//           Operations
//         </p>
//         {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
//           <NavLink
//             key={to}
//             to={to}
//             end={end}
//             onClick={onNavigate}
//             className={({ isActive }) =>
//               cn(
//                 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-navy text-white shadow-sm"
//                   : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
//               )
//             }
//           >
//             <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
//             {label}
//           </NavLink>
//         ))}
//       </nav>

//       <div className="border-t border-sidebar-border p-4">
//         <div className="rounded-lg bg-white/5 p-3">
//           <p className="text-xs font-medium text-white">Need the full build?</p>
//           <p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/60">
//             Finance, Live Tracking &amp; Promotions land in Phase 2.
//           </p>
//         </div>
//       </div>
//     </aside>
//   );
// }

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Bike,
  Store,
  Users,
  MessageSquare,
  Settings,
  UtensilsCrossed,
  Package,
  DollarSign,
  Megaphone,
  MapPin,
  Receipt,
  ForkKnifeCrossed,
  LocationEdit,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/riders", label: "Riders", icon: Bike },
  { to: "/restaurants", label: "Restaurants", icon: Store },
  { to: "/home-chefs", label: "Home Chefs", icon: UtensilsCrossed },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: ForkKnifeCrossed },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/finance", label: "Finance", icon: Receipt },
  { to: "/live-tracking", label: "Live Tracking", icon: MapPin },
  { to: "/promotions", label: "Promotions", icon: Megaphone },
  { to: "/zone", label: "Zones", icon: LocationEdit },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onNavigate }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform duration-200 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
        <img src={"/omnigo_logo.png"} alt="omnigo logo" className="w-16 h-16" />
        {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">

          <UtensilsCrossed className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
        </div> */}
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold text-black">Omnigo</p>
          <p className="text-[10px] uppercase tracking-wide text-sidebar-foreground/60">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5 scrollbar-thin">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Explore
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-navy text-white shadow-sm"
                  : "text-sidebar-foreground hover:bg-black/15 hover:text-black"
              )
            }
          >
            <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-xs font-medium text-white">Need the full build?</p>
          <p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/60">
            Finance, Live Tracking &amp; Promotions land in Phase 2.
          </p>
        </div>
      </div> */}
    </aside>
  );
}
