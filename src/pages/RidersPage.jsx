// // import { Bike } from "lucide-react";
// // import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

// // export default function RidersPage() {
// //   return (
// //     <PlaceholderPage
// //       icon={Bike}
// //       title="Riders"
// //       description="Fleet roster, live status, documents, and earnings will live here once the riders endpoint is connected."
// //       upcoming={["Online / Offline", "Documents", "Vehicle Info", "Wallet & Earnings"]}
// //     />
// //   );
// // }

// import { useMemo, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   flexRender,
// } from "@tanstack/react-table";
// import {
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle2,
//   Ban,
//   Trash2,
//   Pencil,
//   UserPlus,
//   X,
//   Plus,
//   MapPin,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import { cn } from "@/lib/utils";
// import {
//   useRiders,
//   useCreateRider,
//   useUpdateRider,
//   useUpdateRiderStatus,
//   useDeleteRider,
// } from "@/hooks/useRiders";

// const FILTERS = [
//   { value: "all", label: "All Riders" },
//   { value: "active", label: "Active" },
//   { value: "blocked", label: "Blocked" },
// ];

// export default function RidersPage() {
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingRider, setEditingRider] = useState(null);

//   // Tanstack Mutations & Queries
//   const { data: riders, isLoading, isFetching } = useRiders({ status, search });
//   const createRiderMutation = useCreateRider();
//   const updateRiderMutation = useUpdateRider();
//   const statusMutation = useUpdateRiderStatus();
//   const deleteMutation = useDeleteRider();

//   // Form Setup
//   const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       password: "",
//       serviceZones: [{ zone: "", areas: [] }],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "serviceZones",
//   });

//   const handleOpenCreateModal = () => {
//     setEditingRider(null);
//     reset({
//       name: "",
//       email: "",
//       phone: "",
//       password: "",
//       serviceZones: [{ zone: "", areas: [] }],
//     });
//     setIsModalOpen(true);
//   };

//   const handleOpenEditModal = (rider) => {
//     setEditingRider(rider);
//     reset({
//       name: rider.name || "",
//       email: rider.email || "",
//       phone: rider.phone || "",
//       password: "", // Keep password field empty on edit
//       serviceZones: rider.serviceZones?.length > 0
//         ? rider.serviceZones
//         : [{ zone: "", areas: [] }],
//     });
//     setIsModalOpen(true);
//   };

//   const onSubmitForm = (formData) => {
//     if (editingRider) {
//       // Don't send empty passwords during edit
//       if (!formData.password) delete formData.password;

//       updateRiderMutation.mutate(
//         { id: editingRider._id, payload: formData },
//         {
//           onSuccess: () => {
//             setIsModalOpen(false);
//             reset();
//           },
//         }
//       );
//     } else {
//       createRiderMutation.mutate(formData, {
//         onSuccess: () => {
//           setIsModalOpen(false);
//           reset();
//         },
//       });
//     }
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this rider?")) {
//       deleteMutation.mutate(id);
//     }
//   };

//   const tableData = useMemo(() => riders ?? [], [riders]);

