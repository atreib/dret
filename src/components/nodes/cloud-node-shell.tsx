"use client";

import { Handle, Position } from "reactflow";
import { LucideIcon } from "lucide-react";

interface CloudNodeShellProps {
  label: string;
  icon: LucideIcon;
  specs?: Record<string, string | number>;
}

export function CloudNodeShell({
  label,
  icon: Icon,
  specs,
}: CloudNodeShellProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border rounded-lg shadow-sm px-4 py-3">
      <Handle type="target" position={Position.Top} className="!bg-slate-500" />
      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <span>{label}</span>
      </div>
      {specs && Object.keys(specs).length > 0 && (
        <div className="mt-1 text-xs space-y-1 text-slate-500 dark:text-slate-400">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </div>
          ))}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-500"
      />
    </div>
  );
}
