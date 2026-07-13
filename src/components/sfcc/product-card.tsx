import Image from "next/image";
import { Product } from "@/lib/sfcc/types";
import { AddToCart } from "./add-to-cart";
import { formatPrice } from "@/lib/sfcc/utils";

// Adattato da app/shop/components/product-card/index.tsx del template.
// Semplificazioni: niente <Link> alla pagina prodotto (non esiste: la demo
// resta su /projects/sfcc) e niente VariantSelector (i prodotti demo non hanno
// opzioni). Resta l'overlay hover con titolo/prezzo e AddToCart funzionante.
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative w-full aspect-[3/4] md:aspect-square bg-muted group overflow-hidden">
      <Image
        src={product.featuredImage.url}
        alt={product.featuredImage.altText || product.title}
        width={product.featuredImage.width}
        height={product.featuredImage.height}
        className="size-full object-cover"
        quality={100}
      />

      {/* Overlay */}
      <div className="absolute inset-0 w-full p-2 pointer-events-none">
        <div className="max-md:hidden w-full flex gap-6 justify-between items-baseline font-semibold px-3 py-1 group-hover:opacity-0 translate-y-0 group-hover:-translate-y-full transition-all duration-300">
          <p className="text-sm 2xl:text-base uppercase text-balance">
            {product.title}
          </p>
          <p className="text-sm 2xl:text-base uppercase">
            {formatPrice(
              product.priceRange.minVariantPrice.amount,
              product.priceRange.minVariantPrice.currencyCode
            )}
          </p>
        </div>

        <div className="absolute bottom-3 inset-x-3 px-2 py-3 rounded-md bg-card flex flex-col gap-8 md:opacity-0 group-hover:opacity-100 md:translate-y-1/3 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto max-md:pointer-events-auto">
          <div className="grid grid-cols-2 items-end gap-y-8 gap-x-4">
            <p className="text-lg font-semibold text-pretty">{product.title}</p>
            <p className="text-lg font-semibold place-self-end">
              {formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode
              )}
            </p>
            <AddToCart
              className="col-span-2"
              size="sm"
              product={product}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
