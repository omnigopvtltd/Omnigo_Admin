import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionParticipants } from "@/hooks/useRiderSessions";

const STATUS_BADGE = {
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  abandoned: { label: "Abandoned", variant: "destructive" },
};

export function SessionParticipantsDialog({ open, onOpenChange, session }) {
  const { data, isLoading } = useSessionParticipants(session?._id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{session?.title} — Participants</DialogTitle>
          <DialogDescription>{session?.requiredOrders} orders required · ${session?.bonusAmount} bonus</DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
          ) : data?.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No one has joined this session yet.</p>
          ) : (
            data?.map((p) => {
              const badge = STATUS_BADGE[p.status];
              return (
                <div key={p._id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.riderId?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.ordersCompleted}/{p.requiredOrders} orders
                      {p.status === "abandoned" && p.abandonReason ? ` · ${p.abandonReason}` : ""}
                    </p>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}