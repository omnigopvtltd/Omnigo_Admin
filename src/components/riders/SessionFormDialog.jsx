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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    requiredOrders: z.coerce.number().min(1, "At least 1 order"),
    bonusAmount: z.coerce.number().min(0),
    minWalletBalance: z.coerce.number().min(0),
    timeLimitHours: z.union([z.coerce.number().min(1), z.literal("")]).optional(),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
    isActive: z.boolean().optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// function toDateInput(value) {
//   if (!value) return "";
//   return new Date(value).toISOString().slice(0, 10);
// }

function toDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function toFormValues(session) {
  if (!session) {
    const today = new Date().toISOString().slice(0, 10);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 14);
    return {
      title: "", description: "", requiredOrders: 6, bonusAmount: 20,
      minWalletBalance: 15, timeLimitHours: 8,
      startDate: today, endDate: nextWeek.toISOString().slice(0, 10), isActive: true,
    };
  }
  return {
    title: session.title ?? "",
    description: session.description ?? "",
    requiredOrders: session.requiredOrders ?? 6,
    bonusAmount: session.bonusAmount ?? 0,
    minWalletBalance: session.minWalletBalance ?? 0,
    timeLimitHours: session.timeLimitHours ?? "",
    startDate: toDateInput(session.startDate),
    endDate: toDateInput(session.endDate),
    isActive: session.isActive ?? true,
  };
}

export function SessionFormDialog({ open, onOpenChange, session, onSubmit, isSubmitting }) {
  const {
    register, handleSubmit, reset, watch, setValue, formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(session) });

  useEffect(() => {
    reset(toFormValues(session));
  }, [session, open, reset]);

  const isActive = watch("isActive");

  function submit(values) {
    onSubmit({
      title: values.title,
      description: values.description,
      requiredOrders: Number(values.requiredOrders),
      bonusAmount: Number(values.bonusAmount),
      minWalletBalance: Number(values.minWalletBalance),
      timeLimitHours: values.timeLimitHours === "" ? null : Number(values.timeLimitHours),
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      isActive: values.isActive,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{session ? "Edit Session" : "Add Bonus Session"}</DialogTitle>
          <DialogDescription>Riders complete the required orders to earn the bonus.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="max-h-[65vh] space-y-4 overflow-y-auto pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input {...register("title")} placeholder="Weekend Rush Bonus" />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea {...register("description")} placeholder="Shown to riders when browsing sessions" />
            </div>

            <div>
              <Label>Required Orders</Label>
              <Input type="number" {...register("requiredOrders")} />
              {errors.requiredOrders && <p className="mt-1 text-xs text-destructive">{errors.requiredOrders.message}</p>}
            </div>
            <div>
              <Label>Bonus Amount ($)</Label>
              <Input type="number" step="0.01" {...register("bonusAmount")} />
            </div>
            <div>
              <Label>Min Wallet Balance ($)</Label>
              <Input type="number" step="0.01" {...register("minWalletBalance")} />
            </div>
            <div>
              <Label>Time Limit (hours, optional)</Label>
              <Input type="number" {...register("timeLimitHours")} placeholder="No limit" />
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

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 sm:col-span-2">
              <Label className="mb-0">Active</Label>
              <Switch checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : session ? "Save Changes" : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}