// import { Store } from "lucide-react";
// import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

// export default function VendorPage() {
//   return (
//     <PlaceholderPage
//       icon={Store}
//       title="Vendors"
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
  Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Star,
  CheckCircle2, Ban, Eye, Building, Mail, Phone, FileText, Landmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { VendorFormDialog } from "@/components/vendors/VendorFormDialog";
import { cn } from "@/lib/utils";
import {
  useVendors, useUpdateVendor,
  useUpdateVendorStatus, useDeleteVendor,
} from "@/hooks/useVendors";

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

export default function VendorPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewingVendor, setViewingVendor] = useState(null); // State for View Popup

  const { data, isLoading, isFetching } = useVendors({ status, search, page, limit: 8 });
  const vendors = data?.vendors ?? (Array.isArray(data) ? data : []);

  // const createMutation = useCreateVendor();
  const updateMutation = useUpdateVendor();
  const statusMutation = useUpdateVendorStatus();
  const deleteMutation = useDeleteVendor();

  const columns = useMemo(() => [
    {
      accessorKey: "businessName",
      header: "Vendor",
      cell: ({ row }) => {
        const r = row.original;
        const vendorName = r.businessName || r.name || "Unnamed Vendor";
        const imageSrc = r.logo || r.coverImage || "";

        return (
          <div className="flex items-center gap-3">
            <img
              src={imageSrc}
              alt={vendorName}
              className="h-9 w-9 rounded-lg object-cover bg-secondary"
              onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{vendorName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {r.category || r.businessType || "General"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => <span className="text-sm">{row.original.businessPhone ?? "restaurant"}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="text-sm">{row.original.businessEmail ?? "fast-food"}</span>,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          {row.original.rating?.average?.toFixed(1) ?? "0.0"}
          <span className="text-xs text-muted-foreground">({row.original.rating?.count ?? 0})</span>
        </span>
      ),
    },
    {
      accessorKey: "commissionRate",
      header: "Commission",
      cell: ({ row }) => <span className="text-sm">{row.original.commissionRate ?? 0}%</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const currentStatus = row.original.status || row.original.verificationStatus || "pending";
        const config = STATUS_BADGE[currentStatus] || { label: currentStatus, variant: "secondary" };

        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const r = row.original;
        const currentStatus = r.status || r.verificationStatus;
        return (
          <div className="flex items-center justify-end gap-1">
            {/* View Details Button */}
            <Button
              variant="ghost" size="icon" title="View Details"
              onClick={() => setViewingVendor(r)}
            >
              <Eye className="h-4 w-4 text-sky-500" />
            </Button>

            {currentStatus !== "approved" && (
              <Button
                variant="ghost" size="icon" title="Approve"
                onClick={() => statusMutation.mutate({ id: r._id, status: "approved" })}
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
              </Button>
            )}
            {currentStatus !== "blocked" && (
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

  const table = useReactTable({ data: vendors, columns, getCoreRowModel: getCoreRowModel() });

  function handleFormSubmit(payload) {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload }, { onSuccess: () => setFormOpen(false) });
    } else {
      // createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-5">
      {/* Filters Header */}
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
              placeholder="Search vendors…" className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Button className="bg-navy" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Vendor
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
              <p className="text-sm font-medium text-foreground">No vendors found</p>
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

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">
                  Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? vendors.length} vendors
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

      {/* --- VENDOR DETAIL POPUP (MODAL) --- */}
      <Dialog open={!!viewingVendor} onOpenChange={(open) => !open && setViewingVendor(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto sm:rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Vendor Details</DialogTitle>
          </DialogHeader>

          {viewingVendor && (
            <div className="space-y-6 pt-2">
              {/* Cover & Profile Banner */}
              <div className="relative h-28 rounded-lg bg-secondary overflow-hidden">
                {viewingVendor.coverImage && (
                  <img src={viewingVendor.coverImage} alt="Cover" className="h-full w-full object-cover" />
                )}
                <div className="absolute -bottom-2 left-4 flex items-end gap-3 translate-y-1/2">
                  <img
                    src={viewingVendor.logo || "https://placehold.co/100"}
                    alt={viewingVendor.businessName}
                    className="h-16 w-16 rounded-xl border-2 border-background object-cover bg-background shadow-md"
                  />
                </div>
              </div>

              {/* Header Info */}
              <div className="pt-6 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{viewingVendor.businessName || "N/A"}</h3>
                  <p className="text-xs text-muted-foreground">{viewingVendor.description || "No description provided."}</p>
                </div>
                <Badge variant={STATUS_BADGE[viewingVendor.status || viewingVendor.verificationStatus]?.variant || "secondary"}>
                  {STATUS_BADGE[viewingVendor.status || viewingVendor.verificationStatus]?.label || "Pending"}
                </Badge>
              </div>

              {/* Grid 1: Business Overview */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/30 p-4 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-0.5">Category / Type</span>
                  <p className="font-medium capitalize">{viewingVendor.category || viewingVendor.businessType || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Phone Number</span>
                  <p className="font-medium">{viewingVendor.businessPhone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Business Email</span>
                  <p className="font-medium">{viewingVendor.businessEmail || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">CNIC Number</span>
                  <p className="font-medium">{viewingVendor.cnicNumber || "N/A"}</p>
                </div>
              </div>

              {/* Owner Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" /> Owner Information
                </h4>
                <div className="grid grid-cols-3 gap-3 rounded-lg border border-border p-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Owner Name</span>
                    <p className="font-medium text-foreground">{viewingVendor.ownerName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Owner Phone</span>
                    <p className="font-medium text-foreground">{viewingVendor.ownerPhone || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Owner Email</span>
                    <p className="font-medium text-foreground">{viewingVendor.ownerEmail || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Payout Information */}
              {viewingVendor.payout && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <Landmark className="h-3.5 w-3.5" /> Bank & Payout Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Payment Method</span>
                      <p className="font-medium uppercase">{viewingVendor.payout.paymentMethod || "Bank"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Account Holder</span>
                      <p className="font-medium">{viewingVendor.payout.accountHolderName || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Bank Name</span>
                      <p className="font-medium">{viewingVendor.payout.bankName || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Account Number / IBAN</span>
                      <p className="font-medium">{viewingVendor.payout.iban || viewingVendor.payout.accountNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CNIC Images Preview */}
              {(viewingVendor.cnicFrontPicture || viewingVendor.cnicBackPicture) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> Identity Documents
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {viewingVendor.cnicFrontPicture && (
                      <div>
                        <span className="text-[10px] text-muted-foreground block mb-1">CNIC Front</span>
                        <img src={viewingVendor.cnicFrontPicture} alt="CNIC Front" className="h-28 w-full rounded-md object-cover border" />
                      </div>
                    )}
                    {viewingVendor.cnicBackPicture && (
                      <div>
                        <span className="text-[10px] text-muted-foreground block mb-1">CNIC Back</span>
                        <img src={viewingVendor.cnicBackPicture} alt="CNIC Back" className="h-28 w-full rounded-md object-cover border" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <VendorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vendor={editing}
        onSubmit={handleFormSubmit}
        // isSubmitting={createMutation.isPending || updateMutation.isPending}
        isSubmitting={updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.businessName || deleteTarget?.name || 'Vendor'}?`}
        description="This also removes every product listed under this vendor. This can't be undone."
        onConfirm={() => deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}