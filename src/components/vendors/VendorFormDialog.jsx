// // import { useEffect } from "react";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// //   DialogFooter,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Label } from "@/components/ui/label";
// // import { Select } from "@/components/ui/select";
// // import { Button } from "@/components/ui/button";

// // const optionalNumber = (defaultValue = 0) =>
// //   z.preprocess(
// //     (val) => (val === "" || val === null || isNaN(Number(val)) ? defaultValue : Number(val)),
// //     z.number().min(0)
// //   );
  
// // const schema = z.object({
// //   name: z.string().min(2, "Name is required"),
// //   description: z.string().optional(),
// //   logo: z
// //     .union([z.string().url("Enter a valid URL"), z.literal("")])
// //     .optional(),
// //   coverImage: z
// //     .union([z.string().url("Enter a valid URL"), z.literal("")])
// //     .optional(),
// //   cuisines: z.string().optional(),
// //   phone: z.string().min(7, "Phone is required"),
// //   email: z
// //     .union([z.string().email("Enter a valid email"), z.literal("")])
// //     .optional(),
// //   street: z.string().min(2, "Street is required"),
// //   area: z.string().optional(),
// //   city: z.string().min(2, "City is required"),
// //   zipCode: z.string().optional(),
// //   openTime: z.string().min(1, "Required"),
// //   closeTime: z.string().min(1, "Required"),
// //   deliveryTimeMin: optionalNumber(20),
// //   deliveryTimeMax: optionalNumber(40),
// //   minimumOrder: optionalNumber(0),
// //   deliveryFee: optionalNumber(0),
// //   commissionRate: z.preprocess(
// //     (val) => (val === "" || val === null || isNaN(Number(val)) ? 0 : Number(val)),
// //     z.number().min(0).max(100)
// //   ),
// //   status: z.enum(["pending", "approved", "blocked"]),
// //   belongsTo: z.enum(["restaurant", "homeChef"]).default("restaurant"),
// //   categories: z.string().optional(),
// // });

// // function toFormValues(restaurant) {
// //   if (!restaurant) {
// //     return {
// //       name: "",
// //       description: "",
// //       logo: "",
// //       coverImage: "",
// //       cuisines: "",
// //       phone: "",
// //       email: "",
// //       street: "",
// //       area: "",
// //       city: "",
// //       zipCode: "",
// //       openTime: "09:00",
// //       closeTime: "23:00",
// //       deliveryTimeMin: 20,
// //       deliveryTimeMax: 40,
// //       minimumOrder: 0,
// //       deliveryFee: 2,
// //       commissionRate: 15,
// //       status: "pending",
// //       belongsTo: "restaurant",
// //       categories: "",
// //     };
// //   }
// //   return {
// //     name: restaurant.name ?? "",
// //     description: restaurant.description ?? "",
// //     logo: restaurant.logo ?? "",
// //     coverImage: restaurant.coverImage ?? "",
// //     cuisines: (restaurant.cuisines ?? []).join(", "),
// //     phone: restaurant.contact?.phone ?? "",
// //     email: restaurant.contact?.email ?? "",
// //     street: restaurant.address?.street ?? "",
// //     area: restaurant.address?.area ?? "",
// //     city: restaurant.address?.city ?? "",
// //     zipCode: restaurant.address?.zipCode ?? "",
// //     openTime: restaurant.openingHours?.open ?? "09:00",
// //     closeTime: restaurant.openingHours?.close ?? "23:00",
// //     deliveryTimeMin: restaurant.deliveryTime?.min ?? 20,
// //     deliveryTimeMax: restaurant.deliveryTime?.max ?? 40,
// //     minimumOrder: restaurant.minimumOrder ?? 0,
// //     deliveryFee: restaurant.deliveryFee ?? 0,
// //     commissionRate: restaurant.commissionRate ?? 15,
// //     status: restaurant.status ?? "pending",
// //     belongsTo: restaurant.belongsTo ?? "restaurant",
// //     categories: (restaurant.categories ?? []).join(", "),
// //   };
// // }

// // export function RestaurantFormDialog({
// //   open,
// //   onOpenChange,
// //   restaurant,
// //   onSubmit,
// //   isSubmitting,
// // }) {
// //   const {
// //     register,
// //     handleSubmit,
// //     reset,
// //     formState: { errors },
// //   } = useForm({
// //     resolver: zodResolver(schema),
// //     defaultValues: toFormValues(restaurant),
// //   });

// //   useEffect(() => {
// //     reset(toFormValues(restaurant));
// //   }, [restaurant, open, reset]);

// //   function submit(values) {
// //     onSubmit({
// //       name: values.name,
// //       description: values.description,
// //       logo: values.logo,
// //       coverImage: values.coverImage,
// //       cuisines: values.cuisines
// //         .split(",")
// //         .map((s) => s.trim())
// //         .filter(Boolean),
// //       contact: { phone: values.phone, email: values.email },
// //       address: {
// //         street: values.street,
// //         area: values.area,
// //         city: values.city,
// //         zipCode: values.zipCode,
// //         country: "Pakistan",
// //       },
// //       openingHours: {
// //         open: values.openTime,
// //         close: values.closeTime,
// //         is24Hours: false,
// //       },
// //       deliveryTime: {
// //         min: values.deliveryTimeMin,
// //         max: values.deliveryTimeMax,
// //       },
// //       minimumOrder: values.minimumOrder,
// //       deliveryFee: values.deliveryFee,
// //       commissionRate: values.commissionRate,
// //       status: values.status,
// //       isOpen: restaurant?.isOpen ?? true,
// //     });
// //   }

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
// //         <DialogHeader>
// //           <DialogTitle>
// //             {restaurant ? "Edit Restaurant" : "Add Restaurant"}
// //           </DialogTitle>
// //           <DialogDescription>
// //             Core profile info shown to customers and used for commission &
// //             payouts.
// //           </DialogDescription>
// //         </DialogHeader>

