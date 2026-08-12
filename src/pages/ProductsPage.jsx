import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, flexRender,
} from "@tanstack/react-table";
import {
  Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Leaf,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { cn } from "@/lib/utils";
import { useRestaurants } from "@/hooks/useRestaurants";
import {
  useProducts, useCreateProduct, useUpdateProduct,
  useToggleAvailability, useDeleteProduct,
} from "@/hooks/useProducts";

const CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: restaurantData } = useRestaurants({ limit: 100 });
  const restaurants = restaurantData?.restaurants ?? [];

  const { data, isLoading, isFetching } = useProducts({ search, restaurantId, status, page, limit: 8 });
  const products = data?.products ?? [];
  console.log(data);
  

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const availabilityMutation = useToggleAvailability();
  const deleteMutation = useDeleteProduct();

  const FILTERS = [
  { value: "all", label: "All Products" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.images?.[0]}
            alt=""
            className="h-9 w-9 rounded-lg object-cover"
            onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
              {row.original.isVeg && <Leaf className="h-3.5 w-3.5 shrink-0 text-success" />}
              {row.original.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.restaurantId?.name ?? "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.discountPrice ? (
            <>
              <span className="font-medium text-foreground">{CURRENCY.format(row.original.discountPrice)}</span>{" "}
              <span className="text-xs text-muted-foreground line-through">{CURRENCY.format(row.original.price)}</span>
            </>
          ) : (
            <span className="font-medium text-foreground">{CURRENCY.format(row.original.price)}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isAvailable",
      header: "Available",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isAvailable}
          onCheckedChange={(v) => availabilityMutation.mutate({ id: row.original._id, isAvailable: v })}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "success" : "secondary"}>
          {row.original.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditing(row.original); setFormOpen(true); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleteTarget(row.original)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ], [availabilityMutation]);

  const table = useReactTable({ data: products, columns, getCoreRowModel: getCoreRowModel() });

  function handleFormSubmit(payload) {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload }, { onSuccess: () => setFormOpen(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* <div className="flex flex-wrap gap-2">
          <Select value={restaurantId} onChange={(e) => { setRestaurantId(e.target.value); setPage(1); }} className="w-48">
            <option value="">All Restaurants</option>
            {restaurants.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
          </Select>
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-36">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div> */}
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

        <div className="flex gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products…" className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Button className="bg-navy" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
              <p className="text-sm font-medium text-foreground">No products found</p>
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
                  Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} products
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

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This product will be permanently removed from the catalog."
        onConfirm={() => deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}