"use client";

import { Network } from "lucide-react";
import { NodeResizer } from "@reactflow/node-resizer";
import "@reactflow/node-resizer/dist/style.css";

interface CloudNetworkNodeProps {
  data: {
    label: string;
    cidr?: string;
  };
  style?: React.CSSProperties;
  selected?: boolean;
}

export function CloudNetworkNode({
  data,
  style,
  selected,
}: CloudNetworkNodeProps) {
  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={100}
        handleStyle={{
          width: "12px",
          height: "12px",
          borderRadius: "2px",
          border: "2px solid #94a3b8",
          background: "#e2e8f0",
        }}
        lineClassName="border-slate-300"
      />
      <div
        style={{
          ...style,
          width: "100%",
          height: "100%",
        }}
        className="bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 relative min-w-[200px] min-h-[100px]"
      >
        <div className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">
          <Network className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span>{data.label}</span>
          {data.cidr && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({data.cidr})
            </span>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0" />
      </div>
    </>
  );
}
