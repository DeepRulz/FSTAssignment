"use client";

import { useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";

export function AdminTestButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: number; data: unknown } | null>(null);

  const testAdminRoute = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setResult({ status: res.status, data });
    } catch (e: unknown) {
      const errMessage = e instanceof Error ? e.message : "Error";
      setResult({ status: 500, data: { error: errMessage } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <ShieldAlert className="h-4 w-4 text-purple-500" />
          Protected Admin Area Check
        </div>
      </div>

      <button
        onClick={testAdminRoute}
        disabled={loading}
        className="w-full py-1.5 px-3 bg-secondary text-secondary-foreground rounded font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Test Admin Route Permissions"}
      </button>

      {result && (
        <div
          className={`p-2.5 rounded border ${
            result.status === 200
              ? "bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-300"
              : "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300"
          }`}
        >
          <p className="font-semibold">HTTP Status: {result.status}</p>
          <pre className="mt-1 font-mono text-[11px] whitespace-pre-wrap">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
