import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAllNotificationsRead } from "@/api/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Package, AlertCircle, DollarSign, User } from "lucide-react";

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const getIcon = (type) => {
    switch (type) {
      case "order": return <Package className="h-5 w-5 text-blue-500" />;
      case "rider": return <User className="h-5 w-5 text-emerald-500" />;
      case "payout": return <DollarSign className="h-5 w-5 text-amber-500" />;
      default: return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Audit logs and real-time alerts across your platform.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markReadMutation.mutate()}
          disabled={!data?.unreadCount}
        >
          <CheckCheck className="h-4 w-4 mr-2" /> Mark all as read
        </Button>
      </div>

      <Card>
        <CardContent className="divide-y divide-border p-0">
          {isLoading ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Loading alerts...</p>
          ) : data?.notifications?.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No notifications found.</p>
          ) : (
            data?.notifications?.map((item) => (
              <div
                key={item._id}
                className={`flex items-start gap-4 p-4 transition ${
                  !item.isRead ? "bg-muted/40" : ""
                }`}
              >
                <div className="mt-0.5 rounded-full p-2 bg-background border">{getIcon(item.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}