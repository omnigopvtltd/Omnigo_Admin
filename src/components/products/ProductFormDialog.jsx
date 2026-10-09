import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVendors } from "@/hooks/useVendors";
import { useCategories } from "@/hooks/useCategories";

// Pre-defined Enums based on mongoose schema
const BELONGS_TO_OPTIONS = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Home Chef", value: "home-chef" },
  { label: "Grocery Store", value: "grocery" },
  { label: "Pharmacy Store", value: "pharmacy" },
  { label: "Stationary Shop", value: "stationary" },
  { label: "Bakery", value: "bakery" },
  { label: "Coffee Shop & Cafe", value: "cafe" },
];

const TYPE_OPTIONS = [
  { label: "New Arrival", value: "new" },
  { label: "Popular Item", value: "popular" },
  { label: "Special Item", value: "special" },
  { label: "Signature Dish", value: "signature" },
  { label: "Featured Product", value: "featured" },
];

const schema = z
  .object({
    name: z.string().min(2, "Product name is required"),
    description: z.string().optional(),
    imageUrl: z
      .union([z.string().url("Enter a valid image URL"), z.literal("")])
      .optional(),
    imageFile: z.any().optional(),
    belongsTo: z.enum([
      "restaurant",
      "home-chef",
      "grocery",
      "pharmacy",
      "stationary",
      "bakery",
    ]),
    vendorId: z.string().min(1, "Select a vendor"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().optional(),

    price: z.coerce.number().min(0, "Price is required"),
    discountPrice: z
      .union([z.coerce.number().min(0), z.literal("")])
      .optional(),

    weight: z.string().optional(),
    quantity: z.coerce.number().default(0),

    // Serving as free text based on Schema (e.g. "Full", "Half", "1 Person")
    serving: z.string().default("full"),
    preparationTime: z.coerce.number().min(0).default(15),
    isVeg: z.boolean().default(false),
    isAvailable: z.boolean().default(true),
    status: z.enum(["active", "inactive"]).default("active"),
    type: z
      .enum(["popular", "special", "new", "signature", "featured"])
      .default("new"),

    tags: z.string().optional(),

    // Schema matching Variation Structure
    variations: z
      .array(
        z.object({
          title: z.string().min(1, "Variation title required (e.g. Size)"),
          options: z.array(
            z.object({
              name: z.string().min(1, "Option name required"),
              price: z.coerce.number().min(0).default(0),
            })
          ),
        })
      )
      .optional(),

    // Schema matching AddOns Structure
    addOns: z
      .array(
        z.object({
          name: z.string().min(1, "Add-on name required"),
          price: z.coerce.number().min(0).default(0),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.discountPrice !== "" &&
        data.discountPrice !== undefined &&
        Number(data.discountPrice) >= Number(data.price)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Discount price must be strictly less than regular price",
      path: ["discountPrice"],
    }
  );

function toFormValues(product) {
  if (!product) {
    return {
      name: "",
      description: "",
      imageUrl: "",
      imageFile: null,
      belongsTo: "restaurant",
      vendorId: "",
      category: "",
      subcategory: "",
      price: "",
      discountPrice: "",
      weight: "",
      quantity: 10,
      serving: "full",
      preparationTime: 15,
      isVeg: false,
      isAvailable: true,
      status: "active",
      type: "new",
      tags: "",
      variations: [],
      addOns: [],
    };
  }

  return {
    name: product.name ?? "",
    description: product.description ?? "",
    imageUrl: product.images?.[0] ?? "",
    imageFile: null,
    belongsTo: product.belongsTo ?? "restaurant",
    vendorId: product.vendorId?._id ?? product.vendorId ?? "",
    category: product.category ?? "",
    subcategory: product.subcategory ?? "",
    price: product.price ?? "",
    discountPrice: product.discountPrice ?? "",
    weight: product.weight ?? "",
    quantity: product.quantity ?? 0,
    serving: product.serving ?? "full",
    preparationTime: product.preparationTime ?? 15,
    isVeg: product.isVeg ?? false,
    isAvailable: product.isAvailable ?? true,
    status: product.status ?? "active",
    type: product.type ?? "new",
    tags: Array.isArray(product.tags)
      ? product.tags.map((t) => t.tagName || t).join(", ")
      : product.tags ?? "",
    variations: product.variations ?? [],
    addOns: product.addOns ?? [],
  };
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isSubmitting,
  currencySymbol = "Rs.",
}) {
  
// vendor fetch by business type
const [businessType, setBusinessType] = useState('grocery');

// Pass businessType query in useVendors
const { data: vendorData, isLoading, error } = useVendors({ 
  limit: 100, 
  // businessType 
});
  const { data: categoryData } = useCategories({ limit: 100 });

  const vendors = vendorData?.vendors ?? [];
  const categories = categoryData ?? [];
  console.log(categories, categoryData);


  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(product),
  });

  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({ control, name: "variations" });

  const {
    fields: addOnFields,
    append: appendAddOn,
    remove: removeAddOn,
  } = useFieldArray({ control, name: "addOns" });

  const isVeg = watch("isVeg");
  const isAvailable = watch("isAvailable");

  useEffect(() => {
    reset(toFormValues(product));
  }, [product, open, reset]);

  function submit(values) {
    const formData = new FormData();

    // 1. Image Payload
    if (values.imageFile && values.imageFile[0]) {
      console.log("Appending image file:", values.imageFile, values.imageFile[0]);
      formData.append("images", values.imageFile[0]);
    } else if (values.imageUrl) {
      formData.append("images", values.imageUrl);
    }

    // 2. Format Tags into Schema Format array [{ icon: "tag", tagName: "Bestseller" }]
    const formattedTags = values.tags
      ? values.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((tagName) => ({ icon: "Tag", tagName }))
      : [];

    // 3. Append Data for Controller
    formData.append("name", values.name);
    formData.append("description", values.description || "");
    formData.append("belongsTo", values.belongsTo);
    formData.append("vendorId", values.vendorId);
    formData.append("category", values.category);
    formData.append("subcategory", values.subcategory || "");
    formData.append("price", Number(values.price));
    formData.append(
      "discountPrice",
      values.discountPrice !== "" && values.discountPrice !== undefined
        ? Number(values.discountPrice)
        : ""
    );
    formData.append("weight", values.weight || "");
    formData.append("quantity", values.quantity ? Number(values.quantity) : 0);
    formData.append("serving", values.serving || "full");
    formData.append("preparationTime", Number(values.preparationTime));
    formData.append("isVeg", values.isVeg ?? false);
    formData.append("isAvailable", values.isAvailable ?? true);
    formData.append("status", values.status || "active");
    formData.append("type", values.type || "new");

    // JSON Stringified Array payload matching mongoose structure
    formData.append("tags", JSON.stringify(formattedTags));
    formData.append("variations", JSON.stringify(values.variations || []));
    formData.append("addOns", JSON.stringify(values.addOns || []));
console.log("FormData Entries:", Array.from(formData.entries())); // Debugging FormData contents
    onSubmit(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-w-3xl overflow-x-hidden p-6">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Catalog Item" : "Add New Catalog Item"}
          </DialogTitle>
          <DialogDescription>
            Manage item details, variation groups, pricing, and stock status.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submit)}
          className="max-h-[70vh] space-y-6 overflow-y-auto p-2 scrollbar-thin"
        >
          {/* Section 1: Business Belongings & Vendor */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block font-medium">Belongs To (Module)</Label>
              <select
                {...register("belongsTo")}
                setBusinessType={setBusinessType}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {BELONGS_TO_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-2 block font-medium">Vendor</Label>
              <select
                {...register("vendorId")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select Vendor...</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.businessName || v.name || "Unnamed Vendor"}
                  </option>
                ))}
              </select>
              {errors.vendorId && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.vendorId.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label className="mb-2 block font-medium">Product / Item Name</Label>
              <Input
                {...register("name")}
                placeholder="e.g. Zinger Burger / Panadol 500mg / Milk 1L"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label className="mb-2 block font-medium">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Item ingredients, notes or details..."
              />
            </div>
          </div>

          {/* Section 2: Media Image Tab */}
          <div>
            <Label className="mb-2 block font-medium text-sm">Cover Image</Label>
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="mb-3 grid w-full grid-cols-2">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="url">Direct Image URL</TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-0">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("imageFile")}
                  className="cursor-pointer"
                />
              </TabsContent>

              <TabsContent value="url" className="mt-0">
                <Input
                  type="text"
                  {...register("imageUrl")}
                  placeholder="https://example.com/product-image.jpg"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Section 3: Categories & Subcategories */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block font-medium">Category</Label>
              <select
                {...register("category")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name || c.categoryName}>
                    {c.name || c.categoryName}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2 block font-medium">
                Subcategory (Auto-created if new)
              </Label>
              <Input
                {...register("subcategory")}
                placeholder="e.g. Thin Crust, Cold Drinks"
              />
            </div>
          </div>

          {/* Section 4: Pricing & Quantity */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label className="mb-2 block font-medium">
                Price ({currencySymbol})
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2 block font-medium">
                Discount Price ({currencySymbol})
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("discountPrice")}
                placeholder="0.00"
              />
              {errors.discountPrice && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2 block font-medium">Stock / Quantity</Label>
              <Input type="number" {...register("quantity")} placeholder="0" />
            </div>
          </div>

          {/* Section 5: Serving, Prep Time, & Features */}
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-muted p-4 bg-muted/20 sm:grid-cols-3">
            <div>
              <Label className="mb-2 block font-medium">Serving Detail</Label>
              <Input
                {...register("serving")}
                placeholder="e.g. Full / 1 Person / Half Plate"
              />
            </div>

            <div>
              <Label className="mb-2 block font-medium">Weight / Unit</Label>
              <Input
                {...register("weight")}
                placeholder="e.g. 500g, 1 Kg, 250ml"
              />
            </div>

            <div>
              <Label className="mb-2 block font-medium">Prep Time (Mins)</Label>
              <Input
                type="number"
                {...register("preparationTime")}
                placeholder="15"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 sm:col-span-1">
              <Label>Is Vegetarian</Label>
              <Switch
                checked={isVeg}
                onCheckedChange={(v) => setValue("isVeg", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 sm:col-span-2">
              <Label>Available (In Stock)</Label>
              <Switch
                checked={isAvailable}
                onCheckedChange={(v) => setValue("isAvailable", v)}
              />
            </div>
          </div>

          {/* Section 6: Nested Mongoose Variations Builder */}
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-sm">
                Product Variations (e.g., Size, Flavours)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendVariation({
                    title: "",
                    options: [{ name: "", price: 0 }],
                  })
                }
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Variation Title
              </Button>
            </div>

            {variationFields.map((varField, varIdx) => (
              <div
                key={varField.id}
                className="rounded-md border bg-card p-3 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Input
                    {...register(`variations.${varIdx}.title`)}
                    placeholder="Variation Group Title (e.g. Size, Crust Type)"
                    className="font-medium"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariation(varIdx)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sub Options for this Variation Group */}
                <VariationOptionsGroup
                  control={control}
                  register={register}
                  varIdx={varIdx}
                  currencySymbol={currencySymbol}
                />
              </div>
            ))}
          </div>

          {/* Section 7: Add-ons & Extras */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-sm">
                Add-ons & Extra Toppings
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendAddOn({ name: "", price: 0 })}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Extra
              </Button>
            </div>

            {addOnFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...register(`addOns.${index}.name`)}
                  placeholder="Extra Item Name (e.g. Extra Sauce, Extra Cheese)"
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  {...register(`addOns.${index}.price`)}
                  placeholder={`Price (${currencySymbol})`}
                  className="w-32"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAddOn(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Section 8: Product Tagging, Status & Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label className="mb-2 block font-medium">Special Type</Label>
              <select
                {...register("type")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-2 block font-medium">Status</Label>
              <select
                {...register("status")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <Label className="mb-2 block font-medium">Tags (Comma Separated)</Label>
              <Input
                {...register("tags")}
                placeholder="Bestseller, Spicy, Vegan"
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
                ? "Saving Catalog..."
                : product
                ? "Save Changes"
                : "Create Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Sub-component to manage nested Variation Options safely
function VariationOptionsGroup({ control, register, varIdx, currencySymbol }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variations.${varIdx}.options`,
  });

  return (
    <div className="pl-4 space-y-2 border-l-2 border-muted">
      {fields.map((optField, optIdx) => (
        <div key={optField.id} className="flex items-center gap-2">
          <Input
            {...register(`variations.${varIdx}.options.${optIdx}.name`)}
            placeholder="Option Name (e.g. Small / Large / Chocolate)"
            className="flex-1 h-8 text-xs"
          />
          <Input
            type="number"
            step="0.01"
            {...register(`variations.${varIdx}.options.${optIdx}.price`)}
            placeholder={`Extra (${currencySymbol})`}
            className="w-28 h-8 text-xs"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(optIdx)}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => append({ name: "", price: 0 })}
        className="h-7 text-xs mt-1"
      >
        <Plus className="mr-1 h-3 w-3" /> Add Option
      </Button>
    </div>
  );
}