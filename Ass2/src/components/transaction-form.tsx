"use client";

import { useState, useTransition } from "react";
import { createTransactionAction } from "@/app/actions";
import { toast } from "sonner";
import { CreditCard, Send, Loader2 } from "lucide-react";

export function TransactionForm() {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState<number>(49);
  const [email, setEmail] = useState<string>("user@example.com");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createTransactionAction({ amount, userEmail: email });
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
      <div className="flex items-center gap-2 font-semibold text-sm border-b pb-2">
        <CreditCard className="h-4 w-4 text-emerald-500" />
        New Transaction
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="tx-email" className="font-medium text-foreground">
            Customer Email
          </label>
          <input
            id="tx-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="tx-amount" className="font-medium text-foreground">
            Amount ($)
          </label>
          <input
            id="tx-amount"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="w-full p-2 rounded border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Submit Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
}
