import { Bike, Car, Store, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function LiveMapView({ riders, selectedRiderId, onSelectRider }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-navy-darker">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-40">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke="#34406E" strokeWidth="0.3" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke="#34406E" strokeWidth="0.3" />
        ))}
      </svg>

      {riders.map((rider) => {
        const isSelected = rider.riderId === selectedRiderId;
        const Icon = rider.vehicleType === "car" ? Car : Bike;

        return (
          <div key={rider.riderId}>
            {rider.activeOrder && (
              <>
                <div
                  className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold ring-2 ring-white/60"
                  style={{ left: `${rider.activeOrder.destinationX}%`, top: `${rider.activeOrder.destinationY}%` }}
                  title={`Destination: ${rider.activeOrder.customerName}`}
                />
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line
                    x1={rider.x} y1={rider.y}
                    x2={rider.activeOrder.destinationX} y2={rider.activeOrder.destinationY}
                    stroke="#F96167" strokeWidth="0.4" strokeDasharray="1.5,1.2" opacity="0.7"
                  />
                </svg>
              </>
            )}

            <button
              onClick={() => onSelectRider(rider.riderId)}
              className={cn(
                "absolute flex h-7 w-7 bg-na -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-transform hover:scale-110",
                isSelected ? "z-10 scale-110 border-white bg-navy/50" : "border-white/70 bg-navy"
              )}
              style={{ left: `${rider.x}%`, top: `${rider.y}%` }}
              title={rider.name}
            >
              <Icon className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        );
      })}

      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-black/30 px-3 py-1.5 text-[11px] text-white/80 backdrop-blur">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-navy ring-1 ring-white/70" /> Rider</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" /> Destination</span>
      </div>
    </div>
  );
}