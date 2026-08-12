import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Tag, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CouponFormDialog } from "@/components/promotions/CouponFormDialog";
import { CampaignFormDialog } from "@/components/promotions/CampaignFormDialog";
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/hooks/useCoupons";
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from "@/hooks/useCampaigns";

const CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const COUPON_TYPE_LABEL = {
  percentage: "% Off",
  fixed: "$ Off",
  free_delivery: "Free Delivery",
  cashback: "Cashback",
};

function formatCouponValue(c) {
  if (c.type === "free_delivery") return "Free Delivery";
  if (c.type === "percentage" || c.type === "cashback") return `${c.value}% off`;
  return `${CURRENCY.format(c.value)} off`;
}

function CouponsTab() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useCoupons({ search, limit: 20 });
  const coupons = data?.coupons ?? [];

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  function handleSubmit(payload) {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload }, { onSuccess: () => setFormOpen(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search coupon codes…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : coupons.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">No coupons found.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <Card key={c._id} className="relative overflow-hidden">
              <div className="absolute right-3 top-3 flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(c); setFormOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteTarget(c)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
              <CardContent className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy">
                  <Tag className="h-4.5 w-4.5" />
                </div>
                <p className="font-display text-base font-semibold tracking-wide text-foreground">{c.code}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{formatCouponValue(c)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge variant={c.isActive ? "success" : "secondary"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                  <Badge variant="secondary">{COUPON_TYPE_LABEL[c.type]}</Badge>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {c.usedCount} used{c.usageLimit ? ` / ${c.usageLimit}` : ""} · min {CURRENCY.format(c.minOrderAmount)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CouponFormDialog
        open={formOpen} onOpenChange={setFormOpen} coupon={editing}
        onSubmit={handleSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <ConfirmDialog
        open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.code}?`}
        description="This coupon will stop working immediately. This can't be undone."
        onConfirm={() => deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function CampaignsTab() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useCampaigns({ search, limit: 20 });
  const campaigns = data?.campaigns ?? [];

  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  function handleSubmit(payload) {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload }, { onSuccess: () => setFormOpen(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search campaigns…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : campaigns.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">No campaigns found.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {campaigns.map((c) => (
            <Card key={c._id} className="overflow-hidden">
              <div className="flex h-32 items-center justify-center bg-secondary">
                {c.bannerImage ? (
                  <img src={c.bannerImage} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <Megaphone className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(c); setFormOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteTarget(c)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge variant={c.isActive ? "success" : "secondary"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                  <Badge variant="secondary">{c.type.replace("_", " ")}</Badge>
                  <Badge variant="navy">{c.targetAudience.replace("_", " ")}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CampaignFormDialog
        open={formOpen} onOpenChange={setFormOpen} campaign={editing}
        onSubmit={handleSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <ConfirmDialog
        open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.title}?`}
        description="This campaign will be removed immediately. This can't be undone."
        onConfirm={() => deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function PromotionsPage() {
  return (
    <Tabs defaultValue="coupons">
      <TabsList>
        <TabsTrigger value="coupons">Coupons</TabsTrigger>
        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
      </TabsList>
      <TabsContent value="coupons"><CouponsTab /></TabsContent>
      <TabsContent value="campaigns"><CampaignsTab /></TabsContent>
    </Tabs>
  );
}