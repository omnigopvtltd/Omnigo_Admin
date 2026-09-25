import { useEffect, useState } from "react";
// Import your logged-in admin user state/context
// import { useAuth } from "./context/AuthContext"; 
import { useSocket } from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Ban,
  CheckCircle2,
  Bike,
  Car,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Users,
  Gift,
  DollarSign, 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RiderFormDialog } from "@/components/riders/RiderFormDialog";
import { RiderDetailDialog } from "@/components/riders/RiderDetailDialog";
import { SessionFormDialog } from "@/components/riders/SessionFormDialog";
import { SessionParticipantsDialog } from "@/components/riders/SessionParticipantsDialog";
import { BikeInstallmentDeductionDialog } from "@/components/riders/BikeInstallmentDeductionDialog";
import { useDeductBikeInstallment } from "@/hooks/useRiders";
import {
  useRiders,
  useCreateRider,
  useUpdateRider,
  useUpdateRiderBlockStatus,
  useDeleteRider,
} from "@/hooks/useRiders";
import {
  useRiderSessions,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
} from "@/hooks/useRiderSessions";


const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const VERIFICATION_ICON = {
  not_submitted: { icon: ShieldAlert, className: "text-muted-foreground" },
  pending: { icon: ShieldAlert, className: "text-warning" },
  verified: { icon: ShieldCheck, className: "text-success" },
  rejected: { icon: ShieldAlert, className: "text-destructive" },
};

