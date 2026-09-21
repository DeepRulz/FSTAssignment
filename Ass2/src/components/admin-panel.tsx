"use client";

import { useState } from "react";
import { Shield, ShieldAlert, Lock, Users, CreditCard, Activity, Mail } from "lucide-react";

interface AdminPanelProps {
  role: string;
  metrics?: {
    userCount: number;
    transactionCount: number;
    auditLogCount: number;
    emailLogCount: number;
  };
}

export function AdminPanel({ role, metrics }: AdminPanelProps) {
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchAdminRoute = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      if (res.ok) {
        setTestResult(`Success (200): ${JSON.stringify(data.metrics)}`);
      } else {
        setTestResult(`Denied (${res.status}): ${data.error}`);
      }
    } catch {
      setTestResult("Error connecting to admin route");
    }
  };

  if (role !== "Admin") {
    return (
      <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
        <div className="flex items-center gap-2 font-semibold text-sm text-red-500 border-b pb-2">
          <Lock className="h-4 w-4" />
          Admin Section (Locked)
        </div>
        <p className="text-muted-foreground">
          You are currently signed in as <strong className="text-foreground">{role}</strong>. Role-Based Access Control (RBAC) blocks non-admin users from accessing system metrics and backend route handlers.
        </p>
        <button
          onClick={fetchAdminRoute}
          className="w-full py-1.5 px-3 bg-secondary text-secondary-foreground rounded font-medium text-xs hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Test Admin API Route Authorization
        </button>
        {testResult && (
          <div className="p-2 rounded bg-muted font-mono text-[11px] text-red-500">
            {testResult}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm text-purple-600 dark:text-purple-400">
          <Shield className="h-4 w-4" />
          Admin Management Panel
        </div>
        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-[10px]">
          ADMIN GRANTED
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded border bg-muted/30 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Users className="h-3.5 w-3.5" /> Total Users
          </div>
          <p className="text-lg font-bold">{metrics?.userCount ?? 0}</p>
        </div>

        <div className="p-2.5 rounded border bg-muted/30 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <CreditCard className="h-3.5 w-3.5" /> Transactions
          </div>
          <p className="text-lg font-bold">{metrics?.transactionCount ?? 0}</p>
        </div>

        <div className="p-2.5 rounded border bg-muted/30 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Activity className="h-3.5 w-3.5" /> Audit Logs
          </div>
          <p className="text-lg font-bold">{metrics?.auditLogCount ?? 0}</p>
        </div>

        <div className="p-2.5 rounded border bg-muted/30 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Mail className="h-3.5 w-3.5" /> Email Logs
          </div>
          <p className="text-lg font-bold">{metrics?.emailLogCount ?? 0}</p>
        </div>
      </div>

      <button
        onClick={fetchAdminRoute}
        className="w-full py-1.5 px-3 bg-purple-600 text-white rounded font-semibold text-xs hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
      >
        Verify Admin Route Access
      </button>

      {testResult && (
        <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-mono text-[11px]">
          {testResult}
        </div>
      )}
    </div>
  );
}
