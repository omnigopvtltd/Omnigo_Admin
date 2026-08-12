import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, ShieldCheck, DollarSign, Globe, Percent, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSettings } from "@/hooks/useSettings";

const extendedSettingsSchema = z.object({
  commissionRate: z.coerce.number().min(0).max(100),
  deliveryCharge: z.coerce.number().min(0),
  serviceArea: z.string().min(2),
  supportEmail: z.string().email(),
  salesTaxRate: z.coerce.number().min(0).max(100),
  isSurgePricingActive: z.boolean(),
  surgeMultiplier: z.coerce.number().min(1).max(3),
  maintenanceMode: z.boolean(),
  paymentGateways: z.object({
    codEnabled: z.boolean(),
    stripeEnabled: z.boolean(),
    stripePublicKey: z.string().optional(),
    easypaisaEnabled: z.boolean(),
    jazzcashEnabled: z.boolean(),
  }),
  localization: z.object({
    currencySymbol: z.string().min(1),
    defaultLanguage: z.string().min(2),
    timeZone: z.string().min(2),
  }),
  rolesConfig: z.array(
    z.object({
      roleName: z.string().min(2, "Role name required"),
      permissions: z.string().transform((val) => (typeof val === "string" ? val.split(",").map((p) => p.trim()) : val)),
    })
  ),
});

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const { settings, isLoading, updateSettings } = useSettings();

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(extendedSettingsSchema),
    defaultValues: {
      commissionRate: 15,
      deliveryCharge: 2.5,
      serviceArea: "Karachi",
      supportEmail: "Natiqnago7@gmail.com",
      salesTaxRate: 13,
      isSurgePricingActive: false,
      surgeMultiplier: 1.2,
      maintenanceMode: false,
      paymentGateways: { codEnabled: true, stripeEnabled: true, stripePublicKey: "", easypaisaEnabled: false, jazzcashEnabled: false },
      localization: { currencySymbol: "PKR", defaultLanguage: "en", timeZone: "Asia/Karachi" },
      rolesConfig: [{ roleName: "manager", permissions: "manage_orders, view_analytics" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "rolesConfig" });

  useEffect(() => {
    if (settings) {
      reset({
        ...settings,
        rolesConfig: settings.rolesConfig?.map((r) => ({
          roleName: r.roleName,
          permissions: Array.isArray(r.permissions) ? r.permissions.join(", ") : r.permissions,
        })) || [],
      });
    }
  }, [settings, reset]);

  async function onSubmit(values) {
    try {
      setSaved(false);
      await updateSettings(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="taxes">Taxes & Surge</TabsTrigger>
            <TabsTrigger value="gateways">Payments</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
            {/* <TabsTrigger value="roles">Roles & Access</TabsTrigger> */}
          </TabsList>

          {/* TAB 1: GENERAL */}
          <TabsContent value="general" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform General Settings</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Commission Rate (%)</label>
                  <Input type="number" step="0.1" {...register("commissionRate")} />
                </div>
                <div>
                  <label className="text-sm font-medium">Base Delivery Fee</label>
                  <Input type="number" step="0.1" {...register("deliveryCharge")} />
                </div>
                <div>
                  <label className="text-sm font-medium">Primary Service City</label>
                  <Input {...register("serviceArea")} />
                </div>
                <div>
                  <label className="text-sm font-medium">Support Contact Email</label>
                  <Input type="email" {...register("supportEmail")} />
                </div>
                {/* <div className="col-span-2 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Temporarily block orders for platform updates</p>
                  </div>
                  <Switch
                    checked={watch("maintenanceMode")}
                    onCheckedChange={(val) => setValue("maintenanceMode", val)}
                  />
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: TAXES & SURGE */}
          <TabsContent value="taxes" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Tax & Dynamic Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Provincial Sales Tax (%)</label>
                  <Input type="number" step="0.1" {...register("salesTaxRate")} />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="font-medium">Enable Surge Pricing</p>
                    <p className="text-xs text-muted-foreground">Apply dynamic fare multiplier during high demand</p>
                  </div>
                  <Switch
                    checked={watch("isSurgePricingActive")}
                    onCheckedChange={(val) => setValue("isSurgePricingActive", val)}
                  />
                </div>
                {watch("isSurgePricingActive") && (
                  <div>
                    <label className="text-sm font-medium">Surge Multiplier (x)</label>
                    <Input type="number" step="0.1" {...register("surgeMultiplier")} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: PAYMENT GATEWAYS */}
          <TabsContent value="gateways" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Cash on Delivery (COD)</span>
                  <Switch checked={watch("paymentGateways.codEnabled")} onCheckedChange={(v) => setValue("paymentGateways.codEnabled", v)} />
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span>Stripe Cards</span>
                  <Switch checked={watch("paymentGateways.stripeEnabled")} onCheckedChange={(v) => setValue("paymentGateways.stripeEnabled", v)} />
                </div>
                {watch("paymentGateways.stripeEnabled") && (
                  <Input placeholder="Stripe Publishable Key" {...register("paymentGateways.stripePublicKey")} />
                )}
                <div className="flex items-center justify-between border-t pt-2">
                  <span>Easypaisa Mobile Wallet</span>
                  <Switch checked={watch("paymentGateways.easypaisaEnabled")} onCheckedChange={(v) => setValue("paymentGateways.easypaisaEnabled", v)} />
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span>JazzCash Mobile Wallet</span>
                  <Switch checked={watch("paymentGateways.jazzcashEnabled")} onCheckedChange={(v) => setValue("paymentGateways.jazzcashEnabled", v)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: LOCALIZATION */}
          <TabsContent value="localization" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Regional Localization</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <Input {...register("localization.currencySymbol")} />
                </div>
                <div>
                  <label className="text-sm font-medium">Default Language</label>
                  <Input {...register("localization.defaultLanguage")} />
                </div>
                <div>
                  <label className="text-sm font-medium">TimeZone</label>
                  <Input {...register("localization.timeZone")} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: ROLES & PERMISSIONS */}
          {/* <TabsContent value="roles" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Role Access Control</CardTitle>
                  <CardDescription>Comma-separated permission strings for custom admin roles</CardDescription>
                </div>
                <Button type="button" size="sm" onClick={() => append({ roleName: "", permissions: "" })}>
                  <Plus className="h-4 w-4 mr-1" /> Add Role
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <Input placeholder="Role (e.g. manager)" {...register(`rolesConfig.${idx}.roleName`)} className="w-1/3" />
                    <Input placeholder="Permissions (e.g. manage_orders, manage_riders)" {...register(`rolesConfig.${idx}.permissions`)} className="w-2/3" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>

        {/* Global Save Controls */}
        <div className="flex items-center gap-3 border-t pt-5 mt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving Config..." : "Save All Changes"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Check className="h-4 w-4" /> Platform settings saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}