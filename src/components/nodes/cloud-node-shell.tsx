"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { LucideIcon } from "lucide-react";
import { NodeSpecsDialog } from "./node-specs-dialog";

export type CloudNodeShellProps = NodeProps<{
  label: string;
}> & {
  icon: LucideIcon;
  color?: string;
};

export function CloudNodeShell({
  id,
  data: { label, ...specs },
  icon: Icon,
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
      <div className="flex items-center justify-between gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color }} />
          <span>{label}</span>
        </div>
        <NodeSpecsDialog nodeId={id} />
      </div>
      <div className="mt-2 text-xs space-y-1 text-slate-500 dark:text-slate-400">
        {specs &&
          Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>
              <span>{String(value)}</span>
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
