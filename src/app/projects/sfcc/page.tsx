import { Footer } from "@/components/sfcc/footer";
import { HomeContent } from "@/components/sfcc/home-content";
import { ProductGrid } from "@/components/sfcc/product-grid";
import { SfccViews } from "@/components/sfcc/sfcc-views";
import {
  getCollectionProducts,
  getCollections,
  getProducts,
} from "@/lib/sfcc/data";

// Unica route della demo SFCC. Le 3 viste (home / featured / shop all) sono
// composte QUI lato server e passate a <SfccViews>, che sceglie quale mostrare
// in base allo stato client (view-context) — nessun cambio di route, nessun
// <Link> di navigazione (vedi header/mobile-menu/shop-links). Il Footer resta
// sempre visibile sotto lo switch.
export default async function SfccHome() {
  const [featuredProducts, collections, allProducts] = await Promise.all([
    getCollectionProducts({ collection: "top-seller" }),
    getCollections(),
    getProducts(),
  ]);

  return (
    // Wrapper con la self-entrance al mount della route (fade+rise, vedi
    // sfcc.css). Il keyframe termina su `transform: none` per non lasciare un
    // containing-block permanente al badge `fixed` della home.
    <div className="sfcc-enter-content">
      <SfccViews
        home={
          <HomeContent
            collections={collections}
            featuredProducts={featuredProducts}
          />
        }
        featured={<ProductGrid products={featuredProducts} />}
        shop={<ProductGrid products={allProducts} />}
      />
      <Footer />
    </div>
  );
}
