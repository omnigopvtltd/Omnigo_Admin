import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProfile, updateAdminProfile } from "@/api/admin";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Loader2, User } from "lucide-react";
import { PasswordFields } from "@/components/profile/PasswordFields";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  // const { data: user, isLoading } = useQuery({
  //   queryKey: ["adminProfile"],
  //   queryFn: getAdminProfile,
  // });

  // Assuming you have the current logged-in user's ID stored somewhere (e.g., AuthContext or localStorage)
  // const adminId = localStorage.getItem("userId");
  const adminId = "6a50f90383cbf83bbac2b5f2";

  const { data: user, isLoading } = useQuery({
    queryKey: ["adminProfile", adminId],
    queryFn: () => getAdminProfile(adminId),
    enabled: !!adminId, // Don't run query until adminId is available
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (user) {
      console.log(user);
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

 const mutation = useMutation({
  // React Query passes form `values` as the first parameter here
  mutationFn: (values) => updateAdminProfile(values, adminId),
  onSuccess: () => {
    setSaved(true);
    queryClient.invalidateQueries(["adminProfile"]);
    setTimeout(() => setSaved(false), 3000);
  },
});

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback className="bg-primary text-xl text-primary-foreground font-bold">
              AD
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user?.name || "Admin Account"}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <Input {...register("name", { required: "Name is required" })} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <Input disabled {...register("email")} className="bg-muted" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone Number</label>
              <Input {...register("phone")} type="number" placeholder="03001234567" />
            </div>

            <PasswordFields register={register} />

            <div className="flex items-center gap-3 border-t pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
              >
                {isSubmitting || mutation.isPending
                  ? "Updating Profile..."
                  : "Save Profile"}
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <Check className="h-4 w-4" /> Updated successfully
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
