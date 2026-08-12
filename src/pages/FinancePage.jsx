import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Wallet, TrendingUp, Receipt, Percent, Search, Check, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  useRevenueOverview, useRestaurantEarnings, useRiderEarnings,
  useWithdrawRequests, useUpdateWithdrawRequest, useTransactions,
} from "@/hooks/useFinance";

const CURRENCY = new Intl.NumberFormat("en-PK", { 
  style: "currency", 
  currency: "PKR" 
});

const CURRENCY0 = new Intl.NumberFormat("en-PK", { 
  style: "currency", 
  currency: "PKR", 
  maximumFractionDigits: 0 
});

function OverviewTab() {
  const { data, isLoading } = useRevenueOverview("30d");

  const cards = [
    { label: "Total Revenue", value: data?.summary.totalRevenue, icon: Wallet, format: CURRENCY0 },
    { label: "Total Orders", value: data?.summary.totalOrders, icon: TrendingUp },
    { label: "Avg. Order Value", value: data?.summary.avgOrderValue, icon: Receipt, format: CURRENCY },
    { label: "Tax Collected", value: data?.summary.totalTax, icon: Percent, format: CURRENCY0 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 p-5">
              {isLoading ? (
                <>
                  <Skeleton className="h-11 w-11 rounded-lg" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-5 w-16" /></div>
                </>
              ) : (
                <>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                    <p className="font-display text-xl font-semibold text-foreground">
                      {c.format ? c.format.format(c.value ?? 0) : (c.value ?? 0).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue — Last 30 Days</CardTitle>
          <CardDescription>Gross platform revenue, updated daily</CardDescription>
        </CardHeader>
        <CardContent className="pl-0">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data?.series} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="financeRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#000080" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#000080" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e6e7ee" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b7085" }} interval={4} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b7085" }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} width={44} />
                <Tooltip formatter={(value) => CURRENCY.format(value)} contentStyle={{ borderRadius: 10, borderColor: "#e6e7ee", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#000080" strokeWidth={2.5} fill="url(#financeRevenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RestaurantEarningsTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRestaurantEarnings({ search, page, limit: 8 });
  const earnings = data?.earnings ?? [];

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search restaurants…" className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Gross Sales</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Net Payout</TableHead>
                    <TableHead>Wallet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.map((e) => (
                    <TableRow key={e.restaurantId}>
                      <TableCell className="font-medium text-foreground">{e.name}</TableCell>
                      <TableCell>{e.ordersCount}</TableCell>
                      <TableCell>{CURRENCY.format(e.grossSales)}</TableCell>
                      <TableCell className="text-destructive">-{CURRENCY.format(e.commissionAmount)} ({e.commissionRate}%)</TableCell>
                      <TableCell className="font-medium text-success">{CURRENCY.format(e.netPayout)}</TableCell>
                      <TableCell>{CURRENCY.format(e.walletBalance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} restaurants</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /> Prev</Button>
                  <Button variant="outline" size="sm" disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RiderEarningsTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRiderEarnings({ search, page, limit: 8 });
  const earnings = data?.earnings ?? [];

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search riders…" className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Rider</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead>Wallet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.map((e) => (
                    <TableRow key={e.riderId}>
                      <TableCell className="font-medium text-foreground">{e.name}</TableCell>
                      <TableCell className="text-muted-foreground">{e.phone}</TableCell>
                      <TableCell>{e.deliveredCount}</TableCell>
                      <TableCell className="font-medium text-success">{CURRENCY.format(e.totalEarned)}</TableCell>
                      <TableCell>{CURRENCY.format(e.walletBalance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} riders</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /> Prev</Button>
                  <Button variant="outline" size="sm" disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const WITHDRAW_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function WithdrawalsTab() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useWithdrawRequests({ status, page, limit: 8 });
  const requests = data?.requests ?? [];
  const updateMutation = useUpdateWithdrawRequest();
  console.log(requests);
  

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {WITHDRAW_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setStatus(f.value); setPage(1); }}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              status === f.value ? "bg-navy text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : requests.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No withdraw requests found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Requested By</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={isFetching ? "opacity-60 transition-opacity" : ""}>
                  {requests.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>
                        <p className="font-medium text-foreground">{r.riderId?.name ?? r.restaurantId?.name}</p>
                        <p className="text-xs text-muted-foreground">{r.riderId ? "Rider" : "Restaurant"}</p>
                      </TableCell>
                      <TableCell className="font-medium">{CURRENCY.format(r.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">{r.method.replace("_", " ")}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "approved" ? "success" : r.status === "rejected" ? "destructive" : "warning"}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {r.status === "pending" ? (
                          <div className="flex justify-end gap-1">
                            {/* {console.log(r.wallet.balance)} */}
                            <Button
                              variant="ghost" size="icon" title="Approve"
                              onClick={() => r.riderId?.wallet.balance >= r.amount ? updateMutation.mutate({ id: r._id, status: "approved" }): alert("Insufficient Balance")}
                            >
                              <Check className="h-4 w-4 text-success" />
                            </Button>
                            <Button
                              variant="ghost" size="icon" title="Reject"
                              onClick={() => updateMutation.mutate({ id: r._id, status: "rejected", adminNote: "Rejected by admin" })}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">{r.adminNote}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} requests</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /> Prev</Button>
                  <Button variant="outline" size="sm" disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const TRANSACTION_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
];

function TransactionsTab() {
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransactions({ type, page, limit: 12 });
  const transactions = data?.transactions ?? [];

  return (
    <div className="space-y-4">
    <div className="flex flex-wrap gap-1.5">
        {TRANSACTION_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setType(f.value); setPage(1); }}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              type === f.value ? "bg-navy text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Party</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Balance After</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t._id}>
                      <TableCell className="font-medium text-foreground">{t.userId?.name ?? t.restaurantId?.name ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant={t.type === "credit" ? "success" : "destructive"}>{t.type}</Badge>
                      </TableCell>
                      <TableCell>{t.type === "credit" ? "+" : "-"}{CURRENCY.format(t.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">{t.reason}</TableCell>
                      <TableCell>{CURRENCY.format(t.balanceAfter)}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} transactions</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /> Prev</Button>
                  <Button variant="outline" size="sm" disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FinancePage() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="restaurants">Restaurant Earnings</TabsTrigger>
        <TabsTrigger value="riders">Rider Earnings</TabsTrigger>
        <TabsTrigger value="withdrawals">Withdraw Requests</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><OverviewTab /></TabsContent>
      <TabsContent value="restaurants"><RestaurantEarningsTab /></TabsContent>
      <TabsContent value="riders"><RiderEarningsTab /></TabsContent>
      <TabsContent value="withdrawals"><WithdrawalsTab /></TabsContent>
      <TabsContent value="transactions"><TransactionsTab /></TabsContent>
    </Tabs>
  );
}