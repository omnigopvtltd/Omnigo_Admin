// import * as React from "react";
// import { cn } from "@/lib/utils";

// const Avatar = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-secondary",
//       className
//     )}
//     {...props}
//   />
// ));
// Avatar.displayName = "Avatar";

// const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "flex h-full w-full items-center justify-center rounded-full bg-navy text-xs font-semibold text-white",
//       className
//     )}
//     {...props}
//   />
// ));
// AvatarFallback.displayName = "AvatarFallback";

// export { Avatar, AvatarFallback };
// src/components/ui/avatar.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, src, alt = "", ...props }, ref) => {
  if (!src) return null;
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-navy text-xs font-semibold text-white",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };