import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  OrderStatusBadge,
  ORDER_STATUSES,
  STATUS_CONFIG,
} from "@/components/orders/OrderStatusBadge";
import { cn } from "@/lib/utils";
import { useOrders } from "@/hooks/useOrders";

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const FILTERS = [
  { value: "all", label: "All Orders" },
  ...ORDER_STATUSES.map((s) => ({
    value: s,
    label: STATUS_CONFIG[s].label,
  })),
];

const columns = [
  {
    accessorKey: "orderNumber",
    header: "Order ID",
    cell: (i) => (
      <span className="font-medium text-foreground">{i.getValue()}</span>
    ),
  },
  { accessorKey: "_id", header: "Customer" },
  // { accessorKey: "restaurant", header: "Restaurant" },
  // { accessorKey: "riderId", header: "Rider" },
  {
    id: "item",
    header: "Item",
    accessorFn: (row) => row.items?.[0]?.name || "-",
  },
  {
    id: "category",
    header: "Category",
    accessorFn: (row) => row.items?.[0]?.category || "-",
  },
  {
    id: "price",
    header: "Price",
    accessorFn: (row) => row.items?.[0]?.price || 0,
    cell: ({ getValue }) => CURRENCY.format(getValue()),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: (i) => CURRENCY.format(i.getValue()),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (i) => <OrderStatusBadge status={i.getValue()} />,
  },
  {
    accessorKey: "createdAt",
    header: "Placed",
    cell: (i) =>
      new Date(i.getValue()).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
  },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { data: orders, isLoading, isFetching } = useOrders({ status, search });

  const data = useMemo(() => orders ?? [], [orders]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                status === f.value
                  ? "bg-navy text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order, customer…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
              <p className="text-sm font-medium text-foreground">
                No orders match your filters
              </p>
              <p className="text-xs text-muted-foreground">
                Try a different status or search term.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="hover:bg-transparent">
                      {hg.headers.map((header) => (
                        <TableHead key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody
                  className={cn(isFetching && "opacity-60 transition-opacity")}
                >
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()} · {data.length} orders
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
