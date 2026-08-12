import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlaceholderPage({ icon: Icon, title, description, upcoming = [] }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/10 text-navy">
            <Icon className="h-7 w-7" strokeWidth={2} />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {upcoming.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {upcoming.map((item) => (
                <Badge key={item} variant="secondary">{item}</Badge>
              ))}
            </div>
          )}
          <p className="pt-2 text-[11px] uppercase tracking-wide text-muted-foreground/70">
            Scaffolded · API wiring next
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