// //         <form onSubmit={handleSubmit(submit)}>
// //           <div className="max-h-[65vh] overflow-y-auto pr-2">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="sm:col-span-2">
// //                 <Label>Restaurant Name</Label>
// //                 <Input
// //                   {...register("name")}
// //                   className="w-full"
// //                   placeholder="Spice Route"
// //                 />
// //                 {errors.name && (
// //                   <p className="mt-1 text-xs text-destructive">
// //                     {errors.name.message}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="sm:col-span-2">
// //                 <Label>Description</Label>
// //                 <Textarea
// //                   {...register("description")}
// //                   className="w-full"
// //                   placeholder="Short description shown on the restaurant page"
// //                 />
// //               </div>

// //               <div>
// //                 <Label>Logo URL</Label>
// //                 <Input
// //                   {...register("logo")}
// //                   className="w-full"
// //                   placeholder="https://…"
// //                 />
// //                 {errors.logo && (
// //                   <p className="mt-1 text-xs text-destructive">
// //                     {errors.logo.message}
// //                   </p>
// //                 )}
// //               </div>
// //               <div>
// //                 <Label>Cover Image URL</Label>
// //                 <Input
// //                   {...register("coverImage")}
// //                   className="w-full"
// //                   placeholder="https://…"
// //                 />
// //                 {errors.coverImage && (
// //                   <p className="mt-1 text-xs text-destructive">
// //                     {errors.coverImage.message}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="sm:col-span-2">
// //                 <Label>Cuisines (comma separated)</Label>
// //                 <Input
// //                   {...register("cuisines")}
// //                   className="w-full"
// //                   placeholder="Fast Food, Pizza, BBQ"
// //                 />
// //               </div>

// //               <div>
// //                 <Label>Phone</Label>
// //                 <Input
// //                   {...register("phone")}
// //                   className="w-full"
// //                   placeholder="+92 300 1234567"
// //                 />
// //                 {errors.phone && (
// //                   <p className="mt-1 text-xs text-destructive">
// //                     {errors.phone.message}
// //                   </p>
// //                 )}
// //               </div>
// //               <div>
// //                 <Label>Email</Label>
// //                 <Input
// //                   {...register("email")}
// //                   className="w-full"
// //                   placeholder="owner@restaurant.com"
// //                 />
// //                 {errors.email && (
// //                   <p className="mt-1 text-xs text-destructive">
// //                     {errors.email.message}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="sm:col-span-2">
// //                 <Label>Street Address</Label>
// //                 <Input
// //                   {...register("street")}
// //                   className="w-full"
// //                   placeholder="123 Main Boulevard"
// //                 />
// //                 {errors.street && (
// //                   <p className="mt-1 text-xs text-destructive">
// //                     {errors.street.message}
// //                   </p>
// //                 )}
// //               </div>
// //               <div>
// //                 <Label>Area</Label>
// //                 <Input
// //                   {...register("area")}
// //                   className="w-full"
// //                   placeholder="Block A"
// //                 />
// //               </div>
// //               <div>
// //                 <Label>City</Label>
// //                 <Input
// //                   {...register("city")}
// //                   className="w-full"
// //                   placeholder="Karachi"
// //                 />
// //                 {errors.city && (
// //                   <p className="mt-1 text-xs text-destructive">
// //                     {errors.city.message}
// //                   </p>
// //                 )}
// //               </div>
// //               <div>
// //                 <Label>Zip Code</Label>
// //                 <Input
// //                   {...register("zipCode")}
// //                   className="w-full"
// //                   placeholder="75500"
// //                 />
// //               </div>
// //               <div>
// //                 <Label>Status</Label>
// //                 <Select className="w-full" {...register("status")}>
// //                   <option value="pending">Pending</option>
// //                   <option value="approved">Approved</option>
// //                   <option value="blocked">Blocked</option>
// //                 </Select>
// //                 {/* <Select
// //                 //   value={watch("status")}
// //                   onValueChange={(value) => setValue("status", value)}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue />
// //                   </SelectTrigger>

// //                   <SelectContent>
// //                     <SelectItem value="pending">Pending</SelectItem>
// //                     <SelectItem value="approved">Approved</SelectItem>
// //                     <SelectItem value="blocked">Blocked</SelectItem>
// //                   </SelectContent>
// //                 </Select> */}
// //               </div>

// //               <div>
// //                 <Label>Opens At</Label>
// //                 <Input
// //                   className="w-full"
// //                   type="time"
// //                   {...register("openTime")}
// //                 />
// //               </div>
// //               <div>
// //                 <Label>Closes At</Label>
// //                 <Input
// //                   className="w-full"
// //                   type="time"
// //                   {...register("closeTime")}
// //                 />
// //               </div>
// //               <div>
// //                 <Label>Min Delivery Time (min)</Label>
// //                 <Input
// //                   className="w-full"
// //                   type="number"
// //                   {...register("deliveryTimeMin")}
// //                 />
// //               </div>
// //               <div>
// //                 <Label>Max Delivery Time (min)</Label>
// //                 <Input
// //                   className="w-full"
// //                   type="number"
// //                   {...register("deliveryTimeMax")}
// //                 />
// //               </div>
// //               <div>
// //                 <Label>Minimum Order ($)</Label>
// //                 <Input
// //                   className="w-full"
// //                   type="number"
// //                   step="0.5"
// //                   {...register("minimumOrder")}
// //                 />
// //               </div>
// //               <div>
// //                 <Label>Delivery Fee ($)</Label>
// //                 <Input
// //                   className="w-full"
// //                   type="number"
// //                   step="0.5"
// //                   {...register("deliveryFee")}
// //                 />
// //               </div>
// //               <div>
// //                 <Label>Commission Rate (%)</Label>
// //                 <Input
// //                   className="w-full"
// //                   type="number"
// //                   step="0.5"
// //                   {...register("commissionRate")}
// //                 />
// //                 {errors.commissionRate && (
// //                   <p className="mt-1 text-xs text-destructive">
// //                     {errors.commissionRate.message}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //           <DialogFooter>
// //             <Button
// //               type="button"
// //               variant="outline"
// //               onClick={() => onOpenChange(false)}
// //             >
// //               Cancel
// //             </Button>
// //             <Button type="submit" disabled={isSubmitting}>
// //               {isSubmitting
// //                 ? "Saving…"
// //                 : restaurant
// //                   ? "Save Changes"
// //                   : "Create Restaurant"}
// //             </Button>
// //           </DialogFooter>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }


