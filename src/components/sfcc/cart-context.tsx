"use client";

// Portato da components/cart/cart-context.tsx del template (SDK-free). Le
// funzioni helper del reducer sono invariate; cambia solo il provider/useCart:
// usiamo useReducer (stato persistente client-side) invece di useOptimistic
// (vedi nota estesa su CartProvider più sotto). Carrello mock pienamente
// funzionante: add/remove/quantità con totali ricalcolati.
import { Cart, CartItem, Product, ProductVariant, SFCCMode } from "@/lib/sfcc/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

export type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    };

type CartContextType = {
  cart: Cart;
  mode: SFCCMode;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString()
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
        images: product.images,
        variationValues: product.variationValues,
        description: product.description,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[]
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
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
}

function cartReducer(state: Cart, action: CartAction): Cart {
  const currentCart = state;

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

// NB: differenza rispetto al template. L'originale usa `useOptimistic` con un
// `cartPromise` che viene ri-risolto dalle server action SFCC (revalidateTag ->
// getCart). Qui NON c'è backend: le server action sono no-op e `useOptimistic`
// farebbe "revert" dello stato ottimistico appena l'azione finisce (lo stato
// ottimistico è effimero), quindi il carrello tornerebbe vuoto ad ogni add.
// Per un carrello mock realmente persistente usiamo `useReducer` sullo STESSO
// reducer puro: lo stato vive interamente client-side e sopravvive ai render e
// al cambio di vista (il provider sta nel layout).
export function CartProvider({
  children,
  initialCart,
  mode,
}: {
  children: React.ReactNode;
  initialCart?: Cart;
  mode: SFCCMode;
}) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    initialCart ?? createEmptyCart()
  );

  const updateCartItem = useCallback(
    (merchandiseId: string, updateType: UpdateType) => {
      dispatch({ type: "UPDATE_ITEM", payload: { merchandiseId, updateType } });
    },
    []
  );

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      dispatch({ type: "ADD_ITEM", payload: { variant, product } });
    },
    []
  );

  const value = useMemo(
    () => ({ cart, mode, updateCartItem, addCartItem }),
    [cart, mode, updateCartItem, addCartItem]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
