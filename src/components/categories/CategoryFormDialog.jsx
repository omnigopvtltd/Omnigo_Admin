import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  "none",
  "popular",
  "signature",
  "special",
  "hot",
  "best",
  "active",
  "inactive",
];

// Zod schema matching Mongoose model requirements
const subCategorySchema = z.object({
  name: z.string().min(1, "Sub-category name is required"),
  slug: z.string().optional(),
  image: z.string().min(1, "Sub-category image URL is required"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  status: z.string().default("none"),
});

const schema = z.object({
  categoryName: z.string().min(2, "Category name is required"),
  categorySlug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  status: z.string().default("none"),
  isFeatured: z.boolean().default(false),
  subCategories: z.array(subCategorySchema).optional(),
});

function toFormValues(category) {
  if (!category) {
    return {
      categoryName: "",
      categorySlug: "",
      description: "",
      image: "",
      icon: "",
      sortOrder: 0,
      status: "active",
      isFeatured: false,
      subCategories: [],
    };
  }

  return {
    categoryName: category.categoryName ?? category.name ?? "",
    categorySlug: category.categorySlug ?? category.slug ?? "",
    description: category.description ?? "",
    image: category.image ?? "",
    icon: category.icon ?? "",
    sortOrder: category.sortOrder ?? 0,
    status: category.status ?? "active",
    isFeatured: category.isFeatured ?? false,
    subCategories: (category.subCategories ?? []).map((sub) => ({
      name: typeof sub === "string" ? sub : sub.name ?? "",
      slug: sub.slug ?? "",
      image: sub.image ?? "",
      description: sub.description ?? "",
      sortOrder: sub.sortOrder ?? 0,
      status: sub.status ?? "none",
    })),
  };
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(category),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategories",
  });

  useEffect(() => {
    reset(toFormValues(category));
  }, [category, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            Configure main category details and its associated sub-categories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 space-y-6 py-2">
            
            {/* --- Main Category Details --- */}
            <div className="space-y-4 border-b pb-6">
              <h4 className="text-sm font-semibold text-foreground">
                Main Category Info
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category Name */}
                <div>
                  <Label>Category Name *</Label>
                  <Input
                    {...register("categoryName")}
                    className="mt-1.5"
                    placeholder="Fast Food"
                  />
                  {errors.categoryName && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.categoryName.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <Label>Status</Label>

                  <select
                    {...register("status")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Main Image */}
                <div className="sm:col-span-2">
                  <Label>Image URL</Label>
                  <Input
                    {...register("image")}
                    className="mt-1.5"
                    placeholder="https://images.unsplash.com/…"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    {...register("description")}
                    className="mt-1.5"
                    placeholder="Restaurant Items..."
                  />
                </div>

                {/* Is Featured */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    {...register("isFeatured")}
                    className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Featured Category
                  </Label>
                </div>
              </div>
            </div>

            {/* --- Dynamic Sub-Categories Section --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Sub-Categories
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Add specific sub-items attached to this category.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      name: "",
                      slug: "",
                      image: "",
                      description: "",
                      sortOrder: 0,
                      status: "none",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Sub-Category
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="border border-dashed rounded-lg p-6 text-center text-xs text-muted-foreground">
                  No sub-categories added yet. Click &quot;Add Sub-Category&quot; above to create one.
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-lg bg-slate-50/50 dark:bg-slate-900/50 relative space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5" /> Sub-Category #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Sub Name */}
                        <div>
                          <Label className="text-xs">Sub-Category Name *</Label>
                          <Input
                            {...register(`subCategories.${index}.name`)}
                            placeholder="Burger"
                            className="mt-1 h-9 text-sm"
                          />
                          {errors.subCategories?.[index]?.name && (
                            <p className="text-[10px] text-destructive mt-0.5">
                              {errors.subCategories[index].name.message}
                            </p>
                          )}
                        </div>

                        {/* Sub Image URL (Required by backend) */}
                        <div>
                          <Label className="text-xs">Image URL *</Label>
                          <Input
                            {...register(`subCategories.${index}.image`)}
                            placeholder="https://…"
                            className="mt-1 h-9 text-sm"
                          />
                          {errors.subCategories?.[index]?.image && (
                            <p className="text-[10px] text-destructive mt-0.5">
                              {errors.subCategories[index].image.message}
                            </p>
                          )}
                        </div>

                        {/* Sub Description */}
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Description</Label>
                          <Input
                            {...register(`subCategories.${index}.description`)}
                            placeholder="Brief details…"
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-navy">
              {isSubmitting
                ? "Saving…"
                : category
                ? "Save Changes"
                : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}