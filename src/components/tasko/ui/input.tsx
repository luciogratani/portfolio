// Port di components/ui/input.tsx, classi colore rinominate ai token
// scoped `tasko-*`.
import * as React from "react";

import { cn } from "@/lib/tasko/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-tasko-foreground placeholder:text-tasko-muted-foreground selection:bg-tasko-primary selection:text-tasko-primary-foreground border-tasko-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-tasko-ring focus-visible:ring-tasko-ring/50 focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
