"use client";

import { Mail } from "lucide-react";

export function EmailPreviewCard() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Mail className="h-4 w-4 text-blue-500" />
          React Email Template Preview
        </div>
        <span className="text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded font-semibold">
          Resend API
        </span>
      </div>

      <div className="border rounded bg-muted/20 p-3 space-y-2 text-[11px]">
        <div className="border-b pb-1">
          <p><span className="font-semibold">From:</span> Notifications &lt;onboarding@resend.dev&gt;</p>
          <p><span className="font-semibold">Subject:</span> Transaction Confirmation - TX-DEMO123</p>
        </div>
        <div className="bg-background border rounded p-3 space-y-2">
          <p className="font-bold text-foreground">Transaction Summary</p>
          <p className="text-muted-foreground">Hello Customer,</p>
          <p className="text-muted-foreground">Your transaction has been processed successfully.</p>
          <div className="bg-muted p-2 rounded space-y-0.5">
            <p><span className="font-semibold">Reference:</span> TX-DEMO123</p>
            <p><span className="font-semibold">Amount Paid:</span> $49.00</p>
            <p><span className="font-semibold">Status:</span> Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
