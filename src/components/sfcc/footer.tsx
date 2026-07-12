import { LogoSvg } from "./logo-svg";
import { ShopLinks } from "./shop-links";
import { SidebarLinks } from "./product-sidebar-links";
import { getCollections } from "@/lib/sfcc/data";

export async function Footer() {
  const collections = await getCollections();

  return (
    <footer className="p-sides">
      <div className="w-full h-[532px] p-11 text-background bg-foreground rounded-[12px] flex flex-col justify-between">
        <div className="flex justify-between">
          <LogoSvg className="basis-3/4 max-w-[1200px] h-auto block" />
          <ShopLinks collections={collections} align="right" />
        </div>
        <div className="flex justify-between text-muted-foreground">
          <SidebarLinks className="max-w-[450px] w-full" size="base" invert />
          <p className="text-base">
            {new Date().getFullYear()}© — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