// import { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// // Helper for optional numeric inputs
// const optionalNumber = (defaultValue = 0) =>
//   z.preprocess(
//     (val) => (val === "" || val === null || isNaN(Number(val)) ? defaultValue : Number(val)),
//     z.number().min(0)
//   );

// // Zod Validation Schema
// const schema = z.object({
//   name: z.string().min(2, "Name is required"),
//   description: z.string().optional(),
//   logo: z.union([z.string().url("Enter a valid URL"), z.literal("")]).optional(),
//   coverImage: z.union([z.string().url("Enter a valid URL"), z.literal("")]).optional(),
//   cuisines: z.string().optional(),
//   phone: z.string().min(7, "Phone is required"),
//   email: z.union([z.string().email("Enter a valid email"), z.literal("")]).optional(),
//   street: z.string().min(2, "Street is required"),
//   area: z.string().optional(),
//   city: z.string().min(2, "City is required"),
//   zipCode: z.string().optional(),
//   country: z.string().default("Pakistan"),
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
//   belongsTo: z.enum(["vendor", "homeChef"]).default("vendor"),
//   // Formatted string input: "Pizza: BBQ, Pepperoni | Burgers: Zinger, Beef"
//   categoriesRaw: z.string().optional(),
// });

// // Converts raw DB object into form-friendly default values
// function toFormValues(vendor) {
//   // Helper to serialize nested categories schema into a editable string format
//   const formattedCategories = vendor?.categories
//     ? vendor.categories
//         .map((c) =>
//           c.subCategories?.length
//             ? `${c.categoryName}: ${c.subCategories.join(", ")}`
//             : c.categoryName
//         )
//         .join(" | ")
//     : "";

//   if (!vendor) {
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
//       country: "Pakistan",
//       openTime: "09:00",
//       closeTime: "23:00",
//       deliveryTimeMin: 20,
//       deliveryTimeMax: 40,
//       minimumOrder: 0,
//       deliveryFee: 0,
//       commissionRate: 15,
//       status: "pending",
//       belongsTo: "vendor",
//       categoriesRaw: "",
//     };
//   }

//   return {
//     name: vendor.name ?? "",
//     description: vendor.description ?? "",
//     logo: vendor.logo ?? "",
//     coverImage: vendor.coverImage ?? "",
//     cuisines: (vendor.cuisines ?? []).join(", "),
//     phone: vendor.contact?.phone ?? "",
//     email: vendor.contact?.email ?? "",
//     street: vendor.address?.street ?? "",
//     area: vendor.address?.area ?? "",
//     city: vendor.address?.city ?? "",
//     zipCode: vendor.address?.zipCode ?? "",
//     country: vendor.address?.country ?? "Pakistan",
//     openTime: vendor.openingHours?.open ?? "09:00",
//     closeTime: vendor.openingHours?.close ?? "23:00",
//     deliveryTimeMin: vendor.deliveryTime?.min ?? 20,
//     deliveryTimeMax: vendor.deliveryTime?.max ?? 40,
//     minimumOrder: vendor.minimumOrder ?? 0,
//     deliveryFee: vendor.deliveryFee ?? 0,
//     commissionRate: vendor.commissionRate ?? 15,
//     status: vendor.status ?? "pending",
//     belongsTo: vendor.belongsTo ?? (vendor.isHomeChef ? "homeChef" : "vendor"),
//     categoriesRaw: formattedCategories,
//   };
// }

// export function VendorFormDialog({
//   open,
//   onOpenChange,
//   vendor, // Can be a Vendor or Home Chef object
//   onSubmit,
//   isSubmitting,
// }) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     control,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: toFormValues(vendor),
//   });

//   const belongsToValue = watch("belongsTo");

//   useEffect(() => {
//     reset(toFormValues(vendor));
//   }, [vendor, open, reset]);

//   function submit(values) {
//     // Parses string formatted as "Category: Sub1, Sub2 | Category2: Sub3"
//     // Into Schema: [{ categoryName: "Category", subCategories: ["Sub1", "Sub2"] }]
//     const parsedCategories = values.categoriesRaw
//       ? values.categoriesRaw
//           .split("|")
//           .map((catChunk) => {
//             const [catName, subCatsStr] = catChunk.split(":");
//             if (!catName || !catName.trim()) return null;

//             const subCategories = subCatsStr
//               ? subCatsStr
//                   .split(",")
//                   .map((s) => s.trim())
//                   .filter(Boolean)
//               : [];

//             return {
//               categoryName: catName.trim(),
//               subCategories,
//             };
//           })
//           .filter(Boolean)
//       : [];

//     onSubmit({
//       name: values.name,
//       description: values.description,
//       logo: values.logo,
//       coverImage: values.coverImage,
//       cuisines: values.cuisines
//         ? values.cuisines
//             .split(",")
//             .map((s) => s.trim())
//             .filter(Boolean)
//         : [],
//       categories: parsedCategories,
//       contact: {
//         phone: values.phone,
//         email: values.email,
//       },
//       address: {
//         street: values.street,
//         area: values.area,
//         city: values.city,
//         zipCode: values.zipCode,
//         country: values.country,
//       },
//       openingHours: {
//         open: values.openTime,
//         close: values.closeTime,
//         is24Hours: vendor?.openingHours?.is24Hours ?? false,
//       },
//       deliveryTime: {
//         min: values.deliveryTimeMin,
//         max: values.deliveryTimeMax,
//       },
//       minimumOrder: values.minimumOrder,
//       deliveryFee: values.deliveryFee,
//       commissionRate: values.commissionRate,
//       status: values.status,
//       belongsTo: values.belongsTo,
//       isOpen: vendor?.isOpen ?? true,
//     });
//   }

