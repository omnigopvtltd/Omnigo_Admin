// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// const optionalNumber = (defaultValue = 0) =>
//   z.preprocess(
//     (val) => (val === "" || val === null || isNaN(Number(val)) ? defaultValue : Number(val)),
//     z.number().min(0)
//   );
  
// const schema = z.object({
//   name: z.string().min(2, "Name is required"),
//   description: z.string().optional(),
//   logo: z
//     .union([z.string().url("Enter a valid URL"), z.literal("")])
//     .optional(),
//   coverImage: z
//     .union([z.string().url("Enter a valid URL"), z.literal("")])
//     .optional(),
//   cuisines: z.string().optional(),
//   phone: z.string().min(7, "Phone is required"),
//   email: z
//     .union([z.string().email("Enter a valid email"), z.literal("")])
//     .optional(),
//   street: z.string().min(2, "Street is required"),
//   area: z.string().optional(),
//   city: z.string().min(2, "City is required"),
//   zipCode: z.string().optional(),
//   openTime: z.string().min(1, "Required"),
//   closeTime: z.string().min(1, "Required"),
//   deliveryTimeMin: optionalNumber(20),
//   deliveryTimeMax: optionalNumber(40),
//   minimumOrder: optionalNumber(0),
//   deliveryFee: optionalNumber(0),
//   commissionRate: z.preprocess(
//     (val) => (val === "" || val === null || isNaN(Number(val)) ? 0 : Number(val)),
//     z.number().min(0).max(100)
//   ),
//   status: z.enum(["pending", "approved", "blocked"]),
//   belongsTo: z.enum(["restaurant", "homeChef"]).default("restaurant"),
//   categories: z.string().optional(),
// });

// function toFormValues(restaurant) {
//   if (!restaurant) {
//     return {
//       name: "",
//       description: "",
//       logo: "",
//       coverImage: "",
//       cuisines: "",
//       phone: "",
//       email: "",
//       street: "",
//       area: "",
//       city: "",
//       zipCode: "",
//       openTime: "09:00",
//       closeTime: "23:00",
//       deliveryTimeMin: 20,
//       deliveryTimeMax: 40,
//       minimumOrder: 0,
//       deliveryFee: 2,
//       commissionRate: 15,
//       status: "pending",
//       belongsTo: "restaurant",
//       categories: "",
//     };
//   }
//   return {
//     name: restaurant.name ?? "",
//     description: restaurant.description ?? "",
//     logo: restaurant.logo ?? "",
//     coverImage: restaurant.coverImage ?? "",
//     cuisines: (restaurant.cuisines ?? []).join(", "),
//     phone: restaurant.contact?.phone ?? "",
//     email: restaurant.contact?.email ?? "",
//     street: restaurant.address?.street ?? "",
//     area: restaurant.address?.area ?? "",
//     city: restaurant.address?.city ?? "",
//     zipCode: restaurant.address?.zipCode ?? "",
//     openTime: restaurant.openingHours?.open ?? "09:00",
//     closeTime: restaurant.openingHours?.close ?? "23:00",
//     deliveryTimeMin: restaurant.deliveryTime?.min ?? 20,
//     deliveryTimeMax: restaurant.deliveryTime?.max ?? 40,
//     minimumOrder: restaurant.minimumOrder ?? 0,
//     deliveryFee: restaurant.deliveryFee ?? 0,
//     commissionRate: restaurant.commissionRate ?? 15,
//     status: restaurant.status ?? "pending",
//     belongsTo: restaurant.belongsTo ?? "restaurant",
//     categories: (restaurant.categories ?? []).join(", "),
//   };
// }

// export function RestaurantFormDialog({
//   open,
//   onOpenChange,
//   restaurant,
//   onSubmit,
//   isSubmitting,
// }) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: toFormValues(restaurant),
//   });

//   useEffect(() => {
//     reset(toFormValues(restaurant));
//   }, [restaurant, open, reset]);

