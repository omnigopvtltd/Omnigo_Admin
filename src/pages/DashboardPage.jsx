import {
  Wallet,
  ShoppingBag,
  Bike,
  Store,
  Clock3,
  XCircle,
  Timer,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import {
  useDashboardStats,
  useRevenueSeries,
  useRecentOrders,
} from "@/hooks/useDashboard";
import { Link } from "react-router-dom";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatStat(stat) {
  if (!stat) return "—";
  if (stat.unit === "%") return `${stat.value}%`;
  if (stat.unit === "min") return `${stat.value} min`;
  return stat.value.toLocaleString();
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenue, isLoading: revenueLoading } = useRevenueSeries();
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders();

  const cards = [
    {
      key: "todaysRevenue",
      label: "Today's Revenue",
      icon: Wallet,
      accent: "coral",
      format: (s) => CURRENCY.format(s.value),
    },
    {
      key: "todaysOrders",
      label: "Today's Orders",
      icon: ShoppingBag,
      accent: "navy",
    },
    { key: "activeRiders", label: "Active Riders", icon: Bike, accent: "gold" },
    {
      key: "onlineRestaurants",
      label: "Online Restaurants",
      icon: Store,
      accent: "coral",
    },
    {
      key: "pendingOrders",
      label: "Pending Orders",
      icon: Clock3,
      accent: "navy",
    },
    {
      key: "cancelledOrders",
      label: "Cancelled Orders",
      icon: XCircle,
      accent: "gold",
    },
    {
      key: "avgDeliveryTime",
      label: "Avg. Delivery Time",
      icon: Timer,
      accent: "coral",
    },
    {
      key: "customerGrowth",
      label: "Customer Growth",
      icon: TrendingUp,
      accent: "navy",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const stat = stats?.[c.key];
          return (
            <StatCard
              key={c.key}
              label={c.label}
              icon={c.icon}
              accent={c.accent}
              loading={statsLoading}
              value={
                stat ? (c.format ? c.format(stat) : formatStat(stat)) : "—"
              }
              change={stat?.change ?? 0}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue — Last 30 Days</CardTitle>
            <CardDescription>
              Gross platform revenue, updated daily
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            {revenueLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={revenue}
                  margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#000080"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#000080" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e6e7ee" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#6b7085" }}
                    interval={4}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#6b7085" }}
                    tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                    width={44}
                  />
                  <Tooltip
                    formatter={(value) => CURRENCY.format(value)}
                    contentStyle={{
                      borderRadius: 10,
                      borderColor: "#e6e7ee",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#000080"
                    strokeWidth={2.5}
                    fill="url(#revenueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest activity across all restaurants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {ordersLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5"
                  >
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))
              : recentOrders?.slice(0, 6)?.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="flex items-center justify-between border-b border-border py-2.5 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {order.customer}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {order.orderNumber} · {order.restaurant}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                ))}
          </CardContent>
          <CardFooter className="w-full">
            <Link
              to="/orders"
              className="text-navy text-sm flex gap-1 justify-end w-full items-center hover:underline"
            >
              View More <ArrowRight size={16} />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
