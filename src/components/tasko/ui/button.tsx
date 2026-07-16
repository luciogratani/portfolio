// Port 1:1 di components/ui/button.tsx del template (shadcn/ui), con le
// classi colore rinominate ai token scoped `tasko-*` (vedi tasko.css) per non
// collidere con i token globali di sfcc. cn() e Slot invariati.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/tasko/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-tasko-ring focus-visible:ring-tasko-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-tasko-primary text-tasko-primary-foreground hover:bg-tasko-primary/90",
        destructive: "bg-tasko-destructive text-white hover:bg-tasko-destructive/90",
        outline:
          "border border-tasko-border bg-tasko-background shadow-xs hover:bg-tasko-accent hover:text-tasko-accent-foreground",
        secondary: "bg-tasko-secondary text-tasko-secondary-foreground hover:bg-tasko-secondary/80",
        ghost: "hover:bg-tasko-accent hover:text-tasko-accent-foreground",
        link: "text-tasko-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
