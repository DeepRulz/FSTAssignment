"use client";

import { useTransition, useOptimistic } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemSchema, ItemInput } from "@/lib/schema";
import { addItemAction } from "@/app/actions";
import { useCartStore } from "@/store/use-cart-store";
import { toast } from "sonner";
import { Plus, Loader2, AlertCircle } from "lucide-react";

export function ItemForm() {
  const [isPending, startTransition] = useTransition();
  const addItemToStore = useCartStore((s) => s.addItem);

  const [optimisticItems, setOptimisticItems] = useOptimistic(
    [] as Array<{ id: string; name: string; price: number; pending: boolean }>,
    (state, newItem: { id: string; name: string; price: number }) => [
      ...state,
      { ...newItem, pending: true },
    ]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      price: 19,
    },
  });

  const onSubmit = (data: ItemInput) => {
    const tempId = `temp-${Date.now()}`;
    
    startTransition(async () => {
      setOptimisticItems({ id: tempId, name: data.name, price: Number(data.price) });

      try {
        const res = await addItemAction(data);

        if (res.success) {
          addItemToStore({
            id: res.data.id,
            name: res.data.name,
            price: Number(res.data.price),
          });
          toast.success(res.message || "Item added to cart");
          reset();
        } else {
          toast.error(res.message || "Failed to add item");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error submitting item";
        toast.error(message);
      }
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Plus className="h-4 w-4 text-emerald-500" />
          Add New Item
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
        <div className="space-y-1">
          <label htmlFor="name-input" className="font-medium text-foreground">
            Item Name
          </label>
          <input
            id="name-input"
            {...register("name")}
            placeholder="e.g. Wireless Headphones"
            aria-invalid={!!errors.name}
            className={`w-full p-2 rounded border bg-background text-foreground text-xs focus:outline-none focus:ring-1 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-[11px] flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" /> {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="price-input" className="font-medium text-foreground">
            Price ($)
          </label>
          <input
            id="price-input"
            type="number"
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
            className={`w-full p-2 rounded border bg-background text-foreground text-xs focus:outline-none focus:ring-1 ${
              errors.price ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"
            }`}
          />
          {errors.price && (
            <p className="text-red-500 text-[11px] flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" /> {errors.price.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Adding Item...
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </>
          )}
        </button>
      </form>

      {optimisticItems.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Pending Items
          </span>
          {optimisticItems.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded border border-amber-500/30 bg-amber-500/10 text-xs flex justify-between items-center"
            >
              <span>{item.name} (${item.price})</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono animate-pulse">
                Adding...
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
