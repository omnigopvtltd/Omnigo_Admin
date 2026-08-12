import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
    description: z.string().optional(),
    type: z.enum(["percentage", "fixed", "free_delivery", "cashback"]),
    value: z.coerce.number().min(0),
    maxDiscount: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
    minOrderAmount: z.coerce.number().min(0),
    usageLimit: z.union([z.coerce.number().min(1), z.literal("")]).optional(),
    perUserLimit: z.coerce.number().min(1),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
    isActive: z.boolean().optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function toFormValues(coupon) {
  if (!coupon) {
    const today = new Date().toISOString().slice(0, 10);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return {
      code: "", description: "", type: "percentage", value: 10, maxDiscount: "",
      minOrderAmount: 0, usageLimit: "", perUserLimit: 1,
      startDate: today, endDate: nextMonth.toISOString().slice(0, 10), isActive: true,
    };
  }
  return {
    code: coupon.code ?? "",
    description: coupon.description ?? "",
    type: coupon.type ?? "percentage",
    value: coupon.value ?? 0,
    maxDiscount: coupon.maxDiscount ?? "",
    minOrderAmount: coupon.minOrderAmount ?? 0,
    usageLimit: coupon.usageLimit ?? "",
    perUserLimit: coupon.perUserLimit ?? 1,
    startDate: toDateInput(coupon.startDate),
    endDate: toDateInput(coupon.endDate),
    isActive: coupon.isActive ?? true,
  };
}

export function CouponFormDialog({ open, onOpenChange, coupon, onSubmit, isSubmitting }) {
  const {
    register, handleSubmit, reset, watch, setValue, formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(coupon) });

  useEffect(() => {
    reset(toFormValues(coupon));
  }, [coupon, open, reset]);

  const type = watch("type");
  const isActive = watch("isActive");

  function submit(values) {
    onSubmit({
      code: values.code.toUpperCase(),
      description: values.description,
      type: values.type,
      value: values.type === "free_delivery" ? 0 : Number(values.value),
      maxDiscount: values.maxDiscount === "" ? null : Number(values.maxDiscount),
      minOrderAmount: Number(values.minOrderAmount),
      usageLimit: values.usageLimit === "" ? null : Number(values.usageLimit),
      perUserLimit: Number(values.perUserLimit),
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      isActive: values.isActive,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
          <DialogDescription>Discount codes customers apply at checkout.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="max-h-[65vh] space-y-4 overflow-y-auto pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Coupon Code</Label>
              <Input {...register("code")} placeholder="WELCOME50" className="uppercase" />
              {errors.code && <p className="mt-1 text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div>
              <Label>Type</Label>
              <select {...register("type")}>
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
                <option value="free_delivery">Free Delivery</option>
                <option value="cashback">Cashback</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea {...register("description")} placeholder="Shown to customers in the promo list" />
            </div>

            {type !== "free_delivery" && (
              <div>
                <Label>{type === "percentage" || type === "cashback" ? "Value (%)" : "Value ($)"}</Label>
                <Input type="number" step="0.01" {...register("value")} />
                {errors.value && <p className="mt-1 text-xs text-destructive">{errors.value.message}</p>}
              </div>
            )}
            {(type === "percentage" || type === "cashback") && (
              <div>
                <Label>Max Discount ($, optional)</Label>
                <Input type="number" step="0.01" {...register("maxDiscount")} />
              </div>
            )}

            <div>
              <Label>Minimum Order ($)</Label>
              <Input type="number" step="0.01" {...register("minOrderAmount")} />
            </div>
            <div>
              <Label>Per-User Limit</Label>
              <Input type="number" {...register("perUserLimit")} />
            </div>
            <div>
              <Label>Total Usage Limit (optional)</Label>
              <Input type="number" {...register("usageLimit")} placeholder="Unlimited" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <Label className="mb-0">Active</Label>
              <Switch checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
            </div>

            <div>
              <Label>Start Date</Label>
              <Input type="date" {...register("startDate")} />
              {errors.startDate && <p className="mt-1 text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" {...register("endDate")} />
              {errors.endDate && <p className="mt-1 text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : coupon ? "Save Changes" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}