//   const columns = useMemo(
//     () => [
//       { accessorKey: "name", header: "Rider Name" },
//       { accessorKey: "email", header: "Email Address" },
//       { accessorKey: "phone", header: "Contact Number" },
//       {
//         accessorKey: "serviceZones",
//         header: "Working Zone",
//         cell: ({ row }) => {
//           const zones = row.original.serviceZones || [];
//           return (
//             <div className="flex flex-wrap gap-1">
//               {zones.length > 0 ? (
//                 zones.map((sz, idx) => (
//                   <Badge key={idx} variant="outline" className="text-[11px] gap-1 py-0.5">
//                     <MapPin className="h-3 w-3 text-muted-foreground" />
//                     {sz.zone}
//                   </Badge>
//                 ))
//               ) : (
//                 <span className="text-muted-foreground text-xs">No zone assigned</span>
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "isBlocked",
//         header: "Status",
//         cell: ({ row }) => {
//           const isBlocked = row.original.isBlocked;
//           return isBlocked ? (
//             <Badge variant="destructive">Blocked</Badge>
//           ) : (
//             <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Active</Badge>
//           );
//         },
//       },
//       {
//         id: "actions",
//         header: "",
//         cell: ({ row }) => {
//           const r = row.original;
//           return (
//             <div className="flex items-center justify-end gap-1.5">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 title="Edit Rider Profile"
//                 onClick={() => handleOpenEditModal(r)}
//               >
//                 <Pencil className="h-4 w-4" />
//               </Button>
//               {r.isBlocked ? (
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   title="Unblock Rider"
//                   onClick={() => statusMutation.mutate({ id: r._id, isBlocked: false })}
//                 >
//                   <CheckCircle2 className="h-4 w-4 text-emerald-500" />
//                 </Button>
//               ) : (
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   title="Block Rider"
//                   onClick={() => statusMutation.mutate({ id: r._id, isBlocked: true })}
//                 >
//                   <Ban className="h-4 w-4 text-destructive" />
//                 </Button>
//               )}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 title="Delete Rider"
//                 onClick={() => handleDelete(r._id)}
//               >
//                 <Trash2 className="h-4 w-4 text-destructive" />
//               </Button>
//             </div>
//           );
//         },
//       },
//     ],
//     [statusMutation]
//   );

//   const table = useReactTable({
//     data: tableData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: { pagination: { pageSize: 10 } },
//   });

//   return (
//     <div className="space-y-5 p-6 max-w-7xl mx-auto">
//       {/* Header and Stats */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Rider Operations</h1>
//           <p className="text-sm text-muted-foreground">
//             Manage your delivery fleet, assign operational service zones, and update riders.
//           </p>
//         </div>
//         <Button onClick={handleOpenCreateModal} className="w-full md:w-auto bg-navy text-white flex gap-2">
//           <UserPlus className="h-4 w-4" /> Add New Rider
//         </Button>
//       </div>

//       {/* Quick Stats Banner */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Riders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{isLoading ? "..." : tableData.length}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Riders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-emerald-600">
//               {isLoading ? "..." : tableData.filter((r) => !r.isBlocked).length}
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Blocked Accounts</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-rose-600">
//               {isLoading ? "..." : tableData.filter((r) => r.isBlocked).length}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters & Actions */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex flex-wrap gap-1.5">
//           {FILTERS.map((f) => (
//             <button
//               key={f.value}
//               onClick={() => setStatus(f.value)}
//               className={cn(
//                 "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
//                 status === f.value
//                   ? "bg-navy text-white"
//                   : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
//               )}
//             >
//               {f.label}
//             </button>
//           ))}
//         </div>

//         <div className="relative w-full sm:w-64">
//           <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search name, phone, email..."
//             className="pl-9"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Main Table */}
//       <Card>
//         <CardContent className="p-0">
//           {isLoading ? (
//             <div className="space-y-3 p-5">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <Skeleton key={i} className="h-11 w-full" />
//               ))}
//             </div>
//           ) : tableData.length === 0 ? (
//             <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
//               <p className="text-sm font-medium text-foreground">No riders match your parameters</p>
//               <p className="text-xs text-muted-foreground">Verify your filters or create a new profile.</p>
//             </div>
//           ) : (
//             <>
//               <Table>
//                 <TableHeader>
//                   {table.getHeaderGroups().map((hg) => (
//                     <TableRow key={hg.id} className="hover:bg-transparent">
//                       {hg.headers.map((header) => (
//                         <TableHead key={header.id}>
//                           {flexRender(header.column.columnDef.header, header.getContext())}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableHeader>
//                 <TableBody className={cn(isFetching && "opacity-60 transition-opacity")}>
//                   {table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               {/* Table Footer / Pagination */}
//               <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
//                 <p className="text-xs text-muted-foreground">
//                   Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ·{" "}
//                   {tableData.length} riders listed
//                 </p>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => table.previousPage()}
//                     disabled={!table.getCanPreviousPage()}
//                   >
//                     <ChevronLeft className="h-4 w-4" /> Prev
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => table.nextPage()}
//                     disabled={!table.getCanNextPage()}
//                   >
//                     Next <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* ======================================================== */}
//       {/* 🛠️ Create / Edit Dialog Component (Clean UI Layout) */}
//       {/* ======================================================== */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{editingRider ? "Modify Rider Profile" : "Create New Rider Account"}</DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 pt-2">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input id="name" {...register("name", { required: "Name is required" })} />
//                 {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
//               </div>

