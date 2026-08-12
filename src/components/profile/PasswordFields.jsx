import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PasswordFields({ register }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="border-t pt-4 space-y-4">
      <h3 className="text-sm font-semibold">Change Password</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Current Password */}
        <div className="relative">
          <Input
            type={showCurrent ? "text" : "password"}
            placeholder="Current password"
            className="pr-10"
            {...register("currentPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
            onClick={() => setShowCurrent((prev) => !prev)}
            tabIndex={-1}
          >
            {showCurrent ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* New Password */}
        <div className="relative">
          <Input
            type={showNew ? "text" : "password"}
            placeholder="New password"
            className="pr-10"
            {...register("newPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
            onClick={() => setShowNew((prev) => !prev)}
            tabIndex={-1}
          >
            {showNew ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}