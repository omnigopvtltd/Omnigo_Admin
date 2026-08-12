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
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    bannerImage: z.union([z.string().url("Enter a valid URL"), z.literal("")]).optional(),
    type: z.enum(["banner", "push_notification", "email"]),
    targetAudience: z.enum(["all", "new_users", "inactive_users"]),
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

function toFormValues(campaign) {
  if (!campaign) {
    const today = new Date().toISOString().slice(0, 10);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 14);
    return {
      title: "", description: "", bannerImage: "", type: "banner", targetAudience: "all",
      startDate: today, endDate: nextWeek.toISOString().slice(0, 10), isActive: true,
    };
  }
  return {
    title: campaign.title ?? "",
    description: campaign.description ?? "",
    bannerImage: campaign.bannerImage ?? "",
    type: campaign.type ?? "banner",
    targetAudience: campaign.targetAudience ?? "all",
    startDate: toDateInput(campaign.startDate),
    endDate: toDateInput(campaign.endDate),
    isActive: campaign.isActive ?? true,
  };
}

export function CampaignFormDialog({ open, onOpenChange, campaign, onSubmit, isSubmitting }) {
  const {
    register, handleSubmit, reset, watch, setValue, formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(campaign) });

  useEffect(() => {
    reset(toFormValues(campaign));
  }, [campaign, open, reset]);

  const isActive = watch("isActive");

  function submit(values) {
    onSubmit({
      title: values.title,
      description: values.description,
      bannerImage: values.bannerImage,
      type: values.type,
      targetAudience: values.targetAudience,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      isActive: values.isActive,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{campaign ? "Edit Campaign" : "Add Campaign"}</DialogTitle>
          <DialogDescription>Scheduled promotional pushes shown to customers.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="max-h-[65vh] space-y-4 overflow-y-auto pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input {...register("title")} placeholder="Weekend Free Delivery" />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea {...register("description")} placeholder="Short internal note about this campaign" />
            </div>

            <div className="sm:col-span-2">
              <Label>Banner Image URL</Label>
              <Input {...register("bannerImage")} placeholder="https://…" />
              {errors.bannerImage && <p className="mt-1 text-xs text-destructive">{errors.bannerImage.message}</p>}
            </div>

            <div>
              <Label>Type</Label>
              <Select {...register("type")}>
                <option value="banner">In-App Banner</option>
                <option value="push_notification">Push Notification</option>
                <option value="email">Email</option>
              </Select>
            </div>
            <div>
              <Label>Audience</Label>
              <select {...register("targetAudience")}>
                <option value="all">All Users</option>
                <option value="new_users">New Users</option>
                <option value="inactive_users">Inactive Users</option>
              </select>
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
              {isSubmitting ? "Saving…" : campaign ? "Save Changes" : "Create Campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}