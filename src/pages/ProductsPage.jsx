import { useMemo, useState } from "react";
import {
  useReactTable, getCoreRowModel, flexRender,
} from "@tanstack/react-table";
import {
  Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Leaf, Store, Utensils, ShoppingBag, ChefHat, Pizza, Cake, Coffee, ShoppingBasket,
  Pill,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { cn } from "@/lib/utils";
import { useVendors } from "@/hooks/useVendors";
import {
  useProducts, useCreateProduct, useUpdateProduct,
  useToggleAvailability, useDeleteProduct,
} from "@/hooks/useProducts";

const CURRENCY = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  currencyDisplay: "code"
});

// BUSINESS TYPE TABS CONFIGURATION
const BUSINESS_TYPES = [
  { value: "all", label: "All Types", icon: Store },
  { value: "restaurant", label: "Restaurants", icon: Utensils },
  { value: "home-chef", label: "Home Chef", icon: ChefHat },
  { value: "grocery", label: "Grocery", icon: ShoppingBag },
];

// CATEGORY FILTERS CONFIGURATION 
const CATEGORIES = [
  { value: "all", label: "All Categories", icon: ShoppingBasket },
  { value: "fast-food", label: "Fast Food", icon: Pizza },
  { value: "bakery", label: "Bakery", icon: Cake },
  { value: "grocery", label: "Grocery Items", icon: ShoppingBag },
  { value: "pharmacy", label: "Pharmacy", icon: Pill }, 
  { value: "beverages", label: "Beverages", icon: Coffee },
];

const STATUS_FILTERS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [status, setStatus] = useState("all");
  const [businessType, setBusinessType] = useState("all");
  const [category, setCategory] = useState("all"); // 👈 NEW STATE FOR CATEGORY FILTER
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: vendorData } = useVendors({ limit: 100 });

  // Pass `category` to API hook
  const { data, isLoading, isFetching } = useProducts({ 
    search, 
    vendorId, 
    isAvailable: status === "all" ? undefined : status === "active" ? true : false,
    businessType: businessType === "all" ? "" : businessType,
    category: category === "all" ? "" : category, // 👈 PASSED TO BACKEND QUERY PARAMS
    page, 
    limit: 8 
  });
  const products = data?.products ?? [];

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const availabilityMutation = useToggleAvailability();
  const deleteMutation = useDeleteProduct();

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
              {row.original.isVeg && <Leaf className="h-3.5 w-3.5 shrink-0 text-success" title="Vegetarian" />}
              {row.original.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.vendorId?.name ?? "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="secondary" className="capitalize">{row.original.category}</Badge>,
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

  function handleFormSubmit(formData) {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload: formData }, { onSuccess: () => setFormOpen(false) });
    } else {
      createMutation.mutate(formData, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-5">
      {/* 1. BUSINESS TYPE TABS */}
      {/* <div className="flex border-b border-border pb-1">
        <div className="flex gap-2 overflow-x-auto">
          {BUSINESS_TYPES.map((bt) => {
            const Icon = bt.icon;
            const isActive = businessType === bt.value;
            return (
              <button
                key={bt.value}
                onClick={() => {
                  setBusinessType(bt.value);
                  setPage(1);
                }}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "border-navy text-navy font-semibold"
                    : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-navy" : "text-muted-foreground")} />
                {bt.label}
              </button>
            );
          })}
        </div>
      </div> */}

      {/* 2. CATEGORY FILTERS CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {/* <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">Category:</span> */}
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setPage(1);
              }}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all border",
                isActive
                  ? "bg-navy text-white border-navy shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. STATUS FILTERS & SEARCH ROW */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                status === f.value
                  ? "bg-navy text-white font-semibold border border-border"
                  : "text-muted-foreground hover:bg-secondary/70"
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

      {/* TABLE CARD */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
              <p className="text-sm font-medium text-foreground">No products found</p>
              <p className="text-xs text-muted-foreground">Try selecting a different category or search query.</p>
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