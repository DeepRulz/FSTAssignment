import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { RoleSwitcher } from "@/components/role-switcher";
import { AdminPanel } from "@/components/admin-panel";
import { TransactionForm } from "@/components/transaction-form";
import { EmailForm } from "@/components/email-form";
import { WebhookSimulator } from "@/components/webhook-simulator";
import { Activity, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const currentRole = cookieStore.get("app-role")?.value || "Member";

  let userCount = 0;
  let transactionCount = 0;
  let auditLogCount = 0;
  let emailLogCount = 0;

  let transactions: Array<{
    id: string;
    reference: string;
    amount: number;
    status: string;
    createdAt: Date;
    user: { email: string; name: string };
  }> = [];

  let emailLogs: Array<{
    id: string;
    resendId: string;
    status: string;
    emailType: string;
    createdAt: Date;
    user: { email: string };
    transaction: { reference: string; amount: number } | null;
  }> = [];

  let auditLogs: Array<{
    id: string;
    action: string;
    details: string;
    createdAt: Date;
    user: { email: string };
  }> = [];

  try {
    userCount = await prisma.user.count();
    transactionCount = await prisma.transaction.count();
    auditLogCount = await prisma.auditLog.count();
    emailLogCount = await prisma.emailLog.count();

    transactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    emailLogs = await prisma.emailLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, transaction: true },
    });

    auditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  } catch (e: unknown) {
    console.warn("Prisma query error", e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          System Overview & Management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RoleSwitcher currentRole={currentRole} />
          <AdminPanel
            role={currentRole}
            metrics={{
              userCount,
              transactionCount,
              auditLogCount,
              emailLogCount,
            }}
          />
          <TransactionForm />
        </div>

        <div className="space-y-6">
          <EmailForm />
          <WebhookSimulator logs={emailLogs} />

          <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
            <div className="flex items-center gap-2 font-semibold text-sm border-b pb-2">
              <Activity className="h-4 w-4 text-purple-500" />
              Recent Transactions
            </div>

            {transactions.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded">
                No transactions recorded yet.
              </div>
            ) : (
              <div className="divide-y rounded border bg-background">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{tx.reference}</p>
                      <p className="text-muted-foreground text-[11px]">{tx.user.email}</p>
                    </div>
                    <span className="font-bold text-primary text-sm">${tx.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
            <div className="flex items-center gap-2 font-semibold text-sm border-b pb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Activity Log
            </div>

            {auditLogs.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded">
                No activity logs found.
              </div>
            ) : (
              <div className="divide-y rounded border bg-background">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 space-y-1 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between font-medium text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono font-semibold">
                        {log.action}
                      </span>
                      <span className="text-muted-foreground">{log.user.email}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
