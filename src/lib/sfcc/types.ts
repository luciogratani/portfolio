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