//   function submit(values) {
//     onSubmit({
//       name: values.name,
//       description: values.description,
//       logo: values.logo,
//       coverImage: values.coverImage,
//       cuisines: values.cuisines
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean),
//       contact: { phone: values.phone, email: values.email },
//       address: {
//         street: values.street,
//         area: values.area,
//         city: values.city,
//         zipCode: values.zipCode,
//         country: "Pakistan",
//       },
//       openingHours: {
//         open: values.openTime,
//         close: values.closeTime,
//         is24Hours: false,
//       },
//       deliveryTime: {
//         min: values.deliveryTimeMin,
//         max: values.deliveryTimeMax,
//       },
//       minimumOrder: values.minimumOrder,
//       deliveryFee: values.deliveryFee,
//       commissionRate: values.commissionRate,
//       status: values.status,
//       isOpen: restaurant?.isOpen ?? true,
//     });
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
//         <DialogHeader>
//           <DialogTitle>
//             {restaurant ? "Edit Restaurant" : "Add Restaurant"}
//           </DialogTitle>
//           <DialogDescription>
//             Core profile info shown to customers and used for commission &
//             payouts.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(submit)}>
//           <div className="max-h-[65vh] overflow-y-auto pr-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="sm:col-span-2">
//                 <Label>Restaurant Name</Label>
//                 <Input
//                   {...register("name")}
//                   className="w-full"
//                   placeholder="Spice Route"
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <div className="sm:col-span-2">
//                 <Label>Description</Label>
//                 <Textarea
//                   {...register("description")}
//                   className="w-full"
//                   placeholder="Short description shown on the restaurant page"
//                 />
//               </div>

//               <div>
//                 <Label>Logo URL</Label>
//                 <Input
//                   {...register("logo")}
//                   className="w-full"
//                   placeholder="https://…"
//                 />
//                 {errors.logo && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {errors.logo.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Cover Image URL</Label>
//                 <Input
//                   {...register("coverImage")}
//                   className="w-full"
//                   placeholder="https://…"
//                 />
//                 {errors.coverImage && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {errors.coverImage.message}
//                   </p>
//                 )}
//               </div>

//               <div className="sm:col-span-2">
//                 <Label>Cuisines (comma separated)</Label>
//                 <Input
//                   {...register("cuisines")}
//                   className="w-full"
//                   placeholder="Fast Food, Pizza, BBQ"
//                 />
//               </div>