//               <div className="space-y-1.5">
//                 <Label htmlFor="phone">Contact Number</Label>
//                 <Input id="phone" {...register("phone", { required: "Phone number is required" })} />
//                 {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="email">Email Address</Label>
//               <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
//               {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="password">
//                 Password {editingRider && <span className="text-muted-foreground">(Leave empty to keep current)</span>}
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 {...register("password", { required: !editingRider ? "Password is required" : false })}
//               />
//               {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
//             </div>

//             {/* Service Zones Setup Array */}
//             <div className="space-y-3 pt-2 border-t border-border">
//               <div className="flex items-center justify-between">
//                 <Label className="text-sm font-semibold">Service Zones Assignment</Label>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   className="h-8 gap-1"
//                   onClick={() => append({ zone: "", areas: [] })}
//                 >
//                   <Plus className="h-3.5 w-3.5" /> Add Zone
//                 </Button>
//               </div>

//               {fields.map((field, index) => (
//                 <div key={field.id} className="flex gap-3 items-end bg-secondary/30 p-3 rounded-lg relative">
//                   <div className="flex-1 space-y-1.5">
//                     <Label className="text-xs">Zone Location Name (e.g. Zone-A)</Label>
//                     <Input {...register(`serviceZones.${index}.zone`, { required: "Zone name is required" })} />
//                   </div>

//                   {fields.length > 1 && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="text-destructive hover:bg-destructive/10"
//                       onClick={() => remove(index)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-end gap-2 pt-4 border-t border-border">
//               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={createRiderMutation.isPending || updateRiderMutation.isPending}>
//                 {editingRider ? "Save Changes" : "Create Account"}
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
/////////////////////////////////////////

// import { useEffect, useState } from "react";
// // import { useAuth } from "./context/AuthContext"; // Or wherever your user state lives
// import { useSocket } from "../hooks/useSocket";
// import {
//   Plus,
//   Search,
//   Pencil,
//   Trash2,
//   Eye,
//   Ban,
//   CheckCircle2,
//   Bike,
//   Car,
//   ShieldCheck,
//   ShieldAlert,
//   ChevronLeft,
//   ChevronRight,
//   Users,
//   Gift,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import { ConfirmDialog } from "@/components/ui/confirm-dialog";
// import { RiderFormDialog } from "@/components/riders/RiderFormDialog";
// import { RiderDetailDialog } from "@/components/riders/RiderDetailDialog";
// import { SessionFormDialog } from "@/components/riders/SessionFormDialog";
// import { SessionParticipantsDialog } from "@/components/riders/SessionParticipantsDialog";
// import {
//   useRiders,
//   useCreateRider,
//   useUpdateRider,
//   useUpdateRiderBlockStatus,
//   useDeleteRider,
// } from "@/hooks/useRiders";
// import {
//   useRiderSessions,
//   useCreateSession,
//   useUpdateSession,
//   useDeleteSession,
// } from "@/hooks/useRiderSessions";

// const CURRENCY = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
// });

// const VERIFICATION_ICON = {
//   not_submitted: { icon: ShieldAlert, className: "text-muted-foreground" },
//   pending: { icon: ShieldAlert, className: "text-warning" },
//   verified: { icon: ShieldCheck, className: "text-success" },
//   rejected: { icon: ShieldAlert, className: "text-destructive" },
// };

// function VerificationDot({ status, label }) {
//   const meta = VERIFICATION_ICON[status] ?? VERIFICATION_ICON.not_submitted;
//   const Icon = meta.icon;
//   return (
//     <span
//       className={`flex items-center gap-1 text-xs ${meta.className}`}
//       title={`${label}: ${status.replace("_", " ")}`}
//     >
//       <Icon className="h-3.5 w-3.5" /> {label}
//     </span>
//   );
// }

