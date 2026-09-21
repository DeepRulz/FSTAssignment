"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/use-cart-store";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

export function CartPanel() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="h-5 bg-muted rounded animate-pulse w-1/3" />
        <div className="h-14 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <ShoppingCart className="h-4 w-4 text-purple-500" />
          Shopping Cart
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded border bg-muted/30 text-xs"
            >
              <div className="space-y-0.5">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">${item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded bg-background">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:bg-muted text-muted-foreground"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-2 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:bg-muted text-muted-foreground"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="font-bold w-12 text-right">
                  ${item.price * item.quantity}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t font-semibold text-sm">
        <span>Total:</span>
        <span className="text-primary text-base font-bold">${total}</span>
      </div>
    </div>
  );
}
