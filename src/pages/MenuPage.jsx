import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Save, 
  Utensils, 
  Store, 
  Eye, 
  Edit3, 
  FolderPlus,
  CheckCircle2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../api/axiosClient"; // Your custom axios instance

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuPage() {
  const queryClient = useQueryClient();

  // State Management
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // ==========================================
  // 1. API Queries
  // ==========================================

  // Fetch all restaurants for dropdown selector
  const { data: restaurants = [] } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await axiosClient.get("/restaurants");
      return res.data?.data || res.data || [];
    },
  });

  // Set default restaurant when list loads
  useEffect(() => {
    if (restaurants.length > 0 && !selectedRestaurantId) {
      setSelectedRestaurantId(restaurants[0]._id);
    }
  }, [restaurants, selectedRestaurantId]);

  // Fetch current menu for selected restaurant
  const { data: menuData, isLoading: isMenuLoading } = useQuery({
    queryKey: ["menu", selectedRestaurantId],
    queryFn: async () => {
      if (!selectedRestaurantId) return null;
      const res = await axiosClient.get(`/restaurants/menu?restaurantId=${selectedRestaurantId}`);
      return res.data;
    },
    enabled: !!selectedRestaurantId,
  });

  // Fetch all global categories from backend
  const { data: globalCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosClient.get("/categories");
      return res.data?.data || res.data || [];
    },
  });

  // Fetch all catalog products for item selection
  const { data: products = [] } = useQuery({
    queryKey: ["products", selectedRestaurantId],
    queryFn: async () => {
      if (!selectedRestaurantId) return [];
      const res = await axiosClient.get(`/products?restaurantId=${selectedRestaurantId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedRestaurantId,
  });

  // Sync menu state when fetching menu data
  useEffect(() => {
    if (menuData?.categories) {
      const formatted = menuData.categories.map((cat) => ({
        _id: cat._id,
        categoryName: cat.categoryName,
        products: (cat.products || []).map((p) => (typeof p === "object" ? p._id : p)),
      }));
      setCategories(formatted);
    } else {
      setCategories([]);
    }
  }, [menuData]);

  // ==========================================
  // 2. API Mutations
  // ==========================================

  const saveMenuMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/restaurants/menu", payload);
      return res.data;
    },
    onSuccess: () => {
      alert("Menu saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["menu", selectedRestaurantId] });
      setIsEditing(false);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to save menu");
    },
  });

  // ==========================================
  // 3. Category & Product Handlers
  // ==========================================

  // Add category section (either from dropdown or custom text)
  const handleAddCategory = (name) => {
    const categoryName = name.trim();
    if (!categoryName) return;

    // Check if category already added
    if (categories.some((c) => c.categoryName.toLowerCase() === categoryName.toLowerCase())) {
      alert("Category already exists in menu!");
      return;
    }

    setCategories((prev) => [...prev, { categoryName, products: [] }]);
    setNewCategoryInput("");
  };

  // Remove category section
  const handleRemoveCategory = (index) => {
    setCategories((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Toggle product in a category
  const handleToggleProduct = (categoryIndex, productId) => {
    setCategories((prev) =>
      prev.map((cat, idx) => {
        if (idx !== categoryIndex) return cat;
        const exists = cat.products.includes(productId);
        const updatedProducts = exists
          ? cat.products.filter((id) => id !== productId)
          : [...cat.products, productId];
        return { ...cat, products: updatedProducts };
      })
    );
  };

  // Save changes
  const handleSaveMenu = () => {
    if (!selectedRestaurantId) {
      alert("Please select a restaurant first");
      return;
    }

    const payload = {
      belongsTo: "Restaurant",
      restaurantId: selectedRestaurantId,
      categories: categories.map((c) => ({
        categoryName: c.categoryName,
        products: c.products,
      })),
    };

    saveMenuMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Control Bar: Restaurant Selector & View/Edit Switcher */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Restaurant Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Store className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-[240px]">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Select Restaurant
              </label>
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="w-full p-2 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-primary"
              >
                {restaurants.map((rest) => (
                  <option key={rest._id} value={rest._id}>
                    {rest.name || rest.title || rest._id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4 mr-2" /> Preview Menu
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" /> Edit Menu Configuration
                </>
              )}
            </Button>

            {isEditing && (
              <Button onClick={handleSaveMenu} disabled={saveMenuMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveMenuMutation.isPending ? "Saving..." : "Save Menu"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* VIEW MODE: Mobile App Layout Preview                       */}
      {/* ========================================================= */}
      {!isEditing ? (
        <div className="space-y-6">
          <h2 className="text-lg font-bold">Active Live Menu</h2>
          {isMenuLoading ? (
            <p className="text-sm text-muted-foreground">Loading menu structure...</p>
          ) : !menuData?.categories || menuData.categories.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No menu configured for this restaurant yet.</p>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Menu Now
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuData.categories.map((cat) => (
                <Card key={cat._id} className="border shadow-sm">
                  <CardHeader className="bg-muted/30 py-3">
                    <CardTitle className="text-base flex justify-between items-center">
                      <span>{cat.categoryName}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {cat.products?.length || 0} items
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {cat.products?.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No products in this category</p>
                    ) : (
                      cat.products?.map((prod) => (
                        <div key={prod._id} className="flex items-center gap-3 p-2 rounded-md bg-muted/20">
                          <img
                            src={prod.images?.[0] || "/placeholder-food.png"}
                            alt={prod.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="text-xs font-semibold">{prod.name}</p>
                            <p className="text-xs text-muted-foreground">Rs. {prod.price}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================= */
        /* EDIT / CREATE MODE: Form & Category Builder               */
        /* ========================================================= */
        <div className="space-y-6">
          {/* Add Category Bar */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Add Category Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Option A: Pick from Global Fetched Categories */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Select Pre-defined Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {globalCategories.map((cat) => {
                    const catName = typeof cat === "string" ? cat : cat.name || cat.categoryName;
                    return (
                      <Button
                        key={catName}
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddCategory(catName)}
                      >
                        <FolderPlus className="h-3 w-3 mr-1" /> {catName}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Option B: Add Custom New Category */}
              <div className="flex gap-3 max-w-md pt-2 border-t">
                <Input
                  placeholder="Or enter new custom category..."
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                />
                <Button onClick={() => handleAddCategory(newCategoryInput)} variant="secondary">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category List & Product Selectors */}
          <div className="space-y-6">
            {categories.map((category, catIdx) => (
              <Card key={catIdx} className="border">
                <CardHeader className="bg-muted/30 py-3 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base font-semibold">
                      {category.categoryName}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({category.products.length} selected)
                    </span>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleRemoveCategory(catIdx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>

                <CardContent className="pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                    Check products to assign to "{category.categoryName}":
                  </p>

                  {products.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      No products found for this restaurant. Add products first.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {products.map((product) => {
                        const isSelected = category.products.includes(product._id);
                        return (
                          <div
                            key={product._id}
                            onClick={() => handleToggleProduct(catIdx, product._id)}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images?.[0] || "/placeholder-food.png"}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover bg-muted"
                              />
                              <div>
                                <p className="text-xs font-semibold">{product.name}</p>
                                <p className="text-xs text-muted-foreground">Rs. {product.price}</p>
                              </div>
                            </div>

                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-4 w-4 rounded border-gray-300 text-primary"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}