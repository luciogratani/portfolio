// Shim dati decoupled: replica la logica del ramo "mock" di lib/sfcc/index.ts
// del template (getCollections/getCollectionProducts) SENZA
// commerce-sdk-isomorphic né le API sperimentali `"use cache"`. Legge solo dai
// mock (arredamento). Async per combaciare con l'`await` nella page/footer.
import type { Cart, Collection, Product } from "./types";
import { mockProducts } from "./mock-products";
import { mockCollections } from "./mock-collections";

const ROOT_CATEGORY = "joyco-root";

// Carrello vuoto usato per inizializzare il CartProvider (useReducer) nella route
// /projects/sfcc. L'add-to-cart è funzionante (client-side, nessun backend):
// partiamo dallo stato vuoto e il reducer aggiunge/aggiorna le righe.
export const emptyCart: Cart = {
  id: undefined,
  checkoutUrl: "",
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: "0", currencyCode: "USD" },
    totalAmount: { amount: "0", currencyCode: "USD" },
    totalTaxAmount: { amount: "0", currencyCode: "USD" },
  },
};

export async function getCollections(): Promise<Collection[]> {
  return mockCollections.filter((c) => c.handle !== ROOT_CATEGORY);
}

// Ritorna tutti i prodotti disponibili (deduplicati per id) — usato dalla vista
// "shop all". Nel template la "shop all" passa per getCollectionProducts sulla
// root category; qui bastano tutti i mock.
export async function getProducts(): Promise<Product[]> {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of mockProducts) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  }
  return out;
}

export async function getCollectionProducts({
  collection: collectionHandle,
}: {
  collection: string;
  limit?: number;
  sortKey?: string;
}): Promise<Product[]> {
  const collection = mockCollections.find((c) => c.handle === collectionHandle);
  if (!collection) return [];

  // Categorie figlie che hanno questa collection nel parentCategoryTree.
  const childCategoryIds = mockCollections
    .filter((c) =>
      c.parentCategoryTree.some((parent) => parent.id === collection.handle),
    )
    .map((c) => c.handle);

  const categoryIdsToSearch = [collection.handle, ...childCategoryIds];

  const filtered = mockProducts.filter(
    (p) => p.categoryId && categoryIdsToSearch.includes(p.categoryId),
  );

  const uniqueIds = [...new Set(filtered.map((p) => p.id))];
  return uniqueIds
    .map((id) => filtered.find((p) => p.id === id))
    .filter((p): p is Product => p != null);
}
