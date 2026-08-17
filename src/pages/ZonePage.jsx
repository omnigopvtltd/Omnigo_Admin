import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus, Edit, Trash2, Loader2 } from "lucide-react";

import { useZones } from "@/hooks/useZone";
import ZoneFormDialog from "@/components/zones/ZoneFormDialog";

const ZonePage = () => {
  const {
    zones,
    isLoading,
    createZone,
    isCreating,
    updateZone,
    isUpdating,
    deleteZone,
    toggleStatus,
  } = useZones();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const handleOpenAdd = () => {
    setSelectedZone(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (zone) => {
    setSelectedZone(zone);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedZone(null);
    setDialogOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedZone) {
        await updateZone({ id: selectedZone._id, ...formData });
      } else {
        await createZone(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save zone:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      await deleteZone(id);
    }
  };

  const handleToggleActive = async (zone) => {
    await toggleStatus({ id: zone._id, isActive: !zone.isActive });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <MapPin className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Zone Management</h1> */}
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add New Zone
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Areas Covered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : zones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No zones found.
                  </TableCell>
                </TableRow>
              ) : (
                zones.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className="font-medium">{row.country}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{row.zone}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {row.areas?.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={row.isActive}
                        onCheckedChange={() => handleToggleActive(row)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(row)}
                          title="Edit Zone"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(row._id)}
                          title="Delete Zone"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Zone Form Dialog */}
      <ZoneFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialData={selectedZone}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default ZonePage;