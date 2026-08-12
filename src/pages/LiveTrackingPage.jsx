import { useState } from "react";
import { Bike, Car, Phone, Clock3, Navigation, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveMapView } from "@/components/tracking/LiveMapView";
import { useLiveRiders, useActiveDeliveries } from "@/hooks/useTracking";

export default function LiveTrackingPage() {
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const { data: riders, isLoading: ridersLoading } = useLiveRiders();
  const { data: deliveries, isLoading: deliveriesLoading } = useActiveDeliveries();

  const selectedRider = riders?.find((r) => r.riderId === selectedRiderId);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-xs text-yellow-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          This map is a stylized simulation — real street tiles need a Maps provider (Google Maps or Mapbox)
          and an API key, which isn't available in this environment. Positions, rider status, and the
          socket wiring underneath are fully functional; swap <code className="rounded bg-black/5 px-1">LiveMapView</code> for
          a real map component (e.g. <code className="rounded bg-black/5 px-1">react-leaflet</code>) once you have a key —
          the data layer won't need to change.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader>
            <CardTitle>Live Rider Map</CardTitle>
            <CardDescription>{riders?.length ?? 0} riders online right now</CardDescription>
          </CardHeader>
          <CardContent className="h-[420px] p-5 pt-0">
            {ridersLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <LiveMapView riders={riders ?? []} selectedRiderId={selectedRiderId} onSelectRider={setSelectedRiderId} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Riders</CardTitle>
            <CardDescription>Tap a rider to focus them on the map</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[420px] space-y-1.5 overflow-y-auto scrollbar-thin">
            {ridersLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
              : riders?.map((rider) => {
                  const Icon = rider.vehicleType === "car" ? Car : Bike;
                  const isSelected = rider.riderId === selectedRiderId;
                  return (
                    <button
                      key={rider.riderId}
                      onClick={() => setSelectedRiderId(rider.riderId)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        isSelected ? "border-coral bg-coral/5" : "border-border hover:bg-secondary/60"
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{rider.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {rider.activeOrder ? `On delivery · ${rider.activeOrder.orderNumber}` : "Idle"}
                        </p>
                      </div>
                      <Badge variant={rider.activeOrder ? "default" : "secondary"}>
                        {rider.activeOrder ? "Busy" : "Free"}
                      </Badge>
                    </button>
                  );
                })}
          </CardContent>
        </Card>
      </div>

      {selectedRider?.activeOrder && (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-6 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/10 text-coral">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Order</p>
                <p className="text-sm font-semibold text-foreground">{selectedRider.activeOrder.orderNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Customer</p>
              <p className="text-sm font-medium text-foreground">{selectedRider.activeOrder.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Restaurant</p>
              <p className="text-sm font-medium text-foreground">{selectedRider.activeOrder.restaurantName}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{selectedRider.activeOrder.etaMinutes} min ETA</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" /> {selectedRider.phone}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
          <CardDescription>Every order currently on the way</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {deliveriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
          ) : deliveries?.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No active deliveries right now.</p>
          ) : (
            deliveries?.map((d) => (
              <div key={d.orderId} className="flex items-center justify-between border-b border-border py-3 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{d.orderNumber} · {d.customerName}</p>
                  <p className="text-xs text-muted-foreground">{d.restaurantName} → rider {d.riderName}</p>
                </div>
                <Badge variant="default">{d.etaMinutes} min</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}