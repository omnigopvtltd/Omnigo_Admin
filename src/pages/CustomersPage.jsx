import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Ban, 
  Trash2 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"; // Ensure Badge is imported!
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useCustomers, useCustomerStatus } from "@/hooks/useCustomers";

const FILTERS = [
  { value: "all", label: "All Users" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

export default function CustomerPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  
  const [deleteTarget, setDeleteTarget] = useState(null); // Managed if needed for deleting

  const {
    data: users,
    isLoading,
    isFetching,
  } = useCustomers({ status, search });

  const statusMutation = useCustomerStatus();

  const data = useMemo(() => users ?? [], [users]);

  // Hook variables like statusMutation must be available inside the table column actions scope
  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Contact No" },
      {
        accessorKey: "isBlocked",
        header: "Status",
        cell: ({ row }) => {
          const isBlocked = row.original.isBlocked;
          return isBlocked ? (
            <Badge variant="destructive">Blocked</Badge>
          ) : (
            <Badge className="" variant={"success"}>Active</Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: (i) =>
          new Date(i.getValue()).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              {/* If user is currently blocked, show Unblock/Verify option */}
              {r.isBlocked ? (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Unblock User"
                  onClick={() =>
                    statusMutation.mutate({ id: r._id, isBlocked: false })
                  }
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </Button>
              ) : (
                /* If user is active, show Block option */
                <Button
                  variant="ghost"
                  size="icon"
                  title="Block User"
                  onClick={() =>
                    statusMutation.mutate({ id: r._id, isBlocked: true })
                  }
                >
                  <Ban className="h-4 w-4 text-destructive" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                title="Delete"
                onClick={() => setDeleteTarget(r)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          );
        },
      },
    ],
    [statusMutation],
  );

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
                  ? "bg-navy text-primary-foreground"
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
            placeholder="Search customer…"
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
                No Customers match your filters
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
                  {table.getPageCount()} · {data.length} customers
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