//   const vendorLabel = belongsToValue === "homeChef" ? "Home Chef" : "Vendor";

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
//         <DialogHeader>
//           <DialogTitle>
//             {vendor ? `Edit ${vendorLabel}` : `Add ${vendorLabel}`}
//           </DialogTitle>
//           <DialogDescription>
//             Manage profile details, address, opening hours, commission rates, and menu categories.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(submit)}>
//           <div className="max-h-[65vh] overflow-y-auto pr-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
//               {/* Type Selection */}
//               <div>
//                 <Label>Seller Type</Label>
//                 <Controller
//                   name="belongsTo"
//                   control={control}
//                   render={({ field }) => (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="vendor">Vendor</SelectItem>
//                         <SelectItem value="homeChef">Home Chef</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               {/* Status Select */}
//               <div>
//                 <Label>Status</Label>
//                 <Controller
//                   name="status"
//                   control={control}
//                   render={({ field }) => (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="pending">Pending</SelectItem>
//                         <SelectItem value="approved">Approved</SelectItem>
//                         <SelectItem value="blocked">Blocked</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               {/* Name */}
//               <div className="sm:col-span-2">
//                 <Label>{vendorLabel} Name *</Label>
//                 <Input
//                   {...register("name")}
//                   className="w-full"
//                   placeholder={belongsToValue === "homeChef" ? "Amma's Kitchen" : "Spice Route"}
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="sm:col-span-2">
//                 <Label>Description</Label>
//                 <Textarea
//                   {...register("description")}
//                   className="w-full"
//                   placeholder={`Short description shown on the ${vendorLabel.toLowerCase()} page`}
//                 />
//               </div>

//               {/* Media URLs */}
//               <div>
//                 <Label>Logo URL</Label>
//                 <Input {...register("logo")} type="file" className="w-full" placeholder="https://…" />
//                 {errors.logo && (
//                   <p className="mt-1 text-xs text-destructive">{errors.logo.message}</p>
//                 )}
//               </div>
//               <div>
//                 <Label>Cover Image URL</Label>
//                 <Input {...register("coverImage")} className="w-full" placeholder="https://…" />
//                 {errors.coverImage && (
//                   <p className="mt-1 text-xs text-destructive">{errors.coverImage.message}</p>
//                 )}
//               </div>

//               {/* Cuisines */}
//               <div className="sm:col-span-2">
//                 <Label>Cuisines (comma separated)</Label>
//                 <Input
//                   {...register("cuisines")}
//                   className="w-full"
//                   placeholder="Fast Food, Pizza, Desi, Home-cooked"
//                 />
//               </div>

//               {/* Categories & Subcategories Schema parser */}
//               <div className="sm:col-span-2">
//                 <Label>Categories & Subcategories</Label>
//                 <Input
//                   {...register("categoriesRaw")}
//                   className="w-full"
//                   placeholder="Pizza: BBQ, Meat, Classic | Burgers: Beef, Zinger"
//                 />
//                 <p className="mt-1 text-[11px] text-muted-foreground">
//                   Separate subcategories with commas (<code>,</code>) and main categories with a pipe (<code>|</code>).
//                 </p>
//               </div>

//               {/* Contact */}
//               <div>
//                 <Label>Phone *</Label>
//                 <Input
//                   {...register("phone")}
//                   className="w-full"
//                   placeholder="+92 300 1234567"
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
//                 )}
//               </div>
//               <div>
//                 <Label>Email</Label>
//                 <Input
//                   {...register("email")}
//                   className="w-full"
//                   placeholder="owner@domain.com"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
//                 )}
//               </div>

//               {/* Address */}
//               <div className="sm:col-span-2">
//                 <Label>Street Address *</Label>
//                 <Input
//                   {...register("street")}
//                   className="w-full"
//                   placeholder="123 Main Boulevard"
//                 />
//                 {errors.street && (
//                   <p className="mt-1 text-xs text-destructive">{errors.street.message}</p>
//                 )}
//               </div>
//               <div>
//                 <Label>Area</Label>
//                 <Input {...register("area")} className="w-full" placeholder="Block A" />
//               </div>
//               <div>
//                 <Label>City *</Label>
//                 <Input {...register("city")} className="w-full" placeholder="Karachi" />
//                 {errors.city && (
//                   <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>
//                 )}
//               </div>
//               <div>
//                 <Label>Zip Code</Label>
//                 <Input {...register("zipCode")} className="w-full" placeholder="75500" />
//               </div>
//               <div>
//                 <Label>Country</Label>
//                 <Input {...register("country")} className="w-full" placeholder="Pakistan" />
//               </div>

//               {/* Operating Hours */}
//               <div>
//                 <Label>Opens At</Label>
//                 <Input className="w-full" type="time" {...register("openTime")} />
//               </div>
//               <div>
//                 <Label>Closes At</Label>
//                 <Input className="w-full" type="time" {...register("closeTime")} />
//               </div>

//               {/* Delivery Parameters */}
//               <div>
//                 <Label>Min Delivery Time (mins)</Label>
//                 <Input className="w-full" type="number" {...register("deliveryTimeMin")} />
//               </div>
//               <div>
//                 <Label>Max Delivery Time (mins)</Label>
//                 <Input className="w-full" type="number" {...register("deliveryTimeMax")} />
//               </div>
//               <div>
//                 <Label>Minimum Order Amount</Label>
//                 <Input
//                   className="w-full"
//                   type="number"
//                   step="0.5"
//                   {...register("minimumOrder")}
//                 />
//               </div>
//               <div>
//                 <Label>Delivery Fee</Label>
//                 <Input
//                   className="w-full"
//                   type="number"
//                   step="0.5"
//                   {...register("deliveryFee")}
//                 />
//               </div>

