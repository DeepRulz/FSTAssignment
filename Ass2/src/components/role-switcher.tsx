"use client";

import { useTransition } from "react";
import { setRoleAction } from "@/app/actions";
import { toast } from "sonner";
import { Shield, User, Eye, Loader2 } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: string;
}

export function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (role: string) => {
    startTransition(async () => {
      const res = await setRoleAction(role);
      if (res.success) {
        toast.success(`Role switched to ${role}`);
      }
    });
  };

  const roles = [
    { name: "Admin", icon: Shield, color: "text-purple-500" },
    { name: "Member", icon: User, color: "text-blue-500" },
    { name: "Guest", icon: Eye, color: "text-amber-500" },
  ];

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Shield className="h-4 w-4 text-primary" />
          Active Account Role
        </div>
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = currentRole === r.name;
          return (
            <button
              key={r.name}
              disabled={isPending}
              onClick={() => handleRoleChange(r.name)}
              className={`p-2.5 rounded border text-left flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground border-transparent"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : r.color}`} />
              <span className="text-xs">{r.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
