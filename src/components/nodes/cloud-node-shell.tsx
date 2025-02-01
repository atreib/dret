"use client";

import { Handle, Position } from "reactflow";
import { LucideIcon } from "lucide-react";

export interface CloudNodeShellProps {
  label: string;
  icon: LucideIcon;
  specs?: Record<string, string | number>;
  color?: string;
}

export function CloudNodeShell({
  label,
  icon: Icon,
  specs,
  color = "#64748b", // default slate-500 color
}: CloudNodeShellProps) {
  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-lg shadow-sm px-4 py-3 min-w-[200px]"
      style={{ border: `2px solid ${color}` }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: color }}
      />
      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
        <Icon className="h-4 w-4" style={{ color }} />
        <span>{label}</span>
      </div>
      <div className="mt-2 text-xs space-y-1 text-slate-500 dark:text-slate-400">
        {specs &&
          Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>
              <span>{value}</span>
            </div>
          ))}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: color }}
      />
    </div>
  );
}
