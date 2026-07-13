// Tipi ridotti dal template SFCC: solo ciò che serve alla home decoupled.
// L'originale importava commerce-sdk-isomorphic, ma quei tipi servivano al
// carrello (escluso qui) — Product/Collection ecc. sono SDK-free.

export type SEO = { title: string; description: string };

export type Money = { amount: string; currencyCode: string };

export type SelectedOptions = { name: string; value: string }[];

export type Image = {
  url: string;
  altText: string;
  height: number;
  width: number;
  selectedOptions?: SelectedOptions;
};

export type ProductOption = {
  id: string;
  name: string;
  values: { id: string; name: string }[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOptions;
  price: Money;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  parentCategoryTree: { id: string; name: string }[];
  updatedAt: string;
  path: string;
};

export type SalesforceProduct = {
  id: string;
  title: string;
  handle: string;
  categoryId?: string;
  description: string;
  descriptionHtml: string;
  featuredImage: Image;
  currencyCode: string;
  priceRange: { maxVariantPrice: Money; minVariantPrice: Money };
  seo: SEO;
  options: ProductOption[];
  tags: string[];
  variants: ProductVariant[];
  images: Image[];
  availableForSale: boolean;
  updatedAt: string;
  variationValues?: Record<string, string>;
};

export type Product = Omit<
  SalesforceProduct,
  "variants" | "images" | "updatedAt"
> & {
  variants: ProductVariant[];
  images: Image[];
};

export type NavItem = { label: string; href: string };

export type SFCCMode = "mock" | "live";

// Carrello: versione SDK-free (l'originale derivava da SalesforceCart con
// campi come paymentInstruments/shippingMethod tipati sull'SDK — qui
// omessi perché il carrello resta sempre vuoto in questa fase, l'header
// deve solo montare CartProvider/CartModal senza crash).
export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  images: Image[];
  description?: string;
  featuredImage: Image;
  variationValues?: Record<string, string>;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOptions;
    product: CartProduct;
  };
};

export type Cart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
    shippingAmount?: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};
