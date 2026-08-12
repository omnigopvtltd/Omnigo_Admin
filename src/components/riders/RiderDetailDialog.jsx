import { useState } from "react";
import { Bike, Car, Star, Wallet, Plus, Minus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VerificationReviewCard } from "@/components/riders/VerificationReviewCard";
import {
  useRiderWallet, useAdjustRiderWallet, useReviewCnic, useReviewFace,
} from "@/hooks/useRiders";

const CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function WalletTab({ riderId }) {
  const { data, isLoading } = useRiderWallet(riderId);
  const adjustMutation = useAdjustRiderWallet();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  function adjust(type) {
    if (!amount || Number(amount) <= 0) return;
    adjustMutation.mutate(
      { id: riderId, type, amount: Number(amount), reason },
      { onSuccess: () => { setAmount(""); setReason(""); } }
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg bg-navy-darker p-4 text-white">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-white/60">Current Balance</p>
          <p className="font-display text-xl font-semibold">
            {isLoading ? "…" : CURRENCY.format(data?.balance ?? 0)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Manual Adjustment</p>
        <div className="flex flex-wrap gap-2">
          <Input
            type="number" placeholder="Amount" value={amount}
            onChange={(e) => setAmount(e.target.value)} className="w-28"
          />
          <Input
            placeholder="Reason (optional)" value={reason}
            onChange={(e) => setReason(e.target.value)} className="flex-1 min-w-[140px]"
          />
          <Button size="sm" onClick={() => adjust("credit")} disabled={adjustMutation.isPending}>
            <Plus className="h-3.5 w-3.5" /> Credit
          </Button>
          <Button size="sm" variant="outline" onClick={() => adjust("debit")} disabled={adjustMutation.isPending}>
            <Minus className="h-3.5 w-3.5" /> Debit
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Transactions</p>
        <div className="max-h-64 space-y-1 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
          ) : data?.transactions?.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">No transactions yet.</p>
          ) : (
            data?.transactions?.map((t) => (
              <div key={t._id} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
                <div>
                  <p className="text-foreground">{t.reason}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</p>
                </div>
                <span className={t.type === "credit" ? "font-medium text-success" : "font-medium text-destructive"}>
                  {t.type === "credit" ? "+" : "-"}{CURRENCY.format(t.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function VerificationTab({ rider }) {
  const reviewCnic = useReviewCnic();
  const reviewFace = useReviewFace();
  const cnic = rider.riderProfile?.cnicVerification ?? { status: "not_submitted" };
  const face = rider.riderProfile?.faceVerification ?? { status: "not_submitted" };

  return (
    <div className="space-y-4">
      <VerificationReviewCard
        title="CNIC Verification"
        status={cnic.status}
        images={[cnic.frontImage, cnic.backImage]}
        detail={cnic.cnicNumber ? `CNIC: ${cnic.cnicNumber}` : null}
        rejectionReason={cnic.rejectionReason}
        isLoading={reviewCnic.isPending}
        onApprove={() => reviewCnic.mutate({ id: rider._id, status: "verified" })}
        onReject={(reason) => reviewCnic.mutate({ id: rider._id, status: "rejected", rejectionReason: reason })}
      />
      <VerificationReviewCard
        title="Face Verification"
        status={face.status}
        images={[face.image]}
        rejectionReason={face.rejectionReason}
        isLoading={reviewFace.isPending}
        onApprove={() => reviewFace.mutate({ id: rider._id, status: "verified" })}
        onReject={(reason) => reviewFace.mutate({ id: rider._id, status: "rejected", rejectionReason: reason })}
      />
      {cnic.status === "verified" && face.status === "verified" && (
        <div className="rounded-lg bg-success/10 px-3 py-2.5 text-xs font-medium text-success">
          Fully verified — this rider can accept orders and join bonus sessions.
        </div>
      )}
    </div>
  );
}

export function RiderDetailDialog({ open, onOpenChange, rider }) {
  if (!rider) return null;
  const VehicleIcon = rider.riderProfile?.vehicleType === "car" ? Car : Bike;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-sm">{initials(rider.name)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{rider.name}</DialogTitle>
              <DialogDescription>{rider.phone} · {rider.email}</DialogDescription>
            </div>
            {rider.isBlocked && <Badge variant="destructive" className="ml-auto">Blocked</Badge>}
          </div>
        </DialogHeader>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-secondary px-3 py-2.5 text-xs">
          <span className="flex items-center gap-1"><VehicleIcon className="h-3.5 w-3.5" /> {rider.riderProfile?.vehicleModel || rider.riderProfile?.vehicleType}</span>
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-gold text-gold" /> {rider.riderProfile?.rating?.average?.toFixed(1) ?? "—"}</span>
          <span>{rider.deliveredCount ?? 0} deliveries</span>
          <Badge variant={rider.riderProfile?.isOnline ? "success" : "secondary"} className="ml-auto">
            {rider.riderProfile?.isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        <Tabs defaultValue="verification">
          <TabsList>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>
          <TabsContent value="verification"><VerificationTab rider={rider} /></TabsContent>
          <TabsContent value="wallet"><WalletTab riderId={rider._id} /></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}