//               {/* Financial Commissions */}
//               <div className="sm:col-span-2">
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

//           <DialogFooter className="mt-4">
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
//                 : vendor
//                 ? `Save ${vendorLabel}`
//                 : `Create ${vendorLabel}`}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, MapPin, Clock, Building2, Store } from "lucide-react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ==========================================
// 1. ZOD SCHEMA (STRICT MONGOOSE MATCHING)
// ==========================================
const branchSchema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  branchCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  area: z.string().optional(),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().optional(),
  country: z.string().default("Pakistan"),
  zoneId: z.string().optional(), // Zone Reference ID
  longitude: z.coerce.number().default(0),
  latitude: z.coerce.number().default(0),
  
  // Branch Operating Timings
  timings: z.object({
    openingTime: z.string().default("09:00"),
    closingTime: z.string().default("23:00"),
    operatingDays: z.array(z.string()).default(DAYS_OF_WEEK),
    is24Hours: z.boolean().default(false),
  }),

  // Operational Flags & Rates
  isActive: z.boolean().default(true),
  isOpen: z.boolean().default(true),
  isRushMode: z.boolean().default(false),
  isSponsored: z.boolean().default(false),
  isFreeDelivery: z.boolean().default(false),
  commissionRate: z.coerce.number().default(15),
  minOrderValue: z.coerce.number().default(0),
  deliveryRadiusKm: z.coerce.number().default(5),
});

