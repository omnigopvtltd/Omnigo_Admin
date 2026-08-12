import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ban,
  ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CategoryFormDialog } from "@/components/categories/CategoryFormDialog";
import { cn } from "@/lib/utils";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  //   useUpdateCategoryStatus,
  useDeleteCategory,
} from "@/hooks/useCategories";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "featured", label: "Featured" },
];

const STATUS_BADGE = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "secondary" },
};

export default function CategoriesPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useCategories({
    status,
    search,
    page,
    limit: 8,
  });
  const categories = data ?? [];
  console.log(categories);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  //   const statusMutation = useUpdateCategoryStatus();
  const deleteMutation = useDeleteCategory();

  const columns = useMemo(
    () => [
      {
        accessorKey: "categoryName",
        header: "Category",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt=""
                className="h-9 w-9 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {row.original.categoryName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                /{row.original.categorySlug}
              </p>
            </div>
          </div>
        ),
      },
      // {
      //   accessorKey: "subCategories",
      //   header: "Sub-Categories",
      //   cell: ({ row }) => (
      //     <div className="flex flex-wrap gap-1">
      //       {(row.original.subCategories ?? []).slice(0, 3).map((sub) => (
      //         <Badge key={sub} variant="secondary" className="font-normal">
      //           {sub}
      //         </Badge>
      //       ))}
      //       {(row.original.subCategories?.length ?? 0) > 3 && (
      //         <span className="text-xs text-muted-foreground self-center">
      //           +{(row.original.subCategories?.length ?? 0) - 3}
      //         </span>
      //       )}
      //     </div>
      //   ),
      // },
      {
        accessorKey: "subCategories",
        header: "Sub-Categories",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {(row.original.subCategories ?? []).slice(0, 3).map((sub, idx) => {
              // Handle both object schema { name: "..." } and string fallback
              const subName = typeof sub === "object" ? sub?.name : sub;
              const subKey =
                typeof sub === "object"
                  ? sub?._id || sub?.name || idx
                  : `${sub}-${idx}`;

              return (
                <Badge key={subKey} variant="secondary" className="font-normal">
                  {subName}
                </Badge>
              );
            })}
            {(row.original.subCategories?.length ?? 0) > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{(row.original.subCategories?.length ?? 0) - 3}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "itemCount",
        header: "Items",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            {row.original.itemCount ?? 0} items
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const config =
            STATUS_BADGE[row.original.status] ?? STATUS_BADGE.inactive;
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const cat = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                title={cat.status === "active" ? "Deactivate" : "Activate"}
                onClick={() =>
                  updateMutation.mutate({
                    id: cat._id,
                    status: cat.status === "active" ? "inactive" : "active",
                  })
                }
              >
                <Ban className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                title="Edit"
                onClick={() => {
                  setEditing(cat);
                  setFormOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                title="Delete"
                onClick={() => setDeleteTarget(cat)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          );
        },
      },
    ],
    [updateMutation],
  );

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleFormSubmit(payload) {
    if (editing) {
      updateMutation.mutate(
        { id: editing._id, payload },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      console.log(payload);

      createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-5">
      {/* Search & Tabs Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
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
              placeholder="Search categories…"
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            className="bg-navy"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
              <p className="text-sm font-medium text-foreground">
                No categories found
              </p>
              <p className="text-xs text-muted-foreground">
                Try adjusting search filters or create a new category.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="hover:bg-transparent">
                      {hg.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={
                            header.id === "actions" ? "text-right" : ""
                          }
                        >
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

              {/* Table Footer */}
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">
                  Page {data?.page ?? 1} of {data?.totalPages ?? 1} ·{" "}
                  {data?.total ?? 0} categories
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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

      {/* Form & Confirmation Modals */}
      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.categoryName}?`}
        description="This may unassign products linked to this category. This action cannot be undone."
        onConfirm={() =>
          deleteMutation.mutate(deleteTarget._id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
