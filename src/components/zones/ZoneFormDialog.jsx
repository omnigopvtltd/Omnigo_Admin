import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";

const ZoneFormDialog = ({ open, onClose, onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    country: "Pakistan",
    city: "",
    zone: "",
    areas: [],
    isActive: true,
  });

  const [areaInput, setAreaInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        country: initialData.country || "Pakistan",
        city: initialData.city || "",
        zone: initialData.zone || "",
        areas: initialData.areas || [],
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData({
        country: "Pakistan",
        city: "",
        zone: "",
        areas: [],
        isActive: true,
      });
    }
    setAreaInput("");
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddArea = () => {
    const trimmed = areaInput.trim();
    if (trimmed && !formData.areas.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        areas: [...prev.areas, trimmed],
      }));
      setAreaInput("");
    }
  };

  const handleRemoveArea = (areaToDelete) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.filter((a) => a !== areaToDelete),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Zone" : "Add New Zone"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Country */}
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Chakwal, Karachi"
              required
            />
          </div>

          {/* Zone */}
          <div className="space-y-1.5">
            <Label htmlFor="zone">Zone Name / ID</Label>
            <Input
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              placeholder="e.g. zone 1"
              required
            />
          </div>

          {/* Sub-Areas / Tags Input */}
          <div className="space-y-2">
            <Label>Sub-Areas</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add area (e.g. Area 1)"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddArea();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddArea}>
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>

            {/* Areas Chip Box */}
            <div className="flex flex-wrap gap-1.5 min-h-[48px] p-2 bg-muted/50 rounded-md border border-input">
              {formData.areas.map((area, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 text-xs py-1 px-2.5"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(area)}
                    className="text-muted-foreground hover:text-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {formData.areas.length === 0 && (
                <span className="text-xs text-muted-foreground self-center">
                  No areas added yet.
                </span>
              )}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="isActive" className="cursor-pointer">
              Active Status
            </Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Zone" : "Create Zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ZoneFormDialog;