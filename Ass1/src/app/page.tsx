import { Suspense } from "react";
import { ServerComponentDemo } from "@/components/server-component";
import { CartPanel } from "@/components/cart-panel";
import { ItemForm } from "@/components/item-form";
import { ItemListSkeleton } from "@/components/item-list-skeleton";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Store Dashboard</h1>
          <p className="text-xs text-muted-foreground">Manage your items and cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ItemForm />
          <Suspense fallback={<ItemListSkeleton />}>
            <ServerComponentDemo />
          </Suspense>
        </div>

        <div className="space-y-6">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}