const vendorFormSchema = z.object({
  // Vendor Main / Credentials
  businessName: z.string().min(1, "Business name is required"),
  businessDescription: z.string().optional(),
  businessEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  businessPhone: z.string().min(1, "Business phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),

  // Owner Info
  ownerName: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email("Invalid owner email").optional().or(z.literal("")),
  cnicNumber: z.string().min(1, "CNIC number is required"),

  // Business Category & Status
  businessType: z.string().default("restaurant"),
  category: z.string().optional(),
  
  // Package Selection
  package: z.object({
    packageName: z.enum(["basic", "standard", "premium", "featured", "enterprise", ""]).default("basic"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isPaid: z.boolean().default(false),
  }),

  verificationStatus: z.enum(["draft", "pending", "approved", "rejected", "suspended"]).default("draft"),
  rejectionReason: z.string().optional(),
  isActive: z.boolean().default(true),
  isSponsored: z.boolean().default(false),
  isBlocked: z.boolean().default(false),

  // Registration & Tax
  businessRegistrationNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  foodLicenseNumber: z.string().optional(),

  // Media / Documents File or URL inputs
  profilePicture: z.any().optional(),
  cnicFrontPicture: z.any().optional(),
  cnicBackPicture: z.any().optional(),
  logo: z.any().optional(),
  coverImage: z.any().optional(),
  incorporationCertificate: z.any().optional(),
  foodSafetyLicense: z.any().optional(),
  ntnCertificate: z.any().optional(),

  // Dynamic Array: otherDocuments
  otherDocuments: z.array(
    z.object({
      name: z.string().optional(),
      file: z.any().optional(),
    })
  ).optional(),

  // Payout Config
  payout: z.object({
    accountHolderName: z.string().optional(),
    paymentMethod: z.enum(["bank", "jazzcash", "easypaisa", ""]).default(""),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
    walletNumber: z.string().optional(),
    isVerified: z.boolean().default(false),
  }),

  // MULTIPLE BRANCHES ARRAY
  branches: z.array(branchSchema).min(1, "At least one branch is required"),
});

const defaultBranch = {
  branchName: "Main Branch",
  branchCode: "BR-01",
  phone: "",
  email: "",
  address: "",
  area: "",
  city: "Lahore",
  zipCode: "",
  country: "Pakistan",
  zoneId: "",
  longitude: 74.3587,
  latitude: 31.5204,
  timings: {
    openingTime: "09:00",
    closingTime: "23:00",
    operatingDays: DAYS_OF_WEEK,
    is24Hours: false,
  },
  isActive: true,
  isOpen: true,
  isRushMode: false,
  isSponsored: false,
  isFreeDelivery: false,
  commissionRate: 15,
  minOrderValue: 0,
  deliveryRadiusKm: 5,
};

const defaultValues = {
  businessName: "",
  businessDescription: "",
  businessEmail: "",
  businessPhone: "",
  password: "",
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  cnicNumber: "",
  businessType: "restaurant",
  category: "",
  package: {
    packageName: "basic",
    startDate: "",
    endDate: "",
    isPaid: false,
  },
  verificationStatus: "draft",
  rejectionReason: "",
  isActive: true,
  isSponsored: false,
  isBlocked: false,
  businessRegistrationNumber: "",
  taxNumber: "",
  foodLicenseNumber: "",
  profilePicture: "",
  cnicFrontPicture: "",
  cnicBackPicture: "",
  logo: "",
  coverImage: "",
  incorporationCertificate: "",
  foodSafetyLicense: "",
  ntnCertificate: "",
  otherDocuments: [],
  payout: {
    accountHolderName: "",
    paymentMethod: "",
    bankName: "",
    accountNumber: "",
    iban: "",
    walletNumber: "",
    isVerified: false,
  },
  branches: [defaultBranch],
};

export function VendorFormDialog({ open, isOpen, onClose, initialData = null, zonesList = [], onSubmit }) {
  const [activeTab, setActiveTab] = useState("account");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vendorFormSchema),
    defaultValues,
  });

  // Dynamic Array for Other Documents
  const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({
    control,
    name: "otherDocuments",
  });

  // Dynamic Array for MULTIPLE BRANCHES
  const { fields: branchFields, append: appendBranch, remove: removeBranch } = useFieldArray({
    control,
    name: "branches",
  });

  const watchPaymentMethod = watch("payout.paymentMethod");
  const watchStatus = watch("verificationStatus");

  // Load Vendor & Multiple Branches into Form State
  useEffect(() => {
    if (initialData) {
      const vendor = initialData.vendor || initialData;
      const rawBranches = initialData.branches || (initialData.branch ? [initialData.branch] : []);

      const formattedBranches = rawBranches.length > 0
        ? rawBranches.map((b, idx) => ({
            ...defaultBranch,
            ...b,
            branchName: b.branchName || `Branch ${idx + 1}`,
            longitude: b.location?.coordinates?.[0] ?? b.longitude ?? 0,
            latitude: b.location?.coordinates?.[1] ?? b.latitude ?? 0,
            timings: {
              ...defaultBranch.timings,
              ...(b.timings || {}),
            },
          }))
        : [defaultBranch];

      reset({
        ...defaultValues,
        ...vendor,
        package: {
          ...defaultValues.package,
          ...(typeof vendor?.package === "object" ? vendor.package : { packageName: vendor?.package || "basic" }),
        },
        payout: {
          ...defaultValues.payout,
          ...(vendor?.payout || {}),
        },
        branches: formattedBranches,
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset, isOpen, open]);

  // Handle File Input Change
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setValue(fieldName, file, { shouldValidate: true });
    }
  };

  // Convert Form Payload to Match Backend Schemas
  const handleFormSubmit = async (data) => {
    const { branches, ...vendorData } = data;

    // Convert Longitude & Latitude to Mongoose GeoJSON format for each branch
    const formattedBranches = branches.map((br) => {
      const { longitude, latitude, zoneId, ...branchRest } = br;
      return {
        ...branchRest,
        zone: zoneId || null, // Reference to Zone Model ID
        location: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)],
        },
      };
    });

    const payload = {
      vendor: vendorData,
      branches: formattedBranches,
    };

    await onSubmit(payload);
    onClose();
  };

  const renderCurrentFile = (fieldName) => {
    const val = watch(fieldName);
    if (typeof val === "string" && val.startsWith("http")) {
      return (
        <a href={val} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline truncate block mt-1">
          View current file
        </a>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {initialData ? "Edit Vendor Profile & Branches" : "Register Vendor with Multiple Branches"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="account">Account & Owner</TabsTrigger>
              <TabsTrigger value="business">Business & Packages</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="payout">Payout</TabsTrigger>
              <TabsTrigger value="branches" className="font-bold text-primary">
                Branches ({branchFields.length})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: ACCOUNT & OWNER INFO */}
            <TabsContent value="account" className="space-y-4 pt-4">
              <h3 className="font-semibold text-md text-gray-800 border-b pb-1">Account Credentials</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Name *</Label>
                  <Input {...register("businessName")} placeholder="e.g. Gourmet Foods" />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                </div>

                <div>
                  <Label>Business Phone *</Label>
                  <Input {...register("businessPhone")} placeholder="+92 300 1234567" />
                  {errors.businessPhone && <p className="text-red-500 text-xs mt-1">{errors.businessPhone.message}</p>}
                </div>

                <div>
                  <Label>Business Email</Label>
                  <Input {...register("businessEmail")} type="email" placeholder="vendor@biz.com" />
                  {errors.businessEmail && <p className="text-red-500 text-xs mt-1">{errors.businessEmail.message}</p>}
                </div>

                <div>
                  <Label>Password {!initialData && "*"}</Label>
                  <Input {...register("password")} type="password" placeholder="••••••••" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
              </div>

              <h3 className="font-semibold text-md text-gray-800 border-b pb-1 pt-4">Owner Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Owner Name</Label>
                  <Input {...register("ownerName")} placeholder="Muhammad Ali" />
                </div>

                <div>
                  <Label>CNIC Number *</Label>
                  <Input {...register("cnicNumber")} placeholder="35201-XXXXXXX-X" />
                  {errors.cnicNumber && <p className="text-red-500 text-xs mt-1">{errors.cnicNumber.message}</p>}
                </div>

                <div>
                  <Label>Owner Phone</Label>
                  <Input {...register("ownerPhone")} placeholder="+92 300 7654321" />
                </div>

                <div>
                  <Label>Owner Email</Label>
                  <Input {...register("ownerEmail")} type="email" placeholder="owner@gmail.com" />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: BUSINESS PROFILE & PACKAGES */}
            <TabsContent value="business" className="space-y-4 pt-4">
              <h3 className="font-semibold text-md text-gray-800 border-b pb-1">Business Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Type *</Label>
                  <Select
                    value={watch("businessType")}
                    onValueChange={(val) => setValue("businessType", val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="bakery">Bakery</SelectItem>
                      <SelectItem value="home_chef">Home Chef</SelectItem>
                      <SelectItem value="grocery">Grocery</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="cafe">Cafe</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Category</Label>
                  <Input {...register("category")} placeholder="e.g. Fast Food, Desi, Continental" />
                </div>
              </div>

              <h3 className="font-semibold text-md text-gray-800 border-b pb-1 pt-2">Package Subscription</h3>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border">
                <div>
                  <Label>Subscription Package</Label>
                  <Select
                    value={watch("package.packageName")}
                    onValueChange={(val) => setValue("package.packageName", val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Package" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Package Start Date</Label>
                  <Input type="date" {...register("package.startDate")} />
                </div>

                <div>
                  <Label>Package End Date</Label>
                  <Input type="date" {...register("package.endDate")} />
                </div>

                <div className="flex items-center space-x-2 pt-4 col-span-3">
                  <Switch
                    checked={watch("package.isPaid")}
                    onCheckedChange={(val) => setValue("package.isPaid", val)}
                  />
                  <Label className="font-semibold">Package Payment Completed</Label>
                </div>
              </div>

              <h3 className="font-semibold text-md text-gray-800 border-b pb-1 pt-2">Account Status & Control</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Verification Status</Label>
                  <Select
                    value={watchStatus}
                    onValueChange={(val) => setValue("verificationStatus", val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {watchStatus === "rejected" && (
                  <div className="col-span-2">
                    <Label className="text-red-600 font-medium">Rejection Reason</Label>
                    <Textarea {...register("rejectionReason")} placeholder="State reasons for rejecting this vendor..." />
                  </div>
                )}
              </div>

              <div>
                <Label>Business Overview / Description</Label>
                <Textarea {...register("businessDescription")} placeholder="Short description of the brand..." />
              </div>

              <div className="flex gap-6 pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Switch checked={watch("isActive")} onCheckedChange={(val) => setValue("isActive", val)} />
                  <Label>Account Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch checked={watch("isSponsored")} onCheckedChange={(val) => setValue("isSponsored", val)} />
                  <Label>Sponsored Vendor</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch checked={watch("isBlocked")} onCheckedChange={(val) => setValue("isBlocked", val)} />
                  <Label className="text-red-600 font-semibold">Block Account</Label>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: DOCUMENTS */}
            <TabsContent value="documents" className="space-y-4 pt-4">
              <h3 className="font-semibold text-md text-gray-800 border-b pb-1">License & Registration Numbers</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Business Reg #</Label>
                  <Input {...register("businessRegistrationNumber")} placeholder="REG-12345" />
                </div>
                <div>
                  <Label>Tax Number (NTN)</Label>
                  <Input {...register("taxNumber")} placeholder="NTN-98765" />
                </div>
                <div>
                  <Label>Food License #</Label>
                  <Input {...register("foodLicenseNumber")} placeholder="FL-45678" />
                </div>
              </div>

              <h3 className="font-semibold text-md text-gray-800 border-b pb-1 pt-2">File Attachments</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "logo", label: "Logo Image" },
                  { id: "coverImage", label: "Cover Banner" },
                  { id: "profilePicture", label: "Profile Picture" },
                  { id: "cnicFrontPicture", label: "CNIC Front Image" },
                  { id: "cnicBackPicture", label: "CNIC Back Image" },
                  { id: "incorporationCertificate", label: "Incorporation Document" },
                  { id: "foodSafetyLicense", label: "Food Safety Certificate" },
                  { id: "ntnCertificate", label: "NTN Document" },
                ].map((item) => (
                  <div key={item.id} className="border p-3 rounded-md bg-gray-50/50">
                    <Label className="text-xs font-semibold">{item.label}</Label>
                    <Input type="file" className="mt-1 bg-white" onChange={(e) => handleFileChange(e, item.id)} />
                    {renderCurrentFile(item.id)}
                  </div>
                ))}
              </div>

              {/* Dynamic Supporting Documents */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-md text-gray-800">Additional Attachments</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendDoc({ name: "", file: "" })}>
                    <Plus className="w-4 h-4 mr-1" /> Add Attachment
                  </Button>
                </div>

                {docFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-end mb-3 border p-3 rounded bg-gray-50">
                    <div className="flex-1">
                      <Label className="text-xs">Document Name</Label>
                      <Input {...register(`otherDocuments.${index}.name`)} placeholder="e.g. Electricity Bill" className="bg-white" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">File</Label>
                      <Input type="file" className="bg-white" onChange={(e) => handleFileChange(e, `otherDocuments.${index}.file`)} />
                      {renderCurrentFile(`otherDocuments.${index}.file`)}
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeDoc(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 4: PAYOUT SETTINGS */}
            <TabsContent value="payout" className="space-y-4 pt-4">
              <h3 className="font-semibold text-md text-gray-800 border-b pb-1">Payout & Bank Account Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment Method</Label>
                  <Select
                    value={watch("payout.paymentMethod")}
                    onValueChange={(val) => setValue("payout.paymentMethod", val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Payment Method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="jazzcash">JazzCash</SelectItem>
                      <SelectItem value="easypaisa">EasyPaisa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Account Holder Title</Label>
                  <Input {...register("payout.accountHolderName")} placeholder="Title of Account" />
                </div>

                {watchPaymentMethod === "bank" && (
                  <>
                    <div>
                      <Label>Bank Name</Label>
                      <Input {...register("payout.bankName")} placeholder="Meezan, HBL, Bank Alfalah..." />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input {...register("payout.accountNumber")} placeholder="Account Number" />
                    </div>
                    <div className="col-span-2">
                      <Label>IBAN Number</Label>
                      <Input {...register("payout.iban")} placeholder="PK36MEZN0000000000000000" />
                    </div>
                  </>
                )}

                {(watchPaymentMethod === "jazzcash" || watchPaymentMethod === "easypaisa") && (
                  <div className="col-span-2">
                    <Label>Mobile Wallet Phone Number</Label>
                    <Input {...register("payout.walletNumber")} placeholder="03001234567" />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t">
                <Switch checked={watch("payout.isVerified")} onCheckedChange={(val) => setValue("payout.isVerified", val)} />
                <Label className="font-semibold">Verify Payout Account Details</Label>
              </div>
            </TabsContent>

            {/* TAB 5: MULTIPLE BRANCHES & TIMINGS */}
            <TabsContent value="branches" className="space-y-6 pt-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" /> Vendor Outlets & Branches
                  </h3>
                  <p className="text-xs text-gray-500">Add multiple branches with locations, zones, and operating timings.</p>
                </div>
                <Button type="button" onClick={() => appendBranch({ ...defaultBranch, branchName: `Branch ${branchFields.length + 1}` })}>
                  <Plus className="w-4 h-4 mr-1" /> Add Another Branch
                </Button>
              </div>

              {errors.branches && typeof errors.branches.message === "string" && (
                <p className="text-red-500 text-xs font-semibold">{errors.branches.message}</p>
              )}

              {branchFields.map((branch, bIdx) => {
                const is24Hrs = watch(`branches.${bIdx}.timings.is24Hours`);
                const currentDays = watch(`branches.${bIdx}.timings.operatingDays`) || [];

                return (
                  <div key={branch.id} className="border-2 border-slate-200 p-5 rounded-xl bg-slate-50/50 space-y-4 relative">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-bold text-slate-700 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-500" /> Branch #{bIdx + 1}
                      </span>
                      {branchFields.length > 1 && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeBranch(bIdx)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Remove Branch
                        </Button>
                      )}
                    </div>

                    {/* Basic Branch Information */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Branch Name *</Label>
                        <Input {...register(`branches.${bIdx}.branchName`)} placeholder="Main Branch, Gulberg Branch..." />
                        {errors.branches?.[bIdx]?.branchName && (
                          <p className="text-red-500 text-xs mt-1">{errors.branches[bIdx].branchName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Branch Code</Label>
                        <Input {...register(`branches.${bIdx}.branchCode`)} placeholder="BR-01" />
                      </div>

                      <div>
                        <Label>Assigned Zone (Location Zone)</Label>
                        <Select
                          value={watch(`branches.${bIdx}.zoneId`)}
                          onValueChange={(val) => setValue(`branches.${bIdx}.zoneId`, val)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select Zone" /></SelectTrigger>
                          <SelectContent>
                            {zonesList.map((zone) => (
                              <SelectItem key={zone._id} value={zone._id}>
                                {zone.name || zone.title || zone._id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Branch Phone</Label>
                        <Input {...register(`branches.${bIdx}.phone`)} placeholder="+92 42 1234567" />
                      </div>

                      <div>
                        <Label>Branch Email</Label>
                        <Input {...register(`branches.${bIdx}.email`)} type="email" placeholder="branch@biz.com" />
                      </div>

                      <div>
                        <Label>City *</Label>
                        <Input {...register(`branches.${bIdx}.city`)} placeholder="Lahore" />
                        {errors.branches?.[bIdx]?.city && (
                          <p className="text-red-500 text-xs mt-1">{errors.branches[bIdx].city.message}</p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <Label>Complete Street Address *</Label>
                        <Input {...register(`branches.${bIdx}.address`)} placeholder="Shop #1, Street Address, Sector" />
                        {errors.branches?.[bIdx]?.address && (
                          <p className="text-red-500 text-xs mt-1">{errors.branches[bIdx].address.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Area / Locality</Label>
                        <Input {...register(`branches.${bIdx}.area`)} placeholder="Gulberg III" />
                      </div>

                      <div>
                        <Label>Longitude (GeoJSON)</Label>
                        <Input type="number" step="any" {...register(`branches.${bIdx}.longitude`)} placeholder="74.3587" />
                      </div>

                      <div>
                        <Label>Latitude (GeoJSON)</Label>
                        <Input type="number" step="any" {...register(`branches.${bIdx}.latitude`)} placeholder="31.5204" />
                      </div>

                      <div>
                        <Label>Commission Rate (%)</Label>
                        <Input type="number" {...register(`branches.${bIdx}.commissionRate`)} placeholder="15" />
                      </div>

                      <div>
                        <Label>Delivery Radius (KM)</Label>
                        <Input type="number" {...register(`branches.${bIdx}.deliveryRadiusKm`)} placeholder="5" />
                      </div>

                      <div>
                        <Label>Min Order Value (PKR)</Label>
                        <Input type="number" {...register(`branches.${bIdx}.minOrderValue`)} placeholder="0" />
                      </div>
                    </div>

                    {/* BRANCH TIMINGS SECTION */}
                    <div className="bg-white p-4 rounded-lg border space-y-3">
                      <h4 className="font-semibold text-xs text-slate-700 flex items-center gap-1 uppercase tracking-wide">
                        <Clock className="w-4 h-4 text-amber-500" /> Operating Days & Hours
                      </h4>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={is24Hrs}
                          onCheckedChange={(val) => setValue(`branches.${bIdx}.timings.is24Hours`, val)}
                        />
                        <Label className="text-sm font-medium">Open 24 Hours</Label>
                      </div>

                      {!is24Hrs && (
                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div>
                            <Label className="text-xs">Opening Time</Label>
                            <Input type="time" {...register(`branches.${bIdx}.timings.openingTime`)} />
                          </div>
                          <div>
                            <Label className="text-xs">Closing Time</Label>
                            <Input type="time" {...register(`branches.${bIdx}.timings.closingTime`)} />
                          </div>
                        </div>
                      )}

                      <div>
                        <Label className="text-xs mb-2 block">Active Operating Days</Label>
                        <div className="flex flex-wrap gap-3">
                          {DAYS_OF_WEEK.map((day) => {
                            const isChecked = currentDays.includes(day);
                            return (
                              <div key={day} className="flex items-center space-x-1">
                                <Checkbox
                                  id={`day-${bIdx}-${day}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const updatedDays = checked
                                      ? [...currentDays, day]
                                      : currentDays.filter((d) => d !== day);
                                    setValue(`branches.${bIdx}.timings.operatingDays`, updatedDays);
                                  }}
                                />
                                <label htmlFor={`day-${bIdx}-${day}`} className="text-xs font-medium cursor-pointer">
                                  {day.slice(0, 3)}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Operational Toggles */}
                    <div className="flex flex-wrap gap-6 pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={watch(`branches.${bIdx}.isActive`)}
                          onCheckedChange={(val) => setValue(`branches.${bIdx}.isActive`, val)}
                        />
                        <Label className="text-xs font-semibold">Active</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={watch(`branches.${bIdx}.isOpen`)}
                          onCheckedChange={(val) => setValue(`branches.${bIdx}.isOpen`, val)}
                        />
                        <Label className="text-xs font-semibold">Is Open Now</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={watch(`branches.${bIdx}.isRushMode`)}
                          onCheckedChange={(val) => setValue(`branches.${bIdx}.isRushMode`, val)}
                        />
                        <Label className="text-xs font-semibold text-amber-600">Rush Mode</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={watch(`branches.${bIdx}.isFreeDelivery`)}
                          onCheckedChange={(val) => setValue(`branches.${bIdx}.isFreeDelivery`, val)}
                        />
                        <Label className="text-xs font-semibold text-emerald-600">Free Delivery</Label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update Vendor & Branches" : "Create Vendor & Branches"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}