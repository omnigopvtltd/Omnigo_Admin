import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function BikeInstallmentDeductionDialog({
  open,
  onOpenChange,
  rider,
  onConfirm,
  isSubmitting,
}) {
  if (!rider) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Deduct Bike Installment
          </DialogTitle>
          <DialogDescription>
            You are about to manually process a daily bike installment
            deduction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Rider Name:</span>
            <span className="font-semibold text-foreground">{rider.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Phone Number:</span>
            <span className="font-semibold text-foreground">{rider.phone}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Current Wallet Balance:</span>
            <span className="font-semibold text-foreground">
              Rs. {rider.wallet?.balance ?? 0}
            </span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-muted-foreground">Deduction Amount:</span>
            <span className="font-bold text-destructive">Rs. 500</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-navy"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deducting..." : "Confirm Deduction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}