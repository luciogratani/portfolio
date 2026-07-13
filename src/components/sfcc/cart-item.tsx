"use client";

// Versione semplificata di components/cart/cart-item.tsx del template.
// Rimosse le dipendenze non necessarie alla demo: ColorSwatch/color-picker,
// variant-selector (nuqs) e le server action reali. Le azioni quantità/rimozione
// chiamano direttamente `updateCartItem` del CartProvider (reducer client).
import { CartItem } from "@/lib/sfcc/types";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/sfcc/utils";
import { Button } from "./button";
import { UpdateType } from "./cart-context";

interface CartItemProps {
  item: CartItem;
  optimisticUpdate: (merchandiseId: string, updateType: UpdateType) => void;
}

export function CartItemCard({ item, optimisticUpdate }: CartItemProps) {
  const image = item.merchandise.product.featuredImage;

  return (
    <div className="bg-card rounded-lg p-2">
      <div className="flex flex-row gap-6">
        <div className="relative size-[120px] overflow-hidden rounded-sm shrink-0">
          <Image
            className="size-full object-cover"
            width={240}
            height={240}
            alt={image?.altText || item.merchandise.product.title}
            src={image?.url}
          />
        </div>
        <div className="flex flex-col gap-2 2xl:gap-3 flex-1">
          <span className="2xl:text-lg font-semibold">
            {item.merchandise.product.title}
          </span>
          <p className="2xl:text-lg font-semibold">
            {formatPrice(
              item.cost.totalAmount.amount,
              item.cost.totalAmount.currencyCode
            )}
          </p>
          <div className="flex justify-between items-end mt-auto">
            <div className="flex h-8 flex-row items-center rounded-md border border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                aria-label="Reduce item quantity"
                onClick={() => optimisticUpdate(item.merchandise.id, "minus")}
                className="flex h-full min-w-[36px] items-center justify-center rounded-l-md p-2 transition-all duration-200 hover:opacity-80"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                aria-label="Increase item quantity"
                onClick={() => optimisticUpdate(item.merchandise.id, "plus")}
                className="flex h-full min-w-[36px] items-center justify-center rounded-r-md p-2 transition-all duration-200 hover:opacity-80"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="Remove cart item"
              className="px-2 text-sm -mr-1 -mb-1 opacity-70"
              onClick={() => optimisticUpdate(item.merchandise.id, "delete")}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
