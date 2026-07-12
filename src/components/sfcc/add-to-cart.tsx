import { PlusCircleIcon } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import type { Product } from "@/lib/sfcc/types";

// Stub decoupled: la demo non ha carrello. Riproduce il look del bottone in
// modalità "mock" dell'originale (disabilitato), senza cart-context né server
// action. Mantiene le stesse prop visive (size/variant/iconOnly) usate da
// FeaturedProductLabel.
export function AddToCart({
  product,
  className,
  iconOnly = false,
  ...buttonProps
}: ButtonProps & { product: Product; iconOnly?: boolean }) {
  return (
    <div className={className}>
      <Button
        type="button"
        disabled
        aria-label={`${product.title} — cart disabled in demo`}
        className={
          iconOnly
            ? undefined
            : "w-full relative flex items-center justify-between"
        }
        {...buttonProps}
      >
        {iconOnly ? (
          <PlusCircleIcon />
        ) : (
          <div className="w-full flex items-center justify-between">
            <span>Cart disabled</span>
            <PlusCircleIcon />
          </div>
        )}
      </Button>
    </div>
  );
}
