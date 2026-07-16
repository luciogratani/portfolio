// Port ridotto di components/ui/card.tsx (solo <Card>, l'unico sotto-
// componente usato dai widget della dashboard: Header/Title/Content non
// servono qui). Classi colore rinominate ai token scoped `tasko-*`.
import * as React from "react";

import { cn } from "@/lib/tasko/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-tasko-card text-tasko-card-foreground flex flex-col gap-6 rounded-xl border border-tasko-border py-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
