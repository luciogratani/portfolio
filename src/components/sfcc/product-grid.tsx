import { Product } from "@/lib/sfcc/types";
import { ProductCard } from "./product-card";

// Griglia prodotti per le viste "featured" e "shop all" (adattata da
// app/shop/components/product-list-content.tsx, senza i filtri nuqs non
// richiesti). `pt-top-spacing` lascia spazio all'header fisso.
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="pt-top-spacing pb-sides">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
