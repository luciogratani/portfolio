import { Badge } from "./badge";
import { cn } from "@/lib/sfcc/utils";
import { Product } from "@/lib/sfcc/types";
import { AddToCart } from "./add-to-cart";
import { Suspense } from "react";

// NB: i titoli erano <Link href={/product/{handle}}>; la demo non ha pagine
// prodotto (route unica), quindi restano testo statico. L'add-to-cart funziona.

export function FeaturedProductLabel({
  product,
  principal = false,
  className,
}: {
  product: Product;
  principal?: boolean;
  className?: string;
}) {
  if (principal) {
    return (
      <div
        className={cn(
          "p-4 bg-white w-fit md:rounded-md flex flex-col md:grid grid-cols-2 gap-y-3",
          className
        )}
      >
        <div className="col-span-2">
          <Badge className="capitalize font-black rounded-full">
            Best Seller
          </Badge>
        </div>
        <p className="col-span-1 text-2xl font-semibold self-start">
          {product.title}
        </p>
        <div className="col-span-1 mb-10">
          <p className="italic text-sm font-medium mb-3">
            {product.tags.join(". ")}
          </p>
          <p className="text-sm font-medium">{product.description}</p>
        </div>
        <p className="col-span-1 md:self-end text-2xl font-semibold">
          ${Number(product.priceRange.minVariantPrice.amount)}
        </p>
        <Suspense fallback={null}>
          <AddToCart
            className="flex justify-between gap-20 pr-2"
            size="lg"
            product={product}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-2 pl-8 bg-white w-fit rounded-md flex items-center gap-2",
        className
      )}
    >
      <div className="leading-4 pr-6">
        <p className="inline-flex text-base font-semibold opacity-80 mb-1.5">
          {product.title}
        </p>
        <p className="text-base font-semibold">
          ${Number(product.priceRange.minVariantPrice.amount)}
        </p>
      </div>
      <Suspense fallback={null}>
        <AddToCart
          product={product}
          iconOnly={true}
          variant="default"
          size="icon-lg"
        />
      </Suspense>
    </div>
  );
}
