import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRestaurants } from "@/hooks/useRestaurants";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    image: z
      .union([z.string().url("Enter a valid image URL"), z.literal("")])
      .optional(),
    restaurantId: z.string().min(1, "Select a restaurant"),
    category: z.string().min(1, "Category is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    discountPrice: z
      .union([z.coerce.number().min(0), z.literal("")])
      .optional(),
    preparationTime: z.coerce.number().min(0),
    tags: z.string().optional(),
    isVeg: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    status: z.enum(["active", "inactive"]),
  })
  .refine(
    (data) =>
      !data.discountPrice || Number(data.discountPrice) < Number(data.price),
    {
      message: "Discount price must be less than the regular price",
      path: ["discountPrice"],
    },
  );

const COMMON_CATEGORIES = [
  "Fast Food",
  "Pizza",
  "Chinese",
  "BBQ",
  "Desi",
  "Desserts",
  "Healthy",
  "Japanese",
  "Beverages",
];

function toFormValues(product) {
  if (!product) {
    return {
      name: "",
      description: "",
      image: "",
      restaurantId: "",
      category: "",
      price: "",
      discountPrice: "",
      preparationTime: 15,
      tags: "",
      isVeg: false,
      isAvailable: true,
      status: "active",
    };
  }
  return {
    name: product.name ?? "",
    description: product.description ?? "",
    image: product.images?.[0] ?? "",
    restaurantId: product.restaurantId?._id ?? product.restaurantId ?? "",
    category: product.category ?? "",
    price: product.price ?? "",
    discountPrice: product.discountPrice ?? "",
    preparationTime: product.preparationTime ?? 15,
    tags: (product.tags ?? []).join(", "),
    isVeg: product.isVeg ?? false,
    isAvailable: product.isAvailable ?? true,
    status: product.status ?? "active",
  };
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isSubmitting,
}) {
  const { data: restaurantData } = useRestaurants({ limit: 100 });
  const restaurants = restaurantData?.restaurants ?? [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(product),
  });

  useEffect(() => {
    reset(toFormValues(product));
  }, [product, open, reset]);

  const isVeg = watch("isVeg");
  const isAvailable = watch("isAvailable");

  function submit(values) {
    onSubmit({
      name: values.name,
      description: values.description,
      images: values.image ? [values.image] : [],
      restaurantId: values.restaurantId || "6a57323f8cf2d87bf78f3340",
      category: values.category,
      price: Number(values.price),
      discountPrice:
        values.discountPrice === "" ? null : Number(values.discountPrice),
      preparationTime: Number(values.preparationTime),
      tags: values.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isVeg: values.isVeg,
      isAvailable: values.isAvailable,
      status: values.status,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            Products must belong to a restaurant — pick one below.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submit)}
          className="max-h-[65vh] space-y-5 overflow-y-auto pr-1 scrollbar-thin"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Product Name</Label>
              <Input
                {...register("name")}
                placeholder="Chicken Zinger Burger"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Short description shown on the item page"
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Image URL</Label>
              <Input {...register("image")} placeholder="https://…" />
              {errors.image && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* <div>
              <Label>Restaurant</Label>
              <Select {...register("restaurantId")}>
                <option value="">Select a restaurant…</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </Select>
              {errors.restaurantId && <p className="mt-1 text-xs text-destructive">{errors.restaurantId.message}</p>}
            </div> */}
            <div>
              <Label>Restaurant</Label>

              {/* 👇 Capital 'Select' ko lowercase 'select' mein badla */}
              <select
                {...register("restaurantId")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a restaurant…</option>
                {/* 👇 Safely map tabhi chalega jab restaurants exist karega */}
                {restaurants &&
                  restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
              </select>

              {errors.restaurantId && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.restaurantId.message}
                </p>
              )}
            </div>

            <div>
              <Label>Category</Label>
              <Input
                {...register("category")}
                list="category-options"
                placeholder="Pizza"
              />
              <datalist id="category-options">
                {COMMON_CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.category && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" {...register("price")} />
              {errors.price && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <Label>Discount Price ($, optional)</Label>
              <Input type="number" step="0.01" {...register("discountPrice")} />
              {errors.discountPrice && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>

            <div>
              <Label>Prep Time (min)</Label>
              <Input type="number" {...register("preparationTime")} />
            </div>
            <div>
              <Label>Status</Label>
              <select {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Label>Tags (comma separated)</Label>
              <Input
                {...register("tags")}
                placeholder="Bestseller, New, Spicy"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <Label className="mb-0">Vegetarian</Label>
              <Switch
                checked={isVeg}
                onCheckedChange={(v) => setValue("isVeg", v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <Label className="mb-0">Available</Label>
              <Switch
                checked={isAvailable}
                onCheckedChange={(v) => setValue("isAvailable", v)}
              />
            </div>
          </div>

          <DialogFooter>
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
                : product
                  ? "Save Changes"
                  : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
