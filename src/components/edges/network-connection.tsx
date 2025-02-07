"use client";

import { EdgeProps, getBezierPath } from "reactflow";

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
}: EdgeProps<NetworkConnectionData>) {
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
            <div className="bg-background text-foreground border border-border rounded px-2 py-1 text-xs whitespace-pre text-center">
              {protocolList}
            </div>
          </div>
        </foreignObject>
      )}
    </>
  );
}
