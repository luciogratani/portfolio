import { cn } from "@/lib/sfcc/utils";
import Image from "next/image";
import { FeaturedProductLabel } from "./featured-product-label";
import { Product } from "@/lib/sfcc/types";
import Link from "next/link";

interface LatestProductCardProps {
  product: Product;
  principal?: boolean;
  className?: string;
  labelPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function LatestProductCard({
  product,
  principal = false,
  className,
  labelPosition = "bottom-right",
}: LatestProductCardProps) {
  if (principal) {
    return (
      <div className={cn("h-fold flex flex-col relative", className)}>
        <Link
          href={`/product/${product.handle}`}
          className="size-full"
          prefetch
        >
          <Image
            priority
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            width={1000}
            height={100}
            quality={100}
            className="object-cover size-full"
          />
        </Link>
        <div className="absolute bottom-0 left-0 grid w-full grid-cols-4 gap-6 pointer-events-none max-md:contents p-sides">
          <FeaturedProductLabel
            className="col-span-3 col-start-2 pointer-events-auto 2xl:col-start-3 2xl:col-span-2 shrink-0"
            product={product}
            principal
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Link
        href={`/product/${product.handle}`}
        className="block w-full aspect-square"
        prefetch
      >
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          width={1000}
          height={100}
          className="object-cover size-full"
        />
      </Link>

      <div
        className={cn(
          "absolute",
          labelPosition === "top-left" && "left-sides top-sides",
          labelPosition === "top-right" && "right-sides top-sides",
          labelPosition === "bottom-left" && "left-sides bottom-sides",
          labelPosition === "bottom-right" && "right-sides bottom-sides"
        )}
      >
        <FeaturedProductLabel product={product} />
      </div>
    </div>
  );
}