//               <div>
//                 <Label>Phone</Label>
//                 <Input
//                   {...register("phone")}
//                   className="w-full"
//                   placeholder="+92 300 1234567"
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {errors.phone.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Email</Label>
//                 <Input
//                   {...register("email")}
//                   className="w-full"
//                   placeholder="owner@restaurant.com"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               <div className="sm:col-span-2">
//                 <Label>Street Address</Label>
//                 <Input
//                   {...register("street")}
//                   className="w-full"
//                   placeholder="123 Main Boulevard"
//                 />
//                 {errors.street && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {errors.street.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Area</Label>
//                 <Input
//                   {...register("area")}
//                   className="w-full"
//                   placeholder="Block A"
//                 />
//               </div>
//               <div>
//                 <Label>City</Label>
//                 <Input
//                   {...register("city")}
//                   className="w-full"
//                   placeholder="Karachi"
//                 />
//                 {errors.city && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {errors.city.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Zip Code</Label>
//                 <Input
//                   {...register("zipCode")}
//                   className="w-full"
//                   placeholder="75500"
//                 />
//               </div>
//               <div>
//                 <Label>Status</Label>
//                 <Select className="w-full" {...register("status")}>
//                   <option value="pending">Pending</option>
//                   <option value="approved">Approved</option>
//                   <option value="blocked">Blocked</option>
//                 </Select>
//                 {/* <Select
//                 //   value={watch("status")}
//                   onValueChange={(value) => setValue("status", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>

//                   <SelectContent>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="blocked">Blocked</SelectItem>
//                   </SelectContent>
//                 </Select> */}
//               </div>

//               <div>
//                 <Label>Opens At</Label>
//                 <Input
//                   className="w-full"
//                   type="time"
//                   {...register("openTime")}
//                 />
//               </div>
//               <div>
//                 <Label>Closes At</Label>
//                 <Input
//                   className="w-full"
//                   type="time"
//                   {...register("closeTime")}
//                 />
//               </div>
//               <div>
//                 <Label>Min Delivery Time (min)</Label>
//                 <Input
//                   className="w-full"
//                   type="number"
//                   {...register("deliveryTimeMin")}
//                 />
//               </div>
//               <div>
//                 <Label>Max Delivery Time (min)</Label>
//                 <Input
//                   className="w-full"
//                   type="number"
//                   {...register("deliveryTimeMax")}
//                 />
//               </div>
//               <div>
//                 <Label>Minimum Order ($)</Label>
//                 <Input
//                   className="w-full"
//                   type="number"
//                   step="0.5"
//                   {...register("minimumOrder")}
//                 />
//               </div>
//               <div>
//                 <Label>Delivery Fee ($)</Label>
//                 <Input
//                   className="w-full"
//                   type="number"
//                   step="0.5"
//                   {...register("deliveryFee")}
//                 />
//               </div>
//               <div>
//                 <Label>Commission Rate (%)</Label>
//                 <Input
//                   className="w-full"
//                   type="number"
//                   step="0.5"
//                   {...register("commissionRate")}
//                 />
//                 {errors.commissionRate && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {errors.commissionRate.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting
//                 ? "Saving…"
//                 : restaurant
//                   ? "Save Changes"
//                   : "Create Restaurant"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }


import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Helper for optional numeric inputs
const optionalNumber = (defaultValue = 0) =>
  z.preprocess(
    (val) => (val === "" || val === null || isNaN(Number(val)) ? defaultValue : Number(val)),
    z.number().min(0)
  );

// Zod Validation Schema
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  logo: z.union([z.string().url("Enter a valid URL"), z.literal("")]).optional(),
  coverImage: z.union([z.string().url("Enter a valid URL"), z.literal("")]).optional(),
  cuisines: z.string().optional(),
  phone: z.string().min(7, "Phone is required"),
  email: z.union([z.string().email("Enter a valid email"), z.literal("")]).optional(),
  street: z.string().min(2, "Street is required"),
  area: z.string().optional(),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().optional(),
  country: z.string().default("Pakistan"),
  openTime: z.string().min(1, "Required"),
  closeTime: z.string().min(1, "Required"),
  deliveryTimeMin: optionalNumber(20),
  deliveryTimeMax: optionalNumber(40),
  minimumOrder: optionalNumber(0),
  deliveryFee: optionalNumber(0),
  commissionRate: z.preprocess(
    (val) => (val === "" || val === null || isNaN(Number(val)) ? 0 : Number(val)),
    z.number().min(0).max(100)
  ),
  status: z.enum(["pending", "approved", "blocked"]),
  belongsTo: z.enum(["restaurant", "homeChef"]).default("restaurant"),
  // Formatted string input: "Pizza: BBQ, Pepperoni | Burgers: Zinger, Beef"
  categoriesRaw: z.string().optional(),
});

