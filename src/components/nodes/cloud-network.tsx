"use client";

import { Network, Lock, Unlock } from "lucide-react";
import { NodeResizer } from "@reactflow/node-resizer";
import "@reactflow/node-resizer/dist/style.css";
import { useState, useCallback } from "react";
import { useReactFlow } from "reactflow";

interface CloudNetworkNodeProps {
  id: string;
  data: {
    label: string;
    cidr?: string;
    isInteractive?: boolean;
  };
  style?: React.CSSProperties;
  selected?: boolean;
  draggable?: boolean;
}

export function CloudNetworkNode({
  id,
  data,
  style,
  selected,
}: CloudNetworkNodeProps) {
  const [isInteractive, setIsInteractive] = useState(
    data.isInteractive ?? false
  );
  const { setNodes } = useReactFlow();

  const toggleInteractive = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsInteractive(!isInteractive);

      // Update the node's draggable state
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                draggable: !isInteractive,
                selected: !isInteractive,
                data: { ...node.data, isInteractive: !isInteractive },
              }
            : node
        )
      );
    },
    [id, isInteractive, setNodes]
  );

  return (
    <>
      <NodeResizer
        isVisible={selected && isInteractive}
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
        <button
          onClick={toggleInteractive}
          className="absolute top-4 right-4 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-50 pointer-events-auto"
        >
          {isInteractive ? (
            <Unlock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          ) : (
            <Lock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          )}
        </button>
      </div>
    </>
  );
}
