"use client";

import { useTransition } from "react";
import { triggerWebhookAction } from "@/app/actions";
import { toast } from "sonner";
import { Mail, CheckCircle2, XCircle, Eye, Loader2, ArrowRight } from "lucide-react";

interface EmailLogItem {
  id: string;
  resendId: string;
  status: string;
  emailType: string;
  createdAt: Date;
  user: { email: string };
  transaction: { reference: string; amount: number } | null;
}

export function WebhookSimulator({ logs }: { logs: EmailLogItem[] }) {
  const [isPending, startTransition] = useTransition();

  const handleWebhook = (
    resendId: string,
    event: "email.delivered" | "email.bounced" | "email.opened"
  ) => {
    startTransition(async () => {
      const res = await triggerWebhookAction(resendId, event);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "opened":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "bounced":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Mail className="h-4 w-4 text-blue-500" />
          Email Status & Webhook Logs
        </div>
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>

      {logs.length === 0 ? (
        <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded">
          No email logs found. Send an email or create a transaction to view logs.
        </div>
      ) : (
        <div className="divide-y rounded border bg-background">
          {logs.map((log) => (
            <div key={log.id} className="p-3 space-y-2 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{log.user.email}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {log.emailType}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    ID: {log.resendId}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                    log.status
                  )}`}
                >
                  {log.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  Trigger Webhook <ArrowRight className="h-3 w-3" />
                </span>
                <button
                  disabled={isPending}
                  onClick={() => handleWebhook(log.resendId, "email.delivered")}
                  className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1 text-[11px] transition-colors"
                >
                  <CheckCircle2 className="h-3 w-3" /> Delivered
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleWebhook(log.resendId, "email.opened")}
                  className="px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-medium flex items-center gap-1 text-[11px] transition-colors"
                >
                  <Eye className="h-3 w-3" /> Opened
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleWebhook(log.resendId, "email.bounced")}
                  className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-medium flex items-center gap-1 text-[11px] transition-colors"
                >
                  <XCircle className="h-3 w-3" /> Bounced
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
