// import { Store } from "lucide-react";
// import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

// export default function HomeChefPage() {
//   return (
//     <PlaceholderPage
//       icon={Store}
//       title="Restaurants"
//       description="Approvals, documents, commission rates, and payouts will land here in the next milestone."
//       upcoming={["Pending Approval", "Commission %", "Menu", "Payouts"]}
//     />
//   );
// }

///////////////////////////////////////////////////////

import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, flexRender,
} from "@tanstack/react-table";
import {
  Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Star, CheckCircle2, Ban,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RestaurantFormDialog } from "@/components/restaurants/RestaurantFormDialog";
import { cn } from "@/lib/utils";
import {
  useHomeChefs, useCreateHomeChef, useUpdateHomeChef,
  useUpdateHomeChefStatus, useDeleteHomeChef,
} from "@/hooks/useHomeChefs";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "blocked", label: "Blocked" },
];

const STATUS_BADGE = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  blocked: { label: "Blocked", variant: "destructive" },
};

export default function HomeChefPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useHomeChefs({ status, search, page, limit: 8 });
  const homeChefs = data?.homeChefs ?? [];
  

  const createMutation = useCreateHomeChef();
  const updateMutation = useUpdateHomeChef();
  const statusMutation = useUpdateHomeChefStatus();
  const deleteMutation = useDeleteHomeChef();

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "HomeChef",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.logo}
            alt=""
            className="h-9 w-9 rounded-lg object-cover"
            onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.address?.city}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "cuisines",
      header: "Cuisines",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.original.cuisines ?? []).slice(0, 2).map((c) => (
            <Badge key={c} variant="secondary">{c}</Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          {row.original.rating?.average?.toFixed(1) ?? "—"}
          <span className="text-xs text-muted-foreground">({row.original.rating?.count ?? 0})</span>
        </span>
      ),
    },
    {
      accessorKey: "commissionRate",
      header: "Commission",
      cell: ({ row }) => <span className="text-sm">{row.original.commissionRate}%</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const config = STATUS_BADGE[row.original.status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            {r.status !== "approved" && (
              <Button
                variant="ghost" size="icon" title="Approve"
                onClick={() => statusMutation.mutate({ id: r._id, status: "approved" })}
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
              </Button>
            )}
            {r.status !== "blocked" && (
              <Button
                variant="ghost" size="icon" title="Block"
                onClick={() => statusMutation.mutate({ id: r._id, status: "blocked" })}
              >
                <Ban className="h-4 w-4 text-destructive" />
              </Button>
            )}
            <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditing(r); setFormOpen(true); }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleteTarget(r)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ], [statusMutation]);

  const table = useReactTable({ data: homeChefs, columns, getCoreRowModel: getCoreRowModel() });

  function handleFormSubmit(payload) {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload }, { onSuccess: () => setFormOpen(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1); }}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                status === f.value ? "bg-navy text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants…" className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Button className="bg-navy" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Home Chef
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : homeChefs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
              <p className="text-sm font-medium text-foreground">No home chefs found</p>
              <p className="text-xs text-muted-foreground">Try a different filter or add a new one.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="hover:bg-transparent">
                      {hg.headers.map((header) => (
                        <TableHead key={header.id} className={header.id === "actions" ? "text-right" : ""}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className={cn(isFetching && "opacity-60 transition-opacity")}>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">
                  Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} restaurants
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    disabled={page >= (data?.totalPages ?? 1)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <RestaurantFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        restaurant={editing}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This also removes every product listed under this restaurant. This can't be undone."
        onConfirm={() => deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}