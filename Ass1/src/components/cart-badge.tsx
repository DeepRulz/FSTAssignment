"use client";

import { useCartStore } from "@/store/use-cart-store";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export function CartBadge() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-card text-xs font-medium shadow-sm">
      <ShoppingBag className="h-4 w-4 text-primary" />
      <span>Cart</span>
      <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[11px] font-bold">
        {mounted ? count : 0}
      </span>
    </div>
  );
}