// function RidersTab() {
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [viewing, setViewing] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
  
//   const { data, isLoading, isFetching } = useRiders({ search, page, limit: 8 });
//   const riders = data?.riders ?? [];
  
//   if (riders) {
//     useEffect(() => {
//       riders.map((r) => {
//         const riderId = r._id;
//         const { status, connect, socket } = useSocket(riderId);

//         if (riderId) {
//           connect(); // Connects socket with user._id in handshake
//         }
//       });
//     }, [riderId, connect]);
//   }

//   const createMutation = useCreateRider();
//   const updateMutation = useUpdateRider();
//   const blockMutation = useUpdateRiderBlockStatus();
//   const deleteMutation = useDeleteRider();

//   function handleSubmit(payload) {
//     if (editing) {
//       updateMutation.mutate(
//         { id: editing._id, payload },
//         { onSuccess: () => setFormOpen(false) },
//       );
//     } else {
//       createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:w-64">
//           <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search riders…"
//             className="pl-9"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//           />
//         </div>
//         <Button
//           className="bg-navy"
//           onClick={() => {
//             setEditing(null);
//             setFormOpen(true);
//           }}
//         >
//           <Plus className="h-4 w-4" /> Add Rider
//         </Button>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           {isLoading ? (
//             <div className="space-y-3 p-5">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <Skeleton key={i} className="h-12 w-full" />
//               ))}
//             </div>
//           ) : riders.length === 0 ? (
//             <p className="py-16 text-center text-sm text-muted-foreground">
//               No riders found.
//             </p>
//           ) : (
//             <>
//               <Table>
//                 <TableHeader>
//                   <TableRow className="hover:bg-transparent">
//                     <TableHead>Rider</TableHead>
//                     <TableHead>Vehicle</TableHead>
//                     <TableHead>Verification</TableHead>
//                     <TableHead>Wallet</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody
//                   className={isFetching ? "opacity-60 transition-opacity" : ""}
//                 >
//                   {riders.map((r) => {
//                     const VehicleIcon =
//                       r.riderProfile?.vehicleType === "car" ? Car : Bike;
//                     return (
//                       <TableRow key={r._id}>
//                         <TableCell>
//                           <p className="font-medium text-foreground">
//                             {r.name}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             {r.phone}
//                           </p>
//                         </TableCell>
//                         <TableCell>
//                           <span className="flex items-center gap-1.5 text-sm">
//                             <VehicleIcon className="h-3.5 w-3.5 text-muted-foreground" />
//                             {r.riderProfile?.vehicleModel ||
//                               r.riderProfile?.vehicleType}
//                           </span>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex flex-col gap-0.5">
//                             <VerificationDot
//                               status={
//                                 r.riderProfile?.cnicVerification?.status ??
//                                 "not_submitted"
//                               }
//                               label="CNIC"
//                             />
//                             <VerificationDot
//                               status={
//                                 r.riderProfile?.faceVerification?.status ??
//                                 "not_submitted"
//                               }
//                               label="Face"
//                             />
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           {CURRENCY.format(r.wallet?.balance ?? 0)}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={
//                               r.isBlocked
//                                 ? "destructive"
//                                 : r.riderProfile?.isOnline
//                                   ? "success"
//                                   : "secondary"
//                             }
//                           >
//                             {r.isBlocked
//                               ? "Blocked"
//                               : r.riderProfile?.isOnline
//                                 ? "Online"
//                                 : "Offline"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex justify-end gap-1">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               title="View"
//                               onClick={() => setViewing(r)}
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               title="Edit"
//                               onClick={() => {
//                                 setEditing(r);
//                                 setFormOpen(true);
//                               }}
//                             >
//                               <Pencil className="h-4 w-4" />
//                             </Button>
//                             {r.isBlocked ? (
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 title="Unblock"
//                                 onClick={() =>
//                                   blockMutation.mutate({
//                                     id: r._id,
//                                     isBlocked: false,
//                                   })
//                                 }
//                               >
//                                 <CheckCircle2 className="h-4 w-4 text-success" />
//                               </Button>
//                             ) : (
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 title="Block"
//                                 onClick={() =>
//                                   blockMutation.mutate({
//                                     id: r._id,
//                                     isBlocked: true,
//                                   })
//                                 }
//                               >
//                                 <Ban className="h-4 w-4 text-destructive" />
//                               </Button>
//                             )}
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               title="Delete"
//                               onClick={() => setDeleteTarget(r)}
//                             >
//                               <Trash2 className="h-4 w-4 text-destructive" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//               <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
//                 <p className="text-xs text-muted-foreground">
//                   Page {data?.page ?? 1} of {data?.totalPages ?? 1} ·{" "}
//                   {data?.total ?? 0} riders
//                 </p>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={page <= 1}
//                     onClick={() => setPage((p) => p - 1)}
//                   >
//                     <ChevronLeft className="h-4 w-4" /> Prev
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={page >= (data?.totalPages ?? 1)}
//                     onClick={() => setPage((p) => p + 1)}
//                   >
//                     Next <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       <RiderFormDialog
//         open={formOpen}
//         onOpenChange={setFormOpen}
//         rider={editing}
//         onSubmit={handleSubmit}
//         isSubmitting={createMutation.isPending || updateMutation.isPending}
//       />
//       <RiderDetailDialog
//         open={!!viewing}
//         onOpenChange={(v) => !v && setViewing(null)}
//         rider={viewing}
//       />
//       <ConfirmDialog
//         open={!!deleteTarget}
//         onOpenChange={(v) => !v && setDeleteTarget(null)}
//         title={`Delete ${deleteTarget?.name}?`}
//         description="This removes the rider's account permanently. This can't be undone."
//         onConfirm={() =>
//           deleteMutation.mutate(deleteTarget._id, {
//             onSuccess: () => setDeleteTarget(null),
//           })
//         }
//         isLoading={deleteMutation.isPending}
//       />
//     </div>
//   );
// }

// function VerificationQueueTab() {
//   const [viewing, setViewing] = useState(null);
//   const { data, isLoading } = useRiders({ limit: 50 });
//   const pending = (data?.riders ?? []).filter(
//     (r) =>
//       r.riderProfile?.cnicVerification?.status !== "verified" ||
//       r.riderProfile?.faceVerification?.status === "pending",
//   );

//   return (
//     <div className="space-y-4">
//       {isLoading ? (
//         <div className="space-y-3">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <Skeleton key={i} className="h-16 w-full" />
//           ))}
//         </div>
//       ) : pending.length === 0 ? (
//         <Card>
//           <CardContent className="py-16 text-center text-sm text-muted-foreground">
//             No pending verifications right now.
//           </CardContent>
//         </Card>
//       ) : (
//         pending.map((r) => (
//           <Card key={r._id}>
//             <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
//               <div>
//                 <p className="text-sm font-medium text-foreground">{r.name}</p>
//                 <p className="text-xs text-muted-foreground">{r.phone}</p>
//               </div>
//               <div className="flex gap-3">
//                 <VerificationDot
//                   status={
//                     r.riderProfile?.cnicVerification?.status ?? "not_submitted"
//                   }
//                   label="CNIC"
//                 />
//                 <VerificationDot
//                   status={
//                     r.riderProfile?.faceVerification?.status ?? "not_submitted"
//                   }
//                   label="Face"
//                 />
//               </div>
//               <Button size="sm" onClick={() => setViewing(r)}>
//                 Review
//               </Button>
//             </CardContent>
//           </Card>
//         ))
//       )}
//       <RiderDetailDialog
//         open={!!viewing}
//         onOpenChange={(v) => !v && setViewing(null)}
//         rider={viewing}
//       />
//     </div>
//   );
// }

// function SessionsTab() {
//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [viewingParticipants, setViewingParticipants] = useState(null);

//   const { data, isLoading } = useRiderSessions({ limit: 20 });
//   const sessions = data?.sessions ?? [];

//   const createMutation = useCreateSession();
//   const updateMutation = useUpdateSession();
//   const deleteMutation = useDeleteSession();

//   function handleSubmit(payload) {
//     if (editing) {
//       updateMutation.mutate(
//         { id: editing._id, payload },
//         { onSuccess: () => setFormOpen(false) },
//       );
//     } else {
//       createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) });
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-end">
//         <Button
//           onClick={() => {
//             setEditing(null);
//             setFormOpen(true);
//           }}
//         >
//           <Plus className="h-4 w-4" /> Add Session
//         </Button>
//       </div>

//       {isLoading ? (
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <Skeleton key={i} className="h-40 w-full" />
//           ))}
//         </div>
//       ) : sessions.length === 0 ? (
//         <Card>
//           <CardContent className="py-16 text-center text-sm text-muted-foreground">
//             No bonus sessions yet.
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//           {sessions.map((s) => (
//             <Card key={s._id}>
//               <CardContent className="p-5">
//                 <div className="flex items-start justify-between">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral/10 text-coral">
//                     <Gift className="h-5 w-5" />
//                   </div>
//                   <Badge variant={s.isActive ? "success" : "secondary"}>
//                     {s.isActive ? "Active" : "Inactive"}
//                   </Badge>
//                 </div>
//                 <p className="mt-3 font-display text-base font-semibold text-foreground">
//                   {s.title}
//                 </p>
//                 <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
//                   {s.description}
//                 </p>
//                 <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
//                   <span>{s.requiredOrders} orders</span>
//                   <span className="font-medium text-success">
//                     {CURRENCY.format(s.bonusAmount)} bonus
//                   </span>
//                   {s.timeLimitHours && <span>{s.timeLimitHours}h limit</span>}
//                 </div>
//                 <div className="mt-4 flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => setViewingParticipants(s)}
//                   >
//                     <Users className="h-3.5 w-3.5" /> Participants
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => {
//                       setEditing(s);
//                       setFormOpen(true);
//                     }}
//                   >
//                     <Pencil className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => setDeleteTarget(s)}
//                   >
//                     <Trash2 className="h-3.5 w-3.5 text-destructive" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       <SessionFormDialog
//         open={formOpen}
//         onOpenChange={setFormOpen}
//         session={editing}
//         onSubmit={handleSubmit}
//         isSubmitting={createMutation.isPending || updateMutation.isPending}
//       />
//       <SessionParticipantsDialog
//         open={!!viewingParticipants}
//         onOpenChange={(v) => !v && setViewingParticipants(null)}
//         session={viewingParticipants}
//       />
//       <ConfirmDialog
//         open={!!deleteTarget}
//         onOpenChange={(v) => !v && setDeleteTarget(null)}
//         title={`Delete ${deleteTarget?.title}?`}
//         description="Riders currently in progress will block this — deactivate instead if that's the case."
//         onConfirm={() =>
//           deleteMutation.mutate(deleteTarget._id, {
//             onSuccess: () => setDeleteTarget(null),
//           })
//         }
//         isLoading={deleteMutation.isPending}
//       />
//     </div>
//   );
// }

// export default function RidersPage() {
//   return (
//     <Tabs defaultValue="riders">
//       <TabsList>
//         <TabsTrigger value="riders">All Riders</TabsTrigger>
//         <TabsTrigger value="verification">Verification Queue</TabsTrigger>
//         <TabsTrigger value="sessions">Bonus Sessions</TabsTrigger>
//       </TabsList>
//       <TabsContent value="riders">
//         <RidersTab />
//       </TabsContent>
//       <TabsContent value="verification">
//         <VerificationQueueTab />
//       </TabsContent>
//       <TabsContent value="sessions">
//         <SessionsTab />
//       </TabsContent>
//     </Tabs>
//   );
// }


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

export default function RidersPage() {
  return (
    <Tabs defaultValue="riders">
      <TabsList>
        <TabsTrigger value="riders">All Riders</TabsTrigger>
        <TabsTrigger value="verification">Verification Queue</TabsTrigger>
        <TabsTrigger value="sessions">Bonus Sessions</TabsTrigger>
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
    </Tabs>
  );
}