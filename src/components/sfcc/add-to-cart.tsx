"use client";

// Versione funzionante (mock) di components/cart/add-to-cart.tsx del template.
// Semplificazioni: i 3 prodotti demo non hanno opzioni/varianti, quindi si
// risolve sempre la "base variant" (id = id prodotto) e non servono
// nuqs/useSelectedVariant/tooltip/loader. L'aggiunta è puramente client:
// `addCartItem` aggiorna il reducer del CartProvider (persistente). Nessun
// backend/SDK coinvolto.
import { PlusCircleIcon } from "lucide-react";
import { Product, ProductVariant } from "@/lib/sfcc/types";
import { useCart } from "./cart-context";
import { Button, type ButtonProps } from "./button";

interface AddToCartProps extends ButtonProps {
  product: Product;
  iconOnly?: boolean;
}

const getBaseProductVariant = (product: Product): ProductVariant => ({
  id: product.id,
  title: product.title,
  availableForSale: product.availableForSale,
  selectedOptions: [],
  price: product.priceRange.minVariantPrice,
});

export function AddToCart({
  product,
  className,
  iconOnly = false,
  ...buttonProps
}: AddToCartProps) {
  const { addCartItem } = useCart();
  const { variants, availableForSale } = product;

  // Base variant se il prodotto non ha varianti, altrimenti la singola variante.
  const resolvedVariant =
    variants.length === 1 ? variants[0] : getBaseProductVariant(product);

  const isDisabled = !availableForSale || !resolvedVariant;

  return (
    <form
      className={className}
      action={async () => {
        if (resolvedVariant) {
          addCartItem(resolvedVariant, product);
        }
      }}
    >
      <Button
        type="submit"
        aria-label="Add to cart"
        disabled={isDisabled}
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
            <span>{availableForSale ? "Add To Cart" : "Out Of Stock"}</span>
            <PlusCircleIcon />
          </div>
        )}
      </Button>
    </form>
  );
}