// Converts raw DB object into form-friendly default values
function toFormValues(vendor) {
  // Helper to serialize nested categories schema into a editable string format
  const formattedCategories = vendor?.categories
    ? vendor.categories
        .map((c) =>
          c.subCategories?.length
            ? `${c.categoryName}: ${c.subCategories.join(", ")}`
            : c.categoryName
        )
        .join(" | ")
    : "";

  if (!vendor) {
    return {
      name: "",
      description: "",
      logo: "",
      coverImage: "",
      cuisines: "",
      phone: "",
      email: "",
      street: "",
      area: "",
      city: "",
      zipCode: "",
      country: "Pakistan",
      openTime: "09:00",
      closeTime: "23:00",
      deliveryTimeMin: 20,
      deliveryTimeMax: 40,
      minimumOrder: 0,
      deliveryFee: 0,
      commissionRate: 15,
      status: "pending",
      belongsTo: "restaurant",
      categoriesRaw: "",
    };
  }

  return {
    name: vendor.name ?? "",
    description: vendor.description ?? "",
    logo: vendor.logo ?? "",
    coverImage: vendor.coverImage ?? "",
    cuisines: (vendor.cuisines ?? []).join(", "),
    phone: vendor.contact?.phone ?? "",
    email: vendor.contact?.email ?? "",
    street: vendor.address?.street ?? "",
    area: vendor.address?.area ?? "",
    city: vendor.address?.city ?? "",
    zipCode: vendor.address?.zipCode ?? "",
    country: vendor.address?.country ?? "Pakistan",
    openTime: vendor.openingHours?.open ?? "09:00",
    closeTime: vendor.openingHours?.close ?? "23:00",
    deliveryTimeMin: vendor.deliveryTime?.min ?? 20,
    deliveryTimeMax: vendor.deliveryTime?.max ?? 40,
    minimumOrder: vendor.minimumOrder ?? 0,
    deliveryFee: vendor.deliveryFee ?? 0,
    commissionRate: vendor.commissionRate ?? 15,
    status: vendor.status ?? "pending",
    belongsTo: vendor.belongsTo ?? (vendor.isHomeChef ? "homeChef" : "restaurant"),
    categoriesRaw: formattedCategories,
  };
}

