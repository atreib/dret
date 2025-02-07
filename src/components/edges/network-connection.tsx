"use client";

import { EdgeProps, getBezierPath, useReactFlow } from "reactflow";
import { EdgeProtocolsDialog } from "./edge-protocols-dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type NetworkConnectionData = {
  protocols: Record<string, number>;
};

export function NetworkConnectionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
  selected,
}: EdgeProps<NetworkConnectionData>) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const protocols = data?.protocols || {};
  const protocolList = Object.entries(protocols)
    .map(([protocol, port]) => `${protocol}: ${port}`)
    .join("\n");

  const handleSelect = () => {
    setEdges((edges) =>
      edges.map((edge) => ({
        ...edge,
        selected: edge.id === id,
      }))
    );
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path stroke-2"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {protocolList && (
        <foreignObject
          width={200}
          height={100}
          x={labelX - 100}
          y={labelY - 50}
          className="overflow-visible pointer-events-none"
        >
          <div className="flex items-center justify-center w-full h-full">
            <div
              className="bg-background text-foreground border border-border rounded px-2 py-1 text-xs whitespace-pre text-center cursor-pointer pointer-events-auto"
              onClick={handleSelect}
            >
              {protocolList}
            </div>
            <EdgeProtocolsDialog edgeId={id}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "ml-1 h-6 w-6 rounded-full z-10 pointer-events-auto",
                  !selected && "invisible"
                )}
              >
                <Settings className="h-3 w-3" />
              </Button>
            </EdgeProtocolsDialog>
          </div>
        </foreignObject>
      )}
    </>
  );
}
