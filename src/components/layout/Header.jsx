// import { Search, Bell, Menu } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// export function Header({ title, onMenuClick }) {
//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur lg:px-8">
//       <Button
//         variant="ghost"
//         size="icon"
//         className="lg:hidden"
//         onClick={onMenuClick}
//       >
//         <Menu className="h-5 w-5" />
//       </Button>

//       <div className="min-w-0 flex-1">
//         <h1 className="truncate font-display text-lg font-semibold text-foreground">
//           {title}
//         </h1>
//       </div>

//       <div className="relative hidden w-72 md:block">
//         <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//         <Input placeholder="Search orders, riders, restaurants…" className="pl-9" />
//       </div>

//       <Button variant="ghost" size="icon" className="relative">
//         <Bell className="h-5 w-5" />
//         <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-navy ring-2 ring-card" />
//       </Button>

//       <Avatar>
//         <AvatarFallback>AD</AvatarFallback>
//       </Avatar>
//     </header>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { Search, Bell, Menu, Package, UserCheck, Store, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchGlobal, getNotifications } from "@/api/admin";

export function Header({ title, onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Execute global search query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["globalSearch", debouncedQuery],
    queryFn: () => searchGlobal(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  // Fetch notifications
  const { data: notifyData } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 15000, // Poll every 15s
  });

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults =
    searchResults &&
    (searchResults.orders?.length > 0 ||
      searchResults.riders?.length > 0 ||
      searchResults.vendors?.length > 0);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Global Live Search Bar */}
      <div className="relative hidden w-80 md:block" ref={searchRef}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders, riders, vendors…"
          className="pl-9"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
        />

        {/* Search Results Dropdown */}
        {isSearchOpen && debouncedQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-12 z-50 rounded-lg border border-border bg-popover p-2 shadow-xl">
            {isSearching && <p className="p-3 text-xs text-muted-foreground">Searching database...</p>}

            {!isSearching && !hasResults && (
              <p className="p-3 text-xs text-muted-foreground">No matches found for "{debouncedQuery}"</p>
            )}

            {hasResults && (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {/* Orders */}
                {searchResults.orders?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground px-2">Orders</span>
                    {searchResults.orders.map((order) => (
                      <div
                        key={order._id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/orders?id=${order._id}`);
                        }}
                        className="flex items-center gap-2 rounded p-2 hover:bg-accent cursor-pointer text-sm"
                      >
                        <Package className="h-4 w-4 text-primary" />
                        <span className="font-medium">#{order.orderId || order._id}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{order.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Riders */}
                {searchResults.riders?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground px-2">Riders</span>
                    {searchResults.riders.map((rider) => (
                      <div
                        key={rider._id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/tracking?rider=${rider._id}`);
                        }}
                        className="flex items-center gap-2 rounded p-2 hover:bg-accent cursor-pointer text-sm"
                      >
                        <UserCheck className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{rider.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{rider.phone}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vendors */}
                {searchResults.vendors?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground px-2">Vendors</span>
                    {searchResults.vendors.map((vendor) => (
                      <div
                        key={vendor._id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/vendors?id=${vendor._id}`);
                        }}
                        className="flex items-center gap-2 rounded p-2 hover:bg-accent cursor-pointer text-sm"
                      >
                        <Store className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{vendor.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notifications Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => navigate("/notifications")}
      >
        <Bell className="h-5 w-5" />
        {notifyData?.unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card animate-pulse" />
        )}
      </Button>

      {/* Profile Avatar */}
      <Link to="/profile">
        <Avatar className="cursor-pointer transition hover:opacity-80">
          <AvatarImage src="/avatar.jpg" />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">AD</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}