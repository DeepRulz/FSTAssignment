"use client";

import { useState } from "react";
import { MousePointerClick } from "lucide-react";

export function ClientBoundaryDemo() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <MousePointerClick className="h-4 w-4 text-blue-500" />
          Click Counter
        </div>
      </div>

      <div className="p-3 rounded border bg-muted/30 flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-foreground">Total Clicks</p>
          <p className="text-xl font-bold text-primary mt-0.5">{clickCount}</p>
        </div>
        <button
          onClick={() => setClickCount((c) => c + 1)}
          className="py-1.5 px-4 bg-primary text-primary-foreground rounded text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Click Me
        </button>
      </div>
    </div>
  );
}
