// import { useState } from "react";
// import { Check, X, ShieldQuestion } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const STATUS_BADGE = {
//   not_submitted: { label: "Not Submitted", variant: "secondary" },
//   pending: { label: "Pending Review", variant: "warning" },
//   verified: { label: "Verified", variant: "success" },
//   rejected: { label: "Rejected", variant: "destructive" },
// };

// export function VerificationReviewCard({ title, status, images = [], detail, rejectionReason, onApprove, onReject, isLoading }) {
//   const [showRejectInput, setShowRejectInput] = useState(false);
//   const [reason, setReason] = useState("");
//   const badge = STATUS_BADGE[status] ?? STATUS_BADGE.not_submitted;

//   return (
//     <div className="rounded-lg border border-border p-4">
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-semibold text-foreground">{title}</p>
//         <Badge variant={badge.variant}>{badge.label}</Badge>
//       </div>

//       {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}

//       {status === "not_submitted" ? (
//         <div className="mt-3 flex items-center gap-2 rounded-md bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
//           <ShieldQuestion className="h-4 w-4 shrink-0" /> Rider hasn't submitted this yet.
//         </div>
//       ) : (
//         <div className="mt-3 flex gap-2">
//           {images.filter(Boolean).map((src, i) => (
//             <img
//               key={i}
//               src={src}
//               alt=""
//               className="h-20 w-28 rounded-md border border-border object-cover"
//               onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
//             />
//           ))}
//         </div>
//       )}

//       {status === "rejected" && rejectionReason && (
//         <p className="mt-2 text-xs text-destructive">Reason: {rejectionReason}</p>
//       )}

//       {status === "pending" && (
//         <div className="mt-3 space-y-2">
//           {showRejectInput ? (
//             <div className="flex gap-2">
//               <Input
//                 placeholder="Reason for rejection…" value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 className="h-8 text-xs"
//               />
//               <Button
//                 size="sm" variant="destructive" disabled={!reason.trim() || isLoading}
//                 onClick={() => onReject(reason)}
//               >
//                 Confirm
//               </Button>
//               <Button size="sm" variant="ghost" onClick={() => setShowRejectInput(false)}>Cancel</Button>
//             </div>
//           ) : (
//             <div className="flex gap-2">
//               <Button size="sm" onClick={onApprove} disabled={isLoading}>
//                 <Check className="h-3.5 w-3.5" /> Approve
//               </Button>
//               <Button size="sm" variant="outline" onClick={() => setShowRejectInput(true)} disabled={isLoading}>
//                 <X className="h-3.5 w-3.5" /> Reject
//               </Button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
/////////////////////////
import { useState } from "react";
import { Check, X, ShieldQuestion, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_BADGE = {
  not_submitted: { label: "Not Submitted", variant: "secondary" },
  pending: { label: "Pending Review", variant: "warning" },
  verified: { label: "Verified", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function VerificationReviewCard({
  title,
  status,
  images = [],
  detail,
  rejectionReason,
  onApprove,
  onReject,
  isLoading,
}) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reason, setReason] = useState("");
  const badge = STATUS_BADGE[status] ?? STATUS_BADGE.not_submitted;

  const validImages = images.filter(Boolean);

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}

      {status === "not_submitted" ? (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
          <ShieldQuestion className="h-4 w-4 shrink-0" />
          Rider hasn't submitted this yet.
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {validImages.length > 0 ? (
            validImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${title} attachment ${i + 1}`}
                className="h-20 w-28 rounded-md border border-border object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ))
          ) : (
            <div className="flex h-20 w-28 items-center justify-center rounded-md border border-dashed border-border bg-muted/50 text-xs text-muted-foreground">
              <ImageOff className="h-4 w-4" />
            </div>
          )}
        </div>
      )}

      {status === "rejected" && rejectionReason && (
        <p className="mt-2 text-xs text-destructive">Reason: {rejectionReason}</p>
      )}

      {status === "pending" && (
        <div className="mt-3 space-y-2">
          {showRejectInput ? (
            <div className="flex gap-2">
              <Input
                placeholder="Reason for rejection…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                variant="destructive"
                disabled={!reason.trim() || isLoading}
                onClick={() => onReject(reason)}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowRejectInput(false);
                  setReason("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={onApprove} disabled={isLoading}>
                <Check className="h-3.5 w-3.5 mr-1" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRejectInput(true)}
                disabled={isLoading}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}