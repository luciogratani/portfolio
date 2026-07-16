"use client";

// Port di components/dashboard/header.tsx. Avatar senza immagine remota:
// non esiste un asset "profile.jpg" del template in questo repo, quindi
// usiamo solo l'AvatarFallback (iniziali) invece di un <img> rotto.
import { Search, Mail, Bell } from "lucide-react";
import { Button } from "@/components/tasko/ui/button";
import { Input } from "@/components/tasko/ui/input";
import { Avatar, AvatarFallback } from "@/components/tasko/ui/avatar";
import { MobileNav } from "./MobileNav";
import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  return (
    <header className="space-y-3 md:space-y-4 animate-slide-in-up">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <MobileNav />

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tasko-muted-foreground" />
            <Input
              placeholder="Search task"
              className="pl-9 pr-3 md:pr-16 h-9 text-sm bg-tasko-card border-tasko-border transition-all duration-300 focus:shadow-lg focus:shadow-tasko-primary/10"
            />
            <kbd className="hidden md:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-tasko-muted-foreground bg-tasko-muted rounded border border-tasko-border">
              ⌘F
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-tasko-secondary transition-all duration-300 hover:scale-110 h-8 w-8"
          >
            <Mail className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-tasko-secondary transition-all duration-300 hover:scale-110 h-8 w-8"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-tasko-destructive rounded-full" />
          </Button>

          <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-tasko-border">
            <Avatar className="w-7 h-7 md:w-8 md:h-8 ring-2 ring-tasko-primary/20 transition-all duration-300 hover:ring-tasko-primary/40">
              <AvatarFallback className="text-xs bg-tasko-primary text-tasko-primary-foreground">JS</AvatarFallback>
            </Avatar>
            <div className="text-xs hidden sm:block">
              <p className="font-semibold text-tasko-foreground">Jessin Sam</p>
              <p className="text-tasko-muted-foreground text-[10px]">jessin@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-tasko-foreground mb-1">{title}</h1>
        <p className="text-xs md:text-sm text-tasko-muted-foreground">{description}</p>
      </div>

      {actions && <div className="flex flex-col sm:flex-row gap-2">{actions}</div>}
    </header>
  );
}
