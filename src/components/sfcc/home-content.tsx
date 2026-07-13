import { HomeSidebar } from "./home-sidebar";
import { LatestProductCard } from "./latest-product-card";
import { Badge } from "./badge";
import { getLabelPosition } from "@/lib/sfcc/utils";
import type { Collection, Product } from "@/lib/sfcc/types";

// Contenuto della vista "home" (estratto dalla vecchia page.tsx). Il Footer NON
// è qui: lo rende la page una volta sola sotto lo switch di vista.
export function HomeContent({
  collections,
  featuredProducts,
}: {
  collections: Collection[];
  featuredProducts: Product[];
}) {
  const [lastProduct, ...restProducts] = featuredProducts;

  return (
    <div className="contents md:grid md:grid-cols-12 md:gap-sides">
      <HomeSidebar collections={collections} />
      <div className="col-span-8 flex flex-col md:grid grid-cols-2 w-full relative">
        <div className="fixed top-0 left-0 w-full base-grid py-sides pointer-events-none z-10">
          <div className="col-start-5 col-span-8">
            <div className="px-6 hidden lg:block">
              <Badge variant="outline-secondary">latest drop</Badge>
            </div>
          </div>
        </div>
        {featuredProducts.length > 0 && (
          <>
            <LatestProductCard
              className="col-span-2"
              product={lastProduct}
              principal
            />
            {restProducts.map((product, index) => (
              <LatestProductCard
                className="col-span-1"
                key={product.id}
                product={product}
                labelPosition={getLabelPosition(index)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
