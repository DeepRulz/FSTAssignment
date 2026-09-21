"use client";

import { useState, useTransition } from "react";
import { sendCustomEmailAction } from "@/app/actions";
import { toast } from "sonner";
import { Mail, Send, Loader2 } from "lucide-react";

export function EmailForm() {
  const [isPending, startTransition] = useTransition();
  const [to, setTo] = useState("recipient@example.com");
  const [subject, setSubject] = useState("Order Status Update");
  const [body, setBody] = useState("Your order has been processed and shipped successfully.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await sendCustomEmailAction({ to, subject, body });
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Mail className="h-4 w-4 text-blue-500" />
          Email Template & Dispatcher
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="email-to" className="font-medium text-foreground">
            To
          </label>
          <input
            id="email-to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="w-full p-2 rounded border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email-subject" className="font-medium text-foreground">
            Subject
          </label>
          <input
            id="email-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 rounded border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email-body" className="font-medium text-foreground">
            Body
          </label>
          <textarea
            id="email-body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-full p-2 rounded border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
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
              Sending Email...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Send Email
            </>
          )}
        </button>
      </form>
    </div>
  );
}
