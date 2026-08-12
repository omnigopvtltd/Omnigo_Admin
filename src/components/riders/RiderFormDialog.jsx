import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const createSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  password: z.string().min(6, "At least 6 characters"),
  vehicleType: z.enum(["bike", "car", "van"]),
  vehiclePlate: z.string().optional(),
  vehicleModel: z.string().optional(),
});

const editSchema = createSchema.omit({ password: true }).extend({
  password: z.string().optional(),
});

function toFormValues(rider) {
  if (!rider) {
    return { name: "", email: "", phone: "", password: "", vehicleType: "bike", vehiclePlate: "", vehicleModel: "" };
  }
  return {
    name: rider.name ?? "",
    email: rider.email ?? "",
    phone: rider.phone ?? "",
    password: "",
    vehicleType: rider.riderProfile?.vehicleType ?? "bike",
    vehiclePlate: rider.riderProfile?.vehiclePlate ?? "",
    vehicleModel: rider.riderProfile?.vehicleModel ?? "",
  };
}

export function RiderFormDialog({ open, onOpenChange, rider, onSubmit, isSubmitting }) {
  const {
    register, handleSubmit, reset, formState: { errors },
  } = useForm({
    resolver: zodResolver(rider ? editSchema : createSchema),
    defaultValues: toFormValues(rider),
  });

  useEffect(() => {
    reset(toFormValues(rider));
  }, [rider, open, reset]);

  function submit(values) {
    onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{rider ? "Edit Rider" : "Add Rider"}</DialogTitle>
          <DialogDescription>
            {rider ? "Update profile and vehicle details." : "Create an account for a rider onboarded in person."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Full Name</Label>
              <Input {...register("name")} placeholder="Ali Hassan" />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input {...register("email")} placeholder="ali@rider.example" disabled={!!rider} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register("phone")} placeholder="+92 300 1234567" />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            {!rider && (
              <div className="sm:col-span-2">
                <Label>Temporary Password</Label>
                <Input type="password" {...register("password")} placeholder="Rider changes this on first login" />
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>
            )}

            <div>
              <Label>Vehicle Type</Label>
              <select {...register("vehicleType")}>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
              </select>
            </div>
            <div>
              <Label>Plate Number</Label>
              <Input {...register("vehiclePlate")} placeholder="LEA-1234" />
            </div>
            <div className="sm:col-span-2">
              <Label>Vehicle Model</Label>
              <Input {...register("vehicleModel")} placeholder="Honda CD70" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : rider ? "Save Changes" : "Create Rider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}