function VerificationDot({ status, label }) {
  const meta = VERIFICATION_ICON[status] ?? VERIFICATION_ICON.not_submitted;
  const Icon = meta.icon;
  return (
    <span
      className={`flex items-center gap-1 text-xs ${meta.className}`}
      title={`${label}: ${status.replace("_", " ")}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

function RidersTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();
  // Pass current admin ID if available, e.g., adminUser?._id
  const { status, connect, socket } = useSocket();

  const { data, isLoading, isFetching } = useRiders({ search, page, limit: 8 });
  const riders = data?.riders ?? [];

  // Establish single socket connection & listen for user online/offline status updates
  useEffect(() => {
    connect();

    if (!socket) return;

    // Listen for live user online/offline status broadcasts from backend
    // const handleStatusChange = ({ userId, isOnline }) => {
    //   // Invalidate React Query riders cache to reflect live status badges seamlessly
    //   queryClient.invalidateQueries({ queryKey: ["riders"] });
    // };

    const handleStatusChange = ({ userId, isOnline }) => {
  // Update cache locally instead of re-fetching from the server
  queryClient.setQueryData(["riders"], (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      riders: oldData.riders.map((rider) =>
        rider._id === userId
          ? {
              ...rider,
              riderProfile: {
                ...rider.riderProfile,
                isOnline: isOnline,
              },
            }
          : rider
      ),
    };
  });
};

    socket.on("userStatusChanged", handleStatusChange);

    return () => {
      socket.off("userStatusChanged", handleStatusChange);
    };
  }, [connect, socket, queryClient]);

  const createMutation = useCreateRider();
  const updateMutation = useUpdateRider();
  const blockMutation = useUpdateRiderBlockStatus();
  const deleteMutation = useDeleteRider();

  function handleSubmit(payload) {
    if (editing) {
      updateMutation.mutate(
        { id: editing._id, payload },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search riders…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button
          className="bg-navy"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Rider
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : riders.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No riders found.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Rider</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody
                  className={isFetching ? "opacity-60 transition-opacity" : ""}
                >
                  {riders.map((r) => {
                    const VehicleIcon =
                      r.riderProfile?.vehicleType === "car" ? Car : Bike;
                    return (
                      <TableRow key={r._id}>
                        <TableCell>
                          <p className="font-medium text-foreground">
                            {r.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.phone}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm">
                            <VehicleIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            {r.riderProfile?.vehicleModel ||
                              r.riderProfile?.vehicleType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <VerificationDot
                              status={
                                r.riderProfile?.cnicVerification?.status ??
                                "not_submitted"
                              }
                              label="CNIC"
                            />
                            <VerificationDot
                              status={
                                r.riderProfile?.faceVerification?.status ??
                                "not_submitted"
                              }
                              label="Face"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {CURRENCY.format(r.wallet?.balance ?? 0)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              r.isBlocked
                                ? "destructive"
                                : r.riderProfile?.isOnline || r.isOnline
                                  ? "success"
                                  : "secondary"
                            }
                          >
                            {r.isBlocked
                              ? "Blocked"
                              : r.riderProfile?.isOnline || r.isOnline
                                ? "Online"
                                : "Offline"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View"
                              onClick={() => setViewing(r)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit"
                              onClick={() => {
                                setEditing(r);
                                setFormOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {r.isBlocked ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Unblock"
                                onClick={() =>
                                  blockMutation.mutate({
                                    id: r._id,
                                    isBlocked: false,
                                  })
                                }
                              >
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Block"
                                onClick={() =>
                                  blockMutation.mutate({
                                    id: r._id,
                                    isBlocked: true,
                                  })
                                }
                              >
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              onClick={() => setDeleteTarget(r)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">
                  Page {data?.page ?? 1} of {data?.totalPages ?? 1} ·{" "}
                  {data?.total ?? 0} riders
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= (data?.totalPages ?? 1)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <RiderFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rider={editing}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <RiderDetailDialog
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        rider={viewing}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This removes the rider's account permanently. This can't be undone."
        onConfirm={() =>
          deleteMutation.mutate(deleteTarget._id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function VerificationQueueTab() {
  const [viewing, setViewing] = useState(null);
  const { data, isLoading } = useRiders({ limit: 50 });
  const pending = (data?.riders ?? []).filter(
    (r) =>
      r.riderProfile?.cnicVerification?.status !== "verified" ||
      r.riderProfile?.faceVerification?.status === "pending",
  );

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No pending verifications right now.
          </CardContent>
        </Card>
      ) : (
        pending.map((r) => (
          <Card key={r._id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.phone}</p>
              </div>
              <div className="flex gap-3">
                <VerificationDot
                  status={
                    r.riderProfile?.cnicVerification?.status ?? "not_submitted"
                  }
                  label="CNIC"
                />
                <VerificationDot
                  status={
                    r.riderProfile?.faceVerification?.status ?? "not_submitted"
                  }
                  label="Face"
                />
              </div>
              <Button size="sm" onClick={() => setViewing(r)}>
                Review
              </Button>
            </CardContent>
          </Card>
        ))
      )}
      <RiderDetailDialog
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        rider={viewing}
      />
    </div>
  );
}

function SessionsTab() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewingParticipants, setViewingParticipants] = useState(null);

  const { data, isLoading } = useRiderSessions({ limit: 20 });
  const sessions = data?.sessions ?? [];

  const createMutation = useCreateSession();
  const updateMutation = useUpdateSession();
  const deleteMutation = useDeleteSession();

  function handleSubmit(payload) {
    if (editing) {
      updateMutation.mutate(
        { id: editing._id, payload },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Session
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No bonus sessions yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sessions.map((s) => (
            <Card key={s._id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral/10 text-coral">
                    <Gift className="h-5 w-5" />
                  </div>
                  <Badge variant={s.isActive ? "success" : "secondary"}>
                    {s.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mt-3 font-display text-base font-semibold text-foreground">
                  {s.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {s.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{s.requiredOrders} orders</span>
                  <span className="font-medium text-success">
                    {CURRENCY.format(s.bonusAmount)} bonus
                  </span>
                  {s.timeLimitHours && <span>{s.timeLimitHours}h limit</span>}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewingParticipants(s)}
                  >
                    <Users className="h-3.5 w-3.5" /> Participants
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(s);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(s)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SessionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        session={editing}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <SessionParticipantsDialog
        open={!!viewingParticipants}
        onOpenChange={(v) => !v && setViewingParticipants(null)}
        session={viewingParticipants}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.title}?`}
        description="Riders currently in progress will block this — deactivate instead if that's the case."
        onConfirm={() =>
          deleteMutation.mutate(deleteTarget._id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function BikeInstallmentsTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRider, setSelectedRider] = useState(null);

  const { data, isLoading, isFetching } = useRiders({ search, page, limit: 8 });
  const riders = data?.riders ?? [];

  const deductMutation = useDeductBikeInstallment();

  const handleDeduct = () => {
    if (!selectedRider) return;
    deductMutation.mutate(selectedRider._id, {
      onSuccess: () => setSelectedRider(null),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search riders for installment…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : riders.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No riders found.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Rider</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Vehicle Model</TableHead>
                    <TableHead>Current Wallet Balance</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody
                  className={isFetching ? "opacity-60 transition-opacity" : ""}
                >
                  {riders.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>
                        <p className="font-medium text-foreground">{r.name}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {r.phone}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {r.riderProfile?.vehicleModel ||
                          r.riderProfile?.vehicleType ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground">
                          Rs. {r.wallet?.balance ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setSelectedRider(r)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Deduct Rs. 500
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <p className="text-xs text-muted-foreground">
                  Page {data?.page ?? 1} of {data?.totalPages ?? 1} ·{" "}
                  {data?.total ?? 0} riders
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= (data?.totalPages ?? 1)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <BikeInstallmentDeductionDialog
        open={!!selectedRider}
        onOpenChange={(v) => !v && setSelectedRider(null)}
        rider={selectedRider}
        onConfirm={handleDeduct}
        isSubmitting={deductMutation.isPending}
      />
    </div>
  );
}

export default function RidersPage() {
  return (
    <Tabs defaultValue="riders">
      <TabsList>
        <TabsTrigger value="riders">All Riders</TabsTrigger>
        <TabsTrigger value="verification">Verification Queue</TabsTrigger>
        <TabsTrigger value="sessions">Bonus Sessions</TabsTrigger>
        <TabsTrigger value="installments">Bike Installments</TabsTrigger>
      </TabsList>
      <TabsContent value="riders">
        <RidersTab />
      </TabsContent>
      <TabsContent value="verification">
        <VerificationQueueTab />
      </TabsContent>
      <TabsContent value="sessions">
        <SessionsTab />
      </TabsContent>
      <TabsContent value="installments">
        <BikeInstallmentsTab />
      </TabsContent>
    </Tabs>
  );
}