export function RestaurantFormDialog({
  open,
  onOpenChange,
  restaurant, // Can be a Restaurant or Home Chef object
  onSubmit,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(restaurant),
  });

  const belongsToValue = watch("belongsTo");

  useEffect(() => {
    reset(toFormValues(restaurant));
  }, [restaurant, open, reset]);

  function submit(values) {
    // Parses string formatted as "Category: Sub1, Sub2 | Category2: Sub3"
    // Into Schema: [{ categoryName: "Category", subCategories: ["Sub1", "Sub2"] }]
    const parsedCategories = values.categoriesRaw
      ? values.categoriesRaw
          .split("|")
          .map((catChunk) => {
            const [catName, subCatsStr] = catChunk.split(":");
            if (!catName || !catName.trim()) return null;

            const subCategories = subCatsStr
              ? subCatsStr
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];

            return {
              categoryName: catName.trim(),
              subCategories,
            };
          })
          .filter(Boolean)
      : [];

    onSubmit({
      name: values.name,
      description: values.description,
      logo: values.logo,
      coverImage: values.coverImage,
      cuisines: values.cuisines
        ? values.cuisines
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      categories: parsedCategories,
      contact: {
        phone: values.phone,
        email: values.email,
      },
      address: {
        street: values.street,
        area: values.area,
        city: values.city,
        zipCode: values.zipCode,
        country: values.country,
      },
      openingHours: {
        open: values.openTime,
        close: values.closeTime,
        is24Hours: restaurant?.openingHours?.is24Hours ?? false,
      },
      deliveryTime: {
        min: values.deliveryTimeMin,
        max: values.deliveryTimeMax,
      },
      minimumOrder: values.minimumOrder,
      deliveryFee: values.deliveryFee,
      commissionRate: values.commissionRate,
      status: values.status,
      belongsTo: values.belongsTo,
      isOpen: restaurant?.isOpen ?? true,
    });
  }

  const vendorLabel = belongsToValue === "homeChef" ? "Home Chef" : "Restaurant";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {restaurant ? `Edit ${vendorLabel}` : `Add ${vendorLabel}`}
          </DialogTitle>
          <DialogDescription>
            Manage profile details, address, opening hours, commission rates, and menu categories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)}>
          <div className="max-h-[65vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Type Selection */}
              <div>
                <Label>Seller Type</Label>
                <Controller
                  name="belongsTo"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="homeChef">Home Chef</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Status Select */}
              <div>
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Name */}
              <div className="sm:col-span-2">
                <Label>{vendorLabel} Name *</Label>
                <Input
                  {...register("name")}
                  className="w-full"
                  placeholder={belongsToValue === "homeChef" ? "Amma's Kitchen" : "Spice Route"}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  className="w-full"
                  placeholder={`Short description shown on the ${vendorLabel.toLowerCase()} page`}
                />
              </div>

              {/* Media URLs */}
              <div>
                <Label>Logo URL</Label>
                <Input {...register("logo")} className="w-full" placeholder="https://…" />
                {errors.logo && (
                  <p className="mt-1 text-xs text-destructive">{errors.logo.message}</p>
                )}
              </div>
              <div>
                <Label>Cover Image URL</Label>
                <Input {...register("coverImage")} className="w-full" placeholder="https://…" />
                {errors.coverImage && (
                  <p className="mt-1 text-xs text-destructive">{errors.coverImage.message}</p>
                )}
              </div>

              {/* Cuisines */}
              <div className="sm:col-span-2">
                <Label>Cuisines (comma separated)</Label>
                <Input
                  {...register("cuisines")}
                  className="w-full"
                  placeholder="Fast Food, Pizza, Desi, Home-cooked"
                />
              </div>

              {/* Categories & Subcategories Schema parser */}
              <div className="sm:col-span-2">
                <Label>Categories & Subcategories</Label>
                <Input
                  {...register("categoriesRaw")}
                  className="w-full"
                  placeholder="Pizza: BBQ, Meat, Classic | Burgers: Beef, Zinger"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Separate subcategories with commas (<code>,</code>) and main categories with a pipe (<code>|</code>).
                </p>
              </div>

              {/* Contact */}
              <div>
                <Label>Phone *</Label>
                <Input
                  {...register("phone")}
                  className="w-full"
                  placeholder="+92 300 1234567"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  {...register("email")}
                  className="w-full"
                  placeholder="owner@domain.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <Label>Street Address *</Label>
                <Input
                  {...register("street")}
                  className="w-full"
                  placeholder="123 Main Boulevard"
                />
                {errors.street && (
                  <p className="mt-1 text-xs text-destructive">{errors.street.message}</p>
                )}
              </div>
              <div>
                <Label>Area</Label>
                <Input {...register("area")} className="w-full" placeholder="Block A" />
              </div>
              <div>
                <Label>City *</Label>
                <Input {...register("city")} className="w-full" placeholder="Karachi" />
                {errors.city && (
                  <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label>Zip Code</Label>
                <Input {...register("zipCode")} className="w-full" placeholder="75500" />
              </div>
              <div>
                <Label>Country</Label>
                <Input {...register("country")} className="w-full" placeholder="Pakistan" />
              </div>

              {/* Operating Hours */}
              <div>
                <Label>Opens At</Label>
                <Input className="w-full" type="time" {...register("openTime")} />
              </div>
              <div>
                <Label>Closes At</Label>
                <Input className="w-full" type="time" {...register("closeTime")} />
              </div>

              {/* Delivery Parameters */}
              <div>
                <Label>Min Delivery Time (mins)</Label>
                <Input className="w-full" type="number" {...register("deliveryTimeMin")} />
              </div>
              <div>
                <Label>Max Delivery Time (mins)</Label>
                <Input className="w-full" type="number" {...register("deliveryTimeMax")} />
              </div>
              <div>
                <Label>Minimum Order Amount</Label>
                <Input
                  className="w-full"
                  type="number"
                  step="0.5"
                  {...register("minimumOrder")}
                />
              </div>
              <div>
                <Label>Delivery Fee</Label>
                <Input
                  className="w-full"
                  type="number"
                  step="0.5"
                  {...register("deliveryFee")}
                />
              </div>

              {/* Financial Commissions */}
              <div className="sm:col-span-2">
                <Label>Commission Rate (%)</Label>
                <Input
                  className="w-full"
                  type="number"
                  step="0.5"
                  {...register("commissionRate")}
                />
                {errors.commissionRate && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.commissionRate.message}
                  </p>
                )}
              </div>

            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : restaurant
                ? `Save ${vendorLabel}`
                : `Create ${vendorLabel}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}